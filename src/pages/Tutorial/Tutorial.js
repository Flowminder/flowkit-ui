// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import session from "../../components/SessionArea/sessionSlice.selectors"
import styles from "./Tutorial.module.css"
import { Start, WhereToFind, DataTerms, Ethics, Help } from "./pages"
import { SequentialMenu, FMButton } from "../../components"
import { useTranslation } from "react-i18next"
import api from "../../app/api"

const Tutorial = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const extendedUser = useSelector(session.selectExtendedUser)
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)

    const [capturedParams, setCapturedParams] = useState(undefined)
    const [signupCache, setSignupCache] = useState(undefined)
    const [completedSignupInit, setCompletedSignupInit] = useState(false)

    const [currentStage, setCurrentStage] = useState(0)
    const stages = [
        {
            name: t("tutorial.welcome"),
            element: <Start next={() => setCurrentStage(currentStage + 1)} />
        },
        { name: t("tutorial.wheredoi"), element: <WhereToFind /> },
        { name: t("tutorial.terms"), element: <DataTerms /> },
        { name: t("tutorial.ethics"), element: <Ethics /> },
        {
            name: t("tutorial.help"),
            element: <Help />,
            nextLabel: t("tutorial.final_button"),
            link: "/"
        }
    ]

    // capture parameters from callback
    useEffect(() => {
        if (capturedParams === undefined) {
            setCapturedParams(window.location)
        } else {
            const params = new URL(capturedParams).searchParams
            if (capturedParams?.search && params.get("new_user")) {
                // Decode params and compare to local storage
                // see https://auth0.com/docs/secure/attack-protection/state-parameters
                if (localStorage.getItem("app_state") === params.get("previous_state")) {
                    const retrievedCache = JSON.parse(Buffer.from(params.get("previous_state"), "base64").toString())
                    setSignupCache(retrievedCache)
                }
            }
        }
    }, [capturedParams])

    // store captured parameters in user profile
    useEffect(() => {
        if (extendedUser && signupCache && !completedSignupInit) {
            const metadata = {
                preferred_language: extendedUser?.user_metadata?.preferred_language || "en",
                show_tutorial: true,
                signup_cache: signupCache
            }
            const doIt = async (extendedUser, metadata) => {
                const result = api.updateUser(
                    dispatch,
                    { ...extendedUser, user_metadata: metadata },
                    auth0AccessToken,
                    metadata
                )
                if (result) {
                    setCompletedSignupInit(true)
                }
            }
            doIt(extendedUser, metadata)
        }
    }, [signupCache, extendedUser, completedSignupInit]) // eslint-disable-line

    return (
        <div className={styles.Tutorial} data-testid="Tutorial">
            <h1>{t("tutorial.title")}</h1>
            {currentStage > 0 && (
                <SequentialMenu items={stages} currentItem={currentStage} setCurrentItem={setCurrentStage} />
            )}
            <div className={currentStage > 0 ? styles.Content : ""}>{stages[currentStage]?.element}</div>

            {currentStage < stages.length && currentStage > 0 && (
                <div className={styles.Buttons}>
                    <FMButton
                        link={undefined}
                        label={t("register.back")}
                        primary={false}
                        outline={false}
                        inverted={true}
                        onClick={() => {
                            if (currentStage > 0) {
                                setCurrentStage(currentStage - 1)
                            }
                        }}
                        className={currentStage === 0 ? styles.inactive : ""}
                    />
                    <FMButton
                        link={stages[currentStage]?.link}
                        label={stages[currentStage]?.nextLabel || t("register.next")}
                        primary={true}
                        outline={true}
                        onClick={() => {
                            if (currentStage < stages.length - 1) {
                                setCurrentStage(currentStage + 1)
                            }
                        }}
                        className={currentStage >= stages.length ? styles.inactive : styles.LastButton}
                    />
                </div>
            )}
        </div>
    )
}

export default Tutorial

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import styles from "./Registration.module.css"
import { useTranslation } from "react-i18next"
import { Start, YourDetails, AccountSetup } from "./pages"
import { SequentialMenu, FMButton } from "../../components"
import "./Registration.scss"
import { setModal } from "../../components/SessionArea/sessionSlice"

const Registration = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [nextPageEnabled, enableNextPage] = useState(false)
    const [currentStage, setCurrentStage] = useState(0)
    const stages = [
        { name: t("register.registration"), element: <Start enableNextPage={enableNextPage} /> },
        {
            name: t("register.your_details"),
            element: (
                <YourDetails enableNextPage={enableNextPage} gotoNextPage={() => setCurrentStage(currentStage + 1)} />
            ),
            form: "YourDetails"
        },
        {
            name: t("register.account_setup"),
            element: <AccountSetup enableNextPage={enableNextPage} />,
            link: "signup",
            nextLabel: t("register.create_account")
        }
    ]

    // initialise modal. this will be shown only once upon page load.
    //useEffect(() => {
    //dispatch(
    //setModal({
    //heading: t("register.modal_heading"),
    //text: t("register.modal_text"),
    //ok: t("register.modal_button")
    //})
    //)
    //}, [])

    return (
        <div className={`${styles.Registration} Registration`} data-testid="Registration">
            <h1>{currentStage < stages.length ? stages[currentStage]?.name : t("register.registration")}</h1>
            <SequentialMenu
                items={stages}
                nextPageEnabled={nextPageEnabled}
                currentItem={currentStage}
                setCurrentItem={setCurrentStage}
            />
            <div className={styles.Content}>{stages[currentStage]?.element}</div>

            {currentStage < stages.length && (
                <div className={styles.Buttons}>
                    <FMButton
                        link={undefined}
                        label={t("register.back")}
                        primary={false}
                        outline={true}
                        inverted={false}
                        inactive={currentStage === 0}
                        onClick={() => {
                            if (currentStage > 0) {
                                setCurrentStage(currentStage - 1)
                            }
                        }}
                    />
                    <FMButton
                        link={stages[currentStage]?.link}
                        label={stages[currentStage]?.nextLabel || t("register.next")}
                        primary={true}
                        outline={false}
                        inactive={currentStage >= stages.length || nextPageEnabled !== true}
                        form={stages[currentStage]?.form}
                        onClick={() => {
                            if (currentStage < stages.length - 1 && nextPageEnabled) {
                                setCurrentStage(currentStage + 1)
                                enableNextPage(false)
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default Registration

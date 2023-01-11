// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./Profile.module.css"
import { useTranslation } from "react-i18next"
import { useAuth0 } from "@auth0/auth0-react"
import session from "../../components/SessionArea/sessionSlice.selectors"
import { setLoadingMessage, setExtendedUser } from "../../components/SessionArea/sessionSlice"
import api from "../../app/api"
import { Disconnected, FMSelect, Unverified } from "../../components"
import { setMessage } from "../../components/NotificationArea/notificationSlice"
import { FMButton } from "../../components"

const Profile = () => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const extendedUser = useSelector(session.selectExtendedUser)

    const languages = Object.keys(i18n?.store?.data)
    const allLanguages = languages.map(l => {
        return { value: l, label: l }
    })
    const currentLanguage = allLanguages.find(l => l.value === extendedUser?.user_metadata?.preferred_language) || "en"

    // Get extended user information
    useEffect(() => {
        const getUser = async () => {
            // always reload - it may have changed
            if (user?.sub !== undefined) {
                dispatch(setLoadingMessage(t("profile.loading")))
                const result = await api.getUser(user.sub, auth0AccessToken)
                dispatch(setExtendedUser(result))
                dispatch(setLoadingMessage())
            }
        }
        getUser()
    }, [user, auth0AccessToken, dispatch, t])

    const storeMetadata = event => {
        const metadata = {
            preferred_language: extendedUser?.user_metadata?.preferred_language || "en",
            show_tutorial: document.getElementById("show_tutorial").checked !== false,
            signup_cache: extendedUser?.user_metadata?.signup_cache || {}
        }

        const doIt = async (extendedUser, metadata) => {
            dispatch(setLoadingMessage(t("profile.saving")))
            const result = await api.updateUser(
                dispatch,
                { ...extendedUser, user_metadata: metadata },
                auth0AccessToken,
                metadata
            )
            dispatch(setLoadingMessage())
            if (result) {
                dispatch(setMessage(["ok", t("profile.saved")]))
            } else {
                dispatch(setMessage(["error", t("profile.not_saved")]))
            }
        }
        doIt(extendedUser, metadata)
    }

    const deleteAccount = event => {
        const deleteUser = async () => {
            if (user?.sub !== undefined) {
                const result = await api.deleteUser(user.sub, auth0AccessToken)
                if (result === true) {
                    // TODO
                    // notify team by email
                    // maybe delay logout and display a message? or send to special page?
                    // see https://auth0.com/docs/authenticate/login/logout/redirect-users-after-logout
                    logout()
                } else {
                    dispatch(setMessage(["error", t("profile.not_deleted")]))
                }
            }
        }
        deleteUser()
    }

    return (
        <div className={styles.Profile} data-testid="Profile">
            {isAuthenticated && extendedUser !== undefined && extendedUser?.email_verified === true && (
                <>
                    <h1>{t("profile.my_profile")}</h1>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.name")}</span>
                        <span className={styles.userPropertyValue}>{extendedUser?.name}</span>
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.email")}</span>
                        <span className={styles.userPropertyValue}>{extendedUser?.email}</span>
                        {extendedUser && extendedUser?.email_verified && (
                            <span className={styles.tick} title={t("profile.verified")}>
                                ✔
                            </span>
                        )}
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.signed_up")}</span>
                        <span className={styles.userPropertyValue}>{extendedUser?.created_at}</span>
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.last_updated")}</span>
                        <span className={styles.userPropertyValue}>{extendedUser?.updated_at}</span>
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.login_count")}</span>
                        <span className={styles.userPropertyValue}>{extendedUser?.logins_count}</span>
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.last_login")}</span>
                        <span className={styles.userPropertyValue}>{`${extendedUser?.last_login || "never"} from IP ${
                            extendedUser?.last_ip || "unknown"
                        }`}</span>
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.pref_lang")}</span>
                        <FMSelect
                            options={allLanguages}
                            placeholder={t("profile.select_lang")}
                            value={currentLanguage}
                            onChange={newLang => {
                                dispatch(
                                    setExtendedUser({
                                        ...extendedUser,
                                        user_metadata: {
                                            ...extendedUser.user_metadata,
                                            preferred_language: newLang.value
                                        }
                                    })
                                )
                            }}
                        />
                    </div>
                    <div className={styles.userProperty}>
                        <span className={styles.userPropertyKey}>{t("profile.show_tutorial")}</span>
                        <input
                            id="show_tutorial"
                            type="checkbox"
                            checked={extendedUser?.user_metadata?.show_tutorial !== false}
                            onChange={show_tutorial => {
                                dispatch(
                                    setExtendedUser({
                                        ...extendedUser,
                                        user_metadata: {
                                            ...extendedUser.user_metadata,
                                            show_tutorial: show_tutorial.target.checked
                                        }
                                    })
                                )
                            }}
                        />
                    </div>
                    <div className={styles.Buttons}>
                        <FMButton
                            link={undefined}
                            label={t("profile.save")}
                            primary={false}
                            outline={false}
                            onClick={() => storeMetadata()}
                        />
                        <FMButton
                            link={undefined}
                            label={t("profile.delete")}
                            primary={true}
                            outline={false}
                            onClick={() => {
                                const dialog = document.getElementById("dialog")
                                if (typeof dialog.showModal === "function") {
                                    dialog.showModal()
                                } else {
                                    dispatch(setMessage(["error", t("profile.not_deleted")]))
                                }
                            }}
                            style={{ width: "300" }}
                        />
                        <dialog id="dialog">
                            <p>{t("profile.delete_question")}</p>
                            <form method="dialog">
                                <div className={styles.Buttons}>
                                    <FMButton
                                        link={undefined}
                                        label={t("profile.delete_no")}
                                        primary={false}
                                        outline={false}
                                        onClick={() => {
                                            console.debug("Aborting profile deletion.")
                                            document.getElementById("dialog").close()
                                        }}
                                    />
                                    <FMButton
                                        link={undefined}
                                        label={t("profile.delete_yes")}
                                        primary={true}
                                        outline={false}
                                        onClick={() => {
                                            console.debug("Deleting account")
                                            document.getElementById("dialog").close()
                                            deleteAccount()
                                        }}
                                    />
                                </div>
                            </form>
                        </dialog>
                    </div>
                </>
            )}
            {!isAuthenticated && (
                <>
                    <h2>{t("profile.title")}</h2>
                    <p>
                        {t("profile.login_prompt1")}
                        <span className="link" onClick={() => loginWithRedirect()}>
                            {t("profile.login_prompt2")}
                        </span>{" "}
                        {t("profile.login_prompt3")}
                    </p>
                </>
            )}
            {isAuthenticated && extendedUser && extendedUser.email_verified !== true && <Unverified />}
            {isAuthenticated && !extendedUser && <Disconnected />}
        </div>
    )
}

export default Profile

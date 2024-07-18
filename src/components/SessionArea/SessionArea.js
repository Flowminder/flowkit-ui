// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { Fragment } from "react"
import styles from "./SessionArea.module.css"
import { useTranslation } from "react-i18next"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import img_tutorial from "./img/tutorial.svg"
import img_arrow from "./img/right-arrow.svg"
import img_user from "./img/user.png"

const SessionArea = () => {
    const { t } = useTranslation()
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

    return (
        <div className={styles.SessionArea} data-testid="SessionArea">
            {isAuthenticated && (
                <Fragment>
                    <div className={styles.Account}>
                        <div className={styles.User}>
                            <img src={img_user} alt="👤" />
                            <Link to={`/profile`}>
                                <div>
                                    <span>{user.name}</span>
                                    <span>{t("menu.account_settings")}</span>
                                </div>
                            </Link>
                        </div>
                        <div className={styles.Menu}>
                            <Link to={`/tutorial`}>
                                <span>
                                    <img className={styles.button} src={img_tutorial} alt={t("menu.tutorial")} />
                                    {t("menu.tutorial")}
                                </span>
                            </Link>
                            <span onClick={() => logout({ returnTo: `${window.location.origin}/logged-out` })}>
                                <img className={styles.button} src={img_arrow} alt={t("menu.logout")} />
                                {t("menu.logout")}
                            </span>
                        </div>
                    </div>
                </Fragment>
            )}
            {!isAuthenticated && (
                <>
                    <button className={styles.login} onClick={() => loginWithRedirect()}>
                        {t("menu.login")}
                    </button>
                    <button
                        className={styles.login}
                        onClick={() =>
                            loginWithRedirect({
                                screen_hint: "signup",
                                redirectUri: `${window.location.origin.toString()}/tutorial?new_user=true`
                            })
                        }
                    >
                        {t("menu.register")}
                    </button>
                </>
            )}
        </div>
    )
}

export default SessionArea

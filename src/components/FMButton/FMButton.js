// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./FMButton.module.css"
import { Link } from "react-router-dom"
import Button from "react-bootstrap/Button"
import { useAuth0 } from "@auth0/auth0-react"
import { useSelector } from "react-redux"
import session from "../SessionArea/sessionSlice.selectors"
import env from "../../app/env"

const FMButton = ({
    link,
    label = env.REACT_APP_NAME,
    primary = true,
    outline = false,
    inverted = false,
    form = undefined,
    onClick = undefined,
    inactive = false,
    openInNewTab = false,
    className
}) => {
    const isLogin = link === "login"
    const isSignup = link === "signup"
    const isLink = !["login", "signup"].includes(link)
    const buttonType = form ? "submit" : "button"

    const { loginWithRedirect } = useAuth0()

    const signupCache = useSelector(session.selectSignupCache)

    const isExternal = link?.startsWith("http")

    return (
        <div
            className={`${styles.FMButton} ${primary ? styles.primary : styles.secondary}${
                outline ? ` ${styles.outline}` : ""
            }${inverted ? ` ${styles.inverted}` : ""}${inactive ? ` ${styles.inactive}` : ""}${
                className ? ` ${className}` : ""
            }`}
            data-testid="FMButton"
        >
            {isLink && link !== undefined && (isExternal || openInNewTab) && (
                <a href={link} target="_blank" rel="noreferrer">
                    <Button type={buttonType} form={form}>
                        {label}
                    </Button>
                </a>
            )}
            {isLink && link !== undefined && !(isExternal || openInNewTab) && (
                <Link to={`${!link?.startsWith("/") && isExternal ? "/" : ""}${link}`}>
                    <Button type={buttonType} form={form}>
                        {label}
                    </Button>
                </Link>
            )}
            {isLink && link === undefined && (
                <Button type={buttonType} form={form} onClick={form ? () => {} : onClick}>
                    {label}
                </Button>
            )}
            {isLogin && (
                <Button type={buttonType} form={form} className={styles.LogIn} onClick={() => loginWithRedirect()}>
                    {label}
                </Button>
            )}
            {isSignup && (
                <Button
                    type={buttonType}
                    form={form}
                    className={styles.LogIn}
                    onClick={() => {
                        // use current app state (signup cache) to verify the signup
                        // see https://auth0.com/docs/secure/attack-protection/state-parameters
                        const current_app_state = Buffer.from(JSON.stringify(signupCache)).toString("base64")
                        localStorage.setItem("app_state", current_app_state)
                        loginWithRedirect({
                            screen_hint: "signup",
                            redirectUri: `${window.location.origin.toString()}/tutorial?new_user=true&previous_state=${current_app_state}`,
                            login_hint: signupCache.email
                            // The API docs say this is how you pass in the registration details so we can store the info
                            // once signup is complete. It does however not work so we're passing it in as a get parameter in the redirect URI.
                            // it's not ideal and should probably be changed in the future.
                            // app_state: current_app_state
                        })
                    }}
                >
                    {label}
                </Button>
            )}
        </div>
    )
}

export default FMButton

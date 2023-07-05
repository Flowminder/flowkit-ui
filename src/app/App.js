// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import "./branding.scss"
import "./App.scss"
import { useTranslation } from "react-i18next"
import React, { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Banner, NotificationArea, MainContent, Footer, ScrollToTop } from "../components"
import LoadingOverlay from "react-loading-overlay"
import {
    setAuth0IdToken,
    setAuth0AccessToken,
    setLoadingMessage,
    setDataProviders,
    setHeartbeat
} from "../components/SessionArea/sessionSlice"
import session from "../components/SessionArea/sessionSlice.selectors"
import { setMessage } from "../components/NotificationArea/notificationSlice"
import { useAuth0 } from "@auth0/auth0-react"
import { BrowserRouter } from "react-router-dom"
import api from "./api"
import img_sticker from "./img/sticker.png"

// workaround for error message, see https://github.com/derrickpelletier/react-loading-overlay/pull/57#issuecomment-1054194254
LoadingOverlay.propTypes = undefined

function App() {
    const { t } = useTranslation()

    const initialised = useRef(false)
    const initialisedTokens = useRef(false)

    const loadingMessage = useSelector(session.selectLoadingMessage)
    const dispatch = useDispatch()
    const { logout, error, isAuthenticated, getIdTokenClaims, getAccessTokenSilently } = useAuth0()
    const auth0IdToken = useSelector(session.selectAuth0IdToken)

    // get initial data from backend
    useEffect(() => {
        // new React 18 behaviour for useEffect hooks, see https://www.youtube.com/watch?v=HPoC-k7Rxwo
        if (initialised.current) {
            return
        }
        const getBackendResources = async () => {
            // get heartbeat as proof we're connected to the backend
            const heartbeat = await api.getHeartbeat()
            dispatch(setHeartbeat(heartbeat))
            // make sure the data providers are retrieved for the entire application and cached in the store
            const dataProviders = await api.getDataProviders()
            dispatch(setDataProviders(dataProviders))
        }
        getBackendResources()
        initialised.current = true
    }, [])

    // Obtain Auth0 tokens for the current user if we haven't got them yet
    useEffect(() => {
        if (error) {
            dispatch(setMessage(["error", t("auth.no_connection")]))
        }
        if (isAuthenticated && auth0IdToken === undefined) {
            if (initialisedTokens.current) {
                return
            }
            const getTokens = async () => {
                dispatch(setLoadingMessage(t("auth.loading_tokens")))
                try {
                    const idToken = await getIdTokenClaims()
                    dispatch(setAuth0IdToken(idToken.__raw))

                    const accessToken = await getAccessTokenSilently({
                        // no need to narrow scopes - just go with what we can get as defined in the Auth0Provider
                        // and limited by the user's permissions and roles
                        //scope: "read:current_user update:current_user_metadata delete:current_user read:free_data read:premium_data",
                        ignoreCache: true,
                        cacheMode: "off"
                    })
                    // No need to decode access token here - if the refresh token has expired
                    // there won't be an access token in the first place (see catch).
                    dispatch(setAuth0AccessToken(accessToken))
                } catch (e) {
                    console.error(`Could not refresh access token: ${e.message}`)
                    dispatch(setAuth0AccessToken(undefined))
                    logout({ returnTo: `${window.location.origin}/session-expired` })
                }
                dispatch(setLoadingMessage())
                initialisedTokens.current = true
            }
            getTokens()
        }
    }, [error, isAuthenticated, auth0IdToken])

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="App">
                <Banner />
                <LoadingOverlay
                    spinner
                    active={loadingMessage !== undefined}
                    text={loadingMessage}
                    styles={{
                        spinner: base => ({
                            ...base,
                            "& svg circle": {
                                stroke: "var(--tertiary)",
                                strokeWidth: "7px"
                            }
                        }),
                        overlay: base => ({
                            ...base,
                            background: "rgba(0, 0, 0, 0.85)",
                            "z-index": "998"
                        }),
                        content: base => ({
                            ...base,
                            fontWeight: "bold",
                            fontSize: "24px",
                            color: "var(--white)"
                        })
                    }}
                >
                    <div id="mainContainer">
                        <img id="Sticker" src={img_sticker} width={100} height={100} alt="Demo Version" />
                        <NotificationArea />
                        <MainContent />
                    </div>
                    <Footer />
                </LoadingOverlay>
            </div>
        </BrowserRouter>
    )
}

export default App

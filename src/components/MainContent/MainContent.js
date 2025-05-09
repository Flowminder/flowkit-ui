// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./MainContent.module.css"
import session from "../SessionArea/sessionSlice.selectors"
import { setLoadingMessage, setExtendedUser, setModal } from "../SessionArea/sessionSlice"
import api from "../../app/api"
import env from "../../app/env"
import { useTranslation } from "react-i18next"
import { useAuth0 } from "@auth0/auth0-react"
import {
    About,
    Contact,
    Dashboard,
    Explore,
    Intro,
    Privacy,
    SubscriberPrivacy,
    Profile,
    Registration,
    Terms,
    Tutorial,
    LoggedOut
} from "../../pages/index"
import { Sidebar, FMButton } from "../"
import { Routes, Route, UNSAFE_NavigationContext, useLocation } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import ReactGA from "react-ga4"

const MainContent = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useAuth0()
    const dataProviders = useSelector(session.selectDataProviders) || []
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const extendedUser = useSelector(session.selectExtendedUser)
    const showTutorialInsteadOfDashboard = isAuthenticated && extendedUser?.user_metadata?.show_tutorial === true
    const modal = useSelector(session.selectModal)
    const location = useLocation()
    useEffect(() => {
        if (env.GA_ID !== "") {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: location.pathname })
        }
    }, [location])

    const useBackListener = callback => {
        const navigator = useContext(UNSAFE_NavigationContext).navigator

        useEffect(() => {
            const listener = ({ location, action }) => {
                if (action === "POP") {
                    callback({ location, action })
                }
            }

            const unlisten = navigator.listen(listener)
            return unlisten
        }, [callback, navigator])
    }

    useBackListener(({ location }) => {
        // Clearing modal in case the back button was hit.
        // This is necessary because the dashboard modal is otherwise still displayed when navigating away instead of dismissing it.
        dispatch(setModal())
    })

    // Get extended user information
    useEffect(() => {
        if (extendedUser === undefined && user?.sub !== undefined && auth0AccessToken !== undefined) {
            const getUser = async () => {
                dispatch(setLoadingMessage(t("profile.loading")))
                const result = await api.getUser(user.sub, auth0AccessToken)
                dispatch(setExtendedUser(result))
                dispatch(setLoadingMessage())
            }
            getUser()
        }
    }, [extendedUser, user, auth0AccessToken, dispatch, t])

    return (
        <>
            <Modal
                show={modal !== undefined}
                onHide={() => dispatch(setModal())}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div class="modal-inner">
                    <Modal.Header>
                        <Modal.Title>{modal?.heading}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modal?.text}</Modal.Body>
                    <Modal.Footer>
                        <div style={{ flex: 1 }}></div>
                        <FMButton
                            link={undefined}
                            label={modal?.ok || ""}
                            onClick={() => {
                                dispatch(setModal())
                                if (modal?.onSuccess) {
                                    modal?.onSuccess()
                                }
                            }}
                        />
                        {modal?.cancel && (
                            <FMButton
                                primary={false}
                                outline={true}
                                link={undefined}
                                label={modal?.cancel || ""}
                                onClick={() => {
                                    dispatch(setModal())
                                    if (modal?.onCancel) {
                                        modal?.onCancel()
                                    }
                                }}
                            />
                        )}
                        <div style={{ flex: 1 }}></div>
                    </Modal.Footer>
                </div>
            </Modal>
            <Routes>
                <Route exact path="/dashboard" element={<Sidebar />} />
            </Routes>
            <div className={styles.MainContent} data-testid="MainContent">
                <Routes>
                    {/* Publicly accessible pages */}
                    <Route exact path="/" element={<Intro />} />
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                {!showTutorialInsteadOfDashboard && <Dashboard />}
                                {showTutorialInsteadOfDashboard && <Tutorial />}
                            </>
                        }
                    />
                    <Route path={`/logged-out`} element={<LoggedOut reason="logout" />} />
                    <Route path={`/session-expired`} element={<LoggedOut reason="expired" />} />
                    <Route path={`/intro`} element={<Intro />} />
                    <Route path={`/about`} element={<About />} />
                    <Route path={`/contact`} element={<Contact />} />
                    <Route path={`/explore`} element={<Explore />} />
                    <Route path={`/privacy`} element={<Privacy />} />
                    <Route path={`/subscriber-privacy`} element={<SubscriberPrivacy />} />
                    <Route path={`/register`} element={<Registration />} />
                    <Route path={`/terms`} element={<Terms />} />
                    <Route path={`/tutorial`} element={<Tutorial />} />
                    {dataProviders.map((dataProvider, i) => {
                        return (
                            <Route
                                path={`/about/${dataProvider.name.toLowerCase().replace(" ", "-")}`}
                                key={i}
                                element={<About subject={dataProvider} />}
                            />
                        )
                    })}
                    {/* Only accessible after login */}
                    <Route path={`/profile`} element={<Profile />} />
                </Routes>
            </div>
        </>
    )
}

export default MainContent

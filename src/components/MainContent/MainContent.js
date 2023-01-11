// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./MainContent.module.css"
import session from "../SessionArea/sessionSlice.selectors"
import { setLoadingMessage, setExtendedUser, setModal } from "../SessionArea/sessionSlice"
import api from "../../app/api"
import { useTranslation } from "react-i18next"
import { useAuth0 } from "@auth0/auth0-react"
import {
    About,
    Contact,
    Dashboard,
    Explore,
    Intro,
    Pricing,
    Privacy,
    SubscriberPrivacy,
    Profile,
    Registration,
    Terms,
    Tutorial,
    LoggedOut
} from "../../pages/index"
import { Sidebar, FMButton } from "../"
import { Routes, Route } from "react-router-dom"
import Modal from "react-bootstrap/Modal"

const MainContent = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { user, isAuthenticated } = useAuth0()
    const dataProviders = useSelector(session.selectDataProviders) || []
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const extendedUser = useSelector(session.selectExtendedUser)
    const showAllComponents = isAuthenticated && extendedUser?.user_metadata?.show_tutorial !== true
    const modal = useSelector(session.selectModal)

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
            </Modal>
            <Routes>
                <Route exact path="/" element={showAllComponents && <Sidebar />} />
            </Routes>
            <div className={styles.MainContent} data-testid="MainContent">
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <>
                                {!isAuthenticated && <Intro />}
                                {showAllComponents && <Dashboard />}
                                {isAuthenticated && extendedUser?.user_metadata?.show_tutorial === true && <Tutorial />}
                            </>
                        }
                    />
                    {/* Publicly accessible pages */}
                    <Route path={`/logged-out`} element={<LoggedOut reason="logout" />} />
                    <Route path={`/session-expired`} element={<LoggedOut reason="expired" />} />
                    <Route path={`/intro`} element={<Intro />} />
                    <Route path={`/about`} element={<About />} />
                    <Route path={`/contact`} element={<Contact />} />
                    <Route path={`/explore`} element={<Explore />} />
                    <Route path={`/pricing`} element={<Pricing />} />
                    <Route path={`/privacy`} element={<Privacy />} />
                    <Route path={`/subscriber-privacy`} element={<SubscriberPrivacy />} />
                    <Route path={`/register`} element={<Registration />} />
                    <Route path={`/terms`} element={<Terms />} />
                    {/* Only accessible after login */}
                    <Route path={`/profile`} element={<Profile />} />
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
                </Routes>
            </div>
        </>
    )
}

export default MainContent

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState } from "react"
import styles from "./Privacy.module.css"
import "./Privacy.scss"
import Accordion from "react-bootstrap/Accordion"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import { useTranslation } from "react-i18next"
import img_help from "./img/help.svg"
import { FMTrans } from "../../components"

const Privacy = () => {
    const { t } = useTranslation()

    const [view, setView] = useState("simple")

    return (
        <div className={`${styles.Privacy} Privacy`} data-testid="Privacy">
            <h1>{t("privacy.title")}</h1>

            <h2>
                <FMTrans k="privacy.text1" />
            </h2>
            <p>
                <FMTrans k="privacy.text2" />
            </p>

            <Tabs id="privacy" activeKey={view} onSelect={key => setView(key)}>
                <Tab eventKey="simple" title={t("privacy.simple")}>
                    <p>
                        <FMTrans k="privacy.simple_intro1" />
                    </p>
                    <p>
                        <FMTrans k="privacy.simple_intro2" />
                    </p>
                    <ul>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                            <li>
                                <FMTrans k={`privacy.data${num}`} />
                                {t(`privacy.data${num}_hint`) && (
                                    <img
                                        className={styles.Hint}
                                        src={img_help}
                                        alt="?"
                                        title={t(`privacy.data${num}_hint`)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                    <Accordion className={styles.Accordion} activeKey={undefined} alwaysOpen={false}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <FMTrans k="privacy.example_regular" />
                            </Accordion.Header>
                            <Accordion.Body>
                                <pre>
                                    {JSON.stringify(
                                        {
                                            created_at: "2022-02-22T16:52:02.014Z",
                                            email: "user@example.com",
                                            email_verified: true,
                                            identities: [
                                                {
                                                    connection: "Username-Password-Authentication",
                                                    provider: "auth0",
                                                    user_id: "121613b1d45e560070214f7c",
                                                    isSocial: false
                                                }
                                            ],
                                            name: "bob@example.com",
                                            nickname: "bob",
                                            picture: "https://i1.wp.com/cdn.auth0.com/avatars/b.png?ssl=1",
                                            updated_at: "2022-02-25T11:50:17.467Z",
                                            user_id: "auth0|121613b1d45e560070214f7c",
                                            user_metadata: {
                                                preferred_language: "en",
                                                show_tutorial: true,
                                                signup_cache: {
                                                    first_name: "Robert",
                                                    last_name: "Smith",
                                                    email: "bob@example.com",
                                                    org: "NonProfitOrg",
                                                    address: "1 Street, 12345 Exampleton, EXAMPLE COUNTRY",
                                                    job_title: "Data Analyst",
                                                    purpose: "Data exploration for healthcare facility planning",
                                                    terms: true,
                                                    no_harm: true,
                                                    privacy: true,
                                                    marketing: false
                                                }
                                            },
                                            app_metadata: {
                                                authorization: {
                                                    roles: ["Free"]
                                                }
                                            },
                                            last_ip: "127.0.0.1",
                                            last_login: "2022-02-25T11:50:15.253Z",
                                            logins_count: 2,
                                            blocked_for: [],
                                            guardian_authenticators: []
                                        },
                                        null,
                                        4
                                    )}
                                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <p>
                        <FMTrans k="privacy.sso_text" />
                    </p>
                    <ul>
                        {[13, 14].map(num => (
                            <li>
                                <FMTrans k={`privacy.data${num}`} />
                                {t(`privacy.data${num}_hint`) && (
                                    <img
                                        className={styles.Hint}
                                        src={img_help}
                                        alt="?"
                                        title={t(`privacy.data${num}_hint`)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                    <Accordion className={styles.Accordion} activeKey={undefined} alwaysOpen={false}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <FMTrans k="privacy.example_sso" />
                            </Accordion.Header>
                            <Accordion.Body>
                                <pre>
                                    {JSON.stringify(
                                        {
                                            created_at: "2021-09-14T15:56:44.012Z",
                                            email: "emma.evans.opal@gmail.com",
                                            email_verified: true,
                                            family_name: "Evans",
                                            given_name: "Emma",
                                            identities: [
                                                {
                                                    provider: "google-oauth2",
                                                    user_id: "108017464038959101432",
                                                    connection: "google-oauth2",
                                                    isSocial: true
                                                }
                                            ],
                                            locale: "fr",
                                            name: "Emma Evans",
                                            nickname: "emma.evans.opal",
                                            picture:
                                                "https://lh3.googleusercontent.com/a-/AOh14GhJYgf-OtyL_yaezY1pongjhG0mIX29397A5Plb=s96-c",
                                            updated_at: "2021-11-22T16:27:37.951Z",
                                            user_id: "google-oauth2|108017464038959101432",
                                            user_metadata: {
                                                preferred_language: "en",
                                                show_tutorial: true,
                                                signup_cache: {
                                                    first_name: "Robert",
                                                    last_name: "Smith",
                                                    email: "bob@example.com",
                                                    org: "NonProfitOrg",
                                                    address: "1 Street, 12345 Exampleton, EXAMPLE COUNTRY",
                                                    job_title: "Data Analyst",
                                                    purpose: "Data exploration for healthcare facility planning",
                                                    terms: true,
                                                    no_harm: true,
                                                    privacy: true,
                                                    marketing: false
                                                }
                                            },
                                            app_metadata: {
                                                authorization: {
                                                    roles: ["Free"]
                                                }
                                            },
                                            last_ip: "127.0.0.1",
                                            last_login: "2021-11-22T16:27:35.944Z",
                                            logins_count: 2,
                                            blocked_for: [],
                                            guardian_authenticators: []
                                        },
                                        null,
                                        4
                                    )}
                                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <p>
                        <FMTrans k="privacy.end_text" />
                    </p>
                </Tab>
                <Tab eventKey="legal" title={t("privacy.legal")}>
                    <h2>
                        <FMTrans k="privacy.legal_header" />
                    </h2>
                    <p className={styles.DownloadLink}>
                        <a href={t("privacy.download_url")} rel="noreferrer" target="_blank">
                            {t("privacy.download")}
                        </a>
                    </p>
                    <br />
                    <object data={t("privacy.download_url")} class="border rounded w-100" height="600px" />
                </Tab>
            </Tabs>
        </div>
    )
}

export default Privacy

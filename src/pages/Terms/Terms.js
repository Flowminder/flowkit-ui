// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState } from "react"
import styles from "./Terms.module.css"
import "./Terms.scss"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../components"

const Terms = () => {
    const { t } = useTranslation()

    const [view, setView] = useState("simple")

    return (
        <div className={`${styles.Terms} Terms`} data-testid="Terms">
            <h1>{t("terms.title")}</h1>

            <p>
                <FMTrans k="terms.text1" />
            </p>
            <p>
                <FMTrans k="terms.text2" />
            </p>

            <Tabs id="terms" activeKey={view} onSelect={key => setView(key)}>
                <Tab eventKey="simple" title={t("terms.simple")}>
                    <h2>
                        <FMTrans k="terms.simple_header" />
                    </h2>
                    <div>
                        <FMTrans k="terms.simple_intro2" />
                    </div>
                    <div>
                        <FMTrans k="terms.simple_intro3" />
                    </div>
                </Tab>
                <Tab eventKey="legal" title={t("terms.legal")}>
                    <h2>
                        <FMTrans k="terms.legal_header" />
                    </h2>
                    <p className={styles.DownloadLink}>
                        <a href={t("terms.download_url")} rel="noreferrer" target="_blank">
                            {t("terms.download")}
                        </a>
                    </p>
                    <br />
                    <object data={t("terms.download_url")} class="border rounded w-100" height="600px" />
                </Tab>
            </Tabs>
        </div>
    )
}

export default Terms

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import { useSelector } from "react-redux"
import styles from "./Footer.module.css"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import session from "../SessionArea/sessionSlice.selectors"
import img_fm from "./img/fmlogo.png"
import img_afd from "./img/afd.svg"
import img_hewlett from "./img/hewlett.svg"
import { FMTrans } from "../"

const Footer = () => {
    const { t } = useTranslation()

    const dataProviders = useSelector(session.selectDataProviders) || []

    return (
        <div className={styles.Footer} data-testid="Footer">
            <div className={styles.Logos}>
                <p>{t("footer.presented_by")}</p>
                <p>
                    <a href="https://flowminder.org" target="_blank" rel="noreferrer">
                        <img src={img_fm} className={styles.FlowminderLogo} alt={"Flowminder.org"} />
                    </a>
                    {dataProviders.map((dataProvider, i) => {
                        return (
                            <a href={dataProvider.url} key={i} target="_blank" rel="noreferrer">
                                <img
                                    src={dataProvider.logo}
                                    className={styles.DataProviderLogo}
                                    alt={dataProvider.name}
                                />
                            </a>
                        )
                    })}
                </p>
                <p>
                    {t("footer.funded_by")}
                    <br />
                    <a href="https://www.afd.fr" target="_blank" rel="noreferrer">
                        <img src={img_afd} className={styles.DonorLogo} alt={"afd.fr"} />
                    </a>
                    <a href="https://hewlett.org/" target="_blank" rel="noreferrer">
                        <img src={img_hewlett} className={styles.DonorLogo} alt={"hewlett.org"} />
                    </a>
                </p>
                <FMTrans k="footer.flowgeek" />
            </div>
            <div className={styles.Links}>
                <Link to="/about">{t("about.title")}</Link>
                <Link to="/contact">{t("contact.title")}</Link>
                <Link to="/privacy">{t("privacy.title")}</Link>
                <Link to="/subscriber-privacy">{t("sub_privacy.title")}</Link>
                <Link to="/terms">{t("terms.title")}</Link>
            </div>
            <div className={styles.Text}>
                <h3>{t("footer.heading")}</h3>
                <div>
                    <FMTrans k="footer.paragraph" />
                </div>
            </div>
        </div>
    )
}

export default Footer

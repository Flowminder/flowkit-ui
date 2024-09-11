// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./Banner.module.css"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import session from "../SessionArea/sessionSlice.selectors"
import SessionArea from "../SessionArea/SessionArea"
import { setModal } from "../SessionArea/sessionSlice"
import img_fm from "./img/fmlogo.png"
import img_arrow from "./img/arrow.svg"
import env from "../../app/env"

const Banner = () => {
    const { t, i18n } = useTranslation()
    const languages = (i18n?.store?.data ? Object.keys(i18n?.store?.data) : undefined) || []
    const location = useLocation()

    const dataProviders = useSelector(session.selectDataProviders) || []
    const dispatch = useDispatch()

    // If modal is up, dismiss modal
    useEffect(() => {
        console.debug("location: ", location)
        if (location?.pathname !== "/dashboard") {
            dispatch(setModal(undefined))
        }
    }, [location])

    return (
        <div className={styles.Banner} data-testid="Banner">
            <div className={styles.BannerLeft}>
                <Link to="/">
                    <img src={img_fm} className={styles.FlowminderLogo} alt={"Flowminder.org"} />
                    {dataProviders.map((dataProvider, i) => (
                        <img
                            key={dataProvider.name}
                            src={dataProvider.logo}
                            className={styles.DataProviderLogo}
                            alt={dataProvider.name}
                        />
                    ))}
                    <span className={styles.PortalName}>{env.REACT_APP_NAME}</span>
                </Link>
            </div>
            <div className={styles.BannerRight}>
                <SessionArea />
                <div className={styles.BannerLink}>
                    <Link to="/about">{t("menu.about")}</Link>
                    <img src={img_arrow} className={styles.Arrow} alt={"v"} />
                    <ul className={styles.Dropdown}>
                        <li>
                            <Link to="/about">{t("menu.about_platform")}</Link>
                        </li>
                        <li>
                            <Link to={t("menu.indicator_about_pdf_url")} rel="noreferrer" target="_blank">
                                {`${t("menu.about_indicators")} [pdf]`}
                            </Link>
                        </li>
                        <li>
                            <Link to={t("menu.indicator_quality_xlsx_url")} rel="noreferrer" target="_blank">
                                {`${t("menu.data_quality_status")} [excel]`}
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms">{t("terms.title")}</Link>
                        </li>
                        <li>
                            <Link to="/privacy">{t("privacy.title")}</Link>
                        </li>
                        <li>
                            <Link to="/subscriber-privacy">{t("sub_privacy.title")}</Link>
                        </li>
                    </ul>
                </div>
                <Link className={styles.BannerLink} to="/pricing">
                    {t("menu.pricing")}
                </Link>
                <Link className={styles.BannerLink} to="/explore">
                    {t("menu.explore")}
                </Link>
                <Link className={styles.BannerLink} to="/dashboard">
                    {t("menu.dashboard")}
                </Link>
                <div className={styles.LanguageButtons}>
                    {languages.map(l => {
                        i18n.loadLanguages(l)
                        const fixedT = i18next.getFixedT(l)
                        return (
                            <button key={l} title={fixedT("language.tooltip")} onClick={() => i18n.changeLanguage(l)}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/img/${fixedT("language.flag")}.svg`}
                                    alt={fixedT("language.flag")}
                                />
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Banner

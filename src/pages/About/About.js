// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./About.module.css"
import mainStyles from "../../components/MainContent/MainContent.module.css"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FMButton, FMTrans } from "../../components"
import img_houses from "./img/AdobeStock_281017898.jpeg"
import img_explore from "./img/AdobeStock_446468716.jpeg"
import img_tutorial from "./img/AdobeStock_383328673.jpeg"
import img_support from "./img/AdobeStock_446468837.jpeg"
import img_fm from "./img/fm-logo.svg"
import { useSelector } from "react-redux"
import session from "../../components/SessionArea/sessionSlice.selectors"

const About = ({ subject }) => {
    const { t } = useTranslation()

    const dataProviders = useSelector(session.selectDataProviders)

    return (
        <div className={styles.About} data-testid="About">
            {subject && (
                <h1>
                    {t("about.title")} {subject?.name}
                </h1>
            )}
            {!subject && (
                <>
                    <h1>{t("about.title")}</h1>

                    <Container>
                        <Row>
                            <Col xs lg="4">
                                <h2>
                                    <FMTrans k="about.heading1" />
                                </h2>
                            </Col>
                            <Col xs lg="1"></Col>
                            <Col xs lg="5" className={mainStyles.noPadding}>
                                <div>
                                    <p>
                                        <FMTrans k="about.text1" />
                                    </p>
                                </div>
                            </Col>
                            <Col xs lg="2"></Col>
                        </Row>
                    </Container>
                    <br />
                    <br />
                    <Container>
                        <Row>
                            <Col>
                                <div className={`${styles.box} ${mainStyles.primary} ${mainStyles.opaque}`}>
                                    <Link to="/explore">
                                        <img src={img_explore} width={300} height={225} alt="" />
                                        <span>{t("about.explore")}</span>
                                    </Link>
                                </div>
                            </Col>
                            <Col>
                                <div className={`${styles.box} ${mainStyles.secondary} ${mainStyles.opaque}`}>
                                    <Link to="/tutorial">
                                        <img src={img_tutorial} width={300} height={225} alt="" />
                                        <span>{t("about.tutorial")}</span>
                                    </Link>
                                </div>
                            </Col>
                            <Col>
                                <div className={`${styles.box} ${mainStyles.tertiary} ${mainStyles.opaque}`}>
                                    <Link to="/">
                                        <img src={img_support} width={300} height={225} alt="" />
                                        <span>{t("about.support")}</span>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <br />
                    <br />
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs lg="10">
                                <h2>{t("about.heading2")}</h2>
                                <p>
                                    <FMTrans k="about.text2" />
                                </p>
                                <br />
                                <h2>{t("about.heading3")}</h2>
                                <p>
                                    <FMTrans k="about.text3" />
                                </p>
                            </Col>
                        </Row>
                    </Container>
                    <br />
                    <br />
                    <Container>
                        <Row>
                            <Col>
                                <div className={styles.partnerBox}>
                                    {t("about.partner1")}
                                    <img
                                        alt="Flowminder.org"
                                        className={styles.DataProviderLogo}
                                        src={img_fm}
                                        height="50"
                                    />
                                    <br />
                                    <FMButton link="https://flowminder.org" label={t("about.visit_website")} />
                                </div>
                            </Col>
                            {dataProviders?.map(dp => {
                                return (
                                    <Col key={dp?.name}>
                                        <div className={styles.partnerBox}>
                                            {dp?.name}
                                            <img alt={dp?.name} className={styles.DataProviderLogo} src={dp?.logo} />
                                            <br />
                                            <FMButton link={dp?.url} label={t("about.visit_website")} />
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Container>
                    <br />
                    <br />
                    <Container>
                        <Row>
                            <Col xs lg="6">
                                <h2>{t("about.heading4")}</h2>
                                <p>
                                    <FMTrans k="about.text4" />
                                </p>
                                <br />
                                <FMButton
                                    link={t("about.ethics_url")}
                                    openInNewTab={true}
                                    label={t("about.ethics_label")}
                                ></FMButton>
                            </Col>
                            <Col xs lg="1"></Col>
                            <Col>
                                <img src={img_houses} width={400} height={300} alt="" />
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </div>
    )
}

export default About

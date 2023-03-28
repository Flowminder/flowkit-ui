// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./Intro.module.css"
import mainStyles from "../../components/MainContent/MainContent.module.css"
import { useTranslation } from "react-i18next"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import img_bg from "../../components/MainContent/img/AdobeStock_297359062.jpeg"
import { FMButton, FMTrans } from "../../components"

const Intro = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Intro} data-testid="Intro">
            <h1 className={mainStyles.withSubheading}>{t("intro.main_heading")}</h1>
            <div className={mainStyles.Subheading}>
                <FMTrans k="intro.sub_heading" />
            </div>

            <Container className={`${mainStyles.fullWidth} ${mainStyles.firstItem}`}>
                <Row>
                    <Col
                        xs={4}
                        className={`${mainStyles.primary} ${mainStyles.noPadding}`}
                        style={{ padding: "50px 0 0!important" }}
                    >
                        <br />
                        <h2>
                            <FMTrans k="intro.heading1" />
                        </h2>
                        <div className={mainStyles.opaque}>
                            <FMTrans k="intro.text1" style={{ margin: "20px" }} />
                        </div>
                        <div className={styles.buttons}>
                            <FMButton link="/register" label={t("intro.signup")} primary={false} outline={false} />
                            <FMButton link="login" label={t("intro.login")} primary={true} outline={true} />
                        </div>
                    </Col>
                    <Col className={mainStyles.noPadding}>
                        <div
                            className={styles.videoContainer}
                            style={{
                                backgroundImage: `url(${img_bg})`
                            }}
                        >
                            <div
                                style={{
                                    padding: "60px 0 30px"
                                }}
                            >
                                <br />
                                <iframe
                                    src={t("explore.video_url")}
                                    frameBorder="0"
                                    // these vendor-specific props need to have their values passed as string
                                    webkitallowfullscreen="true"
                                    mozallowfullscreen="true"
                                    allowFullScreen={true}
                                    title="video"
                                    width="640"
                                    height="350"
                                    style={{
                                        border: "5px solid var(--black)",
                                        borderRadius: "10px",
                                        display: "block",
                                        margin: "0 auto",
                                        background: "var(--black)"
                                    }}
                                />
                            </div>
                            <br />
                            <br />
                            <div className={styles.buttons}>
                                <FMButton link="/explore" label={t("intro.explore")} primary={true} outline={false} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container>
                <Row>
                    <Col xs lg="4">
                        <h2>
                            <FMTrans k="intro.heading2" />
                        </h2>
                    </Col>
                    <Col xs lg="1"></Col>
                    <Col xs lg="5" className={mainStyles.noPadding}>
                        <div>
                            <FMTrans k="intro.text2" />
                        </div>
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Intro

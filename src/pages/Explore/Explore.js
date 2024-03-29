// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import "./Explore.scss"
import styles from "./Explore.module.css"
import mainStyles from "../../components/MainContent/MainContent.module.css"
import { useTranslation } from "react-i18next"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import img_houses from "./img/AdobeStock_112270797.jpeg"
import { FMButton, FMTrans } from "../../components"
import { useAuth0 } from "@auth0/auth0-react"

const Explore = () => {
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth0()

    return (
        <div className={`Explore ${styles.Explore}`} data-testid="Explore">
            <h1>Explore</h1>

            <Container className={styles.NoMargin}>
                <Row className="justify-content-md-center">
                    <Col xs lg="5">
                        <h2>
                            <FMTrans k="explore.heading1" />
                        </h2>
                    </Col>
                    <Col xs lg="1"></Col>
                    <Col xs lg="6" className={mainStyles.noPadding}>
                        <div>
                            <p>
                                <FMTrans k="explore.text1" />
                            </p>
                            <br />
                            <br />
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className={`${mainStyles.fullWidth} ${mainStyles.primary} ${styles.StartExploring}`}>
                <Row className="justify-content-md-center">
                    <Col
                        xs
                        lg="12"
                        style={{
                            margin: "30px 0 20px"
                        }}
                    >
                        <h2
                            style={{
                                textAlign: "center"
                            }}
                        >
                            <FMTrans k="explore.heading2" />
                        </h2>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <FMButton
                            className={styles.CenteredButton}
                            link={"/dashboard"}
                            label={t("explore.access_dashboard")}
                            primary={false}
                            outline={false}
                        />
                    </Col>
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: "0 0 30px",
                            padding: 0
                        }}
                    >
                        <FMButton
                            className={styles.CenteredButton}
                            link={"/tutorial"}
                            label={t("explore.access_tutorial")}
                            primary={true}
                            outline={true}
                        />
                    </Col>
                </Row>
            </Container>
            <br />

            <Container className={mainStyles.fullWidth}>
                <Row className="justify-content-md-center">
                    <Col className={mainStyles.secondary}>
                        <div
                            style={{
                                padding: "30px 0 30px"
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
                            <br />
                        </div>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container className={styles.NoMargin}>
                <Row>
                    <Col xs lg="6">
                        <h2>
                            <FMTrans k="explore.heading3" />
                        </h2>
                        <p>
                            <FMTrans k="explore.text3" />
                        </p>
                    </Col>
                    <Col xs lg="1"></Col>
                    <Col xs lg="5">
                        <br />
                        <br />
                        <br />
                        <img src={img_houses} width={400} height={300} alt="" />
                    </Col>
                </Row>
                <Row className="">
                    <Col xs lg="1"></Col>
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <FMButton link={"/dashboard"} label={t("explore.access_data")} primary={true} outline={false} />
                    </Col>
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: "0 0 30px",
                            padding: 0
                        }}
                    >
                        <FMButton
                            link={"/tutorial"}
                            label={t("explore.access_tutorial")}
                            primary={false}
                            outline={true}
                            inverted={false}
                        />
                    </Col>
                    <Col xs lg="1"></Col>
                </Row>
            </Container>

            <Container className={`${mainStyles.fullWidth} ${mainStyles.tertiary} ${styles.TutorialBanner}`}>
                <Row className="justify-content-md-center">
                    <Col xs lg="12">
                        <h2
                            style={{
                                fontSize: "30px",
                                padding: "10px 0 0 50px"
                            }}
                        >
                            <FMTrans k="tutorial.title" />
                        </h2>
                    </Col>
                </Row>
            </Container>

            <Container className={`${styles.TutorialContent} ${styles.NoMargin}`}>
                <Row>
                    <Col xs lg="12">
                        <br />
                        <h3>
                            <FMTrans k="explore.heading4" />
                        </h3>
                        <p>
                            <FMTrans k="explore.text4" />
                        </p>
                        <br />
                    </Col>
                </Row>
                <Row className="">
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <FMButton
                            link={"/tutorial"}
                            label={t("explore.access_tutorial")}
                            primary={true}
                            outline={false}
                        />
                    </Col>
                    <Col
                        xs
                        lg="2"
                        style={{
                            margin: 0,
                            padding: 0
                        }}
                    >
                        {!isAuthenticated && (
                            <FMButton
                                link={"/register"}
                                label={t("explore.create_account")}
                                primary={false}
                                outline={true}
                                inverted={false}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Explore

import React from "react"
import styles from "./Dashboard.module.css"
import tutorialStyles from "../../Tutorial.module.css"
import mainStyles from "../../../../components/MainContent/MainContent.module.css"
import { Container, Row, Col, Accordion } from "react-bootstrap"
import img_dashboard from "./img/dashboard.jpg"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const Dashboard = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Dashboard} data-testid="Dashboard">
            <br />
            <Container>
                <Row>
                    <Col xs lg="6">
                        <h2 id="dashboard_heading1">
                            <FMTrans k="tutorial.dashboard_heading0" />
                        </h2>
                        <p>
                            <FMTrans k="tutorial.dashboard_text0" />
                        </p>
                    </Col>
                    <Col xs lg="2"></Col>
                    <Col xs lg="4">
                        <div className={styles.VerificationBox}>
                            <Accordion className="AccountSetup" defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <FMTrans k="tutorial.dashboard_heading_box" />
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <FMTrans k="tutorial.dashboard_text_box" />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Col>
                </Row>
            </Container>
            <br />

            <Container className={`${mainStyles.fullWidth} ${mainStyles.pageNav}`}>
                <Row>
                    <Col xs lg="8">
                        <h2>{t("tutorial.sections_links")}</h2>
                        <ul>
                            <li>
                                <a href="#dashboard_heading1">{t("tutorial.dashboard_heading1")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading2">{t("tutorial.dashboard_heading3")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading3">{t("tutorial.dashboard_heading3")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading4">{t("tutorial.dashboard_heading4")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading5">{t("tutorial.dashboard_heading5")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading6">{t("tutorial.dashboard_heading6")}</a>
                            </li>
                        </ul>
                    </Col>
                    <Col xs lg="4" style={{ display: "flex", flexDirection: "column" }}>
                        <img src={img_dashboard} width="400px" alt="" style={{ flex: "1" }} />
                    </Col>
                </Row>
            </Container>
            <br />

            <h2 id="dashboard_heading1">
                <FMTrans k="tutorial.dashboard_heading1" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text1" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
            </div>
            <br />

            <h2 id="dashboard_heading2">
                <FMTrans k="tutorial.dashboard_heading2" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text2" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
            </div>
            <br />

            <h2 id="dashboard_heading3">
                <FMTrans k="tutorial.dashboard_heading3" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text3" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
                <div></div>
            </div>
            <br />

            <h2 id="dashboard_heading4">
                <FMTrans k="tutorial.dashboard_heading4" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text4" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
            </div>
            <br />

            <h2 id="dashboard_heading5">
                <FMTrans k="tutorial.dashboard_heading5" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text5" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
            </div>
            <br />

            <h2 id="dashboard_heading6">
                <FMTrans k="tutorial.dashboard_heading6" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text6" />
            </p>
        </div>
    )
}

export default Dashboard

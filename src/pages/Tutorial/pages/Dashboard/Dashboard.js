import React from "react"
import styles from "./Dashboard.module.css"
import tutorialStyles from "../../Tutorial.module.css"
import mainStyles from "../../../../components/MainContent/MainContent.module.css"
import { Container, Row, Col, Accordion, Image } from "react-bootstrap"
import img_dashboard from "./img/dashboard.jpg"
import img_access_1 from "./img/accessing_the_dashboard_1.png"
import img_access_2 from "./img/accessing_the_dashboard_2.png"
import img_param_choice_1 from "./img/choosing_the_parameters_1.png"
import img_param_choice_2 from "./img/choosing_the_parameters_2.png"
import img_param_choice_3 from "./img/choosing_the_parameters_3.png"
import img_select_1 from "./img/selecting_the_indicators_1.png"
import img_select_2 from "./img/selecting_the_indicators_2.png"
import img_understanding_1 from "./img/understanding_the_indicators_1.png"
import img_understanding_2 from "./img/understanding_the_indicators_2.png"
import img_understanding_3 from "./img/understanding_the_indicators_3.png"
import img_visualising_1 from "./img/visualising_the_data_1.png"

import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const Dashboard = () => {
    const { t } = useTranslation()

    return (
        <Container className={styles.Dashboard} data-testid="Dashboard">
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
                        <Container className={styles.VerificationBox}>
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
                        </Container>
                    </Col>
                </Row>
            </Container>
            <br />

            <Container className={`${mainStyles.fullWidth} ${mainStyles.pageNav}`}>
                <Row>
                    <Col xs>
                        <h2>{t("tutorial.sections_links")}</h2>
                        <ul>
                            <li>
                                <a href="#dashboard_heading1">{t("tutorial.dashboard_heading1")}</a>
                            </li>
                            <li>
                                <a href="#dashboard_heading2">{t("tutorial.dashboard_heading2")}</a>
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
                    <Col xs>
                        <Image src={img_dashboard} width="600px" alt="" />
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
            <Container className={tutorialStyles.Pictures}>
                <Row>
                    <Col>
                        <img src={img_access_1} alt="" />
                    </Col>
                    <Col>
                        <img src={img_access_2} alt="" />
                    </Col>
                </Row>
            </Container>

            <br />

            <h2 id="dashboard_heading2">
                <FMTrans k="tutorial.dashboard_heading2" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text2" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <Container className={tutorialStyles.Pictures}>
                    <Row>
                        <Col>
                            <img src={img_select_1} alt="" />
                        </Col>
                        <Col>
                            <img src={img_select_2} alt="" />
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <h2 id="dashboard_heading3">
                <FMTrans k="tutorial.dashboard_heading3" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text3" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <Container className={tutorialStyles.Pictures}>
                    <Row>
                        <Col>
                            <img src={img_param_choice_1} alt="" />
                        </Col>
                        <Col>
                            <img src={img_param_choice_2} alt="" />
                        </Col>
                        <Col>
                            <img src={img_param_choice_3} alt="" />
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <h2 id="dashboard_heading4">
                <FMTrans k="tutorial.dashboard_heading4" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text4" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <Container className={tutorialStyles.Pictures}>
                    <Row>
                        <Col>
                            <img src={img_understanding_1} alt="" />
                        </Col>
                        <Col>
                            <img src={img_understanding_2} alt="" />
                        </Col>
                        <Col>
                            <img src={img_understanding_3} alt="" />
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <h2 id="dashboard_heading5">
                <FMTrans k="tutorial.dashboard_heading5" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text5" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <Container>
                    <Row>
                        <Col>
                            <img src={img_visualising_1} alt="" />
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <h2 id="dashboard_heading6">
                <FMTrans k="tutorial.dashboard_heading6" />
            </h2>
            <p>
                <FMTrans k="tutorial.dashboard_text6" />
            </p>
        </Container>
    )
}

export default Dashboard

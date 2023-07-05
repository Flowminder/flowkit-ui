// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import "./Pricing.scss"
import styles from "./Pricing.module.css"
import mainStyles from "../../components/MainContent/MainContent.module.css"
import { useTranslation } from "react-i18next"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FMButton, FMTrans } from "../../components"
import Table from "react-bootstrap/Table"
import tick_yellow from "./img/tick-yellow.png"
import tick_turquoise from "./img/tick-turquoise.png"

const Pricing = () => {
    const { t } = useTranslation()

    return (
        <div className={`Pricing ${styles.Pricing}`} data-testid="Pricing">
            <h1>{t("pricing.title")}</h1>

            <Container>
                <Row>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.heading1" />
                        </h2>
                        <p>
                            <FMTrans k="pricing.text1" />
                        </p>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container>
                <Row>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.heading_table" />
                        </h2>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th
                                        className={`${styles.tableHeader} ${mainStyles.secondary} ${mainStyles.opaque}`}
                                    >
                                        <h2>
                                            <FMTrans k="pricing.heading_free" />
                                        </h2>
                                        <p>
                                            <FMTrans k="pricing.text_free" />
                                        </p>
                                        <FMButton
                                            className={styles.Button}
                                            link="/register"
                                            label={t("pricing.get_started")}
                                            primary={true}
                                            outline={false}
                                            inverted={false}
                                        />
                                    </th>
                                    <th className={`${styles.tableHeader} ${mainStyles.tertiary} ${mainStyles.opaque}`}>
                                        <h2>
                                            <FMTrans k="pricing.heading_pro" />
                                        </h2>
                                        <p>
                                            <FMTrans k="pricing.text_pro" />
                                        </p>
                                        <FMButton
                                            className={styles.Button}
                                            link="/register"
                                            label={t("pricing.get_started")}
                                            primary={true}
                                            outline={false}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3>
                                            <FMTrans k="pricing.functionality_header" />
                                        </h3>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.functionality_1" />
                                        </span>
                                    </td>
                                    <td>
                                        <img src={tick_yellow} alt="✅" />
                                    </td>
                                    <td>
                                        <img src={tick_turquoise} alt="✅" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.functionality_2" />
                                        </span>
                                    </td>
                                    <td>
                                        <img src={tick_yellow} alt="✅" />
                                    </td>
                                    <td>
                                        <img src={tick_turquoise} alt="✅" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.functionality_3" />
                                        </span>
                                    </td>
                                    <td>
                                        <img src={tick_yellow} alt="✅" />
                                    </td>
                                    <td>
                                        <img src={tick_turquoise} alt="✅" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3>
                                            <FMTrans k="pricing.data_header" />
                                        </h3>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.data_1" />
                                        </span>
                                    </td>
                                    <td>
                                        <img src={tick_yellow} alt="✅" />
                                    </td>
                                    <td>
                                        <img src={tick_turquoise} alt="✅" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.data_2" />
                                        </span>
                                    </td>
                                    <td>
                                        <FMTrans k="pricing.data_2_free_timespan" />
                                    </td>
                                    <td>
                                        <FMTrans k="pricing.data_2_premium_timespan" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <FMTrans k="pricing.data_4" />
                                        </span>
                                    </td>
                                    <td>
                                        <FMTrans k="pricing.available_resolution" />
                                    </td>
                                    <td>
                                        <FMTrans k="pricing.available_resolution" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td className={`${mainStyles.secondary} ${mainStyles.opaque}`}></td>
                                    <td className={`${mainStyles.tertiary} ${mainStyles.opaque}`}></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={1}>
                        <FMButton link="/register" label={t("pricing.button3")} primary={true} outline={false} />
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container>
                <Row>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.faq" />
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.faq_heading1" />
                        </h2>
                        <p>
                            <FMTrans k="pricing.faq_text1" />
                        </p>
                    </Col>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.faq_heading2" />
                        </h2>
                        <p>
                            <FMTrans k="pricing.faq_text2" />
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.faq_heading3" />
                        </h2>
                        <p>
                            <FMTrans k="pricing.faq_text3" />
                        </p>
                    </Col>
                    <Col>
                        <h2>
                            <FMTrans k="pricing.faq_heading4" />
                        </h2>
                        <p>
                            <FMTrans k="pricing.faq_text4" />
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Pricing

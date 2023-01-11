import React from "react"
import styles from "./AccountSetup.module.css"
import "./AccountSetup.scss"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"
import { Container, Row, Col, Accordion } from "react-bootstrap"

const AccountSetup = ({ enableNextPage = enabled => {} }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.AccountSetup} data-testid="AccountSetup">
            <h2>{t("register.one_more_step")}</h2>

            <Container>
                <Row>
                    <Col>
                        <FMTrans k="register.text14" />
                    </Col>
                    <Col>
                        <div className={styles.VerificationBox}>
                            <Accordion className="AccountSetup" defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <FMTrans k="register.text15" />
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <FMTrans k="register.text16" />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AccountSetup

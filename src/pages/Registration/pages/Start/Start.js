import React from "react"
import styles from "./Start.module.css"
import { useTranslation } from "react-i18next"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FMTrans } from "../../../../components"

const Start = ({ enableNextPage = enabled => {} }) => {
    const { t } = useTranslation()

    enableNextPage(true)

    return (
        <div className={styles.Start} data-testid="Start">
            <h1>
                <FMTrans k="register.heading" />
            </h1>

            <p>
                <strong>{t("register.text01")}</strong> {t("register.text02")}
            </p>
            <br />
            <Container>
                <Row>
                    <Col>
                        <FMTrans k="register.text03" />
                    </Col>
                    <Col>
                        <h2>
                            <FMTrans k="register.text04" />
                        </h2>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Start

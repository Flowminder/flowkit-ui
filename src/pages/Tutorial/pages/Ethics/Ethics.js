import React from "react"
import styles from "./Ethics.module.css"
import mainStyles from "../../../../components/MainContent/MainContent.module.css"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const Ethics = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Ethics} data-testid="Ethics">
            <Container className={`${mainStyles.fullWidth} ${mainStyles.pageNav}`}>
                <Row>
                    <Col>
                        <h2>{t("tutorial.sections_links")}</h2>
                        <ul>
                            <li>
                                <a href="#ethics_heading1">{t("tutorial.ethics_heading1")}</a>
                            </li>
                            <li>
                                <a href="#ethics_heading2">{t("tutorial.ethics_heading2")}</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <br />

            <h2 id="ethics_heading1">
                <FMTrans k="tutorial.ethics_heading1" />
            </h2>
            <p>
                <FMTrans k="tutorial.ethics_text1" />
            </p>
            <br />
            <h2 id="ethics_heading2">
                <FMTrans k="tutorial.ethics_heading2" />
            </h2>
            <p>
                <FMTrans k="tutorial.ethics_text2" />
            </p>
        </div>
    )
}

export default Ethics

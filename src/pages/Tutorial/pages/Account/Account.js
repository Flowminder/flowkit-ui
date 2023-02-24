import React from "react"
import styles from "./Account.module.css"
import tutorialStyles from "../../Tutorial.module.css"
import mainStyles from "../../../../components/MainContent/MainContent.module.css"
import { Container, Row, Col } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const Account = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Account} data-testid="Account">
            <Container className={`${mainStyles.fullWidth} ${mainStyles.pageNav}`}>
                <Row>
                    <Col>
                        <h2>{t("tutorial.sections_links")}</h2>
                        <ul>
                            <li>
                                <a href="#account_heading1">{t("tutorial.account_heading1")}</a>
                            </li>
                            <li>
                                <a href="#account_heading2">{t("tutorial.account_heading2")}</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <br />

            <h2 id="account_heading1">
                <FMTrans k="tutorial.account_heading1" />
            </h2>
            <p>
                <FMTrans k="tutorial.account_text1" />
            </p>
            <div className={tutorialStyles.Pictures}>
                <div></div>
                <div></div>
            </div>
            <br />
            <h2 id="account_heading2">
                <FMTrans k="tutorial.account_heading2" />
            </h2>
            <p>
                <FMTrans k="tutorial.account_text2" />
            </p>
        </div>
    )
}

export default Account

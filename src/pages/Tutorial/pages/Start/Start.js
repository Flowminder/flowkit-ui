import React from "react"
import styles from "./Start.module.css"
import mainStyles from "../../../../components/MainContent/MainContent.module.css"
import { useTranslation } from "react-i18next"
import { FMButton, FMTrans } from "../../../../components"
import { Container, Row, Col } from "react-bootstrap"
import { setLoadingMessage, setExtendedUser } from "../../../../components/SessionArea/sessionSlice"
import api from "../../../../app/api"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import session from "../../../../components/SessionArea/sessionSlice.selectors"
import img_dashboard from "../../img/dashboard.jpg"

const Start = ({ next }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const extendedUser = useSelector(session.selectExtendedUser)

    const storeMetadata = event => {
        if (extendedUser) {
            const doIt = async () => {
                dispatch(setLoadingMessage(t("profile.saving")))
                const newMetadata = { ...extendedUser.user_metadata, show_tutorial: false }
                const updatedUser = await api.updateUser(dispatch, extendedUser, auth0AccessToken, newMetadata)
                if (updatedUser === true) {
                    dispatch(setExtendedUser({ ...extendedUser, user_metadata: newMetadata }))
                }
                dispatch(setLoadingMessage())
            }
            doIt()
        }
    }

    return (
        <div className={styles.Start} data-testid="Start">
            <Container>
                <Row>
                    <Col xs lg="2"></Col>
                    <Col xs lg="8">
                        <h2>{t("tutorial.welcome_heading")}</h2>
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
                <Row>
                    <Col xs lg="2"></Col>
                    <Col xs lg="3">
                        <div>
                            <FMTrans k="tutorial.welcome1" />
                        </div>
                        <br />
                        <div>
                            <FMTrans k="tutorial.welcome2" />
                        </div>
                    </Col>
                    <Col xs lg="1"></Col>
                    <Col xs lg="4">
                        <img src={img_dashboard} width={400} height={220} alt="" />
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
            </Container>
            <br />
            <br />

            <Container className={mainStyles.fullWidth}>
                <Row className={mainStyles.primary}>
                    <Col>
                        <h2 style={{ textAlign: "center" }}>{t("tutorial.welcome_banner")}</h2>
                        <div className={styles.Buttons}>
                            <FMButton
                                link={undefined}
                                label={t("tutorial.button_yes")}
                                primary={false}
                                inverted={false}
                                onClick={next !== undefined ? next : () => {}}
                            />
                            <FMButton
                                link={undefined}
                                label={t("tutorial.button_no")}
                                outline={true}
                                onClick={() => {
                                    storeMetadata()
                                    navigate("/dashboard")
                                }}
                                className={styles.ExploreButton}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
            <br />

            <Container>
                <Row>
                    <Col xs lg="2"></Col>
                    <Col xs lg="8">
                        <h2>{t("tutorial.welcome_bullets")}</h2>
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
                <Row>
                    <Col xs lg="2"></Col>
                    <Col xs lg="3">
                        <FMTrans k="tutorial.welcome_bullet1" />
                        <FMTrans k="tutorial.welcome_bullet2" />
                    </Col>
                    <Col xs lg="1"></Col>
                    <Col xs lg="4">
                        <FMTrans k="tutorial.welcome_bullet3" />
                        <FMTrans k="tutorial.welcome_bullet4" />
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
                <Row>
                    <Col>
                        <br />
                        <div className={styles.Buttons}>
                            <FMButton
                                link={undefined}
                                label={t("tutorial.button_yes2")}
                                primary={false}
                                inverted={false}
                                outline={true}
                                onClick={next !== undefined ? next : () => {}}
                            />
                            <FMButton
                                link={undefined}
                                label={t("tutorial.button_no2")}
                                primary={false}
                                outline={true}
                                inverted={true}
                                onClick={() => {
                                    storeMetadata()
                                    navigate("/")
                                }}
                                className={styles.ExploreButton}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Start

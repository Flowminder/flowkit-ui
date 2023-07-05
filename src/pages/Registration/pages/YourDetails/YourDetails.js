import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./YourDetails.module.css"
import "./YourDetails.scss"
import { useTranslation } from "react-i18next"
import session from "../../../../components/SessionArea/sessionSlice.selectors"
import { setSignupCache, setModal } from "../../../../components/SessionArea/sessionSlice"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FMTrans } from "../../../../components"

const YourDetails = ({ enableNextPage = enabled => {}, gotoNextPage }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const signupCache = useSelector(session.selectSignupCache)

    const [initialLoad, setInitialLoad] = useState(true)
    const [validated, setValidated] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = event => {
        if (!initialLoad) {
            setValidated(true)
            const form = event.currentTarget
            const isValid = form.checkValidity()
            setSubmitted(Boolean(isValid))
            if (isValid) {
                gotoNextPage()
            }
        }
        event.preventDefault()
        event.stopPropagation()
        setInitialLoad(false)
    }

    useEffect(() => {
        enableNextPage(true)
    }, [submitted]) // eslint-disable-line

    return (
        <div className={`${styles.YourDetails} YourDetails`} data-testid="YourDetails">
            <FMTrans k="register.text05" />

            <Form noValidate validated={validated} onSubmit={handleSubmit} id="YourDetails">
                <h2>{t("register.about_yourself")}</h2>

                <Row>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="first_name">
                            <Form.Label>{t("register.first_name")}*</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.first_name}
                                    onChange={e => dispatch(setSignupCache(["first_name", e.target.value]))}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t("register.first_name_error")}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="last_name">
                            <Form.Label>{t("register.last_name")}*</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.last_name}
                                    onChange={e => dispatch(setSignupCache(["last_name", e.target.value]))}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t("register.last_name_error")}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="email">
                            <Form.Label>{t("register.email")}*</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.email}
                                    onChange={e => dispatch(setSignupCache(["email", e.target.value]))}
                                />
                                <Form.Control.Feedback type="invalid">{t("register.email")}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="job_title">
                            <Form.Label>{t("register.job_title")}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.job_title}
                                    onChange={e => dispatch(setSignupCache(["job_title", e.target.value]))}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <h2>{t("register.org_heading")}</h2>

                <Row>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="org">
                            <Form.Label>{t("register.org_name")}*</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.org}
                                    onChange={e => dispatch(setSignupCache(["org", e.target.value]))}
                                />
                                <Form.Control.Feedback type="invalid">{t("register.org_error")}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={styles.FormGroup} controlId="industry">
                            <Form.Label>{t("register.industry")}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    readOnly={submitted}
                                    type="text"
                                    value={signupCache.industry}
                                    onChange={e => dispatch(setSignupCache(["industry", e.target.value]))}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className={styles.FormGroup} controlId="address">
                    <Form.Label>{t("register.org_address")}*</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            required
                            readOnly={submitted}
                            type="text"
                            value={signupCache.address}
                            onChange={e => dispatch(setSignupCache(["address", e.target.value]))}
                        />
                        <Form.Control.Feedback type="invalid">{t("register.org_address_error")}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <h2>{t("register.plan")}</h2>

                <Form.Group className={styles.FormGroup} controlId="plan">
                    <Form.Label>{t("register.plan_text")}*</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Select
                            required
                            readOnly={submitted}
                            rows={1}
                            value={signupCache.plan}
                            onChange={e => dispatch(setSignupCache(["plan", e.target.value]))}
                        >
                            <option value="free">{t("register.plan_free")}</option>
                            <option value="premium">{t("register.plan_premium")}</option>
                        </Form.Select>
                    </InputGroup>
                    <FMTrans k="register.premium_plan_text" />
                </Form.Group>

                <h2>{t("register.purpose")}</h2>

                <Form.Group className={styles.FormGroup} controlId="purpose">
                    <Form.Label>{t("register.purpose_text")}*</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            required
                            readOnly={submitted}
                            as="textarea"
                            rows={3}
                            placeholder={t("register.purpose_example")}
                            value={signupCache.purpose}
                            onChange={e => dispatch(setSignupCache(["purpose", e.target.value]))}
                        />
                        <Form.Control.Feedback type="invalid">{t("register.purpose_error")}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <h2>{t("register.terms_consent")}</h2>

                <Form.Group className={styles.FormGroup}>
                    <Form.Check>
                        <Form.Check.Input
                            required
                            type="checkbox"
                            readOnly={submitted}
                            checked={signupCache.terms === true}
                            onChange={e => {
                                dispatch(setSignupCache(["terms", Boolean(e.target.checked)]))
                                if (e.target.checked) {
                                    dispatch(
                                        setModal({
                                            heading: t("register.terms_popup_heading"),
                                            text: <FMTrans k="register.terms_popup_content" />,
                                            ok: t("register.terms_popup_ok"),
                                            cancel: t("register.terms_popup_cancel"),
                                            onCancel: () => dispatch(setSignupCache(["terms", false]))
                                        })
                                    )
                                }
                            }}
                        />
                        <Form.Check.Label>
                            <FMTrans k="register.terms" />*
                        </Form.Check.Label>
                        <Form.Control.Feedback type="invalid">{t("register.terms_error")}</Form.Control.Feedback>
                    </Form.Check>
                </Form.Group>

                <Form.Group className={styles.FormGroup}>
                    <Form.Check>
                        <Form.Check.Input
                            required
                            type="checkbox"
                            readOnly={submitted}
                            checked={signupCache.no_harm === true}
                            onChange={e => dispatch(setSignupCache(["no_harm", Boolean(e.target.checked)]))}
                        />
                        <Form.Check.Label>{t("register.no_harm")}*</Form.Check.Label>
                        <Form.Control.Feedback type="invalid">{t("register.no_harm_error")}</Form.Control.Feedback>
                    </Form.Check>
                </Form.Group>

                <Form.Group className={styles.FormGroup}>
                    <Form.Check>
                        <Form.Check.Input
                            required
                            type="checkbox"
                            readOnly={submitted}
                            checked={signupCache.privacy === true}
                            onChange={e => {
                                dispatch(setSignupCache(["privacy", Boolean(e.target.checked)]))
                                // commenting out the privacy modal until we've made a decision
                                /*if (e.target.checked) {
                                    dispatch(
                                        setModal({
                                            heading: t("register.privacy_popup_heading"),
                                            text: <FMTrans k="register.privacy_popup_content" />,
                                            ok: t("register.privacy_popup_ok"),
                                            cancel: t("register.privacy_popup_cancel"),
                                            onCancel: () => dispatch(setSignupCache(["privacy", false]))
                                        })
                                    )
                                }*/
                            }}
                        />
                        <Form.Check.Label>
                            <FMTrans k="register.privacy" />*
                        </Form.Check.Label>
                        <Form.Control.Feedback type="invalid">{t("register.privacy_error")}</Form.Control.Feedback>
                    </Form.Check>
                </Form.Group>

                <Form.Group className={styles.FormGroup}>
                    <Form.Check>
                        <Form.Check.Input
                            type="checkbox"
                            readOnly={submitted}
                            checked={signupCache.marketing === true}
                            onChange={e => dispatch(setSignupCache(["marketing", Boolean(e.target.checked)]))}
                        />
                        <Form.Check.Label>
                            <FMTrans k="register.marketing" />
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Form>
        </div>
    )
}

export default YourDetails

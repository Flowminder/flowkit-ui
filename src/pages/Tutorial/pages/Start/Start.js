import React from "react"
import styles from "./Start.module.css"
import { useTranslation } from "react-i18next"
import { FMButton, FMTrans } from "../../../../components"
import { setLoadingMessage, setExtendedUser } from "../../../../components/SessionArea/sessionSlice"
import api from "../../../../app/api"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import session from "../../../../components/SessionArea/sessionSlice.selectors"

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
            <h2>{t("tutorial.welcome_heading")}</h2>

            <div className={styles.Text}>
                <div>
                    <FMTrans k="tutorial.welcome_left" />
                </div>
                <div>
                    <FMTrans k="tutorial.welcome_right" />
                </div>
            </div>

            <h2>
                <FMTrans k="tutorial.welcome_end" />
            </h2>
            <div className={styles.Buttons}>
                <FMButton
                    link={undefined}
                    label={t("tutorial.button_no")}
                    primary={false}
                    inverted={true}
                    onClick={() => {
                        storeMetadata()
                        navigate("/")
                    }}
                    className={styles.ExploreButton}
                />
                <FMButton
                    link={undefined}
                    label={t("tutorial.button_yes")}
                    onClick={next !== undefined ? next : () => {}}
                />
            </div>
        </div>
    )
}

export default Start

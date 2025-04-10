import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import api from "../../app/api"
import session from "../SessionArea/sessionSlice.selectors"
import FMButton from "../FMButton/FMButton"

const DQSLink = () => {
    const { t } = useTranslation()
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const { isAuthenticated } = useAuth0()

    const downloadDQS = async () => {
        console.log("Fetching signed link....")
        const dqs_link = await api.dqs(auth0AccessToken)
        console.log(`Got signed link: ${dqs_link.url}`)
        const element = document.createElement("a")
        element.href = dqs_link.url
        element.download = dqs_link.file_name
        element.click()
        element.remove()
    }

    if (isAuthenticated) {
        return (
            <Link to="." onClick={() => downloadDQS()}>
                {t("menu.data_quality_status")} [excel]
            </Link>
        )
    }
    return
}

export default DQSLink

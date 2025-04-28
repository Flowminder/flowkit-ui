// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom"
import api from "../../app/api"
import session from "../SessionArea/sessionSlice.selectors"

const DQSLink = () => {
    const { t } = useTranslation()
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const { isAuthenticated } = useAuth0()

    const downloadDQS = async () => {
        console.log("Fetching signed link....")
        const dqs_link = await api.dqs(auth0AccessToken)
        if (dqs_link) {
            console.log(`Got signed link: ${dqs_link.url}`)
            const element = document.createElement("a")
            element.href = dqs_link.url
            element.download = dqs_link.file_name
            element.click()
            element.remove()
        } else {
            console.error("DQS download error, please contact admin")
            alert(t("menu.dqs_error_message"))
        }
    }

    if (isAuthenticated) {
        return (
            <Link to="#" onClick={() => downloadDQS()}>
                {t("menu.data_quality_status")} [excel]
            </Link>
        )
    }
    return
}

export default DQSLink

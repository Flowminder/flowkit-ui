import i18next from "i18next"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../../app/api"

const formatting_options = {
    year: "numeric",
    month: "short"
}

const LatestDate = () => {
    const { t, i18n } = useTranslation()

    const [latestDate, setLatestDate] = useState(undefined)

    useEffect(() => {
        const loadData = async () => {
            let response = await api.latestDate()
            try {
                if (response) {
                    var latest_date = new Date(response)
                    setLatestDate(latest_date.toLocaleDateString(i18n.language))
                } else setLatestDate("")

                // parse date string to datetime
                // update state
            } catch (e) {
                console.error("Error in LatestDate")
                setLatestDate("")
            }
        }
        loadData()
    })

    if (latestDate !== "") {
        return (
            <p>
                {t("intro.most_recent_data")}
                {latestDate}
            </p>
        )
    }
    return ""
}

export default LatestDate

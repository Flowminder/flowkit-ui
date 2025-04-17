import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../../app/api"

const formatting_options = {
    day: "numeric",
    year: "numeric",
    month: "long"
}

const LatestDate = () => {
    const { t, i18n } = useTranslation()

    const [latestDate, setLatestDate] = useState(undefined)

    useEffect(() => {
        const loadData = async () => {
            let response = await api.latestDate()
            try {
                const locale = i18n.language === "en" ? "en-GB" : i18n.language
                if (response) {
                    var latest_date = new Date(response)
                    setLatestDate(latest_date.toLocaleDateString(locale, formatting_options))
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

    if (latestDate !== "" && typeof latestDate !== "undefined") {
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

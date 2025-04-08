import i18next from "i18next"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../../app/api"

const formatting_options = {
    year: "numeric",
    month: "short",
    day: "numeric"
}

const LatestDate = () => {
    const { t, i18n } = useTranslation()

    const [latestDate, setLatestDate] = useState(undefined)

    useEffect(() => {
        const loadData = async () => {
            let response = await api.latestDate()
            try {
                var latest_date = new Date(response)
                setLatestDate(latest_date.toLocaleDateString(i18n.language, formatting_options))

                // parse date string to datetime
                // update state
            } catch (e) {
                console.error("Error in LatestDate")
                setLatestDate("")
            }
        }
        loadData()
    })

    return latestDate
}

export default LatestDate

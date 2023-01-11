import React from "react"
import styles from "./DataTerms.module.css"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const DataTerms = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.DataTerms} data-testid="DataTerms">
            <h2>{t("tutorial.terms")}</h2>

            <h3>
                <FMTrans k="tutorial.heading4" />
            </h3>
            <p>
                <FMTrans k="tutorial.text4" />
            </p>
        </div>
    )
}

export default DataTerms

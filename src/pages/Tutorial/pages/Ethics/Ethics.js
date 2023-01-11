import React from "react"
import styles from "./Ethics.module.css"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../../../components"

const Ethics = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Ethics} data-testid="Ethics">
            <h2>{t("tutorial.terms")}</h2>

            <h3>
                <FMTrans k="tutorial.heading5" />
            </h3>
            <p>
                <FMTrans k="tutorial.text5" />
            </p>
        </div>
    )
}

export default Ethics

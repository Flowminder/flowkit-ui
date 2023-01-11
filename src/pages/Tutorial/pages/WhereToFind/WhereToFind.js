import React from "react"
import styles from "./WhereToFind.module.css"
import img_dashboard from "./img/dashboard.jpg"
import { FMTrans } from "../../../../components"

const WhereToFind = () => {
    return (
        <div className={styles.WhereToFind} data-testid="WhereToFind">
            <h2>
                <FMTrans k="tutorial.access_data" />
            </h2>
            <br />
            <h3>
                <FMTrans i18nKey="tutorial.heading3" />
            </h3>
            <p>
                <FMTrans k="tutorial.text3" />
            </p>
            <br />
            <br />
            <img src={img_dashboard} width="100%" alt="" />
        </div>
    )
}

export default WhereToFind

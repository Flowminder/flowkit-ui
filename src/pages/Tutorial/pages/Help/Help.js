import React from "react"
import styles from "./Help.module.css"
import { FMTrans } from "../../../../components"

const Help = () => {
    return (
        <div className={styles.Help} data-testid="Help">
            <h3>
                <FMTrans k="tutorial.heading6" />
            </h3>
            <p>
                <FMTrans k="tutorial.text6" />
            </p>
        </div>
    )
}

export default Help

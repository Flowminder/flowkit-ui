import React from "react"
import styles from "./Help.module.css"
import { FMTrans } from "../../../../components"

const Help = () => {
    return (
        <div className={styles.Help} data-testid="Help">
            <br />
            <h2>
                <FMTrans k="tutorial.help_heading1" />
            </h2>
            <p>
                <FMTrans k="tutorial.help_text1" />
            </p>
            <br />
            <h2>
                <FMTrans k="tutorial.help_heading2" />
            </h2>
            <p>
                <FMTrans k="tutorial.help_text2" />
            </p>
        </div>
    )
}

export default Help

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./LoggedOut.module.css"
import { useTranslation } from "react-i18next"
import { FMButton, FMTrans } from "../../components"

const LoggedOut = ({ reason = undefined }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.LoggedOut} data-testid="LoggedOut">
            <h1>{t("logged_out.title")}</h1>
            {reason && (
                <h2>
                    <FMTrans k={`logged_out.reason_${reason}`} />
                </h2>
            )}
            <p>
                <FMTrans k="logged_out.text1" />
            </p>
            <FMButton link={"login"} label="Login" />
        </div>
    )
}

export default LoggedOut

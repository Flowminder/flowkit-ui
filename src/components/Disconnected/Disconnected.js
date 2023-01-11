// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./Disconnected.module.css"
import { useTranslation } from "react-i18next"

const Disconnected = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Disconnected} data-testid="Disconnected">
            <h2>{t("dashboard.not_connected_header")}</h2>
            <p>{t("dashboard.not_connected_text1")}</p>
            <p>{t("dashboard.not_connected_text2")}</p>
        </div>
    )
}

export default Disconnected

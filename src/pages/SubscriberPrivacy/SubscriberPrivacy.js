// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./SubscriberPrivacy.module.css"
import "./SubscriberPrivacy.scss"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../../components"

const SubscriberPrivacy = () => {
    const { t } = useTranslation()

    return (
        <div className={`${styles.SubscriberPrivacy} SubscriberPrivacy`} data-testid="SubscriberPrivacy">
            <h1>{t("sub_privacy.title")}</h1>

            <div>
                <FMTrans k="sub_privacy.simple_text" />
            </div>
        </div>
    )
}

export default SubscriberPrivacy

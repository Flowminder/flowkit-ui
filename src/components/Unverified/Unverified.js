// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./Unverified.module.css"
import { useSelector } from "react-redux"
import session from "../../components/SessionArea/sessionSlice.selectors"
import { useTranslation } from "react-i18next"
import { FMTrans } from "../"

const Unverified = () => {
    const { t } = useTranslation()
    const extendedUser = useSelector(session.selectExtendedUser)

    return (
        <div className={styles.Unverified} data-testid="Unverified">
            <p>
                <FMTrans k="profile.unverified1" />
            </p>
            {extendedUser?.user_id.startsWith("auth0") && <p>{t("profile.unverified2")}</p>}
            {!extendedUser?.user_id.startsWith("auth0") && <p>{t("profile.unverified3")}</p>}
            <p>{t("profile.unverified4")}</p>
            <h3>{t("profile.unverified5")}</h3>
        </div>
    )
}

export default Unverified

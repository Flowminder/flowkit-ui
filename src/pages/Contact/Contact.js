// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./Contact.module.css"
import { useTranslation } from "react-i18next"
import img_email from "./img/email.png"
import { FMTrans } from "../../components"

const Contact = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.Contact} data-testid="Contact">
            <h1>{t("contact.title")}</h1>

            <h2>
                <FMTrans k="contact.text1" />
            </h2>
            <img src={img_email} className={styles.Email} alt={""} />
            <p>
                <FMTrans k="contact.text2" />
            </p>
        </div>
    )
}

export default Contact

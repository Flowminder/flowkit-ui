// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import { useTranslation, Trans } from "react-i18next"
import ReactMarkdown from "react-markdown"
import styles from "./FMTrans.module.css"
import rehypeRaw from "rehype-raw"

const FMTrans = ({ k = undefined, markdown = true, style = {} }) => {
    const { t } = useTranslation()

    const allowedElements = [
        "div",
        "span",
        "a",
        "p",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "em",
        "strong",
        "ul",
        "ol",
        "li"
    ]

    return (
        <div data-testid="FMTrans" className={styles.FMTrans} style={style}>
            {!markdown && <Trans i18nKey={k} />}
            {markdown && (
                <ReactMarkdown
                    skipHtml={false}
                    allowedElements={allowedElements}
                    rehypePlugins={[rehypeRaw]}
                    allowDangerousHtml={true}
                    children={t(k)}
                />
            )}
        </div>
    )
}

export default FMTrans

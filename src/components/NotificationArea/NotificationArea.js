// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Alert from "react-bootstrap/Alert"
import styles from "./NotificationArea.module.css"
import img_ok from "./img/ok.svg"
import img_info from "./img/info.svg"
import img_warning from "./img/warning.svg"
import img_error from "./img/error.svg"
import notification from "./notificationSlice.selectors"
import { resetMessage } from "./notificationSlice"
import { Fade } from "react-bootstrap"

const types = {
    ok: {
        img: img_ok,
        variant: "success"
    },
    info: {
        img: img_info,
        variant: "primary"
    },
    warning: {
        img: img_warning,
        variant: "warning"
    },
    error: {
        img: img_error,
        variant: "danger"
    }
}

const NotificationArea = () => {
    const dispatch = useDispatch()

    const type = useSelector(notification.selectMsgType)
    const message = useSelector(notification.selectMsgText)

    useEffect(() => {
        setTimeout(() => dispatch(resetMessage()), 5000)
    }, [dispatch])

    return (
        <div className={`${styles.NotificationArea} ${styles[type]}`} data-testid="NotificationArea">
            {type !== undefined && (
                <Alert
                    variant={types[type]?.variant}
                    dismissible
                    transition={Fade}
                    onLoad={() => setTimeout(() => dispatch(resetMessage()), 2500 + message.length * 100)}
                    onClose={() => dispatch(resetMessage())}
                >
                    <img src={types[type]?.img} alt="" />
                    {message}
                </Alert>
            )}
        </div>
    )
}

export default NotificationArea

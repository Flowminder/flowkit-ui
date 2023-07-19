// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./Sidebar.module.css"
import { ProSidebar, SidebarHeader, SidebarContent } from "react-pro-sidebar"
import ReactMarkdown from "react-markdown"
import { ToggleButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import img_info from "./img/info.svg"
import "./Sidebar.scss"
import { FMButton } from "../"
import session from "../../components/SessionArea/sessionSlice.selectors"

const Sidebar = () => {
    const { t, i18n } = useTranslation()

    const currentIndicator = useSelector(session.selectCurrentIndicator)

    const [collapsed, setCollapsed] = useState(true)
    const [content, setContent] = useState(t("sidebar.loading_guidance"))

    const handleCollapsedChange = collapsed => {
        setCollapsed(collapsed)
    }

    useEffect(() => {
        if (currentIndicator !== undefined) {
            const key = `method_${i18n.language}`
            const sc = Object.keys(currentIndicator).includes(key) ? currentIndicator[key] : currentIndicator.method
            setContent(sc)
        } else {
            setContent(t("sidebar.loading_guidance"))
        }
    }, [i18n.language, currentIndicator])

    return (
        <div className={`${styles.Sidebar} Sidebar`} data-testid="Sidebar">
            <ProSidebar
                width="250px"
                collapsedWidth="35px"
                collapsed={collapsed}
                onToggle={() => {
                    handleCollapsedChange(!collapsed)
                }}
            >
                <SidebarHeader>
                    <ToggleButton
                        id="toggle-check"
                        type="checkbox"
                        variant="primary"
                        checked={collapsed}
                        value="1"
                        size="sm"
                        onChange={() => {
                            handleCollapsedChange(!collapsed)
                        }}
                    >
                        <img src={img_info} width="20px" alt="ℹ" />
                    </ToggleButton>
                </SidebarHeader>
                <SidebarContent>
                    {!collapsed && (
                        <>
                            <h1>{t("sidebar.info")}</h1>
                            <ReactMarkdown
                                skipHtml={false}
                                allowDangerousHtml={true}
                                linkTarget="_blank"
                                children={content}
                            />
                            <br />
                            {currentIndicator && (
                                <>
                                    <FMButton
                                        primary={false}
                                        outline={true}
                                        className={styles.SidebarButton}
                                        link="files/fm_haiti-mobility-dashboard_about-indicators__july_2023.pdf"
                                        label={t("sidebar.read_more")}
                                    />
                                </>
                            )}
                        </>
                    )}
                </SidebarContent>
            </ProSidebar>
        </div>
    )
}

export default Sidebar

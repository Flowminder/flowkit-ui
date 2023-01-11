// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./SequentialMenu.module.css"
import img_tick from "./img/tick.svg"
import img_chevron from "./img/chevron.svg"

const SequentialMenu = ({ items, showArrowNavigation = false, nextPageEnabled, currentItem, setCurrentItem }) => {
    const increment = () => {
        if (currentItem < items.length) {
            setCurrentItem(currentItem + 1)
        }
    }

    const decrement = () => {
        if (currentItem > 0) {
            setCurrentItem(currentItem - 1)
        }
    }

    return (
        <div className={styles.SequentialMenu} data-testid="SequentialMenu">
            <ul className={styles.Breadcrumbs}>
                {showArrowNavigation && items && (
                    <li onClick={decrement} className={`${styles.back} ${currentItem === 0 ? styles.inactive : ""}`}>
                        <img src={img_chevron} alt="&lt;" />
                    </li>
                )}
                {items &&
                    items.map((stage, index) => {
                        return (
                            <li
                                className={
                                    index === currentItem ? styles.active : index < currentItem ? styles.done : ""
                                }
                                key={`breadcrumb-${index}`}
                                title={stage.name}
                            >
                                {stage.name}
                                {index < currentItem && <img src={img_tick} alt="✔" />}
                            </li>
                        )
                    })}
                {showArrowNavigation && items && (
                    <li
                        onClick={increment}
                        className={`${styles.next} ${
                            currentItem === items.length - 1 || !nextPageEnabled ? styles.inactive : ""
                        }`}
                    >
                        <img src={img_chevron} alt="&gt;" />
                    </li>
                )}
            </ul>
        </div>
    )
}

export default SequentialMenu

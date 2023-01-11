// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./FMSelect.module.css"
import "./FMSelect.scss"
import mainStyles from "../MainContent/MainContent.module.css"
import Select from "react-select"

const FMSelect = ({ options, value, placeholder, isMulti, maxMenuHeight, isDisabled, onChange }) => {
    return (
        <div className={`${styles.FMSelect} FMSelect`} data-testid="FMSelect">
            <Select
                className={mainStyles.select}
                classNamePrefix="react-select"
                options={options}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                isMulti={isMulti || false}
                maxMenuHeight={maxMenuHeight}
                isDisabled={isDisabled || false}
                /*menuIsOpen={true}*/
                theme={theme => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: "var(--tertiary)",
                        primary: "var(--quaternary)",
                        neutral20: "var(--light)",
                        neutral30: "var)--medium("
                    }
                })}
                styles={{
                    indicatorSeparator: (base, state) => ({
                        ...base,
                        display: "none"
                    }),
                    clearIndicator: (base, state) => ({
                        ...base,
                        background: "var(--white)",
                        color: "#999",
                        "&:hover": {
                            color: "#666"
                        }
                    }),
                    dropdownIndicator: (base, state) => ({
                        ...base,
                        height: "calc(100% - 2px)",
                        position: "relative",
                        top: "-1px",
                        display: "flex",
                        background: state.isDisabled ? "var(--light)" : "var(--quaternary)",
                        color: "var(--white)",
                        "&:hover": {
                            color: "var(--white)",
                            background: state.isDisabled ? "var(--light)" : "var(--tertiary)"
                        },
                        "& svg": {
                            flex: 1,
                            height: "100%"
                        }
                    })
                }}
            />
        </div>
    )
}

export default FMSelect

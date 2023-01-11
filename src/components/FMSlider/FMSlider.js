// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./FMSlider.module.css"
import { Range } from "react-range"
import { getTrackBackground } from "react-range/lib/utils"

const FMSlider = ({
    values,
    step,
    min,
    max,
    onChange,
    labels = undefined,
    isRange = false,
    cumulative = true,
    outputIsVisible = false,
    outerLabelsOnly = false
}) => {
    values = values || (isRange ? [min, max] : [min])

    const getLabelForIndex = index => {
        if (labels === undefined) {
            return step * index + min
        } else {
            return labels[step * index + min]
        }
    }
    const getLabelForValue = value => {
        return labels !== undefined && Object.keys(labels).includes(String(value)) ? labels[value] : value
    }

    return (
        <div
            className={`${styles.FMSlider}${isRange ? ` ${styles.Range}` : ""}${
                outerLabelsOnly ? ` ${styles.outerLabelsOnly}` : ""
            }`}
            data-testid="FMSlider"
        >
            <Range
                draggableTrack={false}
                values={values}
                step={step}
                min={min}
                max={max}
                rtl={false}
                allowOverlap={true}
                onChange={values => onChange(values)}
                renderTrack={({ props, children }) => (
                    <div
                        className={styles.SliderTrack}
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                    >
                        {!isRange && (
                            <>
                                {!cumulative && (
                                    <div ref={props.ref} className={styles.selectedInvisible}>
                                        {children.map(c => {
                                            return { ...c, key: Math.random() }
                                        })}
                                    </div>
                                )}
                                {cumulative && (
                                    <div
                                        ref={props.ref}
                                        className={styles.selectedVisible}
                                        style={{
                                            width: "100%",
                                            background: getTrackBackground({
                                                values,
                                                colors: ["#263785", "#0DC7BD"],
                                                min: min,
                                                max: max
                                            })
                                        }}
                                    >
                                        {children.map(c => {
                                            return { ...c, key: Math.random() }
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                        {isRange && (
                            <div
                                ref={props.ref}
                                className={styles.selected}
                                style={{
                                    width: "100%",
                                    alignSelf: "center",
                                    background: getTrackBackground({
                                        values: values,
                                        colors: ["#0DC7BD", "#263785", "#0DC7BD"],
                                        min: min,
                                        max: max
                                    })
                                }}
                            >
                                {children.map(c => {
                                    return { ...c, key: Math.random() }
                                })}
                            </div>
                        )}
                    </div>
                )}
                renderThumb={({ props, value, index, isDragged }) => (
                    <div
                        {...props}
                        key={index}
                        className={`${styles.SliderHandle}${isDragged ? ` ${styles.dragged}` : ""}`}
                    >
                        <div className={styles.SliderTooltip}>
                            <span>{getLabelForValue(value)}</span>
                        </div>
                    </div>
                )}
                renderMark={({ props, index }) => (
                    <>
                        {!isRange && (
                            <>
                                {!cumulative && (
                                    <div {...props} className={styles.SliderTick}>
                                        <div className={styles.SliderLabel}>{getLabelForIndex(index)}</div>
                                    </div>
                                )}
                                {cumulative && (
                                    <div
                                        {...props}
                                        className={`${styles.SliderTick} ${
                                            step * index + min <= values[0] ? styles.selected : ""
                                        }`}
                                    >
                                        <div className={styles.SliderLabel}>{getLabelForIndex(index)}</div>
                                    </div>
                                )}
                            </>
                        )}
                        {isRange && (
                            <div
                                {...props}
                                className={`${styles.SliderTick} ${
                                    step * index + min > values[0] && step * index + min <= values[1]
                                        ? styles.selected
                                        : ""
                                }`}
                            >
                                <div className={styles.SliderLabel}>{getLabelForIndex(index)}</div>
                            </div>
                        )}
                    </>
                )}
            />

            {outputIsVisible && (
                <output className={styles.Output} id="output">
                    <p>Currently selected:</p>
                    {getLabelForIndex(values[0])}
                    {isRange && ` - ${getLabelForIndex(values[1])}`}
                </output>
            )}
            {!outputIsVisible && <div className={styles.Clear}></div>}
        </div>
    )
}

export default FMSlider

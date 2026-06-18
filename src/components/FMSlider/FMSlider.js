// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect, useRef } from "react"
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

    // react-range measures the track once on mount via the ref'd inner div.
    // When the slider remounts inside a flex parent on indicator switch, that
    // measurement can run before layout settles — track gets measured as 0 and
    // every mark ends up at left:-1px until something (window resize, devtools
    // opening) makes react-range recompute. ResizeObserver lets us detect when
    // the container actually has a width and trigger react-range's own resize
    // handler to remeasure.
    const containerRef = useRef(null)
    useEffect(() => {
        if (!containerRef.current || typeof ResizeObserver === "undefined") return
        let lastWidth = 0
        const obs = new ResizeObserver(entries => {
            const w = entries[0].contentRect.width
            if (w > 0 && w !== lastWidth) {
                lastWidth = w
                window.dispatchEvent(new Event("resize"))
            }
        })
        obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

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
            ref={containerRef}
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
                                        {children}
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
                                        {children}
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
                                {children}
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
                renderMark={({ props, index }) => {
                    // single-element renderMark so react-range's key/ref/style props
                    // land on the outermost rendered div. wrapping in a Fragment
                    // makes the Fragment keyless and breaks react-range's mark
                    // measurement (markRefs[i].current stays null, fallback width=9999
                    // sends positions off-screen to ~-5000px).
                    const value = step * index + min
                    let tickClass = styles.SliderTick
                    if (!isRange && cumulative && value <= values[0]) {
                        tickClass += ` ${styles.selected}`
                    }
                    if (isRange && value > values[0] && value <= values[1]) {
                        tickClass += ` ${styles.selected}`
                    }
                    return (
                        <div {...props} className={tickClass}>
                            <div className={styles.SliderLabel}>{getLabelForIndex(index)}</div>
                        </div>
                    )
                }}
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

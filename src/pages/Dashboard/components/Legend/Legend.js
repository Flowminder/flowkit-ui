// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./Legend.module.css"
import util from "../../../../app/util"

const Legend = ({
    type = "single_location",
    bins = [],
    decimals = 0,
    inColour,
    outColour,
    inColourInactive,
    outColourInactive,
    showInactive = false
}) => {
    return (
        <div className={styles.Legend} data-testid="Legend">
            {type === "single_location" && (
                <>
                    {bins !== undefined &&
                        Array.isArray(bins) &&
                        bins.map(bin => {
                            return (
                                <div key={bin.key} className={styles.Bin}>
                                    <div className={styles.Label}>
                                        <span>{util.round(bin.from, decimals)}</span>
                                        <span>&mdash;</span>
                                        <span>{util.round(bin.to, decimals)}</span>
                                    </div>
                                    <div className={styles.Colour} style={{ background: bin.colour }}></div>
                                </div>
                            )
                        })}
                    <div className={styles.Bin}>
                        <div className={styles.Label}>
                            <span>No data</span>
                        </div>
                        <div key="nodata" className={styles.Colour} style={{ background: "#c6c6c6" }}></div>
                    </div>
                </>
            )}

            {type === "flow" && (
                <>
                    {showInactive && (
                        <>
                            <div className={styles.Bin}>
                                <div className={styles.Label}>
                                    <span>Outgoing / From</span>
                                </div>
                                <div
                                    key="outgoing"
                                    className={styles.Colour}
                                    style={{ background: `rgb(${outColourInactive.join(",")})` }}
                                ></div>
                            </div>
                            <div className={styles.Bin}>
                                <div className={styles.Label}>
                                    <span>Incoming / To</span>
                                </div>
                                <div
                                    key="incoming"
                                    className={styles.Colour}
                                    style={{ background: `rgb(${inColourInactive.join(",")})` }}
                                ></div>
                            </div>
                        </>
                    )}
                    <div className={styles.Bin}>
                        <div className={styles.Label}>
                            <span>Outgoing / From</span>
                        </div>
                        <div
                            key="outgoing"
                            className={styles.Colour}
                            style={{ background: `rgb(${outColour.join(",")})` }}
                        ></div>
                    </div>
                    <div className={styles.Bin}>
                        <div className={styles.Label}>
                            <span>Incoming / To</span>
                        </div>
                        <div
                            key="incoming"
                            className={styles.Colour}
                            style={{ background: `rgb(${inColour.join(",")})` }}
                        ></div>
                    </div>
                    <div className={styles.Bin}>
                        <div className={styles.Label}>
                            <span>From ➡ To</span>
                        </div>
                        <div
                            key="arrow"
                            className={styles.Colour}
                            style={{
                                background: `linear-gradient(90deg, rgb(${outColour.join(",")}) 0%, rgb(${inColour.join(
                                    ","
                                )}) 100%)`
                            }}
                        ></div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Legend

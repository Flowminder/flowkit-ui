// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./GraphView.module.css"
import "./GraphView.scss"
import { BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import util from "../../../../app/util"
import { Legend } from "../../components"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import session from "../../../../components/SessionArea/sessionSlice.selectors"

const OUT_COLOUR = [112, 31, 83]
const IN_COLOUR = [65, 180, 150]
const IN_COLOUR_INACTIVE = [192, 192, 192]
const OUT_COLOUR_INACTIVE = [128, 128, 128]

const GraphView = ({
    type,
    timeRange,
    selectedTimeEntity,
    data,
    currentSpatialResolution,
    spatialEntities,
    labels,
    decimals = 0,
    minValue = undefined,
    maxValue = undefined,
    colourScale = ["#FCE63E", "#6BC567", "#358F8C", "#3D5389", "#451756"]
}) => {
    const { t, i18n } = useTranslation()
    const languageSuffix = i18n?.resolvedLanguage?.startsWith("fr") ? "_FR" : "_EN"

    const countrySpatialResolutions = useSelector(session.selectCountrySpatialResolutions)

    const processedData = data
        ? Object.entries(data).map(d => {
              const props = spatialEntities.filter(e => e[`ADM${currentSpatialResolution.index}_PCODE`] === d[0])[0]
              return { id: d[0], label: labels[d[0]], value: Number(d[1]), props: props }
          })
        : []
    processedData.sort((a, b) => {
        return a.label > b.label
    })
    const range = [Number(util.round(minValue)), Number(util.round(maxValue))]

    const bins = util.makeBins(colourScale, minValue, maxValue, decimals)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload) {
            const highestLevel = Object.keys(payload[0].payload.props)
                .filter(prop => prop.endsWith(languageSuffix))
                .sort((a, b) => b.localeCompare(a))[0]
                .replace("ADM", "")
                .replace(languageSuffix, "")
            const highestSpatialResolution = countrySpatialResolutions.filter(
                sr => String(sr.index) === highestLevel
            )[0]
            const labelKey = `label${languageSuffix.toLowerCase()}`
            const label = Object.keys(highestSpatialResolution).includes(labelKey)
                ? highestSpatialResolution[labelKey]
                : highestSpatialResolution.label
            return (
                <div className={styles.Tooltip}>
                    <p key="tooltip-highest-level">
                        <strong>
                            {label}: {payload[0].payload.label} ({payload[0].payload.id})
                        </strong>
                    </p>
                    {Object.keys(payload[0].payload.props)
                        // get all admin levels' labels for this spatial entity and the current language
                        .filter(prop => prop.endsWith(languageSuffix))
                        // sort high to low admin level
                        .sort((a, b) => b.localeCompare(a))
                        // remove the first one (already covered)
                        .slice(1, -1)
                        // print each label
                        .map(key => {
                            const index = key.replace("ADM", "").replace(languageSuffix, "")
                            return (
                                <p key={`tooltip-level-${key}`}>
                                    {countrySpatialResolutions.filter(sr => String(sr.index) === index)[0]?.label}:{" "}
                                    {payload[0].payload.props[key]} (
                                    {payload[0].payload.props[key.replace(languageSuffix, "_PCODE")]})
                                </p>
                            )
                        })}
                    <p key="tooltip-value">Value: {payload[0].payload.value}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className={`GraphView ${styles.GraphView}`} data-testid="GraphView">
            {timeRange && selectedTimeEntity !== undefined && data && (
                <>
                    <Legend
                        type={type}
                        bins={bins}
                        decimals={decimals}
                        inColour={IN_COLOUR}
                        outColour={OUT_COLOUR}
                        inColourInactive={IN_COLOUR_INACTIVE}
                        outColourInactive={OUT_COLOUR_INACTIVE}
                        showInactive={false}
                    />
                    <h2>{timeRange[selectedTimeEntity]}</h2>
                    {type === "single_location" && (
                        <BarChart className="bar-chart" width={900} height={500} data={processedData}>
                            <XAxis dataKey="label" />
                            <YAxis yAxisId="a" domain={range} />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid vertical={false} />
                            <Bar yAxisId="a" dataKey="value">
                                {processedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={util.getBin(entry.id, data, bins, minValue, maxValue)?.colour}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                    {type === "flow" && <p>{t("dashboard.graph_view_not_supported")}</p>}
                </>
            )}
            <div></div>
        </div>
    )
}

export default GraphView

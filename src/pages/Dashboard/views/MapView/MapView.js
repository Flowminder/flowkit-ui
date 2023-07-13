// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { setLoadingMessage } from "../../../../components/SessionArea/sessionSlice"
import styles from "./MapView.module.css"
import "./MapView.scss"
import util from "../../../../app/util"
import env from "../../../../app/env"
// see https://github.com/visgl/react-map-gl/tree/5.3-release/docs/api-reference
import { InteractiveMap, MapContext, NavigationControl } from "react-map-gl"
import DeckGL, { GeoJsonLayer, ScatterplotLayer, ArcLayer } from "deck.gl"
import { Legend } from "../../components"
import session from "../../../../components/SessionArea/sessionSlice.selectors"

const DATA_LAYER_ID = "my-data"
const OUT_COLOUR = [112, 31, 83]
const IN_COLOUR = [65, 180, 150]
const IN_COLOUR_INACTIVE = [192, 192, 192]
const OUT_COLOUR_INACTIVE = [128, 128, 128]
const TRANSPARENT = [0, 0, 0, 0]
const HOVER_COLOUR = [255, 255, 255, 64]

const MapView = ({
    timeRange,
    selectedTimeEntity,
    type,
    boundaries,
    data,
    indicator,
    heading,
    decimals = 0,
    minValue = undefined,
    maxValue = undefined,
    redrawKey = undefined,
    colourScale = ["#FCE63E", "#6BC567", "#358F8C", "#3D5389", "#451756"]
}) => {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()

    const currentSpatialResolution = useSelector(session.selectCurrentSpatialResolution)

    const persistentRedrawKey = useRef(undefined)
    // For some obscure reason the value was lost when using state. This works. Hands off!
    const pcodeKey = useRef(undefined)

    const [nodes, setNodes] = useState([])
    const [flows, setFlows] = useState([])
    const [maxFlow, setMaxFlow] = useState(0)
    const [layers, setLayers] = useState([])
    const [hoveredFeature, setHoveredFeature] = useState(undefined)
    const [tooltip, setTooltip] = useState(undefined)
    const [selectedNode, setSelectedNode] = useState(undefined)
    const [selectedFeature, setSelectedFeature] = useState(undefined)
    const [nameKey, setNameKey] = useState(undefined)
    const [label, setLabel] = useState("")

    // Leaving creole out for the moment - the fields are null for admin levels>1 in the source file
    const languageSuffix = i18n?.resolvedLanguage?.startsWith("fr") ? "_FR" : "_EN"
    const bins = util.makeBins(colourScale, minValue, maxValue, decimals)

    const getTooltip = () => {
        // not hovering over anything
        if (type === "flow") {
            return tooltip
        } else {
            if (hoveredFeature === undefined || data === undefined) {
                return ""
            }

            const key = Object.keys(hoveredFeature?.properties)
                .filter(o => o.startsWith("ADM") && o.endsWith(languageSuffix))
                .sort((a, b) => b.localeCompare(a))[0]

            return `${hoveredFeature?.properties[key]}${
                Object.keys(data).includes(hoveredFeature?.properties[pcodeKey.current]) &&
                data[hoveredFeature?.properties[pcodeKey.current]] !== undefined
                    ? `: ${data[hoveredFeature?.properties[pcodeKey.current]]}`
                    : ""
            }`
        }
    }

    const getNodeColour = (n, inner) => {
        // node inner colour is purple if fewer people left than arrived and turquoise if it's the other way round
        // the opposite is true for the outer colour
        // TODO: what to do when the numbers are the same?
        if ((inner === true && n.in <= n.out) || (inner !== true && n.in > n.out)) {
            return selectedNode === undefined || n.id === selectedNode?.object?.id ? IN_COLOUR : IN_COLOUR_INACTIVE
        } else {
            return selectedNode === undefined || n.id === selectedNode?.object?.id ? OUT_COLOUR : OUT_COLOUR_INACTIVE
        }
    }

    const touchesSelectedNode = f => [f?.origin, f?.dest].includes(selectedNode?.object?.id)

    const makeNodeLayer = () => {
        return new ScatterplotLayer({
            id: `${DATA_LAYER_ID}_node`,
            data: nodes,
            pickable: true,
            autoHighlight: true,
            highlightColor: HOVER_COLOUR,
            opacity: 1,
            stroked: true,
            filled: true,
            radiusUnits: "pixels",
            lineWidthUnits: "pixels",
            getPosition: n => n?.centroid,
            getRadius: n => Math.max(5, (Math.max(n.in, n.out) / maxFlow) * 20),
            getLineWidth: n => Math.max(2, (Math.abs(n.in - n.out) / maxFlow) * 20),
            getLineColor: n => getNodeColour(n, false),
            getFillColor: n => getNodeColour(n, true),
            updateTriggers: {
                // hover effect for hovering over nodes
                getFillColor: [selectedNode, nodes],
                getLineColor: [selectedNode, nodes]
            },
            onHover: info => {
                if (info?.index >= 0) {
                    setTooltip(
                        `<div>
                            <span style="font-weight: 900">${info.object?.name}</span> (${info.object?.id})<br />
                            <span style="font-weight: 900; color: rgb(${IN_COLOUR.join(",")})">In:</span> ${
                            info.object?.in
                        }<br />
                            <span style="font-weight: 900; color: rgb(${OUT_COLOUR.join(",")})">Out:</span> ${
                            info.object?.out
                        }
                        </div>`
                    )
                } else {
                    setTooltip(undefined)
                }
            },
            onClick: info => {
                setSelectedNode(info)
            }
        })
    }

    const makeArcLayer = () => {
        const MIN_ARC_WIDTH = 0
        const MAX_ARC_WIDTH = 25

        let numArcWidthSteps
        let range
        let useAbsValue
        let absMiddleValue
        let absRange

        let indicator_bins

        // indicator specifies bins
        if (indicator?.bins) {
            indicator_bins = indicator.bins.slice()
            indicator_bins.sort((a, b) => (a.min || -Infinity) - (b.min || -Infinity))
            // calculate range, bins & values when it's not set in the indicator
        } else {
            numArcWidthSteps = Math.abs(MAX_ARC_WIDTH - MIN_ARC_WIDTH)
            //console.debug(`One step on the arc scale is ${arcWidthStep}px`)
            //console.debug(`The width at value ${minValue} is ${MIN_ARC_WIDTH}px and the width at value ${maxValue} is ${MAX_ARC_WIDTH}px.`)
            range = maxValue - minValue
            //console.debug(`The range for sequential indicators is ${range}. One value step corresponds to ${numArcWidthSteps/range}px in line width`)
            useAbsValue = minValue < 0 && maxValue > 0
            absMiddleValue = (minValue + maxValue) / 2
            absRange = Math.abs(maxValue - absMiddleValue)
            //console.debug(`The range for diverging scales is ${absRange}. One value step corresponds to ${numArcWidthSteps/absRange}px in line width`)
        }

        return new ArcLayer({
            id: `${DATA_LAYER_ID}_arc`,
            data: flows,
            pickable: true,
            autoHighlight: true,
            highlightColor: f => (selectedNode === undefined || touchesSelectedNode(f) ? HOVER_COLOUR : TRANSPARENT),
            getHeight: 0.1,
            getTilt: f => -90,
            getWidth: f => {
                if (indicator_bins) {
                    let width
                    indicator_bins.forEach(bin => {
                        if ((bin.min || -Infinity) <= f.count && bin.max > f.count) {
                            width = bin.width
                            return
                        }
                    })
                    // use absolute percentage in pixels if given
                    if (!isNaN(Number(width))) {
                        return width
                        // else calculate percentage of max default width
                    } else {
                        const percentage = Number(String(width).replace("%", ""))
                        return (percentage / 100) * MAX_ARC_WIDTH
                    }
                } else {
                    if (useAbsValue) {
                        const position = Math.abs(f.count - absMiddleValue)
                        return Math.min(MAX_ARC_WIDTH, MIN_ARC_WIDTH + (position * numArcWidthSteps) / absRange)
                    } else {
                        const position = Math.abs(f.count - minValue)
                        return MIN_ARC_WIDTH + (position * numArcWidthSteps) / range
                    }
                }
            },
            getSourcePosition: f => nodes.filter(n => n.id === f.origin)[0]?.centroid,
            getTargetPosition: f => nodes.filter(n => n.id === f.dest)[0]?.centroid,
            getSourceColor: f => (selectedNode === undefined || touchesSelectedNode(f) ? OUT_COLOUR : TRANSPARENT),
            getTargetColor: f => (selectedNode === undefined || touchesSelectedNode(f) ? IN_COLOUR : TRANSPARENT),
            updateTriggers: {
                getSourceColor: [selectedNode],
                getTargetColor: [selectedNode]
            },
            onHover: info => {
                if (
                    (selectedNode === undefined || touchesSelectedNode(info.object)) &&
                    info.object &&
                    info.object?.origin !== undefined &&
                    info.object?.dest !== undefined
                ) {
                    setTooltip(
                        `<div>
                            <span style="font-weight: 900; color: rgb(${OUT_COLOUR.join(",")})">${
                            nodes.filter(n => n.id === info.object?.origin)[0]?.name
                        } ➡ </span>
                            <span style="font-weight: 900">${info.object?.count}</span>
                            <span style="font-weight: 900; color: rgb(${IN_COLOUR.join(",")})"> ➡ ${
                            nodes.filter(n => n.id === info.object?.dest)[0]?.name
                        }</span>
                        </div>`
                    )
                }
            },
            onClick: () => {
                setSelectedNode(undefined)
            }
        })
    }

    const makePolygonLayer = () => {
        return new GeoJsonLayer({
            id: `${DATA_LAYER_ID}_polygon`,
            data: boundaries,
            stroked: true,
            filled: true,
            getFillColor: f =>
                util.hexToRgb(util.getBin(f?.properties[pcodeKey.current], data, bins, minValue, maxValue)?.colour),
            getLineColor: [199, 163, 95],
            getLineWidth: f => (f === hoveredFeature || f === selectedFeature ? 3 : 1),
            lineWidthUnits: "pixels",
            updateTriggers: {
                // change line width as hover effect
                getLineWidth: [hoveredFeature],
                // update colours whenever the data changes
                getFillColor: [data, minValue, maxValue, colourScale, persistentRedrawKey.current]
            },
            pickable: true,
            highlightColor: info =>
                util.hexToRgb(
                    util.getBin(info?.object?.properties[pcodeKey.current], data, bins, minValue, maxValue)?.colour
                ),
            onHover: info => setHoveredFeature(info?.object),
            onClick: info => {
                setSelectedFeature(info?.object)
            }
        })
    }

    // TODO: needs to run after language was changed
    useEffect(() => {
        if (boundaries === undefined) {
            return
        }
        // get PCOD key for highest resolution areas - use first features as they should all be the same
        const pck = boundaries?.features[0]
            ? Object.entries(boundaries?.features[0].properties)
                  // check the key of the property
                  .map(obj => obj[0])
                  // only consider ones that end in "_PCODE"
                  .filter(key => key.endsWith("_PCODE"))
                  // use the highest spatial resolution - this will be "ours"
                  .sort((a, b) => b.localeCompare(a))[0]
            : ""
        pcodeKey.current = pck

        const nk = boundaries?.features[0]
            ? Object.entries(boundaries?.features[0].properties)
                  .map(obj => obj[0])
                  .filter(key => key.endsWith(languageSuffix))
                  .sort((a, b) => b.localeCompare(a))[0]
            : ""
        setNameKey(nk)
    }, [boundaries])

    // reset the map
    useEffect(() => {
        if (!boundaries || !data) {
            return
        }
        // don't deselect node if it doesn't exist - it may not exist just for this slice.
        // -> deselection is manual. exception: if we're rendering a polygon layer
        if (type !== "flow") {
            setSelectedNode(undefined)
        }
        if (type === "flow") {
            setSelectedFeature(undefined)
        }
        setHoveredFeature(undefined)
        setTooltip(undefined)
        setNodes([])
        setFlows([])
        setMaxFlow(0)
        setLayers([])
    }, [boundaries, data])

    // build nodes/flows for the current point in time
    useEffect(() => {
        // not needed for polygons
        if (type !== "flow" || !data || typeof data[Object.keys(data)[0]] !== "object") {
            return
        }

        console.debug("Building nodes/flows for the currently selected data slice")
        dispatch(setLoadingMessage(t("dashboard.loading_data")))

        const flows = []
        if (data) {
            Object.entries(data).forEach(node => {
                const origin = node[0]
                if (node[1] !== undefined) {
                    Object.entries(node[1]).forEach(arrow => {
                        if (arrow[1] !== undefined) {
                            flows.push({
                                origin: origin,
                                dest: arrow[0],
                                count: Number(arrow[1])
                            })
                        }
                    })
                }
            })
        }
        setFlows(flows)

        const nodesData = {}
        flows.forEach(f => {
            if (!Object.keys(nodesData).includes(f.origin)) {
                nodesData[f.origin] = { in: 0, out: 0 }
            }
            if (!Object.keys(nodesData).includes(f.dest)) {
                nodesData[f.dest] = { in: 0, out: 0 }
            }
            nodesData[f.origin].out += f.count
            nodesData[f.dest].in += f.count
        })
        const nodes = boundaries?.features
            ? boundaries.features
                  .map(f => {
                      // only add nodes that have flows
                      if (
                          nodesData[f?.properties[pcodeKey.current]]?.in !== undefined ||
                          nodesData[f?.properties[pcodeKey.current]]?.out !== undefined
                      ) {
                          return {
                              id: f?.properties[pcodeKey.current],
                              name: f?.properties[nameKey],
                              centroid: f?.properties?.centroid?.coordinates,
                              in: nodesData[f?.properties[pcodeKey.current]]?.in,
                              out: nodesData[f?.properties[pcodeKey.current]]?.out
                          }
                      }
                      return undefined
                  })
                  .filter(n => n !== undefined)
            : []
        setNodes(nodes)
        if (nodes.length > 0) {
            const maxIn = Math.max(...nodes.map(n => n.in))
            const maxOut = Math.max(...nodes.map(n => n.out))
            setMaxFlow(Math.max(maxIn, maxOut))
        }
        dispatch(setLoadingMessage())
    }, [boundaries, data, persistentRedrawKey.current])

    // setup/re-draw layers
    useEffect(() => {
        if (redrawKey !== persistentRedrawKey.current && redrawKey !== undefined) {
            //console.debug(`redrawKey changed: ${persistentRedrawKey.current} -> ${redrawKey}; need to redraw map`)
            persistentRedrawKey.current = redrawKey
        }
    }, [redrawKey])

    useEffect(() => {
        if (type === "flow" && nodes && flows) {
            console.debug("Rendering flow layer. Selected node:", selectedNode?.object?.id)
            setLayers([makeArcLayer(), makeNodeLayer()])
        }
    }, [nodes, flows, selectedNode, hoveredFeature, persistentRedrawKey.current])

    useEffect(() => {
        if (type === "single_location" && boundaries && data) {
            setLayers([makePolygonLayer()])
        }
    }, [boundaries, data, hoveredFeature, selectedFeature, minValue, maxValue, persistentRedrawKey.current])

    return (
        <div className={`${styles.MapView} MapView`} data-testid="MapView">
            {boundaries && minValue !== undefined && maxValue !== undefined && (
                <Legend
                    type={type}
                    bins={bins}
                    decimals={decimals}
                    inColour={IN_COLOUR}
                    outColour={OUT_COLOUR}
                    inColourInactive={IN_COLOUR_INACTIVE}
                    outColourInactive={OUT_COLOUR_INACTIVE}
                    showInactive={selectedNode !== undefined}
                />
            )}
            {timeRange && selectedTimeEntity && (
                <div className={`${styles.Info} ${type === "single_location" && selectedFeature ? styles.large : ""}`}>
                    <h2>{heading}</h2>
                    {selectedNode && (
                        <>
                            w<h3>{selectedNode?.object?.name}</h3>
                            <p>
                                {t("dashboard.total_in")}: {selectedNode?.object?.in}
                            </p>
                            <p>
                                {t("dashboard.total_out")}: {selectedNode?.object?.out}
                            </p>
                        </>
                    )}
                    {selectedFeature && selectedFeature?.properties && data && (
                        <>
                            <h3>
                                ({selectedFeature?.properties[`ADM${currentSpatialResolution?.index}_PCODE`]})&nbsp;
                                {
                                    selectedFeature?.properties[
                                        `ADM${currentSpatialResolution?.index}${languageSuffix.toUpperCase()}`
                                    ]
                                }
                                :{" "}
                                {JSON.stringify(
                                    data[selectedFeature?.properties[`ADM${currentSpatialResolution?.index}_PCODE`]]
                                )}
                            </h3>
                            <p>
                                {[...Array(currentSpatialResolution?.index).keys()]
                                    .reverse()
                                    .map(i => selectedFeature?.properties[`ADM${i}${languageSuffix.toUpperCase()}`])
                                    .join(", ")}
                            </p>
                        </>
                    )}
                </div>
            )}

            <DeckGL
                className={styles.Map}
                initialViewState={{
                    latitude: 19,
                    longitude: -73,
                    zoom: 7,
                    bearing: 0,
                    pitch: 0
                }}
                controller={true}
                layers={layers}
                pickingRadius={2}
                ContextProvider={MapContext.Provider}
                getTooltip={object =>
                    object?.object !== undefined ? { html: getTooltip(), style: { zIndex: 500 } } : undefined
                }
                onClick={object => {
                    if (object.index === -1) {
                        setSelectedNode(undefined)
                        setSelectedFeature(undefined)
                    }
                }}
            >
                <InteractiveMap
                    mapStyle={env.REACT_APP_MAPBOX_STYLE}
                    attributionControl={false}
                    mapboxApiAccessToken={env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                />
                <NavigationControl
                    showCompass={false}
                    style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10
                    }}
                />
            </DeckGL>
        </div>
    )
}

export default MapView

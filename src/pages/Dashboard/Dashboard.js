// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DateTime } from "luxon"
import styles from "./Dashboard.module.css"
import ReactMarkdown from "react-markdown"
import "react-datepicker/dist/react-datepicker.css"
import "./Dashboard.scss"
import { useAuth0 } from "@auth0/auth0-react"
import { registerLocale } from "react-datepicker"
import enGB from "date-fns/locale/en-GB"
import fr from "date-fns/locale/fr"
import * as topojson from "topojson-client"
import { useTranslation } from "react-i18next"
import { Button, Spinner } from "react-bootstrap"
import api from "../../app/api"
import { v4 as uuidv4 } from "uuid"
import {
    setLoadingMessage,
    setAllCategories,
    setAllIndicators,
    setCountrySpatialResolutions,
    addSpatialResolutions,
    addTemporalResolutions,
    addBoundariesToCache,
    setCurrentIndicator,
    setCurrentSpatialResolution,
    setCurrentTemporalResolution,
    setSelectedTimeRangeForCurrentData,
    setSelectedTimeEntity,
    setCurrentData,
    setCurrentStartDate,
    setCurrentEndDate,
    setCurrentMinValue,
    setCurrentMaxValue,
    setRedrawKey,
    setCurrentAvailableTimeRange,
    setModal
} from "../../components/SessionArea/sessionSlice"
import session from "../../components/SessionArea/sessionSlice.selectors"
import util from "../../app/util"
import { Disconnected, FMTrans } from "../../components"
import { GraphView, MapView, TableView } from "./views"
import { Menu, CurrentTimeUnitSlider } from "./components"
import img_world from "./img/world.png"
import img_graph from "./img/graph.png"
import img_table from "./img/table.png"
import img_online from "./img/online.svg"
import img_offline from "./img/offline.svg"
import env from "../../app/env"
import { useNavigate } from "react-router-dom"
import ReactGA from "react-ga4"

// Scales are build-time environment variables
const colourScales = [
    { name: "sequential", scale: JSON.parse(process.env.REACT_APP_MAP_SEQUENTIAL_SCALE) },
    { name: "diverging", scale: JSON.parse(process.env.REACT_APP_MAP_DIVERGING_SCALE) },
    { name: "qualitative", scale: JSON.parse(process.env.REACT_APP_MAP_QUALITATIVE_SCALE) }
]

const Dashboard = () => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

    const initialised = useRef(false)

    const languageSuffix = i18n?.resolvedLanguage?.startsWith("fr") ? "_FR" : "_EN"
    if (i18n?.resolvedLanguage === "fr") {
        registerLocale("fr", fr)
    } else {
        registerLocale("en-GB", enGB)
    }

    const views = ["map", "graph", "table"]

    // things we cache in redux
    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const extendedUser = useSelector(session.selectExtendedUser)
    const heartbeat = useSelector(session.selectHeartbeat)
    const allCategories = useSelector(session.selectAllCategories)
    const allIndicators = useSelector(session.selectAllIndicators)
    const indicatorsForCurrentCategory = useSelector(session.selectIndicatorsForCurrentCategory)
    const spatialResolutionsForCurrentCategory = useSelector(session.selectSpatialResolutionsForCurrentCategory)
    const temporalResolutionsForCurrentCategory = useSelector(session.selectTemporalResolutionsForCurrentCategory)
    const currentAvailableTimeRange = useSelector(session.selectCurrentAvailableTimeRange)
    const selectedTimeEntity = useSelector(session.selectSelectedTimeEntity)
    const currentCategory = useSelector(session.selectCurrentCategory)
    const currentIndicator = useSelector(session.selectCurrentIndicator)
    const currentSpatialResolution = useSelector(session.selectCurrentSpatialResolution)
    const currentTemporalResolution = useSelector(session.selectCurrentTemporalResolution)
    const currentBoundaries = useSelector(session.selectCurrentBoundaries)
    const currentLabels = useSelector(session.selectCurrentLabels(languageSuffix))
    const currentData = useSelector(session.selectCurrentData)
    const currentMinValue = useSelector(session.selectCurrentMinValue)
    const currentMaxValue = useSelector(session.selectCurrentMaxValue)
    const redrawKey = useSelector(session.selectRedrawKey)

    // local state
    const [currentView, setCurrentView] = useState(views[0])
    const [viewToggleCurrentImg, setViewToggleCurrentImg] = useState(views[0])
    const [indicatorName, setIndicatorName] = useState(undefined)
    const [indicatorDescription, setIndicatorDescription] = useState(undefined)
    const [currentHeading, setHeading] = useState("Loading")
    const [isDownloadingCsv, setIsDownloadingCsv] = useState(false)

    const unverified =
        heartbeat && isAuthenticated && extendedUser !== undefined && extendedUser?.email_verified !== true
    const unapproved =
        heartbeat &&
        isAuthenticated &&
        extendedUser?.email_verified === true &&
        !extendedUser?.app_metadata?.roles.includes("Free")
    const approved =
        heartbeat &&
        isAuthenticated &&
        extendedUser?.email_verified === true &&
        extendedUser?.app_metadata?.roles.includes("Free")

    // scale, bins and other viz-related settings
    const [colourScale, setColourScale] = useState(colourScales[0])
    const [showMenu, setShowMenu] = useState(approved)

    const getNextView = () => {
        return views[(views.indexOf(currentView) + 1) % views.length]
    }

    const downloadCSV = async () => {
        console.log("downloading CSV")
        const element = document.createElement("a")
        const query_parameters = {
            category_id: currentIndicator.category_id,
            indicator_id: currentIndicator.indicator_id,
            srid: currentSpatialResolution.srid,
            trid: currentTemporalResolution.trid,
            start_date: currentAvailableTimeRange[0],
            duration: currentAvailableTimeRange.length
        }
        if (env.GA_ID !== "") {
            ReactGA.event("csv_download", query_parameters)
        }
        setIsDownloadingCsv(true)
        const csv_string = await api.csv(auth0AccessToken, query_parameters)
        const file = new Blob([csv_string], {
            type: "text/plain"
        })
        element.href = URL.createObjectURL(file)
        element.download = `${currentIndicator.indicator_id}_${currentAvailableTimeRange[0]}_${
            currentAvailableTimeRange[currentAvailableTimeRange.length - 1]
        }.csv`
        element.click()
        URL.revokeObjectURL(element.href)
        setIsDownloadingCsv(false)
    }

    // // dismiss modal for authenticated users and expand indicators menu
    useEffect(() => {
        if (env.REACT_APP_MAINTAINENCE_MODE !== "") {
            return
        }
        if (!isAuthenticated) {
            return
        }
        const dismissModal = async () => {
            setShowMenu(true)
            dispatch(setModal(undefined))
        }
        dismissModal()
    }, [isAuthenticated])

    // initialise modal. this will be shown only once upon page load.
    useEffect(() => {
        if (env.REACT_APP_MAINTAINENCE_MODE !== "")
            dispatch(
                setModal({
                    heading: t("dashboard.maintainence_title"),
                    text: <FMTrans k="dashboard.maintainence_text" />,
                    ok: t("dashboard.maintainence_approve"),
                    onSuccess: () => navigate("/")
                })
            )
        else if (unapproved) {
            dispatch(
                setModal({
                    heading: t("dashboard.unapproved1"),
                    text: <FMTrans k="dashboard.unapproved2" />,
                    ok: t("dashboard.wait_for_approval"),
                    onSuccess: () => logout({ returnTo: `${window.location.origin}/logged-out` })
                })
            )
        } else if (unverified) {
            dispatch(
                setModal({
                    heading: t("dashboard.unverified1"),
                    text: <FMTrans k="dashboard.unverified2" />,
                    ok: t("dashboard.verify email"),
                    onSuccess: () => logout({ returnTo: `${window.location.origin}/logged-out` })
                })
            )
        } else if (!isAuthenticated) {
            dispatch(
                setModal({
                    heading: t("dashboard.logged_out1"),
                    text: <FMTrans k="dashboard.logged_out2" />,
                    ok: t("dashboard.login"),
                    cancel: t("dashboard.register"),
                    onSuccess: () => loginWithRedirect(),
                    onCancel: () => navigate("/register")
                })
            )
        }
    }, [])

    // one-off getting of initial data which is then cached and reused
    useEffect(() => {
        // only get from server if we don't already have it
        if (auth0AccessToken === undefined || allCategories !== undefined || allIndicators !== undefined) {
            return
        }
        const getInitialData = async () => {
            if (initialised.current) {
                return
            }

            dispatch(setLoadingMessage(t("dashboard.loading_categories")))
            const categories = await api.availableCategories(auth0AccessToken)
            if (categories !== undefined) {
                categories.sort((a, b) => a.order > b.order)
                dispatch(setAllCategories(categories))
            }
            console.debug(`Loaded ${categories?.length || 0} categories from backend`)

            dispatch(setLoadingMessage(t("dashboard.loading_indicators")))
            const indicators = await api.availableIndicators(auth0AccessToken)
            if (indicators !== undefined) {
                dispatch(setAllIndicators(indicators))
            }
            console.debug(`Loaded ${indicators?.length || 0} indicators from backend`)

            // get list of all spatial resolutions for that country (without boundaries)
            const countrySpatialResolutions = await api.countrySpatialResolutions(auth0AccessToken)
            dispatch(setCountrySpatialResolutions(countrySpatialResolutions))

            dispatch(setLoadingMessage())
            initialised.current = true
        }
        getInitialData()
    }, [auth0AccessToken, allCategories, allIndicators])

    // run every time the category changes
    useEffect(() => {
        const resetParameters = async () => {
            if (!auth0AccessToken || !currentCategory || !allIndicators) {
                return
            }

            console.debug("Resetting dashboard parameters")
            dispatch(setCurrentIndicator(undefined))
            dispatch(setCurrentSpatialResolution(undefined))
            dispatch(setCurrentTemporalResolution(undefined))
            dispatch(setSelectedTimeRangeForCurrentData(undefined))
            dispatch(setSelectedTimeEntity(undefined))
            dispatch(setCurrentMinValue(undefined))
            dispatch(setCurrentMaxValue(undefined))
            dispatch(setCurrentData(undefined))
            setIndicatorName(undefined)
            setIndicatorDescription(undefined)

            // TODO: Remove this once a fixed view for graph and table is available for these
            if (
                ["trips_indicators_people", "relocations_indicators_people"].indexOf(currentCategory.category_id) !== -1
            ) {
                console.debug("Resetting view to map")
                setCurrentView("map")
            }

            // setting default indicator (first in category)
            const indicatorsForNewCategory = allIndicators.filter(i => i.category_id === currentCategory.category_id)
            const newIndicator = indicatorsForCurrentCategory.length > 0 ? indicatorsForNewCategory[0] : undefined
            console.debug(
                `Selecting default indicator ${newIndicator.indicator_id} for category ${currentCategory.category_id}`
            )
            dispatch(setCurrentIndicator(newIndicator))

            // processing temporal resolutions first as spatial resolutions will trigger loading boundaries
            let tr = undefined
            if (!temporalResolutionsForCurrentCategory || temporalResolutionsForCurrentCategory?.length <= 0) {
                console.debug(`Updating available temporal resolutions for category ${currentCategory?.category_id}...`)
                dispatch(setLoadingMessage(t("dashboard.loading_sr")))
                const trs = await api.availableTemporalResolutions(
                    currentCategory?.category_id || "null",
                    auth0AccessToken
                )
                dispatch(addTemporalResolutions([currentCategory?.category_id, trs]))
                dispatch(setLoadingMessage())
                // use the lowest resolution available as default
                if (trs.length > 0) {
                    tr = trs[0]
                }
            } else {
                tr =
                    temporalResolutionsForCurrentCategory.length > 0
                        ? temporalResolutionsForCurrentCategory[0]
                        : undefined
            }
            console.debug(
                `Selecting default temporal resolution ${tr?.label} for category ${currentCategory?.category_id}`
            )
            dispatch(setCurrentTemporalResolution(tr))

            let sr = undefined
            if (!spatialResolutionsForCurrentCategory || spatialResolutionsForCurrentCategory?.length <= 0) {
                console.debug(`Updating available spatial resolutions for category ${currentCategory?.category_id}...`)
                dispatch(setLoadingMessage(t("dashboard.loading_sr")))
                const srs = await api.availableSpatialResolutions(
                    currentCategory?.category_id || "null",
                    auth0AccessToken
                )
                dispatch(addSpatialResolutions([currentCategory?.category_id, srs]))
                dispatch(setLoadingMessage())
                // use the lowest resolution available as default
                if (srs.length > 0) {
                    sr = srs[0]
                }
            } else {
                sr =
                    spatialResolutionsForCurrentCategory.length > 0
                        ? spatialResolutionsForCurrentCategory[0]
                        : undefined
            }
            console.debug(
                `Selecting default spatial resolution ${sr?.label} for category ${currentCategory?.category_id}`
            )
            dispatch(setCurrentSpatialResolution(sr))
        }
        resetParameters()
    }, [auth0AccessToken, currentCategory, allIndicators])

    // update current boundaries every time the spatial resolution changes (this is also triggered by category changes)
    useEffect(() => {
        const updateBoundaries = async () => {
            if (!auth0AccessToken || !currentSpatialResolution) {
                return
            }

            // load and cache boundaries if we haven't got them yet
            if (!currentBoundaries) {
                console.debug(
                    `Getting boundaries for ${currentSpatialResolution?.label} (${currentSpatialResolution?.srid}) from backend`
                )
                dispatch(setLoadingMessage(t("dashboard.loading_boundaries")))
                const response = await api.boundaries(auth0AccessToken, currentSpatialResolution?.srid || 0)
                let boundaries = response?.boundaries

                if (!boundaries?.type) {
                    console.error("No compatible boundaries to display")
                    return
                }

                // support topojson (convert to GeoJSON)
                if (boundaries?.type === "Topology") {
                    for (let key in boundaries?.objects) {
                        boundaries = topojson.feature(boundaries, boundaries.objects[key])
                    }
                }
                dispatch(addBoundariesToCache([currentSpatialResolution?.srid, boundaries]))
                dispatch(setLoadingMessage())
            } else {
                console.debug(
                    `Using cached boundaries for ${currentSpatialResolution?.label} (${currentSpatialResolution?.srid})`
                )
            }
        }
        updateBoundaries()
    }, [auth0AccessToken, currentSpatialResolution])

    // select new date every time any of the parameters changes
    useEffect(() => {
        if (
            currentCategory === undefined ||
            currentIndicator === undefined ||
            currentSpatialResolution === undefined ||
            currentTemporalResolution === undefined ||
            currentIndicator.category_id !== currentCategory.category_id
        ) {
            return
        }
        const newColourScale =
            currentIndicator?.scale === "sequential"
                ? colourScales[0]
                : currentIndicator?.scale === "diverging"
                ? colourScales[1]
                : colourScales[2]
        console.log("Changing colour scale to", newColourScale)
        setColourScale(newColourScale)
        const getCurrentAvailableTimeRange = async () => {
            console.debug(
                `Getting available time range for ${currentCategory.category_id}:${currentIndicator.indicator_id} at ${currentSpatialResolution?.label} per ${currentTemporalResolution?.label}`
            )
            dispatch(setLoadingMessage(t("dashboard.loading_data")))

            let response = await api.timerange(
                auth0AccessToken,
                currentCategory?.category_id,
                currentIndicator?.indicator_id,
                currentSpatialResolution.srid,
                currentTemporalResolution.trid
            )
            if (!response?.all_dates || response?.all_dates?.length <= 0) {
                console.error("Could not read available time range")
                return
            }
            const availableTimeRange = response.all_dates
            dispatch(setCurrentAvailableTimeRange(availableTimeRange))
            console.debug("Available time range: ", availableTimeRange)

            // set the selected time range to the first x as defined by the temporal resolution config
            const defaultRange = currentTemporalResolution?.default_selected || 20
            let range = availableTimeRange.length
            if (range > defaultRange) {
                console.debug(`Capping selected time range ${range} at ${defaultRange}`)
                range = defaultRange
            }
            const selectedStartIndex = availableTimeRange.length - range
            const selectedEndIndex = availableTimeRange.length - 1
            console.debug(
                `Selecting time range ${availableTimeRange[selectedStartIndex]} - ${availableTimeRange[selectedEndIndex]} (${range})`
            )
            const newTimeRange = [selectedStartIndex, selectedEndIndex]
            dispatch(setSelectedTimeRangeForCurrentData(newTimeRange))

            // store min/max values for this time range
            // TODO: ideally we change this to return time range across *all* values
            // - for now it's just for this time range which is better than for each time entity.
            let min = Infinity
            let max = -Infinity
            // if min AND max value have not been specified in the metadata, we use the actual data values
            const fixedMinMax = currentIndicator?.min_value !== null && currentIndicator?.max_value !== null
            if (!fixedMinMax) {
                min = response.min_value
                max = response.max_value
            } else {
                min = currentIndicator?.min_value
                max = currentIndicator?.max_value
            }

            // adjust min/max to be symmetric for diverging scales
            if (!fixedMinMax && min < 0 && max > 0 && currentIndicator?.scale === "diverging") {
                const abs = Math.max(...[Math.abs(min), Math.abs(max)])
                min = -abs
                max = abs
            }

            console.debug(`Using min/max data values ${min}/${max}`)
            dispatch(setCurrentMinValue(min))
            dispatch(setCurrentMaxValue(max))

            // use calendar-style date picker for lower temporal resolution; range slider otherwise
            if (currentTemporalResolution.relativedelta_unit === "days") {
                dispatch(setCurrentStartDate(util.getFormattedDate(new Date(availableTimeRange[selectedStartIndex]))))
                dispatch(setCurrentEndDate(util.getFormattedDate(new Date(availableTimeRange[selectedEndIndex]))))
            } else {
                dispatch(setCurrentStartDate(undefined))
                dispatch(setCurrentEndDate(undefined))
            }
            dispatch(setRedrawKey(uuidv4()))
            dispatch(setLoadingMessage())
        }
        getCurrentAvailableTimeRange()
    }, [auth0AccessToken, currentCategory, currentIndicator, currentSpatialResolution, currentTemporalResolution])

    // select a scale depending on the data values
    useEffect(() => {
        if (currentIndicator === undefined) {
            return
        }
        let scale =
            currentIndicator?.scale === "sequential"
                ? colourScales[0]
                : currentIndicator?.scale === "diverging"
                ? colourScales[1]
                : undefined
        // guess best scale if none is defined
        if (scale === undefined) {
            if (currentMinValue && currentMaxValue && currentMinValue < 0 && currentMaxValue > 0) {
                // diverging if we have positive and negative values
                scale = colourScales[1]
            } else if (
                currentMinValue &&
                currentMaxValue &&
                ((currentMinValue < 0 && currentMaxValue < 0) || (currentMinValue > 0 && currentMaxValue > 0))
            ) {
                // sequential is all values are either positive or negative
                scale = colourScales[0]
            } else {
                // use qualitative scale as fallback
                scale = colourScales[2]
            }
        }
        setColourScale(scale)
    }, [currentMinValue, currentMaxValue])

    // update indicator text depending on langauge
    useEffect(() => {
        if (currentIndicator !== undefined) {
            const labelKey = `label_${i18n.language}`
            const descKey = `description_${i18n.language}`
            const label = Object.keys(currentIndicator).includes(labelKey)
                ? currentIndicator[labelKey]
                : currentIndicator.label
            const desc = Object.keys(currentIndicator).includes(descKey)
                ? currentIndicator[descKey]
                : currentIndicator.description
            setIndicatorName(label)
            setIndicatorDescription(desc)
        } else {
            setIndicatorName(t("dashboard.select_indicator"))
            setIndicatorDescription(t("dashboard.select_indicator_text"))
        }
    }, [i18n.language, currentIndicator])

    useEffect(() => {
        if (currentAvailableTimeRange && selectedTimeEntity && currentCategory && currentTemporalResolution) {
            const current_date = currentAvailableTimeRange[selectedTimeEntity]
            if (currentCategory?.type === "flow" && current_date) {
                const frm_str = currentTemporalResolution.date_format
                    .replace("%Y", "yyyy")
                    .replace("%m", "MM")
                    .replace("%d", "dd")
                const month = DateTime.fromFormat(current_date, frm_str)
                const lastmonth = month.minus({ [currentTemporalResolution.relativedelta_unit]: 1 }).toFormat(frm_str)
                setHeading(lastmonth + " to " + month.toFormat(frm_str))
            } else setHeading(current_date)
        }
    }, [currentAvailableTimeRange, selectedTimeEntity, currentIndicator, currentTemporalResolution])

    function csv_button(is_downloading) {
        if (!is_downloading)
            return (
                <Button variant="secondary" onClick={() => downloadCSV()}>
                    {t("dashboard.download")}
                </Button>
            )
        else
            return (
                <Button variant="secondary.inactive" disabled>
                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />{" "}
                    {t("dashboard.loading")}
                </Button>
            )
    }

    return (
        <div
            className={`${styles.Dashboard} Dashboard ${approved ? styles.approved : styles.unapproved}`}
            data-testid="Dashboard"
        >
            <div className={styles.Wrapper}>
                {!heartbeat && <Disconnected />}
                {heartbeat && (
                    <>
                        <Menu collapsed={!showMenu} />

                        <div className={styles.Content}>
                            <div className={styles.MapInfo}>
                                <div className={styles.Description}>
                                    <h2>
                                        {t("dashboard.indicators_metrics")}: {indicatorName}
                                    </h2>
                                    <ReactMarkdown
                                        skipHtml={false}
                                        allowDangerousHtml={true}
                                        linkTarget="_blank"
                                        children={indicatorDescription}
                                    />
                                </div>
                                <div className={styles.Space}></div>
                                <div className={styles.Buttons}>
                                    {currentCategory && currentIndicator && (
                                        <>
                                            {csv_button(isDownloadingCsv)}
                                            <div
                                                className={styles.MapToggle}
                                                title={`${t("dashboard.switch_to")} ${t(
                                                    `dashboard.${getNextView()}_view`
                                                )}`}
                                                onClick={() => {
                                                    const nextView = getNextView()
                                                    console.debug(`Switching to "${nextView}" view`)
                                                    setCurrentView(nextView)
                                                    dispatch(setRedrawKey(uuidv4()))
                                                }}
                                            >
                                                <img
                                                    src={
                                                        viewToggleCurrentImg === "map"
                                                            ? img_world
                                                            : viewToggleCurrentImg === "graph"
                                                            ? img_graph
                                                            : img_table
                                                    }
                                                    alt={
                                                        viewToggleCurrentImg === "map"
                                                            ? t("dashboard.map_view")
                                                            : viewToggleCurrentImg === "graph"
                                                            ? t("dashboard.graph_view")
                                                            : t("dashboard.table_view")
                                                    }
                                                    onMouseEnter={() => setViewToggleCurrentImg(getNextView())}
                                                    onMouseLeave={() => setViewToggleCurrentImg(currentView)}
                                                />
                                                <span>
                                                    {viewToggleCurrentImg
                                                        .split("_")
                                                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                                        .join(" ")}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {currentView === "map" && (
                                <MapView
                                    type={currentCategory?.type}
                                    boundaries={currentBoundaries}
                                    timeRange={currentAvailableTimeRange}
                                    selectedTimeEntity={selectedTimeEntity}
                                    indicator={currentIndicator}
                                    heading={currentHeading}
                                    decimals={currentIndicator?.decimals}
                                    minValue={currentMinValue}
                                    maxValue={currentMaxValue}
                                    data={currentData}
                                    redrawKey={redrawKey}
                                    colourScale={colourScale?.scale}
                                />
                            )}
                            {currentView === "graph" && (
                                <GraphView
                                    type={currentCategory?.type}
                                    timeRange={currentAvailableTimeRange}
                                    selectedTimeEntity={selectedTimeEntity}
                                    data={currentData}
                                    currentSpatialResolution={currentSpatialResolution}
                                    spatialEntities={currentBoundaries?.features.map(f => f.properties) || []}
                                    labels={currentLabels}
                                    heading={currentHeading}
                                    decimals={currentIndicator?.decimals}
                                    minValue={currentMinValue}
                                    maxValue={currentMaxValue}
                                    colourScale={colourScale?.scale}
                                />
                            )}
                            {currentView === "table" && (
                                <TableView
                                    type={currentCategory?.type}
                                    timeRange={currentAvailableTimeRange}
                                    selectedTimeEntity={selectedTimeEntity}
                                    data={currentData}
                                    labels={currentLabels}
                                    heading={currentHeading}
                                />
                            )}
                            <CurrentTimeUnitSlider />
                        </div>
                    </>
                )}
            </div>
            <div className={styles.bottomBar}>
                <span className={styles.BackendConnection}>
                    {heartbeat && (
                        <>
                            <img src={img_online} alt="Connected" title={JSON.stringify(heartbeat, null, 4)} />
                            {t("dashboard.connected")}
                        </>
                    )}
                    {!heartbeat && (
                        <>
                            <img src={img_offline} alt="Disconnected" title="Disconnected" />
                            {t("dashboard.not_connected")}
                        </>
                    )}
                </span>
                <span className={styles.GitSHA}>
                    {(env.REACT_APP_GIT_BRANCH || env.REACT_APP_GIT_SHA) && `${t("dashboard.version")}:`}
                    {env.REACT_APP_GIT_SHA ? ` ${env.REACT_APP_GIT_SHA.substring(0, 7)}` : ""}
                    {env.REACT_APP_GIT_BRANCH && ` (${env.REACT_APP_GIT_BRANCH})`}
                </span>
            </div>
        </div>
    )
}

export default Dashboard

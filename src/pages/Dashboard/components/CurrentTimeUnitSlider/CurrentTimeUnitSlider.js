// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useSelector, useDispatch } from "react-redux"
import styles from "./CurrentTimeUnitSlider.module.css"
import { useTranslation } from "react-i18next"
import { setSelectedTimeEntity, setCurrentData, setRedrawKey } from "../../../../components/SessionArea/sessionSlice"
import session from "../../../../components/SessionArea/sessionSlice.selectors"
import { FMSlider } from "../../../../components"
import api from "../../../../app/api"
import { v4 as uuidv4 } from "uuid"

const CurrentTimeUnitSlider = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const auth0AccessToken = useSelector(session.selectAuth0AccessToken)
    const currentAvailableTimeRange = useSelector(session.selectCurrentAvailableTimeRange)
    const selectedTimeRangeForCurrentData = useSelector(session.selectSelectedTimeRangeForCurrentData)
    const selectedTimeEntity = useSelector(session.selectSelectedTimeEntity)
    const currentCategory = useSelector(session.selectCurrentCategory)
    const currentIndicator = useSelector(session.selectCurrentIndicator)
    const currentSpatialResolution = useSelector(session.selectCurrentSpatialResolution)
    const currentTemporalResolution = useSelector(session.selectCurrentTemporalResolution)

    // local state
    const [previouslySelectedTimeRangeForCurrentData, setPreviouslySelectedTimeRangeForCurrentData] =
        useState(undefined)
    const [previouslySelectedTimeEntity, setPreviouslySelectedTimeEntity] = useState(undefined)
    const [previousTemporalResolution, setPreviousTemporalResolution] = useState(undefined)
    const [labels, setLabels] = useState([])

    // hang on to previous values when category changes
    useEffect(() => {
        const savePreviousValues = async () => {
            if (!currentCategory) {
                return
            }

            // cache selected values temporarily
            // this helps determine whether we can keep the currently selected time unit or fall back to the default
            setPreviouslySelectedTimeRangeForCurrentData(selectedTimeRangeForCurrentData)
            setPreviouslySelectedTimeEntity(selectedTimeEntity)
            setPreviousTemporalResolution(currentTemporalResolution)
        }
        savePreviousValues()
    }, [currentCategory])

    // sets the labels of a given range to be 'month-1 - month'
    useEffect(() => {
        if (currentAvailableTimeRange && currentCategory.type === "flow") {
            const frm_str = currentTemporalResolution.date_format
                .replace("%Y", "yyyy")
                .replace("%m", "MM")
                .replace("%d", "dd")
            setLabels(
                currentAvailableTimeRange.map(month_str => {
                    const month = DateTime.fromFormat(month_str, frm_str)
                    const lastmonth = month
                        .minus({ [currentTemporalResolution.relativedelta_unit]: 1 })
                        .toFormat(frm_str)
                    return lastmonth + " to " + month.toFormat(frm_str)
                })
            )
        } else setLabels(currentAvailableTimeRange)
    }, [currentAvailableTimeRange])

    // selected time range is changed in data parameters (also happens on indicator change!)
    useEffect(() => {
        if (currentAvailableTimeRange === undefined || selectedTimeRangeForCurrentData === undefined) {
            return
        }
        const adjustSelectedTimeEntity = async () => {
            // start with the default: first entity in the new time range
            let newSelectedTimeEntity = [selectedTimeRangeForCurrentData[0]]
            // re-use previously selected time entity if possible
            if (
                // only works if temp resolution is the same
                previousTemporalResolution === currentTemporalResolution &&
                // only if there is a cached value
                previouslySelectedTimeEntity !== undefined &&
                // only bother checking if the ranges valid...
                selectedTimeRangeForCurrentData !== undefined &&
                previouslySelectedTimeRangeForCurrentData !== undefined &&
                Array.isArray(selectedTimeRangeForCurrentData) &&
                Array.isArray(previouslySelectedTimeRangeForCurrentData) &&
                selectedTimeRangeForCurrentData?.length === 2 &&
                previouslySelectedTimeRangeForCurrentData?.length === 2 &&
                // ... and the same
                JSON.stringify(selectedTimeRangeForCurrentData) ===
                    JSON.stringify(previouslySelectedTimeRangeForCurrentData) &&
                // only if the cached value is within the current range
                previouslySelectedTimeEntity[0] >= selectedTimeRangeForCurrentData[0] &&
                previouslySelectedTimeEntity[0] <= selectedTimeRangeForCurrentData[1]
            ) {
                newSelectedTimeEntity = selectedTimeEntity
            }

            // update "previously selected items" cache
            setPreviouslySelectedTimeRangeForCurrentData(selectedTimeRangeForCurrentData)
            setPreviouslySelectedTimeEntity(selectedTimeEntity)
            setPreviousTemporalResolution(currentTemporalResolution)

            //console.debug("Available time range: ", availableTimeRangeForCurrentData)
            //console.debug("New selected time range: ", selectedTimeRangeForCurrentData, selectedTimeRangeForCurrentData.map(t => availableTimeRangeForCurrentData[t]))
            //console.debug("Selected time entity: ", selectedTimeEntity, availableTimeRangeForCurrentData[selectedTimeEntity])
            dispatch(setSelectedTimeEntity(newSelectedTimeEntity))
            console.debug(
                "Selected time range for current data changed. New selected time entity: ",
                newSelectedTimeEntity,
                currentAvailableTimeRange[newSelectedTimeEntity]
            )
        }
        adjustSelectedTimeEntity()
    }, [selectedTimeRangeForCurrentData])

    // selected time entity is changed, e.g. using slider
    useEffect(() => {
        if (selectedTimeEntity === undefined || currentAvailableTimeRange === undefined) {
            return
        }
        const loadData = async () => {
            // ensure the selected entity is within the available range
            const newSelectedTimeEntity =
                selectedTimeEntity < selectedTimeRangeForCurrentData[0]
                    ? selectedTimeRangeForCurrentData[0]
                    : selectedTimeEntity > selectedTimeRangeForCurrentData[1]
                    ? selectedTimeRangeForCurrentData[1]
                    : selectedTimeEntity
                    ? selectedTimeEntity
                    : selectedTimeRangeForCurrentData[0]
            //dispatch(setSelectedTimeEntity(newSelectedTimeEntity))

            console.debug(
                "Loading data for selected time entity: ",
                newSelectedTimeEntity,
                currentAvailableTimeRange[newSelectedTimeEntity]
            )
            const query_parameters = {
                category_id: currentIndicator.category_id,
                indicator_id: currentIndicator.indicator_id,
                srid: currentSpatialResolution.srid,
                trid: currentTemporalResolution.trid,
                start_date: currentAvailableTimeRange[newSelectedTimeEntity],
                duration: 1
            }
            let response = await api.query(auth0AccessToken, query_parameters)
            try {
                dispatch(setCurrentData(response.data_by_date[currentAvailableTimeRange[newSelectedTimeEntity]]))
            } catch (e) {
                console.error("Invalid data received", response, e)
                return
            }

            dispatch(setRedrawKey(uuidv4()))
        }
        loadData()
    }, [currentIndicator, selectedTimeEntity])

    return (
        <div className={styles.CurrentTimeUnitSlider} data-testid="CurrentTimeUnitSlider">
            {currentAvailableTimeRange && selectedTimeRangeForCurrentData && (
                <FMSlider
                    values={[selectedTimeEntity]}
                    outerLabelsOnly={true}
                    step={1}
                    min={selectedTimeRangeForCurrentData[0]}
                    max={selectedTimeRangeForCurrentData[1]}
                    onChange={values => {
                        setPreviouslySelectedTimeEntity(selectedTimeEntity)
                        dispatch(setSelectedTimeEntity(values))
                    }}
                    labels={labels}
                    isRange={false}
                    cumulative={false}
                    outputIsVisible={false}
                />
            )}
            {(!currentAvailableTimeRange || !selectedTimeRangeForCurrentData) && (
                <span className={styles.Info}>{t("dashboard.slider_text")}</span>
            )}
        </div>
    )
}

export default CurrentTimeUnitSlider

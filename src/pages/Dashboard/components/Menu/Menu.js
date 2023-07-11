// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { forwardRef, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DateTime } from "luxon"
import styles from "./Menu.module.css"
import util from "../../../../app/util"
import DatePicker from "react-datepicker"
import { useTranslation } from "react-i18next"
import { ButtonGroup, ToggleButton, Accordion } from "react-bootstrap"
import {
    setCurrentCategory,
    setCurrentEndDate,
    setCurrentIndicator,
    setCurrentMaxValue,
    setCurrentMinValue,
    setCurrentSpatialResolution,
    setCurrentStartDate,
    setCurrentTemporalResolution,
    setSelectedTimeRangeForCurrentData
} from "../../../../components/SessionArea/sessionSlice"
import session from "../../../../components/SessionArea/sessionSlice.selectors"
import { FMSlider, FMSelect } from "../../../../components"

const Menu = ({ collapsed = false }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()

    const allCategories = useSelector(session.selectAllCategories)
    const currentCategory = useSelector(session.selectCurrentCategory)
    const currentIndicator = useSelector(session.selectCurrentIndicator)
    const currentSpatialResolution = useSelector(session.selectCurrentSpatialResolution)
    const currentTemporalResolution = useSelector(session.selectCurrentTemporalResolution)
    const indicatorsForCurrentCategory = useSelector(session.selectIndicatorsForCurrentCategory)
    const spatialResolutionsForCurrentCategory = useSelector(session.selectSpatialResolutionsForCurrentCategory)
    const temporalResolutionsForCurrentCategory = useSelector(session.selectTemporalResolutionsForCurrentCategory)
    const currentAvailableTimeRange = useSelector(session.selectCurrentAvailableTimeRange)
    const selectedTimeRangeForCurrentData = useSelector(session.selectSelectedTimeRangeForCurrentData)
    const currentStartDate = useSelector(session.selectCurrentStartDate)
    const currentEndDate = useSelector(session.selectCurrentEndDate)
    const currentMinValue = useSelector(session.selectCurrentMinValue)
    const currentMaxValue = useSelector(session.selectCurrentMaxValue)

    const [activeKey, setActiveKey] = useState(!collapsed ? "0" : undefined)

    const DateRangeInput = forwardRef(({ value, onClick }, ref) => (
        <button className={styles.datePicker} onClick={onClick} ref={ref}>
            {value}
        </button>
    ))

    useEffect(() => {
        setActiveKey(!collapsed ? ["0"] : undefined)
    }, [collapsed])

    return (
        <div className={styles.Menu} data-testid="Menu">
            <div className={styles.MenuItem}>
                <Accordion
                    activeKey={activeKey}
                    onSelect={eventKey => {
                        setActiveKey(eventKey)
                    }}
                    flush
                >
                    <Accordion.Item eventKey="0" className={styles.AccordionItem}>
                        <Accordion.Header>{t("dashboard.indicators_metrics")}</Accordion.Header>
                        <Accordion.Body>
                            <h3>{t("dashboard.select_category")}</h3>
                            <ButtonGroup vertical={true} className={styles.fullWidth}>
                                {allCategories &&
                                    allCategories.map(c => (
                                        <ToggleButton
                                            className={c === currentCategory ? styles.selected : ""}
                                            key={c.category_id}
                                            id={`radio-${c.category_id}`}
                                            type="radio"
                                            variant="primary"
                                            name="radio-data-products"
                                            value={c}
                                            checked={currentCategory === c}
                                            onClick={e => {
                                                dispatch(setCurrentCategory(c))
                                            }}
                                        >
                                            {i18n?.resolvedLanguage === "fr" ? c?.label_fr : c?.label}
                                        </ToggleButton>
                                    ))}
                            </ButtonGroup>
                            <div className={styles.FMSelect}>
                                <FMSelect
                                    style={{ marginTop: "20px" }}
                                    isDisabled={!currentCategory}
                                    options={
                                        indicatorsForCurrentCategory?.map(i => {
                                            return {
                                                value: i.indicator_id,
                                                label:
                                                    i !== undefined &&
                                                    Object.keys(i).includes(`label_${i18n?.resolvedLanguage}`)
                                                        ? i[`label_${i18n?.resolvedLanguage}`]
                                                        : i?.label
                                            }
                                        }) || []
                                    }
                                    placeholder={t("dashboard.select_indicator_prompt")}
                                    value={
                                        currentIndicator
                                            ? {
                                                  value: currentIndicator.indicator_id,
                                                  label:
                                                      currentIndicator !== undefined &&
                                                      Object.keys(currentIndicator).includes(
                                                          `label_${i18n?.resolvedLanguage}`
                                                      )
                                                          ? currentIndicator?.[`label_${i18n?.resolvedLanguage}`]
                                                          : currentIndicator?.label
                                              }
                                            : null
                                    }
                                    onChange={newIndicator => {
                                        const indicator = indicatorsForCurrentCategory.filter(
                                            i => i.indicator_id === newIndicator.value
                                        )[0]
                                        dispatch(setCurrentIndicator(indicator))
                                    }}
                                />
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className={`${styles.DataParameters} ${styles.AccordionItem}`}>
                        <Accordion.Header>{t("dashboard.data_parameters")}</Accordion.Header>
                        <Accordion.Body>
                            {(currentCategory === undefined || currentIndicator === undefined) && (
                                <p>{t("dashboard.data_parameters_text")}</p>
                            )}
                            {currentCategory !== undefined && currentIndicator !== undefined && (
                                <>
                                    <div>
                                        <h3>{t("dashboard.spatial_resolution")}</h3>
                                        {spatialResolutionsForCurrentCategory?.length > 1 && (
                                            <FMSlider
                                                values={[currentSpatialResolution?.index]}
                                                step={1}
                                                min={
                                                    spatialResolutionsForCurrentCategory
                                                        ? Math.min(
                                                              ...spatialResolutionsForCurrentCategory?.map(
                                                                  sr => sr.index
                                                              )
                                                          )
                                                        : 0
                                                }
                                                max={
                                                    spatialResolutionsForCurrentCategory
                                                        ? Math.max(
                                                              ...spatialResolutionsForCurrentCategory?.map(
                                                                  sr => sr.index
                                                              )
                                                          )
                                                        : 1
                                                }
                                                onChange={value =>
                                                    dispatch(
                                                        setCurrentSpatialResolution(
                                                            spatialResolutionsForCurrentCategory?.find(
                                                                sr => sr.index === value[0]
                                                            )
                                                        )
                                                    )
                                                }
                                                labels={
                                                    spatialResolutionsForCurrentCategory
                                                        ? spatialResolutionsForCurrentCategory?.reduce(
                                                              (ac, a) => ({
                                                                  ...ac,
                                                                  [a.index]:
                                                                      a !== undefined &&
                                                                      Object.keys(a).includes(
                                                                          `label_${i18n?.resolvedLanguage}`
                                                                      )
                                                                          ? a[`label_${i18n?.resolvedLanguage}`]
                                                                          : a?.label
                                                              }),
                                                              {}
                                                          )
                                                        : {}
                                                }
                                                isRange={false}
                                                cumulative={true}
                                                outputIsVisible={false}
                                            />
                                        )}
                                        {spatialResolutionsForCurrentCategory?.length === 1 && (
                                            <p>
                                                {spatialResolutionsForCurrentCategory[0] !== undefined &&
                                                Object.keys(spatialResolutionsForCurrentCategory[0]).includes(
                                                    `label_${i18n?.resolvedLanguage}`
                                                )
                                                    ? spatialResolutionsForCurrentCategory[0][
                                                          `label_${i18n?.resolvedLanguage}`
                                                      ]
                                                    : spatialResolutionsForCurrentCategory[0]?.label}
                                            </p>
                                        )}
                                        {spatialResolutionsForCurrentCategory?.length <= 0 && (
                                            <p>Sorry, no spatial resolutions available</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3>{t("dashboard.temporal_resolution")}</h3>
                                        {temporalResolutionsForCurrentCategory?.length > 1 && (
                                            <FMSlider
                                                values={[currentTemporalResolution?.index]}
                                                step={1}
                                                min={
                                                    temporalResolutionsForCurrentCategory
                                                        ? Math.min(
                                                              ...temporalResolutionsForCurrentCategory?.map(
                                                                  tr => tr.index
                                                              )
                                                          )
                                                        : 0
                                                }
                                                max={
                                                    temporalResolutionsForCurrentCategory
                                                        ? Math.max(
                                                              ...temporalResolutionsForCurrentCategory?.map(
                                                                  tr => tr.index
                                                              )
                                                          )
                                                        : 1
                                                }
                                                onChange={value =>
                                                    dispatch(
                                                        setCurrentTemporalResolution(
                                                            temporalResolutionsForCurrentCategory?.find(
                                                                tr => tr.index === value[0]
                                                            )
                                                        )
                                                    )
                                                }
                                                labels={
                                                    temporalResolutionsForCurrentCategory
                                                        ? temporalResolutionsForCurrentCategory?.reduce(
                                                              (ac, a) => ({
                                                                  ...ac,
                                                                  [a.index]:
                                                                      a !== undefined &&
                                                                      Object.keys(a).includes(
                                                                          `label_${i18n?.resolvedLanguage}`
                                                                      )
                                                                          ? a[`label_${i18n?.resolvedLanguage}`]
                                                                          : a?.label
                                                              }),
                                                              {}
                                                          )
                                                        : {}
                                                }
                                                isRange={false}
                                                cumulative={true}
                                                outputIsVisible={false}
                                            />
                                        )}
                                        {temporalResolutionsForCurrentCategory?.length === 1 && (
                                            <p>
                                                {temporalResolutionsForCurrentCategory[0] !== undefined &&
                                                Object.keys(temporalResolutionsForCurrentCategory[0]).includes(
                                                    `label_${i18n?.resolvedLanguage}`
                                                )
                                                    ? temporalResolutionsForCurrentCategory[0][
                                                          `label_${i18n?.resolvedLanguage}`
                                                      ]
                                                    : temporalResolutionsForCurrentCategory[0]?.label}
                                            </p>
                                        )}
                                        {temporalResolutionsForCurrentCategory?.length <= 0 && (
                                            <p>Sorry, no temporal resolutions available</p>
                                        )}
                                    </div>
                                    {currentAvailableTimeRange && (
                                        <div>
                                            <h3>{t("dashboard.dates")}</h3>
                                            {currentTemporalResolution?.relativedelta_unit !== "days" && (
                                                <FMSlider
                                                    values={selectedTimeRangeForCurrentData}
                                                    outerLabelsOnly={true}
                                                    step={1}
                                                    min={0}
                                                    max={currentAvailableTimeRange?.length - 1}
                                                    onChange={values => {
                                                        dispatch(setSelectedTimeRangeForCurrentData(values))
                                                    }}
                                                    labels={currentAvailableTimeRange.map(month_str => {
                                                        const month = DateTime.fromFormat(month_str, "y-MM")
                                                        const lastmonth = month.minus({ months: 1 }).toFormat("y-MM")
                                                        return lastmonth + "\nto\n" + month.toFormat("y-MM")
                                                    })}
                                                    isRange={true}
                                                    cumulative={false}
                                                    outputIsVisible={false}
                                                />
                                            )}
                                            {currentTemporalResolution?.relativedelta_unit === "days" && (
                                                <DatePicker
                                                    dateFormat="yyyy/MM/dd"
                                                    // TODO: support french?
                                                    locale="en-GB"
                                                    placeholderText={t("dashboard.dates_hint")}
                                                    minDate={
                                                        currentAvailableTimeRange[0]
                                                            ? new Date(currentAvailableTimeRange[0])
                                                            : undefined
                                                    }
                                                    maxDate={
                                                        currentAvailableTimeRange[currentAvailableTimeRange.length - 1]
                                                            ? new Date(
                                                                  currentAvailableTimeRange[
                                                                      currentAvailableTimeRange.length - 1
                                                                  ]
                                                              )
                                                            : undefined
                                                    }
                                                    openToDate={
                                                        currentStartDate ? new Date(currentStartDate) : undefined
                                                    }
                                                    startDate={
                                                        currentStartDate ? new Date(currentStartDate) : undefined
                                                    }
                                                    endDate={currentEndDate ? new Date(currentEndDate) : undefined}
                                                    onChange={dates => {
                                                        const [start, end] = dates

                                                        const startStr = util.getFormattedDate(start)
                                                        const endStr = util.getFormattedDate(end)

                                                        // when changing these, end will be undefined on the first click
                                                        dispatch(setCurrentStartDate(startStr))
                                                        dispatch(setCurrentEndDate(endStr))

                                                        // this happend when both have been set
                                                        if (start && end) {
                                                            console.debug(
                                                                `Selecting date range ${startStr} - ${endStr}`
                                                            )
                                                            dispatch(
                                                                setSelectedTimeRangeForCurrentData([
                                                                    currentAvailableTimeRange.indexOf(startStr),
                                                                    currentAvailableTimeRange.indexOf(endStr)
                                                                ])
                                                            )
                                                        }
                                                    }}
                                                    customInput={<DateRangeInput />}
                                                    selectsRange
                                                    selectsDisabledDaysInRange
                                                    showDisabledMonthNavigation
                                                    showWeekNumbers
                                                />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className={styles.AccordionItem}>
                        <Accordion.Header>{t("dashboard.map_parameters")}</Accordion.Header>
                        <Accordion.Body>
                            {!currentCategory?.type && <p>{t("dashboard.map_parameters_text")}</p>}
                            {currentCategory?.type === "single_location" && (
                                <>
                                    <h3>{t("dashboard.map_parameters_bounding")}</h3>

                                    <p>{t("dashboard.map_parameters_bounding_min")}</p>
                                    <input
                                        type="text"
                                        value={currentMinValue}
                                        onChange={e => dispatch(setCurrentMinValue(Number(e.currentTarget.value)))}
                                        pattern="^-?\d*\.?\d*$"
                                    />

                                    <p>{t("dashboard.map_parameters_bounding_max")}</p>
                                    <input
                                        type="text"
                                        value={currentMaxValue}
                                        onChange={e => dispatch(setCurrentMaxValue(Number(e.currentTarget.value)))}
                                        pattern="^-?\d*\.?\d*$"
                                    />
                                </>
                            )}
                            {currentCategory?.type === "flow" && <p>{t("dashboard.map_parameters_inexistent")}</p>}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>

            <div className={styles.EndNote}>
                <p>{t("dashboard.sidebar_info")}</p>
            </div>
        </div>
    )
}

export default Menu

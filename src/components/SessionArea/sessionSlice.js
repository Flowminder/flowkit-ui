// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    heartbeat: undefined,
    auth0IdToken: undefined,
    auth0AccessToken: undefined,
    loadingMessage: undefined,
    modal: undefined,
    dataProviders: undefined,
    allCategories: undefined,
    allIndicators: undefined,
    countrySpatialResolutions: {},
    allSpatialResolutions: {},
    allTemporalResolutions: {},

    extendedUser: undefined,

    currentCategory: undefined,
    currentIndicator: undefined,
    currentSpatialResolution: undefined,
    currentTemporalResolution: undefined,
    // usually an array containing an interval. The first value is included, the second one isn't.
    selectedTimeRangeForCurrentData: undefined,
    selectedTimeEntity: undefined,

    currentAvailableTimeRange: undefined,
    currentData: undefined,
    // the index in the array of currently available dates
    currentStartDate: undefined,
    currentEndDate: undefined,
    // the extreme values for the currently selected data
    currentMinValue: undefined,
    currentMaxValue: undefined,

    // if set we want the map to be redrawn
    redrawKey: undefined,

    cachedBoundaries: {},

    signupCache: {
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        org: undefined,
        industry: undefined,
        plan: "free",
        purpose: undefined,
        terms: false,
        no_harm: false,
        privacy: false,
        marketing: false
    }
}

const SessionSlice = createSlice({
    name: "session",
    initialState: initialState,
    reducers: {
        clear: state => initialState,
        // args: heartbeat - {}
        setHeartbeat: (state, action) => {
            state.heartbeat = action?.payload
        },
        // args: dataProviders - []
        setDataProviders: (state, action) => {
            state.dataProviders = action?.payload
        },
        // args: categories - []
        setAllCategories: (state, action) => {
            state.allCategories = action?.payload
        },
        // args: indicators - []
        setAllIndicators: (state, action) => {
            state.allIndicators = action?.payload
        },
        // args: countrySpatialResolutions - []
        setCountrySpatialResolutions: (state, action) => {
            state.countrySpatialResolutions = action?.payload
        },
        // args: categoryId, spatialResolutions - [string, {}]
        addSpatialResolutions: (state, action) => {
            const categoryId = action.payload[0]
            const spatialResolutions = action.payload[1]
            state.allSpatialResolutions[categoryId] = spatialResolutions
        },
        // args: categoryId, temporalResolutions - [string, {}]
        addTemporalResolutions: (state, action) => {
            const categoryId = action.payload[0]
            const temporalResolutions = action.payload[1]
            state.allTemporalResolutions[categoryId] = temporalResolutions
        },
        // args: token - string
        setAuth0IdToken: (state, action) => {
            state.auth0IdToken = action?.payload
        },
        // args: token - string
        setAuth0AccessToken: (state, action) => {
            state.auth0AccessToken = action?.payload
        },
        // args: extendedUser - {}
        setExtendedUser: (state, action) => {
            state.extendedUser = action?.payload
        },

        // args: message - string
        setLoadingMessage: (state, action) => {
            state.loadingMessage = action?.payload
        },

        // args: modal - {}
        setModal: (state, action) => {
            state.modal = action?.payload
        },

        // args: category - {}
        setCurrentCategory: (state, action) => {
            state.currentCategory = action?.payload
        },
        // args: indicator - {}
        setCurrentIndicator: (state, action) => {
            state.currentIndicator = action?.payload
        },
        // args: spatialResolution - {}
        setCurrentSpatialResolution: (state, action) => {
            state.currentSpatialResolution = action?.payload
        },
        // args: temporalResolution - {}
        setCurrentTemporalResolution: (state, action) => {
            state.currentTemporalResolution = action?.payload
        },
        // args: selectedTimeRangeForCurrentData - []
        setSelectedTimeRangeForCurrentData: (state, action) => {
            state.selectedTimeRangeForCurrentData = action?.payload
        },
        // args: selectedTimeEntity - [int] (an array with a single integer inside)
        setSelectedTimeEntity: (state, action) => {
            state.selectedTimeEntity = action?.payload
        },

        // args: currentAvailableTimeRange - the time range available for the current combination of category/indicator/sr/tr
        setCurrentAvailableTimeRange: (state, action) => {
            state.currentAvailableTimeRange = action?.payload
        },
        // args: currentData - the data for the currently selected time unit in the bottom slider
        setCurrentData: (state, action) => {
            state.currentData = action?.payload
        },
        // args: currentStartDate - string formatted date YYYY-MM-DD
        setCurrentStartDate: (state, action) => {
            state.currentStartDate = action?.payload
        },
        // args: currentEndDate - string formatted date YYYY-MM-DD
        setCurrentEndDate: (state, action) => {
            state.currentEndDate = action?.payload
        },
        // args: currentMinValue - Number
        setCurrentMinValue: (state, action) => {
            state.currentMinValue = action?.payload
        },
        // args: currentMaxValue - Number
        setCurrentMaxValue: (state, action) => {
            state.currentMaxValue = action?.payload
        },

        // args: redrawKey - UUID
        setRedrawKey: (state, action) => {
            state.redrawKey = action?.payload
        },

        // args: spatialResolutionId, boundaries - [string, {}]
        addBoundariesToCache: (state, action) => {
            const spatialResolutionId = String(action.payload[0])
            const boundaries = action.payload[1]
            if (!Object.keys(state.cachedBoundaries).includes(spatialResolutionId)) {
                state.cachedBoundaries[spatialResolutionId] = boundaries
            } else {
                // TODO: merge data in
            }
        },

        // args: key, value - [string, string]
        setSignupCache: (state, action) => {
            const key = action.payload[0]
            const value = action.payload[1]
            state.signupCache[key] = value
        }
    }
})

export const {
    clear,
    setHeartbeat,
    setDataProviders,
    setAllCategories,
    setAllIndicators,
    setCountrySpatialResolutions,
    addSpatialResolutions,
    addTemporalResolutions,
    setAuth0IdToken,
    setAuth0AccessToken,
    setExtendedUser,

    setLoadingMessage,
    setModal,

    setCurrentCategory,
    setCurrentIndicator,
    setCurrentSpatialResolution,
    setCurrentTemporalResolution,
    setSelectedTimeRangeForCurrentData,
    setSelectedTimeEntity,

    setCurrentAvailableTimeRange,
    setCurrentData,
    setCurrentStartDate,
    setCurrentEndDate,
    setCurrentMinValue,
    setCurrentMaxValue,

    setRedrawKey,

    addBoundariesToCache,

    setSignupCache
} = SessionSlice.actions

export default SessionSlice.reducer

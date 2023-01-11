// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Cached things from the backend/auth0
const selectHeartbeat = state => state.session.heartbeat
const selectDataProviders = state => state.session.dataProviders
const selectAllCategories = state => state.session.allCategories
const selectAllIndicators = state => state.session.allIndicators
const selectCountrySpatialResolutions = state => state.session.countrySpatialResolutions
const selectAllSpatialResolutions = state => state.session.allSpatialResolutions
const selectAllTemporalResolutions = state => state.session.allTemporalResolution
const selectAuth0IdToken = state => state.session.auth0IdToken
const selectAuth0AccessToken = state => state.session.auth0AccessToken
const selectExtendedUser = state => state.session.extendedUser

// general ui state
const selectLoadingMessage = state => state.session.loadingMessage
const selectModal = state => state.session.modal
const selectSidebarContent = state => state.session.sidebarContent

// currently selected things
const selectCurrentCategory = state => state.session.currentCategory
const selectCurrentIndicator = state => state.session.currentIndicator
const selectCurrentSpatialResolution = state => state.session.currentSpatialResolution
const selectCurrentTemporalResolution = state => state.session.currentTemporalResolution
const selectSelectedTimeRangeForCurrentData = state => state.session.selectedTimeRangeForCurrentData
const selectSelectedTimeEntity = state => state.session.selectedTimeEntity
const selectCurrentAvailableTimeRange = state => state.session.currentAvailableTimeRange
const selectCurrentData = state => state.session.currentData
const selectCurrentStartDate = state => state.session.currentStartDate
const selectCurrentEndDate = state => state.session.currentEndDate
const selectCurrentMinValue = state => state.session.currentMinValue
const selectCurrentMaxValue = state => state.session.currentMaxValue
const selectRedrawKey = state => state.session.redrawKey

const selectIndicatorsForCurrentCategory = state =>
    session.selectIndicatorsForCategory(state, session.selectCurrentCategory(state)?.category_id)
const selectSpatialResolutionsForCurrentCategory = state =>
    session.selectSpatialResolutionsForCategory(state, session.selectCurrentCategory(state)?.category_id)
const selectTemporalResolutionsForCurrentCategory = state =>
    session.selectTemporalResolutionsForCategory(state, session.selectCurrentCategory(state)?.category_id)
const selectCurrentBoundaries = state => {
    const srid = session.selectCurrentSpatialResolution(state)?.srid
    return Object.keys(state.session.cachedBoundaries).includes(String(srid))
        ? state.session.cachedBoundaries[srid]
        : undefined
}
const selectCurrentLabels = payload => state => {
    const languageSuffix = payload || ""
    const boundaries = session.selectCurrentBoundaries(state)
    if (boundaries?.features) {
        const labels = {}
        boundaries.features.forEach(f => {
            const pcode =
                f?.properties[
                    Object.keys(f?.properties)
                        .filter(o => o.endsWith("PCODE"))
                        .sort((a, b) => b.localeCompare(a))[0]
                ]
            const label =
                f?.properties[
                    Object.keys(f?.properties)
                        .filter(o => o.startsWith("ADM") && o.endsWith(languageSuffix))
                        .sort((a, b) => b.localeCompare(a))[0]
                ]
            labels[pcode] = label
        })
        return labels
    }
    return undefined
}

// "private" helper selectors
const selectIndicatorsForCategory = (state, categoryId) => {
    try {
        return state.session.allIndicators.filter(i => i.category_id === categoryId)
    } catch (e) {
        return []
    }
}
const selectSpatialResolutionsForCategory = (state, categoryId) => {
    try {
        return state.session.allSpatialResolutions[categoryId] || []
    } catch (e) {
        return []
    }
}
const selectTemporalResolutionsForCategory = (state, categoryId) => {
    try {
        return state.session.allTemporalResolutions[categoryId] || []
    } catch (e) {
        return []
    }
}

const selectSignupCache = state => state.session.signupCache

const session = {
    selectHeartbeat,
    selectDataProviders,
    selectAllCategories,
    selectAllIndicators,
    selectCountrySpatialResolutions,
    selectAllSpatialResolutions,
    selectAllTemporalResolutions,
    selectAuth0IdToken,
    selectAuth0AccessToken,
    selectExtendedUser,

    selectLoadingMessage,
    selectModal,
    selectSidebarContent,

    selectCurrentCategory,
    selectCurrentIndicator,
    selectCurrentSpatialResolution,
    selectCurrentTemporalResolution,
    selectSelectedTimeRangeForCurrentData,
    selectSelectedTimeEntity,
    selectCurrentStartDate,
    selectCurrentEndDate,
    selectCurrentMinValue,
    selectCurrentMaxValue,
    selectRedrawKey,
    selectIndicatorsForCurrentCategory,
    selectSpatialResolutionsForCurrentCategory,
    selectTemporalResolutionsForCurrentCategory,
    selectCurrentAvailableTimeRange,
    selectCurrentData,

    selectCurrentBoundaries,
    selectCurrentLabels,

    selectIndicatorsForCategory,
    selectSpatialResolutionsForCategory,
    selectTemporalResolutionsForCategory,

    selectSignupCache
}

export default session

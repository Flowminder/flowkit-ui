// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import userReducer, {
    initialState,
    clear,
    setLoadingMessage,
    setHeartbeat,
    setDataProviders,
    setAllCategories,
    setAllIndicators,
    addSpatialResolutions,
    addTemporalResolutions,
    setAuth0IdToken,
    setAuth0AccessToken,
    setExtendedUser,
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
} from "./sessionSlice"

const simpleProps = {
    heartbeat: setHeartbeat,
    dataProviders: setDataProviders,
    allCategories: setAllCategories,
    allIndicators: setAllIndicators,
    auth0IdToken: setAuth0IdToken,
    auth0AccessToken: setAuth0AccessToken,
    extendedUser: setExtendedUser,
    loadingMessage: setLoadingMessage,
    modal: setModal,
    currentCategory: setCurrentCategory,
    currentIndicator: setCurrentIndicator,
    currentSpatialResolution: setCurrentSpatialResolution,
    currentTemporalResolution: setCurrentTemporalResolution,
    selectedTimeRangeForCurrentData: setSelectedTimeRangeForCurrentData,
    selectedTimeEntity: setSelectedTimeEntity,
    currentAvailableTimeRange: setCurrentAvailableTimeRange,
    currentData: setCurrentData,
    currentStartDate: setCurrentStartDate,
    currentEndDate: setCurrentEndDate,
    currentMinValue: setCurrentMinValue,
    currentMaxValue: setCurrentMaxValue,
    redrawKey: setRedrawKey
}

const keyValueOverrideProps = {
    allSpatialResolutions: addSpatialResolutions,
    allTemporalResolutions: addTemporalResolutions,
    signupCache: setSignupCache
}

const keyValueMergeProps = {
    cachedBoundaries: addBoundariesToCache
}

describe("sessionSlice reducer", () => {
    it("should start with the initial state", () => {
        const newState = userReducer(initialState, {})
        expect(newState).toEqual(initialState)
    })

    describe("clear action", () => {
        it("should reset all session values", () => {
            const beforeState = { token: "foo" }
            expect(beforeState).not.toEqual(initialState)
            const afterState = userReducer(beforeState, clear())
            expect(afterState).toEqual(initialState)
        })
    })

    // simple properties - just test if setting works
    for (let [name, method] of Object.entries(simpleProps)) {
        describe(`${method.type} action`, () => {
            it(`should set the ${name} for the session`, () => {
                const beforeState = { ...initialState }
                const payload = "foo"
                const afterState = userReducer(beforeState, method(payload))
                expect(afterState[name]).toEqual(payload)
            })
        })
    }

    // key/value properties - override old with new value
    for (let [name, method] of Object.entries(keyValueOverrideProps)) {
        describe(`${method.type} action`, () => {
            it(`should add a key for the ${name} property`, () => {
                const beforeState = { ...initialState }
                const payload = ["key", "value"]
                const afterState = userReducer(beforeState, method(payload))
                expect(afterState[name][payload[0]]).toEqual(payload[1])
            })

            it(`should override an existing key for the ${name} property`, () => {
                const beforeState = { ...initialState }
                const payload1 = ["key", "value1"]
                const afterState1 = userReducer(beforeState, method(payload1))
                expect(afterState1[name][payload1[0]]).toEqual(payload1[1])
                const payload2 = ["key", "value2"]
                const afterState2 = userReducer(afterState1, method(payload2))
                expect(afterState2[name][payload2[0]]).toEqual(payload2[1])
            })
        })
    }

    // key/value properties - don't override; only add new values
    for (let [name, method] of Object.entries(keyValueMergeProps)) {
        describe(`${method.type} action`, () => {
            it(`should add a key for the ${name} property`, () => {
                const beforeState = { ...initialState }
                const payload = ["key", "value"]
                const afterState = userReducer(beforeState, method(payload))
                expect(afterState[name][payload[0]]).toEqual(payload[1])
            })

            it(`should NOT override an existing key for the ${name} property`, () => {
                const beforeState = { ...initialState }
                const payload1 = ["key", "value1"]
                const afterState1 = userReducer(beforeState, method(payload1))
                expect(afterState1[name][payload1[0]]).toEqual(payload1[1])
                const payload2 = ["key", "value2"]
                const afterState2 = userReducer(afterState1, method(payload2))
                expect(afterState2[name][payload2[0]]).toEqual(payload1[1])
            })
        })
    }
})

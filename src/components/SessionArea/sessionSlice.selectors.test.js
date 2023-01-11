// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import store from "../../app/store"
import session from "./sessionSlice.selectors"

const initialState = store.getState()
let state

beforeEach(async () => {
    state = { ...initialState }
})

afterEach(() => {
    jest.restoreAllMocks()
})

const simpleGetters = {
    heartbeat: session.selectHeartbeat,
    dataProviders: session.selectDataProviders,
    allCategories: session.selectAllCategories,
    allIndicators: session.selectAllIndicators,
    allSpatialResolutions: session.selectAllSpatialResolutions,
    allTemporalResolution: session.selectAllTemporalResolutions,
    auth0IdToken: session.selectAuth0IdToken,
    auth0AccessToken: session.selectAuth0AccessToken,
    extendedUser: session.selectExtendedUser,
    loadingMessage: session.selectLoadingMessage,
    modal: session.selectModal,
    sidebarContent: session.selectSidebarContent,
    currentCategory: session.selectCurrentCategory,
    currentIndicator: session.selectCurrentIndicator,
    currentSpatialResolution: session.selectCurrentSpatialResolution,
    currentTemporalResolution: session.selectCurrentTemporalResolution,
    selectedTimeRangeForCurrentData: session.selectSelectedTimeRangeForCurrentData,
    selectedTimeEntity: session.selectSelectedTimeEntity,
    currentAvailableTimeRange: session.selectCurrentAvailableTimeRange,
    currentData: session.selectCurrentData,
    currentStartDate: session.selectCurrentStartDate,
    currentEndDate: session.selectCurrentEndDate,
    currentMinValue: session.selectCurrentMinValue,
    currentMaxValue: session.selectCurrentMaxValue,
    redrawKey: session.selectRedrawKey,
    signupCache: session.selectSignupCache
}

describe("sessionSlice selectors", () => {
    for (let [name, method] of Object.entries(simpleGetters)) {
        describe(`${method.name} selector`, () => {
            it(`should return the initial state if ${name} is not defined`, () => {
                expect(method(initialState)).toEqual(initialState.session[name])
            })

            it(`should select ${name} if it exists`, () => {
                const value = "foo"
                expect(
                    method({
                        ...initialState,
                        session: { ...initialState.session, [name]: value }
                    })
                ).toEqual(value)
            })
        })
    }

    describe("selectIndicatorsForCurrentCategory selector", () => {
        it(`should return all indicators for the current category`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allIndicators: [{ category_id: "foo" }, { category_id: "foo" }, { category_id: "bar" }]
                }
            }

            const state1 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "foo" } }
            }
            expect(session.selectIndicatorsForCurrentCategory(state1)).toHaveLength(2)

            const state2 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "bar" } }
            }
            expect(session.selectIndicatorsForCurrentCategory(state2)).toHaveLength(1)

            const state3 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "baz" } }
            }
            expect(session.selectIndicatorsForCurrentCategory(state3)).toHaveLength(0)
        })
    })

    describe("selectSpatialResolutionsForCurrentCategory selector", () => {
        it(`should return all spatial resolutions for the current category`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allSpatialResolutions: {
                        foo: [{}, {}],
                        bar: [{}]
                    }
                }
            }

            const state1 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "foo" } }
            }
            expect(session.selectSpatialResolutionsForCurrentCategory(state1)).toHaveLength(2)

            const state2 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "bar" } }
            }
            expect(session.selectSpatialResolutionsForCurrentCategory(state2)).toHaveLength(1)

            const state3 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "baz" } }
            }
            expect(session.selectSpatialResolutionsForCurrentCategory(state3)).toHaveLength(0)
        })
    })

    describe("selectTemporalResolutionsForCurrentCategory selector", () => {
        it(`should return all temporal resolutions for the current category`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allTemporalResolutions: {
                        foo: [{}, {}],
                        bar: [{}]
                    }
                }
            }

            const state1 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "foo" } }
            }
            expect(session.selectTemporalResolutionsForCurrentCategory(state1)).toHaveLength(2)

            const state2 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "bar" } }
            }
            expect(session.selectTemporalResolutionsForCurrentCategory(state2)).toHaveLength(1)

            const state3 = {
                ...state,
                session: { ...state.session, currentCategory: { category_id: "baz" } }
            }
            expect(session.selectTemporalResolutionsForCurrentCategory(state3)).toHaveLength(0)
        })
    })

    describe("selectCurrentBoundaries selector", () => {
        it(`should retrieve all boundaries for the current spatial resolution`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    cachedBoundaries: {
                        0: [{}, {}],
                        1: [{}]
                    }
                }
            }

            jest.spyOn(session, "selectCurrentSpatialResolution").mockImplementation(() => {
                return { srid: 0 }
            })
            expect(session.selectCurrentBoundaries(state)).toHaveLength(2)

            jest.spyOn(session, "selectCurrentSpatialResolution").mockImplementation(() => {
                return { srid: 1 }
            })
            expect(session.selectCurrentBoundaries(state)).toHaveLength(1)

            jest.spyOn(session, "selectCurrentSpatialResolution").mockImplementation(() => {
                return { srid: 3 }
            })
            expect(session.selectCurrentBoundaries(state)).not.toBeDefined()
        })
    })

    describe("selectCurrentLabels selector", () => {
        it(`should retrieve the highest level labels`, () => {
            jest.spyOn(session, "selectCurrentBoundaries").mockImplementation(() => {
                return {
                    features: [
                        { properties: { foo_PCODE: "foo", bar_PCODE: "bar", ADM_foo_EN: "FOO", ADM_bar_EN: "BAR" } }
                    ]
                }
            })
            // note the syntax. That's because the selector is curried and returns a function in order to support parameters
            expect(session.selectCurrentLabels("_EN")(state)).toEqual({ foo: "FOO" })
        })

        it(`should fail for invalid boundaries`, () => {
            jest.spyOn(session, "selectCurrentBoundaries").mockImplementation(() => undefined)
            expect(session.selectCurrentLabels("_EN")(state)).not.toBeDefined()
        })

        it(`should work without a language suffix`, () => {
            jest.spyOn(session, "selectCurrentBoundaries").mockImplementation(() => {
                return {
                    features: [
                        { properties: { foo_PCODE: "foo", bar_PCODE: "bar", ADM_foo_EN: "FOO", ADM_bar_EN: "BAR" } }
                    ]
                }
            })
            // note the syntax. That's because the selector is curried and returns a function in order to support parameters
            expect(session.selectCurrentLabels()(state)).toEqual({ foo: "FOO" })
        })
    })

    describe("selectIndicatorsForCategory selector", () => {
        it(`should retrieve all available indicators if the category exists`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allIndicators: [{ category_id: "foo" }, { category_id: "foo" }, { category_id: "bar" }]
                }
            }
            expect(session.selectIndicatorsForCategory(state, "foo")).toHaveLength(2)
            expect(session.selectIndicatorsForCategory(state, "bar")).toHaveLength(1)
            expect(session.selectIndicatorsForCategory(state, "baz")).toHaveLength(0)
        })

        it(`should return an empty array for invalid indicators or categories`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allIndicators: undefined
                }
            }
            expect(session.selectIndicatorsForCategory(state, "foo")).toHaveLength(0)
        })
    })

    describe("selectSpatialResolutionsForCategory selector", () => {
        it(`should retrieve all available spatial resolutions if the category exists`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allSpatialResolutions: { foo: ["foo"] }
                }
            }
            expect(session.selectSpatialResolutionsForCategory(state, "foo")).toEqual(["foo"])
            expect(session.selectSpatialResolutionsForCategory(state, "bar")).toHaveLength(0)
        })

        it(`should return an empty array for invalid spatial resolutions or categories`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allSpatialResolutions: undefined
                }
            }
            expect(session.selectSpatialResolutionsForCategory(state, "foo")).toHaveLength(0)
        })
    })

    describe("selectTemporalResolutionsForCategory selector", () => {
        it(`should retrieve all available temporal resolutions if the category exists`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allTemporalResolutions: { foo: ["foo"] }
                }
            }
            expect(session.selectTemporalResolutionsForCategory(state, "foo")).toEqual(["foo"])
            expect(session.selectTemporalResolutionsForCategory(state, "bar")).toHaveLength(0)
        })

        it(`should return an empty array for invalid temporal resolutions or categories`, () => {
            state = {
                ...initialState,
                session: {
                    ...initialState.session,
                    allTemporalResolutions: undefined
                }
            }
            expect(session.selectTemporalResolutionsForCategory(state, "foo")).toHaveLength(0)
        })
    })
})

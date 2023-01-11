// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import notificationReducer, { initialState, resetMessage, setMessage } from "./notificationSlice"

describe("notificationSlice reducer", () => {
    it("should start with the initial state", () => {
        const newState = notificationReducer(initialState, {})
        expect(newState).toEqual(initialState)
    })

    describe("resetMessage action", () => {
        it("should reset the message", () => {
            const beforeState = { type: "foo", msg: "bar" }
            const afterState = notificationReducer(beforeState, resetMessage())
            expect(afterState).toEqual(initialState)
        })
    })

    describe("setMessage action", () => {
        it("should set the message", () => {
            const beforeState = { type: "foo", msg: "bar" }
            const afterState = notificationReducer(beforeState, setMessage(["bar", "foo"]))
            expect(afterState).toEqual({ type: "bar", msg: "foo" })
        })
    })
})

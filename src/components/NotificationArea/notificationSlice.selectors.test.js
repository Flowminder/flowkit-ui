// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import store from "../../app/store"
import notification from "./notificationSlice.selectors"

describe("notificationSlice selectors", () => {
    const initialState = store.getState()

    describe("selectMsgText", () => {
        it("should select the current notification message", () => {
            expect(notification.selectMsgText(initialState)).toBe(initialState.notification.msg)
        })
    })

    describe("selectMsgType", () => {
        it("should select the current notification type", () => {
            expect(notification.selectMsgType(initialState)).toBe(initialState.notification.type)
        })
    })
})

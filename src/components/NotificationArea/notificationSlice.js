// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    type: undefined,
    msg: undefined
}

export const NotificationAreaSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        resetMessage: state => initialState,
        setMessage: (state, action) => {
            state.type = action.payload[0]
            state.msg = action.payload[1]
        }
    }
})

export const { resetMessage, setMessage } = NotificationAreaSlice.actions

export default NotificationAreaSlice.reducer

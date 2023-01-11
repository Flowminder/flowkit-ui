// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { configureStore } from "@reduxjs/toolkit"
import notificationReducer from "../components/NotificationArea/notificationSlice"
import sessionReducer from "../components/SessionArea/sessionSlice"
import env from "./env"

export default configureStore({
    reducer: {
        // different "sections" of the store go here and are all served by different reducer slices
        notification: notificationReducer,
        session: sessionReducer
    },
    // only allow the redux browser plugin for development
    devTools: env.NODE_ENV === "development" || env.REACT_APP_GIT_BRANCH === "dev",
    // mute "slow middleware" warnings while testing
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: {
                // default: 32; see https://redux-toolkit.js.org/api/immutabilityMiddleware
                warnAfter: 100
            }
        })
})

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import App from "./app/App"
import store from "./app/store"
import { Provider } from "react-redux"
import "./app/i18n"
import { Auth0Provider } from "@auth0/auth0-react"
import env from "./app/env"
import { createRoot } from "react-dom/client"
import ReactGA from "react-ga4"

if (env.GA_ID !== "") {
    ReactGA.initialize(env.GA_ID)
}

const root = createRoot(document.getElementById("root"))

root.render(
    <Auth0Provider
        domain={env.REACT_APP_AUTH0_DOMAIN}
        clientId={env.REACT_APP_AUTH0_CLIENT_ID_UI}
        redirectUri={`${window.location.origin}/dashboard`}
        audience={"https://flowkit-ui-backend.flowminder.org"}
        // need to declare *all* possible scopes, see https://github.com/auth0/auth0-react/issues/183#issuecomment-758886856
        scope={"read:current_user update:current_user_metadata delete:current_user read:free_data read:premium_data"}
        useRefreshTokens={true}
        cacheLocation={"localstorage"}
    >
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    </Auth0Provider>
)

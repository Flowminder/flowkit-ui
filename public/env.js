// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

const env = {
    PUBLIC_URL: "$PUBLIC_URL",
    REACT_APP_AUTH0_DOMAIN: "$REACT_APP_AUTH0_DOMAIN",
    REACT_APP_NAME: "$REACT_APP_NAME",
    REACT_APP_AUTH0_CLIENT_ID_UI: "$REACT_APP_AUTH0_CLIENT_ID_UI",
    REACT_APP_MAPBOX_STYLE: "$REACT_APP_MAPBOX_STYLE",
    REACT_APP_MAPBOX_ACCESS_TOKEN: "$REACT_APP_MAPBOX_ACCESS_TOKEN",
    REACT_APP_API_URL: "$REACT_APP_API_URL",
    REACT_APP_MAINTAINENCE_MODE: "$REACT_APP_MAINTAINENCE_MODE",
    GA_ID: "$GA_ID"
}
window.env = env

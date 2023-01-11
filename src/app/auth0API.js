// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import axios from "axios"
import env from "./env"

export const url = `https://${env.REACT_APP_AUTH0_DOMAIN}`

const api = {
    // get a user using their own access token
    getUserInfo: async auth0AccessToken => {
        return await axios(`${url}/userinfo`, {
            method: "GET",
            headers: { authorization: `BEARER ${auth0AccessToken}` }
        })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error.message)
            })
    }
}

export default api

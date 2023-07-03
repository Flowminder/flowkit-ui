// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import axios from "axios"
import { setExtendedUser } from "../components/SessionArea/sessionSlice"
import env from "./env"

export const url = env.REACT_APP_API_URL

const api = {
    getHeartbeat: async () => {
        return await axios(`${url}/heartbeat`, {
            method: "GET"
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
            })
    },
    getDataProviders: async () => {
        return await axios(`${url}/data_providers`, {
            method: "GET",
            headers: {
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.data_providers
            })
            .catch(error => {
                console.error(error)
            })
    },
    getUser: async (uid, access_token) => {
        return await axios(`${url}/users/${encodeURIComponent(uid)}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`
            }
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
            })
    },
    updateUser: async (dispatch, extendedUser, access_token, user_metadata) => {
        return await axios(`${url}/users/${encodeURIComponent(extendedUser?.user_id)}`, {
            method: "PATCH",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json"
            },
            data: user_metadata
        })
            .then(response => {
                dispatch(setExtendedUser(extendedUser))
                return true
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    deleteUser: async (uid, access_token) => {
        return await axios(`${url}/users/${encodeURIComponent(uid)}`, {
            method: "DELETE",
            headers: {
                authorization: `BEARER ${access_token}`
            }
        })
            .then(response => {
                return response?.status === 204 ? true : false
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    resetPassword: async (email, access_token) => {
        return await axios(`${url}/reset_password/${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`
            }
        })
            .then(response => {
                return true
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    availableCategories: async access_token => {
        return await axios(`${url}/categories`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.categories
            })
            .catch(error => {
                console.error(error)
            })
    },
    availableIndicators: async access_token => {
        return await axios(`${url}/indicators`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.indicators
            })
            .catch(error => {
                console.error(error)
            })
    },
    countrySpatialResolutions: async access_token => {
        return await axios(`${url}/spatial_resolutions`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.spatial_resolutions || []
            })
            .catch(error => {
                console.error(error)
            })
    },
    availableSpatialResolutions: async (category_id, access_token) => {
        return await axios(`${url}/spatial_resolutions_for_category/${category_id}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.spatial_resolutions || []
            })
            .catch(error => {
                console.error(error)
            })
    },
    availableTemporalResolutions: async (category_id, access_token) => {
        return await axios(`${url}/temporal_resolutions_for_category/${category_id}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data?.temporal_resolutions || []
            })
            .catch(error => {
                console.error(error)
            })
    },
    boundaries: async (access_token, srid) => {
        return await axios(`${url}/spatial_resolutions/${srid}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    timerange: async (access_token, category_id, indicator_id, srid, trid) => {
        return await axios(`${url}/timerange/${category_id}/${indicator_id}/${srid}/${trid}`, {
            method: "GET",
            headers: {
                authorization: `BEARER ${access_token}`,
                // allow caching
                "Cache-Control": "private"
            }
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    query: async (access_token, query_parameters) => {
        return await axios(`${url}/query`, {
            method: "POST",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching of data
                "Cache-Control": "private"
            },
            data: query_parameters
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
                return false
            })
    },
    csv: async (access_token, query_parameters) => {
        return await axios(`${url}/csv`, {
            method: "POST",
            headers: {
                authorization: `BEARER ${access_token}`,
                "Content-Type": "application/json",
                // allow caching of data
                "Cache-Control": "private"
            },
            data: query_parameters
        })
            .then(response => {
                return response?.data
            })
            .catch(error => {
                console.error(error)
                return false
            })
    }
}

export default api

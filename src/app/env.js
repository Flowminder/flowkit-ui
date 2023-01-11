// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

const env = {}

try {
    // first add all env vars from node (required e.g. for setting up the redux store)
    for (let key in process.env) {
        // these come from node
        env[key] = process.env[key]
    }
    // then add the browser vars with higher priority
    for (let key in window.env) {
        // these come from node
        env[key] = process.env[key]
        // we want to override the above with what we feed in
        if (window.env[key] !== "" && window.env[key] !== `$${key}`) {
            env[key] = window.env[key]
        }
    }
} catch (err) {
    Object.assign(env, window.env)
}

export default env

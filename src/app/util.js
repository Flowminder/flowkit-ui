// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

const util = {
    // this returns a string literal instead of a number to preserve trailing zeroes.
    // it is meant to be used for displaying purposes only.
    round: (toRound, decimals = 2) => {
        return (Math.round(Number(toRound) * 100) / 100).toFixed(decimals)
    },
    sleep: async seconds => {
        await new Promise(r => setTimeout(r, seconds * 1000))
    },
    // given a date this will return date formatted as YYYY-MM-DD
    getFormattedDate: mydate => {
        if (!mydate) {
            return undefined
        }
        // use UTC only
        return (
            mydate.getFullYear() +
            "-" +
            ("0" + (mydate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + mydate.getDate()).slice(-2)
        )
    },
    // styling geojson area features
    styleArea: feature => {
        return {
            weight: 2,
            opacity: 0.5,
            color: "#000",
            fillOpacity: 0.7,
            fillColor: "#000"
        }
    },
    highlightArea: event => {
        const feature = event.target
        feature.setStyle({
            weight: 4,
            opacity: 0.7,
            fillOpacity: 0.9
        })
        feature.bringToFront()
    },
    resetAreaHighlight: event => {
        const feature = event.target
        feature.setStyle({
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.7
        })
        feature.bringToFront()
    },
    // convert a hex colour (including the hash sign) to an rgb array
    hexToRgb: hex => {
        let rgb = undefined
        try {
            if (hex && typeof hex == "string" && hex !== null && hex !== undefined) {
                hex = hex.replace("#", "")
                rgb = []
                let hexMatched = hex.match(new RegExp("([0-9A-Fa-f]{" + hex.length / 3 + "})", "g"))
                if (hexMatched && hexMatched != null && Array.isArray(hexMatched) && hexMatched.length === 3) {
                    hexMatched.map(l => parseInt(hex.length % 2 ? l + l : l, 16)).forEach(e => rgb.push(e))
                } else {
                    throw new Error(`Hex colour "${hex}" cannot be converted to RGB`)
                }
            }
        } catch (error) {
            // if the colour was not actually hex
            return undefined
        }
        return rgb
    },
    // make a set number of bins from a colour scale and a range of values
    // the number of bins corresponds to the number of stops on the colour scale
    makeBins: (
        colourScale = ["#FCE63E", "#6BC567", "#358F8C", "#3D5389", "#451756"],
        minValue = undefined,
        maxValue = undefined,
        decimals = 0
    ) => {
        const step = (maxValue - minValue) / colourScale?.length
        return colourScale
            .map((bin, idx) => {
                const from = Number(minValue) + idx * step
                const to = Number(from) + step - Math.pow(10, -decimals)
                return {
                    key: idx,
                    colour: bin,
                    // included in this bin
                    from: from,
                    // not included in this bin so get last included value at given resolution
                    to: to
                }
            })
            .reverse()
    },
    getBin: (key, data, bins, minValue, maxValue) => {
        let bin = undefined
        if (Object.keys(data).includes(key)) {
            bin = bins.filter(bin => bin.from <= data[key] && bin.to > data[key])[0]
        }
        // overflow bins
        if (data[key] > maxValue) {
            bin = bins.sort((a, b) => a.key < b.key)[0]
        }
        if (data[key] < minValue) {
            bin = bins.sort((a, b) => a.key > b.key)[0]
        }
        return bin || { colour: "#c6c6c6" }
    }
}

export default util

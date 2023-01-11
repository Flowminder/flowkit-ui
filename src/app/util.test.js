// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import util from "./util"

test("rounds numbers to two decimal places", () => {
    expect(util.round(5.9999999)).toBe("6.00")
    expect(util.round(3.979)).toBe("3.98")
    expect(util.round("4.629")).toBe("4.63")
})

test("can sleep for the given number of seconds", async () => {
    const start = new Date()
    await util.sleep(0.05)
    expect(new Date() - start).toBeGreaterThanOrEqual(50)
})

test("can format a date", async () => {
    expect(util.getFormattedDate(new Date("1918-11-11T05:45:00"))).toEqual("1918-11-11")
    // note that january is 0, not 1
    expect(util.getFormattedDate(new Date(1759, 0, 25))).toEqual("1759-01-25")
    expect(util.getFormattedDate(undefined)).not.toBeDefined()
})

test("styles an area irrespective of the feature", () => {
    const style = {
        weight: 2,
        opacity: 0.5,
        color: "#000",
        fillOpacity: 0.7,
        fillColor: "#000"
    }
    expect(util.styleArea()).toEqual(style)
    expect(util.styleArea("bob")).toEqual(style)
    expect(util.styleArea(null)).toEqual(style)
    expect(util.styleArea({ foo: "bar" })).toEqual(style)
})

test("highlights an area when the feature is hovered", () => {
    const mockFeature = {
        setStyle: jest.fn(),
        bringToFront: jest.fn()
    }
    util.highlightArea({ target: mockFeature })
    expect(mockFeature.setStyle).toHaveBeenCalledWith({
        fillOpacity: 0.9,
        opacity: 0.7,
        weight: 4
    })
    expect(mockFeature.bringToFront).toHaveBeenCalled()
})

test("resets highlight for an area when the feature is unhovered", () => {
    const mockFeature = {
        setStyle: jest.fn(),
        bringToFront: jest.fn()
    }
    util.resetAreaHighlight({ target: mockFeature })
    expect(mockFeature.setStyle).toHaveBeenCalledWith({
        fillOpacity: 0.7,
        opacity: 0.5,
        weight: 2
    })
    expect(mockFeature.bringToFront).toHaveBeenCalled()
})

describe("Convert a hex colour to RGB", () => {
    it("should work for short lower case hex codes", () => {
        expect(util.hexToRgb("#fff")).toMatchObject([255, 255, 255])
        expect(util.hexToRgb("#000")).toMatchObject([0, 0, 0])
        expect(util.hexToRgb("#690")).toMatchObject([102, 153, 0])
    })

    it("should work for short all caps hex codes", () => {
        expect(util.hexToRgb("#FFF")).toMatchObject([255, 255, 255])
        expect(util.hexToRgb("#000")).toMatchObject([0, 0, 0])
        expect(util.hexToRgb("#CCF")).toMatchObject([204, 204, 255])
    })

    it("should work for long lower case hex codes", () => {
        expect(util.hexToRgb("#ffffff")).toMatchObject([255, 255, 255])
        expect(util.hexToRgb("#000000")).toMatchObject([0, 0, 0])
        expect(util.hexToRgb("#287a23")).toMatchObject([40, 122, 35])
        expect(util.hexToRgb("#7359c0")).toMatchObject([115, 89, 192])
    })

    it("should work for all caps hex codes", () => {
        expect(util.hexToRgb("#FFFFFF")).toMatchObject([255, 255, 255])
        expect(util.hexToRgb("#287A23")).toMatchObject([40, 122, 35])
        expect(util.hexToRgb("#7359C0")).toMatchObject([115, 89, 192])
    })

    it("should work without a hash sign", () => {
        expect(util.hexToRgb("FFFFFF")).toMatchObject([255, 255, 255])
        expect(util.hexToRgb("000")).toMatchObject([0, 0, 0])
        expect(util.hexToRgb("7359C0")).toMatchObject([115, 89, 192])
    })

    it("should not work for invalid inputs", () => {
        expect(util.hexToRgb()).not.toBeDefined()
        expect(util.hexToRgb([])).not.toBeDefined()
        expect(util.hexToRgb({})).not.toBeDefined()
        expect(util.hexToRgb(null)).not.toBeDefined()
        expect(util.hexToRgb("#foo")).not.toBeDefined()
        expect(util.hexToRgb("#12")).not.toBeDefined()
        expect(util.hexToRgb("bob is my uncle")).not.toBeDefined()
    })
})

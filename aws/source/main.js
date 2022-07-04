const fetch = require("node-fetch")

const Common = require("./common.js")

module.exports.getExportedData = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let data = {
        exportTime: Date.now
    }
    let promises = []

    promises.push(fetch("https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/getAllPlayers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.playersData = response.players
    }).catch((error) => {
        throw "getAllPlayers error: " + error
    }))

    promises.push(fetch("https://xyf6qhiwi1.execute-api.us-west-2.amazonaws.com/development/getAllEvents", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.eventsData = response.allEventSummaryData
    }).catch((error) => {
        throw "getAllEvents error: " + error
    }))

    promises.push(fetch("https://pkbxpw400j.execute-api.us-west-2.amazonaws.com/development/getAllResults", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.resultsData = response.results
    }).catch((error) => {
        throw "getAllResults error: " + error
    }))

    promises.push(fetch("https://k7p1y5ntz6.execute-api.us-west-2.amazonaws.com/development/downloadLatestPointsData", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.pointsData = response.data
    }).catch((error) => {
        throw "downloadLatestPointsData error: " + error
    }))

    await Promise.all(promises)

    return {
        success: true,
        data: data
    }
})}

module.exports.getExportedDataList = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    return "Does this work?"
})}

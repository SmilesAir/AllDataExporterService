const fetch = require("node-fetch")

const Common = require("./common.js")

module.exports.getExportedData = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let isDev = decodeURIComponent(event.pathParameters.stage) === "development"

    let urls = []
    if (isDev) {
        urls.push("https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/getAllPlayers")
        urls.push("https://xyf6qhiwi1.execute-api.us-west-2.amazonaws.com/development/getAllEvents")
        urls.push("https://pkbxpw400j.execute-api.us-west-2.amazonaws.com/development/getAllResults")
        urls.push("https://k7p1y5ntz6.execute-api.us-west-2.amazonaws.com/development/downloadLatestPointsData")
    } else {
        urls.push("https://4wnda3jb78.execute-api.us-west-2.amazonaws.com/production/getAllPlayers")
        urls.push("https://wyach4oti8.execute-api.us-west-2.amazonaws.com/production/getAllEvents")
        urls.push("https://v869a98rf9.execute-api.us-west-2.amazonaws.com/production/getAllResults")
        urls.push("https://kvq5a3et4b.execute-api.us-west-2.amazonaws.com/production/downloadLatestPointsData")
    }

    let data = {
        exportTime: Date.now
    }
    let promises = []
    promises.push(fetch(urls[0], {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.playersData = response.players
    }).catch((error) => {
        throw "getAllPlayers error: " + error
    }))

    promises.push(fetch(urls[1], {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.eventsData = response.allEventSummaryData
    }).catch((error) => {
        throw "getAllEvents error: " + error
    }))

    promises.push(fetch(urls[2], {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json()).then((response) => {
        data.resultsData = response.results
    }).catch((error) => {
        throw "getAllResults error: " + error
    }))

    promises.push(fetch(urls[3], {
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

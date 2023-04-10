/* eslint-disable camelcase */
/* eslint-disable no-alert */
"use strict"

const React = require("react")
const ReactDOM = require("react-dom")
const MobxReact = require("mobx-react")
const StringSimilarity = require("string-similarity")

const Template = require("./template.sql")
const FpaPlayersJson = require("./wp_players.json")

require("./index.less")

@MobxReact.observer class Main extends React.Component {
    constructor() {
        super()

        this.state = {
            allData: undefined
        }

        // this.fetchAllData(false, true).then(() => {
        //     this.process()
        // })

        this.fetchAllData(false, true).then(() => {
            this.convertFpaPlayersTable()
        })
    }

    saveFile(filename, text) {
        let element = document.createElement("a")
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
        element.setAttribute("download", filename)

        element.style.displady = "none"
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    }

    fetchAllData(isDev, loadInMemory) {
        let url = undefined
        if (__STAGE__ === "DEVELOPMENT") {
            url = `https://xvbh62vfdj.execute-api.us-west-2.amazonaws.com/development/getExportedData/${isDev ? "development" : "production"}`
        } else {
            url = `https://p6wndffst9.execute-api.us-west-2.amazonaws.com/production/getExportedData/${isDev ? "development" : "production"}`
        }

        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((response) => {
            console.log(response)
            if (!loadInMemory) {
                this.saveFile("AllFrisbeeData.json", JSON.stringify(response.data))
            } else {
                this.state.allData = response.data
                this.setState(this.state)
            }
        }).catch((error) => {
            console.error("getExportedData error: " + error)
            throw new Error(error)
        })
    }

    onFileLoad(e) {
        this.state.allData = JSON.parse(e.target.result)
        console.log(this.state.allData)
    }

    readJsonFile(e) {
        if (typeof window.FileReader !== "function") {
            alert("The file API isn't supported on this browser.")
        }
        let input = e.target
        if (!input) {
            alert("The browser does not properly implement the event object")
        }
        if (!input.files) {
            alert("This browser does not support the `files` property of the file input.")
        }
        if (!input.files[0]) {
            return
        }

        let file = input.files[0]
        let fr = new FileReader()
        fr.onload = (elementId, e2) => this.onFileLoad(elementId, e2)
        fr.readAsText(file)
    }

    sanitizeString(str) {
        return str.replaceAll("'", ".")
    }

    genPlayersTableCommands() {
        let outText = ""

        outText += "DROP TABLE IF EXISTS `players`;\n"
        outText += "CREATE TABLE `players` (\n"
        outText += "  `key` varchar(255) DEFAULT NULL,\n"
        outText += "  `first_name` varchar(255) DEFAULT NULL,\n"
        outText += "  `last_name` varchar(255) DEFAULT NULL,\n"
        outText += "  `created_at` BIGINT DEFAULT NULL,\n"
        outText += "  `last_active` BIGINT DEFAULT NULL,\n"
        outText += "  `membership` INT DEFAULT NULL,\n"
        outText += "  `country` varchar(255) DEFAULT NULL,\n"
        outText += "  `gender` varchar(255) DEFAULT NULL\n"
        outText += ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
        outText += "\n\n"

        outText += "LOCK TABLES `players` WRITE;\n"
        let values = []
        for (let key in this.state.allData.playersData) {
            let playerData = this.state.allData.playersData[key]
            if (playerData.aliasKey === undefined) {
                values.push(`('${key}','${this.sanitizeString(playerData.firstName)}','${this.sanitizeString(playerData.lastName)}',${playerData.createdAt},${playerData.lastActive},${playerData.membership},'${playerData.country}','${playerData.gender}')`)
            }
        }
        outText += `INSERT INTO \`players\` VALUES ${values.join(",")};\n`
        outText += "UNLOCK TABLES;\n"

        outText += "\n\n"

        return outText
    }

    genEventsTableCommands() {
        let outText = ""

        outText += "DROP TABLE IF EXISTS `events`;\n"
        outText += "CREATE TABLE `events` (\n"
        outText += "  `key` varchar(255) DEFAULT NULL,\n"
        outText += "  `event_name` varchar(255) DEFAULT NULL,\n"
        outText += "  `created_at` BIGINT DEFAULT NULL,\n"
        outText += "  `start_date` DATE DEFAULT NULL,\n"
        outText += "  `end_date` DATE DEFAULT NULL\n"
        outText += ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"
        outText += "\n\n"

        outText += "LOCK TABLES `events` WRITE;\n"
        let values = []
        for (let key in this.state.allData.eventsData) {
            let eventData = this.state.allData.eventsData[key]
            values.push(`('${key}','${this.sanitizeString(eventData.eventName)}',${eventData.createdAt},'${eventData.startDate}','${eventData.endDate}')`)
        }
        outText += `INSERT INTO \`events\` VALUES ${values.join(",")};\n`
        outText += "UNLOCK TABLES;\n"

        outText += "\n\n"

        return outText
    }

    getPlayerPrimaryKey(playerKey) {
        let primaryPlayerData = this.state.allData.playersData[playerKey]
        while (primaryPlayerData.aliasKey !== undefined) {
            primaryPlayerData = this.state.allData.playersData[primaryPlayerData.aliasKey]
        }

        return primaryPlayerData.key
    }

    genResultsTableCommands() {
        let outText = ""

        outText += "DROP TABLE IF EXISTS `results`;\n"
        outText += "CREATE TABLE `results` (\n"
        outText += "  `key` INT DEFAULT NULL,\n"
        outText += "  `player_key` varchar(255) DEFAULT NULL,\n"
        outText += "  `event_key` varchar(255) DEFAULT NULL,\n"
        outText += "  `division` varchar(255) DEFAULT NULL,\n"
        outText += "  `round` TINYINT DEFAULT NULL,\n"
        outText += "  `pool` varchar(4) DEFAULT NULL,\n"
        outText += "  `team_index` TINYINT DEFAULT NULL,\n"
        outText += "  `place` TINYINT DEFAULT NULL\n"
        outText += ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n"

        outText += "LOCK TABLES `results` WRITE;\n"
        let values = []
        let resultIndex = 0
        for (let key in this.state.allData.resultsData) {
            let resultsData = this.state.allData.resultsData[key]
            for (let roundKey in resultsData.resultsData) {
                if (roundKey.startsWith("round")) {
                    let roundData = resultsData.resultsData[roundKey]
                    for (let poolKey in roundData) {
                        if (poolKey.startsWith("pool")) {
                            let poolData = roundData[poolKey]
                            for (let [ teamIndex, teamData ] of poolData.teamData.entries()) {
                                for (let playerKey of teamData.players) {
                                    values.push(`(${resultIndex++},'${this.getPlayerPrimaryKey(playerKey)}','${resultsData.eventId}','${resultsData.divisionName}',${roundData.id},'${poolData.poolId}',${teamIndex},${teamData.place})`)
                                }
                            }
                        }
                    }
                }
            }
        }
        outText += `INSERT INTO \`results\` VALUES ${values.join(",")};\n`
        outText += "UNLOCK TABLES;\n"

        outText += "\n\n"

        return outText
    }

    process() {
        if (this.state.allData === undefined) {
            alert("Need to choose data first")
        }
        let replaceText = this.genPlayersTableCommands()
        replaceText += this.genEventsTableCommands()
        replaceText += this.genResultsTableCommands()

        let outText = Template.replace("/*commands*/", replaceText)
        console.log(outText)
    }

    convertFpaPlayersTable() {
        const locale = "en-US"
        let fullNameCache = []
        for (let key in this.state.allData.playersData) {
            let playerData = this.state.allData.playersData[key]
            fullNameCache.push({
                fullName: `${playerData.firstName} ${playerData.lastName}`.toLocaleLowerCase(locale),
                playerData: playerData
            })
        }

        let exactUpdated = []
        let exactCreated = []
        let noMatch = []
        let rows = FpaPlayersJson[2].data
        for (let fpaPlayer of rows) {
            fpaPlayer.first_name = fpaPlayer.first_name.toLocaleLowerCase(locale)
            fpaPlayer.last_name = fpaPlayer.last_name.toLocaleLowerCase(locale)
            const fpaFullName = `${fpaPlayer.first_name} ${fpaPlayer.last_name}`
            fpaPlayer.full_name = fpaFullName
            let exactMatches = fullNameCache.filter((data) => data.fullName === fpaFullName)
            if (exactMatches.length > 0) {
                if (fpaFullName === "jeff o'brien") {
                    console.log(fpaPlayer)
                }
                let availableCachedPlayerData = exactMatches.find((p) => p.playerData.fpaWebsiteId === undefined)
                if (availableCachedPlayerData !== undefined) {
                    availableCachedPlayerData.playerData.fpaWebsiteId = fpaPlayer.player_id
                    exactUpdated.push(availableCachedPlayerData.playerData)
                } else {
                    // Create alias
                    exactCreated.push({
                        matchingPlayerData: exactMatches[0],
                        fpaWebsiteId: fpaPlayer.player_id
                    })
                }
            } else {
                noMatch.push(fpaPlayer)
            }
        }

        console.log(exactUpdated.length, exactCreated.length, noMatch.length)

        for (let fpaPlayer of noMatch) {
            for (let cachedPlayer of fullNameCache) {
                let similar = StringSimilarity.compareTwoStrings(fpaPlayer.full_name, cachedPlayer.fullName)
                if (similar > .7) {
                    console.log(similar, fpaPlayer.full_name, cachedPlayer.fullName)
                }
            }
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => this.fetchAllData(false)}>Export All Data Production</button>
                <button onClick={() => this.fetchAllData(true)}>Export All Data Development</button>
                <h3>Export to SQL Commands</h3>
                <div className="jsonTools">
                    <label htmlFor="picker">Select All Frisbee Data Json: </label>
                    <input id="picker" type="file" accept=".json" onChange={(e) => this.readJsonFile(e)}/>
                    <button onClick={() => this.process()}>Process</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById("mount")
)

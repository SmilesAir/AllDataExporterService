"use strict"

const React = require("react")
const ReactDOM = require("react-dom")
const MobxReact = require("mobx-react")

require("./index.less")

@MobxReact.observer class Main extends React.Component {
    constructor() {
        super()

        fetch("https://xvbh62vfdj.execute-api.us-west-2.amazonaws.com/development/getExportedData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error("getExportedData error: " + error)
        })
    }

    render() {
        return (
            <div>
                All Data Exporter
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById("mount")
)

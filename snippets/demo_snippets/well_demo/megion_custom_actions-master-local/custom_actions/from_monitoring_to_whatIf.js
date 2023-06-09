let customActionTitle = "Switch to WhatIf"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_2
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3

let tabMonitoring = "wss-tab-5720"
let tabWhatIf = "wss-tab-9078"

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

let interactionSystem = Application.autocomplete.InteractionSystem

notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)

let usernamePromise = interactionSystem.GETRequest("/dtcd_utils/v1/user?username").then(d => {return d.data.username})

let removeNodes = []
for (let node of liveDashPanelMonitoring.masterGraph.nodes.filter(node => {return node.tag.primitiveID.includes("DataLakeNode")})) {
    removeNodes.push(node)
}
for (let rn of removeNodes) {
    liveDashPanelMonitoring.masterGraph.remove(rn)
}

for (const node_id in liveDashPanelMonitoring.nodes) {
    let node = liveDashPanelMonitoring.nodes[node_id]
    if (node_id.includes("DataLakeNode")) {
        delete node
    } else {
        for (const prop in node.tag.properties) {
            if (typeof(node.tag.properties[prop].expression) === "string" && node.tag.properties[prop].expression !== "") {
                node.tag.properties[prop].expression = JSON.stringify(node.tag.properties[prop].value)
            } else {
                node.tag.properties[prop].expression = node.tag.properties[prop].value
            }
        }
    }
}
let username = await usernamePromise

let tmpGraphName = `${liveDashPanelMonitoring.graphMeta.graphName}_tmp_${username}`

await interactionSystem.get("/supergraph/v1/fragments").then(d => {
    console.log(d)
    let oldTmpFragments = d.data.fragments.filter(fr => {
        return fr.name === tmpGraphName
    })
    for (let otf in oldTmpFragments) {
        console.log(oldTmpFragments[otf])
        interactionSystem.DELETERequest(`/supergraph/v1/fragments/${oldTmpFragments[otf].id}`)
    }
})

await liveDashPanelMonitoring.saveAs({"name": tmpGraphName}).then( fragment => {
    console.log(fragment)
    liveDashPanelWhatIf.openFromServer(fragment)
    let fr = {"id": liveDashPanelMonitoring.graphMeta.graphID, "name": liveDashPanelMonitoring.graphMeta.graphName}
    console.log(fr)
    liveDashPanelMonitoring.openFromServer(fr)
    workspaceSystem.setActiveTab(tabWhatIf)
    }
)
notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)
console.log(`Custom action "${customActionTitle}" finished`)
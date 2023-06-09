let customActionTitle = "Apply a measure"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_2
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
let tableExp = Application.autocomplete.Visualization_EditableTable_1
let tableMeasures = Application.autocomplete.Visualization_EditableTable_2
let storageSystem = Application.autocomplete.StorageSystem

let tabMonitoring = "wss-tab-5720"
let tabWhatIf = "wss-tab-9078"
let measures_boolean_column = "to_do"

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "error", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

let interactionSystem = Application.autocomplete.InteractionSystem

notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)

function getLongTableFromGraph(targetLiveDash) {
    let table = [];
    for (let node of liveDashPanelWhatIf.masterGraph.nodes) {
        let primitiveID = node.tag.primitiveID
        let nodeName = node.tag.properties.Name.value

        for (let prop in node.tag.properties) {
            if (prop === "Name") {
                continue
            }
            let line = {
                "primitiveID": primitiveID,
                "nodeName": nodeName,
                "nodeProperty": prop,
                "value": node.tag.properties[prop].value,
            }
            table.push(line)
        }
    }
    return table
}

function fill(node, properties, line) {
    console.log(node, properties)
    for (let property of properties) {
        if (property in node.tag.properties) {
            node.tag.properties[property].expression = line[property]
            node.tag.properties[property].value = line[property]
            node.tag.properties[property].status = "complete"
            console.log(node.tag.properties[property])
        } else {
            console.log(`Node ${node.tag.primitiveID} doesn't have a property "${property}"`)
        }
    }
}

function findNode(propertyWithID, columnWithID, line) {
    let node = liveDashPanelWhatIf.masterGraph.nodes.find(node => {
        if (propertyWithID in node.tag.properties) {
            return Number(node.tag.properties[propertyWithID].expression) === Number(line[columnWithID])
        } else {
            return false
        }
    })
    console.log(node)
    return node
}

let measuresDataset = tableMeasures.getDatasetFromTable().filter(lineFromMeasures  => {return lineFromMeasures[measures_boolean_column]})
console.log(measuresDataset)

for (let i in measuresDataset) {
    let line = measuresDataset[i]
    console.log(line)
    if ("node_id" in line && line.node_id !== null && line.node_id !== "undefined") {
        let node = findNode("node_id", "node_id", line)
        if (node === null) {
            console.log(`Node ${line.node_id} from dataset is not presented in the graph`)
        } else {
            // fill(node, wellProperties, line)
            fill(node, Object.keys(line), line)
        }
    } else {
        let node = findNode("node_id_start", "node_id_start", line)
        if (node === null) {
            console.log(`Node ${line.node_id_start} (else section) from dataset is not presented in the graph`)
        } else {
            // fill(node, pipeProperties, line)
            fill(node, Object.keys(line), line)
        }
    }
}

let tableExperiments = tableExp.getDatasetFromTable()

await Application.autocomplete.EventSystem.actions.find(ac => {return ac.name === "Solver"}).callback()

let tableFromWhatIf = getLongTableFromGraph(liveDashPanelWhatIf)

let experiments = storageSystem.session.getRecord("experiments")
if (experiments && experiments.length !==0) {
    experiments.push(tableFromWhatIf)
} else {
    experiments = [tableFromWhatIf]
}
storageSystem.session.putRecord("experiments", experiments)

let updatedTable = []

for (let lineFromTable in tableExperiments) {
    console.log("---")
    console.log(tableExperiments[lineFromTable])
    let lineFromCurrentExperiment = tableFromWhatIf.find(l => {return l.nodeName === tableExperiments[lineFromTable].nodeName && l.nodeProperty === tableExperiments[lineFromTable].nodeProperty})
    console.log(lineFromCurrentExperiment)
    let updatedLine = tableExperiments[lineFromTable]
    updatedLine[`Experiment ${experiments.length}`] = lineFromCurrentExperiment.value
    console.log(updatedLine)
    updatedTable.push(updatedLine)
}

tableExp.loadSchema(updatedTable[0])
tableExp.loadData(updatedTable)
storageSystem.session.putRecord("expTable", updatedTable)
let customActionTitle = "Load history"
console.log(`Custom action "${customActionTitle}" started`)
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
let storageSystem = Application.autocomplete.StorageSystem

function findNode(propertyWithID, columnWithID, line) {
    console.log(propertyWithID, columnWithID, line)
    let node = liveDashPanelWhatIf.masterGraph.nodes.find(node => {
        if (propertyWithID in node.tag.properties) {
            return node.tag.properties[propertyWithID].value === line[columnWithID]
        } else {
            return false
        }
    })
    console.log(node)
    return node
}

let eventColumn = e.column
if (eventColumn.includes("Experiment")) {
    let experimentNumber = eventColumn.split(" ")[1]

    let experiments = storageSystem.session.getRecord("experiments")
    let experiment = experiments[experimentNumber - 1]

    for (let i in experiment) {
        let line = experiment[i]
        console.log(line)
        let targetNode = findNode("Name", "nodeName", line)
        targetNode[line.nodeProperty] = line.value
    }
    console.log("Graph was loaded")
} else {
    console.log("Not experiment column was clicked")
}


console.log(`Custom action "${customActionTitle}" finished`)
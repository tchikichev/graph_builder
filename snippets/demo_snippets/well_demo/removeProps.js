
let customActionTitle = "Solver"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_2
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3

liveDashPanelMonitoring.masterGraph.nodes.toArray().filter(
    node => {
        if (node.tag.properties?.object_type) {
            return node.tag.properties.object_type.value === "pad"
        } else {
            return false
        }
        
    }
).map(node => {
    node.tag.properties["otl_q_m3"] = defExpr;
    node.tag.properties["query_res"] = defExpr;
})


liveDashPanelMonitoring.masterGraph.nodes.toArray().foreach(
    node => {
        if (node.tag.properties?.isActive) {
            delete node.tag.properties.isActive;
            // return node.tag.properties.object_type.value === "pad"
        }
    }
)

liveDashPanelMonitoring.masterGraph.nodes.toArray().filter(
    node => {
        if (node.tag.properties?.object_type) {
            return node.tag.properties.object_type.value === "well"
        } else {
            return false
        }
        
    }
).map(node => {
    const defExpr = {
        "type": "expression",
        "expression": "",
        "status": "completed",
        "value": ""
    };
    node.tag.properties["disabled"] = defExpr;
})

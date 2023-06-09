
let customActionTitle = "Solver"
// console.log(Custom action "${customActionTitle}" started)
let workspaceSystem = Application.autocomplete.WorkspaceSystem

let liveDashPanelPPDMonitoring = Application.autocomplete.LiveDashPanel_4
let liveDashPanelPPDWhatIf = Application.autocomplete.LiveDashPanel_5

let dataSourceSystem = Application.autocomplete.DataSourceSystem
let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}


const defExpr = {
    "type": "expression",
    "expression": "",
    "status": "completed",
    "value": ""
};

// fix graph
liveDashPanelPPDMonitoring.masterGraph.nodes.toArray().filter(
    node => {
        if (node.tag.properties?.object_type) {
            return (node.tag.primitiveName === "oil_well_vodazabornaya")
        }
    }
).filter(node => node.tag.properties.Kind.value === "Q"
    ).filter(node => node.tag.properties.Value.value === null
    ).forEach(node => {
    node.tag.properties.Value.expression = "0.0001";
    node.tag.properties.Value.value = 0.0001;
});

function addProps({
    LiveDash, nodeName, props2Add}){
    LiveDash.masterGraph.nodes.toArray().filter(
        node => {
            if (node.tag.properties?.object_type) {
                return (node.tag.primitiveName === nodeName)
            }
        }
    ).forEach(node => {
        props2Add.forEach(propName => {
            if (!node.tag.properties.hasOwnProperty(propName)) {
                node.tag.properties[propName] = defExpr;
            }
        });    
    })
}


function deleteProps({
    LiveDash, nodeName, props2Add}){
    LiveDash.masterGraph.nodes.toArray().filter(
        node => {
            if (node.tag.properties?.object_type) {
                return (node.tag.primitiveName === nodeName)
            }
        }
    ).forEach(node => {
        props2Add.forEach(propName => {
            if (node.tag.properties.hasOwnProperty(propName)) {
                delete node.tag.properties[propName]
            }
        });    
    })
}

["oil_well_vodazabornaya", "oil_vrb", "oil_kns", "oil_junction_ppd"
].forEach(nodeName => {
    addProps({
        LiveDash: liveDashPanelPPDMonitoring,
        nodeName: nodeName,
        props2Add: ["res_P","res_T","res_Q_m3_day"]
    }); 
})

["oil_pipe_ppd"].forEach(nodeName => {
    addProps({
        LiveDash: liveDashPanelPPDMonitoring,
        nodeName: nodeName,
        props2Add: ["res_watercut_percent", "res_liquid_density_kg_m3", "res_pump_power_watt", "res_mass_flow_kg_sec", "res_velocity_m_sec"]
    }); 
})





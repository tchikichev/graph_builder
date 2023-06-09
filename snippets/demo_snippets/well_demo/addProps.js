
let customActionTitle = "Monitoring add properties"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_4
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_5
let dataSourceSystem = Application.autocomplete.DataSourceSystem
// let notificationSystem = Application.autocomplete.NotificationSystem
// let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
// let notificationSettingsFail = { type: "error", floatTime: 5, floatMode: true }
// let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

let paramsFillLivedash = liveDashPanelMonitoring;

// const edgeParamsMapping = {   
//     "res_watercut_percent": "res_watercut_percent",// Обводненность,TRUE
//     "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",// Плотность жидкости,
//     "res_pump_power_watt": "res_pump_power_watt",// Мощность насоса,TRUE
//     "X_kg_sec": "res_mass_flow_kg_sec",// Массовый поток,
//     "velocity_m_sec": "res_velocity_m_sec"// Скорость потока,TRUE
// };
const defExpr = {
    "type": "expression",
    "expression": "",
    "status": "completed",
    "value": ""
};

const addProps = {
    // "res_watercut_percent": "//res_watercut_percent\n' '",
    // "res_liquid_density_kg_m3": "//res_liquid_density_kg_m3\n' '",
    // "res_pump_power_watt": "//res_pump_power_watt\n' '",
    // "X_kg_sec": "//res_mass_flow_kg_sec\n' '",
    // "velocity_m_sec": "//res_velocity_m_sec\n' '"
    "isActive": {
        "type": "expression",
        "expression": "true",
        "status": "new",
        "value": true,
        "input": {
            "component": "switch"
        }
    }
};

function getNodesByObjType(liveDash, targetObjectType) {
    liveDash.masterGraph.nodes.toArray().filter(
        node => {
            if (node.tag.properties?.object_type) {
                return node.tag.properties.object_type.value == targetObjectType
            } else {
                return false
            }
        }
    )
}

// creaate new props and fill annotation

let object_types = ['well', 'pipe', 'pad', 'junctionpoint', 'dns'];

let targetNodes = getNodesByObjType(paramsFillLivedash, "well");

targetNodes.map(node => {
    Object.entries(addProps).map(([pname, pdata]) => {
        node.tag.properties[pname] = pdata;        
        // node.tag.properties[pname].expression = "";
    })
})
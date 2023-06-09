let customActionTitle = "Solver"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_2
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
let dataSourceSystem = Application.autocomplete.DataSourceSystem
let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

notificationSystem.create(customActionTitle, "Ожидайте окончания расчетов", notificationSettingsInfo)

await liveDashPanelWhatIf.saveToServer({name: liveDashPanelWhatIf.graphMeta.graphName, id: liveDashPanelWhatIf.graphMeta.graphID})

let solverOtl = `v2 | dtcd_read_graph "${liveDashPanelWhatIf.graphMeta.graphName}" | ks_prepare | ks_calc_df`

// manual run solver
let ds = await dataSourceSystem.oneShotRun("otl", {cache_ttl: 5, queryString: solverOtl});

function processNode(node, line, usage) {
    const nodeParamsMapping = {
        "start": {
            "P": "startP",
            "T": "startT",
            "Q_m3_day": "start_Q_m3_day"
        },
        "end": {
            "P": "endP",
            "T": "endT",
            "Q_m3_day": "end_Q_m3_day"
        },
        "edge": {   
            "res_watercut_percent": "res_watercut_percent",// Обводненность,TRUE
            "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",// Плотность жидкости,
            "res_pump_power_watt": "res_pump_power_watt",// Мощность насоса,TRUE
            "X_kg_sec": "X_kg_sec",// Массовый поток,
            "velocity_m_sec": "velocity_m_sec"// Скорость потока,TRUE
        }
    };
    let props = node.tag.properties;

    if ("junctionpoint" === props.object_type.value){
        return
    }
    console.log("eval ", usage, node.tag.primitiveID, props, line);
    if (
        "start" === usage ||
        "edge" === usage ||
        "end" === usage){
        Object.entries(nodeParamsMapping[usage]).forEach(
            ([param,df]) => {
            props[param].expression = line[df];
        })
    }
}

function processDfLine(line) {
    function findNode(propertyWithID, columnWithID, line) {
        return liveDashPanelWhatIf.masterGraph.nodes.find(node => {
            if (propertyWithID in node.tag.properties) {
                return Number(node.tag.properties[propertyWithID].expression) === Number(line[columnWithID])
            } else {
                return false
            }
        })
    }
    let sourceNode = findNode("node_id", "node_id_start", line)
    if (null != sourceNode){
        processNode(sourceNode, line, "start");
    }
    let targetNode = findNode("node_id", "node_id_end", line)
    if (null != targetNode){
        processNode(targetNode, line, "end");
    }

    let edgeNode = liveDashPanelWhatIf.masterGraph.nodes.find(node => {
        if (
            'node_id_start' in node.tag.properties &&
            'node_id_end' in node.tag.properties) {
            return Number(line.node_id_start) === Number(node.tag.properties.node_id_start.expression) &&
        Number(line.node_id_end) === Number(node.tag.properties.node_id_end.expression)
        } else {
            return false;
        }
    });
    if (null != edgeNode){
        // console.log("process edgeNode", edgeNode);
        processNode(edgeNode, line, "edge");
    }
};


Object.entries(ds).forEach(
    ([id, line]) => {
        processDfLine(line);
    }
)
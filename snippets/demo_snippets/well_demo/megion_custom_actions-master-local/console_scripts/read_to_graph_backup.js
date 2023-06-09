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
// ds

// ds.map(line => line.node_name_start)

// ds.filter(line => line.node_name_start.includes('к.') && !line.node_name_start.includes('_') )

// ds.filter(line => line.node_name_end.includes('скв.') || line.node_name_start.includes('скв.'))


function processNode(node, line, usage) {
    // usage == start | end | edge
    // console.log("processNode", node);
    let props = node.tag.properties;
    const objType = props.object_type.value;

    // TODO: eval junction point props
    if ("junctionpoint" === objType){
        // juncntion does not have P, T, Q3 propt in graph now
        return
    }

    // read corresponding props
    if ("start" === usage){
        console.log("eval start", props, line);
        props.P.expression = line.startP;
        props.T.expression = line.startT;
        props.Q_m3_day.expression = line.start_Q_m3_day;
    }
    if ("end" === usage){
        console.log("eval end", props, line);
        // console.log("eval end");
        props.P.expression = line.endP;
        props.T.expression = line.endT;
        props.Q_m3_day.expression = line.end_Q_m3_day;
    }
    if ("edge" === usage){
        // res_watercut_percent,res_liquid_density_kg_m3,res_pump_power_watt,X_kg_sec,velocity_m_sec
        // console.log("eval edge");
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


Object.entries(ds).map(
    ([id, line]) => {
        processDfLine(line);
    }
)
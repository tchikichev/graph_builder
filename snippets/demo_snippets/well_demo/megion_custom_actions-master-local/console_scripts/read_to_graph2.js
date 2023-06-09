let liveDashPPDWhatif = Application.autocomplete.LiveDashPanel_5;
let liveDashPanelWhatIf = liveDashPPDWhatif;

// await liveDashPPDWhatif.saveToServer({name: liveDashPPDWhatif.graphMeta.graphName, id: liveDashPPDWhatif.graphMeta.graphID})

const defExpr = {
    "type": "expression",
    "expression": "",
    "status": "completed",
    "value": ""
}

// fill L, d, uphillM == ""


// findNewNodes({
//     liveDash: liveDashPPD,
//     primitiveNames: ['oil_pipe', 'oil_pipe_ppd'],
//     indexCols: ['d']
// }).forEach(node => {
//     const propsMap = {
//         "L": "",
//         "d": "",
//         "uphillM": "",
//     };
//     fillNodeProps(node, propsMap);
// });


// let solverOtl = `v2 | dtcd_read_graph "${liveDashPPDWhatif.graphMeta.graphName}" | ks_prepare | ks_calc_df network_kind=water`

// // run solver & take result
// let ds = await Application.autocomplete.DataSourceSystem.oneShotRun("otl", {cache_ttl: 5, queryString: solverOtl});

const nodeParamsMapping = {
    "start": {
        "res_P": "startP",
        "res_T": "startT",
        "res_Q_m3_day": "start_Q_m3_day"
    },
    "end": {
        "res_P": "endP",
        "res_T": "endT",
        "res_Q_m3_day": "end_Q_m3_day"
    },
    "edge": {   
        "res_watercut_percent": "res_watercut_percent",// Обводненность,TRUE
        "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",// Плотность жидкости,
        "res_pump_power_watt": "res_pump_power_watt",// Мощность насоса,TRUE
        "res_mass_flow_kg_sec": "X_kg_sec",// Массовый поток,
        "res_velocity_m_sec": "velocity_m_sec"// Скорость потока,TRUE
    }
};

function processNode(node, line, usage) {

    function fillNodeProps(node, propsMap) {
        let props = node.tag.properties;
        Object.entries(propsMap).forEach(([p, val]) => {
            if (!props.hasOwnProperty(p)) {
                props[p] = defExpr;
            }
            props[p].expression = val;
        });
    };

    // let props = node.tag.properties;
    // if ("junctionpoint" === props.object_type.value){
    //     return
    // }
    // console.log("eval ", usage, node.tag.primitiveID, props, line);
    if (
        "start" === usage ||
        "edge" === usage ||
        "end" === usage){
        fillNodeProps(node, nodeParamsMapping[usage])
        // Object.entries(nodeParamsMapping[usage]).forEach(
        //     ([p,df]) => {
        //     if (!props.hasOwnProperty(p)) {
        //         props[p] = defExpr;
        //     }
        //     props[p].expression = line[df];
        // })
    }
}

function processDfLine(line) {
    function findNode(propertyWithID, columnWithID, line) {
        return liveDashPanelWhatIf.masterGraph.nodes.find(node => {
            if (propertyWithID in node.tag.properties) {
                return node.tag.properties[propertyWithID].value == line[columnWithID]
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
        //     return Number(line.node_id_start) === Number(node.tag.properties.node_id_start.expression) &&
        // Number(line.node_id_end) === Number(node.tag.properties.node_id_end.expression)
        return (line.node_id_start == node.tag.properties.node_id_start.value) &&
        (line.node_id_end == node.tag.properties.node_id_end.expression)
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
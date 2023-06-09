function processNode(node, line, usage) {
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
    let props = node.tag.properties;

    if ("junctionpoint" === props.object_type.value){
        return
    }
    console.log("eval ", usage, node.tag.primitiveID, props, line);
    if (
        "start" === usage ||
        "edge" === usage ||
        "end" === usage){
        Object.entries(nodeParamsMapping[usage]).map(
            ([param,df]) => {
                console.log(param)
                props[param].expression = line[df];
            })
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

function processDfLine(line) {
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

Object.entries(ds).map(([id, line]) => {
    processDfLine(line);
})
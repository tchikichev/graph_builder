const dtcdPropsMap = getOilDtcdPropsMap();

const node2PropsMap = {
    "start":["startP","startT","start_Q_m3_day"],
    "end":["endP","endT","end_Q_m3_day"],
    "edge":["res_watercut_percent","res_liquid_density_kg_m3","res_pump_power_watt","X_kg_sec","velocity_m_sec"]
};

const dtcdObjectType2graphTypeMap = {
    "well": "start",
    "pad": "start",
    "pipe": "edge",
    "junctionpoint": "edge",
    "dns": "end",
    "kns": "start",
    "injection_well": "end"
};

let masterNodes = liveDash.masterGraph.nodes.filter(node => 'kns' === node.tag.properties['_pp_tag']);

Object.entries(dtcdObjectType2graphTypeMap).forEach(([dType,dfType]) => {
    let nodes = masterNodes.filter(node => dType === node.tag.properties['object_type']);
    // direction (start / end / edge) === dfType
    // let props2write = node2PropsMap[dfType];
    let props2writeMap = dtcdPropsMap[dfType];

    nodes.forEach((node) => {
        // create function to update props
        fillNode(node.tag.primitiveID, properties)
    })
})

function getOilDtcdPropsMap() {
    return {
        "start": {
            "startP": "res_P",
            "startT": "res_T",
            "start_Q_m3_day": "res_Q_m3_day"
        },
        "end": {
            "endP": "res_P",
            "endT": "res_T",
            "end_Q_m3_day": "res_Q_m3_day"
        },
        "edge": {
            "res_watercut_percent": "res_watercut_percent",
            "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",
            "res_pump_power_watt": "res_pump_power_watt",
            "X_kg_sec": "res_mass_flow_kg_sec",
            "velocity_m_sec": "res_velocity_m_sec"
        }
    };
}


d3 = res.loc[res['node_name_end'] == "к.3"]

end_map = {
            "endP": "res_P",
            "endT": "res_T",
            "end_Q_m3_day": "res_Q_m3_day"
        }
PadProps = d3[["endP","endT","end_Q_m3_day"]].map(...)


liveDashPanelWhatIf.masterGraph.nodes


function readNodeResults(ds, line) {
    let dtcdObjectType2graphTypeMap = {
        "well": "node",
        "pad": "node",
        "pipe": "edge",
        "junctionpoint": "node",
        "dns": "node",
        "kns": "node",
        "injection_well": "node",
        "production_well": "node"
    }
    const nodeObjectType = targetNode.object_type;

    if ("edge" === dtcdObjectType2graphTypeMap[nodeObjectType]){
        findNFillNode("node_id_start", "node_id_start", line)
    } else {
        let node = findNFillNode("node_id_start", "node_id_start", line)
        if (node === null) {
            node = findNFillNode("node_id_end", "node_id_end", line)
            if (node === null) {
                console.log(`Node ${line.node_id_end} from dataset is not presented in the graph`)
            }
        }
    }
    console.log(node)
    return node
}

//ALL nodes
//DNS nodes
// KNS nodes
const readAsEndNodeTypes = ['injection_well', 'pad', 'pipe', 'junctionpoint']

// frequency
// VolumeWater
// Value

// fill as datalake nodes

function fillNodeResults(node, line) {
    let resPropsMap = {
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
            "res_watercut_percent": "res_watercut_percent",
            "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",
            "res_pump_power_watt": "res_pump_power_watt",
            "res_mass_flow_kg_sec": "X_kg_sec",
            "res_velocity_m_sec": "velocity_m_sec"
        }
    }
    

    
    fillNodeResults(node, line);
}

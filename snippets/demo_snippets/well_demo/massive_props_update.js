let paramsFillLivedash = liveDashPanelMonitoring;

// refer to node with query to index,
// create if needed

let dataLakeNode = paramsFillLivedash.masterGraph.nodes.toArray().find(
    node => {
        return node.tag.primitiveName === "DataLakeNode";
        //  && node.tag.properties?.['_usage'].expression === '"index_monitoring"'
    } 
);


// let q = query.filter(line => {return line["__well_num"] == '2304'})[0];
// q != undefined ? +(q["neftWellopVolumeWater"]) : 0

// props modification
function fillIndexQueries({
    nodes,
    baseQuery, propsMapping
}) {
    nodes.toArray().forEach((node) => {
        Object.entries(propsMapping).forEach(([propertyName, propertyBody]) => {
            if (propertyName in node.tag.properties) {
                const query = `
let line = ${baseQuery};
let q = 0;
if (line != undefined){
    q = line["${propertyBody}"];
    q = (+(q) !== NaN) ? +(q) : q;
}
q`;
                node.tag.properties[propertyName].expression = query;
            }
        })
    })
}

function buildIndexQuery({
    DataLakeNodeID, DataLakeNodeQParam,
    dfSearchCol, dfSearchKey
}) {
    return `${DataLakeNodeID}.${DataLakeNodeQParam}.filter(line => {return line[\"${dfSearchCol}\"] == this.${dfSearchKey}})[0]`;
}

// DNS
fillIndexQueries({
    nodes: paramsFillLivedash.masterGraph.nodes.filter(
        node => node.tag.primitiveName === "oil_well"
    ),
    baseQuery: buildIndexQuery({
        DataLakeNodeID: dataLakeNode.tag.primitiveID, // node we refer to
        DataLakeNodeQParam: "query", // prop name in datalake node we refer to
        dfSearchCol: "__well_num", //index col name
        dfSearchKey: "node_id" // search by node prop
    }),
    propsMapping: {
        "VolumeWater": 'neftWellopVolumeWater',
        "frequency": 'neftWellopPumpCurrentFreqTm',
        "Value": "value"
    }
})

// KNS

// const queryKNS = `| otstats index=tailaki_sensor_data metric_name="adkuWell_nag_WaterConsumption"
// | stats latest(value) as value by __well_num, metric_name | pivot __well_num metric_name value
// | eval value=adkuWell_nag_WaterConsumption / 86.4
// | fillnull value=0 value`;

fillIndexQueries({
    nodes: paramsFillLivedash.masterGraph.nodes.filter(
        node => node.tag.primitiveName === "oil_well_ppd"
    ),
    baseQuery: buildIndexQuery({
        DataLakeNodeID: dataLakeNode.tag.primitiveID, // node we refer to
        DataLakeNodeQParam: "query", // prop name in datalake node we refer to
        dfSearchCol: "__well_num", //index col name
        dfSearchKey: "well_num" // search by node prop
    }),
    propsMapping: {
        // "VolumeWater": 'neftWellopVolumeWater',
        // "frequency": 'neftWellopPumpCurrentFreqTm',
        // "Value": "value"
        "zakachka": "adkuWell_nag_WaterConsumption"
    }
})


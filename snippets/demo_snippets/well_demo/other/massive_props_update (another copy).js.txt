let paramsFillLivedash = liveDashPanelMonitoring;

// refer to node with query to index,
// create if needed

let dataLakeNode = paramsFillLivedash.masterGraph.nodes.toArray().find(
    node => {
        return node.tag.primitiveName === "DataLakeNode" && 
            node.tag.properties?.['_usage'].expression === '"index_monitoring"'
    } 
);

// props modification
function fillIndexQueries({
    nodes,
    baseQuery, propsMapping
}) {
    nodes.toArray().forEach((node) => {
        Object.entries(propsMapping).forEach(([propertyName, propertyBody]) => {
            if (propertyName in node.tag.properties) {
                const query = `
let q = ${baseQuery}["${propertyBody}"];
+(q) !== NaN ? +(q) : q`;
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
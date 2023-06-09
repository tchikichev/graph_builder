let liveDashPanelPPDMonitoring = Application.autocomplete.LiveDashPanel_3;

let dataLakeNode = liveDashPanelPPDMonitoring.masterGraph.nodes.toArray().find(node => node.tag.primitiveID === "DataLakeNode_58");
let queryData = dataLakeNode.tag.properties.query.value;




function extractNumAfterDot(messStr){
    let cut2nd = String(messStr).split('.').slice(-1)[0].split('"')[0];
    // return cut2nd.replace(/[^0-9]/g, ''); // get num part
    return cut2nd;
}
//mod graph
liveDashPanelPPDMonitoring.masterGraph.nodes.toArray().filter(
    node =>  node.tag.primitiveName === "oil_well_vodazabornaya"
).forEach(
    node => {
        let node_id = node.tag.properties.node_id.expression;
        let wellNum = extractNumAfterDot(node_id);

        let wellInIndex = queryIds.find(id => id === wellNum);
        if (wellInIndex == undefined){
            console.log("no well", wellNum, " in index");
        }
        node.tag.properties['well_num'] = defExpr;
        node.tag.properties['well_num'].expression = "\"" + wellNum + "\""
;
    }
)

let queryIds = queryData.map(line => line['__well_num']);

// ids.map(line => {
//     return {
//         'node_well_num': line['well_num'],
//         "qWN": queryIds.find(id => id === line['well_num'])
//     }
// })
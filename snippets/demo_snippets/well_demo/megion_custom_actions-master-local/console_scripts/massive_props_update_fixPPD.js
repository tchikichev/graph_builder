


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


let liveDash = Application.autocomplete.LiveDashPanel_4;

let dataLakeNode = liveDash.masterGraph.nodes.find(
    node => {return node.tag.primitiveName === "DataLakeNode"});

let propsMapping = Object.entries(dataLakeNode.tag.properties)
    .filter(p => !p[0].startsWith("_") && p[0] !== "query").map(([key, val]) => {
        let propertyBody = val.value;
        let baseQuery = buildIndexQuery({
        DataLakeNodeID: dataLakeNode.tag.primitiveID, // node we refer to
        DataLakeNodeQParam: "query", // prop name in datalake node we refer to
        dfSearchCol: "__well_num", //index col name
        dfSearchKey: "node_id" // search by node prop
    });
        let query = `
let q = ${baseQuery}["${propertyBody}"];
+(q) !== NaN ? +(q) : q`;
        return [key, {
    type: 'expression',
    expression: query,
  }]});
// propsMapping

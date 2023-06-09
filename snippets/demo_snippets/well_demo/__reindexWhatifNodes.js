

//find new whatif nodes
// 'oil_well', 'oil_pad'

liveDash.masterGraph.nodes.toArray().filter(node => {
    return node.tag.primitiveName === "oil_junction_point"
})

//find nodes that are not pipes
// 'oil_junction_point', 'oil_pipe', 
// 'oil_junction_point_whatif', 'oil_pipe_whatif'

// find nodes with empty expression in any of indexCols
// for some nodes with primitiveNames  
function findNewNodes({ liveDash, primitiveNames, indexCols }) {    
    let targetNodes =  liveDash.masterGraph.nodes.toArray().filter(node => {
        return primitiveNames.includes(node.tag.primitiveName)});
    return targetNodes.filter(
        node => {
            return indexCols.find(element => {
                return node.tag.properties[element].expression === "" 
            }) != undefined
        }
    ).map(node => node.tag.primitiveID)
}

let nodes2Reindex = findNewNodes({
    liveDash: liveDash,
    primitiveNames: ['oil_junction_point', 'oil_junction_point_whatif'],
    indexCols: ['node_id', 'node_name']
})
nodes2Reindex



// var names = [
//     'oil_well', 'oil_pipe', 'oil_pad', 'oil_pipe', 'TargetRichLabelNode1', 'oil_junction_point', 'oil_pipe', 'oil_dns', 'DataLakeNode', 'oil_junction_point_whatif', 'oil_pipe_whatif', 'oil_gzu', 'oil_pipe_whatif']
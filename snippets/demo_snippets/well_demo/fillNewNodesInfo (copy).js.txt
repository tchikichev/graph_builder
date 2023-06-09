
const { default: yFiles } = Application.getDependence('yFiles');

const defExpr = {
    "type": "expression",
    "expression": "",
    "status": "completed",
    "value": ""
}
// const analyzer = new yFiles.GraphStructureAnalyzer(liveDash.masterGraph)


// for dns graph

// for junction points, 
//find nodes that are not pipes
// 'oil_junction_point', 'oil_pipe', 
// 'oil_junction_point_whatif', 'oil_pipe_whatif'

// find nodes with empty expression in any of indexCols
// for some nodes with primitiveNames  
function findNewNodes({ liveDash, primitiveNames, indexCols }) {
    let targetNodes = liveDash.masterGraph.nodes.toArray().filter(node => {
        return primitiveNames.includes(node.tag.primitiveName)
    });
    return targetNodes.filter(
        node => {
            return indexCols.find(p => {
                if (!node.tag.properties.hasOwnProperty(p)) {
                    node.tag.properties[p] = defExpr;
                }
                return node.tag.properties[p].expression === ""
            }) != undefined
        }
    )
    // .map(node => node.tag.primitiveID)
}


function fillNodeProps(node, propsMap) {
    let props = node.tag.properties;
    Object.entries(propsMap).forEach(([p, val]) => {
        if (!props.hasOwnProperty(p)) {
            props[p] = defExpr;
        }
        props[p].expression = val;
    });
};

let nodes2Reindex = findNewNodes({
    liveDash: liveDash,
    primitiveNames: ['oil_junction_point', 'oil_junction_point_whatif'],
    indexCols: ['node_id', 'node_name']
})


// search from new node to dns or pad primitive
// node_name:: `${this.primitiveID} to ${descendant.node_name}`

// let nodesNew = liveDash.masterGraph.nodes.toArray().filter(node => {
//     return node.tag.properties?.node_id === ""
// }).map(node => node.tag.primitiveID);


let dnsNpadNodes = liveDash.masterGraph.nodes.toArray().filter(node => {
    return ((node.tag.primitiveName === "oil_pad") || (
        node.tag.primitiveName === "oil_dns")) && (
            node.tag.properties.node_id != ""
        )
});

// configure the shortest path algorithm
let sourceNodes = nodes2Reindex;
let targetNodes = dnsNpadNodes;
const algorithm = new yFiles.AllPairsShortestPaths({
    // multiple source and sink nodes
    sources: nodes2Reindex,
    sinks: dnsNpadNodes,
    // add edge cost mapping which returns the actual length of the edge
    costs: () => 1
})

function findClosestTarget(sourceNode, allPairsShortestPathsAlgorithmResult) {
    var evalPath = targetNodes.map(targetNode => {
        let path = allPairsShortestPathsAlgorithmResult.getPathBetween(
            sourceNode, targetNode)
        return {
            'targetNode': targetNode,
            'distance': path == null ? Infinity : path.distance // if path exists
        };
    }).reduce(function (prev, curr) { // select with min distance
        return prev.distance < curr.distance ? prev : curr;
    });
    return evalPath.distance != Infinity ? evalPath.targetNode : null
}

// if node is outside of the graph, no path is returned
// let nodeExt = liveDash.masterGraph.nodes.toArray().find(node=> node.tag.primitiveID === "oil_55");
// findClosestTarget(nodeExt, result)

// run the algorithm:
// calculate paths from startNode to all nodes in the graph
const allPairsShortestPathsAlgorithmResult = algorithm.run(liveDash.masterGraph);

let closestObjects = sourceNodes.map(sourceNode => {
    return {
        "source": sourceNode,
        "target": findClosestTarget(
            sourceNode, allPairsShortestPathsAlgorithmResult)
    };
}
).filter(pair => pair.target != null);

closestObjects.map(pair => {
    return {
        "sourceID": pair.source.tag.primitiveID,
        "targetID": pair.target.tag.primitiveID
    }
})

// dns & pad new ondes fill default props [Name, node_name, node_id, ...]
findNewNodes({
    liveDash: liveDash,
    primitiveNames: ['oil_gzu', 'oil_dns'],
    indexCols: ['node_id', 'node_name']
}).forEach(node => {
    const sIDnum = Number(node.tag.primitiveID.split("_").slice(-1)[0]);
    // use number from node.tag.PrimitiveID as id
    const name = `"whatif к. ${sIDnum}"`;
    const propsMap = {
        "node_name": name,
        "Name": name,
        "IsSource": false,
        "IsOutlet": false,
        "node_id": `"${node.tag.primitiveID}"`,
        "object_type": `"pad"`,
    };
    fillNodeProps(node, propsMap);
    if (node.tag.primitiveName === 'oil_dns') {
        node.tag.properties.object_type.expression = `"dns"`;
    }
});


// oil_well | oil...well new nodes fill default props [Name, node_name, node_id, ...]
let newWellNodes = findNewNodes({
    liveDash: liveDash,
    primitiveNames: ['oil_well', 'oil_well_vodazabornaya', 'oil_well_ppd'],
    indexCols: ['node_id', 'node_name']
});
// todo:: fing gzu name as for new junction point
newWellNodes.forEach(node => {
    const sIDnum = Number(node.tag.primitiveID.split("_").slice(-1)[0]);
    // use number from node.tag.PrimitiveID as id
    // "к.44__скв.6001"
    const name = `"whatif_к.undefined__скв.${sIDnum}"`;
    const propsMap = {
        "node_name": name,
        "Name": name,
        "IsSource": true,
        "IsOutlet": false,
        "node_id": `"${node.tag.primitiveID}"`,
        "object_type": `"well"`,
    };
    fillNodeProps(node, propsMap);
    let props = node.tag.properties;
    if (node.tag.primitiveName === 'oil_well_ppd') {
        props.IsSource.expression = false;
        props.IsOutlet.expression = true;
    }
});

// fill junctionpoint nodes
closestObjects.forEach(pair => {
    let sProps = pair.source.tag.properties; // thisnode
    let tProps = pair.target.tag.properties; // closest gzu | dns

    const sID = pair.source.tag.primitiveID;
    const sIDnum = Number(sID.split("_").slice(-1)[0]);
    const name = `"whatif т.вр. ${tProps.node_name.value} ${sIDnum}"`;

    const propsMap = {
        "node_name": name,
        "Name": name,
        "IsSource": false,
        "IsOutlet": false,
        "node_id": `"${pair.source.tag.primitiveID}"`,
        "object_type": `"junctionpoint"`,
    };
    fillNodeProps(node, propsMap);
})


// WARNING:: expects other value to be calculated already
// to refactor

// fill pipe nodes
// edge nodes req predecessor & successor info
// node_name = "к.44__скв.6001__к.44" == pred + "__" + succ
findNewNodes({
    liveDash: liveDash,
    primitiveNames: ['oil_pipe', 'oil_pipe_vodazabornaya', 'oil_pipe_ppd', 'oil_pipe_whatif'],
    indexCols: ['node_id_start', 'node_id_end', 'node_name']
}).forEach(node => {
    const sIDnum = Number(node.tag.primitiveID.split("_").slice(-1)[0]);
    let node_id_start = null;
    let node_id_end = null;
    try {
        let predTag = liveDash.masterGraph.predecessors(node).toArray()[0].tag;
        node_id_start = eval(predTag.properties.node_id.expression);
        // node_id_start = predTag.properties.node_id.value;
    } catch (error) {
        console.error(node.tag.primitiveID, "node_id_start is undefined");
        node_id_start = "undefined";
    }
    try {
        let succTag = liveDash.masterGraph.successors(node).toArray()[0].tag;
        // node_id_end = succTag.properties.node_id.value;
        node_id_end = eval(succTag.properties.node_id.expression);

        // node_id_end = succTag.properties.node_id.value;
    } catch (error) {
        console.error(node.tag.primitiveID, "node_id_end is undefined");
        node_id_end = "undefined";
    }
    const name = `"wpipe${sIDnum}__${node_id_start}__${node_id_end}"`;
    console.log("name", name);

    const propsMap = {
        "node_name": name,
        "Name": name,
        "IsSource": false,
        "IsOutlet": false,
        "node_id_start": `"${node_id_start}"`,
        "node_id_end": `"${node_id_end}"`,
        "object_type": `"pipe"`,
    };
    fillNodeProps(node, propsMap);
});


function clrWhatifPipeProps(){
    liveDash.masterGraph.nodes.toArray().filter(
        node => {
            return (
        node.tag.primitiveName === "oil_pipe_whatif"
                )}).forEach(node=> {
        const propsMap = {
            "node_name": "",
            "Name": "",
            "IsSource": false,
            "IsOutlet": false,
            "node_id_start": "",
            "node_id_end": "",
            "object_type": `"pipe"`,
        };
        fillNodeProps(node, propsMap);
                })
}


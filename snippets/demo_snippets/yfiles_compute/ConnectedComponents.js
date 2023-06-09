const { default: yFiles } = Application.getDependence('yFiles');

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({
    stroke: '2px solid',
    //   targetArrow: yFiles.IArrow.DEFAULT 
});

function toExclude(node) {
    // '''if element is disconnected - we split graph in groups'''
    // exclude elems that might be disconnected
    const _primitiveID = node.tag.primitiveID;

    // eval only for electrical primitives
    const isElectrical = "ExtensionElectricalSchemePrimitives" === node.tag.extensionName;
    console.log("isElectrical", _primitiveID, isElectrical);
    
    if (isElectrical){
        const names = ['Breaker', 'LoadBreakSwitch', 'Disconnector', 'GroundSwitch', 'Transformer', 'Separator'];
        const isBreaker = node =>
            names.some(element => node.tag.primitiveName.includes(element));
        if (false === isBreaker)
            return { id: _primitiveID, disconnected: false };

        // switch connected ? false || true
        
        // off by default
        if (false === node.tag.properties.hasOwnProperty('active'))
            return { id: _primitiveID, disconnected: false };

        let isDisabledBreaker = (false === node.tag.properties.active.value);
        console.log("breaker disconnected : ", _primitiveID, isDisabledBreaker);
        return { id: _primitiveID, disconnected: isDisabledBreaker };
    }
    else{
        console.log("skip not electrical : ", _primitiveID, node.tag.extensionName);
        return { id: _primitiveID, disconnected: true };
    }
};

function _edgeDirectedness(edge) {
    let s = edge.sourceNode;
    let f = edge.targetNode;

console.log("s & f.tag.properties", s.tag.properties, f.tag.properties);

    if (
        (true === s.tag.properties.hasOwnProperty('directed'))
        && (false === s.tag.properties.directed.value)
        )
        return 0.0;
    if (
        (true === f.tag.properties.hasOwnProperty('directed'))
        && (false === f.tag.properties.directed.value)
        )
        return 0.0;
    return -1.0;
};

// let nodeID = "BreakerOff_21";

// let edge = graph.edges.find(e => e.sourceNode == nodeID);
// _edgeDirectedness(edge)

// configure the connected components algorithm
const algorithm = new yFiles.ConnectedComponents({
    subgraphNodes: {
        excludes:
            node => toExclude(node).disconnected
    },
    subgraphEdges: {
        excludes: edge => edge.sourceNode === edge.targetNode
    },
    edgeDirectedness: {
        includes: edge => _edgeDirectedness(edge)
        // one of neighbour nodes has [directed == false]
    }
})
// run the algorithm
const result = algorithm.run(graph)

// highlight the nodes of the connected components with different styles
for (const node of graph.nodes) {
    const componentId = result.nodeComponentIds.get(node);
    // graph.setStyle(node, componentStyles.get(componentId))
    // console.log({[]})
    console.log(node.tag.primitiveID, componentId);
    // graph.setStyle(node, componentStyles.get(componentId))
}
' '
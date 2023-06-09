// consider self loops here

// excludes: edge => edge.sourceNode === edge.targetNode


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
// let nodesToExclude = graph.nodes.map(toExclude).toArray();
// console.log("nodesToExclude 1", nodesToExclude);

// console.log("single_val: ",  toExclude(graph.nodes.find(node => node.tag.primitiveID == "BreakerOff_21")).disconnected);
// // nodesToExclude.flatMap(Object.values)
// nodesToExclude.map(e => e.disconnected);

// use as :::
// node => toExclude(node).disconnected
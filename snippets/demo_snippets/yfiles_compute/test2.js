let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

let inPower = 0;
if (inEdges.length < 1) ' '
else {
    inEdges.forEach((element) => {
        console.log({ element });
        inPower += element.sourcePort.tag.primitiveID.status;
    });
    // eval(inEdges[0].sourcePort.tag.primitiveID).status
}
inPower




let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

console.log({inEdges});

let inPower = 0;
let pid = 0;
if (inEdges.length < 1) ' '
else {

    inEdges.forEach((element) => {
        console.log({ element });
        pid = element.sourcePort.tag.primitiveID;
        console.log({ pid.status });
        //inPower += element.sourcePort.tag.primitiveID.status;
    });
    // eval(inEdges[0].sourcePort.tag.primitiveID).status
}
' '


let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

let inPower = 0;
if (inEdges.length < 1) ' '
else {
    inEdges.forEach((element) => {
        inPower += eval(element.sourcePort.tag.primitiveID).status;
    });
}
inPower


номинальные значения вс временные ряды

расчет суммы по графу

прочитать связи, прочитать элементы, прочитать порты
посчитать матрицу коммутации, записать в платформу, посчитать произведение

матрица === взять готовую,
данные === сгенерить
добавить свою команду, посчитать


матрица == строится по графу

для обычных компонентов

уравнения == сумма входов

http://bigor.bmstu.ru/?cnt/?doc=Mod/tab_metod.mod/?cou=Mod/base.cou




// graph.nodes.filter(n => n.tag.properties)

// const evalDirected = graph.nodes.map(
//     node => (undefined === node.tag.properties.directed) ? True : node.tag.properties.directed);

// console.log(evalDirected.toArray());
// evalDirected


const evalDirected = graph.nodes.map(
    function (node) {
        if (false === node.tag.properties.hasOwnProperty('directed'))
            return false;
        let directed = node.tag.properties.directed.value ? true : false;
        console.log(node.tag.primitiveID, directed);
        return directed;
    }
);
console.log(evalDirected.toArray());
evalDirected


// .find(node => node.tag.properties.test_val !== undefined);
// console.log(find_test_val);
// find_test_val




const { default: yFiles } = Application.getDependence('yFiles');

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({ 
  stroke: '2px solid',
//   color: "r", 
//   targetArrow: yFiles.IArrow.DEFAULT 
});

// graph.edges.forEach(element => {
//   graph.setStyle(element, colorEdgeStyle)
// });
// ' '

// array(['Breaker', 'Breaker', 'LoadBreakSwitch', 'LoadBreakSwitch',
//        'Disconnector', 'Disconnector', 'GroundSwitch', 'GroundSwitch',
//        'GroundSwitch', 'GroundSwitch', nan, nan, 'Breaker', 'Breaker',
//        nan, nan, nan, nan, nan, nan, nan, 'PowerTransformer',
//        'PowerTransformer', 'PowerTransformer', 'PowerTransformer',
//        'PowerTransformer', 'PowerTransformer', 'PetersenCoil',
//        'PetersenCoil', 'PotentialTransformer', 'PotentialTransformer',
//        'WaveTrap', nan, nan, 'SurgeArrester', nan, 'Fuse', nan, nan, nan,
//        nan, nan, 'CurrentTransformer', 'Terminal', nan, 'ACLineSegment',
//        'ACLineSegment', 'ACLineSegment', 'ACLineSegment', 'ACLineSegment',
//        'ACLineSegment', 'ACLineSegment', 'ACLineSegment', 'ACLineSegment',
//        'ACLineSegment', 'ACLineSegment', 'ACLineSegment', 'ACLineSegment',
//        'ACLineSegment', 'ACLineSegment', 'ACLineSegment', 'ACLineSegment',
//        'ACLineSegment', 'ACLineSegment', 'ACLineSegment', 'BusbarSection',
//        'BusbarSection', 'BusbarSection', 'BusbarSection', 'BusbarSection',
//        'BusbarSection', 'BusbarSection', 'BusbarSection', 'BusbarSection',
//        'BusbarSection', 'ConnectivityNode', 'GeographicalRegion',
//        'SubGeographicalRegion', 'Organisation', 'Substation',
//        'VoltageLevel', 'Bay', nan, nan, nan, nan], dtype=object)



// configure the connected components algorithm
const algorithm = new yFiles.ConnectedComponents({
    subgraphNodes: {
        excludes: function (node) {
            const names = ['Breaker', 'LoadBreakSwitch', 'Disconnector', 'GroundSwitch', 'Transformer', 'Separator'];

            const isBreaker = node =>
                "ExtensionRiskPrimitives" === node.tag.extensionName &&
                names.some(element => node.tag.primitiveName.includes(element));

            // let isBreaker =
            //     "ExtensionRiskPrimitives" === node.tag.extensionName &&
            //     node.tag.primitiveName.includes("Breaker");
            let isDisabledBreaker = isBreaker &&
                true === node.tag.properties.hasOwnProperty('active') &&
                false === node.tag.properties.active.value;
            console.log(node.tag.primitiveID, isDisabledBreaker);
            return val;
        }
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












const { default: yFiles } = Application.getDependence('yFiles');

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({
    stroke: '2px solid',
    //   targetArrow: yFiles.IArrow.DEFAULT 
});

// configure the connected components algorithm
const algorithm = new yFiles.ConnectedComponents({
    subgraphNodes: {
        excludes: function (node) {
            // exclude elems that might be disconnected
            const names = ['Breaker', 'LoadBreakSwitch', 'Disconnector', 'GroundSwitch', 'Transformer', 'Separator'];
            const isBreaker = node =>
                "ExtensionRiskPrimitives" === node.tag.extensionName &&
                names.some(element => node.tag.primitiveName.includes(element));
            console.log(node.tag.primitiveID, isDisabledBreaker);

            if (false === isBreaker)
                return false;

            if (true === node.tag.properties.hasOwnProperty('active')) {
                console.log("breaker active : ", node.tag.primitiveID, node.tag.properties.active.value);
            }
            let isDisabledBreaker =
                true === node.tag.properties.hasOwnProperty('active') &&
                false === node.tag.properties.active.value;
            console.log(node.tag.primitiveID, isDisabledBreaker);
            return isDisabledBreaker;
        }
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



function toExclude(node) {
    // exclude elems that might be disconnected
    const names = ['Breaker', 'LoadBreakSwitch', 'Disconnector', 'GroundSwitch', 'Transformer', 'Separator'];
    const isBreaker = node =>
        "ExtensionRiskPrimitives" === node.tag.extensionName &&
        names.some(element => node.tag.primitiveName.includes(element));
    console.log(node.tag.primitiveID, isBreaker);
    
    if (false === isBreaker)
        return false;

    if (true === node.tag.properties.hasOwnProperty('active')) {
        console.log("breaker active : ", node.tag.primitiveID, node.tag.properties.active.value);
    }
    let isDisabledBreaker =
        true === node.tag.properties.hasOwnProperty('active') &&
        false === node.tag.properties.active.value;
    console.log(node.tag.primitiveID, isDisabledBreaker);
    return isDisabledBreaker;
}
let nodesToExclude = graph.nodes.map(toExclude).toArray();
console.log("nodesToExclude", nodesToExclude);
nodesToExclude





function toExclude(node) {
    // exclude elems that might be disconnected
    const _primitiveID = node.tag.primitiveID;

    // eval only for electrical primitives
    // const isElectrical = (node) => ("ExtensionRiskPrimitives" === node.tag.extensionName);
    

    if (node => "ExtensionRiskPrimitives" === node.tag.extensionName){
        const names = ['Breaker', 'LoadBreakSwitch', 'Disconnector', 'GroundSwitch', 'Transformer', 'Separator'];
        const isBreaker = node =>
            names.some(element => node.tag.primitiveName.includes(element));
        if (false === isBreaker)
            return { [_primitiveID]: false };

        // switch active ? false || true
        
        // off by default
        if (false === node.tag.properties.hasOwnProperty('active'))
            return { [_primitiveID]: true };

        let isDisabledBreaker = (false === node.tag.properties.active.value);
        console.log("breaker active : ", _primitiveID, isDisabledBreaker);
        return { [_primitiveID]: isDisabledBreaker };
    }
    else{
        console.log("skip not electrical : ", _primitiveID, node.tag.extensionName);
        return { [_primitiveID]: true };
    }
};
let nodesToExclude = graph.nodes.map(toExclude).toArray();
console.log("nodesToExclude 1", nodesToExclude);

nodesToExclude = nodesToExclude.filter(val => val == true);
console.log("nodesToExclude 2", nodesToExclude);
nodesToExclude
// true_keys = Object.keys(nodesToExclude).filter(key => (nodesToExclude[key] == true));

// console.log("nodesToExclude", true_keys);
// Object.keys(true_keys)




// let nodesToExclude = graph.nodes.map(toExclude).toArray();
// console.log("nodesToExclude 1", nodesToExclude);

// nodesToExclude = nodesToExclude.filter((k, v) => v == true);
// console.log("nodesToExclude", nodesToExclude);

// Object.keys(nodesToExclude)



// function nEl(node) {
//     if (node => ("ExtensionElectricalSchemePrimitives" !== node.tag.extensionName)) {
//         console.log("skip not electrical : ", _primitiveID, node.tag.extensionName);
//         return { [_primitiveID]: true };
//     }
// };
// let nElectrical = graph.nodes.map(nEl);
// nElectrical


// isElectrical working, no filtering


function toExclude(node) {
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
            return { [_primitiveID]: false };

        // switch active ? false || true
        
        // off by default
        if (false === node.tag.properties.hasOwnProperty('active'))
            return { [_primitiveID]: false };

        let isDisabledBreaker = (false === node.tag.properties.active.value);
        console.log("breaker active : ", _primitiveID, isDisabledBreaker);
        return { [_primitiveID]: isDisabledBreaker };
    }
    else{
        console.log("skip not electrical : ", _primitiveID, node.tag.extensionName);
        return { [_primitiveID]: true };
    }
};
let nodesToExclude = graph.nodes.map(toExclude).toArray();
console.log("nodesToExclude 1", nodesToExclude);

nodesToExclude = nodesToExclude.filter(val => val == true);
console.log("nodesToExclude 2", nodesToExclude);
nodesToExclude




// prepare the label propagation algorithm
const algorithm = new LabelPropagationClustering({
    edgeWeights: edge =>
      edge.style instanceof PolylineEdgeStyle ? edge.style.stroke.thickness : 0,
    nodeWeights: node => node.layout.width
  })
  // run the algorithm
  const result = algorithm.run(graph)
  
  // highlight the nodes of the clusters with different styles
  for (const node of graph.nodes) {
    const componentId = result.nodeClusterIds.get(node)
    graph.setStyle(node, clusterStyles.get(componentId))
  }




const { default: yFiles } = Application.getDependence('yFiles');

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({
    stroke: '2px solid',
    //   targetArrow: yFiles.IArrow.DEFAULT 
});

function toExclude(node) {
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
            return { [_primitiveID]: false };

        // switch active ? false || true
        
        // off by default
        if (false === node.tag.properties.hasOwnProperty('active'))
            return { [_primitiveID]: false };

        let isDisabledBreaker = (false === node.tag.properties.active.value);
        console.log("breaker active : ", _primitiveID, isDisabledBreaker);
        return { [_primitiveID]: isDisabledBreaker };
    }
    else{
        console.log("skip not electrical : ", _primitiveID, node.tag.extensionName);
        return { [_primitiveID]: true };
    }
};

// configure the connected components algorithm
const algorithm = new yFiles.ConnectedComponents({
    subgraphNodes: {
        excludes: 
            node => toExclude(node)
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
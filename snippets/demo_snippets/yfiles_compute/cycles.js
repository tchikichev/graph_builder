
const { default: yFiles } = Application.getDependence('yFiles');

// prepare the cycle edge detection algorithm
const algorithm = new yFiles.CycleEdges({
  // We are only interested in finding directed cycles
  directed: false
});
// run the algorithm
const result = algorithm.run(graph);
// console.log(result.edges);

// let ge_array = graph.edges.toArray();
// const defaultStyle = ge_array[0].style;
// console.log("defEdgeStyle", defaultStyle);

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({ 
   stroke: '3px solid red', 
   targetArrow: yFiles.IArrow.DEFAULT 
});
// console.log("colorEdgeStyle", colorEdgeStyle);

for (const edge of result.edges) {
  graph.setStyle(edge, colorEdgeStyle)
    console.log(edge.sourcePort.tag.primitiveID);
}
' '


// const { default: yFiles } = Application.getDependence('yFiles');
// for (const edge of graph.edges) {
//   graph.setStyle(edge, colorEdgeStyle)
//     console.log(edge.sourcePort.tag.primitiveID);
// }
// ' '


const { default: yFiles } = Application.getDependence('yFiles');

const colorEdgeStyle = new yFiles.PolylineEdgeStyle({ 
  stroke: '1px solid', 
  targetArrow: yFiles.IArrow.DEFAULT 
});

graph.edges.forEach(element => {
  graph.setStyle(element, colorEdgeStyle)
});
' '



let this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
let preds = graph.predecessors(this_node).map(node => node.tag.primitiveID).toArray();
let vals = preds.map(nodeID => eval(nodeID).outPort1);
// let vals = Array(preds.map(nodeID => eval(nodeID).outPort1))[0];

let sum = 0;
for (const element of arr) {
  sum = sum + parseFloat(element)
}
parseFloat(24 * sum.toFixed(2))


//  parse child sourcePort status data to dict

let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

let inData = [];

if (inEdges.length < 1) []
else {

  inData = inEdges.map(function (e) {
    let prID = e.sourcePort.tag.primitiveID;
    let port = graph.ports.find(port => port.tag.primitiveID === prID);
    // console.log("port", port);
    let val = eval(port.tag.primitiveID).status;
    return ({ [prID]: val });
  });
};
inData


poweredBy

estimate power source === 

// ps1->f3->ps2->f13->s1->x

// f13->s1->x
// f3->s2->x

x.poweredBy == [{
  //top-down propagation
  source: "ps1_f13",
  pow_nom_kV: 35,
  pow_limit_kVA: 680,
  //down to top propagation
  // pow_usage_kVA: "",
  // K_line_usage_pc: "",
}

]

go from input (input, transformer, ...) undirected to all connectivity nodes, switches


обход графа - 
let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

//console.log({inEdges});


let inPower = 0;
let pid = 0;
if (inEdges.length < 1) ' '
else {

    inEdges.forEach((element) => {
        //console.log({ element });
        pid = eval(element.sourcePort.tag.primitiveID).status;
        //console.log({ pid});
        inPower += pid;
    });
}
inPower



let properties = graph.nodes.toArray().map(
    node => eval(node.tag.properties));
    console.log(properties);
    
    // console.log(properties[2].hasOwnProperty("is_grounded")); // true
    
    
    const items = graph.nodes.filter(node => eval(node.tag.properties).hasOwnProperty("is_grounded") === True);
    
    console.log(items);
    
    ' '

    JSON.stringify(Array(this.name, graph.predecessors(
        graph.nodes.find(
        node => node.tag.primitiveID === primitiveID)).map(
        node => node.tag.primitiveID).toArray().map(nodeID => eval(nodeID).children)))

let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

let inEdgesPower = inEdges.map(edge => eval(edge.sourcePort.tag.primitiveID).status).toArray();
console.log("inEdgesPower", inEdgesPower);
inEdgesPower

.map(
    node => node.tag.primitiveID).toArray().map(nodeID => eval(nodeID).children)))
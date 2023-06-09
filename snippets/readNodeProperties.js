let targetNodeID = "oil_well_65833";
let liveDash = Application.autocomplete.LiveDashPanel_3;

let props = liveDash.masterGraph.nodes.toArray().find(node => node.tag.primitiveID == targetNodeID).tag.properties;
let propNames = Object.entries(props).map(([name, prop]) => name)
copy(propNames)
propNames

## measure tab on load

query

| writeFile format=csv path=measurementsPPD.csv

  const queryString = datasetToOtl({data: wideTable, schema})+ '| writeFile format=csv path=measurementsPPD.csv'



## test dyn otl prop

let wells = graph.nodes.toArray().filter(
  node => node.tag.properties?.object_type).filter(
  node => node.tag.properties?.node_id).filter(
    node => { return (
    node.tag.properties.object_type.value == 'oil_well_ecn'
    || node.tag.properties.object_type.value == 'ПС 35/6 кВ'
    )
}).map(node => node.tag.properties.node_id.value);
console.log(wells);

let totalString = wells.join(`&&&`);
//console.log(totalString);

`
| makeresults count=1
| eval _total_string = "${totalString}"
| eval _split_string = split(_total_string, "&&&")
| mvexpand _split_string
      `



prop 1 >> construct query
wrute to p2, change p2 status to incomplete >> solve

or p2:otl = 'makeresults | ${this.dyn_query}'








По аналогии с вашим кодом, который заполняет динамически запрос на OTL:

let this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;

props.otl.expression.original_otl = this.inPort2 + "| join id_tar [| readFile format=csv path="+this.inPort1+"] |eval m = tonumber(s) * tonumber(st1)" + "| writeFile format=csv path=tmp.csv";

props.otl.status = "new";
props.otl.value = "";
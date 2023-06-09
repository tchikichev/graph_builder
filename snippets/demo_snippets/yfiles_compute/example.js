let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
console.log(primitiveID);
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray()
let outEdges = graph.outEdgesAt(portOwner).filter(edge => edge.sourcePort.tag.primitiveID === primitiveID).toArray()
console.log(inEdges, outEdges);
if (inEdges.length < 1) {
    if (outEdges.length < 1) ' '
    else {
        eval(outEdges[0].targetPort.tag.primitiveID).status
    }
}
else {
    eval(inEdges[0].sourcePort.tag.primitiveID).status
}


let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray()
if (inEdges.length < 1) ' '
else {
    eval(inEdges[0].sourcePort.tag.primitiveID).status
}

battery.power
"fs/batteries/" + primitiveID + "/voltage"

swith.status
"fs/switches/" + primitiveID + "/status_on"


my_battery_power
fs/batteries/Generator_8/voltage
my_swith_status
fs/switches/BreakerOn_12/status_on


использование токенов в OTL запросах - в релиз

| fsget input = my_battery_power | find id = this.id
| fsget input = my_swith_status | find id = this.id



пс рынковой,яч 13 счетчик

есть столько жидкости со скважин
понадобится свтолько энергии, посчитать вверх до станции




платформа

лежат все временные ряды объектов и статусов

посчитать запросом временные ряды расчетов


лампочка - 
//понимает где находится
достает свойства объектов, читает топологию соседей - контур, определяется входной ток

ток лампочки - как посчитать через yfiles??


1 gb sin, 50hz, 

напряжение - постооянное напряжение
или разряд батарейки

график яркости - получаем график значений яркости в датакаде

как показать гигабайт данных на графике - resample


параллельные соединения компонентов - отработать сценарий анализа топологии графа



Dmitry Kiryanov
6:28 PM
1. в элементы (батарейка и выключатель) написать  OTL запросы, которые вынимают из базы данные за нужное время и перекладывают в фичестор маленькую табличку? типа U(t)
2. Из лампочки запрос обращается в фичестор и выводит график




// prepare the spanning tree detection algorithm
const algorithm = new SpanningTree();
// run the algorithm
const result = algorithm.run(graph);

let pid = '';
// Remove the edges in the reduction
for (const edge of result.edges) {
  // graph.setStyle(edge, spanningTreeEdgeStyle)
  console.log({ edge });
  pid = edge.sourcePort.tag.primitiveID;
  console.log({ pid });
}

// testing 
let this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;

//set OTL string
props.OTL.expression.original_otl = "| makeresults count = " + this.res_count;

//"status": "new",
props.OTL.status = "new";
//"value": "",
props.OTL.value = "";

props.OTL.expression.original_otl

graph.predecessors(
    graph.nodes.find(
    node => node.tag.primitiveID === primitiveID)).map(
    node => node.tag.primitiveID).toArray().map(nodeID => eval(nodeID).testField)


const algorithm = new SpanningTree()
// run the algorithm
const result = algorithm.run(graph)

console.log(result.edges)
// console.log(result.edges.toArray())
' '

console.log(graph.edges.length);

console.log(graph.edges)
' '


const { default: yFiles } = Application.getDependence('yFiles');
// const span_tree = new yFiles.SpanningTree();

let ge_array = graph.edges.toArray();
const defaultStyle = ge_array[0].style;

// let updEdgeStyle = defaultStyle.clone();
//  is in cycle
// updEdgeStyle.stroke = '3px solid green'

let updEdgeStyle = new PolylineEdgeStyle({
    stroke: '3px solid red',
    targetArrow: new Arrow({
      fill: 'red',
      scale: 3,
      type: 'default'
    })
  })

// const result = algorithm.run(graph);
// console.log(result.edges);
// console.log(graph.edges.toArray().length);

// prepare the cycle edge detection algorithm
const algorithm = new CycleEdges({
  // We are only interested in finding directed cycles
  directed: false
})
// run the algorithm
const result = algorithm.run(graph)

// highlight the cycle
for (const edge of result.edges) {
//   graph.setStyle(edge, highlightCycleEdgesStyle)
  graph.setStyle(edge, updEdgeStyle)
}
' '



$%%




const { default: yFiles } = Application.getDependence('yFiles');

// prepare the cycle edge detection algorithm
const algorithm = new CycleEdges({
  // We are only interested in finding directed cycles
  directed: false
})
// run the algorithm
const result = algorithm.run(graph)

let updEdgeStyle = new PolylineEdgeStyle({
    stroke: '3px solid red',
    targetArrow: new Arrow({
      fill: 'red',
      scale: 3,
      type: 'default'
    })
  })


highlight the cycle
for (const edge of result.edges) {
//   graph.setStyle(edge, highlightCycleEdgesStyle)
  graph.setStyle(edge, updEdgeStyle)
}
' '



#%%




const { default: yFiles } = Application.getDependence('yFiles');

// prepare the cycle edge detection algorithm
const algorithm = new yFiles.CycleEdges({
  // We are only interested in finding directed cycles
  directed: false
});
// run the algorithm
const result = algorithm.run(graph);
console.log(result.edges);

let ge_array = graph.edges.toArray();
const defaultStyle = ge_array[0].style;
console.log("defEdgeStyle", defaultStyle);

const colorEdgeStyle = new PolylineEdgeStyle({ targetArrow: IArrow.DEFAULT });
console.log("colorEdgeStyle", colorEdgeStyle);
//updEdgeStyle.stroke.fill.r = 255;
// highlight the cycle
for (const edge of result.edges) {
  // console.log(edge.sourcePort.tag.primitiveID);
  graph.setStyle(edge, colorEdgeStyle);
}
' '


// load from cdn


<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.1.0/math.js" integrity="sha512-I3BR04+2bI75SNyY+c6cJWCUuseVbX1Zn952KS2Lw6+VKuZSA4tXkX5Py+T8N2I9SMT2+iQkE6eSISbhNxBMmw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

// var _loaded = {};
function addScript(url, name) {
  // if (!loaded[url]) {
  if (!document.getElementById("load_script_" + name)) {
    var s = document.createElement("load_script_" + name);
    s.src = url;
    document.head.appendChild(s);
    // _loaded[url] = true;
  }
}

const src_url="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.1.0/math.js";
addScript(src_url, "mathjs");
' '

const element = document.createElement('div');
element.id = 'testqq';
const el = document.getElementById('testqq'); // el will be null!


function addScript(url) {
  if (!document.getElementById("load_" + url)) {
    var s = document.createElement("script");
    console.log("create_el", url);
    s.src = url;
    s.id = "load_" + url;
    document.head.appendChild(s);
  }
}
const url="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.1.0/math.js";
addScript(url);
' '\

// latest updat
let properties = graph.nodes.toArray().map(
  node => eval(node.tag.properties));
console.log(properties);
  
// console.log(properties[2].hasOwnProperty("is_grounded")); // true


const items = graph.nodes.filter(node => eval(node.tag.properties).hasOwnProperty("is_grounded") === True);

console.log(items);

' '

// change OTL example
const this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;

const otl_query = `
   | makeresults count = ${this.res_count}
   | eval power = ${this.power}
   | streamstats count by power
   | fields - _time
   | rename count as _time
   | fsput path=fs/component_fs/${primitiveId}/power
   | head 1
`;
console.log(primitiveId, "otl_query", otl_query);

//set OTL string
props.value.expression.original_otl = otl_query;
props.value.status = "new";
props.value.value = "";
props.value.expression.original_otl


const this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;
console.log("props", props);

console.log("primitiveID", primitiveID);

let fs_path = "fs/component_fs/" + primitiveID + "/power";
console.log("fs_path", fs_path);

const otl_query = "
   | makeresults count = " + this.res_count + "
   | eval power = " + this.power + "
   | streamstats count by power
   | fields - _time
   | rename count as _time
   | fsput path=" + fs_path + "
   | head 1
";
console.log(primitiveId, "otl_query", otl_query);

//set OTL string
props.value.expression.original_otl = otl_query;
props.value.status = "new";
props.value.value = "";
// props.value.expression.original_otl
fs_path







```js
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
' '


```



0-100 value to green-to-red color

```js
function getColor(value) {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}
var len = 20;
for (var i = 0; i <= len; i++) {
  var value = i / len;
  var d = document.createElement('div');
  d.textContent = "value=" + value;
  d.style.backgroundColor = getColor(value);
  document.body.appendChild(d);
}

```


red to green
```js

// Just used as a shortcut for below, completely optional
const red = 0,
  yellow = 60,
  green = 120,
  turquoise = 180,
  blue = 240,
  pink = 300;


function hsl_col_perc(percent, start, end) {
  var a = percent / 100,
    b = (end - start) * a,
    c = b + start;

  // Return a CSS HSL string
  return 'hsl(' + c + ', 100%, 50%)';
}

// let colour = hsl_col_perc(percent, red, green); //Red -> Green

```




let gen = Application.autocomplete.LiveDashPanel_guid18.createNode(0, 0, "ExtensionElectricalSchemePrimitives", "Generator", undefined);





```js
const items = graph.nodes.filter(node => eval(node.tag.properties).hasOwnProperty("dynamic") === True);
let ids = items.map(node => node.tag.primitiveID).toArray();
console.log("items", items);
console.log("items ids", ids);
ids
```



filtering   

```js
// contours
const { default: yFiles } = Application.getDependence('yFiles');

const result = new yFiles.DegreeCentrality({
    considerIncomingEdges: true,
    considerOutgoingEdges: false
}).run(graph);


result.nodeCentrality.forEach(entry => {
  const node = entry.key;
  const centrality = entry.value;
  // console.log(node.tag.primitiveID, centrality);
});

const startNodes = result.nodeCentrality.filter(entry => 0 === entry.value).map(entry => entry.key);

const startNodeIds = startNodes.map(node =>node.tag.primitiveID).toArray();

console.log("startNodeIds", startNodeIds);
startNodeIds

```

## recolor


```js
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
```

filter by props

JSON.stringify(graph.nodes.filter(node => node.tag.properties.prop !== undefined ).map(
node => {return [{name : node.tag.properties.name.value},{prop : node.tag.properties.prop.value}]}).toArray())


Если добавить вот эту часть кода, то получается ваще пустой список.
```js

const currentNode = graph.nodes.find(n => n.tag.primitiveID === primitiveID)
graph.successors(currentNode).filter(node => node.tag.properties.hasOwnProperty('P').map(node => { return {P: node.tag.properties.P.value}})

``
```

```js

const currentNode = graph.nodes.find(n => n.tag.primitiveID === primitiveID);
```




recolor nodes



```js
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

```
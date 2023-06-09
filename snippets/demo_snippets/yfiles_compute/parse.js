

как собрать матрицу из элементов

итоговая матрица * вектор базисных функций

базис - 
* токи элементов
* потенциалы узлов

узлы - все элементы где больше одного дочернего элемента

в графе для каждого посчитать количество детей

// import yfiles

const { default: yFiles } = Application.getDependence('yFiles');
const result = new yFiles.DegreeCentrality({
    considerIncomingEdges: false,
    considerOutgoingEdges: true
}).run(graph);

console.table(result);

const centerNodeIds = result.nodeCentrality.filter(entry => entry.value > 1).map(entry => entry.key).toArray();
console.log("centerNodeIds", centerNodeIds);
centerNodeIds



// nodeCentrality : ResultItemMapping<INode,number>
// Gets a mapping from each node to its absolute centrality value.
// The absolute centrality value can change drastically depending on graph structure and edge weights. The normalizedNodeCentrality values don't usually change as much, while still allowing to determine relative importance between nodes. If a subgraph is specified for the algorithm, the value is -1 for all nodes that are not part of the subgraph.

// const nodesDegree = result.nodeCentrality.filter(function(e){
//     const node = entry.key;

// });




// find nodes where centrality is ok
// let centerNodeIds = graph.nodes.filter(node => node.tag.primitiveID).toArray();

.forEach(entry => {
  const node = entry.key
  const centrality = entry.value
  // set node property isElectricalNode = [centrality > 2]   
//   graph.addLabel(node, `${centrality}`)
//   graph.setNodeLayout(node, new Rect(node.layout.center, new Size(centrality, centrality)))
})


// data.records = data.records.filter( i => ids.includes( i.empid ) );




let nodeIds = graph.nodes.map(node => node.tag.primitiveID).toArray();

let rs = nodeIds.map(nodeID => eval(nodeID).field)


const { default: yFiles } = Application.getDependence('yFiles');

const result = new yFiles.DegreeCentrality({
    considerIncomingEdges: true,
    considerOutgoingEdges: true
}).run(graph);

const centerNodes = result.nodeCentrality.filter(entry => entry.value > 1).map(entry => entry.key);

const centerNodeIds = centerNodes.map(node =>node.tag.primitiveID).toArray();

console.log("centerNodeIds", centerNodeIds);
// centerNodeIds

' '

result.nodeCentrality.forEach(entry => {
  const node = entry.key;
  const centrality = entry.value;
  console.log(node.tag.primitiveID, centrality);
});

// console.table(result.nodeCentrality);



// get node ids where degree > 1

const { default: yFiles } = Application.getDependence('yFiles');

const result = new yFiles.DegreeCentrality({
    considerIncomingEdges: true,
    considerOutgoingEdges: true
}).run(graph);


result.nodeCentrality.forEach(entry => {
  const node = entry.key;
  const centrality = entry.value;
  console.log(node.tag.primitiveID, centrality);
});

const centerNodes = result.nodeCentrality.filter(entry => entry.value > 1).map(entry => entry.key);

const centerNodeIds = centerNodes.map(node =>node.tag.primitiveID).toArray();

console.log("centerNodeIds", centerNodeIds);
// centerNodeIds

' '



паралллельные потребители

куст, скважины === резистор с сопротивлением

ячейка *- линия с сопр - КТПН *- линия - скважина


постоянно - значения свойств

постоянно - уравнения компонентов
постоянно - уравнения топологии


меняется - 
    - напряжение на ячейке


узлы:
    centerNodeIds (2) ['PotentialTransformerTwoWinding_23', 'BusbarSection330kV_7']

элементы

nodeIds = ['BreakerOn_54', 'PotentialTransformerTwoWinding_23', 'BreakerOn_55', 'PotentialTransformerTwoWinding_24', 'BusbarSection330kV_7', 'ConnectivityNode_240', 'ConnectivityNode_239', 'Engine_58', 'Engine_59', 'Engine_60', 'Engine_61', 'PowerTransformerTwoWinding_3']

для всех потребителей nodeIds-> сопротивления...


правая часть

ЭДС для контуров






connectivityNodes = [1,2,3,4,5,6,7,8]
[
1 - PowerTransformerTwoWinding_3 - 2
2 - BusbarSection330kV_7 - 3
]


[
    токи и напряжения
]


считаем ток при любом количестве лампочек

A = [
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, ]
]

[i1, i2, i3, i4, u0, u1, u2]


Bt = B[t] // B = [0, 0, 0, 0, 0, 0, 0, 0, ]

X = np.linalg.solve(A, B)
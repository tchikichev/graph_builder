# AUTO OTL


```js
// summator.inPort1 = (get from child ...)
let inPort1 = ["fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power"];

const partialOTL_sum = summator.inPort1.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0);
console.log("| makeresult 1 | eval res = " + partialOTL_sum);


| makeresult 1 | eval res = 0+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power
DataInput_8

```

## Как динамически сделать сумму рядов в компоненте



свойства компонента:
![](2022-09-03-15-34-26.png)


показываем значения, записать в компоненте:
```js
%OTL value = ""
%expr power = 10
%expr res_count = 100
%expr fs_path_power = "fs/component_fs/" + primitiveID + "/power"
```



%OTL ::: this.change_OTL = 
```js
const this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;

const otl_query = 
`| makeresults count = ${this.res_count}
| eval power = ${this.power}
| streamstats count by power
| fields - _time
| rename count as _time
| fsput path=${this.fs_path_power}
| head 1`;

props.value.expression.original_otl = otl_query;
props.value.status = "new";
// props.value.value = "";

' '
```

итого в дочернем элементе в порте записано
![](2022-09-03-15-33-33.png)

считается как: 
```js
this.fs_path_power
```


## sum child OTL 


хотим в итоге сгенеррировать запрос который посчитает суммы для временных рядов дочерних элтов


```js
let inPort1res = ["fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power"];

console.log(inPort1res);
const partialOTL_sum = inPort1res.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0);

inPort1res.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0); // update reduce function

>>>>>
| fsget path=fs/component_fs/Generator_1/power
| join [| fsget path=fs/component_fs/Generator_2/power | rename power as power_2] on _time
| join [| fsget path=fs/component_fs/Generator_3/power | rename power as power_3] on _time
| eval res = power + power_2 + power_3

```


### In real

this: save_to = 
```js
"fs/component_fs/" + primitiveID + "/result_power"
```

То есть для компонета "summator_1" временной ряд результат сохпранится в "fs/component_fs/summator_1/result_power.

Мы не пишем временные ряды весом 1Гб в граф, в памяти браузера не хватит места.

```js
let fs_table_1 = inEdges[0]...status.value;
let fs_table_2 = inEdges[1]...status.value;

function compose(t1, t2, join_by){
    return `| fsget path=${t1} | rename power as p1
| join ${join_by} [| fsget path=${t2} | rename power as p2]
| eval res = p1 + p2
`
}

let my_otl_query = compose(fs_table_1, fs_table_2);
const save_to = this.save_to;
my_otl_query = my_otl_query + "| fsput path=${save_to} | head 1"
console.log(my_otl_query);
' '
```
inEdges - из анализа порта и дочерних элементов

compose - формирует строчку нашего запроса

fs_table_1, fs_table_2 - объекты над которыми выполняется операция, расчет операции производится в платформе

```py
a = np.zeros(shape = (10,10))
b = np.zeros(shape = (10,10))

c = a + b

tarif_table.a: 
    const tariff = np.zeros(shape = (10,10))
    tariff
loads.a: np.ones(shape = (10,10))

obj1.outPort1 =  this.a
obj2.outPort1 =  this.a

summator.inPort1: 
    let chVals = getChild().values.toArray();
    chVals
summator.res: 
    let chVals = this.inPort1
    let res = sum(chVals)
    res
```


### sum of childs messy


сумма значений исходных портов для всех ребер которое входят в наш объект

```js
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
```

посчитать операцию для двух входных ребер

```js
let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();


let table1 = eval(inEdges[0].sourcePort.tag.primitiveID).status;
let table2 = eval(inEdges[1].sourcePort.tag.primitiveID).status;

let obj1_type = eval(inEdges[0].tag.properties)...type;
if (obj1_type == "tariff") {} else {}


let res = table1+table2
res
```


```js
let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();


// ДОСТАТЬ дочерний ЭЛЕМЕНТ где props.type === "tariff"
my_tariff = inEdges.map(edge => edge.targetPort.tag.primitiveID).map(nodeId => eval(nodeId.tag...)).find(props => props.type === "tariff");

// прочитать таблицу из элемент
let my_tariff_value = my_tariff.value;

// ДОСТАТЬ дочерний ЭЛЕМЕНТ где props.type === "loads"
let loads = ...;

function eval_tariff(tar, vals){
    return tar * vals
}

let res = eval_tariff(my_tariff_value, loads);
res
```

get conn edges names

```js
let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let connEdges = graph.outEdgesAt(portOwner).map(edge => edge.targetPort.tag.primitiveID).toArray();
connEdges

```


```js
let portOwner = graph.ports.find(port => port.tag.primitiveID === primitiveID).owner;
let inEdges = graph.inEdgesAt(portOwner).filter(edge => edge.targetPort.tag.primitiveID === primitiveID).toArray();

let inData = [];

if (inEdges.length < 1) []
else {

inData = inEdges.map(function(e) {
let prID = e.sourcePort.tag.primitiveID;
let port = graph.ports.find(port => port.tag.primitiveID === prID);
// console.log("port", port);
let val = eval(port.tag.primitiveID).status;
return ({[prID]: val});
});
};
inData

```

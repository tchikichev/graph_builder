

// summator.inPort1 = (get from child ...)
let inPort1 = ["fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power"];

const partialOTL_sum = summator.inPort1.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0);
console.log("| makeresult 1 | eval res = " + partialOTL_sum);


| makeresult 1 | eval res = 0+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power
DataInput_8


[fs1, fs2, fs3]


let inPort1res = ["fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power", "fs/component_fs/Generator_45/power"];

console.log(inPort1res);
const partialOTL_sum = inPort1res.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0);

inPort1res.reduce((partialOTL, a) => partialOTL +  "+ " + a, 0); // update reduce function

>>>>>
| fsget path=fs/component_fs/Generator_1/power
| join [| fsget path=fs/component_fs/Generator_2/power | rename power as power_2] on _time
| join [| fsget path=fs/component_fs/Generator_3/power | rename power as power_3] on _time
| eval res = power + power_2 + power_3




this: save_to = "fs/component_fs/" + primitiveID + "/result_power"

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


let query = "| makeresult 1 | eval res = " + partialOTL_sum;
console.log(query);
query

// power + power_2 >> fs
// fs >> power_intermediate + power_3

| fsget path=fs/component_fs/Generator_45/power

| makeresult 1 

| eval res = 0+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power+ fs/component_fs/Generator_45/power
DataInput_8

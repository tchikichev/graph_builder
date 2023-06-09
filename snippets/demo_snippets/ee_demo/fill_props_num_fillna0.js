

// +(DataLakeNode_68.query.filter(wn => {return wn["__well_num"] == this.node_id})[0][DataLakeNode_68.VolumeWater]) !== NaN ?
// +(DataLakeNode_68.query.filter(wn => {return wn["__well_num"] == this.node_id})[0][DataLakeNode_68.VolumeWater]) :
// DataLakeNode_68.query.filter(wn => {return wn["__well_num"] == this.node_id})[0][DataLakeNode_68.VolumeWater]



let livedash = Application.autocomplete.LiveDashPanel_5;
let paramsFillLivedash = livedash;

let wells = livedash.masterGraph.nodes.toArray().filter(
    node => node.tag.primitiveName == "oil_well");

let dataLakeNode = paramsFillLivedash.masterGraph.nodes.toArray().find(
    node => {
        return node.tag.primitiveName === "DataLakeNode";
        //  && node.tag.properties?.['_usage'].expression === '"index_monitoring"'
    }
);

// props modification
function fillIndexQueries({
    nodes,
    baseQuery, propsMapping
}) {
    nodes.toArray().forEach((node) => {
        Object.entries(propsMapping).forEach(([propertyName, propertyBody]) => {
            if (propertyName in node.tag.properties) {
                // const q = `${baseQuery}["${propertyBody}"]`;
                // const query = `+(${q}) !== NaN ? +(${q}) : 0`;
                const query = `let q = ${baseQuery}; (q !== undefined) ? +(q["${propertyBody}"]) : 0`;
                node.tag.properties[propertyName].expression = query;
            }
        })
    })
}

function buildIndexQuery({
    DataLakeNodeID, DataLakeNodeQParam,
    dfSearchCol, dfSearchKey
}) {
    // DataLakeNode_68.query.filter(wn => {return wn["__well_num"] == this.node_id})[0]
    return `${DataLakeNodeID}.${DataLakeNodeQParam}.filter(line => {return line[\"${dfSearchCol}\"] == this.${dfSearchKey}})[0]`;
}

let index_props_mapping = {
    'current_A': "avg_current",
    'U на СУ, В': "avg_voltage",
    'ois_id': "ois_id",
    'load_pc': "adkuControlStationLoading",
    'power_full_kW': "adkuControlStationFullPower",
    'power_active_kW': "adkuControlStationActivePower",
    'power_coef': "adkuControlStationPowerCoef",
}

// ee
fillIndexQueries({
    nodes: paramsFillLivedash.masterGraph.nodes.filter(
        node => node.tag.primitiveName === "oil_well"
    ),
    baseQuery: buildIndexQuery({
        DataLakeNodeID: dataLakeNode.tag.primitiveID, // node we refer to
        DataLakeNodeQParam: "query", // prop name in datalake node we refer to
        dfSearchCol: "__well_num", //index col name
        dfSearchKey: "name" // search by node prop
    }),
    propsMapping: index_props_mapping
})


let wells = livedash.masterGraph.nodes.toArray().filter(
    node => node.tag.primitiveName == "oil_well");


['object_type', 'T', 'P', 'Q_m3_day', 'query_res', 'Name', 'node_name', 'node_id', 'X', 'Y', 'Kind', 'Value', 'IsSource', 'VolumeWater', 'perforation', 'pumpDepth', 'model', 'frequency', 'productivity', 'predict_mode', 'shtr_debit', 'K_pump', 'Qliq_m3ps', 'Qn_t', 'U на СУ, В', 'current_A', 'name', 'pad_num', 'power_kW', 'primitiveName', 'state', 'type', 'Время АПВ, мин.', 'Дата замера', 'ПБВ Кол-во', 'ПБВ Полож.', 'Селективность действия защит', 'ois_id', 'load_pc', 'power_full_kW', 'power_active_kW', 'power_coef', 'source', 'power_kWh']

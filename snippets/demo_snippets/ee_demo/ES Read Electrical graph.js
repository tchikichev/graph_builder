let customActionTitle = "Read Electrical graph"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelEEMonitoring = Application.autocomplete.LiveDashPanel_8

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

let interactionSystem = Application.autocomplete.InteractionSystem

let tabMonitoring = "wss-tab-5720"
let tabWhatIf = "wss-tab-9078"


function getTableFromGraph(targetLiveDash, propArray, object_types) {
    const { graph } = JSON.parse(targetLiveDash.graphJSON);

    const defaultProps = {};

    propArray.forEach(key => {
        defaultProps[key] = '';
    })

    let table = [];
    let wideTable = [];

    graph.nodes.forEach(node => {
        const { primitiveID, properties } = node;
        if (properties.object_type == undefined) {
            console.log('object_type is undefined');
            return
        }
        if (! object_types.hasOwnProperty(properties.object_type.value)) {
          return
        }

        let line = {
            measure: `measure_${primitiveID}`,
            primitiveID,
            ...defaultProps
        }
        Object.entries(properties).forEach(prop => {

            const [propName, propData] = prop;
            if (!propArray.includes(propName)) {
                return
            }
            line[propName] = (!isNaN(+propData.value) ? +propData.value : propData.value) ?? null
            table.push({
                "Node_property": `${primitiveID}.${propName}`,
                "monitoring": propData.value,
            });
        });

        wideTable.push(line)
    });
    return [table, wideTable]
}

function datasetToOtl(dataset, schema) {

    const schemaKeys = Object.keys(schema)
    let totalString = ''
    totalString += dataset.reduce((acc, item, itemIndex) => {
        acc += schemaKeys.reduce((string, col, colIndex) => {
            string += `${item[col]}`
            if (colIndex + 1 < schemaKeys.length) {
                string += '###'
            }
            return string
        }, '')
        if (itemIndex + 1 < dataset.length) {
            acc += '&&&'
        }
        return acc
    }, '')
    return `
        | makeresults count=1
        | eval _total_string = "${totalString}"
        | eval _split_string = split(_total_string, "&&&")
        | mvexpand _split_string
        | split _split_string cols=${schemaKeys.join(',')} sep=###
        | fields - _total_string, _split_string
    `
}

let schema_ = {
    name: 'STRING',
    node_id: 'STRING',
    source: 'STRING',
    object_type: 'STRING',
    model_kwh: 'FLOAT',
    loss: "FLOAT"
};
let propArray = Object.keys(schema_);


notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)

object_types = {"oil_well_ecn": "well", "unknown_cons": "well with no source data"}
let [table, wideTable] = getTableFromGraph(liveDashPanelEEMonitoring, propArray, object_types);

const { data: userData } = await interactionSystem.GETRequest("/dtcd_utils/v1/user?username");
const write_to = `ee_measurements_monitoring_${userData.username}.csv`
// run ee graph
let queryString = datasetToOtl(wideTable, schema_) + `| writeFile format=csv path=${write_to}`;

await Application.autocomplete.DataSourceSystem.oneShotRun("otl", { cache_ttl: 5, queryString }).then(res => {
  console.log("ee graph save complete");
  Application.autocomplete.Visualization_Table_1.loadData(res);
});

notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)
console.log(`Custom action "${customActionTitle}" finished`)
// oil whatif ->> ppd-whatif
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
let liveDashPanelWhatIfPPD = Application.autocomplete.LiveDashPanel_5
let customActionTitle = "PPD Whatif tab on load"
let ppdMonitoringTabID = "wss-tab-5465";

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
let notificationSettingsFail = { type: "error", floatTime: 5, floatMode: true }
let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

let sourceNodeID = 1751058919;
let targetNodeID = "КНС-1 Тайлаковская";

function loadDataFromNSwhatif(){
    let sourceDnsNode = liveDashPanelWhatIf.masterGraph.nodes.toArray().find(
        node => {
            if (node.tag.properties?.node_id) {
                return (node.tag.properties['node_id'].expression == sourceNodeID)
            }
        }
    )
    if (sourceDnsNode == undefined){
        console.log("Отсутствует узел ДНС на What-If вкладке");
        notificationSystem.create(
            customActionTitle, "Отсутствует узел ДНС на What-If вкладке", notificationSettingsFail)
            return;
    }

    let targetPpdDnsNode = liveDashPanelWhatIfPPD.masterGraph.nodes.toArray().find(
        node => {
            if (node.tag.properties?.node_id) {
                return (node.tag.properties['node_id'].value == targetNodeID)
            }
        }
    ); 
    if (targetPpdDnsNode == undefined){
        notificationSystem.create(
            customActionTitle, "Отсутствует узел КНС на PPD-What-If вкладке", notificationSettingsFail)
            return;
    }
    
    // write result to ppd dns node
    Object.entries({
        "income_separated_water_flow_m3_day": "separated_water_flow_m3_day",
        // "production_oil_flow_m3_day": "production_oil_flow_m3_day",
        // "separated_gas_flow_m3_day": "separated_gas_flow_m3_day",
    }).forEach(([to, from]) => {
        console.log('PPD.'+ to, '= OIL.' + from, sourceDnsNode.tag.properties[from].value);
        targetPpdDnsNode.tag.properties[to].expression = `${sourceDnsNode.tag.properties[from].value}`;
    })

    notificationSystem.create(customActionTitle, "Загрузка данных из графа What-If", notificationSettingsSuccess);
}

if (e.id === ppdMonitoringTabID) {
    console.log(`Custom action "${customActionTitle}" started`)

    loadDataFromNSwhatif();
    console.log(`Custom action "${customActionTitle}" finished`)
}
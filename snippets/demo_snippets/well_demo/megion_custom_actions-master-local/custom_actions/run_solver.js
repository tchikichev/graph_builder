let customActionTitle = "Solver"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_2
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
let dataSourceSystem = Application.autocomplete.DataSourceSystem
let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

notificationSystem.create(customActionTitle, "Ожидайте окончания расчетов", notificationSettingsInfo)

await liveDashPanelWhatIf.saveToServer({name: liveDashPanelWhatIf.graphMeta.graphName, id: liveDashPanelWhatIf.graphMeta.graphID})

let solverOtl = `v2 | dtcd_read_graph "${liveDashPanelWhatIf.graphMeta.graphName}" | ks_prepare | ks_calc_df`
await dataSourceSystem.oneShotRun("otl", {cache_ttl: 5, queryString: solverOtl})
    .then(ds => {
        let wellProperties = ["perforation", "pumpDepth", "model", "frequency", "productivity", "predict_mode", "shtr_debit", "K_pump", "VolumeWater"]
        let pipeProperties = ["L","d","s","uphillM","effectiveD","intD","roughness"]

        function fill(node, properties, line) {
            console.log(node, properties)
            for (let property of properties) {
                if (property in node.tag.properties) {
                    node.tag.properties[property].expression = line[property]
                    node.tag.properties[property].value = line[property]
                    node.tag.properties[property].status = "complete"
                } else {
                    console.log(`Node ${node.tag.primitiveID} doesn't have a property "${property}"`)
                }
            }
        }

        function findNode(propertyWithID, columnWithID, line) {
            let node = liveDashPanelWhatIf.masterGraph.nodes.find(node => {
                if (propertyWithID in node.tag.properties) {
                    return Number(node.tag.properties[propertyWithID].expression) === Number(line[columnWithID])
                } else {
                    return false
                }
            })
            console.log(node)
            return node
        }

        console.log(ds)
        for (let i in ds) {
            let line = ds[i]
            console.log(line)
            if ("wellNum" in line && line.wellNum !== null) {
                let node = findNode("node_id", "wellNum", line)
                if (node === null) {
                    console.log(`Node ${line.wellNum} from dataset is not presented in the graph`)
                } else {
                    fill(node, wellProperties, line)
                }

            } else {
                let node = findNode("node_id_start", "node_id_start", line)
                if (node === null) {
                    console.log(`Node ${line.node_id_start} from dataset is not presented in the graph`)
                } else {
                    fill(node, pipeProperties, line)
                }
            }
        }

        return true
})
    .then(t => {notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)})
    .catch(()=>{
        console.log("Solver flow failed")
        notificationSystem.create(customActionTitle, "Что-то пошло не так", notificationSettingsFail)})

console.log(`Custom action "${customActionTitle}" finished`)

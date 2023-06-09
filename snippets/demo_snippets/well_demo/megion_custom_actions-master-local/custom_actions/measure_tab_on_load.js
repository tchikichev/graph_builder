if (e.id === "wss-tab-1947") {
    let customActionTitle = "Measure tab on load"
    console.log(`Custom action "${customActionTitle}" started`)
    let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
    let tableExp = Application.autocomplete.Visualization_EditableTable_1
    let storageSystem = Application.autocomplete.StorageSystem
    let notificationSystem = Application.autocomplete.NotificationSystem
    let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
    let notificationSettingsFail = {type: "error", floatTime: 5, floatMode: true}
    let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

    function getLongTableFromGraph(targetLiveDash) {
        let table = [];
        for (let node of liveDashPanelWhatIf.masterGraph.nodes) {
            let primitiveID = node.tag.primitiveID
            let nodeName = node.tag.properties.Name.value

            for (let prop in node.tag.properties) {
                if (prop === "Name") {
                    continue
                }
                let line = {
                    "primitiveID": primitiveID,
                    "nodeName": nodeName,
                    "nodeProperty": prop,
                    "monitoring": node.tag.properties[prop].value,
                }
                table.push(line)
            }
        }
        return table
    }

    let expTable = storageSystem.session.getRecord("expTable")
    let finalTable
    console.log(expTable)
    if (expTable && expTable.length !== 0) {
        finalTable = expTable
    } else {
        finalTable = getLongTableFromGraph(liveDashPanelWhatIf)
        storageSystem.session.putRecord("expTable", finalTable)
    }
    console.log(finalTable)
    if (finalTable.length === 0) {
        notificationSystem.create(customActionTitle, "Проверьте граф на What-If вкладке", notificationSettingsFail)
    } else {
        notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)
        await new Promise(r => setTimeout(r, 2000))
        tableExp.loadSchema(finalTable[0])
        tableExp.loadData(finalTable)
        notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)
    }
    console.log(`Custom action "${customActionTitle}" finished`)
}


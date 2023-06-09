function datasetToOtl({ data: dataset, schema }) {

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
if (e.id === "wss-tab-1947") {
    let customActionTitle = "Measure tab on load"
    console.log(`Custom action "${customActionTitle}" started`)
    let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_3
    let tableExp = Application.autocomplete.Visualization_EditableTable_1
    let tableMeas = Application.autocomplete.Visualization_EditableTable_2
    let storageSystem = Application.autocomplete.StorageSystem
    let notificationSystem = Application.autocomplete.NotificationSystem
    let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
    let notificationSettingsFail = { type: "error", floatTime: 5, floatMode: true }
    let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }




    function getTableFromGraph(targetLiveDash) {
        const { graph } = JSON.parse(targetLiveDash.graphJSON);

        const defaultProps = {};

        const propArray = ['Name', 'VolumeWater', 'LiquidDebit', 'Inlet_Pressure_atm', 'Pumps_Outlet_Pressure_atm', 'node_id'];

        propArray.forEach(key => {
            defaultProps[key] = '';
        })

        const table = [];
        const wideTable = [];

        graph.nodes.forEach(node => {
            const { primitiveID, properties } = node;
            if (properties.object_type.value !== 'well' && properties.object_type.value !== 'dns') {
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
    const [_, wideTable] = getTableFromGraph(liveDashPanelWhatIf)
    const schema = { primitiveID: 'STRING', measure: 'STRING', Name: 'STRING', VolumeWater: 'INT', LiquidDebit: 'INT', Inlet_Pressure_atm: 'INT', node_id: 'INT' }

    const queryString = datasetToOtl({ data: wideTable, schema }) + '| writeFile format=csv path=measurements.csv'
    await Application.autocomplete.DataSourceSystem.oneShotRun("otl", { cache_ttl: 5, queryString })
        .then(ds => { Application.autocomplete.DataSourceSystem.runDataSource('Measurements') })

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
if (e.id === "wss-tab-5058") {
    let customActionTitle = "Measure tab on load"
    console.log(`Custom action "${customActionTitle}" started`)
    let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_5
    let tableExp = Application.autocomplete.Visualization_EditableTable_3
    let storageSystem = Application.autocomplete.StorageSystem
    let notificationSystem = Application.autocomplete.NotificationSystem
    let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
    let notificationSettingsFail = { type: "error", floatTime: 5, floatMode: true }
    let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

    function getTableFromGraph(targetLiveDash) {
        const { graph } = JSON.parse(targetLiveDash.graphJSON);

        const defaultProps = {};

        const propArray = ['Name', 'zakachka', 'choke_diam', 'Pumps_Outlet_Pressure_atm', 'node_id'];

        propArray.forEach(key => {
            defaultProps[key] = '';
        })

        const table = [];
        const wideTable = [];

        graph.nodes.forEach(node => {
            const { primitiveID, properties } = node;
            if (properties.object_type.value !== 'injection_well' && properties.object_type.value !== 'kns') {
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

    const [_, wideTable] = getTableFromGraph(liveDashPanelWhatIf)

    const schema = { primitiveID: 'STRING', measure: 'STRING', Name: 'STRING', zakachka: 'STRING', choke_diam: 'STRING', Pumps_Outlet_Pressure_atm: 'STRING', node_id: 'INT' }

    const queryString = datasetToOtl({ data: wideTable, schema }) + '| writeFile format=csv path=measurementsPPD.csv'
    await Application.autocomplete.DataSourceSystem.oneShotRun("otl", { cache_ttl: 5, queryString })
        .then(ds => { Application.autocomplete.DataSourceSystem.runDataSource('MeasurementsPPD') })

    let expTable = storageSystem.session.getRecord("expTablePPD")
    let finalTable
    console.log(expTable)
    if (expTable && expTable.length !== 0) {
        finalTable = expTable
    } else {
        finalTable = getLongTableFromGraph(liveDashPanelWhatIf)
        storageSystem.session.putRecord("expTablePPD", finalTable)
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
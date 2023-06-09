function getTableFromGraph(targetLiveDash) {
    const { graph } = JSON.parse(targetLiveDash.graphJSON);

    const defaultProps = {};

    graph.nodes.forEach(node => {
        Object.keys(node.properties).forEach(key => {
            defaultProps[key] = '';
        })
    })

    const table = [];
    const wideTable = [];

    graph.nodes.forEach(node => {
        const { primitiveID, properties } = node;
        let line = {
            measure: `measure_${primitiveID}`,
            primitiveID,
            ...defaultProps
        }
        Object.entries(properties).forEach(prop => {
            const [propName, propData] = prop;

            line[propName] = propData.value
            table.push({
                "Node_property":`${primitiveID}.${propName}`,
                "monitoring": propData.value,
            });
        });

        wideTable.push(line)
    });
    return [table, wideTable]
}


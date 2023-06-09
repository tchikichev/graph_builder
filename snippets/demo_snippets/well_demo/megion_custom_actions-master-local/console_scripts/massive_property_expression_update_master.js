let liveDash = Application.autocomplete.LiveDashPanel_2

let dataLakeNodes = liveDash.masterGraph.nodes.filter(node => {return node.tag.primitiveID.includes("DataLakeNode")})

let dlProps = dataLakeNodes.reduce((acc, dataLakeNode) => {
  return {
    ...acc,
    [dataLakeNode.tag.primitiveID]: Object.entries(dataLakeNode.tag.properties)
    .filter(p => !p[0].startsWith("_") && p[0] !== "query")
  }
}, {})

liveDash.masterGraph.nodes.forEach((node) => {
  if (node.tag.primitiveID.includes("DataLakeNode")) return
  Object.keys(dlProps).forEach((dln) => {
    dlProps[dln].forEach(([propertyName,propertyBody]) => {
      if ( propertyName in node.tag.properties) {
        node.tag.properties[propertyName]
          .expression = `${dln}.query.filter(wn => {return wn["__well_num"] == this.node_id})[0][${dln}.${propertyName}]`
      }
    })
  })
})

let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_8;
let graph = liveDashPanelMonitoring.masterGraph;

const { default: yFiles } = Application.getDependence('yFiles');

const prResult = new yFiles.PageRank({
    // Ignore disabled breaker nodes
    subgraphNodes: {
        excludes: node => {
            let isActive = node.tag.properties.isActive;
            if ((node.tag.primitiveName == "BreakerOn") && (isActive != undefined)) {
                return node.tag.properties.isActive.value ? 0 : 1;
            }
            return 0;
        }
    },
    edgeDirectedness: () => -1,
    nodeWeights: node => {
        let coef = 0.0;
        if (node.tag.properties.object_type !== undefined)
            return coef;

        switch (node.tag.properties.object_type.value) {
            case 'eeCableLine':
                coef = parseFloat(node.tag.properties.loss_coef.value);
                // console.log('Oranges are $0.59 a pound.');
                break;
            case 'oil_well_ecn':
                coef = parseFloat(node.tag.properties.power_kW.value);
                break;
            default:
                coef = 0.0;
        }
        return coef;
    },
    dampingFactor: 1.0
}).run(graph)

prResult.pageRank.forEach(({ key, value }) => {
    const node = key;
    const rank = value;
    console.log(node.tag.primitiveID, rank);

    // graph.addLabel(node, String(centrality))
    // graph.setNodeLayout(node, new Rect(node.layout.center, new Size(centrality, centrality)))
})


prResult.pageRank.forEach(({ node, rank }) => {
    //   const node = key
    // node.tag.properties.rank
    console.log(node.tag.primitiveID, rank);

    // const centrality = value

    // graph.addLabel(node, String(centrality))
    // graph.setNodeLayout(node, new Rect(node.layout.center, new Size(centrality, centrality)))
})



// const algorithm = new yFiles.TreeSubstructures({
//   // Ignore disabled breaker nodes
//   subgraphNodes: {
//     excludes: node =>
//         {
//           let isActive = node.tag.properties.isActive;
//             if ((node.tag.primitiveName == "BreakerOn") && (isActive != undefined)){
//               return node.tag.properties.isActive.value ? 0 : 1;
//             }
//             return 0;
//         }
//   }
// })
// run the algorithm
// const result = algorithm.run(graph);

let customActionTitle = "ES Refresh Sources"

console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem;

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}



notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)


const { default: yFiles } = Application.getDependence('yFiles');
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_8;
let graph = liveDashPanelMonitoring.masterGraph;


await liveDashPanelMonitoring.startCalculatingGraph()


// let inNodes = liveDashPanelMonitoring.masterGraph.nodes.toArray().filter(
//     node => (
//         (node.tag.properties.object_type != undefined) && 
//         (node.tag.properties.object_type.expression == "\"in\"")
//     )
// )
// inNodes.map(node => node.tag.primitiveID)

function subgraphRootNodes(baseGraph, graph) {
    return graph.nodes.toArray().filter(node => baseGraph.inDegree(node) == 0)
}

// split graph into tree in Breakers
const algorithm = new yFiles.TreeSubstructures({
// Ignore disabled breaker nodes
    subgraphNodes: {
        excludes: node =>
            {
            let isActive = node.tag.properties.isActive;
                if ((node.tag.primitiveName == "BreakerOn") && (isActive != undefined)){
                return node.tag.properties.isActive.value ? 0 : 1;
                }
                return 0;
            }
    }
})
// run the algorithm
const result = algorithm.run(graph);


// find input nodes
// let tree_roots = {};
Object.entries(result.trees.toArray()).forEach(
    ([i, subgraph]) => {
        let roots = subgraphRootNodes(graph, subgraph);
        let rIDs = roots.map(node => node.tag.primitiveID);
        // some part of graph is not powered

        if (rIDs.length == 0) {
            let sunbNodes = subgraph.nodes.toArray().map(node => node.tag.primitiveID);

            // let disabledBreakers = 
            console.log(sunbNodes);
            
            notificationSystem.create(customActionTitle, "disconnected from source " + sunbNodes, notificationSettingsFail)

        }
        console.log(rIDs, i);        
    }
);


notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)

console.log(`Custom action "${customActionTitle}" finished`)
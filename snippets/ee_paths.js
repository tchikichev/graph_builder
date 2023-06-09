
let customActionTitle = "ES Refresh Sources"

console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem;

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_8;
let graph = liveDashPanelMonitoring.masterGraph;

const { default: yFiles } = Application.getDependence('yFiles');


// find input nodes
let tree_roots = [];
Object.entries(result.trees.toArray()).forEach(
    ([i, subgraph]) => {
        tree_roots.push(roots)
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


// prepare the paths algorithm
const algorithm = new yFiles.Paths(
    {
        startNodes: startNode,
        endNodes: endNode
    }
)

// run the algorithm
const result = algorithm.run(graph)

// Highlight paths between start and end
for (const path of result.paths) {
  for (const pathEdge of path.edges) {
    graph.setStyle(pathEdge, pathEdgeStyle)
  }
}


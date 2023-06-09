let customActionTitle = "ES Refresh Sources"

console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem;

let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = {type: "success", floatTime: 5, floatMode: true}
let notificationSettingsFail = {type: "fail", floatTime: 5, floatMode: true}
let notificationSettingsInfo = {type: "info", floatTime: 5, floatMode: true}

const { default: yFiles } = Application.getDependence('yFiles');


// re evaluate topology on isActive breakers changes
function evalTreeGroups(graph){

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
    let tree_roots = result.trees.toArray().forEach(
      tr => tr.nodes.toArray().filter(
        node => graph.inDegree(node) == 0).map(
          node=> node.tag.primitiveID));

    result.trees.toArray().forEach(tr => {
      let rootNodes = tr.nodes.toArray().filter(
        node => (
            (graph.inDegree(node) == 0) // input node
            && (node.tag.properties.object_type != undefined)
            && (node.tag.properties.object_type.value == "in")
            ));

      let rootIDs = rootNodes.map(
        node=> node.tag.primitiveID);

      if (rootNodes.length > 1){
        console.log(
          "несколько источников питаниия для одного объекта",
          rootIDs);
          // TODO:: raise ERROR
        notificationSystem.create(customActionTitle, "Что-то пошло не так", notificationSettingsFail);

      }

      let root = rootNodes[0];

      let source = "undefined";
      if (root != undefined){
        let rootSource = root.tag.properties.source;
        if (rootSource != undefined) {
            source = rootSource.value;
        }
      }
      tr.nodes.toArray().filter(
        node => node.tag.properties['source'] != undefined).forEach(
          node => {
            node.tag.properties['source'].expression = `"${source}"`;
            node.tag.properties['source'].value = source;
          }
        );

    });
    console.log('computed ee tree sources');

}

notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)

let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_8;
let graph = liveDashPanelMonitoring.masterGraph;

evalTreeGroups(graph)
await liveDashPanelMonitoring.startCalculatingGraph()

notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)

console.log(`Custom action "${customActionTitle}" finished`)
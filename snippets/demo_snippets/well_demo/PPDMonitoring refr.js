let customActionTitle = "Monitoring refresh PPD"
console.log(`Custom action "${customActionTitle}" started`)
let workspaceSystem = Application.autocomplete.WorkspaceSystem
let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_4
let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_5
let dataSourceSystem = Application.autocomplete.DataSourceSystem
let notificationSystem = Application.autocomplete.NotificationSystem
let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
let notificationSettingsFail = { type: "error", floatTime: 5, floatMode: true }
let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

async function copyMonitoringGraphForSolver() {
  let customActionTitle = "function copyMonitoringGraphForSolver"
  console.log(`Custom action "${customActionTitle}" started`)
  let workspaceSystem = Application.autocomplete.WorkspaceSystem
  let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_4
  let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_5

  let tabMonitoring = "wss-tab-5720"
  let tabWhatIf = "wss-tab-9078"

  let notificationSystem = Application.autocomplete.NotificationSystem
  let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
  let notificationSettingsFail = { type: "fail", floatTime: 5, floatMode: true }
  let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

  let interactionSystem = Application.autocomplete.InteractionSystem

  notificationSystem.create(customActionTitle, "Подождите", notificationSettingsInfo)

  let usernamePromise = interactionSystem.GETRequest("/dtcd_utils/v1/user?username").then(d => { return d.data.username })

  let removeNodes = []
  for (let node of liveDashPanelMonitoring.masterGraph.nodes.filter(node => { return node.tag.primitiveID.includes("DataLakeNode") })) {
    removeNodes.push(node)
  }
  for (let node of liveDashPanelMonitoring.masterGraph.nodes.filter(node => { return "_remove_before_solver" in node.tag.properties })) {
    removeNodes.push(node)
  }
  for (let rn of removeNodes) {
    liveDashPanelMonitoring.masterGraph.remove(rn)
  }

  for (const node_id in liveDashPanelMonitoring.nodes) {
    let node = liveDashPanelMonitoring.nodes[node_id]
    if (node_id.includes("DataLakeNode")) {
      delete node
    } else {
      for (const prop in node.tag.properties) {
        if (typeof (node.tag.properties[prop].expression) === "string" && node.tag.properties[prop].expression !== "") {
          node.tag.properties[prop].expression = JSON.stringify(node.tag.properties[prop].value)
        } else {
          node.tag.properties[prop].expression = node.tag.properties[prop].value
        }
      }
    }
  }
  let username = await usernamePromise

  let tmpGraphName = `${liveDashPanelMonitoring.graphMeta.graphName}_monitoring_${username}`

  await interactionSystem.get("/supergraph/v1/fragments").then(d => {
    console.log(d)
    let oldTmpFragments = d.data.fragments.filter(fr => {
      return fr.name === tmpGraphName
    })
    for (let otf in oldTmpFragments) {
      console.log(oldTmpFragments[otf])
      interactionSystem.DELETERequest(`/supergraph/v1/fragments/${oldTmpFragments[otf].id}`)
    }
  })

  await liveDashPanelMonitoring.saveAs({ "name": tmpGraphName }).then(fragment => {
    console.log(fragment)
    let fr = { "id": liveDashPanelMonitoring.graphMeta.graphID, "name": liveDashPanelMonitoring.graphMeta.graphName }
    console.log(fr)
    liveDashPanelMonitoring.openFromServer(fr)
  }
  )
  notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)
  console.log(`Custom action "${customActionTitle}" finished`)
  return tmpGraphName
}
async function runSolver(tmpGraphName) {
  let customActionTitle = "Solver"
  console.log(`Custom action "${customActionTitle}" started`)
  let workspaceSystem = Application.autocomplete.WorkspaceSystem
  let liveDashPanelMonitoring = Application.autocomplete.LiveDashPanel_4
  let liveDashPanelWhatIf = Application.autocomplete.LiveDashPanel_5
  let dataSourceSystem = Application.autocomplete.DataSourceSystem
  let notificationSystem = Application.autocomplete.NotificationSystem
  let notificationSettingsSuccess = { type: "success", floatTime: 5, floatMode: true }
  let notificationSettingsFail = { type: "fail", floatTime: 5, floatMode: true }
  let notificationSettingsInfo = { type: "info", floatTime: 5, floatMode: true }

  notificationSystem.create(customActionTitle, "Ожидайте окончания расчетов", notificationSettingsInfo)
  let notificationSettingsWarning = { type: "warning", floatTime: 5, floatMode: true }
  
  let oilKSNnode = liveDashPanelMonitoring.masterGraph.nodes.toArray().find(node => {
    return node.tag.primitiveName === "oil_kns"
  });
  if (oilKSNnode != null) {
    if (!oilKSNnode.tag.properties._check.value) {
      notificationSystem.create(customActionTitle, "Cумма всех закачек скважин не равна входящей", notificationSettingsWarning)
    }
  }
  
  let solverOtl = `v2 | dtcd_read_graph "${tmpGraphName}" | ks_prepare | ks_calc_df network_kind=water`
  console.log("solverOtl PPD resresh\n", solverOtl);
  await dataSourceSystem.oneShotRun("otl", { cache_ttl: 5, queryString: solverOtl })
    .then(ds => {

      function processNode(node, line, usage) {
        const nodeParamsMapping = {
          "inlet": { // start
            "res_P": "startP",
            "res_T": "startT",
            "res_Q_m3_day": "start_Q_m3_day"
          },
          "junction": { //start junction && pad| vrb 
            "res_P": "startP",
            "res_T": "startT"
            //no Q_m3_day data for this node
          },
          "junction_end": { //start junction && pad| vrb 
            "res_P": "endP",
            "res_T": "endT"
            //no Q_m3_day data for this node
          },
          "outlet": { // end
            "res_P": "endP",
            "res_T": "endT",
            "res_Q_m3_day": "end_Q_m3_day"
          },
          "edge": { // pipe
            // "res_watercut_percent": "res_watercut_percent",// Обводненность,TRUE
            // "res_liquid_density_kg_m3": "res_liquid_density_kg_m3",// Плотность жидкости,
            // "res_pump_power_watt": "res_pump_power_watt",// Мощность насоса,TRUE
            "res_mass_flow_kg_sec": "X_kg_sec",// Массовый поток,
            "res_velocity_m_sec": "velocity_m_sec"// Скорость потока,TRUE
          }
        };
        const graphObjectTypes = {
            "oil_kns": "inlet",
            "oil_pipe_ppd": "edge",
            "oil_junction_ppd": "junction",
            "oil_vrb": "junction",
            "oil_well_vodazabornaya": "outlet"
        };
        let node_type = graphObjectTypes[node.tag.primitiveName];
        if ((node_type === "junction") && ("end" === usage)) {
          node_type = "junction_end";
        }
        let props = node.tag.properties;
        console.log("eval ", node_type, node.tag.primitiveID, props, line);
        Object.entries(nodeParamsMapping[node_type]).forEach(
          ([param, df]) => {
            props[param].expression = line[df];
            props[param].value = line[df];
            props[param].status = "complete";
          }
        )
      }

      function findNode(propertyWithID, columnWithID, line) {
        let node = liveDashPanelMonitoring.masterGraph.nodes.find(node => {
          if (propertyWithID in node.tag.properties) {
            return String(node.tag.properties[propertyWithID].value) === String(line[columnWithID])
          } else {
            return false
          }
        })
        return node
      }

      function processDfLine(line) {
        let sourceNode = findNode("node_id", "node_id_start", line)
        if (null != sourceNode) {
          processNode(sourceNode, line, "start");
        }
        let targetNode = findNode("node_id", "node_id_end", line)
        if (null != targetNode) {
          processNode(targetNode, line, "end");
        }

        let edgeNode = liveDashPanelMonitoring.masterGraph.nodes.find(node => {
          if (
            'node_id_start' in node.tag.properties &&
            'node_id_end' in node.tag.properties) {
            return String(line.node_id_start) === String(node.tag.properties.node_id_start.value) &&
              String(line.node_id_end) === String(node.tag.properties.node_id_end.value)
          } else {
            return false;
          }
        });
        if (null != edgeNode) {
          processNode(edgeNode, line, "edge");
        }
      };

      Object.entries(ds).forEach(([id, line]) => {
        processDfLine(line);
      })

      return true
    })
    .then(t => {
      liveDashPanelMonitoring.startCalculatingGraph()
      notificationSystem.create(customActionTitle, "Готово", notificationSettingsSuccess)
    })
    .catch((e) => {
      console.log("Solver flow failed", e)
      notificationSystem.create(customActionTitle, "Что-то пошло не так", notificationSettingsFail)
    })

  console.log(`Custom action "${customActionTitle}" finished`)
}

async function startCalculation() {
  let customActionTitle = "function startCalculation"
  console.log(`Custom action "${customActionTitle}" started`)
  liveDashPanelMonitoring.startCalculatingGraph()
  let dataLakeNodes = []
  for (let node of liveDashPanelMonitoring.masterGraph.nodes.filter(node => { return node.tag.primitiveID.includes("DataLakeNode") })) {
    dataLakeNodes.push(node)
  }
  var completeCount = 0

  while (completeCount != dataLakeNodes.length) {
    for (let node of dataLakeNodes) {
      if (node.tag.properties.query.status === "complete") {
        completeCount += 1
      }
    }
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`Custom action "${customActionTitle}" finished`)
}

await startCalculation()
let tmpGraphName = await copyMonitoringGraphForSolver()
await runSolver(tmpGraphName)
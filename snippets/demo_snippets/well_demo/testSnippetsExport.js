let importSnippets = [
    {
        "name": "loadChartJS",
        "content": "let src =\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js\";\n\nfunction addScript(url) {\n  let scriptId = \"load_\" + url;\n  if (!document.getElementById(scriptId)) {\n    var s = document.createElement(\"script\");\n    console.log(\"create_el\", scriptId);\n    s.src = url;\n    s.id = scriptId;\n    document.head.appendChild(s);\n  }\n}\n\naddScript(src);"
    },
    {
        "name": "runPPDWHATIF",
        "content": "let liveDashPPDWhatif = Application.autocomplete.LiveDashPanel_4;\n\nlet solverOtl = `v2 | dtcd_read_graph \"${liveDashPPDWhatif.graphMeta.graphName}\" | ks_prepare | ks_calc_df network_kind=water`\n\n// run solver & take result\nlet ds = await Application.autocomplete.DataSourceSystem.oneShotRun(\"otl\", {cache_ttl: 5, queryString: solverOtl});\n"
    }
]

InspectorFrontendHost.setPreference("scriptSnippets", JSON.stringify(importSnippets));

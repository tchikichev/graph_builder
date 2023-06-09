let addPropsMapping = {
  "templates": {
    "eeCableLine": [
      "Name",
      "aliasName",
      "description",
      "length",
      "object_type",
      "node_name",
      "zagruzka",
      "current", ,
      "kV_in",
      "kV_out",
      "kV_loss",
    ],
    "eeIn": [
      "Name",
      "description",
      "normallylnService",
      "model",
      "object_type",
      "zagruzka",
      "current",
      "kV",
      "power"
    ],
    "eeKTPN": [
      "Name",
      "description",
      "normallylnService",
      "model",
      "object_type",
      "zagruzka",
      "current",
      "kV_in",
      "kV_out",
      "power"
    ],
    "eeOut": [
      "Name",
      "description",
      "normallylnService",
      "model",
      "object_type",
      "zagruzka",
      "current",
      "kV",
      "power"
    ],
    "eePowerLine": [
      "Name",
      "aliasName",
      "description",
      "length",
      "object_type",
      "node_name",
      "zagruzka",
      "current",
      "kV"
    ],
    "eeRu": [
      "Name",
      "object_type",
      "description",
      "model",
      "zagruzka",
      "current",
      "kV_in",
      "kV_out",
      "power",
      "normallylnService",
      "measured_kWh",
      "model_kWh"
    ],
    "eeStation": [
      "Name",
      "description",
      "normallylnService",
      "model",
      "object_type",
      "zagruzka",
      "current",
      "kV",
      "power",
      "measured_kWh",
      "model_kWh"
    ],
    "eeTransformer": [
      "Name",
      "description",
      "normallylnService",
      "model",
      "object_type",
      "zagruzka",
      "current",
      "kV_in",
      "kV_out",
      "power",
      "measured_kWh",
      "model_kWh"
    ],
    "eeTapConnector": [
      "description",
      "normallylnService",
      "model",
      "Name",
      "object_type",
      "zagruzka",
      "current",
      "kV",
      "power"
    ],
    "oil_well_ecn": [
      "Name",
      "object_type",
      "description",
      "normallylnService",
      "model",
      "current",
      "kV",
      "power",
      "ecnLoad",
      "ecnFreq",
      "measured_kWh",
      "model_kWh",
      "netFreq"
    ]
  },
  "primitiveName2props": {
    "eeCableLine110Kv": "eeCableLine",
    "eeCableLine35Kv": "eeCableLine",
    "eeCableLine6Kv": "eeCableLine",
    "eeKru": "eeRu",
    "eeKrun": "eeRu",
    "eeRu": "eeRu",
    "eeZru": "eeRu",
    "eeKTPN": "eeKTPN",
    "eePowerLine": "eePowerLine",
    "eeStation": "eeStation",
    "eeSubstation": "eeTransformer",
    "eeTapConnector": "eeTapConnector",
    "eeIn": "eeIn",
    "esOut": "eeOut",
    "eeOut": "eeOut",
    "eeEngine": "oil_well_ecn",
    "oil_well": "oil_well_ecn"
  }
}


const defExpr = {
  "type": "expression",
  "expression": "",
  "status": "completed",
  "value": ""
}

// let liveDashPanelEE = Application.autocomplete.LiveDashPanel_5;

// let primitiveName2props = addPropsMapping['primitiveName2props'];
// let propsMap = addPropsMapping['templates'];

// creaate new props and fill annotation

function graphAddProps(nodes, addProps) {
  nodes.forEach(node => {
    Object.entries(addProps).forEach(([prop, expr]) => {
      if (node.tag.properties[prop] == undefined) {
        node.tag.properties[prop] = {
          "type": "expression",
          "expression": expr,
          "status": "completed",
          "value": ""
        };
      }
    })
  })
};


function addPropsByMap(graph, object_type, propsMap) {
  let targetNodes = graph.nodes.toArray().filter(node => {
    return node.tag.primitiveName == object_type;
  });
  console.log("add ", propsMap, 'to ', object_type);
  graphAddProps(targetNodes, propsMap);
}


addTo = {
  "eeCableLine6Kv": {
    "source": "",
    "loss_coef": "7.4",
    "object_type": "eeCableLine"
  }, 
  "eeCableLine35Kv": {
    "source": "",
    "loss_coef": "6.5",
    "object_type": "eeCableLine"
  }, 
  "eeCableLine110Kv": {
    "source": "",
    "loss_coef": "0.5",
    "object_type": "eeCableLine"
  }
}


Object.entries(addToaddTo).forEach(([pName, propsMap]) => {
  addPropsByMap(liveDashPanelEE.masterGraph, pName, propsMap)
})


// let targetNodes = liveDashPanelEE.masterGraph.nodes.toArray().filter(node => {


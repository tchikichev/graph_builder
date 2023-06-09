# %%
from ..graph_builder import Gbuilder
# from ../src/graph_builder import Gbuilder

import os
import copy
import json
import pdb
import sys

import numpy as np
import pandas as pd

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)


# cwd = '/home/user/git/datacad-primitives/es_primitives/src/build_graph/'
# os.chdir(cwd)

# %%
template_json = {}
with open('./src/node_template.json') as fp:
    template_json = json.load(fp)

gbuilder = Gbuilder(template_json)

# emptyNode, SimpleEdge
#%%
pads = [{"node_name": "к.88", "node_id": 1750037786}, {"node_name": "к.43", "node_id": 1750040926}, {"node_name": "к.55", "node_id": 1750037686}, {"node_name": "к.96", "node_id": 1750048619}, {"node_name": "к.45", "node_id": 1750026636}, {"node_name": "к.230",
                                                                                                                                                                                                                                               "node_id": 1751067763}, {"node_name": "к.37", "node_id": 1750023893}, {"node_name": "к.40б", "node_id": 1750048880}, {"node_name": "к.71", "node_id": 1750028316}, {"node_name": "к.40", "node_id": 1750024074}, {"node_name": "к.44", "node_id": 1751054627}]

primitiveName = "eeOut"
outNodeId, _ = gbuilder.add_node({
    "properties": {
        "node_name": "out",
        "node_id": primitiveName+'0'
    },
    'primitiveName': primitiveName,
    "extensionName": "",
    "image": "/rawPrimitives/" + primitiveName + "/icon.svg",
}, object_type='rawPrimitiveEmptyNode')

primitiveName = "eeIn"
inNodeId, _ = gbuilder.add_node({
    "properties": {
        "node_name": "in",
        "node_id": primitiveName+'0'
    },
    'primitiveName': primitiveName,
    "extensionName": "",
    "image": "/rawPrimitives/" + primitiveName + "/icon.svg",
}, object_type='rawPrimitiveEmptyNode')

inNode = gbuilder.get_node(inNodeId)
outNode = gbuilder.get_node(outNodeId)
# gbuilder.add_edge(inNode, outNode)

primitiveName = "eePad"
for pad in pads:
    node_obj = {
        "properties": pad,
        'primitiveName': primitiveName,
        "extensionName": "",
        "image": "/rawPrimitives/" + primitiveName + "/icon.svg",
        # "node_name": pad['node_name'],
        # "node_id": pad['node_id'],
    }
    newNodeId, _ = gbuilder.add_node(
        node_obj, object_type='rawPrimitiveEmptyNode')

    newNode = gbuilder.get_node(newNodeId)
    gbuilder.add_edge(inNode, newNode)
    gbuilder.add_edge(newNode, outNode)

graph_obj = gbuilder.build()
# writeto = 'result_graph.json'
writeto = '/home/user/git/datacad-primitives/es_primitives/es_demo/generated/result_graph.json'

with open(writeto, 'w') as fp:
    json.dump(graph_obj, fp, ensure_ascii=False, indent=4)

# %%

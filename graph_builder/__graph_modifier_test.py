# %%
import os
import json
import pandas as pd
import numpy as np
import pdb
import sys
import copy
pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)


cwd = '/home/user/git/datacad-primitives/es_primitives/src/build_graph/'
os.chdir(cwd)

from build_graph.graph_builder.GModifier import GModifier


# %%


primitiveName = "eePad"
#
raw_primitives_path = "/home/user/git/datacad-primitives/es_primitives/es_demo/sr92"

# %%
template_json_path = "/home/user/git/datacad-primitives/es_primitives/src/build_graph/src/node_templates.json"

nodes_templates = {}
with open(template_json_path) as fp:
    nodes_templates = json.load(fp)
nodes_templates.keys()

# nodes_templates['eeSubstation']['properties'].keys()

# todo merge templates
template_json = {}
with open('./src/node_template.json') as fp:
    template_json = json.load(fp)

graph_obj = {"graph": {
    "nodes": [],
    "edges": [],
    "groups": []
}
}
# readfrom = '/home/user/git/datacad-primitives/es_primitives/es_demo/generated/result_graph.json'
# with open(readfrom) as fp:
#     graph_obj = json.load(fp)


initPortsTemplate = [
    {
        "primitiveName": "inPort1",
        "type": "IN",
        "properties": {
            "status": {"expression":"","type":"expression","status":"complete","value":""            }
        },
        "primitiveID": "",
        "location": {"x":0.5,"y":0}
    },
    {
        "primitiveName": "outPort1",
        "type": "OUT",
        "properties": {
            "status": {"expression":"","type":"expression","status":"complete","value":""            }
        },
        "primitiveID": "",
        "location": {"x":0.5,"y":1}
    }
]

# %%

# require
# primitiveName, as primitiveName
# node_name, as Name[str]
# type as object_type[str]:: "РУ 35/6 кВ"

def add_nodes(df, nodes_templates, g_modifier, index_col="new_primitive_id"):
    for _, item in df.iterrows():
        primitiveName = item['primitiveName']
        node_obj = copy.deepcopy(nodes_templates[primitiveName])
        ports = copy.deepcopy(initPortsTemplate)
        node_obj['initPorts'] = ports
        # node_obj['layout'] = layoutTemplate
        node_obj['primitiveName'] = primitiveName
        node_obj["image"] = "/rawPrimitives/" + primitiveName + "/icon.svg"

        # node_obj['extensionName'] = ""
        props = node_obj['properties']
        name = item['node_name']
        print("add ", primitiveName, name)
        props['Name']['expression'] = '\"'+name+'\"'
        props['object_type']['expression'] = '\"'+item["type"]+'\"'

        newNodeId, _ = g_modifier.add_node(
            node_obj, item[index_col],
            object_type='rawPrimitiveTemplate')
        # write resultId back to dataframe
        # item[index_col] = newNodeId

        # newNode = gmod.get_node(newNodeId)
        # gmod.add_edge(inNode, newNode)
        # gmod.add_edge(newNode, outNode)
# %%

gmod = GModifier(template_json, graph_obj['graph'])
# gmod = GModifier()

ecn9eu = pd.read_csv("ecn9eu.csv")
# add ecn9eu nodes
add_nodes(ecn9eu, nodes_templates, gmod, index_col="Электроустановка")

#%%
# add "СШ, №яч." nodes 
df = pd.read_csv("ecn9_to_ktpn.csv")
sections = df.groupby("СШ, №яч.").first().reset_index()

sections['primitiveName'] ="eeTapConnector"
sections['node_name'] = sections["СШ, №яч."]
sections['type'] = 'section'
index_target_col='struuid'
index_cols = ['Подразделение', 'Электроустановка','СШ, №яч.']
sections[index_target_col] = sections[index_cols].sum(axis=1)

add_nodes(sections, nodes_templates, gmod,index_col='struuid')
sections['this_id'] = sections[index_target_col].apply(
    lambda name: gmod.get_node_by_name(name)
)

sections['parent'] = sections['Электроустановка'].apply(
    lambda name: gmod.get_node_by_name(name)
)

# sections.head()
#%%
# add edges "СШ, №яч." to parent 
for _, item in sections.iterrows():
    # add edges from parent node
    sourceNode = gmod.get_node(item['parent'])
    targetNode = gmod.get_node(item['this_id'])
    gmod.add_edge(sourceNode,targetNode)

# %%
# add ktpn
ecn9_to_ktpn = pd.read_csv("ecn9_to_ktpn.csv")
ecn9_to_ktpn['type'] = ecn9_to_ktpn['object_type']
index_col= 'Дисп. наименование КТП(Н)'

add_nodes(ecn9_to_ktpn, nodes_templates, gmod, index_col)
ecn9_to_ktpn['this_id'] = ecn9_to_ktpn[index_col].apply(
    lambda name: gmod.get_node_by_name(name)
)
parent_index_cols = index_cols
ecn9_to_ktpn['parent'] = ecn9_to_ktpn[parent_index_cols].sum(
    axis=1).apply(
    lambda x: gmod.get_node_by_name(x))
#%%
for _, item in ecn9_to_ktpn.iterrows():
    sourceNode = gmod.get_node(item['parent'])
    targetNode = gmod.get_node(item['this_id'])
    
    # TODO:: add intermediary node here
    gmod.add_edge(sourceNode,targetNode)

# %%
graph_obj = gmod.build()
# writeto = 'result_graph.json'
dest = 'result_graph_mod.json'
print("writing to ", dest)

Gbuilder.dump(graph_obj, dest)
# %%
# line = ecn9_to_ktpn.iloc[0].to_json(force_ascii=False)
# line

# livedash.createEdge(outPort, inPort, edge)


# %%
names = pd.DataFrame.from_dict(
    gmod.node_ids_by_name, orient='index'
    )
# names.rename(columns=['name', 'id'])
# names.rename(columns=['id'])
# %%

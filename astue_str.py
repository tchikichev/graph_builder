
# %%
# from graph_builder.GModifier import GModifier, GbuilderMultiple
# import graph_builder.Gbuilder as builder


# import graphviz
import matplotlib.pyplot as plt
import networkx as nx
import os
import json
import pandas as pd
import numpy as np
import pdb
import sys
import copy

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)

cwd = os.path.dirname(os.path.abspath(__file__))
os.chdir(cwd)

# %%
# %%


class AstueData():
    def __init__(self, loc, files) -> None:

        dfs = {}
        for tname, fname in files.items():
            fpath = os.path.join(loc, fname)
            df = pd.read_csv(fpath)

            # print('{}::\n{}'.format(tname, df.columns))
            dfs[tname] = df

        df_ch = dfs['channels']
        df_ch['IDDEVICE'] = df_ch['IDDEVICE'].fillna('-1')
        df_ch['IDDEVICE'] = df_ch['IDDEVICE'].apply(lambda x: round(int(x)))

        self.data = dfs

        self.channels = pd.DataFrame(df_ch)
        self.devices = pd.DataFrame(dfs['devices'])
        self.objects = pd.DataFrame(dfs['objects'])
        self.obj_obj = pd.DataFrame(dfs['obj_obj'])
        self.p_conn = pd.DataFrame(dfs['point_connections'])
        self.p_dev = pd.DataFrame(dfs['point_devices'])
        self.p_obj = pd.DataFrame(dfs['point_obj'])


data_loc = './data/astue'

files = {
    "channels": "IPR_CHANNELS.csv",
    "devices": "IPR_DEVICES.csv",
    "objects": "IPR_OBJECTS.csv",
    "obj_obj": "IPR_OBJ_OBJ.csv",
    "point_connections": "IPR_POINT_CONNECTIONS.csv",
    "point_devices": "IPR_POINT_DEVICES.csv",
    "point_obj": "IPR_POINT_OBJ.csv"
}


# channels::
# IDOBJECT >> IDDEVICE >> IDCHANNEL >> ...
# IDCHANNEL_PARENT >> IDCHANNEL
# devices::
# IDDEVICE >> ...
# Index(['IDDEVICE', 'NAME_DEVICE', 'IDTYPE_DEVICE', 'UUID', 'GMT_SHIFT',
#        'DAYLIGHT', 'MANUAL', 'SHORT_NAME'],
#       dtype='object')
# objects::
# IDOBJECT >> NAME_OBJECT, UUID, SHORT_NAME
# obj_obj::
# IDOBJECT >> IDOBJECT_PARENT

# point_connections::
# IDPOINT_CONNECTION >> data

# point_devices::
# IDPOINT_CONNECTION >> IDDEVICE

# point_obj::
# IDPOINT_CONNECTION >> IDOBJECT, COEF
# IDOBJECT >> IDPOINT_CONNECTION


# %%

adata = AstueData(data_loc, files)

ch = adata.channels
ch = pd.DataFrame.drop(ch, columns=['IDOBJECT', 'IDCHANNEL_PARENT'])

o2dev = adata.p_obj.join(adata.p_dev.set_index(
    'IDPOINT_CONNECTION'), on='IDPOINT_CONNECTION')

# config = {
#     'build_stages': {
#     },
#     'build_upon': False,
#     'write_to': 'result_graph_mod.json',
#     'node_templates_loc': './graph_builder/node_templates_no_img.json'
# }

# with open('./graph_builder/initPorts.json') as fp:
#     initPortsTemplate = json.load(fp)

# node_templates = {}
# with open(config['node_templates_loc']) as fp:
#     node_templates = json.load(fp)
# gmod = GbuilderMultiple(node_templates, initPortsTemplate)


# G.add_nodes_from([
#     (4, {"color": "red"}),
#     (5, {"color": "green"}),
# ])
# %%

# %%

# %%
# G = nx.Graph()
DG = nx.DiGraph()
# edges_true = edges.loc[edges['COEF'] == 1][['IDOBJECT_PARENT','IDOBJECT']]
# edges_rev = edges.loc[edges['COEF'] == -1][['IDOBJECT', 'IDOBJECT_PARENT']]

nodes = adata.objects.set_index('IDOBJECT')
# nodes = adata.objects.set_index('IDOBJECT')['NAME_OBJECT']
DG.add_nodes_from(list(nodes.iterrows()))

edges = adata.obj_obj[['IDOBJECT_PARENT', 'IDOBJECT', 'COEF']]
tuple_edges_data = [tuple(row.values) for _, row in edges.iterrows()]

DG.add_weighted_edges_from(tuple_edges_data)
DG.nodes()

# %%
names = nx.get_node_attributes(DG, "NAME_OBJECT")
# names_df = pd.DataFrame(names)

names_df = pd.DataFrame.from_dict(names, orient='index')

# %%
# kuzm = names_df.loc[names_df[0].str.contains('ПС')]
# # %%
# kuzm_id = 10880

# kuzm = DG.nodes[kuzm_id]
# # %%
# list(DG.predecessors(kuzm_id))[0]
# %%
graph = nx.Graph()
graph.add_nodes_from(list(nodes.iterrows()))
graph.add_weighted_edges_from(tuple_edges_data)

subs = [graph.subgraph(c).copy() for c in nx.connected_components(graph)]
s0 = subs[0]

# %%
digraph = nx.DiGraph()
digraph.add_nodes_from(list(nodes.iterrows()))
digraph.add_weighted_edges_from(tuple_edges_data)

# with open('parent_nodes.json', 'w') as fp:
#     json.dump(pnode_info, fp, ensure_ascii=False, indent=4, default="")
# %%

# all::
# ancestors
# descendants

# successor
def get_nodes_info(graph, target_node_ids, get='name'):
    node_info = {}
    for id in target_node_ids:
        node = graph.nodes[id]
        name = node['NAME_OBJECT']

        if get=='name':
            node_info[id] = name
        else:
            node_info[id] = node
    return node_info

print(digraph.nodes[1058])
target = list(nx.descendants(digraph, 1058))
info = get_nodes_info(digraph, target)
info
#%%
nx.dijkstra_path_length(digraph, 1058, 9911)

# {1058: 'СР №9 (Тайлаковское-2 м/р)',
#  9902: 'ПС 35/6 кВ "Норкин"',
#  9911: 'Ячейка 9'}

# %%


# %%
# nx.dfs_successors(digraph, 1058, 4)
# %%
# nx.bfs_layers(digraph, [1058])
tree1 = nx.bfs_tree(graph,1058)

#%%

options = {"with_labels": True, "node_color": "white", "edgecolors": "blue"}

# fig = plt.figure(figsize=(6, 9))
# # axgrid = fig.add_gridspec(3, 2)

3::
 10538: 'Отдел энергоресурсов', - 3

2::
 10347: 'СР №9 Тайлаковского-2 м/р', - 2

1::
 10637: 'ДНС-1'
 10340: 'СР № 10 Тайлаковское-1 м/р',
 6795: 'Мех.фонд',
 
#  8677: 'Счётчики',
#  10013: 'Счётчики',
#  6792: 'Внешние сети',
 6795: 'Мех.фонд',
 10926: 'Оборудование ДНС и КНС',
 6638: '07Группа энергосбережения',
 5186: 'ППД - КНС',
 1257: 'ЗРУ-6кВ ДНС -1',
 133: 'Все ПС 110/35/6 кВ (импорт из МЕТ)',


# ax = fig.add_subplot()
# # ax.set_title("Bayesian Network")
# pos = nx.nx_agraph.graphviz_layout(graph, prog="neato")
# nx.draw_networkx(graph, pos=pos, **options)

# nx.draw(graph, ax=ax)   # default spring_layout


# %%

tree2 = nx.bfs_tree(graph,9913)
# tree2.nodes
roots = list((v for v, d in digraph.in_degree() if d == 0))
leaves = list((v for v, d in digraph.out_degree() if d == 0))
get_nodes_info(graph, tree2.nodes, get='name')


# %%
pred = list(digraph.predecessors(1060))

if pred != []:
    print(pred[0], digraph.nodes[pred[0]])
# %%
objects = adata.objects.set_index('IDOBJECT')
# %%
objects
# %%
objects.take(list(roots))
# %%
objects.take(roots)
# %%
# for id in roots:
#     oi = objects[id]

# %%
objects.loc[10743, ['NAME_OBJECT', 'IDTYPE_OBJECT']]
# %%

path = nx.dijkstra_path(digraph, 1058, 9911)
get_nodes_info(digraph, path, get='all')
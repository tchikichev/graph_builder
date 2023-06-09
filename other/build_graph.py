# %%
from graph_builder.GModifier import GModifier, GbuilderMultiple
import graph_builder.Gbuilder as builder
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
# l1

# def add_eu(gmod, df):
#     eu = copy.deepcopy(df)
#     # eu = eu.loc[eu['ЭЦН, ШГН']== 'ЭЦН']
#     eu['eu_primitiveName'].fillna("eeRu")
#     eu = eu.groupby(["Электроустановка"]).first().reset_index()

#     gmod.add_nodes_from_df(eu,
#                         primitive_name_col="eu_primitiveName",
#                         index_col="Электроустановка",
#                         props_mapping=[
#                             ('Name', "eu_node_name"),
#                             ('object_type', "eu_type"),
#                         ]
#                         )

def add_residual(
        gmod, df,
        parent_name_col,
        parent_index_col= 'index_name',
        primitiveName = 'esOut',
        object_type = 'unknown_cons',
        props_mapping = [
                            ('Name', "out_name"),
                            ('object_type', "out_type"),
                        ]
                 ):
    
    df_mod = copy.deepcopy(df)
    df_mod = df_mod.groupby(parent_index_col).first().reset_index()

    df_mod['out_primitiveName'] = primitiveName
    # 'Электроустановка'
    index_col = 'out_index_col'
    df_mod[index_col] = df_mod[parent_index_col].apply(lambda x: ' '.join([object_type,x])) 
    df_mod['out_name'] = df_mod[parent_name_col].apply(lambda x: ' '.join([object_type,x])) 
    df_mod['out_type'] = object_type

    gmod.add_nodes_from_df(df_mod,
                        primitive_name_col="out_primitiveName",
                        index_col=index_col,
                        props_mapping = props_mapping
                        )

    gmod.link_nodes(df_mod, 
        index_col,
        parent_index_col)

#%%

# ecn = ecn.groupby(['Потребитель']).first().reset_index()

# l2 - sections

# s9
# def add_sections(gmod, df):


#     if graph_config['add_sections']:
#         unique_sel = copy.deepcopy(sections)
#         unique_sel = unique_sel.groupby(section_index_col).first().reset_index()

#         unique_sel['section_object_type'] = 'section'

#         gmod.add_nodes_from_df(eu,
#                             primitive_name_col="section_primitiveName",
#                             index_col="section_struuid",
#                             props_mapping=[
#                                 ('Name', "СШ, №яч."),
#                                 ('object_type', "section_object_type"),
#                             ])
#         gmod.link_nodes(unique_sel, 
#             'section_struuid',
#             parent_index_col)
#         parent_index_col = 'section_struuid'


# %%
# all lines

def add_multiple_nodes(
        gmod: GbuilderMultiple, df,
        index_col,
        props_mapping = [], primitive_name_col="primitiveName",
        parent_index_col=None, edge_node_obj = None, extensionName = "",
        fix_ports=True
        ):
    dfu = copy.deepcopy(df)
    dfu = dfu.groupby(index_col).first().reset_index()

    gmod.add_nodes_from_df(dfu,
                        primitive_name_col, index_col,
                        props_mapping, extensionName, fix_ports
                        )
    
    if parent_index_col is not None:        
        gmod.link_nodes(dfu, 
            index_col,
            parent_index_col,
            edge_node_obj)


# #%%
# # add unknown nodes as esOut
# parent_index_col = ktpn_index_col

# out_to_ktpn_df = copy.deepcopy(to_ktpn_df)
# out_to_ktpn_df['out_primitive_name'] = 'esOut'
# out_to_ktpn_df['out_type'] = 'unknown_cons'
# index_col = 'index_name'
# out_to_ktpn_df[index_col] = out_to_ktpn_df[ktpn_index_col].apply(lambda x: 'unknown_cons' + x) 
# out_to_ktpn_df['out_node_name'] = out_to_ktpn_df['ktpn_node_name'].apply(lambda x: 'остаток ' + x) 


# if graph_config['add_residual_nodes']:

#     gmod.add_nodes_from_df(out_to_ktpn_df,
#                         primitive_name_col="out_primitive_name",
#                         index_col=index_col,
#                         props_mapping=[
#                             ('Name', "out_node_name"),
#                             ('object_type', "out_type"),
#                         ]
#                         )

#     gmod.link_nodes(out_to_ktpn_df, 
#         index_col,
#         parent_index_col)

# # %%


# %%

# arrange_node = gmod.node_builder.from_template(
#     "UncontrolledRichLabelNode01", "ARRANGE_NODE")
# gmod.add_node(arrange_node, object_type="ARRANGE_NODE")


# %%
# %%

config = {
    'build_stages': {
        'add_sections': False,
        'add_residual_nodes': True},
    'build_upon': True,
    # 'build_upon_loc': 'data/top_graph_eu.json',
    # 'build_upon_loc': 'data/parent_tree_cut3 no_img.json',
    'build_upon_loc': 'data/parent_tree_cut4_mod.json',
    # 'build_upon_loc': 'data/parent_tree_cut3.json',
    # 'build_upon_loc': 'demo_neftesbor_testConvert.json',
    'write_to': 'result_graph_mod.json',
    'node_templates_loc': './graph_builder/node_templates_no_img.json'
    # 'node_templates_loc': './graph_builder/node_templates.json'
}

if __name__ == "__main__":
    with open('./graph_builder/initPorts.json') as fp:
        initPortsTemplate = json.load(fp)

    node_templates = {}
    with open(config['node_templates_loc']) as fp:
        node_templates = json.load(fp)

    if config['build_upon']:
        build_upon_loc = config['build_upon_loc']
        with open(build_upon_loc, mode='r') as fp:
            graph_build_upon_obj = json.load(fp)

        gmod = GbuilderMultiple(node_templates, initPortsTemplate,
                    init_graph=graph_build_upon_obj)
        
        mapping_to_iter = copy.deepcopy(gmod.node_ids_by_name)

        # register tapConnectors
        for name, id in mapping_to_iter.items():
            node = gmod.get_node(id)
            if node['primitiveName'] == 'eeTapConnector':
                name = node['properties']['Name']['value']
                gmod.node_ids_by_name[name] = id

    else:
        gmod = GbuilderMultiple(node_templates, initPortsTemplate)

    loc = 'data/format_ktpn_measures_tree.csv'
    df = pd.read_csv(loc, sep=';')

    # add base, lines, ...ktpn

    # add node ids

    graph_obj = gmod.build()
    builder.Gbuilder.dump(graph_obj, config['write_to'])
    print("writing to ", config['write_to'])

   
# %%

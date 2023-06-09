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
# %%

with open('./graph_builder/initPorts.json') as fp:
    initPortsTemplate = json.load(fp)

node_templates = {}
with open(config['node_templates_loc']) as fp:
    node_templates = json.load(fp)


with open('data/ee_props_mapping.json', mode='r') as fp:
    props_map_json = json.load(fp)

ee_props_mapping = props_map_json['schema_ext']
ee_props_mapping
# %%

df = pd.read_csv('data/ecn_to_ktpn_full3.csv')
# df = pd.read_csv('data/ecn_to_ktpn_full2.csv')
index = list(df.columns)
index
# %%

s9 = df.loc[
    (df['Подразделение'] == 'с/р №9') |
    (df['Подразделение'] == 'с/р №10')
]

# %%
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

# DataLakeNode = node_templates['DataLakeNode']
# gmod.add_node(DataLakeNode)

# %%

eu = copy.deepcopy(s9)
# eu = eu.loc[eu['ЭЦН, ШГН']== 'ЭЦН']
eu['eu_primitiveName'].fillna("eeRu")
eu = eu.groupby(["Электроустановка"]).first().reset_index()

###########################################################
index_col = 'Электроустановка'

extensionNameEl = "ExtensionElectricalSchemePrimitives"

gmod.add_nodes_from_df(eu,
                       primitive_name_col="eu_primitiveName",
                       index_col="Электроустановка",
                       props_mapping=ee_props_mapping['Электроустановка'],
                       extensionName=extensionNameEl
                       )

parent_index_col = 'Электроустановка'

ee_props_mapping['residual_template'].update({
    "source": None
})

residual_props_mapping = ee_props_mapping['residual_template']
residual_props_mapping.update({
    'parent_name': parent_index_col
})

if config['build_stages']['add_residual_nodes']:
    parent_name_col = parent_index_col
    gmod.add_residuals(eu,
                       parent_name_col, parent_index_col,
                       props_mapping=residual_props_mapping)
# %%
# map by special list to graph nodes

# add link to parent nodes from top graph

mapping = pd.read_csv('data/mapping.csv')

mapping['this_node'] = mapping[index_col].apply(
    lambda name: gmod.get_node_by_name(name)
)
mapping['parentID'] = mapping['parentName'].apply(
    lambda name: gmod.get_node_by_name(name)
)
gmod.link_nodes_df(
    mapping,
    "this_node",
    'parentID',
    sourcePortId=0, targetPortId=0)

# %%
sections = copy.deepcopy(df)

index_col = ee_props_mapping['СШ']['node_id']

sections = sections.loc[sections['ЭЦН, ШГН'] == 'ЭЦН']
sections = sections.loc[
    (sections['Электроустановка'].str.contains('Кузьмин')) |
    (sections['Электроустановка'].str.contains('Абазаров'))
]

# %%
# add sections
sh1 = sections.groupby(index_col).first().reset_index()
sh1['section_primitiveName'] = "eeTapConnector"
sh1['section_object_type'] = "eeTapConnector"

sh1_props_map = ee_props_mapping['СШ']
sh1_props_map.update({
    'object_type': "section_object_type",
    "source": None
})

gmod.add_multiple_nodes(
    sh1,
    index_col=index_col,
    props_mapping=sh1_props_map,
    primitive_name_col="section_primitiveName",
    extensionName=extensionNameEl,
    parent_index_col=parent_index_col
    # edge_node_obj = edge_node_obj
)
# %%
# add taps
sections['section_primitiveName'] = "BreakerOn"
sections['section_object_type'] = "Breaker"

# Index(['Подразделение', 'Электроустановка', 'СШ, №яч.',
#     'Дисп. наименование КТП(Н)', 'S, кВА', 'I ном., А', '№ авт. (тип)',
#     'I ном.авт., А', 'Тип блока защит АВ-0,4кВ', 'Прогрузка АВ-0,4кВ',
#     'Уставка МТЗ', 'Уставка МТО', 'Диап. рег. уст. МТЗ',
#     'Диап. рег. уст. МТО', 'Потребитель', 'ЭЦН, ШГН', 'Р факт., кВт',
#     'Состояние', 'I факт., А', 'Загр. КТПН, %', 'U факт. КТПН, В',
#     'ПБВ Кол-во', 'ПБВ Полож.', 'Дата замера', 'U на СУ, В',
#     'Селективность действия защит', 'Qжидк., куб.м./с', 'Qн., тонн',
#     'Время АПВ, мин.', 'Рем. № КТПН', 'department_num', 'eu_type',
#     'eu_node_name', 'pad_num', 'ktpn_num', 'ktpn_object_type',
#     'ktpn_node_name', 'ktpn_primitiveName', 'eu_primitiveName'],
#     dtype='object')

parent_index_col = index_col

sh2_props_map = ee_props_mapping['яч']
sh2_props_map.update({
    'object_type': "section_object_type",
    "source": None
})

index_col = sh2_props_map['node_id']

gmod.add_multiple_nodes(
    sections,
    index_col=index_col,
    props_mapping=sh2_props_map,
    primitive_name_col="section_primitiveName",
    extensionName=extensionNameEl,
    parent_index_col=parent_index_col
    # edge_node_obj = edge_node_obj
)
# %%

to_ktpn_df = copy.deepcopy(sections)
parent_index_col = index_col

ktpn_props_map = ee_props_mapping['КТП(Н)']
ktpn_props_map.update({
    "source": None
})

index_col = ktpn_props_map['node_id']

# ktpn_index_col = 'ktpn_index_col'
# to_ktpn_df[ktpn_index_col] = to_ktpn_df[[
#     'section_struuid', 'Дисп. наименование КТП(Н)']].sum(axis=1)
# to_ktpn_df['ktpn_primitiveName'] = 'eeKTPN'

edge_node_obj = gmod.node_builder.from_template(
    'eeCableLine6Kv', template_name='eeCableLine6Kv')
gmod.add_multiple_nodes(
    to_ktpn_df,
    index_col=index_col,
    props_mapping=ktpn_props_map,
    primitive_name_col=ktpn_props_map['primitiveName'],
    extensionName="ExtensionElectricalSchemePrimitives",
    parent_index_col=parent_index_col,
    edge_node_obj=edge_node_obj
)

parent_index_col = index_col
# %%
# wells
well_df = copy.deepcopy(to_ktpn_df)

well_props_map = ee_props_mapping['Потребитель']
well_props_map.update({
    'pad_num': 'ktpn_pad_num',
    'ois_id': None,
    'load_pc': None,
    'power_full_kW': None,
    'power_active_kW': None,
    'power_coef': None,
    "source": None
})

index_col = well_props_map['node_id']

# well_index_col = 'well_index_col'
# well_df[well_index_col] = well_df[
#     ['section_struuid', 'Потребитель']
# ].sum(axis=1)

# well_df["well_primitiveName"] = 'esOut'
# well_df["well_primitiveName"] = 'oil_well'

well_df["well_primitiveName"] = 'oil_well'

# add ECN \ oil_well
gmod.add_multiple_nodes(
    well_df,
    index_col=index_col,
    props_mapping=well_props_map,
    primitive_name_col="well_primitiveName",
    extensionName="ExtensionOilPrimitives",
    parent_index_col=parent_index_col,
    fix_ports=False
)

if config['build_stages']['add_residual_nodes']:
    parent_name_col = ktpn_props_map['name']

    residual_props_mapping = ee_props_mapping['residual_template']
    residual_props_mapping.update({
        'parent_name': parent_index_col
    })

    gmod.add_residuals(to_ktpn_df,
                       parent_name_col, parent_index_col,
                       props_mapping=residual_props_mapping)
# %%

res_df = pd.read_csv('data/wells_to_add.csv', index_col=False)
# add unknown transmitters

res_df['well_primitiveName'] = "eeOut"
res_df['pad_primitiveName'] = "eeTapConnector"

# __deposit,__pad_num,__well_num,node_name_start,model_kwh,p_plast,_time,node_id,power_kW


def add_index_col(df, index_cols):
    return df[index_cols].astype(str).apply(lambda x: ' '.join(x), axis=1)

res_df['pad_struuid'] = add_index_col(res_df, ['__deposit', '__pad_num'])
res_df['well_struuid'] = add_index_col(
    res_df, ['__deposit', '__pad_num', '__well_num'])

res_df['well_object_type'] = "oil_well_ecn"
res_df['pad_object_type'] = "res_pad"

res_well_props_map = ee_props_mapping['Потребитель']
res_well_props_map.update({
    'Qliq_m3ps': None,
    'Qn_t': None,
    'U на СУ, В': None,
    'current_A': None,
    'name': '__well_num',
    'node_id': 'well_struuid',
    'object_type': 'well_object_type',
    'pad_num': '__pad_num',
    'power_kW': None,
    'state': None,
    'type': None,
    'Время АПВ, мин.': None,
    'Дата замера': None,
    'ПБВ Кол-во': None,
    'ПБВ Полож.': None,
    'Селективность действия защит': None,
    'source': None
})

res_pad_props_map = {
 'I ном., А': None,
 'I ном.авт., А': None,
 'S, кВА': None,
 'U_fact_V': None,
 'avt_model': None,
 'avt_num': None,
 'description': None,
 'name': None,
 'node_id': 'pad_struuid',
 'num': None,
 'object_type': 'pad_object_type',
 'pad_num': '__pad_num',
 'primitiveName': None,
 'zagruzka': None,
 'Диап. рег. уст. МТЗ': None,
 'Диап. рег. уст. МТО': None,
 'Прогрузка АВ-0,4кВ': None,
 'Рем. № КТПН': None,
 'Тип блока защит АВ-0,4кВ': None,
 'Уставка МТЗ': None,
 'Уставка МТО': None,
 '№ авт. (тип)': None,
 'source': None
 }

pad_res_df = copy.deepcopy(res_df)
pad_res_df = pad_res_df.groupby('__pad_num').first().reset_index()

#%%
gmod.add_multiple_nodes(
    pad_res_df,
    index_col='pad_struuid',
    props_mapping=res_pad_props_map,
    primitive_name_col="pad_primitiveName",
    extensionName="ExtensionElectricalSchemePrimitives",
    parent_index_col=None,
    fix_ports=False
)

gmod.add_multiple_nodes(
    res_df,
    index_col='well_struuid',
    props_mapping=res_well_props_map,
    primitive_name_col="well_primitiveName",
    extensionName="ExtensionElectricalSchemePrimitives",
    # extensionName="ExtensionOilPrimitives",
    parent_index_col='pad_struuid',
    fix_ports=False
)



# sel_well_df = well_df.groupby(well_index_col).first().reset_index()

graph_obj = gmod.build()
builder.Gbuilder.dump(graph_obj, config['write_to'])
print("writing to ", config['write_to'])

# %%

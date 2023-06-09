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

cwd = os.path.dirname(os.path.abspath(__file__))
os.chdir(cwd)

#%%
loc = 'oil_to_ee.json'
# df = pd.read_csv(loc, index_col=False)

with open(loc) as fp:
    well_data_json = json.load(fp)

well_data_json.keys()
# %%
oil_nodes = well_data_json['oil_nodes']
oil_pad_nodes = well_data_json['oil_pad_nodes']
ecn_nodes = well_data_json['ecn_nodes']
ktpn = well_data_json['ktpn']


# %%
df_ktpn = pd.DataFrame.from_records(ktpn)
df_oil_pads = pd.DataFrame.from_records(oil_pad_nodes)

# count_ktpn = df_ktpn.groupby('padnum')['id'].count()
# count_ktpn

ee_pads = df_ktpn.sort_values('padnum')
ee_pads_unique = ee_pads.groupby('padnum')['id'].count()
ee_pads_list = list(ee_pads_unique.keys())
ee_pads_list
# ee_pads = ['К-45Б','КП-1','КП-14','КП-15','КП-2','КП-23','КП-230','КП-25','КП-29','КП-3','КП-37','КП-40','КП-40Б','КП-43','КП-44','КП-45','КП-64','КП-71','КП-95']
# %%
oil_pads = list(df_oil_pads.sort_values('name')['name'])
# %%
unknown_pads = ['к.55',
'к.71',
'к.88',
'к.96']


#%%

import re

col = 'pad_num'
pad_num_reg = r'(?:КП-|К-|К.)(?P<pad_num>[\d\w]+)'
expected_pads = df_oil_pads['name'].str.extract(pad_num_reg, flags=re.IGNORECASE | re.UNICODE)
list(expected_pads[col])
# %%
# pads in oil graph
['88', '43', '55', '96', '45', '230', '37', '40б', '71', '40', '44']

# find address for each well in this pad

#%%
expected_pads['name'] = expected_pads['pad_num']
expected_pads.set_index('pad_num')

#%%
index_pads_loc = 'tailaki_pads.csv'

pads = pd.read_csv(index_pads_loc, usecols=range(3), index_col=False)
pads.head()

# %%
wells_data = pads.groupby(['__pad_num','__well_num']).first().reset_index()
wells_data.head()
# %%
wells_data.join(expected_pads.set_index('pad_num'), on='__pad_num')
# %%
df_oil_wells = pd.DataFrame.from_records(oil_nodes)
df_oil_wells['padnum'] = df_oil_wells['padnum'].str.extract(pad_num_reg, flags=re.IGNORECASE | re.UNICODE)
df_oil_wells.head()
# %%
match = df_oil_wells[['name','node_id', 'padnum']].astype(str).join(wells_data.set_index('__well_num'), on='node_id')
# wells_data.join(expected_pads.set_index('pad_num'), on='__pad_num')
empty = match.loc[pd.isna(match['__pad_num'])]

list(empty.groupby('padnum').first().reset_index()['padnum'])
# %%
# no data for ['45', '55', '71', '88', '96']
import pandas as pd
import json
import copy

loc = 'ee_graph_res_pads (7) (2).json'
with open(loc, mode='r') as ifp:
    graph = json.load(ifp)


# find esOut

nodes = graph['graph']['nodes']

for node in nodes:
    if node['primitiveName'] == 'esOut':
        print(node['primitiveID'])
        node['primitiveName'] = 'eeOut'
        node["extensionName"] = "ExtensionElectricalSchemePrimitives"
        # node['properties']
        node.pop("image")

graph['graph']['nodes'] = nodes


#%%
write_to = 'ee_graph_res_pads_mod.json'
with open(write_to, mode='w') as fp:
    json.dump(graph, fp, ensure_ascii=False, indent=4)
# %%

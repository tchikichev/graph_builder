#%%
import pandas as pd
import json

# props_map = pd.read_csv('res_props_map.csv', index_col=['node','datacad'])
props_map = pd.read_csv('res_props_map.csv', index_col='df')
props_map
# %%
props_map.to_json('res_props_map2.json')
# %%
node = pd.read_csv('res_props_map.csv')[['node','df']]
# node
node.to_json('nodes.json', orient='columns')

# %%
json(node)
# %%
res = pd.read_csv('kns_result.csv', index_col=0)
res.head()
# %%
res.columns
# %%
# Index(['row_type', 'node_name_start', 'node_id_start', 'node_id_end',
#        'node_name_end', 'X_start', 'X_end', 'Y_start', 'Y_end', 'start_kind',
#        'start_value', 'start_T', 'end_kind', 'end_value', 'end_T',
#        'start_is_source', 'startIsOutlet', 'end_is_source', 'endIsOutlet',
#        'altitude_start', 'altitude_end', 'L', 'd', 's', 'uphillM',
#        'effectiveD', 'intD', 'roughness', 'perforation', 'pumpDepth', 'model',
#        'frequency', 'productivity', 'predict_mode', 'shtr_debit', 'K_pump',
#        'VolumeWater', 'choke_diam', 'p_start', 'q_start', 'p_end', 'q_end',
#        'startP', 'startT', 'endP', 'endT', 'start_Q_m3_day', 'end_Q_m3_day',
#        'res_watercut_percent', 'res_liquid_density_kg_m3',
#        'res_pump_power_watt', 'X_kg_sec', 'velocity_m_sec'],
#       dtype='object')

res_props = ['startP', 'startT', 'endP', 'endT', 'start_Q_m3_day', 'end_Q_m3_day',
       'res_watercut_percent', 'res_liquid_density_kg_m3',
       'res_pump_power_watt', 'X_kg_sec', 'velocity_m_sec']


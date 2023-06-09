#%%
from asyncore import read
from copy import copy
import pandas as pd
import os

#%%
os.chdir('/home/tim/git/IPRCUD')

loc = '/home/tim/git/IPRCUD/input/sprav to node6'

files = {
    "channels": "IPR_CHANNELS.csv",
    "devices": "IPR_DEVICES.csv",
    "objects": "IPR_OBJECTS.csv",
    "obj_obj": "IPR_OBJ_OBJ.csv",
    "point_connections": "IPR_POINT_CONNECTIONS.csv",
    "point_devices": "IPR_POINT_DEVICES.csv",
    "point_obj": "IPR_POINT_OBJ.csv"
}

dfs = {}

for tname, fname in files.items():
    fpath = os.path.join(loc, fname)
    df = pd.read_csv(fpath)

    print('{}::\n{}'.format(tname, df.columns))
    dfs[tname] = df


df_ch = dfs['channels']
df_ch['IDDEVICE'] = df_ch['IDDEVICE'].fillna('-1')
df_ch['IDDEVICE'] = df_ch['IDDEVICE'].apply(lambda x: round(int(x)))

# %%
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

#%%
# dfs['obj_obj']
# %%
df_pdev = dfs['point_devices']
df_pobj = dfs['point_obj']

ps_ids = {
    'kuzm': 10880,
    'rynk': 10027
}

target_pobj = df_pobj.loc[df_pobj['IDOBJECT'] == ps_ids['rynk']]
target_dev = pd.DataFrame.join(target_pobj, df_pdev.set_index('IDPOINT_CONNECTION'), on='IDPOINT_CONNECTION')
# %%
target_dev['IDDEVICE']
# %%
import copy
df_chf = copy.deepcopy(df_ch)
df_chf.head()

#%%
target_chs = pd.DataFrame.join(target_dev, df_ch.set_index('IDDEVICE'), on='IDDEVICE', how='inner', lsuffix='', rsuffix='_right')
target_chs[['IDPOINT_CONNECTION','IDOBJECT', 'IDDEVICE', 'IDCHANNEL']]

target_chs_to_join = target_chs[['IDPOINT_CONNECTION','IDOBJECT', 'IDDEVICE', 'IDCHANNEL']]
# %%
# 
import sys
sys.path.insert(0, os.path.abspath('/home/tim/git/build_graph/graph_builder/'))
# sys.path.append()

#%%
from graph_builder.GModifier import GModifier, GbuilderMultiple
import graph_builder.Gbuilder as builder
import os
import json
import pandas as pd
import numpy as np
import pdb
import sys
import copy

# %%

#%%


import json
import pandas as pd
import numpy as np
import pdb
import sys
import copy
pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)

import os

cwd = '/home/user/git/datacad-primitives/es_primitives/src/build_graph/src'
os.chdir(cwd)

#%%
raw_primitives_path = "/home/user/git/datacad-primitives/es_primitives/es_demo/sr92"

node_templates_json = {}

for fname in os.listdir(raw_primitives_path):
    primitive_loc = os.path.join(raw_primitives_path, fname)
    config_loc = os.path.join(primitive_loc, "primitive.json")
    
    node = {}
    with open(config_loc) as fp:
        node = json.load(fp)
    # props = node['properties']    
    primitive_name = fname
    properties = node['properties']

    node_templates_json[primitive_name] = node




# %%
writeto = 'node_templates.json'

with open(writeto, 'w') as fp:
    json.dump(node_templates_json, fp, ensure_ascii=False, indent=4)

# %%

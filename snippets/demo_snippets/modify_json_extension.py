# %%
import codecs
import json
import os
import re
import shutil
import sys
from cmath import isnan

import jsonschema
import numpy as np
import pandas as pd

loc = "/home/user/git/datacad-primitives/well/"
os.chdir(loc)

# %%
# fname = '/home/user/git/datacad-primitives/well/raw_primitives/demo/primitive.json'
# template_json_file = open(os.path.join(fname,'template.json'))

fname = "/home/user/git/datacad-primitives/well/src/saves/whatIf_AS_0.json"
fd = open(fname)
fdjson = json.load(fd)
nodes = fdjson['graph']['nodes']
# %%
# "extensionName": "ExtensionOilPrimitives",
for ni in nodes:
    ni['extensionName'] = "ExtensionOilPrimitives"
nodes[0]
# %%

with codecs.open(fname + "mod.json", 'w', encoding='utf-8') as outfdjson:
    json.dump(fdjson, outfdjson, ensure_ascii=False)
# %%

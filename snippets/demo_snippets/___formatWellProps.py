# %%
from cmath import isnan
import json
import jsonschema

import os
import sys

import numpy as np
import pandas as pd
import re

import codecs
import json
import shutil

# %%

loc = '/home/user/git/datacad-primitives/well/json'
os.chdir(loc)


def clear_values(props: dict):
    for key, value in props.items():
        value['value'] = ""


def list_values(props: dict):
    for key, value in props.items():
        print(key, value['expression'])


def clr_expression_by_list(props, to_clr):
    pass


def export_props(fname):
    template_json_file = open(fname)
    tfile = json.load(template_json_file)
    print(fname, tfile['properties'])


# %%
fname = os.path.join(loc, 'oil_well2.json')
# export_props(fname)
template_json_file = open(fname)
tfile = json.load(template_json_file)
props = tfile['properties']
# clear_values(props)
# print(fname, props)

# %%
df = pd.DataFrame.from_dict(props, orient='index')
# df['compname'] = "well"
df['value'] = ""

df.head()

# %%
# static_props = ["T","query_res","Name","node_name","node_id","X","Y","Kind","Value","VolumeWater","perforation","pumpDepth","model","frequency","productivity","shtr_debit","K_pump","IsSource"]
df['expression'] = ""
df.to_csv('out/oil_well.csv')

# %%
def format_props(fname):
    template_json_file = open(fname)
    tfile = json.load(template_json_file)
    props = tfile['properties']
    df = pd.DataFrame.from_dict(props, orient='index')
    df['value'] = ""
    df['expression'] = ""
    return df

#%%
prims = ["oil_dns", "oil_well", "oil_pipe", "oil_junction_point", "oil_pad"]

for fname in prims:
    df = format_props(fname + ".json")
    df.to_csv('out/' + fname + ".csv")

# %%

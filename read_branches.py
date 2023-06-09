#%%
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

data_loc = 'data/branches'
braches_graph_csv = 'ipr_regime_stable_branches.csv'


fname = os.path.join(data_loc, braches_graph_csv)
df = pd.read_csv(fname)
df.drop(columns=df.columns[1], inplace=True)
df.columns
# braches_df.head()
# braches_df.columns == ['Номера узлов', 'Unnamed: 1', 'Имя узла начала', 'Имя узла конца',
#        'Обозначение', 'В Н', 'Вид', 'B К', 'Uном(н) кВ', 'Pв(н) кВт',
#        'Qв(н) квар', 'Pв(к) кВт', 'Qв(к) квар', 'dP кВт', 'dQ квар', 'dP %',
#        'Pп кВт', 'Qп квар', 'Iв(н) А', 'Iв(к) А', 'Iдоп А', 'Кз', 'Период №',
#        'Состояние']
# %%
lines = copy.deepcopy(df.loc[df['Вид'] == "Линия"])
sw = copy.deepcopy(df.loc[df['Вид'] == "Выключатель"])
gen = copy.deepcopy(df.loc[df['Вид'] == "Источник ЭДС"])
trans = copy.deepcopy(df.loc[df['Вид'] == "Трансформатор"])

# %%

base_cols = ['Номера узлов', 'Имя узла начала', 'Имя узла конца', 'Обозначение']
lines[base_cols].head(20)

#%%
lines['Обозначение'].fillna('', inplace=True)
# %%
lines[base_cols].head(20)

# %%

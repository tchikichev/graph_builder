#%%
import pandas as pd
import json
import copy

data_loc = './mapping.json'

# links = {}
# with open(data_loc) as fp:
#     links = json.load(fp)
# links
#%%
# df = pd.read_json(data_loc, orient='index')
# df = pd.read_json(data_loc, orient='records')
# %%
df = pd.read_json(data_loc, orient='index')
# df.head()

# df.drop(columns=['description'], inplace=True)
df.sort_values(by='Name', inplace=True)
df.to_csv('mapping.csv', index=False)
# %%
df = pd.read_csv('data/ecn_to_ktpn_full2.csv')
s9 = df.loc[
    (df['Подразделение'] == 'с/р №9') |
    (df['Подразделение'] == 'с/р №10')
]

eu = copy.deepcopy(s9)
# eu = eu.loc[eu['ЭЦН, ШГН']== 'ЭЦН']
eu['eu_primitiveName'].fillna("eeRu")
eu = eu.groupby(["Электроустановка"]).first().reset_index()
# %%

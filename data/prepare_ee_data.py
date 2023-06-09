# %%
import re
import json
# from typing import Literal
import pandas as pd
import os

cwd = os.path.dirname(os.path.abspath(__file__))
os.chdir(cwd)

# data = pd.read_excel("/home/user/git/datacad-primitives/es_primitives/src/build_graph/Выгрузка от 09.03.23 (copy).xlsx"
#                      ,skiprows=list(range(6)), header=1)
# data.head()

# # %%
# data.drop(columns=['Unnamed: 0'], inplace=True)
# # %%

# # %%
# data.head()
# # %%
data_name = "Выгрузка formatted.csv"
# data.to_csv(data_name, index=False)
# %%
data = pd.read_csv(data_name)
data.head()
# %%

# ecn = data.loc[data['ЭЦН, ШГН'] == 'ЭЦН']
# # take unique
# ecn = ecn.groupby(['Потребитель']).first().reset_index()
# # %%
# # selected cols
# base_cols = ['Подразделение', 'Электроустановка',
#              'СШ, №яч.', 'Дисп. наименование КТП(Н)', 'Потребитель']
# ecn.head()[base_cols]
# %%
# from regex101.com/

regs = {
    "Подразделение": {
        "department_num": r'с/р №(?P<num>\d+)'
    },
    "Электроустановка": {
        # "station, trans": r'ПС 35/6 кВ (?P<station>[\D]+)[ ,]? ТР-р 35/6 кВ №(?P<trans_num>[\d]+)',
        # "eu_type": r'(?P<type>ПС 35/6 кВ|РУ 6 кВ|ЗРУ 6 кВ|КРУ 6кВ|КРУН 6 кВ) (?P<station>[\S ]*)',
        # "eu_type": r'(?P<type>ПС 35/6 кВ|РУ 6 кВ|ЗРУ 6 кВ|КРУ 6кВ|КРУН 6 кВ) (?P<station>[\w\d\-\"]+)[,\S ]*',
        # "pad_num_eu": r'[\S ]*Куст-(?P<kp>Куст-\d{1,5})[\S ]*'
        # "35/6 кВ | 6 кВ": r'(?P<type>:|ПС|КРУН|КРУ|ЗРУ|РУ) (?P<nom>[\d/]+) (?P<station>[\w\d\-\"]+)[,\S ]*'
        # "35/6 кВ | 6 кВ": r'(?P<type>:|ПС|КРУН|КРУ|ЗРУ|РУ) (?P<nom>[\d/]+ кВ) (?P<station>[\w\d\- \".]+)\"*[,\S ]*',
        'trans_full': r'(?P<type>:|ПС|КРУН|КРУ|ЗРУ|РУ)[ -]*(?P<nom>[\d/]+)[ ]*кВ (?P<station>[\w\d\- \".№]+)\"*([,\W ]*(?P<trans>(Тр-р|ТР-р) (?P<tr_kv>[\d/]+ кВ) (?P<tr_num>№[ ]*\d+))|)[,\S ]*'
    },
    "СШ, №яч.": {
        "section,pad": r'(?P<name>СШ 6 кВ №[\d]+) яч.(?P<tap_num>[\d]+)',
        "section": r'(?P<name>СШ 6 кВ №[\d]+)'
    },
    "Дисп. наименование КТП(Н)": {
        # "pad_num": r'КП-|K-(?P<kp>\d{1,5})',
        "pad_num": r'(?:КП|К)-(?P<pad_num>[\d]{1,5})',
        "ktpn_num": r'[\S ]*№(?P<num>\d+)',
        "ktpn_object_type": r'(?P<object_type>:|КТПН|БКТП|КТП)'
    },
    "№ авт. (тип)": {
        "num,type": r'(?P<avt_num>[\d]+)\((?P<avt_model>[\d\D]+)\)'
    }
}

props_mapping = {  # {node.tag.properties.{name}: df_col_name}::
    "Подразделение": { # not used
        "Подразделение": "Подразделение",
    },
    "Электроустановка": {
        "description": "Электроустановка"
    },
    "residual_template": {
        'name': "out_name",
        'object_type': "out_type",
        # 'parent_name': ""
    },
    "СШ": {
        "description": "СШ, №яч.",
        'name': 'section_name'
    },
    "яч": {
        "description": "СШ, №яч."
    },
    "КТП(Н)": {
        "description": "Дисп. наименование КТП(Н)",
        "name": "Дисп. наименование КТП(Н)",
        "S, кВА": "S, кВА",
        "I ном., А": "I ном., А",
        "№ авт. (тип)": "№ авт. (тип)",
        "I ном.авт., А": "I ном.авт., А",
        "Тип блока защит АВ-0,4кВ": "Тип блока защит АВ-0,4кВ",
        "Прогрузка АВ-0,4кВ": "Прогрузка АВ-0,4кВ",
        "Уставка МТЗ": "Уставка МТЗ",
        "Уставка МТО": "Уставка МТО",
        "Диап. рег. уст. МТЗ": "Диап. рег. уст. МТЗ",
        "Диап. рег. уст. МТО": "Диап. рег. уст. МТО",
        "zagruzka": "Загр. КТПН, %",
        "U_fact_V": "U факт. КТПН, В",
        "Рем. № КТПН": "Рем. № КТПН"
    },
    "Потребитель": {
        "name": "Потребитель",
        "type": "ЭЦН, ШГН",
        "power_kW": "Р факт., кВт",
        "state": "Состояние",
        "current_A": "I факт., А",
        "ПБВ Кол-во": "ПБВ Кол-во",
        "ПБВ Полож.": "ПБВ Полож.",
        "Дата замера": "Дата замера",
        "U на СУ, В": "U на СУ, В",
        "Селективность действия защит": "Селективность действия защит",
        "Qliq_m3ps": "Qжидк., куб.м./с",
        "Qn_t": "Qн., тонн",
        "Время АПВ, мин.": "Время АПВ, мин."
    }
}

with open('ee_props_mapping.json', mode='r') as fp:
    props_map_json = json.load(fp)

props_map_json['schema_default'] = props_mapping
props_map_json['df_parse_regexes'] = regs

with open('ee_props_mapping.json', mode='w') as fp:
    json.dump(props_map_json, fp, indent=4, ensure_ascii=False, sort_keys=True)


incomplete_props = [
    "Name",
    "aliasName",
    "length",
    "node_name",
    "zagruzka",
    "current",
    "kV",
    "normallylnService",
    "model", # not used ....
    "object_type", # already set, check which object types are there
    "power"
    "kV_in", # for computation ???
    "kV_out", # for computation ???
    "model_kWh"  # sum of child
    "measured_kWh",  # from index
]
# %%

def add_from_df(df, col, reg_name,
        df_prefix="", regex_extr_cols=None):
    # take
    reg = regs[col][reg_name]
    extr = df[col].str.extract(reg)

    if regex_extr_cols is None:
        regex_extr_cols = list(extr.columns)
    # rename
    ecols_mod = ['_'.join([df_prefix, _col]) for _col in regex_extr_cols]
    # add to map
    
    # df[ecols_mod] = extr[regex_extr_cols]

    # df = df.join(pd.DataFrame(
    #     dict(zip(ecols_mod, regex_extr_cols)), index=df.index
    # ))

    df = df.join(pd.DataFrame(
        extr[regex_extr_cols], 
        index=df.index, 
        columns=ecols_mod
    ))

    cols_map = dict(zip(regex_extr_cols, ecols_mod))
    print(cols_map)
    return df, cols_map


#%%
col = 'Электроустановка'
extr_cols = ['type', 'nom', 'station', 'trans', 'tr_kv', 'tr_num']
data, cols_map = add_from_df(
    data, col, "trans_full", 'eu', extr_cols)

data['eu_object_type'] = ""
data['eu_primitiveName'] = 'eeRu'
qtypes = {
    'РУ 6 кВ': 'eeRu',
    'ПС 35/6 кВ': 'eeSubstation',
    'ЗРУ 6 кВ': 'eeZru',
    'КРУН 6 кВ': 'eeKrun',
    'КРУ 6кВ': 'eeKru'
}

# set primitiveName == icon
for qt, nodet in qtypes.items():
    data.loc[data['Электроустановка'].str.contains(qt), [
        'eu_object_type']] = qt
    data.loc[data['Электроустановка'].str.contains(
        qt), ['eu_primitiveName']] = nodet

cols_map.update({
    'object_type': 'eu_object_type',
    'primitiveName': 'eu_primitiveName'
})
props_mapping[col].update(cols_map)

#%%
data, cols_map = add_from_df(data, 'Подразделение', "department_num", 'dept')
props_mapping['Электроустановка'].update(cols_map)

# %%

# sections

# sections = copy.deepcopy(df)

def add_index_col(df, index_cols):
    return df[index_cols].astype(str).apply(lambda x: ' '.join(x), axis=1)

data, cols_map = add_from_df(data, 'СШ, №яч.', "section", 'section')

col = 'section_struuid'
data[col] = add_index_col(data, ['Подразделение', 'Электроустановка', 'section_name'])
cols_map.update({'node_id': col})
props_mapping['СШ'].update(cols_map)

#%%
data,cols_map = add_from_df(data, 'СШ, №яч.', "section,pad", 'section_tap')

col = 'section_tap_struuid'
data[col] = add_index_col(data, ['Подразделение', 'Электроустановка', 'СШ, №яч.'])
cols_map.update({'node_id': col})

props_mapping['яч'].update(cols_map)

# %%
col = "Дисп. наименование КТП(Н)"
add_to = 'КТП(Н)'

data['ktpn_primitiveName'] = 'eeKTPN'

ktpn_index_col = 'ktpn_struuid'
data[ktpn_index_col] = add_index_col(data, ['section_struuid', 'Дисп. наименование КТП(Н)'])
props_mapping[add_to].update({
    'node_id': ktpn_index_col,
    "primitiveName": "ktpn_primitiveName"
    })

for reg_name in ['pad_num', 'ktpn_num', 'ktpn_object_type']:
    data,cols_map = add_from_df(data, col, reg_name, 'ktpn')
    props_mapping[add_to].update(cols_map)

match = 'ktpn_object_type'
data.groupby(match)[match].count()

#%%

data,cols_map = add_from_df(data, "№ авт. (тип)", "num,type", 'ktpn')
# add to ktpn node !!
props_mapping['КТП(Н)'].update(cols_map)


# %%

col = "Потребитель"
data['well_format_name'] = data[col].str.replace(r'(скв|Скв|)[\"\.\- ]+', '', regex=True)

data["well_primitiveName"] = 'oil_well'
data['well_object_type'] = 'oil_well_ecn'

index_col = 'well_struuid'
data[index_col] = add_index_col(data, [ktpn_index_col, 'Потребитель'])

props_mapping[col].update({
    'name': 'well_format_name',
    "pad_num": "pad_num",
    'object_type': "well_object_type",
    "primitiveName": 'well_primitiveName',
    'node_id': index_col
})

#%%




# eu910.csv >> ps
data.to_csv("ecn_to_ktpn_full3.csv", index=False)
# %%
# ecn9eu = eu_all.loc[
#     (eu_all['Подразделение']== 'с/р №9') |
#     (eu_all['Подразделение']== 'с/р №10')
#     ]
# # ecn9.groupby(['Электроустановка']).first().reset_index()[['Подразделение', 'Электроустановка']]
# # ecn9eu.head()
# ecn9eu.to_csv("ecn9eu.csv", index=False)





# %%


def get_pads_info(data):
    ecn9 = data.loc[(
        (data['department_num'] == '9') |
        (data['department_num'] == '10'))
    ]
    mech = ecn9.dropna(subset=['pad_num'], axis=0)
    mech['well_num'] = mech['Потребитель'].str.replace(
        '\"|скв.', '', regex=True)
    mech[['eu_node_name', 'pad_num', 'well_num', 'Потребитель']].to_csv(
        '__test_well__num.csv')
    # table

    # ,department_num,eu_node_name,pad_num
    # 0,10,"""Абазаров""",1
    # 1,10,"""Абазаров""",14
    # 2,10,"""Абазаров""",15
    # 3,10,"""Абазаров""",2
    # 4,10,"""Абазаров""",23
    # 5,10,"""Кузьмин""",230
    # 6,10,"""Абазаров""",25
    # 7,10,"""Абазаров""",29
    # 8,10,"""Абазаров""",3
    # 9,10,"""Кузьмин""",37
    # 10,10,"""Кузьмин""",40
    # 11,10,"""Кузьмин""",43
    # 12,10,"""Кузьмин""",44
    # 13,10,"""Кузьмин""",45
    # 14,10,"""Абазаров""",64
    # 15,10,"""Кузьмин""",71
    # 16,10,"""Абазаров""",95
    cols = ['department_num', 'eu_node_name', 'pad_num', 'well_num']
    groups = mech.groupby(cols).first().reset_index()

    sel = groups
    # sel = groups.loc[
    #     (groups['eu_node_name'].str.contains('Абазаров')) |
    #     (groups['eu_node_name'].str.contains('Кузьмин'))
    # ]

    sel[cols].to_csv('__test_well_num_sel.csv')

    cols2 = ['department_num', 'eu_node_name', 'pad_num']

    sel_pads = sel.groupby('pad_num').first().reset_index()

    pd.DataFrame.sort_values(sel_pads, cols2)
    sel_pads[cols2].to_csv('__test_well_num_sel2.csv')
# %%



# well_df['well_object_type'] = 'oil_well_ecn'
# well_index_col

props_map_json = {}


with open('ee_props_mapping.json', mode='r') as fp:
    props_map_json = json.load(fp)

props_map_json['schema_ext'] = props_mapping

with open('ee_props_mapping.json', mode='w') as fp:
    json.dump(props_map_json, fp, indent=4, ensure_ascii=False, sort_keys=True)

#%%
r = json.dumps(props_mapping)
loaded_r = json.loads(r)
loaded_r

# %%
# oil_pads = []

oil_pad_nodes = [
        {
            "id": "oil_pad_4064",
            "name": "88",
            "node_id": 1750037786
        },
        {
            "id": "oil_pad_4068",
            "name": "43",
            "node_id": 1750040926
        },
        {
            "id": "oil_pad_4062",
            "name": "55",
            "node_id": 1750037686
        },
        {
            "id": "oil_pad_4065",
            "name": "96",
            "node_id": 1750048619
        },
        {
            "id": "oil_pad_4067",
            "name": "45",
            "node_id": 1750026636
        },
        {
            "id": "oil_pad_4066",
            "name": "230",
            "node_id": 1751067763
        },
        {
            "id": "oil_pad_4069",
            "name": "37",
            "node_id": 1750023893
        },
        {
            "id": "oil_pad_4071",
            "name": "40б",
            "node_id": 1750048880
        },
        {
            "id": "oil_pad_4070",
            "name": "71",
            "node_id": 1750028316
        },
        {
            "id": "oil_pad_4063",
            "name": "40",
            "node_id": 1750024074
        },
        {
            "id": "oil_pad_4072",
            "name": "44",
            "node_id": 1751054627
        }
    ]

names = [pad_obj['name'] for pad_obj in oil_pad_nodes]

query = ' or '.join(['__pad_num="{}"'.format(pad_num) for pad_num in names])

query
# %%
import json

loc = 'parent_tree_cut4_mod.json'
with open(loc, mode='r') as fp:
    graph_json = json.load(fp)

nodes = graph_json['graph']['nodes']
nodes
# %%
for node in nodes:
    data = node['properties']

    col = 'Name'
    if col in data.keys():
        data['name'] = data.pop(col)

    node['properties'] = data
    node["nodeTitle"] = "$this.props.name$"


# %%
graph_json['graph']['nodes'] = nodes
# %%
loc = 'parent_tree_cut4_wmod.json'
with open(loc, mode='w') as fp:
    json.dump(graph_json, fp, ensure_ascii=False, indent=4)
# %%
import pandas as pd
data = pd.read_csv("ecn_to_ktpn_full3.csv", index_col=False)
data.columns
# %%
sel_cols =['Подразделение', 'Электроустановка', 'СШ, №яч.',
       'Дисп. наименование КТП(Н)','eu_nom', 'eu_station',
       'eu_trans', 'eu_tr_kv', 'eu_tr_num', 'eu_object_type',
       'section_name', 'section_tap_name', 'section_tap_tap_num', 
       'ktpn_primitiveName', 'ktpn_struuid', 'ktpn_pad_num', 'ktpn_num',
       'well_format_name']

sel = data[sel_cols]
sel.head()
# %%

sr9 = sel.loc[
    (sel['Подразделение'] == 'с/р №10') |
    (sel['Подразделение'] == 'с/р №9')
]
sr9 = sr9.groupby(['Электроустановка', 'СШ, №яч.',
       'Дисп. наименование КТП(Н)']).first().reset_index()
# sel.set_index('ktpn_struuid')
# sel['с/р №9']
sr9
# %%
eu = sr9.groupby(['Электроустановка', 'СШ, №яч.']).first().reset_index()
eusel = eu[['Подразделение', 'Электроустановка', 'СШ, №яч.',
    'eu_nom', 'eu_station',
    'eu_trans', 'eu_tr_kv', 'eu_tr_num', 'eu_object_type',
    'section_name', 'section_tap_name', 'section_tap_tap_num'
    ]]
eusel

# %%
eu2 = sr9.groupby(['Электроустановка']).first().reset_index()
eusel2 = eu2[['Электроустановка', 'eu_object_type'
    ]]
eusel2

#%%
col = 'Электроустановка'
reg = r'(?P<type>:|ПС|КРУН|КРУ|ЗРУ|РУ)[ -]*(?P<nom>[\d/]+)[ ]*кВ (?P<station>[\w\d\- \".№]+)\"*([,\W ]*(?P<trans>(Тр-р|ТР-р) (?P<tr_kv>[\d/]+ кВ) (?P<tr_num>№[ ]*\d+))|)[,\S ]*'

extr_cols = ['type', 'nom', 'station', 'trans', 'tr_kv', 'tr_num']
extr = eusel2[col].str.extract(reg)[extr_cols]
extr['Электроустановка'] = eusel2['Электроустановка']
extr['Электроустановка'] = eusel2['Электроустановка']

extr = extr.fillna("")
extr['strid'] = extr[['type', 'nom', 'station']].astype(str).apply(lambda x: ' '.join(x), axis=1)

extr = extr.set_index(['strid', 'tr_num'])

# %%
eu = extr
eu.to_csv('edit_eu_top.csv')
# %%
eu.to_json('edit_eu_top.json', force_ascii=False, orient='table', indent=4)
# %%

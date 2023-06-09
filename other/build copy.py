#%%
import json
import pandas as pd


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
# Index(['Подразделение', 'Электроустановка', 'СШ, №яч.',
#        'Дисп. наименование КТП(Н)', 'S, кВА', 'I ном., А', '№ авт. (тип)',
#        'I ном.авт., А', 'Тип блока защит АВ-0,4кВ', 'Прогрузка АВ-0,4кВ',
#        'Уставка МТЗ', 'Уставка МТО', 'Диап. рег. уст. МТЗ',
#        'Диап. рег. уст. МТО', 'Потребитель', 'ЭЦН, ШГН', 'Р факт., кВт',
#        'Состояние', 'I факт., А', 'Загр. КТПН, %', 'U факт. КТПН, В',
#        'ПБВ Кол-во', 'ПБВ Полож.', 'Дата замера', 'U на СУ, В',
#        'Селективность действия защит', 'Qжидк., куб.м./с', 'Qн., тонн',
#        'Время АПВ, мин.', 'Рем. № КТПН'],
#       dtype='object')

ecn = data.loc[data['ЭЦН, ШГН']== 'ЭЦН']
# take unique
ecn = ecn.groupby(['Потребитель']).first().reset_index()
# %%
# selected cols
base_cols = ['Подразделение', 'Электроустановка', 'СШ, №яч.','Дисп. наименование КТП(Н)','Потребитель']
ecn.head()[base_cols]
# %%
# build tree from data

# node, node_type, node_id === node_name ??

## edges + line + edge ??

## pads

## wells

# sr9 === 
ecn9 = data.loc[
    (data['Подразделение']== 'с/р №9') | 
    (data['Подразделение']== 'с/р №10')
    ]
# all 
ecn9.to_csv("ecn9.csv", index=False)


ecn9eu = ecn9.groupby(['Электроустановка']).first().reset_index()[['Подразделение', 'Электроустановка']]
ecn9eu.head()

# %%
eu_all = data.groupby(['Электроустановка']).first().reset_index()[['Подразделение', 'Электроустановка']]
eu_all['Подразделение_num'] = eu_all['Подразделение'].str.extract('(\d+)')

eu_all.sort_values(by=['Подразделение_num'], inplace=True)
# eu_all.drop(columns=['Подразделение_num'], inplace=True)

eu_all.to_csv("eu.csv", index=False)

# base
ecn9[base_cols].to_csv("ecn9_base.csv", index=False)
# to ktpn
to_ktpn_cols = ['Подразделение', 'Электроустановка', 'СШ, №яч.','Дисп. наименование КТП(Н)']
to_ktpn_unique = ecn9.groupby(to_ktpn_cols).first().reset_index()

to_ktpn_unique['object_type'] = to_ktpn_unique['Дисп. наименование КТП(Н)']
to_ktpn_unique['primitiveName'] = 'eeKTPN'

qtypes = {
    'КТП': 'eeOut',
    'КТПН': 'eeOut',
    'БКТП': 'eeOut' 
    }
for qt, nodet in qtypes.items():
    lines = to_ktpn_unique.loc[to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains(qt),['object_type']] = qt
    # lines = to_ktpn_unique.loc[to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains(qt),['primitiveName']] = nodet

# "К-" + "КТПН 6/0,4 кВ №1 К-94 бис".split('К-')[-1]
# "КП-" + "КТПН 6/0,4 кВ №1 К-94 бис".split('К-')[-1]

#%%
# pad num
lines = to_ktpn_unique.loc[
    (to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('КТПН')
    & to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('К-') ) |
     (to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('КТПН')
    & to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('КП-') ) ,
    'Дисп. наименование КТП(Н)']
## skip first num after № if КТПН
# words = "КТПН 6/0,4 кВ №1 К-94 бис".split('№')[-1].split(' ')[1:]
# ''.join(words)
to_ktpn_unique.loc[to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('КТПН'),'padNum'] = lines.apply(lambda x: ''.join(x.split('№')[-1].split(' ')[1:]))
# lines = to_ktpn_unique.loc[to_ktpn_unique['Дисп. наименование КТП(Н)'].str.contains('КТПН'),'padNum'] = lines.apply(lambda x: ''.join(x.split('№')[-1].split(' ')[1:]))
# lines = eu_all.loc[eu_all['Электроустановка'].str.contains(qt),'Электроустановка']
# eu_all.loc[to_ktpn_unique['Электроустановка'].str.contains(qt),'node_name'] = lines.apply(lambda name: extract_name(qt, name))
def extract_name(x):
    ktpn = x.lstrip().split(' ')[0]
    num = x.split('№')[-1].split(' ')[0]
    return ' '.join([ktpn,num])

to_ktpn_unique['node_name'] = lines.apply(lambda x: extract_name(x))
# fill Nan names
emptyNameLines = to_ktpn_unique.loc[pd.isnull(to_ktpn_unique['node_name'])]
to_ktpn_unique.loc[pd.isnull(to_ktpn_unique['node_name']),'node_name'] = emptyNameLines['Дисп. наименование КТП(Н)']
# lines
#%%

to_ktpn_cols.extend(['padNum','object_type','primitiveName', 'node_name'])
# ['Подразделение', 'Электроустановка', 'СШ, №яч.','Дисп. наименование КТП(Н)','object_type']
to_ktpn_unique[to_ktpn_cols].to_csv("ecn9_to_ktpn.csv", index=False)
# to_ktpn9 = to_ktpn_unique.loc[to_ktpn_unique['Подразделение']== 'с/р №9']
# to_ktpn9[to_ktpn_cols].to_csv("ecn9.csv", index=False)
# in:: с/р №9,КРУН 6 кВ ДНС-2 >> 
# >> ktpn:: СШ 6 кВ №1 яч.14,"КТПН 6/0,4кВ 630кВА №2 К-35",КТПН,eeOut

# %%
# eu910.csv >> ps
eu_all['type'] = ""
eu_all['primitiveName'] = ""
#%%
# qtype = 'РУ 6 кВ'
# qlines = eu_all.loc[eu_all['Электроустановка'].str.contains(qtype)] = qtype
# # qlines['type'] = qtype
# #%%
# qtype = 'ПС 35/6 кВ'
# qlines = eu_all.loc[eu_all['Электроустановка'].str.contains(qtype)] = qtype
# # qlines['type'] = qtype

qtypes = {
    'РУ 6 кВ': 'eeRu',
    'ПС 35/6 кВ': 'eeSubstation',
    'ЗРУ 6 кВ': 'eeZru',
    'КРУН 6 кВ': 'eeKrun',
    'КРУ 6кВ': 'eeKru'
    }

def extract_name(qt, x):
    name = ''.join(
        x.split(',')[0].split(qt + ' ')[1:])
    return name.replace('"', '')

# pr_types = ['РУ 6 кВ', 'ПС 35/6 кВ', 'ЗРУ 6 кВ', 'КРУН 6 кВ']
for qt, nodet in qtypes.items():
    lines = eu_all.loc[eu_all['Электроустановка'].str.contains(qt),['type']] = qt
    lines = eu_all.loc[eu_all['Электроустановка'].str.contains(qt),['primitiveName']] = nodet
    # lines['type'] = qt
    # lines['primitiveName'] = nodet
    lines = eu_all.loc[eu_all['Электроустановка'].str.contains(qt),'Электроустановка']
    eu_all.loc[eu_all['Электроустановка'].str.contains(qt),'node_name'] = lines.apply(lambda name: extract_name(qt, name))

# qt = 'ПС 35/6 кВ'

eu_all.to_csv("eu2.csv", index=False)
#%%
ecn9eu = eu_all.loc[
    (eu_all['Подразделение']== 'с/р №9') | 
    (eu_all['Подразделение']== 'с/р №10')
    ]
# ecn9.groupby(['Электроустановка']).first().reset_index()[['Подразделение', 'Электроустановка']]
# ecn9eu.head()
ecn9eu.to_csv("ecn9eu.csv", index=False)

# %%
# add eu nodes 9 10 to graph
# object_type = type,
# primitiveName,
# node_name


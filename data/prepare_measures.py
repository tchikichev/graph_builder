#%%
import json
import pandas as pd

loc = '/home/tim/git/build_graph/data/Копия Снятие показаний тайлаки2022.xls'

#%%

data = pd.read_excel(loc,skiprows=list(range(3)), header=1)
data.drop(columns=['Unnamed: 0'], inplace=True)
data.columns

# %%
data_name = "Выгрузка formatted.csv"
# data.to_csv(data_name, index=False)

#%%

data.head()
# name_col = data
# %%
data.iloc[2]
# %%
import re

names = dict(zip(data.columns, data.columns))

for k, v in names.items():
    name_col = re.sub(' +', ' ', v)
    names[k] = str.rstrip(name_col)

names

#%%

# data.rename(names, inplace=True)
data = data.rename(columns = names)
list(data.columns)
#%%
data.head()
# %%
data = data.drop(axis=0, index=[0,2])
data.dropna(subset=['Наименование потребителя'], inplace=True)
# %%
data
data.to_csv('format_ktpn_measures_tree.csv', index=False, sep=';')

# %%
data.columns
# %%
names_map = {'№ п/п': 'num',
 'Наименование потребителя': 'user_name',
 'Наименование ПС 110/35/6 кВ': '110/35/6_substation_name',
 'Наим-ие ВЛ-35 кВ': '35Kv_line_name',
 'Наименование ПС35/6, РУ-6 кВ': 'ps_name',
 'Наименование ВЛ-6 кВ': '6Kv_line_name',
 'Наименование КТПН': 'ktpn_name',
 'СР': 'department',
 'Номер счетчика': 'device_num',
 '№ ТТ': '№ ТТ',
 'кТ': 'кТ',
 'Номер SIM-КАРТЫ': 'Номер SIM-КАРТЫ',
 'Дата наладки ууээ/ дата подключения потребителя': 'Дата наладки ууээ/ дата подключения потребителя',
 'Показания на начало месяца, кВт*ч': 'Показания на начало месяца, кВт*ч',
 'Показания на конец месяца, кВт*ч': 'Показания на конец месяца, кВт*ч',
 'Расход, кВт*ч': 'Расход, кВт*ч',
 'Реквизиты акта приемки ПУ': 'Реквизиты акта приемки ПУ',
 'Примечание': 'Примечание'}

data = data.rename(columns = names_map)
data.to_csv('format_ktpn_measures_tree2.csv', index=False, sep=';')

# %%
list(data.columns)[:9]
# ['num',
#  'user_name',
#  '110/35/6_substation_name',
#  '35Kv_line_name',
#  'ps_name',
#  '6Kv_line_name',
#  'ktpn_name',
#  'department',
#  'device_num']
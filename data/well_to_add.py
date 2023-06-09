#%%
import pandas as pd


loc = 'wells_to_add4.csv'

df = pd.read_csv(loc, index_col=False)
df = df[['__pad_num', '__well_num', 'node_id']]
df.head()
# %%
col = '__pad_num'
pads = df.groupby(col).first().reset_index()
list(pads['__pad_num'])

#%%
wells = df.set_index('__well_num')
wells
# %%
wells['line_type'] = 'emptyLine'
wells['source_type'] = 'pad'

#%%
pads = pads.set_index('__pad_num')

to_ktpn = {}
for pad in list(pads.index): 
    to_ktpn[pad] = []
to_ktpn
# %%
[

'230'
"Кузьмин", '37'
"Кузьмин", '40'
"Кузьмин", '40б'
"Кузьмин", '43'
"Кузьмин", '44'
"Кузьмин", '45'
"Кузьмин", '55'
"Кузьмин", '71'
"Кузьмин", '88'
'96'

]

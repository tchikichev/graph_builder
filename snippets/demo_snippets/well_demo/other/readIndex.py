# %%
import numpy as np
import pandas as pd

df = pd.read_csv("otlFull.csv")
df.head()

# %%
df['__well_num']

# %%
nums = df['__well_num'].to_numpy()
nums

# %%
emptyWells = [
    {
        "node_well_num": "7",
        "node_name": "\"к.4__скв.7\""
    },
    {
        "node_well_num": "30",
        "node_name": "\"к.12__скв.30\""
    },
    {
        "node_well_num": "427",
        "node_name": "\"к.16__скв.427\""
    },
    {
        "node_well_num": "657",
        "node_name": "\"к.27__скв.657\""
    },
    {
        "node_well_num": "632",
        "node_name": "\"к.22__скв.632\""
    },
    {
        "node_well_num": "528",
        "node_name": "\"к.27__скв.528\""
    },
    {
        "node_well_num": "647",
        "node_name": "\"к.29__скв.647\""
    },
    {
        "node_well_num": "429",
        "node_name": "\"к.38__скв.429\""
    },
    {
        "node_well_num": "651",
        "node_name": "\"к.27__скв.651\""
    },
    {
        "node_well_num": "57",
        "node_name": "\"к.3__скв.57\""
    },
    {
        "node_well_num": "659",
        "node_name": "\"к.27__скв.659\""
    },
    {
        "node_well_num": "425",
        "node_name": "\"к.16__скв.425\""
    },
    {
        "node_well_num": "426",
        "node_name": "\"к.38__скв.426\""
    },
    {
        "node_well_num": "554",
        "node_name": "\"к.22__скв.554\""
    },
    {
        "node_well_num": "3825",
        "node_name": "\"к.64__скв.3825\""
    },
    {
        "node_well_num": "2",
        "node_name": "\"к.1__скв.2в\""
    }
]

[wi["node_well_num"] for wi in emptyWells]
# %%
emptyWellNums = ['7',
 '30',
 '427',
 '657',
 '632',
 '528',
 '647',
 '429',
 '651',
 '57',
 '659',
 '425',
 '426',
 '554',
 '3825',
 '2в']

for wn in emptyWellNums:
    if wn in nums:
        # print(wn, " is in nums")
        pass
    else:
        print(wn, " is not in index")


# %%
wfd = pd.read_csv('injectionWellManual.csv')
wfd.head()
# %%
mapping = wfd[['pad', 'well','node_name']]
mapping
# %%
mapping.to_json('wellMapping.json', orient='records', force_ascii=False)
#  {‘split’, ‘records’, ‘index’, ‘columns’, ‘values’, ‘table’}.
# %%

# %%

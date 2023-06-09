let query_res_line = {
    "__pad_num": "1",
    "__well_num": "484",
    "ois_id": 1920048400,
    "avg_current": 31.83,
    "avg_voltage": 384.33,
    "adkuControlStationLoading": 89,
    "adkuControlStationFullPower": 110,
    "adkuControlStationActivePower": 90,
    "adkuControlStationPowerCoeff": 0.84
}

let well_props = {
    'Qliq_m3ps': 'Qжидк., куб.м./с',
    'Qn_t': 'Qн., тонн',
    'U на СУ, В': 'U на СУ, В',
    'current_A': 'I факт., А',
    'name': 'well_format_name',
    'node_id': 'well_struuid',
    'object_type': 'well_object_type',
    'pad_num': 'ktpn_pad_num',
    'power_kW': 'Р факт., кВт',
    'primitiveName': 'well_primitiveName',
    'state': 'Состояние',
    'type': 'ЭЦН, ШГН',
    'Время АПВ, мин.': 'Время АПВ, мин.',
    'Дата замера': 'Дата замера',
    'ПБВ Кол-во': 'ПБВ Кол-во',
    'ПБВ Полож.': 'ПБВ Полож.',
    'Селективность действия защит': 'Селективность действия защит'
};

let index_props_mapping = {
    'current_A': "avg_current",
    'U на СУ, В': "avg_voltage",
    'ois_id': "ois_id",
    'load_pc': "adkuControlStationLoading",
    'power_full_kW': "adkuControlStationFullPower",
    'power_active_kW': "adkuControlStationActivePower",
    'power_coef': "adkuControlStationPowerCoef",
}

// add new props

// upload graph

// massive fill props

// add props by mapping
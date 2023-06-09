



## ee_add_props.js 

добавить свойства примитивов аналогично CIM модели ЭС. 
При генерации графа нужные пустые своства создаются по умолчанию. Список свойств примитивов задается в https://github.com/tchikichev/graph_builder/blob/main/data/ee_props_mapping.json

## ee_page_rank.js 

пример применения алгоритма page_rank из библиотеки yfiles для графа электросети. 
результатты расчета не соответствуют ожидаемым, но происходит правильное исключение выключенных нод и разбиение графа на независимые участки. 

## ee_paths.js

часть применения алгоритма поиска источника питания дл потребителей

## ee_sources.js

полный алгоритм поиска источника

исключаем ывключенные выключатели. 

разбиваем граф на группы. 
поиск источников :: нода у которых нет родителей. если у каждой группы один источник (ограничение сейчас) -- определяем для группы источник как имя родителя.

если в группе несколько нод которые определили как источник - ошибка. невозможно определить тариф по которому будем считать экономику ....

## massive_props_update2.js

аналог кода https://github.com/ISGNeuroTeam/megion_custom_actions/blob/feature/datalake_update/console_scripts/massive_property_expression_update.js

## read_ee_graph.js
customActionTitle = "Read Electrical graph"

прочитать граф электроэнергетики 

по нажатию кнопки
let runEvalButtonId = "ButtonPanel_9";
со страницы::
let tabEeMonitoringID="wss-tab-2170";


readNodeProperties.js
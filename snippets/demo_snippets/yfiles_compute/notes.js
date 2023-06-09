let val = (this.kW / this.kV / 24).toFixed(1);


const this_node = graph.nodes.find(node => node.tag.primitiveID === primitiveID);
const props = this_node.tag.properties;

let save_to = "fs/component_fs/" + primitiveID + "/result_power";
let otl_query = `| makeresults count = 1 | eval comp = ${primitiveID} val = ${val} | fsput ${save_to}`;
console.log(otl_query);

props.dataToIndicator.expression.original_otl = otl_query;
props.dataToIndicator.status = "new";

val


суммарная энергия по схеме - планирование потребления

импортировать тарифы - оценить эффективность операций

какая информация нужна для расчета тарифа

значения по 30 мин интервалу, источник энергии



расчет режима сети + индикация
расчет узких мест

для нескольких режимов - показать режим

мощность умножить на тариф 
- попросить логику у экономистов
- актуально для оценки текущей сети для Курбана

сопоставление затрат, оценка мероприятий

даннные по прокачке - прокачка соответветствует плану - для заданных значений прокачки посчитать энергию - расходы, потери, дельты




операции - 

применение тарифа
выбор оборудования - мероприятия
оценка/индикация рисков
анализ правильности схемы - сравнить номиналы подключенных устройств




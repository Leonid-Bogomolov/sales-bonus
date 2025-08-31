/**
 * Функция для расчета выручки
 * @param purchase запись о покупке 
 * @param _product карточка товара 
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   const discount = 1 - (purchase.discount / 100)
   /// здесь purchase = items[i] = purchase_records[j].items[i]
   return revenue = purchase.sale_price * purchase.quantity * discount
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    let bonus
    if (index === 0) {
    return bonus = seller.profit * 15 / 100;
} else if (index === 1 || index === 2) {
    return bonus = seller.profit * 10 / 100;
} else if (index === total - 1) {
    return bonus = 0;
} else { // Для всех остальных
    return bonus = seller.profit * 5 / 100;
} 
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных

if (!data
    || !Array.isArray(data.sellers)
    || data.sellers.length === 0
) {
    throw new Error('Некорректные входные данные');
}
    // @TODO: Проверка наличия опций

const { calculateRevenue, calculateBonus } = options;
    
    try {  
        options;  
        console.log('options is defined')  
        if(typeof options === 'object') {
            console.log('options is object')
        }
        if(typeof calculateRevenue === "function") {
            console.log('calculateRevenue is function')
        } else {
            console.log('calculateRevenue is not function')
        }
        if(typeof calculateBonus === 'function') {
            console.log('calculateBonus is function')
        } else {
            console.log('calculateBonus is not function')
        }
    } catch(e) {  
        e; // => ReferenceError  
        console.log('options is not defined');  
    }

    // @TODO: Подготовка промежуточных данных для сбора статистики // Здесь посчитаем промежуточные данные и отсортируем продавцов

    const sellerStats = data.sellers.map(seller => ({     // (получаем массив объектов) статистика продавца по товару данного артикула для всех продавцов
	   id: `${seller.id}`,                                // id продавца
       name: `${seller.first_name} ${seller.last_name}`,  // ИиФ продавца
       revenue: 0,                                        // выручка продавца
       profit: 0,                                         // прибыль продавца
       sales_count: 0,                                    // продажи даного товара 
       products_sold: {}                                   // количество продаж товара данного артикула
       // sku: undefined,                                   // артикул товара
       // quantity: 0                                       // его количество
       //}
	}));
console.log('sellerStats:', ' ',sellerStats)

    // @TODO: Индексация продавцов и товаров для быстрого доступа

const sellerIndex = Object.fromEntries(sellerStats.map(item => [item.id, item]))     // данные по каждому продавцу для всех продавцов
const productIndex = Object.fromEntries(data.products.map(item => [item.sku, item])) // данные по каждому товару для всех товаров

console.log('sellerIndex:', ' ', sellerIndex)       // данные по каждому продавцу для всех продавцов          
console.log('productIndex:', ' ', productIndex)     // данные по каждому товару для всех товаров

    // @TODO: Расчет выручки и прибыли для каждого продавца // Вызовем функцию расчёта бонуса для каждого продавца в отсортированном массиве

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями // Сформируем и вернём отчёт
    
      data.purchase_records.forEach(record => {               // Внеший (первый) цикл, перебор по всем записям о покупках (всех чеков)
        const seller = sellerIndex[record.seller_id];   // чек конкретного продавца
         // Увеличить количество продаж 
        seller.sales_count += 1 
         // Увеличить общую сумму всех продаж
        seller.revenue += record.total_amount
         // Расчёт прибыли для каждого товара
        record.items.forEach(item => {                  // второй цикл, перебор в чеке по товарам в нём
            const product = productIndex[item.sku];     // здесь индекс (артикул) конкретного товара в чеке
            let cost = product.purchase_price * item.quantity; // общая себестоимость количества данного товара по чеку
             // выручка от товара с учётом скидки подсчитанная через функцию calculateRevenue (учтено ли количество ?)
            let revenue = options.calculateRevenue(item, product);  
            seller.profit += revenue - cost              // прибыль продавца от данного товара из чека
            if (!seller.products_sold[item.sku]) {      // если нет проданного товара, то 0
                seller.products_sold[item.sku] = 0;
            }
             //else {
                //seller.products_sold[item.quantity]++
                //seller.products_sold[item.sku] += item.quantity;
                seller.products_sold[item.sku] += item.quantity;
             //}
        });
        //console.log('seller.products_sold:', seller.products_sold)
         // Приводим к виду  [Array1(2), ..., ArrayN(2)]
         //seller.products_sold = Object.entries(seller.products_sold)
         seller.top_products = Object.entries(seller.products_sold).map(([a, b]) => ({
            sku: a,
            quantity: b
         }))
         console.log(seller.top_products)
 });

// Сортируем продавцов по прибыли
//sellerStats.toSorted((a, b) => { return b.profit - a.profit}); 
sellerStats.sort((a, b) => { return b.profit - a.profit}); 
console.log(sellerStats.sort((a, b) => { return b.profit - a.profit})); 

sellerStats.forEach((seller, index) => {
    seller.bonus = options.calculateBonus(index, sellerStats.length, seller) // Считаем бонус
     // Формируем топ-10 товаров:
    //seller.products_sold = Object.entries(seller.products_sold)
         seller.products_sold = Object.entries(seller.products_sold).map(([a, b]) => ({
            sku: a,
            quantity: b
         }))
    //seller.products_sold.toSorted((a,b) => {
    seller.products_sold.sort((a, b) => {
        return b.quantity - a.quantity
    });
    seller.top_products = seller.top_products.slice(0, 10)
     console.log(seller.top_products)
});

return sellerStats.map(seller => ({
    seller_id: seller.id,
    name: seller.name,
    revenue: +seller.revenue.toFixed(2),
    profit: +seller.profit.toFixed(2),
    sales_count: seller.sales_count,
    top_products: seller.top_products,
    bonus: +seller.bonus.toFixed(2)
}))
}
 console.log('sellerStats:', )

/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const discount = 1 - purchase.discount / 100;
  return (revenue = purchase.sale_price * purchase.quantity * discount);
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
  let bonus;
  if (index === 0) {
    return (bonus = (seller.profit * 15) / 100);
  } else if (index === 1 || index === 2) {
    return (bonus = (seller.profit * 10) / 100);
  } else if (index === total - 1) {
    return (bonus = 0);
  } else {
    // Для всех остальных
    return (bonus = (seller.profit * 5) / 100);
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

  if (!data || !Array.isArray(data.sellers) || data.sellers.length === 0) {
    throw new Error("Некорректные входные данные");
  }
  // @TODO: Проверка наличия опций

  const { calculateRevenue, calculateBonus } = options;

  try {
    options;
    console.log("options is defined");
    if (typeof options === "object") {
      console.log("options is object");
    }
    if (typeof calculateRevenue === "function") {
      console.log("calculateRevenue is function");
    } else {
      console.log("calculateRevenue is not function");
    }
    if (typeof calculateBonus === "function") {
      console.log("calculateBonus is function");
    } else {
      console.log("calculateBonus is not function");
    }
  } catch (e) {
    e;
    console.log("options is not defined");
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики // Здесь посчитаем промежуточные данные и отсортируем продавцов

  // (получаем массив объектов) статистика продавца по товару данного артикула для всех продавцов
  const sellerStats = data.sellers.map((seller) => ({
    // id продавца
    id: `${seller.id}`,
    // ИиФ продавца
    name: `${seller.first_name} ${seller.last_name}`,
    // выручка продавца
    revenue: 0,
    // прибыль продавца
    profit: 0,
    // продажи даного товара
    sales_count: 0,
    // количество продаж товара данного артикула
    products_sold: {},
  }));

  // @TODO: Индексация продавцов и товаров для быстрого доступа

  // данные по каждому продавцу для всех продавцов
  const sellerIndex = Object.fromEntries(
    sellerStats.map((item) => [item.id, item])
  );
  // данные по каждому товару для всех товаров
  const productIndex = Object.fromEntries(
    data.products.map((item) => [item.sku, item])
  );

  // @TODO: Расчет выручки и прибыли для каждого продавца // Вызовем функцию расчёта бонуса для каждого продавца в отсортированном массиве

  // @TODO: Сортировка продавцов по прибыли

  // @TODO: Назначение премий на основе ранжирования

  // @TODO: Подготовка итоговой коллекции с нужными полями // Сформируем и вернём отчёт

  // Внеший (первый) цикл, перебор по всем записям о покупках (всех чеков)
  data.purchase_records.forEach((record) => {
    // чек конкретного продавца
    const seller = sellerIndex[record.seller_id];
    // Увеличить количество продаж
    seller.sales_count += 1;
    // Увеличить общую сумму всех продаж
    seller.revenue += record.total_amount;

    // Расчёт прибыли для каждого товара // второй цикл, перебор в чеке по товарам в нём
    record.items.forEach((item) => {
      // здесь индекс (артикул) конкретного товара в чеке// здесь индекс (артикул) конкретного товара в чеке
      const product = productIndex[item.sku];
      // общая себестоимость количества данного товара по чеку
      let cost = product.purchase_price * item.quantity; // общая себестоимость количества данного товара по чеку
      // выручка от товара с учётом скидки подсчитанная через функцию calculateRevenue
      let revenue = options.calculateRevenue(item, product);
      // прибыль продавца от данного товара из чека
      seller.profit += revenue - cost;
      if (!seller.products_sold[item.sku]) {
        // если нет проданного товара, то 0
        seller.products_sold[item.sku] = 0;
      }
      seller.products_sold[item.sku] += item.quantity;
    });

    // Приводим к виду  [Array1(2), ..., ArrayN(2)]
    seller.top_products = Object.entries(seller.products_sold).map(
      ([a, b]) => ({
        sku: a,
        quantity: b,
      })
    );
  });

  // Сортируем продавцов по прибыли
  sellerStats.sort((a, b) => {
    return b.profit - a.profit;
  });

  sellerStats.forEach((seller, index) => {
    // Считаем бонус
    seller.bonus = options.calculateBonus(index, sellerStats.length, seller);
    // Формируем топ-10 товаров:
    seller.products_sold = Object.entries(seller.products_sold).map(
      ([a, b]) => ({
        sku: a,
        quantity: b,
      })
    );
    seller.products_sold.sort((a, b) => {
      return b.quantity - a.quantity;
    });
    seller.top_products = seller.products_sold.slice(0, 10);
  });

  return sellerStats.map((seller) => ({
    seller_id: seller.id,
    name: seller.name,
    revenue: +seller.revenue.toFixed(2),
    profit: +seller.profit.toFixed(2),
    sales_count: seller.sales_count,
    top_products: seller.top_products,
    bonus: +seller.bonus.toFixed(2),
  }));
}

function categorizeProducts(products) {
    const categories = {};
  
    products.forEach((product) => {
      const normalizedTitle = normalizeTitle(product.title);
  
      const categoryKey = Object.keys(categories).find(
        (key) => normalizeTitle(key) === normalizedTitle
      );
  
      if (categoryKey) {
        categories[categoryKey].products.push(product);
        categories[categoryKey].count += 1;
      } else {
        categories[product.title] = {
          category: product.title,
          count: 1,
          products: [product],
        };
      }
    });
  
    return Object.values(categories);
  }
  
  function normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[\s-]+/g, " ")
      .split(" ")
      .sort()
      .join(" ");
  }
  
  module.exports = categorizeProducts;
  
const express = require('express');
const scrapeCarrefour = require('./scrapers/carrefour');
const scrapeCoop = require('./scrapers/coopsupermercado');
const scrapeDavo = require('./scrapers/davo');
const scrapePaodeAcucar = require('./scrapers/paodeacucar');
const categorizeProducts = require('./categorize');

const app = express();
const PORT = 3000;

app.get("/produtos", async (req, res) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    return res.status(400).json({ message: "Parâmetro 'search' é obrigatório." });
  }

  try {
    console.log("Iniciando scraping no Carrefour");
    const carrefourProducts = await scrapeCarrefour(searchTerm);
    console.log("Produtos do Carrefour:", carrefourProducts);
  
    console.log("Iniciando scraping no Coop");
    const coopProducts = await scrapeCoop(searchTerm);
    console.log("Produtos do Coop:", coopProducts);
  
    console.log("Iniciando scraping no Davó");
    const davoProducts = await scrapeDavo(searchTerm);
    console.log("Produtos do Davó:", davoProducts);
  
    console.log("Iniciando scraping no Pão de Açúcar");
    const paodeAcucarProducts = await scrapePaodeAcucar(searchTerm);
    console.log("Produtos do Pão de Açúcar:", paodeAcucarProducts);
  
    const allProducts = [
      ...carrefourProducts,
      ...coopProducts,
      ...davoProducts,
      ...paodeAcucarProducts,
    ];
  
    console.log("Todos os produtos coletados:", allProducts);
  
    const categorizedProducts = categorizeProducts(allProducts);
    console.log("Produtos categorizados:", categorizedProducts);
  
    res.status(200).json(categorizedProducts);
  } catch (error) {
    console.error("Erro ao processar os produtos:", error.stack || error.message);
    res.status(500).json({
      message: "Erro ao processar os produtos.",
      error: error.message,
    });
  }
  
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

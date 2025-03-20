const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const BASE_URL = "https://www.coopsupermercado.com.br";
const PORT = 3002;

app.get("/produto", async (req, res) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    return res.status(400).json({ message: "Parâmetro 'search' é obrigatório." });
  }

  try {
    const products = await scrapeCoop(searchTerm);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});

async function scrapeCoop(searchTerm) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // URL ajustado para o formato correto do site
  const searchUrl = `${BASE_URL}/${encodeURIComponent(searchTerm)}?_q=${encodeURIComponent(searchTerm)}&map=ft`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Aguarda o carregamento completo dos produtos
  await page.waitForSelector('.vtex-search-result-3-x-galleryItem');

  const products = await page.evaluate(() => {
    const items = [];
    // Localiza o contêiner principal da galeria de produtos
    const productGallery = document.querySelectorAll('.vtex-search-result-3-x-galleryItem');
    productGallery.forEach((product) => {
      // Captura o título do produto
      const titleElement = product.querySelector('.vtex-product-summary-2-x-productBrand');
      // Captura o preço do produto
      const priceElement = product.querySelector('.coopsp-store-theme-8-x-customProductSellingPrice_sellingPrice');
      // Captura o link do produto
      const linkElement = product.querySelector('a.vtex-product-summary-2-x-clearLink');
      // Captura a imagem do produto
      const imageElement = product.querySelector('img');

      if (titleElement && priceElement && linkElement) {
        const title = titleElement.innerText.trim();
        const price = priceElement.innerText.trim();
        const url = new URL(linkElement.getAttribute('href'), location.origin).href; // Cria URL absoluto
        const imageUrl = imageElement ? imageElement.getAttribute('src') : null; // Captura o link da imagem, se existir

        items.push({ title, price, url, imageUrl });
      }
    });
    return items;
  });

  await browser.close();
  return products;
}

module.exports = scrapeCoop;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

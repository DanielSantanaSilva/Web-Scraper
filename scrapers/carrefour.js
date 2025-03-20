const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const BASE_URL = "https://mercado.carrefour.com.br";
const PORT = 3001;


app.get("/produto", async (req, res) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    return res.status(400).json({ message: "Parâmetro 'search' é obrigatório." });
  }

  try {
    const products = await scrapeCarrefour(searchTerm);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});


async function scrapeCarrefour(searchTerm) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const searchUrl = `${BASE_URL}/s?q=${encodeURIComponent(searchTerm)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('[data-product-card-content="true"]').forEach((item) => {
      const titleElement = item.querySelector('h3 a[data-testid="product-link"]');
      const priceElement = item.querySelector('[data-test-id="price"]');
      const urlElement = titleElement;

      if (titleElement && priceElement && urlElement) {
        const title = titleElement.innerText.trim();
        const price = priceElement.innerText.trim();
        const url = new URL(urlElement.getAttribute('href'), location.origin).href;

        items.push({ title, price, url });
      }
    });
    return items;
  });

  await browser.close();
  return products;
}

module.exports = scrapeCarrefour;


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
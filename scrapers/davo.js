const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const BASE_URL = "https://www.davo.com.br";
const PORT = 3003;


app.get("/produto", async (req, res) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    return res.status(400).json({ message: "Parâmetro 'search' é obrigatório." });
  }

  try {
    const products = await scrapeDavo(searchTerm);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});


async function scrapeDavo(searchTerm) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const searchUrl = `${BASE_URL}/search?Ntt=${encodeURIComponent(searchTerm)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('.css-o6bu6v').forEach((item) => {
      const titleElement = item.querySelector('a.chakra-link .chakra-text.css-1t8tr5f');
      const priceElement = item.querySelector('.chakra-stack .css-1bl3rin');
      const urlElement = item.querySelector('a.chakra-link');

      if (titleElement && priceElement && urlElement) {
        const title = titleElement.innerText.trim();
        const price = priceElement.innerText.trim();
        const url = urlElement.href;

        items.push({ title, price, url });
      }
    });
    return items;
  });

  await browser.close();
  return products;
}

module.exports = scrapeDavo;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
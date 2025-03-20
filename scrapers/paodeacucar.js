const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const BASE_URL = "https://www.paodeacucar.com";
const PORT = 3004;


app.get("/produto", async (req, res) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    return res.status(400).json({ message: "Parâmetro 'search' é obrigatório." });
  }

  try {
    const products = await scrapePaodeAcucar(searchTerm);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});


async function scrapePaodeAcucar(searchTerm) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

 
  const searchUrl = `${BASE_URL}/busca?terms=${encodeURIComponent(searchTerm)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  
  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('.CardStyled-sc-20azeh-0').forEach((item) => {
      const titleElement = item.querySelector('.Title-sc-20azeh-10');
      const priceElement = item.querySelector('.PriceValue-sc-20azeh-4');
      const urlElement = item.querySelector('a[href]');

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

module.exports = scrapePaodeAcucar;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = "4887926439100709";
const ACCESS_TOKEN = "APP_USR-6K820XJcGo6x92EhiVeCSGWgJIZDzXuM"; // Token real fornecido por Rangel

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=50`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });
    const results = response.data.results.map((item, index) => ({
      title: `${index + 1}º - ${item.title}`,
      price: item.price,
      sold_quantity: item.sold_quantity,
      permalink: item.permalink,
      thumbnail: item.thumbnail,
      listing_type_id: item.listing_type_id,
      shipping: item.shipping.mode,
      catalog_listing: item.catalog_listing ? "Sim" : "Não",
      seller_id: item.seller.id,
      date_created: item.date_created
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do Mercado Livre.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = "6K820XJcGo6x92EhiVeCSGWgJjZDzkxu";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/buscar", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send("Parâmetro 'q' é obrigatório");

  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=50`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const produtos = response.data.results.map((item, i) => ({
      titulo: `${i + 1}º - ${item.title}`,
      preco: item.price,
      vendas: item.sold_quantity,
      tipo: item.listing_type_id,
      entrega: item.shipping?.logistic_type || "Indefinido",
      catalogo: item.catalog_listing ? "Sim" : "Não",
      medalha: item.seller?.tags?.[0] || "Sem medalha",
      criado: new Date(item.date_created).toLocaleDateString(),
      link: item.permalink,
      imagem: item.thumbnail,
    }));

    res.json(produtos);
  } catch (err) {
    console.error("Erro ao buscar:", err.message);
    res.status(500).send("Erro ao buscar os dados.");
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
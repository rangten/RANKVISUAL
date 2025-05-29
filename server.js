const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/rank", async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get("https://api.mercadolibre.com/sites/MLB/search", {
            params: {
                q: query,
                limit: 50
            },
            headers: {
                Authorization: "Bearer 6K820XJcGo6x92EhiVeCSGWgJJDzDkxu"
            }
        });

        const results = response.data.results.map((item, index) => ({
            titulo: `${index + 1}º - ${item.title}`,
            preco: item.price,
            vendas: item.sold_quantity,
            tipo: item.listing_type_id,
            entrega: item.shipping?.logistic_type || "N/A",
            catalogo: item.catalog_listing ? "Sim" : "Não",
            imagem: item.thumbnail,
            link: item.permalink,
            criado: item.date_created?.split("T")[0] || "Data não informada",
            vendedor: item.seller?.id || "Indefinido",
            medalha: item.seller?.seller_reputation?.level_id || "Sem medalha"
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
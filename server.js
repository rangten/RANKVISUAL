const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/top50", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json([]);

  // Aqui deveria entrar a chamada real à API do Mercado Livre com token
  // Esta é uma simulação de estrutura
  const resultadoSimulado = Array.from({ length: 3 }).map((_, i) => ({
    titulo: `${query} exemplo ${i + 1}`,
    preco: (50 + i * 10).toFixed(2),
    vendas: 100 + i * 20,
    entrega: i % 2 ? "Full" : "Normal",
    medalha: i % 2 ? "Gold" : "Nenhuma",
    vendedor: "ExemploVendedor" + (i + 1),
    criado: "27/05/2025",
    imagem: "https://http2.mlstatic.com/D_662954-MLU72718772520_112023-O.jpg",
    link: "https://mercadolivre.com.br/exemplo" + (i + 1)
  }));

  res.json(resultadoSimulado);
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/ranking', async (req, res) => {
  const termo = req.query.termo;
  try {
    // Simulação de resposta da API do Mercado Livre
    const resultados = Array.from({ length: 5 }, (_, i) => ({
      posicao: i + 1,
      titulo: `${termo} ${i + 1}`,
      preco: `R$ ${(Math.random() * 100 + 20).toFixed(2)}`,
      tipo: i % 2 === 0 ? "Clássico" : "Premium"
    }));
    res.json({ sucesso: true, dados: resultados });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar ranking" });
  }
});

app.get('/posicao', async (req, res) => {
  const termo = req.query.termo;
  const url = req.query.url;
  try {
    const posicao = Math.floor(Math.random() * 100) + 1;
    res.json({ sucesso: true, posicao, termo, url });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar posição" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

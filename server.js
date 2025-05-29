
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ranking', (req, res) => {
  const produto = req.query.produto || 'Produto';
  const dados = Array.from({ length: 9 }, (_, i) => ({
    titulo: `${produto} exemplo ${i + 1}`,
    preco: (Math.random() * 100 + 10).toFixed(2),
    vendas: Math.floor(Math.random() * 500 + 10),
    tipo: 'Premium',
    entrega: 'Full',
    catalogo: 'Sim',
    medalha: 'Gold',
    data: '28/05/2025',
    link: 'https://www.mercadolivre.com.br'
  }));
  res.json(dados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

async function buscarRanking() {
  const termo = document.getElementById('busca').value;
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '<p class="text-gray-500">Buscando...</p>';

  try {
    const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=50`);
    const data = await resp.json();
    const ids = data.results.map(item => item.id);
    const detalhesResp = await fetch(`https://api.mercadolibre.com/items?ids=${ids.join(',')}&attributes=id,listing_type_id,shipping,catalog_product_id`);
    const detalhes = await detalhesResp.json();
    const mapDetalhes = {};
    detalhes.forEach(i => mapDetalhes[i.body.id] = i.body);

    let html = '<table class="min-w-full text-sm border"><thead><tr class="bg-gray-100">';
    html += '<th class="border px-2 py-1">Título</th><th class="border px-2 py-1">Vendidos</th><th class="border px-2 py-1">Tipo</th><th class="border px-2 py-1">Entrega</th><th class="border px-2 py-1">Catálogo</th></tr></thead><tbody>';
    data.results.forEach(item => {
      const det = mapDetalhes[item.id] || {};
      const tipo = det.listing_type_id === 'gold_pro' ? 'Premium' : 'Clássico';
      const entrega = det.shipping?.logistic_type === 'fulfillment' ? 'Full' : 'Mercado Envios';
      const catalogo = det.catalog_product_id ? 'Sim' : 'Não';
      html += `<tr><td class="border px-2 py-1"><a href="${item.permalink}" target="_blank">${item.title}</a></td><td class="border px-2 py-1">${item.sold_quantity}</td><td class="border px-2 py-1">${tipo}</td><td class="border px-2 py-1">${entrega}</td><td class="border px-2 py-1">${catalogo}</td></tr>`;
    });
    html += '</tbody></table>';
    resultado.innerHTML = html;
  } catch (e) {
    resultado.innerHTML = `<p class="text-red-600">Erro ao buscar: ${e.message}</p>`;
  }
}

async function buscarPosicao() {
  const input = document.getElementById('anuncio').value.trim();
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '<p class="text-gray-500">Buscando posição...</p>';
  let id = input.includes('MLB') ? input.match(/MLB\d+/)?.[0] : null;
  if (!id && input.includes('mercadolivre.com')) id = input.split('-').pop().split('.')[0];
  if (!id) return resultado.innerHTML = '<p class="text-red-600">ID inválido</p>';

  try {
    const item = await fetch(`https://api.mercadolibre.com/items/${id}`).then(r => r.json());
    const termo = encodeURIComponent(item.title);
    let offset = 0, posicao = null, total = 0;
    while (offset <= 300) {
      const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${termo}&limit=50&offset=${offset}`);
      const data = await resp.json();
      total = data.paging.total;
      const idx = data.results.findIndex(r => r.id === id);
      if (idx !== -1) {
        posicao = offset + idx + 1;
        break;
      }
      if (offset + 50 >= total) break;
      offset += 50;
    }
    resultado.innerHTML = posicao ? `<p class="text-green-600">Seu anúncio aparece na <strong>${posicao}ª</strong> posição para "${item.title}".</p>` : '<p class="text-red-600">Anúncio não encontrado nos 300 primeiros resultados.</p>';
  } catch (e) {
    resultado.innerHTML = `<p class="text-red-600">Erro ao buscar: ${e.message}</p>`;
  }
}
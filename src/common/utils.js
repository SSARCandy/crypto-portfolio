import Binance from "binance-api-node";

async function binance_price_changes_pct(assets, interval, map) {
  const api = new Binance();
  const valid_symbols = new Set((await api.exchangeInfo()).symbols.map(x => x.symbol));

  for (const asset of assets) {
    if (~['USDT', 'USD'].indexOf(asset)) {
      map[asset] = 0;
      continue;
    }
    for (const base of ["USDT", "BTC", "BNB"]) {
      const symbol = `${asset}${base}`;
      if (!valid_symbols.has(symbol)) {
        continue;
      }
      try {
        const res = await api.candles({
          symbol,
          interval,
          limit: 2,
        });
        map[asset] = (parseFloat(res[1].close) - parseFloat(res[0].open)) /
          parseFloat(res[0].open);
        break;
      } catch (e) {
        continue;
      }
    }
  }
  return map;
}

const interval2huobi = {
  '30m': '30min',
  '4h': '4hour',
  '1d': '1day',
  '1w': '1week',
};
async function huobi_price_changes_pct(assets, interval, map) {
  for (const asset of assets) {
    if (typeof (map[asset]) === 'number') continue;
    const qs = `period=${interval2huobi[interval]}&symbol=${asset.toLowerCase()}usdt&size=2`;
    const res = await (await fetch(`https://api.huobi.pro/market/history/kline?${qs}`)).json();
    if (res.status !== 'ok' || res.data.length < 2) continue;
    const data = res.data.reverse();
    map[asset] = (data[1].close - data[0].open) / data[0].open;
  }

  return map;
}

async function fetch_price_changes_pct(assets, interval) {
  assets = [...new Set(assets)];
  const w_binance = await binance_price_changes_pct(assets, interval, {});
  const w_huobi = await huobi_price_changes_pct(assets, interval, w_binance);
  return w_huobi;
}

function download_table_as_csv(table_id, separator = ',') {
  const rows = document.querySelectorAll('table#' + table_id + ' tr');
  const csv = [];
  for (let i = 0; i < rows.length; i++) {
    const row = [], cols = rows[i].querySelectorAll('td, th');
    for (let j = 0; j < cols.length; j++) {
      let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
      data = data.replace(/"/g, '""');
      data = data.replace(/[,$]/g, '');
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  const csv_string = csv.join('\n');
  const filename = table_id + '_' + new Date().getTime() + '.csv';
  const link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function number_formatter(v) {
  const l = Math.abs(v) > 999
    ? Math.sign(v) * (Math.abs(v) / 1000).toFixed(1) + "k"
    : Math.sign(v) * Math.abs(v);
  return `$ ${l}`;
}

export {
  download_table_as_csv,
  fetch_price_changes_pct,
  number_formatter,
};
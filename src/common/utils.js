import Binance from "binance-api-node";

async function fetch_price_changes_pct(assets, interval) {
    const map = {};
    const api = new Binance();
    const valid_symbols = new Set((await api.exchangeInfo()).symbols.map(x => x.symbol));

    for (const asset of assets) {
        map[asset] = NaN;
        if (asset === 'USDT') {
            map[asset] = 0;
            continue;
        }
        for (const base of ["USDT", "BTC", "BNB"]) {
            const symbol  = `${asset}${base}`;
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

export {
    download_table_as_csv,
    fetch_price_changes_pct,
};
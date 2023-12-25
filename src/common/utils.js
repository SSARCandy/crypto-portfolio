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
  number_formatter,
};
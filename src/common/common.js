
const filters = {
  toFixed: (v, demical = 2) => {
    if (v == undefined) return 0;
    return v.toFixed(demical);
  },
  toPrecision: (v, precision) => {
    if (v == undefined) return 0;
    if (Math.abs(v) < 1e-8) return 0;
    return v.toPrecision(precision);
  },
  Number: (v, toFixed) => {
    if (v == undefined) return 0;
    const option =
      typeof toFixed === "number"
        ? {
            maximumFractionDigits: toFixed,
            minimumFractionDigits: toFixed,
          }
        : {};
    return new Intl.NumberFormat("en-US", option).format(v);
  },
  Precentage: (v, demical = 1) => {
    if (v === Infinity) return "Inf%";
    if (isNaN(v)) return "--";
    return `${(v * 100 || 0).toFixed(demical)}%`;
  },
  nFormatter: (num, digits) => {
    const lookup = [
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e8, symbol: "B" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    if (!item) return num.toFixed(digits);
    return (num / item.value).toFixed(digits - 1).replace(rx, "$1") + item.symbol;
  },
};

const methods = {
  color(v) {
    return { buy: v > 0, sell: v < 0 };
  },
};

export {
  filters,
  methods,
};
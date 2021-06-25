<template>
  <div id="main">
    <button
      class="btn setting-btn"
      v-on:click="is_setting_mode = !is_setting_mode"
    >
      <i class="fas fa-cog"></i>
    </button>
    <button class="btn nav-btn" v-on:click="is_nav_mode = !is_nav_mode">
      <i class="fas fa-chart-line"></i>
    </button>
    <setting
      :is_setting_mode.sync="is_setting_mode"
      :is_dark_mode.sync="is_dark_mode"
      :is_hide_small_balance.sync="is_hide_small_balance"
      :is_perfer_return.sync="is_perfer_return"
    />
    <account-value v-if="is_nav_mode" :daily_nav="daily_nav" />
    <div v-if="!is_nav_mode">
      <pie-chart :assets="assets_with_px" />
      <table id="asset">
        <tr>
          <th>Token</th>
          <th>Size</th>
          <th>Price</th>
          <th>Value</th>
          <th>Entry</th>
          <th v-if="should_show('pnl')">PnL</th>
          <th v-if="should_show('pnl_return')">Return</th>
          <th v-if="screen_width > 500">Note</th>
        </tr>
        <tr
          v-for="asset in assets_with_px"
          v-bind:key="asset.asset"
          v-show="!is_hide_small_balance || asset.size * asset.price > 10"
        >
          <td>{{ asset.asset }}</td>
          <td>{{ asset.size | Number(2) }}</td>
          <td>{{ asset.price | Number(3) }}</td>
          <td>{{ (asset.size * asset.price) | Number(0) }}</td>
          <td class="entry-price">
            <input v-model="userdata[asset.asset]" type="number" />
          </td>
          <td v-bind:class="color(pnl(asset))" v-if="should_show('pnl')">
            {{ pnl(asset) | Number(0) }}
          </td>
          <td v-bind:class="color(pnl(asset))" v-if="should_show('pnl_return')">
            {{ pnl_return(asset) | Precentage(1) }}
          </td>
          <td
            class="entry-price"
            style="max-width: 200px"
            v-if="screen_width > 500"
          >
            <input v-model="userdata[`${asset.asset}-note`]" />
          </td>
        </tr>
      </table>
      <footer style="display: flex; justify-content: space-between;">
        <ul style="list-style: none; padding-left: 0;">
          <li>
            Total Unrealized PnL:
            <span v-bind:class="color(sum_pnl(assets_with_px))">{{
              sum_pnl(assets_with_px) | Number(0)
            }}</span>
          </li>
          <li>Update: {{ lastUpdate }}</li>
        </ul>
        <button v-on:click="save" class="save">
          {{ saved ? "Done!" : "Save" }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import { firebase } from "../../config/config.json";
import PieChart from "./PieChart.vue";
import AccountValue from "./AccountValue";
import Setting from "./Setting";
import sortBy from "lodash/sortBy";
import sum from "lodash/sum";
import dayjs from "dayjs";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import {
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "@firebase/firestore";

dayjs().format();
initializeApp(firebase);
getAnalytics();

const database = getFirestore();

export default {
  name: "Main",
  components: {
    PieChart,
    AccountValue,
    Setting,
  },
  props: {},
  data() {
    return {
      id: window.location.host,
      now: Date.now(),
      time: "",
      assets: [],
      price_map: {},
      userdata: {},
      daily_nav: [],

      saved: false,
      screen_width: 0,

      is_setting_mode: false,
      is_nav_mode: false,
      is_hide_small_balance: localStorage.is_hide_small_balance === "true",
      is_dark_mode: localStorage.is_dark_mode === "true",
      is_perfer_return: localStorage.is_perfer_return === "true",
    };
  },
  computed: {
    lastUpdate() {
      const delta = (dayjs(this.now) - dayjs(this.time)) / 1000;
      return `${delta.toFixed(0)} sec ago`;
    },
    assets_with_px() {
      return sortBy(
        this.assets.map((x) => ({
          ...x,
          price: this.price_map[x.asset],
        })),
        [
          function (o) {
            return -o.price * o.size;
          },
        ]
      );
    },
  },
  filters: {
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
      return `${(v * 100 || 0).toFixed(demical)}%`;
    },
  },
  methods: {
    async save() {
      const doc1 = doc(database, `config/${this.id}`);
      await setDoc(doc1, this.userdata);
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
      }, 5000);
    },
    pnl(row) {
      const { asset, size, price } = row;
      if (!this.userdata[asset]) return null;
      return size * (price - this.userdata[asset]);
    },
    pnl_return(row) {
      const { asset, price } = row;
      if (!this.userdata[asset]) return null;
      return price / this.userdata[asset] - 1;
    },
    sum_pnl(rows) {
      return sum(
        rows.map(({ asset, size, price }) => {
          if (!this.userdata[asset]) return 0;
          return size * (price - this.userdata[asset]);
        })
      );
    },
    color: (v) => {
      return { buy: v > 0, sell: v < 0 };
    },
    should_show(col) {
      if (this.screen_width > 500) return true;
      if (this.is_perfer_return) return col === "pnl_return";
      return col === "pnl";
    },
  },
  watch: {
    is_dark_mode: function (val) {
      localStorage.is_dark_mode = val;
      document.documentElement.setAttribute(
        "data-theme",
        val ? "dark" : "light"
      );
    },
    is_hide_small_balance: function (val) {
      localStorage.is_hide_small_balance = val;
    },
    is_perfer_return: function (val) {
      localStorage.is_perfer_return = val;
    },
  },
  mounted() {
    this.screen_width =
      window.innerWidth > 0 ? window.innerWidth : screen.width;

    document.title = `${this.id.split(".")[0]}'s Portfolio`;
    document.documentElement.setAttribute(
      "data-theme",
      this.is_dark_mode ? "dark" : "light"
    );
  },
  created: async function () {
    const doc1 = doc(database, `config/${this.id}`);
    const config = await getDoc(doc1);
    if (config.exists()) {
      this.userdata = config.data();
    }

    const doc2 = doc(database, `asset/${this.id}`);
    onSnapshot(doc2, (asset) => {
      if (!asset.exists()) return;
      const { time, data } = asset.data();
      this.time = time;
      this.assets = data;
    });

    const doc3 = doc(database, "price/spot");
    onSnapshot(doc3, (price_map) => {
      if (!price_map.exists()) return;
      this.price_map = price_map.data();
    });

    const doc4 = doc(database, `nav/${this.id}`);
    const daily_nav = await getDoc(doc4);
    if (daily_nav.exists()) {
      this.daily_nav = sortBy(Object.entries(daily_nav.data()), (o) => o[0]);
    }
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
:root {
  --color-bg: #fff;
  --color-text: #000;
  --color-border: #ddd;
}

:root[data-theme="dark"] {
  --color-bg: #1c1c1c;
  --color-text: #eee;
  --color-border: #777;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.highcharts-background {
  fill: var(--color-bg) !important;
}
.highcharts-title {
  fill: var(--color-text) !important;
}
.highcharts-data-label text {
  fill: var(--color-text) !important;
}
.highcharts-text-outline {
  fill: var(--color-bg) !important;
  stroke-width: 0px;
}
.highcharts-point {
  stroke-width: 1px;
  stroke-opacity: 0.7;
}
.highcharts-credits {
  display: none;
}

#main {
  font-family: monospace;
  max-width: 1000px;
  margin: 0 auto;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
  white-space: nowrap;
}

th,
td {
  padding: 4px;
  text-align: right;
  border: 1px solid var(--color-border);
}

tr:hover {
  background-color: #eee;
}

[data-theme="dark"] tr:hover {
  background-color: #333;
}

.sell {
  color: red;
  font-weight: 700;
}

.buy {
  color: green;
  font-weight: 700;
}

input {
  position: relative;
  vertical-align: middle;
}

.entry-price {
  max-width: 45px;
}

.entry-price > input {
  font-size: 12px;
  width: 100%;
  text-align: right;
  font-family: monospace;
  background-color: var(--color-bg);
  border: var(--color-bg);
  color: var(--color-text);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.save {
  float: right;
  width: 100px;
}

.nav-btn {
  font-size: 18px;
  position: absolute;
  right: 5px;
  z-index: 999;
}

.setting-btn {
  font-size: 18px;
  position: absolute;
  left: 5px;
  z-index: 999;
}

footer {
  padding-top: 10px;
  padding-bottom: 10px;
}

button {
  background: initial;
  border: var(--color-border) 2px solid;
  border-radius: 2px;
  color: var(--color-text);
}

button:hover {
  background-color: rgba(170, 170, 170, 0.603);
}

.fas {
  vertical-align: middle;
}
</style>

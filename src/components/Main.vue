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
      :is_chinese.sync="is_chinese"
    />
    <account-value v-if="is_nav_mode" :daily_nav="daily_nav" />
    <div v-if="!is_nav_mode">
      <pie-chart :assets="assets_table" />
      <table id="asset">
        <tr>
          <th v-on:click="change_sortkey('tag')" v-if="should_show('tag')">
            {{ sorted_icon("tag") }}{{ $t("tag") }}
          </th>
          <th v-on:click="change_sortkey('asset')">
            {{ sorted_icon("asset") }}{{ $t("asset") }}
          </th>
          <th v-on:click="change_sortkey('size')">
            {{ sorted_icon("size") }}{{ $t("size") }}
          </th>
          <th v-on:click="change_sortkey('price')">
            {{ sorted_icon("price") }}{{ $t("price") }}
          </th>
          <th v-on:click="change_sortkey('notional_value')">
            {{ sorted_icon("notional_value") }}{{ $t("notional_value") }}
          </th>
          <th v-on:click="change_sortkey('entry')">
            {{ sorted_icon("entry") }}{{ $t("entry") }}
          </th>
          <th v-on:click="change_sortkey('pnl')" v-if="should_show('pnl')">
            {{ sorted_icon("pnl") }}{{ $t("pnl") }}
          </th>
          <th
            v-on:click="change_sortkey('pnl_return')"
            v-if="should_show('pnl_return')"
          >
            {{ sorted_icon("pnl_return") }}{{ $t("pnl_return") }}
          </th>
          <th v-if="screen_width > 500">{{ $t("note") }}</th>
        </tr>
        <tr
          v-for="asset in assets_table"
          v-bind:key="asset.asset"
          v-show="!is_hide_small_balance || asset.size * asset.price > 10"
        >
          <td
            class="btn-tag"
            v-bind:style="tagcolor(userdata[`${asset.asset}-tag`])"
            v-if="should_show('tag')"
            v-on:click="change_tag(`${asset.asset}-tag`)"
          >
            {{
              userdata[`${asset.asset}-tag`] !== undefined
                ? userdata[`${asset.asset}-tag`] + 1
                : ""
            }}
          </td>
          <td>{{ asset.asset }}</td>
          <td>{{ asset.size | Number(2) }}</td>
          <td>{{ asset.price | Number(3) }}</td>
          <td>{{ asset.notional_value | Number(0) }}</td>
          <td class="entry-price">
            <input v-model.lazy="userdata[asset.asset]" type="number" />
          </td>
          <td v-bind:class="color(asset.pnl)" v-if="should_show('pnl')">
            {{ asset.pnl | Number(0) }}
          </td>
          <td v-bind:class="color(asset.pnl)" v-if="should_show('pnl_return')">
            {{ asset.pnl_return | Precentage(1) }}
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
      <footer style="display: flex; justify-content: space-between">
        <ul style="list-style: none; padding-left: 0">
          <li>
            {{ $t("total_unrealized_pnl") }}:
            <span v-bind:class="color(sum_pnl(assets_table))">
              {{ sum_pnl(assets_table) | Number(0) }}
            </span>
          </li>
          <li><Timer :time="time" /></li>
        </ul>
        <button v-on:click="save" class="save">
          {{ saved ? $t("saved") : $t("save") }}
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
import Timer from "./Timer.vue";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import _ from "lodash";
import sum from "lodash/sum";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import {
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "@firebase/firestore";

initializeApp(firebase);
getAnalytics();

const database = getFirestore();

export default {
  name: "Main",
  components: {
    PieChart,
    AccountValue,
    Setting,
    Timer,
  },
  props: {},
  data() {
    return {
      id: window.location.host,
      time: 0,
      assets: [],
      assets_table: [],
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
      is_chinese: localStorage.is_chinese === "true",

      sort_key: "notional_value",
      sort_order: 1, // 0: asc, 1: desc, 2: un-sorted
    };
  },
  computed: {},
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
      const { asset, size } = row;
      if (!this.userdata[asset]) return 0;
      if (!this.price_map[asset]) return 0;
      return size * (this.price_map[asset] - this.userdata[asset]);
    },
    pnl_return(row) {
      const { asset } = row;
      if (!this.userdata[asset]) return 0;
      if (!this.price_map[asset]) return 0;
      return this.price_map[asset] / this.userdata[asset] - 1;
    },
    sum_pnl(rows) {
      return sum(
        rows.map(({ asset, size, price }) => {
          if (!this.userdata[asset]) return 0;
          return size * (price - this.userdata[asset]);
        })
      );
    },
    tagcolor(idx) {
      const color = [
        "#4059FB",
        "#FF0000",
        "#00EE00",
        "#F1F605",
        "#0EE5E4",
        "#E65CA8",
        "#757673",
        "#F99700",
      ];
      return {
        backgroundColor: color[idx],
      };
    },
    color(v) {
      return { buy: v > 0, sell: v < 0 };
    },
    should_show(col) {
      if (this.screen_width > 500) return true;
      if (this.is_perfer_return) return col === "pnl_return";
      return col === "pnl";
    },
    sorted_icon(k) {
      if (k !== this.sort_key) return "";
      if (this.sort_order === 2) return "";
      return this.sort_order === 1 ? "↓" : "↑";
    },
    change_sortkey(k) {
      if (k === this.sort_key) {
        this.sort_order = (this.sort_order + 1) % 3;
      } else {
        this.sort_key = k;
      }
      this.update_assets_table();
    },
    change_tag(k) {
      this.sort_order = 2;
      if (this.userdata[k] === undefined) {
        this.$set(this.userdata, k, 0);
        return;
      }
      this.userdata[k] = (this.userdata[k] + 1) % 8;
    },
    update_assets_table() {
      const res = this.assets.map((x) => ({
        ...x,
        tag: this.userdata[`${x.asset}-tag`],
        price: this.price_map[x.asset],
        notional_value: this.price_map[x.asset] * x.size,
        entry: this.userdata[x.asset] || 0,
        pnl: this.pnl(x),
        pnl_return: this.pnl_return(x),
      }));
      if (this.sort_order !== 2) {
        this.assets_table = orderBy(
          res,
          this.sort_key,
          this.sort_order === 1 ? "desc" : "asc"
        );
      } else {
        const assets_order = this.assets_table.map(x => x.asset);
        const assets_map = _.keyBy(res, "asset");
        const new_assets_table = [];
        for (const asset of assets_order) {
          const asset_row = assets_map[asset];
          if (asset_row) {
            new_assets_table.push(asset_row);
            delete assets_map[asset];
          } 
        }
        for (const k of Object.keys(assets_map)) {
          new_assets_table.push(assets_map[k]);
        }
        this.assets_table = new_assets_table;
      }
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
    is_chinese: function (val) {
      localStorage.is_chinese = val;
      this.$i18n.locale = val ? "zh" : "en";
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
    this.$i18n.locale = this.is_chinese ? "zh" : "en";
    const doc1 = doc(database, `config/${this.id}`);
    const config = await getDoc(doc1);
    if (config.exists()) {
      this.userdata = config.data();
      this.update_assets_table();
    }

    const doc2 = doc(database, `asset/${this.id}`);
    onSnapshot(doc2, (asset) => {
      if (!asset.exists()) return;
      const { time, data } = asset.data();
      this.time = time;
      this.assets = data;
      this.update_assets_table();
    });

    const doc3 = doc(database, "price/spot");
    onSnapshot(doc3, (price_map) => {
      if (!price_map.exists()) return;
      this.price_map = price_map.data();
      this.update_assets_table();
    });

    const doc4 = doc(database, `nav/${this.id}`);
    const daily_nav = await getDoc(doc4);
    if (daily_nav.exists()) {
      this.daily_nav = sortBy(Object.entries(daily_nav.data()), (o) => o[0]);
    }
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

.btn-tag {
  width: 27px;
  text-align: center;
}
</style>

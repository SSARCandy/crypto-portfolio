<template>
  <div id="main">
    <div id="quick-access">
      <button
        class="setting-btn"
        v-on:click="is_setting_mode = !is_setting_mode"
      >
        <i class="fas fa-fw fa-cog"></i>
      </button>
      <div style="display: flex;">
        <button class="setting-btn" v-show="!is_nav_mode && !is_position_mode" v-on:click="is_exchange_chart = !is_exchange_chart">
          <i class="fas fa-fw fa-chart-pie"></i>
        </button>
        <div style="width: 20px;"></div>
        <button class="setting-btn" v-on:click="is_position_mode = !is_position_mode; is_nav_mode = false;">
          <i class="fas fa-fw fa-scroll"></i>
        </button>
        <button class="setting-btn" v-on:click="is_nav_mode = !is_nav_mode; is_position_mode = false;">
          <i class="fas fa-fw fa-chart-line"></i>
        </button>
      </div>
    </div>
    <setting
      :is_setting_mode.sync="is_setting_mode"
      :is_dark_mode.sync="is_dark_mode"
      :is_hide_small_balance.sync="is_hide_small_balance"
      :is_perfer_return.sync="is_perfer_return"
      :is_merge_wallets.sync="is_merge_wallets"
      :is_show_nav_title.sync="is_show_nav_title"
      :language.sync="language"
      :timeframe.sync="timeframe"
      :asset_type.sync="asset_type"
    />
    <account-value
      v-if="is_nav_mode"
      :daily_nav="daily_nav" 
      :estimate_total_cost="estimate_total_cost"
    />
    <position-view
      v-if="is_position_mode"
      :positions="positions"
    />
    <div v-if="!is_nav_mode&& !is_position_mode">
      <pie-chart :assets="chart_data" />
      <ul>
        <li 
          v-bind:key="asset.asset+asset.wallet"
          v-for="asset in assets"
          v-show="asset.asset == 'APP_ERROR'"
          class="sell"
        >
          {{asset.wallet }} KEY ERROR
        </li>
      </ul>
      <table id="asset">
        <tr>
          <th v-on:click="change_sortkey('tag')" v-if="should_show('tag')">
            {{ sorted_icon("tag") }}{{ $t("tag") }}
          </th>
          <th v-on:click="change_sortkey('wallet')" v-if="should_show('wallet')">
            {{ sorted_icon("wallet") }}{{ $t("wallet") }}
          </th>
          <th v-on:click="change_sortkey('asset')">
            {{ sorted_icon("asset") }}{{ $t("asset") }}
          </th>
          <th v-on:click="change_sortkey('price_changes')" v-if="should_show('price_changes')">
            {{ sorted_icon("price_changes") }}{{ timeframe }} {{ $t("price_changes") }}
          </th>
          <th v-on:click="change_sortkey('price')">
            {{ sorted_icon("price") }}{{ $t("price") }}
          </th>
          <th v-on:click="change_sortkey('entry')">
            {{ sorted_icon("entry") }}{{ $t("entry") }}
          </th>
          <th v-on:click="change_sortkey('size')">
            {{ sorted_icon("size") }}{{ $t("size") }}
          </th>
          <th v-on:click="change_sortkey('notional_value')">
            {{ sorted_icon("notional_value") }}{{ $t("notional_value") }}
          </th>
          <th v-on:click="change_sortkey('pnl')" v-if="should_show('pnl')">
            {{ sorted_icon("pnl") }}{{ $t("pnl") }}
          </th>
          <th v-on:click="change_sortkey('pnl_return')" v-if="should_show('pnl_return')">
            {{ sorted_icon("pnl_return") }}{{ $t("pnl_return") }}
          </th>
          <th v-if="screen_width > 500">{{ $t("note") }}</th>
        </tr>
        <tr
          v-for="asset in assets_table"
          v-bind:key="asset.asset+asset.wallet"
          v-show="asset.asset != 'APP_ERROR' && (!is_hide_small_balance || asset.size * asset.price > small_balance_threshold)"
        >
          <td
            class="btn-tag"
            v-bind:style="tagcolor(userdata[symbol_key(asset.asset, asset.wallet, 'tag')])"
            v-if="should_show('tag')"
            v-on:click="change_tag(symbol_key(asset.asset, asset.wallet, 'tag'))"
          >
            {{
              userdata[symbol_key(asset.asset, asset.wallet, 'tag')] !== undefined
                ? userdata[symbol_key(asset.asset, asset.wallet, 'tag')] + 1
                : ""
            }}
          </td>
          <td v-if="should_show('wallet')">{{ asset.wallet }}</td>
          <td>{{ asset.asset }}</td>
          <td v-bind:class="color(asset.price_changes)" v-if="should_show('price_changes')" style="width: 0px">
            {{ asset.price_changes | Precentage(1) }}
          </td>
          <td>{{ asset.price | toPrecision(5) }}</td>
          <td class="entry-price">
            <input v-model.lazy="userdata[entry_k(asset.asset, asset.wallet)]" type="number" />
          </td>
          <td v-tooltip="asset.size.toString()">
            {{ asset.size | nFormatter(3) }}
          </td>
          <td>{{ asset.notional_value | Number(0) }}</td>
          <td v-bind:class="color(asset.pnl)" v-if="should_show('pnl')">
            {{ asset.pnl | Number(0) }}
          </td>
          <td v-bind:class="color(asset.pnl)" v-if="should_show('pnl_return')">
            {{ asset.pnl_return | Precentage(1) }}
          </td>
          <td class="entry-price" style="max-width: 200px" v-if="screen_width > 500">
            <input v-model="userdata[symbol_key(asset.asset, asset.wallet, 'note')]" />
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
          <li>
            {{ $t("today_pnl") }}:
            <span v-if="asset_type === 'all'" v-bind:class="color(today_pnl())">
              {{ today_pnl() | Number(0) }}
            </span>
            <span v-if="asset_type !== 'all'">
              {{ $t("today_pnl_error_msg") }}
            </span>
          </li>
          <li>
            {{ $t("estimate_total_cost") }}:
            <span>
              {{ estimate_total_cost | Number(0) }}
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
import 'floating-vue/dist/style.css';
import { firebase } from "../../config/config.json";
import PieChart from "./PieChart";

import AccountValue from "./AccountValue";
import PositionView from "./PositionView.vue";
import Setting from "./Setting";
import Timer from "./Timer";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import { filters, methods } from "../common/common";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import {
  getFirestore,
  onSnapshot,
  doc,
  collection,
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
    PositionView,
    Setting,
    Timer,
  },
  props: {},
  data() {
    return {
      time: 0,
      reported_total_cost: 0,
      assets: [],
      positions: [],
      assets_table: [],
      price_map: {},
      price_history: [],
      userdata: {},
      daily_nav: [],

      saved: false,
      screen_width: 0,

      is_setting_mode: false,
      is_exchange_chart: false,
      is_nav_mode: false,
      is_position_mode: false,
      is_hide_small_balance: localStorage.is_hide_small_balance === "true",
      is_dark_mode: localStorage.is_dark_mode === "true",
      is_perfer_return: localStorage.is_perfer_return === "true",
      is_merge_wallets: localStorage.is_merge_wallets === "true",
      is_show_nav_title: localStorage.is_show_nav_title === "true",
      language: localStorage.language || 'en',
      timeframe: localStorage.timeframe || '1d',
      asset_type: localStorage.asset_type || 'crypto', //  'crypto' 'stocks' 'all'

      sort_key: "notional_value",
      sort_order: 1, // 0: asc, 1: desc, 2: un-sorted
    };
  },
  computed: {
    title() {
      return this.is_show_nav_title
        ? `$${this.$options.filters.Number(this.nav, 0)}`
        : `${this.id.split(".")[0]}'s Portfolio`;
    },
    id() {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      return params.id;
    },
    small_balance_threshold() {
      return this.nav * 0.001;
    },
    nav() {
      return sum(this.assets_table.map(asset => asset.size * asset.price));
    },
    estimate_total_cost() {
      const estimated = sum(this.assets_table.map(asset => asset.size * asset.entry));
      return Math.max(estimated, this.reported_total_cost);
    },
    chart_data() {
      if (this.is_exchange_chart) {
        return Object.values(this.assets_table.reduce((acc, { wallet, notional_value }) => {
          acc[wallet] = {
            name: wallet,
            value: (acc[wallet] ? acc[wallet].value : 0) + notional_value,
          };
          return acc;
        }, {}));

      } else if (this.is_merge_wallets) {
        return Object.values(this.assets_table.reduce((acc, { asset, notional_value }) => {
          acc[asset] = {
            name: asset,
            value: (acc[asset] ? acc[asset].value : 0) + notional_value,
          };
          return acc;
        }, {}));
      } else {
        return this.assets_table.map(asset => {
          return {
            name: asset.asset,
            value: asset.notional_value,
          };
        });
      }
    },
  },
  filters: filters,
  methods: {
    ...methods,
    async save() {
      const doc1 = doc(database, `config/${this.id}`);
      await setDoc(doc1, this.userdata);
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
      }, 5000);
    },
    pnl(row) {
      const { asset, size, wallet } = row;
      if (!this.entry_p(asset, wallet)) return 0;
      if (!this.price_map[asset]) return 0;
      return size * (this.price_map[asset] - this.entry_p(asset, wallet));
    },
    pnl_return(row) {
      const { asset, wallet } = row;
      if (!this.entry_p(asset, wallet)) return 0;
      if (!this.price_map[asset]) return 0;
      return this.price_map[asset] / this.entry_p(asset, wallet) - 1;
    },
    sum_pnl(rows) {
      return sum(
        rows.map(({ asset, size, price, wallet }) => {
          if (!this.entry_p(asset, wallet)) return 0;
          return size * (price - this.entry_p(asset, wallet));
        })
      );
    },
    today_pnl() {
      if (this.daily_nav.length < 2) return 0;
      return this.nav - this.daily_nav[this.daily_nav.length - 2][1];
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
        this.sort_order = (this.sort_order + 1) % 2;
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
      this.userdata[k] = (this.userdata[k] + 1) % 9;
      if (this.userdata[k] == 8) {
        delete this.userdata[k];
      }
    },
    assets_chages(symbol) {
      if (this.price_history.length === 0) return NaN;
      const tf = parseInt(this.timeframe) + 1;
      const prev = this.price_history.slice(-tf)[0];
      return (this.price_map[symbol] - prev[symbol]) / prev[symbol];
    },
    update_assets_table() {
      const stock_types = ['firstrade', 'ibkr'];
      const res = this.assets.map((x) => ({
          ...x,
          tag: this.userdata[this.symbol_key(x.asset, x.wallet, 'tag')],
          price: this.price_map[x.asset],
          price_changes: this.assets_chages(x.asset),
          notional_value: this.price_map[x.asset] * x.size,
          entry: this.entry_p(x.asset, x.wallet),
          pnl: this.pnl(x),
          pnl_return: this.pnl_return(x),
        }))
        .filter(x => {
          return this.asset_type === 'all' ? true :
            this.asset_type === 'stocks'
              ? stock_types.includes(x.wallet)
              : !stock_types.includes(x.wallet);
        });
      this.assets_table = orderBy(
        res,
        this.sort_key,
        this.sort_order === 1 ? "desc" : "asc"
      );
      document.title = this.title;
    },
    symbol_key(token, wallet, type) {
      return wallet !== 'binance' ? `${token}-${wallet}-${type}` : `${token}-${type}`;
    },
    entry_k(token, wallet) {
      return wallet !== 'binance' ? `${token}-${wallet}` : `${token}`;
    },
    entry_p(token, wallet) {
      const k = wallet !== 'binance' ? `${token}-${wallet}` : `${token}`;
      return this.userdata[k] || 0;
    },
    async loadData() {
      const configDoc = doc(database, `config/${this.id}`);
      const dailyNavDoc = doc(database, `nav/${this.id}`);

      const [config, dailyNav] = await Promise.all([
        getDoc(configDoc),
        getDoc(dailyNavDoc),
      ]);
      if (config.exists()) {
        this.userdata = config.data();
      }
      if (dailyNav.exists()) {
        this.daily_nav = sortBy(Object.entries(dailyNav.data()), (o) => o[0]);
      }
      this.update_assets_table();
    },
    subscribeToAssetChanges() {
      const d = doc(database, `asset/${this.id}`);
      onSnapshot(d, (asset) => {
        if (!asset.exists()) return;
        const { time, data, positions, estimate_total_cost } = asset.data();
        this.time = time;
        this.reported_total_cost = estimate_total_cost;
        this.assets = data;
        this.positions = positions;
        this.update_assets_table();
      });
    },
    subscribeToPriceChanges() {
      const snapshotsCol = collection(database, "price/history/snapshots");
      // 2. Listen to changes in the entire collection
      onSnapshot(snapshotsCol, (snapshotQuery) => {
        if (snapshotQuery.empty) {
          // If no documents at all, you can early-return or handle appropriately
          console.log("No snapshots found");
          return;
        }

        // 3. Convert each document into an object keyed by date
        const snapshotsData = {};
        snapshotQuery.forEach((docSnap) => {
          snapshotsData[docSnap.id] = docSnap.data();
        });

        // 4. Sort the data by date (doc ID), then map to just the doc values
        this.price_history = sortBy(
          Object.entries(snapshotsData), 
          ([date]) => date  // Sort by the key (the doc ID), which is the date
        ).map(([, value]) => value); // Keep only the value portion

        // 5. The most recent snapshot is the last one in the array
        this.price_map = this.price_history.slice(-1)[0];
        this.update_assets_table();
      });  
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
    is_merge_wallets: function (val) {
      localStorage.is_merge_wallets = val;
    },
    is_show_nav_title: function (val) {
      localStorage.is_show_nav_title = val;
      document.title = this.title;
    },
    language: function (val) {
      localStorage.language = val;
      this.$i18n.locale = val;
    },
    timeframe: async function (val) {
      localStorage.timeframe = val;
      await this.loadData();
    },
    asset_type: function (val) {
      localStorage.asset_type = val;
      this.update_assets_table();
    }
  },
  mounted() {
    this.screen_width =
      window.innerWidth > 0 ? window.innerWidth : screen.width;

    document.documentElement.setAttribute(
      "data-theme",
      this.is_dark_mode ? "dark" : "light"
    );
  },
  created: async function () {
    this.$i18n.locale = this.language;

    try {
      await this.loadData();
      this.subscribeToAssetChanges();
      this.subscribeToPriceChanges();
    } catch (error) {
      console.error("Error in created hook:", error);
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
  font-family: monospace;
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

.highcharts-legend-item text {
  color: var(--color-text) !important;
  fill: var(--color-text) !important;
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
  max-width: 75px;
}

.entry-price>input {
  font-size: 12px;
  width: 100%;
  text-align: right;
  font-family: monospace;
  background-color: var(--color-bg);
  border: var(--color-bg);
  color: var(--color-text);
  border-style: hidden;
  box-sizing: border-box;
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

#quick-access {
  display: flex;
  justify-content: space-between;
  height: 35.5px;
}

.setting-btn {
  width: 40px;
  justify-content: space-around;
  font-size: 18px;
  z-index: 999;
  display: flex;
  align-items: center;
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
  cursor: pointer;
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

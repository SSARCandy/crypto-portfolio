<template>
  <div id="main">
    <button class="btn nav-btn" v-on:click="is_nav_mode = !is_nav_mode">
      <i class="fas fa-chart-line"></i>
    </button>

    <account-value v-if="is_nav_mode" :daily_nav="daily_nav" />
    <div v-if="!is_nav_mode">
      <pie-chart v-if="assets.length > 0" :assets="assets" />
      <table id="asset">
        <tr>
          <th>Token</th>
          <th>Size</th>
          <th>Price</th>
          <th>Value</th>
          <th>Entry</th>
          <th>PnL</th>
          <th v-if="screen_width > 500">Return</th>
        </tr>
        <tr v-for="asset in assets" v-bind:key="asset.asset">
          <td>{{ asset.asset }}</td>
          <td>{{ asset.size | Number(2) }}</td>
          <td>{{ asset.price | Number(2) }}</td>
          <td>{{ (asset.size * asset.price) | Number(0) }}</td>
          <td class="entry-price">
            <input v-model="userdata[asset.asset]" type="number" />
          </td>
          <td v-bind:class="color(pnl(asset))">{{ pnl(asset) | Number(0) }}</td>
          <td v-bind:class="color(pnl(asset))" v-if="screen_width > 500">
            {{ pnl_return(asset) | Precentage(2) }}
          </td>
        </tr>
      </table>
      <footer>
        <span>Last Update: {{ lastUpdate() }}</span>
        <button v-on:click="save" class="save">
          {{ saved ? "Done!" : "Save" }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import PieChart from "./PieChart.vue";
import AccountValue from "./AccountValue";
import sortBy from "lodash/sortBy";
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

const firebaseConfig = {
  apiKey: "AIzaSyAiOeRX2NENGgKbW0VVQ4xR0gbPuyKJ5Ks",
  authDomain: "binance-portfolio-153c4.firebaseapp.com",
  projectId: "binance-portfolio-153c4",
  storageBucket: "binance-portfolio-153c4.appspot.com",
  messagingSenderId: "694089558371",
  appId: "1:694089558371:web:4e512f91c263ca77ad4b56",
  measurementId: "G-VT35JJGKW4",
};
initializeApp(firebaseConfig);
getAnalytics();

const database = getFirestore();

export default {
  name: "Main",
  components: {
    PieChart,
    AccountValue,
  },
  props: {},
  data() {
    return {
      id: window.location.host,
      time: "",
      assets: [],
      userdata: {},
      daily_nav: [],

      saved: false,
      screen_width: 0,

      is_nav_mode: false,
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
      return `${(v * 100 || 0).toFixed(demical)}%`;
    },
  },
  methods: {
    lastUpdate() {
      return `${((dayjs() - dayjs(this.time)) / (1000 * 60)).toFixed(
        0
      )} min ago`;
    },
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
    color: (v) => {
      return { buy: v > 0, sell: v < 0 };
    },
  },
  mounted() {
    this.screen_width =
      window.innerWidth > 0 ? window.innerWidth : screen.width;

    document.title = `${this.id.split('.')[0]}'s Portfolio`;
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
      this.assets = sortBy(data, [
        function (o) {
          return -o.price * o.size;
        },
      ]);
    });

    const doc3 = doc(database, `nav/${this.id}`);
    const daily_nav = await getDoc(doc3);
    if (daily_nav.exists()) {
      this.daily_nav = sortBy(Object.entries(daily_nav.data()), (o) => o[0]);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  font-family: monospace;
  max-width: 800px;
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
  border: 1px solid #ddd;
}

tr:hover {
  background-color: #eee;
}

.bg-dead {
  background-color: #bbb;
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
  max-width: 60px;
}

.entry-price > input {
  border: white;
  width: 100%;
  text-align: right;
  font-family: monospace;
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

footer {
  padding-top: 10px;
  padding-bottom: 10px;
}

button {
  background: initial;
  border: #dfdfdf 2px solid;
  border-radius: 2px;
}

button:hover {
  background-color: #eee;
}
</style>

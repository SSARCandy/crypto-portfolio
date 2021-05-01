  <template>
  <div>
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
</template>

<script>
import PieChart from "./PieChart.vue";
import sortBy from "lodash/sortBy";
import dayjs from "dayjs";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getFirestore, onSnapshot, doc, getDoc, setDoc } from "@firebase/firestore";
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
  },
  props: {},
  data() {
    return {
      id: window.location.host,
      time: "",
      assets: [],
      userdata: {},

      saved: false,
      screen_width: 0,
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
  },
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

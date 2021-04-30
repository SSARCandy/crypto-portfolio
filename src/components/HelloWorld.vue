<template>
  <div>
    <div
      id="container"
      style="height: 400px; width: 500"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="doDrag"
      @touchmove="doDrag"
    ></div>
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
import _ from "lodash";
import $ from "jquery";
import Highcharts from "highcharts";
import dayjs from "dayjs";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const database = firebase.firestore().collection("config");

export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      id: window.location.host,
      time: "",
      assets: [],
      userdata: {},

      dragging: false,
      chart_size: null,
      chart: null,
      startAngle: 0,
      startAngleOffset: 0,
      saved: false,
      screen_width: 0,
    };
  },
  computed: {
    sorted: function () {
      return _.orderBy(
        this.strategies,
        this.sort_key,
        this.sort_order ? "desc" : "asc"
      );
    },
    nav: function () {
      return _.sum(this.assets.map(({ price, size }) => price * size));
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
      return `${(v * 100 || 0).toFixed(demical)}%`;
    },
  },
  methods: {
    lastUpdate() {
      return `${((dayjs() - dayjs(this.time)) / (1000 * 60)).toFixed(
        0
      )} min ago`;
    },
    save() {
      database
        .doc(this.id)
        .set(this.userdata)
        .then(() => {
          this.saved = true;
          setTimeout(() => {
            this.saved = false;
          }, 5000);
        });
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
    getDegree(event) {
      const x = event.offsetX ? event.offsetX : event.touches[0].clientX;
      const y = event.offsetY ? event.offsetY : event.touches[0].clientY;
      const [w, h] = this.chart_size;
      const offset = [w / 2 - x, h / 2 - y];
      const radians = Math.atan2(offset[1], offset[0]);
      return (radians * 57.29) % 360;
    },
    startDrag(event) {
      this.dragging = true;
      const degree = this.getDegree(event);
      this.startAngleOffset = this.startAngle - degree;
    },
    stopDrag() {
      this.dragging = false;
    },
    doDrag(event) {
      if (this.dragging) {
        const degree = this.getDegree(event);
        this.startAngle = degree + this.startAngleOffset;
        this.chart.series[0].update({
          startAngle: this.startAngle,
        });
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    initChart() {
      this.chart = Highcharts.chart("container", {
        chart: {
          type: "pie",
          animation: false,
        },
        plotOptions: {
          pie: {
            size: "80%",
            innerSize: "80%",
            dataLabels: {
              distance: "2%",
              alignTo: "toPlotEdges",
              filter: {
                property: "percentage",
                operator: ">",
                value: 5,
              },
              overflow: "allow",
              crop: true,
            },
          },
          series: {
            animation: false,
          },
        },
        title: {
          verticalAlign: "middle",
          floating: true,
          text: `Total<br>$${new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(this.nav)}`,
        },
        tooltip: {
          pointFormat: "<b>{point.percentage:.1f}%</b>",
        },
        series: [
          {
            name: "",
            colorByPoint: true,
            data: this.assets.map((x) => [x.asset, x.price * x.size]),
          },
        ],
      });
      this.chart_size = [$("#container").width(), $("#container").height()];
    },
  },
  mounted() {
    window.addEventListener("touchend", this.stopDrag, { passive: false });
    window.addEventListener("mouseup", this.stopDrag, { passive: false });
    this.screen_width =
      window.innerWidth > 0 ? window.innerWidth : screen.width;
  },
  created: async function () {
    const res = await fetch("/asset.json");
    const json = await res.json();
    this.time = json.time;
    this.assets = _.sortBy(json.data, [
      function (o) {
        return -o.price * o.size;
      },
    ]);

    database
      .doc(this.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.userdata = doc.data();
        }
      });

    this.initChart();
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

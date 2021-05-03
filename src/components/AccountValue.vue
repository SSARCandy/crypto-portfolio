<template>
  <div>
    <highcharts
      id="account-nav"
      style="height: 300px; width: 500"
      :options="chartOptions"
    ></highcharts>
    <table id="nav-table">
      <tr>
        <th>Date</th>
        <th>Value</th>
      </tr>
      <tr v-for="d in reversed_data" v-bind:key="d[0]">
        <td>{{ d[0] }}</td>
        <td>$ {{ d[1] | Number(0) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  name: "AccountValue",
  props: {
    daily_nav: Array,
  },
  components: {
    highcharts: Chart,
  },
  data() {
    return {};
  },
  filters: {
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
  },
  computed: {
    reversed_data: function () {
      return [].concat(this.daily_nav).reverse();
    },
    chartOptions: function () {
      return {
        chart: {
          type: "areaspline",
          animation: false,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: "Account Value",
        },
        plotOptions: {
          series: {
            animation: false,
            marker: {
              radius: 0,
            },
          },
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats:{
            day: '%d %b %Y'    //ex- 01 Jan 2016
          },
          labels: {
            rotation: 0,
            format: '{value:%m-%d}',
          }
        },
        yAxis: {
          title: {
            enabled: false,
          },
          labels: {
            formatter: function () {
              const v = this.value;
              const l =
                Math.abs(v) > 999
                  ? Math.sign(v) * (Math.abs(v) / 1000).toFixed(1) + "k"
                  : Math.sign(v) * Math.abs(v);
              return `$ ${l}`;
            },
          },
        },
        tooltip: {
          pointFormat: "<b>${point.y:.0f}</b>",
        },
        series: [
          {
            name: "",
            data: this.daily_nav.map((v) => {
              const [y, m, d] = v[0].split('-');
              return [Date.UTC(y, +m-1, d), v[1]];
            }),
          },
        ],
      };
    },
  },
  methods: {},
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

th:nth-child(1),
td:nth-child(1) {
  text-align: left;
}

tr:hover {
  background-color: #eee;
}
</style>

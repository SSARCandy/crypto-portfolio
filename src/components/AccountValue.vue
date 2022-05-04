<template>
  <div>
    <highcharts
      id="account-nav"
      style="height: 300px; width: 500"
      :options="chartOptions"
    ></highcharts>
    <export-table :table_id="'nav-table'" />
    <table id="nav-table">
      <tr>
        <th>{{ $t("date") }}</th>
        <th>{{ $t("nav") }}</th>
        <th>{{ $t("diff") }}</th>
      </tr>
      <tr v-for="(d, i) in reversed_data" v-bind:key="d[0]">
        <td>{{ d[0] }}</td>
        <td>$ {{ d[1] | Number(0) }}</td>
        <td v-bind:class="color(dail_pnl(i))">
          {{ dail_pnl(i) | Number(0) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import ExportTable from "./ExportTable.vue";

export default {
  name: "AccountValue",
  props: {
    daily_nav: Array,
    estimate_total_cost: Number,
  },
  components: {
    highcharts: Chart,
    ExportTable,
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
      return this.daily_nav.slice().reverse();
    },
    chartOptions: function () {
      return {
        chart: {
          type: "area",
          animation: false,
          // styledMode: true,
        },
        legend: {
          enabled: true,
        },
        title: {
          text: this.$i18n.t("nav_page"),
        },
        plotOptions: {
          areaspline: {
            threshold: null,
          },
          series: {
            animation: {
              duration: 500,
            },
            marker: {
              radius: 0,
            },
            fillOpacity: 0,
          },
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%d %b %Y", //ex- 01 Jan 2016
          },
          labels: {
            rotation: 0,
            format: "{value:%m-%d}",
          },
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
            name: this.$i18n.t('nav'),
            background: "#00f",
            fillOpacity: 1,
            data: this.daily_nav.map((v) => {
              const [y, m, d] = v[0].split("-");
              return [Date.UTC(y, +m - 1, d), v[1]];
            }),
          },
        ],
      };
    },
  },
  methods: {
    dail_pnl(idx) {
      return (
        this.reversed_data[idx][1] -
        this.reversed_data[Math.min(idx + 1, this.reversed_data.length - 1)][1]
      );
    },
    color(v) {
      return { buy: v > 0, sell: v < 0 };
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
th:nth-child(1),
td:nth-child(1) {
  text-align: left;
}
</style>

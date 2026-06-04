<template>
  <div>
    <highcharts
      id="account-nav"
      style="height: 300px; width: 500"
      :options="chartOptions"
    ></highcharts>
    <div class="flex-container">
      <div>
        <button
          v-for="tf in timeframes"
          v-bind:key="tf.value"
          v-on:click="pick_range(tf.value)"
          :class="{ selected: timeframe === tf.value }"
        >
          {{ $t(tf.label) }}
        </button>
      </div>
      <export-table :table_id="'nav-table'" />
    </div>
    <table id="nav-table">
      <tr>
        <th>{{ $t("date") }}</th>
        <th>{{ $t("nav") }}</th>
        <th>{{ $t("diff") }}</th>
        <th>{{ $t("daily_change_percent") }}</th>
      </tr>
      <tr v-for="(d, i) in reversed_data" v-bind:key="d[0]">
        <td>{{ d[0] }}</td>
        <td>$ {{ d[1] | Number(0) }}</td>
        <td v-bind:class="color(dail_pnl(i))">
          {{ dail_pnl(i) | Number(0) }}
        </td>
        <td v-bind:class="color(dail_pnl_percent(i))">
          {{ dail_pnl_percent(i) | Precentage(2) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { number_formatter } from "../common/utils";
import { filters, methods } from "../common/common";
import { Chart } from "highcharts-vue";
import ExportTable from "./ExportTable.vue";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";

export default {
  name: "AccountValue",
  props: {
    daily_nav: Array,
    estimate_total_cost: Number,
    is_relative_chart: Boolean,
    benchmark_asset: String,
    price_snapshots: { type: Object, default: () => ({}) },
  },
  components: {
    highcharts: Chart,
    ExportTable,
  },
  data() {
    return {
      timeframe: 30,
      timeframes: [
        { label: '7d', value: 7 },
        { label: '30d', value: 30 },
        { label: '90d', value: 90 },
        { label: '180d', value: 180 },
        { label: '365d', value: 365 },
        { label: 'all', value: undefined }
      ],
    };
  },
  filters: filters,
  computed: {
    reversed_data: function () {
      return this.daily_nav.slice().reverse().slice(0, this.timeframe);
    },
    chartOptions: function () {
      const isRelative = this.is_relative_chart;
      let chart_data = this.daily_nav
        .map((v) => {
          const [y, m, d] = v[0].split("-");
          return [Date.UTC(y, +m - 1, d), v[1]];
        })
        .slice(-this.timeframe);

      if (isRelative && chart_data.length > 0) {
        const base = chart_data[0][1];
        chart_data = chart_data.map((d) => [d[0], base === 0 ? 0 : ((d[1] - base) / base) * 100]);
      }

      let baseline_data = [];
      console.log("chartOptions eval:", { benchmark: this.benchmark_asset, nav_len: this.daily_nav.length, snap_keys: Object.keys(this.price_snapshots).length });
      if (this.benchmark_asset && this.benchmark_asset !== 'none' && this.daily_nav.length > 0) {
        const symbol = this.benchmark_asset;
        const sliced_nav = this.timeframe ? this.daily_nav.slice(-this.timeframe) : this.daily_nav.slice(0);
        
        let startPrice = null;
        for (let i = 0; i < sliced_nav.length; i++) {
           const snapshot = this.price_snapshots[sliced_nav[i][0]];
           if (snapshot && snapshot[symbol]) {
             startPrice = snapshot[symbol];
             break;
           }
        }
        console.log("startPrice:", startPrice, "for symbol:", symbol);

        if (startPrice) {
          const initialNav = sliced_nav[0][1];
          let lastPrice = startPrice;

          baseline_data = sliced_nav.map((v) => {
            const [y, m, d] = v[0].split("-");
            const timestamp = Date.UTC(y, +m - 1, d);
            const snapshot = this.price_snapshots[v[0]];
            const p = (snapshot && snapshot[symbol]) ? snapshot[symbol] : lastPrice;
            lastPrice = p;

            let val = 0;
            if (isRelative) {
               val = ((p - startPrice) / startPrice) * 100;
            } else {
               val = (p / startPrice) * initialNav;
            }
            return [timestamp, val];
          });
        }
      }
      console.log("baseline_data length:", baseline_data.length);

      const series = [
        {
          name: this.$i18n.t("nav"),
          background: "#00f",
          fillOpacity: 0.3,
          data: chart_data,
        },
      ];

      if (baseline_data.length > 0) {
        series.push({
          type: 'line',
          name: this.benchmark_asset,
          color: '#ff9900',
          data: baseline_data,
          dashStyle: 'ShortDash',
          marker: {
            enabled: false
          }
        });
      }

      let yAxisMin = chart_data.length > 0 ? minBy(chart_data, (x) => x[1])[1] : undefined;
      let yAxisMax = chart_data.length > 0 ? maxBy(chart_data, (x) => x[1])[1] : undefined;
      if (baseline_data.length > 0) {
        const baseMin = minBy(baseline_data, (x) => x[1])[1];
        const baseMax = maxBy(baseline_data, (x) => x[1])[1];
        yAxisMin = Math.min(yAxisMin, baseMin);
        yAxisMax = Math.max(yAxisMax, baseMax);
      }

      return {
        accessibility: {
          enabled: false,
        },
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
            dataLabels: {
              enabled: true,
              verticalAlign: "top",
              y: -20,
              formatter: function () {
                if (this.series.index !== 0) return;
                const isLast = this.x === this.series.data[this.series.data.length - 1].x;
                if (this.y === this.series.dataMax || isLast) {
                  return isRelative ? this.y.toFixed(2) + "%" : number_formatter(this.y);
                }
              },
            },
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
          min: yAxisMin,
          max: yAxisMax,
          title: {
            enabled: false,
          },
          labels: {
            formatter: function () {
              return isRelative ? this.value.toFixed(2) + "%" : number_formatter(this.value);
            },
            style: {
              fontSize: 9,
            },
          },
        },
        tooltip: {
          shared: true,
          pointFormat: isRelative 
            ? '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}%</b><br/>' 
            : '<span style="color:{series.color}">{series.name}</span>: <b>${point.y:.0f}</b><br/>',
        },
        series: series,
      };
    },
  },
  methods: {
    ...methods,
    dail_pnl(idx) {
      return (
        this.reversed_data[idx][1] -
        this.reversed_data[Math.min(idx + 1, this.reversed_data.length - 1)][1]
      );
    },
    dail_pnl_percent(idx) {
      const prev = this.reversed_data[Math.min(idx + 1, this.reversed_data.length - 1)][1];
      if (!prev) return 0;
      return (this.reversed_data[idx][1] - prev) / prev;
    },
    pick_range(v) {
      this.timeframe = v;
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
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
}
.selected {
  background: rgba(170, 170, 170, 0.603);
}

</style>
<style>
.highcharts-grid-line {
  stroke: var(--color-border) !important;
}
</style>

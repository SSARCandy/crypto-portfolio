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
          v-on:click="pick_range(7)"
          :class="{ selected: timeframe === 7 }"
        >
          7d
        </button>
        <button
          v-on:click="pick_range(30)"
          :class="{ selected: timeframe === 30 }"
        >
          30d
        </button>
        <button
          v-on:click="pick_range(90)"
          :class="{ selected: timeframe === 90 }"
        >
          90d
        </button>
        <button
          v-on:click="pick_range(180)"
          :class="{ selected: timeframe === 180 }"
        >
          180d
        </button>
        <button
          v-on:click="pick_range(undefined)"
          :class="{ selected: timeframe === undefined }"
        >
          ALL
        </button>
      </div>
      <export-table :table_id="'nav-table'" />
    </div>
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
  },
  components: {
    highcharts: Chart,
    ExportTable,
  },
  data() {
    return {
      timeframe: 30,
    };
  },
  filters: filters,
  computed: {
    reversed_data: function () {
      return this.daily_nav.slice().reverse().slice(0, this.timeframe);
    },
    chartOptions: function () {
      return {
        chart: {
          type: "area",
          animation: false,
          // styledMode: true,
        },
        legend: {
          enabled: false,
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
                if (this.y === this.series.dataMax) {
                  return number_formatter(this.y);
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
          min: minBy(this.reversed_data, (x) => x[1])[1],
          max: maxBy(this.reversed_data, (x) => x[1])[1],
          title: {
            enabled: false,
          },
          labels: {
            formatter: function () {
              return number_formatter(this.value);
            },
            style: {
              fontSize: 9,
            }
          },
        },
        tooltip: {
          pointFormat: "<b>${point.y:.0f}</b>",
        },
        series: [
          {
            name: this.$i18n.t("nav"),
            background: "#00f",
            fillOpacity: 0.3,
            data: this.daily_nav
              .map((v) => {
                const [y, m, d] = v[0].split("-");
                return [Date.UTC(y, +m - 1, d), v[1]];
              })
              .slice(-this.timeframe),
          },
        ],
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

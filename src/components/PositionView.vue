<template>
  <div>
    <footer style="display: flex; justify-content: space-between">
      <ul style="list-style: none; padding-left: 0">
        <li>{{ $t("positions_count") }}: {{ positions.length }}</li>
        <li>{{ $t("total_initial_size") }}: {{ total_initial_size | Number(0) }}</li>
        <li>{{ $t("total_position_size") }}: {{ total_posiion_size | Number(0) }}</li>
        <li>
          {{ $t("total_unrealized_pnl") }}:
          <span v-bind:class="color(unrealized)">
            {{ unrealized | Number(0) }} ({{ unrealized / total_initial_size | Precentage(1) }})
          </span>
        </li>
      </ul>
    </footer>
    <div style="display: flex; justify-content: space-between; padding-bottom: 5px;">
      <input type="text" v-model="keywords" placeholder="Search...">
      <export-table :table_id="'position-table'" />
    </div>
    <table id="position-table">
      <tr>
        <th v-on:click="change_sortkey('symbol')">
          {{ sorted_icon("symbol") }}{{ $t("symbol") }}
        </th>
        <th v-on:click="change_sortkey('markPrice')">
          {{ sorted_icon("markPrice") }}{{ $t("mark_price") }}
        </th>
        <th v-on:click="change_sortkey('initial_size')">
          {{ sorted_icon("initial_size") }}{{ $t("initial_size") }}
        </th>
        <th v-on:click="change_sortkey('unRealizedProfit')">
          {{ sorted_icon("unRealizedProfit") }}{{ $t("unrealized_pnl") }}
        </th>
        <th v-on:click="change_sortkey('pnl_return')">
          {{ sorted_icon("pnl_return") }}{{ $t("pnl_return") }}
        </th>
      </tr>
      <tr v-for="d in sorted" v-bind:key="d.symbol">
        <td>{{ d.symbol }}</td>
        <td>{{ d.markPrice | toPrecision(5) }}</td>
        <td>{{ d.initial_size | Number(0) }}</td>
        <td v-bind:class="color(d.unRealizedProfit)">{{ d.unRealizedProfit | Number(1) }}</td>
        <td v-bind:class="color(d.unRealizedProfit)">{{ d.pnl_return | Precentage(1) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { filters, methods } from "../common/common";
import ExportTable from "./ExportTable.vue";
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import sum from 'lodash/sum';

export default {
  name: "PositionView",
  props: {
    positions: Array,
  },
  components: {
    ExportTable,
  },
  data() {
    return {
      keywords: '',
      sort_key: "unRealizedProfit",
      sort_order: true,
    };
  },
  filters: filters,
  computed: {
    sorted() {
      return orderBy(this.positions
        .map((x) => {
          const initial_size = (Math.abs(x.notional - x.unRealizedProfit));
          return {
            ...x,
            initial_size,
            pnl_return: x.unRealizedProfit / initial_size,
          };
        })
        .filter((x) => {
          return this.keywords.length === 0 || x.symbol.includes(this.keywords.toUpperCase());
        })
        , this.sort_key, this.sort_order ? "desc" : "asc");
    },
    unrealized() {
      return sumBy(this.positions, 'unRealizedProfit');
    },
    total_initial_size() {
      return sum(this.positions.map(x => Math.abs(x.notional - x.unRealizedProfit)));
    },
    total_posiion_size() {
      return sum(this.positions.map(x => Math.abs(x.notional)));
    },
  },
  methods: {
    ...methods,
    sorted_icon(k) {
      if (k !== this.sort_key) return "";
      return this.sort_order ? "↓" : "↑";
    },
    change_sortkey(k) {
      if (k === this.sort_key) {
        this.sort_order = !this.sort_order;
      } else {
        this.sort_key = k;
      }
    },
  },
  mounted() { },
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

input {
  font-size: 12px;
  width: 40%;
  font-family: monospace;
  border-style: hidden;
  border-bottom: solid 1px;
  border-color: var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
}
</style>

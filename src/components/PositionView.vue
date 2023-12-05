<template>
  <div>
    <footer style="display: flex; justify-content: space-between">
      <ul style="list-style: none; padding-left: 0">
        <li>{{ $t("positions_count") }}: {{ sorted.length }}</li>
        <li>{{ $t("total_initial_size") }}: {{ total_initial_size | Number(0) }}</li>
        <li>
          {{ $t("total_unrealized_pnl") }}:
          <span v-bind:class="color(unrealized)">
            {{ unrealized | Number(0) }} ({{ unrealized / total_initial_size | Precentage(1) }})
          </span>
        </li>
      </ul>
    </footer>
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
        <th v-on:click="change_sortkey('notional')">
          {{ sorted_icon("notional") }}{{ $t("position_notional") }}
        </th>
        <th v-on:click="change_sortkey('unRealizedProfit')">
          {{ sorted_icon("unRealizedProfit") }}{{ $t("unrealized_pnl") }}
        </th>
      </tr>
      <tr v-for="d in sorted" v-bind:key="d.symbol">
        <td>{{ d.symbol }}</td>
        <td>{{ d.markPrice | toPrecision(5) }}</td>
        <td>{{ d.initial_size | Number(0) }}</td>
        <td v-bind:class="color(d.notional)">{{ d.notional | Number(0) }}</td>
        <td v-bind:class="color(d.unRealizedProfit)">{{ d.unRealizedProfit | Number(1) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import sum from 'lodash/sum';
import { filters, methods } from "../common/common";

export default {
  name: "PositionView",
  props: {
    positions: Array,
  },
  components: {
  },
  data() {
    return {
      sort_key: "unRealizedProfit",
      sort_order: true,
    };
  },
  filters: filters,
  computed: {
    sorted() {
      return orderBy(this.positions
        .map((x) => ({
          ...x,
          initial_size: (Math.abs(x.notional - x.unRealizedProfit)),
        }))
        , this.sort_key, this.sort_order ? "desc" : "asc");
    },
    unrealized() {
      return sumBy(this.positions, 'unRealizedProfit');
    },
    total_initial_size() {
      return sum(this.positions.map(x => Math.abs(x.notional - x.unRealizedProfit)));
    }
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
</style>

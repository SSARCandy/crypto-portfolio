<template>
  <highcharts
    id="pie"
    style="height: 400px; width: 500"
    :options="chartOptions"
  ></highcharts>
</template>

<script>
import { sum } from "lodash";
import { Chart } from "highcharts-vue";

export default {
  name: "PieChart",
  props: {
    assets: Array,
  },
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      dragging: false,
      chart_size: null,
      startAngle: 0,
      startAngleOffset: 0,
    };
  },
  computed: {
    nav: function () {
      return sum(this.assets.map(({ price, size }) => price * size));
    },
    chartOptions: function () {
      return {
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
            startAngle: this.startAngle,
            data: this.assets.map((x) => [x.asset, x.price * x.size]),
          },
        ],
      };
    },
  },
  methods: {
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
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    },
  },
  mounted() {
    const dom = document.getElementById("pie");
    this.chart_size = [dom.offsetWidth, dom.offsetHeight];
    window.addEventListener("touchend", this.stopDrag, { passive: false });
    window.addEventListener("mouseup", this.stopDrag, { passive: false });
    dom.addEventListener("mousedown", this.startDrag, { passive: false });
    dom.addEventListener("mousemove", this.doDrag, { passive: false });
    dom.addEventListener("touchstart", this.startDrag, { passive: false });
    dom.addEventListener("touchmove", this.doDrag, { passive: false });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

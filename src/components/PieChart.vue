<template>
    <div
      id="container"
      style="height: 400px; width: 500"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="doDrag"
      @touchmove="doDrag"
    ></div>
</template>

<script>
import _ from "lodash";
import $ from "jquery";
import Highcharts from "highcharts";


export default {
  name: "PieChart",
  props: {
    assets: Array,
  },
  data() {
    return {
      dragging: false,
      chart_size: null,
      chart: null,
      startAngle: 0,
      startAngleOffset: 0,
    };
  },
  computed: {
    nav: function () {
      return _.sum(this.assets.map(({ price, size }) => price * size));
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
    this.initChart();
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

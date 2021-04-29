var app = new Vue({
    el: '#app',
    data: {
        time: '',
        assets: [],
        nav: 0,
        dragging: false,
        chart_size: null,
        chart: null,
        startAngle: 0,
        startAngleOffset: 0,
    },
    computed: {
        sorted: function () {
            return _.orderBy(this.strategies, this.sort_key, this.sort_order ? 'desc' : 'asc');
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
            const option = typeof (toFixed) === 'number' ? {
                maximumFractionDigits: toFixed,
                minimumFractionDigits: toFixed,
            } : {};
            return new Intl.NumberFormat('en-US', option).format(v);
        },
        Precentage: (v, demical = 1) => {
            return `${(v * 100 || 0).toFixed(demical)}%`;
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
            const degree = this.getDegree(event)
            this.startAngleOffset = this.startAngle - degree;
        },
        stopDrag() {
            this.dragging = false;
        },
        doDrag(event) {
            if (this.dragging) {
                const degree = this.getDegree(event)
                this.startAngle = degree + this.startAngleOffset;
                this.chart.series[0].update({
                    startAngle: this.startAngle
                });
            }
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    },
    mounted() {
        window.addEventListener('touchend', this.stopDrag, { passive: false });
        window.addEventListener('mouseup', this.stopDrag, { passive: false });
    },
    created: async function () {
        const res = await fetch('/asset.json');
        const json = await res.json();
        this.time = json.time;
        this.assets = _.sortBy(json.data, [function (o) { return -o.price * o.size; }]);
        this.nav = _.sum(this.assets.map(({ price, size }) => price * size));

        this.chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                animation: false
            },
            plotOptions: {
                pie: {
                    size: '80%',
                    innerSize: '80%',
                    dataLabels: {
                        distance: '2%',
                        alignTo: 'toPlotEdges',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 5
                        },
                        overflow: 'allow',
                        crop: true
                    }
                },
                series: {
                    animation: false
                }
            },
            title: {
                verticalAlign: 'middle',
                floating: true,
                text: `Total<br>$${new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }).format(this.nav)}`,
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: this.assets.map(x => [x.asset, x.price * x.size])
            }]
        });
        this.chart_size = [$("#container").width(), $("#container").height()];
    },
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

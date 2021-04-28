var app = new Vue({
    el: '#app',
    data: {
        time: '',
        assets: [],
        nav: 0,
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
    },
    created: async function () {
        const res = await fetch('/asset.json');
        const json = await res.json();
        this.time = json.time;
        this.assets = _.sortBy(json.data, [function (o) { return -o.price * o.size; }]);
        this.nav = _.sum(this.assets.map(({ price, size }) => price * size));

        $('#container').highcharts({
            chart: {
                type: 'pie',
            },
            plotOptions: {
                pie: {
                    size: '90%',
                    innerSize: '80%',
                    dataLabels: {
                        distance: '2%',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 2
                        },
                        overflow: 'allow',
                        crop: false
                    }
                }
            },
            title: {
                verticalAlign: 'middle',
                floating: true,
                text: `Total<br>$${ new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }).format(this.nav) }`,
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: this.assets.map(x => [x.asset, x.price*x.size])
            }]
        });
    },
});

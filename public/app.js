/* global Vue */
/* global dayjs */

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
        this.nav = _.sum(this.assets.map(({price, size}) => price*size));

        const data = {
            labels: this.assets.map(x => x.asset),
            datasets: [{
                data: this.assets.map(x => (x.price * x.size).toFixed(0)),
                backgroundColor: [
                    '#A41623',
                    '#F85E00',
                    '#FFB563',
                    '#FFD29D',
                    '#918450',
                    '#8CB369',
                    '#F4E285',
                    '#F4A259',
                    '#5B8E7D',
                    '#BC4B51',
                    '#384D48',
                    '#ACAD94',
                    '#E08E45',
                    '#F8F4A6',
                    '#BDF7B7',
                    '#3943B7',
                    '#F7A072',
                    '#0FA3B1',
                    '#EDDEA4',
                    '#0F084B',
                ],
                hoverOffset: 4
            }]
        };
        const myChart = new Chart(
            document.getElementById('myChart'), {
            type: 'pie',
            data,
            options: {
                legend: {
                    display: false
                }
            }
        }
        );
    },
});

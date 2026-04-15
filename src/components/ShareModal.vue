<template>
  <div class="modal" v-on:click="$emit('close')">
    <div class="modal-content" v-on:click.stop>

      <!-- ── Share card captured as PNG ── -->
      <div ref="card" class="share-card" :class="is_dark_mode ? 'dark' : 'light'">
        <div class="card-top">
          <span class="card-title">{{ $t('share_portfolio_title') }}</span>
          <span class="card-date">{{ today }}</span>
        </div>

        <pie-chart
          :assets="pieData"
          chart-id="pie-share"
          :height="300"
          :center-title="centerLabel"
        />

        <div class="card-stats" v-if="show_nav || show_pnl_return">
          <div class="stat" v-if="show_pnl_return">
            <div class="stat-label">{{ $t('pnl_return') }}</div>
            <div class="stat-val" :class="pnl_return >= 0 ? 'pos' : 'neg'">
              {{ pnl_return >= 0 ? '+' : '' }}{{ (pnl_return * 100).toFixed(2) }}%
            </div>
          </div>
          <div class="stat" v-if="show_nav">
            <div class="stat-label">{{ $t('nav') }}</div>
            <div class="stat-val">$ {{ nav | Number(0) }}</div>
          </div>
        </div>
      </div>

      <div class="options">
        <div class="toggle-row">
          <label class="switch">
            <input type="checkbox" v-model="show_nav" />
            <span class="slider round"></span>
          </label>
          <span>{{ $t('share_show_nav') }}</span>
        </div>
        <div class="toggle-row">
          <label class="switch">
            <input type="checkbox" v-model="show_pnl_return" />
            <span class="slider round"></span>
          </label>
          <span>{{ $t('share_show_pnl') }}</span>
        </div>
      </div>

      <button class="export-btn" :disabled="exporting" v-on:click="exportPng">
        <i class="fas fa-save"></i>
        {{ exporting ? $t('generating') : $t('save_png') }}
      </button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { filters } from '../common/common';
import PieChart from './PieChart.vue';

const MAX_ITEMS = 5;

export default {
  name: 'ShareModal',
  filters,
  components: { PieChart },
  props: {
    chart_data:  Array,
    nav:         Number,
    pnl_return:  Number,
    is_dark_mode: Boolean,
  },
  data() {
    return {
      show_nav: true,
      show_pnl_return: true,
      exporting: false,
    };
  },
  computed: {
    sorted() {
      return [...this.chart_data].sort((a, b) => b.value - a.value);
    },
    pieData() {
      const top = this.sorted.slice(0, MAX_ITEMS);
      const rest = this.sorted.slice(MAX_ITEMS);
      if (!rest.length) return top;
      return [...top, { name: 'Others', value: rest.reduce((s, d) => s + d.value, 0) }];
    },
    centerLabel() {
      if (!this.show_nav && !this.show_pnl_return) return '';

      const sign  = this.pnl_return >= 0 ? '+' : '';
      const color = this.pnl_return >= 0 ? '#2ecc71' : '#e74c3c';
      const textColor = this.is_dark_mode ? '#e8e8f0' : '#1a1d2e';
      const pnlHtml = `<span style="color:${color};font-weight:bold;font-size:18px">${sign}${(this.pnl_return * 100).toFixed(2)}%</span>`;
      const navFormatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.nav);
      const navHtml = `<span style="font-size:15px;color:${textColor};font-weight:bold">$${navFormatted}</span>`;

      if (this.show_nav && this.show_pnl_return) return `${navHtml}<br>${pnlHtml}`;
      if (this.show_nav)        return navHtml;
      if (this.show_pnl_return) return pnlHtml;
      return '';
    },
    today() {
      return new Date().toISOString().slice(0, 10);
    },
    cardBg() {
      return this.is_dark_mode ? '#1a1d2e' : '#f0f4ff';
    },
  },
  methods: {
    async exportPng() {
      this.exporting = true;
      await this.$nextTick();
      try {
        const canvas = await html2canvas(this.$refs.card, {
          scale: 2,
          backgroundColor: this.cardBg,
          useCORS: true,
          logging: false,
        });

        const fileName = `portfolio_${this.today}.png`;

        // Try Web Share API first on mobile (best for iOS/Android photos app)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && navigator.share && navigator.canShare) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], fileName, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'Crypto Portfolio',
              });
              this.exporting = false;
              return;
            } catch (err) {
              if (err.name === 'AbortError') {
                this.exporting = false;
                return;
              }
              console.warn('Share failed, falling back to download', err);
            }
          }
        }

        // Fallback: Traditional download link (Desktop)
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (e) {
        console.error('Export failed', e);
      }
      this.exporting = false;
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
}

.modal-content {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  width: 90%;
  max-width: 420px;
  padding: 18px;
  box-sizing: border-box;
}

.options {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

/* ── Slider toggle (same as Setting.vue) ── */
.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 14px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: ease 0.1s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 0px;
  bottom: -3px;
  background-color: var(--color-border);
  transition: ease 0.1s;
}

input:checked + .slider      { background-color: #2196f3; }
input:focus  + .slider       { box-shadow: 0 0 1px #2196f3; }
input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round        { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }

/* ── Share card ── */
.share-card {
  border-radius: 12px;
  padding: 16px 20px 10px;
  font-family: 'Courier New', monospace;
  margin-bottom: 14px;
}

.share-card.dark  { background: #1a1d2e; color: #e8e8f0; }
.share-card.light { background: #f0f4ff; color: #1a1d2e; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.share-card.dark  .card-title { color: #a0a8ff; }
.share-card.light .card-title { color: #4059FB; }

.card-title { font-size: 14px; font-weight: bold; }

.share-card.dark  .card-date { color: #aaa; }
.share-card.light .card-date { color: #555; }

.card-date { font-size: 11px; }

/* ── Stats ── */
.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 10px;
  margin-top: 4px;
}

.share-card.dark  .card-stats { border-top: 1px solid #2d3150; }
.share-card.light .card-stats { border-top: 1px solid #c8d0e8; }

.share-card.dark  .stat-label { color: #aaa; }
.share-card.light .stat-label { color: #555; }

.stat-label { font-size: 10px; margin-bottom: 2px; }

.stat-val { font-size: 18px; font-weight: bold; }

.pos { color: #2ecc71; }
.neg { color: #e74c3c; }

.share-card.dark  .card-brand { color: #444; }
.share-card.light .card-brand { color: #aaa; }

.card-brand { text-align: right; font-size: 9px; margin-top: 6px; }

/* ── Export button ── */
.export-btn {
  width: 100%;
  padding: 10px;
  background: #4059FB;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  font-family: monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn:hover:not(:disabled) { background: #2d45e0; }
.export-btn:disabled { opacity: .5; cursor: not-allowed; }
</style>

<!-- Highcharts theme overrides for pie-share -->
<style>
/* Dark card */
.dark #pie-share .highcharts-background   { fill: #1a1d2e !important; }
.dark #pie-share .highcharts-title        { fill: #e8e8f0 !important; }
.dark #pie-share .highcharts-data-label text { fill: #e8e8f0 !important; }
.dark #pie-share .highcharts-text-outline { fill: #1a1d2e !important; stroke-width: 0; }

/* Light card */
.light #pie-share .highcharts-background  { fill: #f0f4ff !important; }
.light #pie-share .highcharts-title       { fill: #1a1d2e !important; }
.light #pie-share .highcharts-data-label text { fill: #1a1d2e !important; }
.light #pie-share .highcharts-text-outline { fill: #f0f4ff !important; stroke-width: 0; }

#pie-share .highcharts-credits { display: none; }
</style>

<template>
  <div class="modal" v-on:click="$emit('close')">
    <div class="modal-content" v-on:click.stop>
      <div ref="card" class="summary-card" :class="is_dark_mode ? 'dark' : 'light'">
        <div class="card-top">
          <span class="card-title">{{ $t('summary_title') }} ({{ timeframe }})</span>
          <span class="card-date">{{ today }}</span>
        </div>

        <div class="summary-section">
          <div class="section-label">{{ $t('top_gainers') }}</div>
          <div v-if="topGainer && topGainer.length">
            <div class="asset-info" v-for="(g, i) in topGainer" :key="'g'+i" :style="i > 0 ? 'margin-top: 10px' : ''">
              <div class="asset-name">
                {{ g.asset }} 
                <span class="wallet-name">({{ g.wallet }})</span>
              </div>
              <div class="pnl-change pos">{{ format(g.pnl_change) }}</div>
            </div>
          </div>
          <div v-else class="no-data">{{ $t('no_data') }}</div>
        </div>

        <div class="summary-section">
          <div class="section-label">{{ $t('top_losers') }}</div>
          <div v-if="topLoser && topLoser.length">
            <div class="asset-info" v-for="(l, i) in topLoser" :key="'l'+i" :style="i > 0 ? 'margin-top: 10px' : ''">
              <div class="asset-name">
                {{ l.asset }} 
                <span class="wallet-name">({{ l.wallet }})</span>
              </div>
              <div class="pnl-change neg">{{ format(l.pnl_change) }}</div>
            </div>
          </div>
          <div v-else class="no-data">{{ $t('no_data') }}</div>
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

export default {
  name: 'SummaryModal',
  props: {
    topGainer: Object,
    topLoser: Object,
    timeframe: String,
    is_dark_mode: Boolean,
  },
  data() {
    return {
      exporting: false,
    };
  },
  computed: {
    today() {
      return new Date().toISOString().slice(0, 10);
    },
    cardBg() {
      return this.is_dark_mode ? '#1a1d2e' : '#f0f4ff';
    },
  },
  methods: {
    format(val) {
      return (val >= 0 ? "+" : "") + val.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    },
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

        const fileName = `summary_${this.today}.png`;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && navigator.share && navigator.canShare) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], fileName, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'Portfolio Summary',
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

        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (e) {
        console.error('Export failed', e);
      }
      this.exporting = false;
    },
  }
}
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
  max-width: 400px;
  padding: 18px;
  box-sizing: border-box;
}

.summary-card {
  border-radius: 12px;
  padding: 16px 20px;
  font-family: 'Courier New', monospace;
  margin-bottom: 14px;
}

.summary-card.dark  { background: #1a1d2e; color: #e8e8f0; }
.summary-card.light { background: #f0f4ff; color: #1a1d2e; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-bottom: 10px;
}

.card-title { font-size: 14px; font-weight: bold; }
.card-date { font-size: 11px; color: gray; }

.summary-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 12px;
  color: gray;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.asset-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-name {
  font-size: 16px;
  font-weight: bold;
}

.wallet-name {
  font-size: 12px;
  font-weight: normal;
  color: gray;
}

.pnl-change {
  font-size: 18px;
  font-weight: bold;
}

.pos { color: #2ecc71; }
.neg { color: #e74c3c; }

.no-data {
  font-size: 14px;
  color: gray;
  font-style: italic;
}

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

.export-btn:hover:not(:disabled) {
  background: #2d45e0;
}

.export-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}
</style>

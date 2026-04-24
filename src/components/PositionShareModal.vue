<template>
  <div class="modal" v-on:click="$emit('close')">
    <div class="modal-content" v-on:click.stop>
      <div ref="card" class="position-card" :class="is_dark_mode ? 'dark' : 'light'">
        <div class="card-top">
          <span class="card-title">{{ asset }} ({{ wallet }})</span>
          <span class="card-date">{{ today }}</span>
        </div>

        <div class="pnl-section">
          <div class="pnl-label">{{ $t('pnl_return') }}</div>
          <div class="pnl-val" :class="pnl_return >= 0 ? 'pos' : 'neg'">
            {{ pnl_return >= 0 ? '+' : '' }}{{ (pnl_return * 100).toFixed(2) }}%
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">{{ $t('price') }}</div>
            <div class="stat-val">${{ price | Number(2) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ $t('entry') }}</div>
            <div class="stat-val">${{ entry | Number(2) }}</div>
          </div>
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

export default {
  name: 'PositionShareModal',
  filters,
  props: {
    asset: String,
    wallet: String,
    price: Number,
    entry: [Number, String],
    pnl_return: Number,
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

        const fileName = `position_${this.asset}_${this.today}.png`;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && navigator.share && navigator.canShare) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], fileName, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: `${this.asset} Position Performance`,
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
  max-width: 320px;
  padding: 18px;
  box-sizing: border-box;
}

.position-card {
  border-radius: 12px;
  padding: 20px;
  font-family: 'Courier New', monospace;
  margin-bottom: 14px;
  text-align: center;
}

.position-card.dark  { background: #1a1d2e; color: #e8e8f0; }
.position-card.light { background: #f0f4ff; color: #1a1d2e; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  padding-bottom: 10px;
}

.card-title { font-size: 16px; font-weight: bold; }
.card-date { font-size: 11px; color: gray; }

.pnl-section {
  margin-bottom: 24px;
}

.pnl-label {
  font-size: 14px;
  color: gray;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pnl-val {
  font-size: 32px;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.stat-label {
  font-size: 11px;
  color: gray;
  margin-bottom: 4px;
}

.stat-val {
  font-size: 16px;
  font-weight: bold;
}

.pos { color: #2ecc71; }
.neg { color: #e74c3c; }

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

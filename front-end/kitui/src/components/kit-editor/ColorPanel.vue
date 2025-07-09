<template>
  <div class="tab-panel">
    <h3>Palette de couleurs</h3>

    <div class="form-section">
      <h4>Couleur sombre</h4>
      <div class="control-group">
        <div class="form-row">
          <label for="dark-base">Couleur de base</label>
          <div class="color-picker">
            <input id="dark-base" v-model="config.colors.dark.base" type="color" />
          </div>
        </div>
        <div class="form-row">
          <label>Code hexadécimal</label>
          <input v-model="config.colors.dark.base" type="text" class="color-hex" />
        </div>
      </div>

      <div class="color-variants">
        <div class="color-variant" v-for="(label, index) in ['Plus sombre', 'Base', 'Plus clair']" :key="label">
          <div
              class="color-preview"
              :style="{ backgroundColor: getVariantColor(config.colors.dark.base, index) }"
              @click="copyColorToClipboard(getVariantColor(config.colors.dark.base, index))"
          ></div>
          <span class="variant-label">{{ label }}</span>
          <input
              type="text"
              class="variant-hex"
              :value="getVariantColor(config.colors.dark.base, index)"
              readonly
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>Couleur claire</h4>
      <div class="control-group">
        <div class="form-row">
          <label for="light-base">Couleur de base</label>
          <div class="color-picker">
            <input id="light-base" v-model="config.colors.light.base" type="color" />
          </div>
        </div>
        <div class="form-row">
          <label>Code hexadécimal</label>
          <input v-model="config.colors.light.base" type="text" class="color-hex" />
        </div>
      </div>

      <div class="color-variants">
        <div class="color-variant" v-for="(label, index) in ['Plus sombre', 'Base', 'Plus clair']" :key="label">
          <div
              class="color-preview"
              :style="{ backgroundColor: getVariantColor(config.colors.light.base, index) }"
              @click="copyColorToClipboard(getVariantColor(config.colors.light.base, index))"
          ></div>
          <span class="variant-label">{{ label }}</span>
          <input
              type="text"
              class="variant-hex"
              :value="getVariantColor(config.colors.light.base, index)"
              readonly
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>Couleur d'accent</h4>
      <div class="control-group">
        <div class="form-row">
          <label for="accent-color">Couleur d'accent</label>
          <div class="color-picker">
            <input id="accent-color" v-model="config.colors.accent" type="color" />
          </div>
        </div>
        <div class="form-row">
          <label>Code hexadécimal</label>
          <input v-model="config.colors.accent" type="text" class="color-hex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';

export default {
  props: {
    config: {
      type: Object as PropType<{
        colors: {
          dark: { base: string },
          light: { base: string },
          accent: string
        }
      }>,
      required: true
    }
  },
  emits: ['update:config'],
  mounted() {
    console.log('💡 Config reçu dans ColorPanel.vue:', this.config);
  },
  methods: {
    getVariantColor(hex: string, index: number) {
      switch (index) {
        case 0: return this.getDarkerColor(hex);
        case 2: return this.getLighterColor(hex);
        default: return hex;
      }
    },
    getLighterColor(hex: string) {
      const amt = 30;
      return this.adjustColor(hex, amt);
    },
    getDarkerColor(hex: string) {
      const amt = -30;
      return this.adjustColor(hex, amt);
    },
    adjustColor(hex: string, amt: number) {
      hex = hex.replace(/^#/, '');
      const num = parseInt(hex, 16);
      let r = (num >> 16) + amt;
      let g = ((num >> 8) & 0x00FF) + amt;
      let b = (num & 0x0000FF) + amt;
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },
    copyColorToClipboard(color: string) {
      navigator.clipboard.writeText(color)
          .then(() => {
            console.log('✔️ Couleur copiée: ' + color);
          })
          .catch(err => {
            console.error('❌ Erreur lors de la copie: ', err);
          });
    }
  }
};
</script>

<style scoped>
.tab-panel {
  padding: 1rem 1.25rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.tab-panel h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #334155;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

/* Container des contrôles */
.control-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 1rem;
}

/* Style des lignes de formulaire */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.form-row label {
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.form-row input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
}

.form-row input:focus {
  outline: none;
  border-color: #42b983;
  ring: 2px solid rgba(66, 185, 131, 0.2);
}

.color-hex {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
  font-family: monospace;
}

/* Color picker */
.color-picker {
  width: 100px;
  display: flex;
  justify-content: flex-end;
}

.color-picker input[type="color"] {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  cursor: pointer;
}

.color-variants {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.color-variant {
  text-align: center;
}



.variant-label {
  font-size: 0.75rem;
  color: #64748b;
}

.variant-hex {
  width: 70px;
  font-size: 0.7rem;
  padding: 0.25rem;
  text-align: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-family: monospace;
  margin-top: 0.25rem;
  display: block;
  color: #4b5563;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .control-group {
    width: 100%;
  }

  .form-row input,
  .color-picker {
    width: 120px;
  }
}
</style>
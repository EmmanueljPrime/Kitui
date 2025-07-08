<template>
  <div class="tab-panel">
    <h3>Thème sombre</h3>

    <div class="form-section">
      <div class="form-row switch-row">
        <label for="enable-dark-theme">Activer le thème sombre</label>
        <div class="toggle-switch">
          <input
              id="enable-dark-theme"
              v-model="config.darkTheme.enabled"
              type="checkbox"
          />
          <label for="enable-dark-theme" class="toggle-label"></label>
        </div>
      </div>

      <div v-if="config.darkTheme.enabled" class="dark-theme-options">
        <div class="form-row">
          <label for="dark-theme-background">Fond</label>
          <div class="color-picker-group">
            <div class="color-picker">
              <input
                  id="dark-theme-background"
                  v-model="config.darkTheme.backgroundColor"
                  type="color"
              />
            </div>
            <input
                v-model="config.darkTheme.backgroundColor"
                type="text"
                class="color-hex"
            />
          </div>
        </div>

        <div class="form-row">
          <label for="dark-theme-text">Texte</label>
          <div class="color-picker-group">
            <div class="color-picker">
              <input
                  id="dark-theme-text"
                  v-model="config.darkTheme.textColor"
                  type="color"
              />
            </div>
            <input
                v-model="config.darkTheme.textColor"
                type="text"
                class="color-hex"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="config.darkTheme.enabled" class="preview-section">
      <h5>Aperçu du thème sombre</h5>
      <div class="dark-theme-preview" :style="getDarkThemeStyle()">
        <h3>Exemple de titre</h3>
        <p>Exemple de texte en thème sombre pour montrer à quoi cela ressemblera.</p>
        <div class="buttons-preview">
          <button
              class="preview-button-primary"
              :style="getButtonStyleDark('primary')"
          >
            Bouton primaire
          </button>
          <button
              class="preview-button-secondary"
              :style="getButtonStyleDark('secondary')"
          >
            Bouton secondaire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DarkThemePanel',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  methods: {
    // Méthode pour obtenir le style des boutons en mode sombre
    getButtonStyleDark(type) {
      const buttons = this.config.components?.buttons || {
        paddingY: 8,
        paddingX: 16,
        borderRadius: 4,
        fontSize: 14
      };

      const style = {
        padding: `${buttons.paddingY}px ${buttons.paddingX}px`,
        borderRadius: `${buttons.borderRadius}px`,
        fontSize: `${buttons.fontSize}px`,
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginRight: '8px',
        marginBottom: '8px'
      };

      if (type === 'primary') {
        return {
          ...style,
          backgroundColor: this.config.colors?.accent || '#42b983',
          color: '#ffffff',
          border: 'none'
        };
      } else if (type === 'secondary') {
        return {
          ...style,
          backgroundColor: 'transparent',
          color: this.config.colors?.accent || '#42b983',
          border: `1px solid ${this.config.colors?.accent || '#42b983'}`
        };
      }

      return style;
    },

    // Méthode pour obtenir le style du thème sombre
    getDarkThemeStyle() {
      return {
        backgroundColor: this.config.darkTheme.backgroundColor,
        color: this.config.darkTheme.textColor,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      };
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

.dark-theme-options {
  margin-top: 1.5rem;
  background-color: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

/* Style des lignes de formulaire */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  width: 100%;
}

.form-row label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  margin-right: 1rem;
  min-width: 41px;
  flex-shrink: 0;
}

/* Color picker avec hex */
.color-picker-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-picker {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.color-hex {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
  font-family: monospace;
}

.color-hex:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

/* Toggle switch */
.switch-row {
  margin-bottom: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.3s;
  border-radius: 22px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: #42b983;
}

input:checked + .toggle-label:before {
  transform: translateX(18px);
}

/* Preview section */
.preview-section {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.preview-section h5 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
}

.dark-theme-preview {
  margin-top: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark-theme-preview h3 {
  color: inherit;
  margin-top: 0;
  margin-bottom: 1rem;
}

.dark-theme-preview p {
  margin-bottom: 1.5rem;
}

.buttons-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-button-primary,
.preview-button-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-wrap: wrap;
  }

  .form-row label {
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .color-picker-group {
    width: 100%;
  }

  .color-hex {
    flex: 1;
  }

  .switch-row {
    flex-wrap: nowrap;
  }

  .switch-row label {
    width: auto;
    margin-bottom: 0;
  }
}
</style>
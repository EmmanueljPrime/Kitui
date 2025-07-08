<template>
  <div class="tab-panel">
    <h3>Mise en page</h3>

    <!-- Sous-navigation pour les types de mise en page -->
    <div class="component-tabs">
      <button
          :class="['component-tab', { active: activeLayoutTab === 'container' }]"
          @click="activeLayoutTab = 'container'"
      >
        Conteneur
      </button>
      <button
          :class="['component-tab', { active: activeLayoutTab === 'grid' }]"
          @click="activeLayoutTab = 'grid'"
      >
        Grille
      </button>
    </div>

    <!-- Section Conteneur -->
    <div v-if="activeLayoutTab === 'container'" class="form-section">
      <h4>Conteneur</h4>

      <div class="control-container">
        <!-- Dimensions -->
        <div class="control-group">
          <div class="form-row">
            <label for="container-width">Largeur maximale</label>
            <InputSlider
                id="container-width"
                v-model="config.layout.container.maxWidth"
                :min="320"
                :max="1920"
                :step="10"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="container-padding">Padding</label>
            <InputSlider
                id="container-padding"
                v-model="config.layout.container.padding"
                :min="0"
                :max="100"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="container-margin">Marge extérieure</label>
            <InputSlider
                id="container-margin"
                v-model="config.layout.container.margin"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>
        </div>

        <!-- Apparence -->
        <div class="control-group">
          <div class="form-row">
            <label for="container-border-radius">Arrondi</label>
            <InputSlider
                id="container-border-radius"
                v-model="config.layout.container.borderRadius"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row switch-row">
            <label for="container-shadow-enabled">Ombres</label>
            <div class="toggle-switch">
              <input
                  type="checkbox"
                  id="container-shadow-enabled"
                  v-model="config.layout.container.shadowEnabled"
              />
              <label for="container-shadow-enabled" class="toggle-label"></label>
            </div>
          </div>

          <div v-if="config.layout.container.shadowEnabled">
            <div class="shadow-grid">
              <div class="form-row">
                <label>X</label>
                <InputSlider
                    v-model="config.layout.container.shadowX"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Y</label>
                <InputSlider
                    v-model="config.layout.container.shadowY"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Blur</label>
                <InputSlider
                    v-model="config.layout.container.shadowBlur"
                    :min="0"
                    :max="50"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Opacité</label>
                <InputSlider
                    v-model="config.layout.container.shadowOpacity"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    unit=""
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Style -->
        <div class="control-group">
          <div class="form-row">
            <label for="container-bg-color">Couleur fond</label>
            <div class="color-picker">
              <input
                  id="container-bg-color"
                  v-model="config.layout.container.backgroundColor"
                  type="color"
              />
            </div>
          </div>

          <div class="form-row">
            <label for="container-border-width">Bordure</label>
            <InputSlider
                id="container-border-width"
                v-model="config.layout.container.borderWidth"
                :min="0"
                :max="10"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row" v-if="config.layout.container.borderWidth > 0">
            <label for="container-border-color">Couleur bordure</label>
            <div class="color-picker">
              <input
                  id="container-border-color"
                  v-model="config.layout.container.borderColor"
                  type="color"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <h5>Aperçu</h5>
        <div class="container-preview" :style="getContainerStyle()">
          <div class="container-content">
            Contenu du conteneur
          </div>
        </div>
      </div>
    </div>

    <!-- Section Grille -->
    <div v-if="activeLayoutTab === 'grid'" class="form-section">
      <h4>Grille Responsive</h4>

      <div class="control-container">
        <!-- Configuration de base -->
        <div class="control-group">
          <div class="form-row">
            <label for="grid-columns">Nombre de colonnes</label>
            <InputSlider
                id="grid-columns"
                v-model="config.layout.grid.columns"
                :min="1"
                :max="12"
                :step="1"
                unit="col"
            />
          </div>

          <div class="form-row">
            <label for="grid-gap">Espacement (gap)</label>
            <InputSlider
                id="grid-gap"
                v-model="config.layout.grid.gap"
                :min="0"
                :max="100"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="grid-row-gap">Espacement vertical</label>
            <InputSlider
                id="grid-row-gap"
                v-model="config.layout.grid.rowGap"
                :min="0"
                :max="100"
                :step="1"
                unit="px"
            />
          </div>
        </div>

        <!-- Comportement -->
        <div class="control-group">
          <div class="form-row">
            <label for="grid-auto-rows">Hauteur des lignes</label>
            <select
                id="grid-auto-rows"
                v-model="config.layout.grid.autoRows"
            >
              <option value="auto">Auto</option>
              <option value="min-content">Contenu minimum</option>
              <option value="max-content">Contenu maximum</option>
              <option value="1fr">Fraction égale (1fr)</option>
            </select>
          </div>

          <div class="form-row">
            <label for="grid-auto-flow">Direction du flux</label>
            <select
                id="grid-auto-flow"
                v-model="config.layout.grid.autoFlow"
            >
              <option value="row">Rangées</option>
              <option value="column">Colonnes</option>
              <option value="dense">Dense</option>
            </select>
          </div>

          <div class="form-row switch-row">
            <label for="grid-center-items">Centrer éléments</label>
            <div class="toggle-switch">
              <input
                  type="checkbox"
                  id="grid-center-items"
                  v-model="config.layout.grid.centerItems"
              />
              <label for="grid-center-items" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      <!-- Points de rupture - section séparée pour plus de clarté sur mobile -->
      <div class="breakpoints-section">
        <h5>Points de rupture</h5>
        <div class="breakpoints-container">
          <div
              v-for="(breakpoint, index) in config.layout.grid.breakpoints"
              :key="index"
              class="breakpoint-item"
          >
            <div class="breakpoint-controls">
              <span class="breakpoint-label">{{ breakpoint.name }}</span>
              <InputSlider
                  v-model="breakpoint.value"
                  :min="0"
                  :max="2000"
                  :step="10"
                  unit="px"
                  class="breakpoint-slider"
              />
              <button
                  class="remove-button"
                  @click="removeBreakpoint(index)"
                  v-if="config.layout.grid.breakpoints.length > 1"
                  aria-label="Supprimer le point de rupture"
              >
                ×
              </button>
            </div>
          </div>

          <button class="add-button" @click="addBreakpoint">
            + Ajouter un point de rupture
          </button>
        </div>
      </div>

      <div class="preview-section">
        <h5>Aperçu</h5>
        <div class="grid-preview-wrapper">
          <div class="grid-preview" :style="getGridStyle()">
            <div
                v-for="i in 6"
                :key="i"
                class="grid-item"
                :style="getGridItemStyle()"
            >
              Item {{ i }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InputSlider from '../common/InputSlider.vue';

export default {
  name: 'LayoutPanel',
  components: {
    InputSlider
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeLayoutTab: 'container'
    };
  },
  created() {
    // S'assurer que toutes les propriétés sont initialisées
    if (!this.config.layout.container.borderWidth) {
      this.initializeContainerProps();
    }
    if (!this.config.layout.grid.autoRows) {
      this.initializeGridProps();
    }
  },
  methods: {
    // Initialiser les propriétés du conteneur si elles n'existent pas
    initializeContainerProps() {
      const defaultContainerProps = {
        margin: 'auto',
        borderWidth: 1,
        borderColor: '#28594c',
        borderRadius: 8,
        backgroundColor: '#1e2f34',
        shadowEnabled: false,
        shadowX: 0,
        shadowY: 4,
        shadowBlur: 12,
        shadowOpacity: 0.1
      };

      // Fusionner avec la configuration existante
      this.config.layout.container = {
        ...this.config.layout.container,
        ...defaultContainerProps
      };
    },

    // Initialiser les propriétés de la grille si elles n'existent pas
    initializeGridProps() {
      const defaultGridProps = {
        rowGap: this.config.layout.grid.gap || 16,
        autoRows: 'auto',
        autoFlow: 'row',
        centerItems: false
      };

      // Fusionner avec la configuration existante
      this.config.layout.grid = {
        ...this.config.layout.grid,
        ...defaultGridProps
      };
    },

    // Ajouter un point de rupture
    addBreakpoint() {
      this.config.layout.grid.breakpoints.push({
        name: `breakpoint-${this.config.layout.grid.breakpoints.length + 1}`,
        value: 768
      });
    },

    // Supprimer un point de rupture
    removeBreakpoint(index) {
      this.config.layout.grid.breakpoints.splice(index, 1);
    },

    // Obtenir le style du conteneur pour l'aperçu
    getContainerStyle() {
      const container = this.config.layout.container;
      const style = {
        maxWidth: `${container.maxWidth}px`,
        padding: `${container.padding}px`,
        margin: typeof container.margin === 'number' ? `${container.margin}px` : container.margin,
        borderRadius: `${container.borderRadius}px`,
        backgroundColor: container.backgroundColor || '#ffffff',
        border: container.borderWidth > 0 ? `${container.borderWidth}px solid ${container.borderColor}` : 'none'
      };

      // Appliquer les styles d'ombre si activés
      if (container.shadowEnabled) {
        const shadowColor = this.hexToRgba(container.shadowColor || '#000000', container.shadowOpacity);
        style.boxShadow = `${container.shadowX}px ${container.shadowY}px ${container.shadowBlur}px ${shadowColor}`;
      }

      return style;
    },

    // Obtenir le style de la grille pour l'aperçu
    getGridStyle() {
      const grid = this.config.layout.grid;
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
        gap: `${grid.rowGap || grid.gap}px ${grid.gap}px`,
        gridAutoRows: grid.autoRows,
        gridAutoFlow: grid.autoFlow,
        placeItems: grid.centerItems ? 'center' : 'stretch',
        width: '100%'
      };
    },

    // Obtenir le style des éléments de la grille pour l'aperçu
    getGridItemStyle() {
      return {
        padding: '1rem',
        backgroundColor: this.hexToRgba(this.config.colors?.accent || '#42b983', 0.1),
        border: `1px solid ${this.hexToRgba(this.config.colors?.accent || '#42b983', 0.3)}`,
        borderRadius: '4px',
        textAlign: 'center',
        color: this.config.colors?.dark?.base || '#333333'
      };
    },

    // Utilitaire pour convertir une couleur hex en rgba
    hexToRgba(hex, opacity) {
      // Par défaut, utiliser noir si hex n'est pas défini
      hex = hex || '#000000';

      // Enlever le # si présent
      hex = hex.replace('#', '');

      // Convertir en RGB
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
};
</script>

<style scoped>
/* Base et reset */
* {
  box-sizing: border-box;
}

.tab-panel {
  padding: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 100%;
  overflow-x: hidden;
}

.tab-panel h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #334155;
}

.tab-panel h4, .tab-panel h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.tab-panel h5 {
  font-size: 0.875rem;
  border-bottom: none;
}

/* Styles pour le sous-menu des composants */
.component-tabs {
  display: flex;
  margin-bottom: 1.25rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  overflow: hidden;
  width: 100%;
}

.component-tab {
  flex: 1;
  padding: 0.75rem 1rem;
  text-align: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #64748b;
}

.component-tab.active {
  background-color: #42b983;
  color: white;
}

.component-tab:hover:not(.active) {
  background-color: #e2e8f0;
  color: #334155;
}

/* Container des contrôles */
.control-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.control-group {
  flex: 1;
  min-width: 240px;
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
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  padding-right: 0.5rem;
}

.form-row select {
  width: 100px;
  max-width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
}

.form-row select:focus {
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
  min-width: 40px;
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

/* Shadow grid */
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  width: 100%;
}

.shadow-grid .form-row {
  margin-bottom: 0;
}

/* Breakpoints */
.breakpoints-section {
  margin-bottom: 1.5rem;
}

.breakpoints-container {
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.375rem;
  width: 100%;
}

.breakpoint-item {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
}

.breakpoint-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.breakpoint-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  width: 100%;
}

.breakpoint-label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  min-width: 60px;
}

.breakpoint-slider {
  flex: 1;
  min-width: 180px;
}

.remove-button {
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
}

.add-button {
  background-color: #f1f5f9;
  color: #42b983;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: center;
}

.add-button:hover {
  background-color: #e2e8f0;
}

/* Preview section */
.preview-section {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
  margin-bottom: 1rem;
}

.container-preview {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.container-content {
  padding: 2rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 4px;
  color: #4b5563;
}

.grid-preview-wrapper {
  width: 100%;
  overflow-x: auto;
  padding: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.grid-preview {
  width: 100%;
  min-height: 180px;
}

.grid-item {
  padding: 1rem;
  background-color: rgba(66, 185, 131, 0.1);
  border: 1px solid rgba(66, 185, 131, 0.3);
  border-radius: 4px;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Media queries pour améliorer le responsive */
@media (max-width: 768px) {
  .control-container {
    flex-direction: column;
  }

  .control-group {
    width: 100%;
  }

  .breakpoint-controls {
    justify-content: space-between;
  }

  .breakpoint-label {
    flex: 0 0 auto;
  }

  .grid-preview {
    min-width: 500px;
  }
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row label {
    margin-bottom: 0.5rem;
  }

  .form-row select,
  .color-picker {
    width: 100%;
  }

  .shadow-grid {
    grid-template-columns: 1fr;
  }

  .shadow-grid .form-row {
    flex-direction: row;
  }

  .breakpoint-slider {
    min-width: 140px;
  }

  .breakpoint-controls {
    justify-content: space-between;
  }

  .grid-preview {
    min-width: 400px;
  }
}
</style>
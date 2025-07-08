<template>
  <div class="tab-panel">
    <h3>Composants</h3>

    <!-- Sous-navigation pour les composants -->
    <div class="component-tabs">
      <button
          :class="['component-tab', { active: activeComponentTab === 'buttons' }]"
          @click="activeComponentTab = 'buttons'"
      >
        Boutons
      </button>
      <button
          :class="['component-tab', { active: activeComponentTab === 'cards' }]"
          @click="activeComponentTab = 'cards'"
      >
        Cartes
      </button>
    </div>

    <!-- Section Boutons -->
    <div v-if="activeComponentTab === 'buttons'" class="form-section">
      <h4>Boutons</h4>

      <div class="control-container">
        <!-- Dimensions -->
        <div class="control-group">
          <div class="form-row">
            <label for="button-padding-v">Padding vertical</label>
            <InputSlider
                id="button-padding-v"
                v-model="config.components.buttons.paddingY"
                :min="0"
                :max="30"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="button-padding-h">Padding horizontal</label>
            <InputSlider
                id="button-padding-h"
                v-model="config.components.buttons.paddingX"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="button-border-radius">Arrondi</label>
            <InputSlider
                id="button-border-radius"
                v-model="config.components.buttons.borderRadius"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="button-font-size">Taille texte</label>
            <InputSlider
                id="button-font-size"
                v-model="config.components.buttons.fontSize"
                :min="10"
                :max="24"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="button-font-weight">Graisse texte</label>
            <select
                id="button-font-weight"
                v-model="config.components.buttons.fontWeight"
            >
              <option value="300">Léger (300)</option>
              <option value="400">Normal (400)</option>
              <option value="700">Gras (700)</option>
              <option value="900">Extra gras (900)</option>
            </select>
          </div>
        </div>

        <!-- Apparence -->
        <div class="control-group">
          <div class="form-row">
            <label for="button-border-width">Bordure</label>
            <InputSlider
                id="button-border-width"
                v-model="config.components.buttons.borderWidth"
                :min="0"
                :max="10"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="button-hover-scale">Effet survol</label>
            <InputSlider
                id="button-hover-scale"
                v-model="config.components.buttons.hoverScale"
                :min="1"
                :max="1.5"
                :step="0.05"
                unit="×"
            />
          </div>

          <div class="form-row">
            <label for="button-transition-duration">Transition</label>
            <InputSlider
                id="button-transition-duration"
                v-model="config.components.buttons.transitionDuration"
                :min="0"
                :max="1000"
                :step="50"
                unit="ms"
            />
          </div>
        </div>

        <!-- Ombres -->
        <div class="control-group">
          <div class="form-row switch-row">
            <label for="button-shadow-enabled">Ombres</label>
            <div class="toggle-switch">
              <input
                  type="checkbox"
                  id="button-shadow-enabled"
                  v-model="config.components.buttons.shadowEnabled"
              />
              <label for="button-shadow-enabled" class="toggle-label"></label>
            </div>
          </div>

          <div v-if="config.components.buttons.shadowEnabled">
            <div class="shadow-grid">
              <div class="form-row">
                <label>X</label>
                <InputSlider
                    v-model="config.components.buttons.shadowX"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Y</label>
                <InputSlider
                    v-model="config.components.buttons.shadowY"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Blur</label>
                <InputSlider
                    v-model="config.components.buttons.shadowBlur"
                    :min="0"
                    :max="50"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Opacité</label>
                <InputSlider
                    v-model="config.components.buttons.shadowOpacity"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    unit=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <h5>Aperçu</h5>
        <div class="buttons-preview">
          <button class="preview-button-primary" :style="getButtonStyle('primary')">Primaire</button>
          <button class="preview-button-secondary" :style="getButtonStyle('secondary')">Secondaire</button>
          <button class="preview-button-dark" :style="getButtonStyle('dark')">Sombre</button>
          <button class="preview-button-primary" :style="getButtonStyle('primary', true)" disabled>Désactivé</button>
        </div>
      </div>
    </div>

    <!-- Section Cartes -->
    <div v-if="activeComponentTab === 'cards'" class="form-section">
      <h4>Cartes</h4>

      <div class="control-container">
        <!-- Dimensions -->
        <div class="control-group">
          <div class="form-row">
            <label for="card-padding">Padding externe</label>
            <InputSlider
                id="card-padding"
                v-model="config.components.cards.padding"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="card-inner-padding">Espacement interne</label>
            <InputSlider
                id="card-inner-padding"
                v-model="config.components.cards.innerPadding"
                :min="0"
                :max="30"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="card-border-radius">Arrondi</label>
            <InputSlider
                id="card-border-radius"
                v-model="config.components.cards.borderRadius"
                :min="0"
                :max="50"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="card-title-weight">Graisse titre</label>
            <select
                id="card-title-weight"
                v-model="config.components.cards.titleWeight"
            >
              <option value="400">Normal (400)</option>
              <option value="700">Gras (700)</option>
              <option value="900">Extra gras (900)</option>
            </select>
          </div>

          <div class="form-row">
            <label for="card-text-weight">Graisse texte</label>
            <select
                id="card-text-weight"
                v-model="config.components.cards.textWeight"
            >
              <option value="300">Léger (300)</option>
              <option value="400">Normal (400)</option>
              <option value="700">Gras (700)</option>
            </select>
          </div>
        </div>

        <!-- Apparence -->
        <div class="control-group">
          <div class="form-row">
            <label for="card-border-width">Bordure</label>
            <InputSlider
                id="card-border-width"
                v-model="config.components.cards.borderWidth"
                :min="0"
                :max="10"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-row">
            <label for="card-hover-effect">Effet au survol</label>
            <select
                id="card-hover-effect"
                v-model="config.components.cards.hoverEffect"
            >
              <option value="none">Aucun</option>
              <option value="lift">Élévation</option>
              <option value="shadow">Ombre</option>
              <option value="border">Bordure</option>
              <option value="glow">Lueur</option>
            </select>
          </div>

          <div class="form-row">
            <label for="card-bg-color">Couleur fond</label>
            <div class="color-picker">
              <input
                  id="card-bg-color"
                  v-model="config.components.cards.backgroundColor"
                  type="color"
              />
            </div>
          </div>
        </div>

        <!-- Ombres -->
        <div class="control-group">
          <div class="form-row switch-row">
            <label for="card-shadow-enabled">Ombres</label>
            <div class="toggle-switch">
              <input
                  type="checkbox"
                  id="card-shadow-enabled"
                  v-model="config.components.cards.shadowEnabled"
              />
              <label for="card-shadow-enabled" class="toggle-label"></label>
            </div>
          </div>

          <div v-if="config.components.cards.shadowEnabled">
            <div class="shadow-grid">
              <div class="form-row">
                <label>X</label>
                <InputSlider
                    v-model="config.components.cards.shadowX"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Y</label>
                <InputSlider
                    v-model="config.components.cards.shadowY"
                    :min="-20"
                    :max="20"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Blur</label>
                <InputSlider
                    v-model="config.components.cards.shadowBlur"
                    :min="0"
                    :max="50"
                    :step="1"
                    unit="px"
                />
              </div>

              <div class="form-row">
                <label>Opacité</label>
                <InputSlider
                    v-model="config.components.cards.shadowOpacity"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    unit=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <h5>Aperçu</h5>
        <div class="card-preview" :style="getCardStyle()">
          <h4 :style="getCardTitleStyle()">Titre de la carte</h4>
          <p :style="getCardTextStyle()">Contenu de la carte avec du texte pour montrer l'apparence.</p>
          <button class="preview-button-primary" :style="getButtonStyle('primary')">Action</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InputSlider from '../common/InputSlider.vue';

export default {
  name: 'ComponentsPanel',
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
      activeComponentTab: 'buttons'
    };
  },
  created() {
    // S'assurer que toutes les nouvelles propriétés sont initialisées
    if (!this.config.components.buttons.borderWidth) {
      this.initializeButtonProps();
    }
    if (!this.config.components.cards.borderWidth) {
      this.initializeCardProps();
    }
  },
  methods: {
    // Initialiser les nouvelles propriétés des boutons si elles n'existent pas
    initializeButtonProps() {
      const defaultButtonProps = {
        borderWidth: 1,
        borderStyle: 'solid',
        hoverScale: 1.05,
        hoverDarken: 5,
        shadowEnabled: true,
        shadowX: 0,
        shadowY: 2,
        shadowBlur: 8,
        shadowSpread: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        transitionDuration: 300,
        transitionTiming: 'ease',
        fontWeight: '700' // Modifié de 500 à 700 pour plus de contraste
      };

      // Fusionner avec la configuration existante
      this.config.components.buttons = {
        ...this.config.components.buttons,
        ...defaultButtonProps
      };
    },

    // Initialiser les nouvelles propriétés des cartes si elles n'existent pas
    initializeCardProps() {
      const defaultCardProps = {
        innerPadding: 10,
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        shadowEnabled: true,
        shadowX: 0,
        shadowY: 2,
        shadowBlur: 8,
        shadowSpread: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        hoverEffect: 'lift',
        titleWeight: '700',   // Modifié de 600 à 700 pour plus de contraste
        textWeight: '400'     // Explicitement défini à 400 (normal)
      };

      // Fusionner avec la configuration existante
      this.config.components.cards = {
        ...this.config.components.cards,
        ...defaultCardProps
      };
    },

    // Méthode pour obtenir le style des boutons
    getButtonStyle(type, disabled = false) {
      const buttons = this.config.components.buttons;
      const border = `${buttons.borderWidth}px ${buttons.borderStyle}`;

      // Style de base commun à tous les boutons
      const style = {
        padding: `${buttons.paddingY}px ${buttons.paddingX}px`,
        borderRadius: `${buttons.borderRadius}px`,
        fontSize: `${buttons.fontSize}px`,
        fontWeight: buttons.fontWeight,
        transition: `all ${buttons.transitionDuration}ms ${buttons.transitionTiming}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      };

      // Shadow style
      if (buttons.shadowEnabled) {
        const shadowColor = this.hexToRgba(buttons.shadowColor, buttons.shadowOpacity);
        style.boxShadow = `${buttons.shadowX}px ${buttons.shadowY}px ${buttons.shadowBlur}px ${buttons.shadowSpread}px ${shadowColor}`;
      }

      // Hover style
      if (!disabled) {
        style['&:hover'] = {
          transform: `scale(${buttons.hoverScale})`,
          boxShadow: buttons.shadowEnabled ?
              `${buttons.shadowX}px ${buttons.shadowY + 2}px ${buttons.shadowBlur + 4}px ${buttons.shadowSpread}px ${this.hexToRgba(buttons.shadowColor, buttons.shadowOpacity + 0.1)}` :
              'none'
        };
      }

      // Type-specific styles
      if (type === 'primary') {
        return {
          ...style,
          backgroundColor: this.config.colors.accent,
          color: '#ffffff',
          border: buttons.borderStyle !== 'none' ? `${border} ${this.config.colors.accent}` : 'none'
        };
      } else if (type === 'secondary') {
        return {
          ...style,
          backgroundColor: 'transparent',
          color: this.config.colors.accent,
          border: `${border} ${this.config.colors.accent}`
        };
      } else if (type === 'dark') {
        return {
          ...style,
          backgroundColor: this.config.colors.dark.base,
          color: this.config.colors.light.base,
          border: buttons.borderStyle !== 'none' ? `${border} ${this.config.colors.dark.base}` : 'none'
        };
      }

      return style;
    },

    // Méthode pour obtenir le style des titres de carte
    getCardTitleStyle() {
      return {
        fontWeight: this.config.components.cards.titleWeight
      };
    },

    // Méthode pour obtenir le style du texte de carte
    getCardTextStyle() {
      return {
        fontWeight: this.config.components.cards.textWeight
      };
    },

    // Méthode pour obtenir le style des cartes
    getCardStyle() {
      const cards = this.config.components.cards;
      const style = {
        padding: `${cards.padding}px`,
        borderRadius: `${cards.borderRadius}px`,
        backgroundColor: cards.backgroundColor,
        color: this.config.colors.dark.base,
        border: cards.borderWidth > 0 ? `${cards.borderWidth}px ${cards.borderStyle} ${cards.borderColor}` : 'none',
        transition: 'all 0.3s ease'
      };

      // Styles pour les éléments internes de la carte
      const titleStyle = {
        fontWeight: cards.titleWeight
      };

      const textStyle = {
        fontWeight: cards.textWeight
      };

      // Appliquer les styles pour l'ombre
      if (cards.shadowEnabled) {
        const shadowColor = this.hexToRgba(cards.shadowColor, cards.shadowOpacity);
        style.boxShadow = `${cards.shadowX}px ${cards.shadowY}px ${cards.shadowBlur}px ${cards.shadowSpread}px ${shadowColor}`;
      }

      // Ajouter des styles pour l'effet de survol
      if (cards.hoverEffect !== 'none') {
        style['&:hover'] = {};

        switch (cards.hoverEffect) {
          case 'lift':
            style['&:hover'].transform = 'translateY(-5px)';
            style['&:hover'].boxShadow = `${cards.shadowX}px ${cards.shadowY + 5}px ${cards.shadowBlur + 5}px ${cards.shadowSpread}px ${this.hexToRgba(cards.shadowColor, cards.shadowOpacity + 0.1)}`;
            break;
          case 'shadow':
            style['&:hover'].boxShadow = `${cards.shadowX}px ${cards.shadowY}px ${cards.shadowBlur + 10}px ${cards.shadowSpread + 5}px ${this.hexToRgba(cards.shadowColor, cards.shadowOpacity + 0.2)}`;
            break;
          case 'border':
            style['&:hover'].border = `${cards.borderWidth + 1}px ${cards.borderStyle} ${this.config.colors.accent}`;
            break;
          case 'glow':
            style['&:hover'].boxShadow = `0 0 15px 0 ${this.hexToRgba(this.config.colors.accent, 0.5)}`;
            break;
        }
      }

      return style;
    },

    // Utilitaire pour convertir une couleur hex en rgba
    hexToRgba(hex, opacity) {
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

.tab-panel h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

/* Styles pour le sous-menu des composants */
.component-tabs {
  display: flex;
  margin-bottom: 1.25rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  overflow: hidden;
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
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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
}

.form-row label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  margin-right: 1rem;
  min-width: 41px;
  flex-shrink: 0;
}

.form-row select {
  width: 100px;
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

/* Color picker */
.color-picker {
  width: 60px;
  min-width: 60px;
  display: flex;
  justify-content: center;
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
}

.shadow-grid .form-row {
  margin-bottom: 0;
}

.shadow-grid .form-row label {
  min-width: 40px;
}

/* Preview section */
.preview-section {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.preview-section h5 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
}

.buttons-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preview-button-primary,
.preview-button-secondary,
.preview-button-dark {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-button-primary {
  background-color: #42b983;
  color: white;
  border: none;
}

.preview-button-secondary {
  background-color: transparent;
  color: #42b983;
  border: 1px solid #42b983;
}

.preview-button-dark {
  background-color: #333;
  color: white;
  border: none;
}

.preview-button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-preview {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-preview h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  border-bottom: none;
  padding-bottom: 0;
}

.card-preview p {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .control-container {
    flex-direction: column;
    gap: 1rem;
  }

  .control-group {
    width: 100%;
  }

  .shadow-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

@media (max-width: 480px) {
  .form-row label {
    min-width: 70px;
    font-size: 0.8rem;
  }

  .shadow-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .shadow-grid .form-row label {
    min-width: 30px;
    font-size: 0.75rem;
  }
}
</style>
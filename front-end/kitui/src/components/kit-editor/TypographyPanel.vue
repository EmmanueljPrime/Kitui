<template>
  <div class="tab-panel typography-panel">
    <h3>Typographie</h3>

    <div class="form-section">
      <h4>Texte</h4>
      <div class="form-group">
        <label for="text-font-family">Famille de police pour le texte</label>
        <select id="text-font-family" v-model="config.typography.text.family">
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica Neue</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Open Sans', sans-serif">Open Sans</option>
          <option value="'Lato', sans-serif">Lato</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', Times, serif">Times New Roman</option>
        </select>
      </div>

      <div class="form-group">
        <label for="text-font-size">Taille de base du texte</label>
        <InputSlider
            id="text-font-size"
            v-model="config.typography.text.size"
            :min="12"
            :max="24"
            :step="1"
            unit="px"
        />
      </div>

      <div class="form-group">
        <label for="text-line-height">Hauteur de ligne</label>
        <InputSlider
            id="text-line-height"
            v-model="config.typography.text.lineHeight"
            :min="1"
            :max="2"
            :step="0.1"
            unit="×"
        />
      </div>
    </div>

    <div class="form-section">
      <h4>Titres</h4>
      <div class="form-group">
        <label for="heading-font-family">Famille de police pour les titres</label>
        <select id="heading-font-family" v-model="config.typography.headings.family">
          <option value="">Identique au texte</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica Neue</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Open Sans', sans-serif">Open Sans</option>
          <option value="'Lato', sans-serif">Lato</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', Times, serif">Times New Roman</option>
        </select>
      </div>

      <div class="heading-levels">
        <div v-for="level in 6" :key="`h${level}`" class="heading-level">
          <h5>H{{ level }}</h5>
          <div class="form-group">
            <label :for="`h${level}-size`">Taille</label>
            <InputSlider
                :id="`h${level}-size`"
                v-model="config.typography.headings.sizes[level-1]"
                :min="12"
                :max="72"
                :step="1"
                unit="px"
            />
          </div>

          <div class="form-group">
            <label :for="`h${level}-weight`">Graisse</label>
            <select
                :id="`h${level}-weight`"
                v-model="config.typography.headings.weights[level-1]"
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra-Bold (800)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-section">
      <h5>Aperçu du texte</h5>
      <div class="text-preview" :style="getTextStyle()">
        <p>La typographie est l'art de mettre en forme votre contenu. Cette prévisualisation vous montre à quoi ressemblera votre texte avec les paramètres actuels.</p>
      </div>

      <div class="headings-preview">
        <div v-for="level in 3" :key="`preview-h${level}`" class="heading-preview" :style="getHeadingStyle(level)">
          Titre de niveau {{ level }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import InputSlider from '../common/InputSlider.vue';

export default defineComponent({
  name: 'TypographyPanel',
  components: {
    InputSlider
  },
  props: {
    config: {
      type: Object as PropType<any>,
      required: true
    }
  },
  created() {
    // Initialiser les propriétés de typographie manquantes
    this.initializeConfig();
  },
  methods: {
    initializeConfig() {
      // S'assurer que toutes les propriétés nécessaires existent
      if (!this.config.typography) {
        this.config.typography = {};
      }

      // Initialiser les propriétés du texte
      if (!this.config.typography.text) {
        this.config.typography.text = {
          family: "'Roboto', sans-serif",
          size: 16,
          lineHeight: 1.5,
          weight: 400
        };
      } else {
        // S'assurer que toutes les sous-propriétés existent
        if (!this.config.typography.text.lineHeight) {
          this.config.typography.text.lineHeight = 1.5;
        }
        if (!this.config.typography.text.weight) {
          this.config.typography.text.weight = 400;
        }
      }

      // Initialiser les propriétés des titres
      if (!this.config.typography.headings) {
        this.config.typography.headings = {
          family: "",
          sizes: [32, 28, 24, 20, 18, 16],
          weights: [700, 700, 600, 600, 600, 600]
        };
      } else {
        // S'assurer que toutes les sous-propriétés existent
        if (!this.config.typography.headings.sizes || !Array.isArray(this.config.typography.headings.sizes)) {
          this.config.typography.headings.sizes = [32, 28, 24, 20, 18, 16];
        }
        if (!this.config.typography.headings.weights || !Array.isArray(this.config.typography.headings.weights)) {
          this.config.typography.headings.weights = [700, 700, 600, 600, 600, 600];
        }
      }
    },

    // Style pour l'aperçu du texte
    getTextStyle() {
      return {
        fontFamily: this.config.typography.text.family,
        fontSize: `${this.config.typography.text.size}px`,
        lineHeight: this.config.typography.text.lineHeight,
        fontWeight: this.config.typography.text.weight
      };
    },

    // Style pour l'aperçu des titres
    getHeadingStyle(level) {
      const headingFamily = this.config.typography.headings.family || this.config.typography.text.family;

      return {
        fontFamily: headingFamily,
        fontSize: `${this.config.typography.headings.sizes[level-1]}px`,
        fontWeight: this.config.typography.headings.weights[level-1],
        marginBottom: '0.5rem'
      };
    }
  }
});
</script>

<style scoped>
.typography-panel {
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
.form-group {
  margin-bottom: 1rem;
}

/* Style des lignes de formulaire */
.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
}

.form-group select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

/* Niveau de titre */
.heading-levels {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.heading-level {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.heading-level h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

/* Preview section */
.preview-section {
  background-color: #f8fafc;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-top: 1.5rem;
}

.preview-section h5 {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
}

.text-preview {
  padding: 1rem;
  background-color: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.headings-preview {
  padding: 1rem;
  background-color: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.heading-preview {
  padding: 0.5rem 0;
  border-bottom: 1px dashed #e5e7eb;
}

.heading-preview:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .heading-levels {
    grid-template-columns: 1fr;
  }

  .form-group label {
    font-size: 0.8rem;
  }

  .form-group select {
    font-size: 0.875rem;
  }
}
</style>
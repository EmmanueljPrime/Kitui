<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3>Aperçu</h3>
      <div class="preview-controls">
        <button
            v-for="device in previewDevices"
            :key="device.id"
            :class="['device-button', { active: modelValue === device.id }]"
            @click="updateDevice(device.id)"
        >
          {{ device.name }}
        </button>
      </div>
    </div>

    <div class="preview-container" :class="modelValue">
      <iframe
          ref="previewFrame"
          class="preview-frame"
          title="Aperçu du Kit UI"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'PreviewPanel',
  props: {
    previewDevices: {
      type: Array,
      required: true
    },
    // Utilisez modelValue pour v-model
    modelValue: {
      type: String,
      required: true
    },
    generatedCSS: {
      type: String,
      default: ''
    },
    kitName: {
      type: String,
      default: 'Kit UI'
    },
    config: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose }) {
    const previewFrame = ref<HTMLIFrameElement | null>(null);

    // Fonction pour mettre à jour l'appareil sélectionné
    const updateDevice = (deviceId: string) => {
      emit('update:modelValue', deviceId);
    };

    // Fonction pour mettre à jour l'iframe de prévisualisation
    const updatePreviewFrame = () => {
      if (previewFrame.value) {
        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aperçu ${props.kitName}</title>
  <style>
    ${props.generatedCSS}

    body {
      padding: 20px;
      margin: 0;
      font-family: ${props.config.typography.text.family};
      font-size: ${props.config.typography.text.size}px;
      overflow-x: hidden;
    }

    .preview-section {
      margin-bottom: 30px;
    }

    .preview-section h3 {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 10px 0;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .grid-example {
      display: grid;
      grid-template-columns: repeat(${props.config.layout.grid.columns}, minmax(0, 1fr));
      gap: ${props.config.layout.grid.gap}px ${props.config.layout.grid.verticalSpacing || props.config.layout.grid.gap}px;
      margin-bottom: 30px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      ${props.config.layout.grid.rowHeight && props.config.layout.grid.rowHeight !== 'auto' ?
            `grid-template-rows: repeat(auto-fill, ${props.config.layout.grid.rowHeight}px);` : ''}
      ${props.config.layout.grid.direction === 'column' ? 'grid-auto-flow: column;' : ''}
      ${props.config.layout.grid.centerItems ? 'place-items: center;' : ''}
    }

    .grid-item {
      background-color: rgba(66, 185, 131, 0.1);
      border: 1px solid rgba(66, 185, 131, 0.3);
      padding: 15px;
      border-radius: 4px;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
      min-width: 0;
      box-sizing: border-box;
    }

    .container-example {
      max-width: ${props.config.layout.container.maxWidth}px;
      padding: ${props.config.layout.container.padding}px;
      margin: 0 auto;
      ${props.config.layout.container.shadowEnabled ?
            `box-shadow: ${props.config.layout.container.shadowX}px ${props.config.layout.container.shadowY}px ${props.config.layout.container.shadowBlur}px rgba(0,0,0,${props.config.layout.container.shadowOpacity});` : ''}
      ${props.config.layout.container.borderWidth > 0 ?
            `border: ${props.config.layout.container.borderWidth}px solid ${props.config.layout.container.borderColor || '#e2e8f0'};` : ''}
      border-radius: ${props.config.layout.container.borderRadius}px;
      background-color: ${props.config.layout.container.backgroundColor || '#ffffff'};
      box-sizing: border-box;
    }

    .breakpoints-preview {
      margin-top: 20px;
    }

    .breakpoint-item {
      padding: 10px;
      margin-bottom: 10px;
      background-color: #1e2f34;
      border: 1px solid #28594c;
      border-radius: 4px;
    }

    .container {
      max-width: 100%;
      overflow-x: hidden;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .grid-example {
        grid-template-columns: repeat(${Math.min(props.config.layout.grid.columns, 3)}, minmax(0, 1fr));
        gap: ${Math.max(props.config.layout.grid.gap - 2, 3)}px ${Math.max((props.config.layout.grid.verticalSpacing || props.config.layout.grid.gap) - 2, 3)}px;
      }

      .grid-item {
        padding: 10px;
        font-size: 0.875rem;
      }
    }

    @media (max-width: 480px) {
      .grid-example {
        grid-template-columns: repeat(${Math.min(props.config.layout.grid.columns, 2)}, minmax(0, 1fr));
        gap: ${Math.max(props.config.layout.grid.gap - 5, 5)}px ${Math.max((props.config.layout.grid.verticalSpacing || props.config.layout.grid.gap) - 5, 5)}px;
      }

      .grid-item {
        padding: 8px;
        font-size: 0.75rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="preview-section">
      <h1>Aperçu de ${props.kitName}</h1>
      <p>Ce document présente un aperçu des styles définis dans votre Kit UI.</p>
    </div>

    <div class="preview-section">
      <h3>Mise en page</h3>

      <h4>Conteneur</h4>
      <div class="container-example">
        <p>Ceci est un exemple de conteneur.</p>
        <p>Largeur max: ${props.config.layout.container.maxWidth}px | Padding: ${props.config.layout.container.padding}px</p>
        ${props.config.layout.container.borderWidth > 0 ?
            `<p>Bordure: ${props.config.layout.container.borderWidth}px | Rayon: ${props.config.layout.container.borderRadius}px</p>` :
            `<p>Rayon: ${props.config.layout.container.borderRadius}px</p>`}
      </div>

      <h4>Grille (${props.config.layout.grid.columns} colonnes${props.config.layout.grid.direction === 'column' ? ' - flux vertical' : ''})</h4>
      <div class="grid-example">
        ${Array(Math.min(props.config.layout.grid.columns * 2, 12)).fill(0).map((_, i) =>
            `<div class="grid-item">Item ${i+1}</div>`).join('')}
      </div>

      <h4>Points de rupture</h4>
      <div class="breakpoints-preview">
        ${props.config.layout.grid.breakpoints.map(bp =>
            `<div class="breakpoint-item">${bp.name}: ${bp.value}px</div>`).join('')}
      </div>
    </div>

    <div class="preview-section">
      <h3>Typographie</h3>
      <h1>Titre h1</h1>
      <h2>Titre h2</h2>
      <h3>Titre h3</h3>
      <h4>Titre h4</h4>
      <h5>Titre h5</h5>
      <h6>Titre h6</h6>
      <p>Texte de paragraphe standard. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>

    <div class="preview-section">
      <h3>Boutons</h3>
      <div class="button-group">
        <button class="btn btn-primary">Bouton primaire</button>
        <button class="btn btn-secondary">Bouton secondaire</button>
        <button class="btn btn-dark">Bouton sombre</button>
        <button class="btn btn-primary" disabled>Désactivé</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Cartes</h3>
      <div class="card-grid">
        <div class="card">
          <h4>Carte standard</h4>
          <p>Contenu de la carte avec du texte pour montrer à quoi cela ressemblera.</p>
          <button class="btn btn-primary">Action</button>
        </div>

        <div class="card">
          <h4>Deuxième carte</h4>
          <p>Les cartes s'adaptent automatiquement à la largeur disponible.</p>
          <button class="btn btn-secondary">Voir plus</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

        const doc = previewFrame.value.contentDocument;
        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
        }
      }
    };

    // Méthode pour obtenir l'HTML pour l'aperçu plein écran
    const getPreviewHTML = () => {
      return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aperçu ${props.kitName}</title>
  <style>
    ${props.generatedCSS}

    body {
      padding: 20px;
      margin: 0;
      font-family: ${props.config.typography.text.family};
      overflow-x: hidden;
    }

    .preview-section {
      margin-bottom: 30px;
    }

    .grid-example {
      display: grid;
      grid-template-columns: repeat(${props.config.layout.grid.columns}, minmax(0, 1fr));
      gap: ${props.config.layout.grid.gap}px;
      margin-bottom: 30px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .grid-item {
      background-color: rgba(66, 185, 131, 0.1);
      border: 1px solid rgba(66, 185, 131, 0.3);
      padding: 15px;
      border-radius: 4px;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
      min-width: 0;
      box-sizing: border-box;
    }

    .container-example {
      max-width: ${props.config.layout.container.maxWidth}px;
      padding: ${props.config.layout.container.padding}px;
      margin: 0 auto;
      ${props.config.layout.container.shadowEnabled ?
          `box-shadow: ${props.config.layout.container.shadowX}px ${props.config.layout.container.shadowY}px ${props.config.layout.container.shadowBlur}px rgba(0,0,0,${props.config.layout.container.shadowOpacity});` : ''}
      ${props.config.layout.container.borderWidth > 0 ?
          `border: ${props.config.layout.container.borderWidth}px solid ${props.config.layout.container.borderColor || '#e2e8f0'};` : ''}
      border-radius: ${props.config.layout.container.borderRadius}px;
      background-color: ${props.config.layout.container.backgroundColor || '#ffffff'};
      box-sizing: border-box;
    }

    .container {
      max-width: 100%;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Contenu complet... -->
  </div>
</body>
</html>`;
    };

    // Observer les changements de props et mettre à jour la prévisualisation
    watch(() => [props.generatedCSS, props.config], updatePreviewFrame, { deep: true });

    // Initialiser la prévisualisation
    onMounted(updatePreviewFrame);

    // Exposer des méthodes pour le composant parent
    expose({
      updatePreviewFrame,
      getPreviewHTML
    });

    return {
      previewFrame,
      updateDevice
    };
  }
});
</script>

<style scoped>
.preview-panel {
  flex: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

.preview-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.device-button {
  background-color: #f1f5f9;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-button.active {
  background-color: #42b983;
  color: white;
}

.device-button:hover:not(.active) {
  background-color: #e2e8f0;
}

.preview-container {
  flex: 1;
  padding: 1rem;
  background-color: #f8fafc;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.preview-container.mobile {
  overflow: auto;
}

.preview-container.mobile .preview-frame {
  width: 375px;
  max-width: 100%;
}

.preview-container.tablet .preview-frame {
  width: 768px;
  max-width: 100%;
}

.preview-container.desktop .preview-frame {
  width: 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .preview-panel {
    min-height: 400px;
  }

  .preview-controls {
    flex-wrap: wrap;
  }

  .preview-container.tablet .preview-frame,
  .preview-container.mobile .preview-frame {
    transform: scale(0.85);
    transform-origin: top center;
  }
}

@media (max-width: 480px) {
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .preview-controls {
    width: 100%;
    justify-content: space-between;
  }

  .device-button {
    flex: 1;
    text-align: center;
  }

  .preview-container.tablet .preview-frame,
  .preview-container.mobile .preview-frame {
    transform: scale(0.75);
  }
}
</style>
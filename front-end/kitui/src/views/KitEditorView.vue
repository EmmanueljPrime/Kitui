<template>
  <div class="editor-layout">
    <AppSidebar
        :username="user.username"
        :userRole="'Designer'"
        @logout="handleLogout"
        @toggle="handleSidebarToggle"
    />

    <div class="main-container" :class="{ 'sidebar-expanded': isSidebarOpen }">
      <AppHeader
          :title="pageTitle"
          :notificationCount="0"
          @help-click="showHelp"
      />

      <main class="editor-content">
        <EditorHeader
            :kitName="kitName"
            :isPreviewActive="isPreviewActive"
            :config="config"
            :userId="user.id"
            @update:kitName="kitName = $event"
            @togglePreview="togglePreview"
            @generateCSS="generateCSS"
            @kit-saved="handleKitSaved"
        />

        <div v-if="!isPreviewActive" class="editor-panels">
          <div class="configuration-panel">
            <div class="panel-tabs">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="['tab-button', { active: activeTab === tab.id }]"
                  @click="activeTab = tab.id"
              >
                {{ tab.name }}
              </button>
            </div>

            <!-- Conteneur pour les différents panneaux de configuration -->
            <div class="panel-content">
              <!-- Layout Panel -->
              <LayoutPanel v-if="activeTab === 'layout'" :config="config" @update:config="config = $event" />

              <!-- Colors Panel -->
              <ColorPanel v-if="activeTab === 'colors'" :config="config" @update:config="config = $event" />

              <!-- Typography Panel -->
              <TypographyPanel v-if="activeTab === 'typography'" :config="config" @update:config="config = $event" />

              <!-- Components Panel -->
              <ComponentsPanel v-if="activeTab === 'components'" :config="config" @update:config="config = $event" />

              <!-- Dark Theme Panel -->
              <DarkThemePanel v-if="activeTab === 'darkTheme'" :config="config" @update:config="config = $event" />
            </div>
          </div>

          <PreviewPanel v-model="currentDevice" :previewDevices="previewDevices" :generatedCSS="generatedCSS" :kitName="kitName" :config="config" ref="previewPanel" />
        </div>

        <!-- Mode aperçu plein écran -->
        <div v-else class="full-preview">
          <iframe
              ref="fullPreviewFrame"
              class="full-preview-frame"
              title="Aperçu complet du Kit UI"
          ></iframe>
        </div>

        <!-- CSS Generated Modal -->
        <div v-if="showCSSModal" class="modal-overlay" @click="showCSSModal = false">
          <div class="modal-content css-modal" @click.stop>
            <div class="modal-header">
              <h3>CSS Généré</h3>
              <div class="modal-actions">
                <button class="copy-button" @click="copyCSS">Copier</button>
                <button class="download-button" @click="downloadCSS">Télécharger</button>
                <button class="close-button" @click="showCSSModal = false">×</button>
              </div>
            </div>
            <div class="modal-body">
              <pre class="css-code">{{ generatedCSS }}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import AppHeader from '../components/partials/Header.vue';
import AppSidebar from '../components/partials/Sidebar.vue';
import EditorHeader from "@/components/kit-editor/EditorHeader.vue";
import LayoutPanel from "@/components/kit-editor/LayoutPanel.vue";
import ColorPanel from "@/components/kit-editor/ColorPanel.vue";
import TypographyPanel from "@/components/kit-editor/TypographyPanel.vue";
import ComponentsPanel from "@/components/kit-editor/ComponentsPanel.vue";
import DarkThemePanel from "@/components/kit-editor/DarkThemePanel.vue";
import PreviewPanel from "@/components/kit-editor/PreviewPanel.vue";

export default defineComponent({
  name: 'KitEditorView',
  components: {
    PreviewPanel,
    DarkThemePanel,
    ComponentsPanel,
    TypographyPanel,
    ColorPanel,
    LayoutPanel,
    EditorHeader,
    AppHeader,
    AppSidebar
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const previewFrame = ref<HTMLIFrameElement | null>(null);
    const fullPreviewFrame = ref<HTMLIFrameElement | null>(null);

    // États de base
    const pageTitle = ref('Éditeur de Kit UI');
    const isSidebarOpen = ref(false);
    const kitName = ref('Mon Kit UI');
    const activeTab = ref('layout');
    const isPreviewActive = ref(false);
    const currentDevice = ref('desktop');
    const showCSSModal = ref(false);
    const generatedCSS = ref('');

    // Configuration du Kit UI
    const config = ref({
      layout: {
        container: {
          maxWidth: 1200,
          padding: 16
        },
        grid: {
          columns: 12,
          gap: 16,
          breakpoints: [
            { name: 'sm', value: 576 },
            { name: 'md', value: 768 },
            { name: 'lg', value: 992 },
            { name: 'xl', value: 1200 }
          ]
        }
      },
      colors: {
        dark: {
          base: '#2c3e50'
        },
        light: {
          base: '#ffffff'
        },
        accent: '#42b983'
      },
      typography: {
        text: {
          family: "'Roboto', sans-serif",
          size: 16
        },
        headings: {
          family: "'Roboto', sans-serif",
          sizes: [36, 30, 24, 20, 18, 16],
          weights: [700, 700, 600, 600, 500, 500]
        }
      },
      components: {
        buttons: {
          paddingY: 8,
          paddingX: 16,
          borderRadius: 4,
          fontSize: 16,
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
          fontWeight: '500'
        },
        cards: {
          padding: 16,
          innerPadding: 10,
          borderRadius: 8,
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
          titleWeight: '600',
          textWeight: 'normal'
        }
      },
      darkTheme: {
        enabled: true,
        backgroundColor: '#1a202c',
        textColor: '#f8f9fa'
      }
    });

    // Tabs et devices pour la prévisualisation
    const tabs = [
      { id: 'layout', name: 'Layout' },
      { id: 'colors', name: 'Couleurs' },
      { id: 'typography', name: 'Typographie' },
      { id: 'components', name: 'Composants' },
      { id: 'darkTheme', name: 'Thème sombre' }
    ];

    const previewDevices = [
      { id: 'mobile', name: 'Mobile' },
      { id: 'tablet', name: 'Tablette' },
      { id: 'desktop', name: 'Bureau' }
    ];

    // Informations utilisateur
    const user = computed(() => ({
      id: userStore.userId || 1, // Ajouter l'ID de l'utilisateur
      username: userStore.username || 'Utilisateur'
    }));

    // Fonctions utilitaires pour les couleurs
    const getLighterColor = (hex: string) => {
      // Logique pour éclaircir une couleur hex
      return hex; // À implémenter
    };

    const getDarkerColor = (hex: string) => {
      // Logique pour assombrir une couleur hex
      return hex; // À implémenter
    };

    // Fonctions pour la génération et l'export du CSS
    const generateCSS = () => {
      // Fonction utilitaire pour convertir une couleur hex en rgba
      const hexToRgba = (hex, opacity) => {
        // Enlever le # si présent
        hex = hex.replace('#', '');

        // Convertir en RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };

      // Générer le CSS basé sur la configuration
      generatedCSS.value = `:root {
  /* Layout */
  --container-max-width: ${config.value.layout.container.maxWidth}px;
  --container-padding: ${config.value.layout.container.padding}px;
  --grid-columns: ${config.value.layout.grid.columns};
  --grid-gap: ${config.value.layout.grid.gap}px;

  /* Colors */
  --color-dark: ${config.value.colors.dark.base};
  --color-dark-lighter: ${getLighterColor(config.value.colors.dark.base)};
  --color-dark-darker: ${getDarkerColor(config.value.colors.dark.base)};
  --color-light: ${config.value.colors.light.base};
  --color-light-lighter: ${getLighterColor(config.value.colors.light.base)};
  --color-light-darker: ${getDarkerColor(config.value.colors.light.base)};
  --color-accent: ${config.value.colors.accent};

  /* Typography */
  --font-text: ${config.value.typography.text.family};
  --font-size-base: ${config.value.typography.text.size}px;
  --font-heading: ${config.value.typography.headings.family};

  /* Components - Buttons */
  --button-padding-y: ${config.value.components.buttons.paddingY}px;
  --button-padding-x: ${config.value.components.buttons.paddingX}px;
  --button-border-radius: ${config.value.components.buttons.borderRadius}px;
  --button-font-size: ${config.value.components.buttons.fontSize}px;
  --button-font-weight: ${config.value.components.buttons.fontWeight};
  --button-border-width: ${config.value.components.buttons.borderWidth}px;
  --button-border-style: ${config.value.components.buttons.borderStyle};
  --button-hover-scale: ${config.value.components.buttons.hoverScale};
  --button-hover-darken: ${config.value.components.buttons.hoverDarken}%;
  --button-transition-duration: ${config.value.components.buttons.transitionDuration}ms;
  --button-transition-timing: ${config.value.components.buttons.transitionTiming};
  --button-shadow: ${config.value.components.buttons.shadowEnabled ?
          `${config.value.components.buttons.shadowX}px ${config.value.components.buttons.shadowY}px ${config.value.components.buttons.shadowBlur}px ${config.value.components.buttons.shadowSpread}px ${hexToRgba(config.value.components.buttons.shadowColor, config.value.components.buttons.shadowOpacity)}` :
          'none'};
  --button-shadow-hover: ${config.value.components.buttons.shadowEnabled ?
          `${config.value.components.buttons.shadowX}px ${config.value.components.buttons.shadowY + 2}px ${config.value.components.buttons.shadowBlur + 4}px ${config.value.components.buttons.shadowSpread}px ${hexToRgba(config.value.components.buttons.shadowColor, config.value.components.buttons.shadowOpacity + 0.1)}` :
          'none'};

  /* Components - Cards */
  --card-padding: ${config.value.components.cards.padding}px;
  --card-inner-padding: ${config.value.components.cards.innerPadding}px;
  --card-border-radius: ${config.value.components.cards.borderRadius}px;
  --card-border-width: ${config.value.components.cards.borderWidth}px;
  --card-border-style: ${config.value.components.cards.borderStyle};
  --card-border-color: ${config.value.components.cards.borderColor};
  --card-background-color: ${config.value.components.cards.backgroundColor};
  --card-title-weight: ${config.value.components.cards.titleWeight};
  --card-text-weight: ${config.value.components.cards.textWeight};
  --card-shadow: ${config.value.components.cards.shadowEnabled ?
          `${config.value.components.cards.shadowX}px ${config.value.components.cards.shadowY}px ${config.value.components.cards.shadowBlur}px ${config.value.components.cards.shadowSpread}px ${hexToRgba(config.value.components.cards.shadowColor, config.value.components.cards.shadowOpacity)}` :
          'none'};
  --card-hover-transform: ${config.value.components.cards.hoverEffect === 'lift' ? 'translateY(-5px)' : 'none'};
  --card-hover-shadow: ${
          config.value.components.cards.hoverEffect === 'lift' ?
              `${config.value.components.cards.shadowX}px ${config.value.components.cards.shadowY + 5}px ${config.value.components.cards.shadowBlur + 5}px ${config.value.components.cards.shadowSpread}px ${hexToRgba(config.value.components.cards.shadowColor, config.value.components.cards.shadowOpacity + 0.1)}` :
              config.value.components.cards.hoverEffect === 'shadow' ?
                  `${config.value.components.cards.shadowX}px ${config.value.components.cards.shadowY}px ${config.value.components.cards.shadowBlur + 10}px ${config.value.components.cards.shadowSpread + 5}px ${hexToRgba(config.value.components.cards.shadowColor, config.value.components.cards.shadowOpacity + 0.2)}` :
                  config.value.components.cards.hoverEffect === 'glow' ?
                      `0 0 15px 0 ${hexToRgba(config.value.colors.accent, 0.5)}` :
                      'var(--card-shadow)'};
}

/* Base styles */
body {
  font-family: var(--font-text);
  font-size: var(--font-size-base);
  color: var(--color-dark);
  background-color: var(--color-light);
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  margin-left: auto;
  margin-right: auto;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gap);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin-top: 0;
  margin-bottom: 0.5em;
  color: var(--color-dark);
}

h1 { font-size: ${config.value.typography.headings.sizes[0]}px; font-weight: ${config.value.typography.headings.weights[0]}; }
h2 { font-size: ${config.value.typography.headings.sizes[1]}px; font-weight: ${config.value.typography.headings.weights[1]}; }
h3 { font-size: ${config.value.typography.headings.sizes[2]}px; font-weight: ${config.value.typography.headings.weights[2]}; }
h4 { font-size: ${config.value.typography.headings.sizes[3]}px; font-weight: ${config.value.typography.headings.weights[3]}; }
h5 { font-size: ${config.value.typography.headings.sizes[4]}px; font-weight: ${config.value.typography.headings.weights[4]}; }
h6 { font-size: ${config.value.typography.headings.sizes[5]}px; font-weight: ${config.value.typography.headings.weights[5]}; }

p {
  margin-top: 0;
  margin-bottom: 1em;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-border-radius);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  text-align: center;
  cursor: pointer;
  transition: all var(--button-transition-duration) var(--button-transition-timing);
  text-decoration: none;
  border-width: var(--button-border-width);
  border-style: var(--button-border-style);
  box-shadow: var(--button-shadow);
}

.btn:hover:not(:disabled) {
  transform: scale(var(--button-hover-scale));
  box-shadow: var(--button-shadow-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.btn-primary:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-accent), black var(--button-hover-darken));
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(66, 185, 131, 0.1);
}

.btn-dark {
  background-color: var(--color-dark);
  color: var(--color-light);
  border-color: var(--color-dark);
}

.btn-dark:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-dark), black var(--button-hover-darken));
}

/* Cards */
.card {
  background-color: var(--card-background-color);
  border-radius: var(--card-border-radius);
  padding: var(--card-padding);
  border: var(--card-border-width) var(--card-border-style) var(--card-border-color);
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.card > * + * {
  margin-top: var(--card-inner-padding);
}

.card h1, .card h2, .card h3, .card h4, .card h5, .card h6 {
  font-weight: var(--card-title-weight);
}

.card p {
  font-weight: var(--card-text-weight);
}

.card:hover {
  transform: var(--card-hover-transform);
  box-shadow: var(--card-hover-shadow);
}

${config.value.components.cards.hoverEffect === 'border' ? `
.card:hover {
  border-color: var(--color-accent);
  border-width: ${config.value.components.cards.borderWidth + 1}px;
}
` : ''}

/* Responsive breakpoints */
${config.value.layout.grid.breakpoints.map(bp => `
@media (min-width: ${bp.value}px) {
  .container {
    max-width: ${bp.value - 30}px;
  }
}
`).join('')}

/* Dark theme */
${config.value.darkTheme.enabled ? `
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: ${config.value.darkTheme.backgroundColor};
    --color-text: ${config.value.darkTheme.textColor};
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text);
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text);
  }

  .card {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--color-text);
  }

  .btn-secondary {
    color: var(--color-text);
    border-color: var(--color-text);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
` : '/* Dark theme disabled */'}`;

      showCSSModal.value = true;
    };

    const copyCSS = () => {
      navigator.clipboard.writeText(generatedCSS.value)
          .then(() => {
            alert('CSS copié dans le presse-papier!');
          })
          .catch(err => {
            console.error('Erreur lors de la copie :', err);
          });
    };

    const downloadCSS = () => {
      const blob = new Blob([generatedCSS.value], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${kitName.value.replace(/\s+/g, '-').toLowerCase()}.css`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // Fonctions de navigation
    const handleLogout = () => {
      userStore.clearUser();
      router.push('/login');
    };

    const handleSidebarToggle = (isOpen: boolean) => {
      isSidebarOpen.value = isOpen;
    };

    const togglePreview = () => {
      isPreviewActive.value = !isPreviewActive.value;
    };

    const showHelp = () => {
      alert('Aide de l\'éditeur de Kit UI');
    };

    // Gestionnaire pour la sauvegarde des kits
    const handleKitSaved = (savedKit) => {
      console.log('Kit sauvegardé avec succès:', savedKit);
      // Vous pouvez ajouter ici d'autres actions après la sauvegarde
    };

    // Gestion de la prévisualisation en direct
    const updatePreview = () => {
      if (previewFrame.value) {
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aperçu Kit UI</title>
  <style>
    ${generatedCSS.value}

    body {
      padding: 20px;
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
      gap: 10px;
      margin: 10px 0;
    }

    .card-example {
      max-width: 300px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="preview-section">
      <h1>Aperçu de ${kitName.value}</h1>
      <p>Ce document présente un aperçu des styles définis dans votre Kit UI.</p>
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
        <button class="btn btn-primary" disabled>Bouton désactivé</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Cartes</h3>
      <div class="card card-example">
        <h4>Titre de la carte</h4>
        <p>Contenu de la carte avec du texte pour montrer à quoi cela ressemblera.</p>
        <button class="btn btn-primary">Action</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Grille</h3>
      <div class="grid">
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 1</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 2</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 3</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 4</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 5</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 6</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 7</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 8</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 9</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 10</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 11</div>
        <div style="background-color:#e2e8f0; padding:10px; text-align:center;">Col 12</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

        const doc = previewFrame.value.contentDocument;
        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
        }

        if (isPreviewActive.value && fullPreviewFrame.value) {
          const fullDoc = fullPreviewFrame.value.contentDocument;
          if (fullDoc) {
            fullDoc.open();
            fullDoc.write(html);
            fullDoc.close();
          }
        }
      }
    };

    // Mise à jour de la prévisualisation quand la configuration change
    watch(config, () => {
      // Générer le CSS sans ouvrir la modal
      generateCSS();
      showCSSModal.value = false;

      // Mettre à jour la prévisualisation
      updatePreview();
    }, { deep: true });

    // Initialisation
    onMounted(() => {
      generateCSS();
      updatePreview();
    });

    return {
      pageTitle,
      isSidebarOpen,
      user,
      kitName,
      activeTab,
      currentDevice,
      tabs,
      previewDevices,
      config,
      isPreviewActive,
      showCSSModal,
      generatedCSS,
      previewFrame,
      fullPreviewFrame,

      // Fonctions utilitaires
      getLighterColor,
      getDarkerColor,

      // Fonctions interactives
      handleLogout,
      handleSidebarToggle,
      togglePreview,
      showHelp,
      generateCSS,
      copyCSS,
      downloadCSS,
      handleKitSaved
    };
  }
});
</script>

<style scoped>
.editor-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-container {
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.editor-content {
  padding: 1.5rem;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.kit-name-input {
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
}

.kit-name-input:focus {
  outline: none;
  border-color: #e2e8f0;
  background-color: white;
}

.kit-actions {
  display: flex;
  gap: 1rem;
}

.preview-button, .generate-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-button {
  background-color: #f1f5f9;
  color: #1e293b;
  border: none;
}

.preview-button:hover {
  background-color: #e2e8f0;
}

.generate-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.generate-button:hover {
  background-color: #3aa876;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover {
  background-color: #3aa876;
}

.editor-panels {
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 200px);
}

.configuration-panel {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  padding: 1rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button.active {
  color: #42b983;
  border-bottom-color: #42b983;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.tab-panel h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-with-unit input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-with-unit input:focus {
  outline: none;
  border-color: #42b983;
}

.unit {
  margin-left: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.3s ease;
}

select:focus {
  outline: none;
  border-color: #42b983;
}

.color-picker-group {
  margin-bottom: 1rem;
}

.color-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-input input[type="color"] {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0;
  overflow: hidden;
}

.color-hex {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-family: monospace;
}

.color-variants {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.color-variant {
  text-align: center;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.variant-label {
  font-size: 0.75rem;
  color: #64748b;
}

.heading-levels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.heading-level h5 {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #64748b;
}

.breakpoints-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakpoint-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breakpoint-name {
  flex: 1;
  color: #64748b;
  font-size: 0.875rem;
}

.remove-button {
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
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
}

.add-button:hover {
  background-color: #e2e8f0;
}

.component-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.component-preview h5 {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: #64748b;
}

.buttons-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
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
  background-color: #e2e8f0;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: #42b983;
}

input:checked + .toggle-label:before {
  transform: translateX(26px);
}

.dark-theme-options {
  margin-top: 1rem;
}

.theme-preview {
  margin-top: 1.5rem;
}

.dark-theme-preview {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
}

.preview-panel {
  flex: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.preview-container {
  flex: 1;
  padding: 1rem;
  background-color: #f8fafc;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.preview-container.mobile .preview-frame {
  width: 375px;
  height: 667px;
}

.preview-container.tablet .preview-frame {
  width: 768px;
  height: 1024px;
}

.full-preview {
  height: calc(100vh - 180px);
  width: 100%;
}

.full-preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
}

.copy-button, .download-button, .close-button {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-button {
  background-color: #e2e8f0;
  color: #1e293b;
}

.copy-button:hover {
  background-color: #cbd5e1;
}

.download-button {
  background-color: #42b983;
  color: white;
}

.download-button:hover {
  background-color: #3aa876;
}

.close-button {
  background-color: transparent;
  color: #64748b;
  font-size: 1.5rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #1e293b;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}

.css-code {
  margin: 0;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .editor-panels {
    flex-direction: column;
    height: auto;
  }

  .configuration-panel, .preview-panel {
    max-width: none;
    width: 100%;
  }

  .preview-panel {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .kit-name-input {
    width: 100%;
  }
}
</style>
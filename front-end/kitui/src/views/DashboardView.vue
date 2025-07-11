<template>
  <div class="dashboard-layout">
    <AppSidebar
        :username="user.username"
        :userRole="'Designer'"
        @logout="handleLogout"
        @toggle="handleSidebarToggle"
    />

    <div class="main-container" :class="{ 'sidebar-expanded': isSidebarOpen }">
      <AppHeader
          :title="pageTitle"
          :notificationCount="3"
          @help-click="showHelp"
          @notifications-click="showNotifications"
      />

      <main class="dashboard-content">
        <div class="welcome-message">
          <h2>Bienvenue, {{ user.username || 'Designer' }}!</h2>
          <p>Voici un résumé de vos activités et projets récents.</p>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(66, 185, 131, 0.1); color: #42b983;">
              🎨
            </div>
            <div class="stat-info">
              <h3 class="stat-title">Kits UI créés</h3>
              <p class="stat-value">{{ kits.length }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(79, 129, 237, 0.1); color: #4f81ed;">
              📅
            </div>
            <div class="stat-info">
              <h3 class="stat-title">Dernière activité</h3>
              <p class="stat-value">Aujourd'hui</p>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="dashboard-col">
            <div class="dashboard-panel">
              <div class="panel-header">
                <h3 class="panel-title">Kits récents</h3>
              </div>
              <div class="kit-list">
              <div
                  v-for="kit in kits"
                  :key="kit.id"
                  class="kit-item"
              >
                <div
                    class="kit-color"
                    :style="{ backgroundColor: kit.config?.colors?.accent || '#ccc' }"
                ></div>
                <div class="kit-info">
                  <h4 class="kit-name">{{ kit.name }}</h4>
                  <p class="kit-date">
                    Créé le {{ new Date(kit.createdAt).toLocaleDateString('fr-FR') }}
                  </p>
                </div>
                <button class="kit-action" @click="goToEditor(kit)">Éditer</button>
                <DeleteButton @delete="deleteKit(kit.id)" />
              </div>

              <p v-if="kits.length === 0" style="margin-top: 1rem; color: #888;">Aucun kit créé pour le moment.</p>
            </div>

            </div>
          </div>


        </div>
      </main>
    </div>

    <!-- Modals/Dialogs -->
    <div v-if="showHelpModal" class="modal-overlay" @click="showHelpModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Aide</h3>
          <button class="modal-close" @click="showHelpModal = false">×</button>
        </div>
        <div class="modal-body">
          <h4>Comment utiliser Kitui</h4>
          <p>Kitui vous permet de créer et de gérer des kits UI personnalisés pour vos projets.</p>

          <h4>Fonctionnalités principales</h4>
          <ul>
            <li><strong>Créer un kit</strong> : Commencez avec un nouveau kit vide ou utilisez un modèle.</li>
            <li><strong>Personnaliser</strong> : Modifiez les couleurs, typographies et composants.</li>
            <li><strong>Exporter</strong> : Téléchargez votre kit sous forme de fichier CSS.</li>
          </ul>

          <h4>Besoin d'aide supplémentaire?</h4>
          <p>Contactez notre équipe de support à <a href="mailto:support@kitui.com">support@kitui.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import AppHeader from '../components/partials/Header.vue';
import AppSidebar from '../components/partials/Sidebar.vue';
import { useKitStore } from '@/stores/kitStore';
import DeleteButton from "@/components/common/DeleteButton.vue";

interface Kit {
  id: number;
  name: string;
  config: {
    colors?: {
      accent?: string;
    };
  };
  createdAt: string;
}

export default defineComponent({
  name: 'DashboardView',
  components: {
    DeleteButton,
    AppHeader,
    AppSidebar
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const kitStore = useKitStore();


    const pageTitle = ref('Tableau de bord');
    const isSidebarOpen = ref(false);
    const showToken = ref(false);
    const showHelpModal = ref(false);

    const kits = ref<Kit[]>([]);

    const user = computed(() => ({
      username: userStore.username || 'Utilisateur'
    }));

    const token = computed(() => userStore.token || 'Aucun token trouvé');

    const fetchKits = async () => {
      try {
        const response = await fetch('/api/kits', {
          headers: {
            Authorization: `Bearer ${userStore.token}`
          }
        });

        if (response.status === 401) {
          userStore.clearUser();
          await router.push('/login');
          return; // Stoppe ici
        }

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des kits');
        }

        const data = await response.json();
        kits.value = data;
      } catch (error) {
        console.error('❌ Erreur lors du fetch des kits :', error);
      }
    };
    const deleteKit = async (id: number) => {
      try {
        const response = await fetch(`/api/kits/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.status === 401) {
          userStore.clearUser();
          await router.push('/login');
          return; // Stoppe ici
        }

        if (!response.ok) throw new Error('Suppression échouée');
        kits.value = kits.value.filter(kit => kit.id !== id);
      } catch (e) {
        alert('Suppression échouée !'+e);
      }
    };

    onMounted(() => {
      fetchKits();
    });

    const handleLogout = async () => {
      try {
        // Appel à la route de logout (supprime le cookie côté serveur)
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include', // indispensable pour envoyer le cookie
        });
      } catch (e) {
        // Optionnel : tu peux log si erreur
        console.error('Erreur lors du logout:', e);
      }
      // Nettoie ton store utilisateur (Pinia ou autre)
      userStore.clearUser();
      // Redirige vers la page de connexion
      router.push('/login');
    };

    const handleSidebarToggle = (isOpen: boolean) => {
      isSidebarOpen.value = isOpen;
      console.log('Sidebar is open:', isOpen);
    };

    const goToEditor = (kit: Kit) => {
      kitStore.setKit(kit);
      router.push(`/kit-editor/${kit.id}`);
    };

    const toggleTokenVisibility = () => {
      showToken.value = !showToken.value;
    };

    const showHelp = () => {
      showHelpModal.value = true;
    };

    const showNotifications = () => {
      console.log('Afficher les notifications');
    };

    return {
      pageTitle,
      user,
      token,
      isSidebarOpen,
      showToken,
      showHelpModal,
      kits,
      deleteKit,
      handleLogout,
      handleSidebarToggle,
      toggleTokenVisibility,
      showHelp,
      showNotifications,
      goToEditor
    };
  }
});
</script>


<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-container {
  flex: 1;
  min-width: 0; /* Empêche le dépassement */
  transition: margin-left 0.3s ease;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-message {
  margin-bottom: 2rem;
}

.welcome-message h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.welcome-message p {
  color: #64748b;
  font-size: 1.1rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dashboard-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-col {
  flex: 1;
  min-width: 300px;
}

.dashboard-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.mt-4 {
  margin-top: 1.5rem;
}

.panel-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.panel-action {
  background: none;
  border: none;
  color: #42b983;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.panel-action:hover {
  color: #3aa876;
  text-decoration: underline;
}

.kit-list {
  padding: 1rem 1.5rem;
}

.kit-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.kit-item:last-child {
  border-bottom: none;
}

.kit-color {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 1rem;
}

.kit-info {
  flex: 1;
}

.kit-name {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.kit-date {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.kit-action {
  background-color: #f1f5f9;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.kit-action:hover {
  background-color: #42b983;
  color: white;
}

.quick-actions {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.quick-action-card {
  background-color: #f8fafc;
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.quick-action-card:hover {
  background-color: #f1f5f9;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 0.75rem;
}

.quick-action-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.quick-action-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.token-display {
  padding: 1rem 1.5rem;
}

.token-text {
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #1e293b;
  overflow-x: auto;
  word-break: break-all;
}

.token-placeholder {
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #64748b;
  text-align: center;
}

/* Modal styles */
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body h4 {
  margin: 1.5rem 0 0.5rem;
  color: #1e293b;
}

.modal-body h4:first-child {
  margin-top: 0;
}

.modal-body p, .modal-body ul {
  color: #64748b;
  line-height: 1.6;
}

.modal-body ul {
  padding-left: 1.5rem;
}

.modal-body a {
  color: #42b983;
  text-decoration: none;
}

@media (max-width: 992px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .dashboard-content {
    padding: 1.5rem;
  }
}
</style>
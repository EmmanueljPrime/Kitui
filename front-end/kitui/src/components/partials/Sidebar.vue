<template>
  <div class="sidebar-container">
    <!-- Bouton hamburger mobile toujours visible -->
    <button class="hamburger-button" @click="toggleSidebar">
      <span class="hamburger-icon">☰</span>
    </button>

    <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-text">Kitui</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <p class="nav-title">Menu</p>
          <ul class="nav-links">
            <li v-for="item in menuItems" :key="item.path" class="nav-item" :class="{ active: isActive(item.path) }">
              <router-link :to="item.path" class="nav-link">
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-text">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <div class="user-details">
              <p class="user-name">{{ username }}</p>
              <p class="user-role">{{ userRole }}</p>
            </div>
          </div>
          <button class="logout-button" @click="$emit('logout')">
            <span class="logout-icon">🚪</span>
            <span class="logout-text">Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Overlay qui s'affiche derrière la sidebar en mode mobile -->
    <div class="sidebar-overlay" v-if="isOpen" @click="toggleSidebar"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AppSidebar',
  props: {
    menuItems: {
      type: Array,
      default: () => [
        { path: '/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/kit-editor', name: 'Créer un Kit', icon: '🎨' },
      ]
    },
    username: {
      type: String,
      default: 'Utilisateur'
    },
    userRole: {
      type: String,
      default: 'Designer'
    }
  },
  emits: ['logout', 'toggle'],
  setup(props, { emit }) {
    const route = useRoute();
    const isOpen = ref(false);

    const userInitials = computed(() => {
      if (!props.username) return 'KT';
      return props.username.substring(0, 2).toUpperCase();
    });

    const isActive = (path: string) => {
      return route.path === path;
    };

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
      emit('toggle', isOpen.value);
    };

    return {
      isOpen,
      userInitials,
      isActive,
      toggleSidebar
    };
  }
});
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

/* Bouton hamburger visible seulement en mode mobile */
.hamburger-button {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 60;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  align-items: center;
  justify-content: center;
}

.sidebar {
  width: 260px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #42b983;
}

.close-button {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px);
  justify-content: space-between;
  overflow-y: auto;
}

.nav-section {
  padding: 1.5rem;
}

.nav-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.nav-item.active .nav-link {
  background-color: #42b983;
  color: white;
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #42b983;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.75rem;
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.user-role {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.logout-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}

.logout-icon {
  margin-right: 0.5rem;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 992px) {
  .hamburger-button {
    display: flex;
  }

  .close-button {
    display: block;
  }

  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    transition: left 0.3s ease;
  }

  .sidebar.sidebar-open {
    left: 0;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
}
</style>
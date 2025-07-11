<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <img class="navbar-logo" src="/kituilogo.png" alt="Kitui Logo" />
      </div>
      <div class="header-actions">
        <button v-if="showHelpButton" class="help-button" @click="$emit('help-click')">
          <span class="help-icon">?</span>
        </button>
        <div v-if="showNotifications" class="notifications">
          <button class="notification-button" @click="$emit('notifications-click')">
            <span class="notification-icon">🔔</span>
            <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </button>
        </div>
        <slot name="actions"></slot>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    showHelpButton: {
      type: Boolean,
      default: true
    },
    showNotifications: {
      type: Boolean,
      default: true
    },
    notificationCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['help-click', 'notifications-click']
});
</script>

<style scoped>
.dashboard-header {
  padding: 1.5rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 5;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  height: 38px;
  width: auto;
  display: block;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.help-button, .notification-button {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-button {
  background-color: #f1f5f9;
}

.help-button:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.notification-button {
  background-color: #f1f5f9;
  position: relative;
}

.notification-button:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem 1.5rem;
  }
  .page-title {
    font-size: 1.25rem;
  }
  .navbar-logo {
    height: 30px;
  }
  .header-left {
    gap: 0.6rem;
  }
}
</style>

<template>
  <button
      class="delete-btn"
      @click="handleDelete"
      :disabled="loading"
      :title="label"
  >
    <span v-if="!loading">🗑️</span>
    <span v-else class="spinner"></span>
    <span class="delete-label" v-if="showLabel">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DeleteButton',
  props: {
    label: {
      type: String,
      default: 'Supprimer'
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: true
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const loading = ref(false);

    const handleDelete = async () => {
      if (props.confirm) {
        const ok = confirm('Êtes-vous sûr de vouloir supprimer ?');
        if (!ok) return;
      }
      loading.value = true;
      emit('delete');
      // Optionnel: arrêter loading après async
      setTimeout(() => loading.value = false, 1500);
    };

    return { loading, handleDelete };
  }
});
</script>

<style scoped>
.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background: #fecaca;
  color: #991b1b;
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #b91c1c;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.delete-label {
  margin-left: 2px;
}
</style>

<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <div class="form-group">
      <label for="username">Email / Nom d'utilisateur</label>
      <div class="input-wrapper">
        <span class="input-icon">👤</span>
        <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Votre identifiant"
            required
            class="form-input"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <div class="input-wrapper">
        <span class="input-icon">🔒</span>
        <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Votre mot de passe"
            required
            class="form-input"
        />
        <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
        >
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </div>
    </div>

    <div class="form-footer">
      <div class="remember-me">
        <input type="checkbox" id="remember" v-model="rememberMe" />
        <label for="remember">Se souvenir de moi</label>
      </div>
      <a href="#" class="forgot-password">Mot de passe oublié?</a>
    </div>

    <button
        type="submit"
        class="login-button"
        :disabled="isLoading"
    >
      <span v-if="isLoading" class="loader"></span>
      <span v-else>Se connecter</span>
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/userStore.ts';

export default defineComponent({
  name: 'LoginForm',
  emits: ['login-success', 'login-error'],
  setup(_, { emit }) {
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);

    const handleLogin = async () => {
      try {
        isLoading.value = true;

        // Connexion directe à l'API puisque le store n'a pas de méthode login
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Utilisation du store pour stocker les informations utilisateur
          userStore.setUser(data.user.id, data.user.username, '');

          if (rememberMe.value) {
            localStorage.setItem('remember_username', username.value);
          } else {
            localStorage.removeItem('remember_username');
          }

          emit('login-success');
        } else {
          const errorData = await response.json();
          emit('login-error', errorData.message || 'Identifiants incorrects. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        emit('login-error', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      } finally {
        isLoading.value = false;
      }
    };

    // Vérifier s'il y a un nom d'utilisateur enregistré
    const savedUsername = localStorage.getItem('remember_username');
    if (savedUsername) {
      username.value = savedUsername;
      rememberMe.value = true;
    }

    return {
      username,
      password,
      rememberMe,
      showPassword,
      isLoading,
      handleLogin
    };
  }
});
</script>

<style scoped>
.login-form {
  padding: 0 2.5rem 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #64748b;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
  background-color: white;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: #42b983;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #3aa876;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:not(:disabled):hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .login-form {
    padding: 0 1.5rem 1.5rem;
  }
}
</style>
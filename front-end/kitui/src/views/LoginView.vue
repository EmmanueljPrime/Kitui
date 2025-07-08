<template>
  <div class="login-page">
    <!-- Header simplifié pour la page de connexion -->
    <AppHeader
        title="Connexion"
        :showNotifications="false"
        :showHelpButton="false"
    >
      <template #actions>
        <router-link to="/" class="back-link">
          Retour à l'accueil
        </router-link>
      </template>
    </AppHeader>

    <main class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">Kitui</span>
          </div>
          <h1 class="login-title">Bienvenue</h1>
          <p class="login-subtitle">Connectez-vous pour accéder à votre compte</p>
        </div>

        <LoginForm
            @login-success="handleLoginSuccess"
            @login-error="handleLoginError"
        />

        <div v-if="errorMessage" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ errorMessage }}
        </div>
      </div>

      <div class="login-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/partials/Header.vue';
import AppFooter from '../components/partials/Footer.vue';
import LoginForm from '../components/auth/LoginForm.vue';

export default defineComponent({
  name: 'LoginView',
  components: {
    AppHeader,
    AppFooter,
    LoginForm
  },
  setup() {
    const router = useRouter();
    const errorMessage = ref('');

    const handleLoginSuccess = () => {
      router.push('/dashboard');
    };

    const handleLoginError = (message: string) => {
      errorMessage.value = message;
    };

    return {
      errorMessage,
      handleLoginSuccess,
      handleLoginError
    };
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  position: relative;
}

.login-header {
  padding: 2.5rem 2.5rem 1.5rem;
  text-align: center;
}

.logo {
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: #42b983;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.back-link {
  padding: 0.5rem 1rem;
  color: #64748b;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #42b983;
}

.error-message {
  padding: 0.75rem 1.5rem 1.5rem;
  margin: 0 1.5rem 1.5rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.error-icon {
  margin-right: 0.5rem;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  top: -250px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #2c3e50 0%, #1e293b 100%);
  bottom: -150px;
  left: -100px;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  top: 50%;
  left: 15%;
}

@media (max-width: 640px) {
  .login-card {
    max-width: 100%;
  }

  .login-header {
    padding: 2rem 1.5rem 1rem;
  }
}
</style>
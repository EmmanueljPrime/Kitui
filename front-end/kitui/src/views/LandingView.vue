<template>
  <div class="landing-container">
    <!-- Utilisation du Header sans notification ni bouton d'aide pour la landing page -->
    <AppHeader
        title="Kitui"
        :showHelpButton="false"
        :showNotifications="false"
    >
      <template #actions>
        <router-link to="/login" class="login-button">
          Se connecter
        </router-link>
      </template>
    </AppHeader>

    <div class="hero-section">
      <div class="content-wrapper">
        <h1 class="title">Bienvenue sur <span class="highlight">Kitui</span></h1>
        <p class="subtitle">Créez des kits UI personnalisés pour vos projets en quelques clics</p>
        <div class="cta-buttons">
          <router-link to="/login" class="primary-button">
            <span class="btn-text">Se connecter</span>
            <span class="btn-icon">→</span>
          </router-link>
          <a href="#features" class="secondary-button">En savoir plus</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="design-element design-circle"></div>
        <div class="design-element design-square"></div>
        <div class="illustration">
          <div class="ui-mockup">
            <div class="mockup-header"></div>
            <div class="mockup-content">
              <div class="mockup-sidebar"></div>
              <div class="mockup-main">
                <div class="mockup-widget"></div>
                <div class="mockup-widget"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="features" class="features-section">
      <h2 class="section-title">Pourquoi choisir Kitui?</h2>
      <div class="features-grid">
        <FeatureCard
            icon="🎨"
            title="Design personnalisé"
            description="Créez un design unique adapté à l'image de vos clients"
        />
        <FeatureCard
            icon="⚡"
            title="Rapide et efficace"
            description="Générez des kits UI en quelques minutes plutôt qu'en jours"
        />
        <FeatureCard
            icon="📱"
            title="100% responsive"
            description="Des designs qui s'adaptent parfaitement à tous les appareils"
        />
        <FeatureCard
            icon="🔄"
            title="Facilement modifiable"
            description="Modifiez et régénérez vos kits à tout moment"
        />
      </div>
    </div>

    <!-- Utilisation du Footer au lieu du footer intégré -->
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '../components/partials/Header.vue';
import AppFooter from '../components/partials/Footer.vue';
import FeatureCard from "../components/landing/FeatureCard.vue";

export default defineComponent({
  name: 'LandingView',
  components: {
    AppHeader,
    AppFooter,
    FeatureCard,
  }
});
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  display: flex;
  flex-direction: column;
}

.hero-section {
  display: flex;
  flex-wrap: wrap;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  min-height: 60vh; /* Réduit de 80vh à 60vh pour tenir compte du header */
}

.content-wrapper {
  flex: 1;
  min-width: 300px;
  padding-right: 2rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.highlight {
  color: #42b983;
}

.subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-button, .secondary-button {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.secondary-button {
  background-color: transparent;
  color: #42b983;
  border: 2px solid #42b983;
}

.secondary-button:hover {
  background-color: #f0f9f4;
  transform: translateY(-2px);
}

.btn-text {
  margin-right: 0.5rem;
}

.login-button {
  padding: 0.5rem 1.25rem;
  background-color: #42b983;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  min-width: 300px;
  height: 400px;
  position: relative;
}

.design-element {
  position: absolute;
  opacity: 0.6;
  z-index: 0;
}

.design-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  top: 50px;
  right: 50px;
  opacity: 0.2;
}

.design-square {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #2c3e50 0%, #1e293b 100%);
  bottom: 50px;
  left: 50px;
  transform: rotate(45deg);
  opacity: 0.1;
}

.illustration {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ui-mockup {
  width: 90%;
  height: 80%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mockup-header {
  height: 50px;
  background-color: #42b983;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.mockup-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.mockup-sidebar {
  width: 30%;
  background-color: #f1f5f9;
  border-right: 1px solid #e2e8f0;
}

.mockup-main {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mockup-widget {
  height: 40%;
  background-color: #f1f5f9;
  border-radius: 8px;
  animation: pulse 2s infinite alternate;
}

@keyframes pulse {
  0% {
    background-color: #f1f5f9;
  }
  100% {
    background-color: #e2e8f0;
  }
}

.features-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1e293b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 1rem;
  }

  .content-wrapper {
    padding-right: 0;
    margin-bottom: 3rem;
  }

  .cta-buttons {
    justify-content: center;
  }

  .title {
    font-size: 2.5rem;
  }

  .hero-image {
    height: 300px;
  }
}
</style>
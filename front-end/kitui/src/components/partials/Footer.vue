<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-text">Kitui</span>
          </div>
          <p class="copyright">© {{ currentYear }} Kitui. Tous droits réservés.</p>
        </div>

        <div class="footer-links">
          <div class="links-column">
            <h4 class="links-title">Produit</h4>
            <ul class="links-list">
              <li><a href="#">Fonctionnalités</a></li>
              <li><a href="#">Tarifs</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div class="links-column">
            <h4 class="links-title">Ressources</h4>
            <ul class="links-list">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutoriels</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div class="links-column">
            <h4 class="links-title">Entreprise</h4>
            <ul class="links-list">
              <li><a href="#">À propos</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Carrières</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="legal-links">
          <a href="#">Conditions d'utilisation</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Mentions légales</a>
        </div>

        <div class="social-links">
          <a href="#" class="social-link">
            <span class="social-icon">📱</span>
          </a>
          <a href="#" class="social-link">
            <span class="social-icon">💼</span>
          </a>
          <a href="#" class="social-link">
            <span class="social-icon">📷</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'AppFooter',
  setup() {
    const currentYear = computed(() => new Date().getFullYear());

    return {
      currentYear
    };
  }
});
</script>

<style scoped>
.app-footer {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 3rem 0 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-brand {
  flex: 1;
  min-width: 250px;
}

.logo {
  margin-bottom: 1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #42b983;
}

.copyright {
  color: #94a3b8;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.links-column {
  min-width: 150px;
}

.links-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-list li {
  margin-bottom: 0.5rem;
}

.links-list a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.links-list a:hover {
  color: #42b983;
}

.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legal-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #42b983;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer-content, .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-content {
    gap: 2rem;
  }

  .footer-links {
    width: 100%;
    justify-content: space-between;
  }

  .social-links {
    margin-top: 1rem;
  }
}
</style>
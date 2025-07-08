<template>
    <div>
        <!-- Bouton de sauvegarde qui apparaît dans la barre d'action -->
<button class="save-button" @click="openSaveModal">
<span class="save-icon">💾</span>
Enregistrer
</button>

<!-- Modal de sauvegarde du kit -->
<div v-if="showSaveModal" class="modal-overlay" @click="showSaveModal = false">
<div class="modal-content save-modal" @click.stop>
<div class="modal-header">
    <h3>Sauvegarder le kit</h3>
<button class="close-button" @click="showSaveModal = false">×</button>
</div>
<div class="modal-body">
<div class="form-group">
    <label for="kit-name">Nom du kit</label>
<input
id="kit-name"
v-model="kitToSave.name"
type="text"
class="form-input"
placeholder="Entrez un nom pour votre kit"
    />
    </div>
    <div class="form-group">
    <label for="kit-description">Description</label>
    <textarea
    id="kit-description"
v-model="kitToSave.description"
class="form-textarea"
placeholder="Décrivez brièvement ce kit (optionnel)"
rows="3"
    ></textarea>
    </div>
    <div class="form-group">
    <label for="kit-tags">Tags</label>
    <div class="tag-input-container">
<input
    id="kit-tags"
v-model="tagsInput"
type="text"
class="form-input"
placeholder="Séparez les tags par des virgules"
@keydown.enter.prevent="addTag"
@keydown.tab.prevent="addTag"
@keydown.comma.prevent="addTagFromComma"
/>
<button
    type="button"
class="add-tag-button"
@click="addTag"
:disabled="!tagsInput.trim()"
    >
    Ajouter
    </button>
    </div>
    <div class="tags-container" v-if="kitToSave.tags.length > 0">
    <span v-for="(tag, index) in kitToSave.tags" :key="index" class="tag">
    {{ tag }}
<button type="button" class="tag-remove" @click="removeTag(index)">×</button>
</span>
</div>
</div>
<div class="form-group">
<label class="checkbox-label">
<input type="checkbox" v-model="kitToSave.isPublic" />
    Rendre ce kit public
<span class="helper-text">Les kits publics sont visibles par tous les utilisateurs</span>
</label>
</div>
<div class="form-group" v-if="existingKits.length > 0">
    <label for="overwrite-kit">Écraser un kit existant</label>
<select id="overwrite-kit" v-model="kitToSave.overwriteId" class="form-select">
<option value="">Créer un nouveau kit</option>
<option v-for="kit in existingKits" :key="kit.id" :value="kit.id">
    {{ kit.name }} (Modifié le {{ formatDate(kit.updatedAt) }})
</option>
</select>
</div>
</div>
<div class="modal-footer">
<button type="button" class="cancel-button" @click="showSaveModal = false">Annuler</button>
    <button
type="button"
class="save-confirm-button"
:disabled="!kitToSave.name.trim() || isSaving"
@click="confirmSaveKit"
    >
    <span v-if="isSaving" class="saving-indicator">
<span class="saving-dot"></span>
    <span class="saving-dot"></span>
    <span class="saving-dot"></span>
    </span>
    <span v-else>Sauvegarder</span>
</button>
</div>
</div>
</div>

<!-- Notification de sauvegarde réussie -->
<div class="save-notification" :class="{ 'show': showSaveNotification }">
<div class="notification-icon">✓</div>
<div class="notification-content">
<p class="notification-title">Sauvegarde réussie</p>
<p class="notification-message">{{ saveNotificationMessage }}</p>
</div>
</div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

interface Kit {
    id: number;
    name: string;
    description: string | null;
    isPublic: boolean;
    config: any;
    createdAt: string;
    updatedAt: string;
    userId: number;
    tags: string[];
}

export default defineComponent({
    name: 'KitSaveComponent',
    props: {
        config: {
            type: Object as PropType<any>,
            required: true
        },
        kitName: {
            type: String,
            required: true
        },
        userId: {
            type: Number,
            required: true
        }
    },
    emits: ['update:kitName', 'kit-saved'],
    setup(props, { emit }) {
        // État de la modal et de la sauvegarde
        const showSaveModal = ref(false);
        const isSaving = ref(false);
        const tagsInput = ref('');
        const existingKits = ref<Kit[]>([]);

        // Notification
        const showSaveNotification = ref(false);
        const saveNotificationMessage = ref('');

        // Données du kit à sauvegarder
        const kitToSave = ref({
            name: props.kitName,
            description: '',
            config: {},
            tags: [] as string[],
            isPublic: false,
            overwriteId: ''
        });

        // Charger les kits existants
        const loadExistingKits = async () => {
            try {
                const response = await fetch(`/api/users/${props.userId}/kits`);
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des kits');
                }

                existingKits.value = await response.json();
            } catch (error) {
                console.error('Erreur lors du chargement des kits:', error);
                existingKits.value = []; // Initialiser à un tableau vide en cas d'erreur
            }
        };

        // Ouvrir la modal de sauvegarde
        const openSaveModal = () => {
            // Réinitialiser le formulaire avec les données actuelles
            kitToSave.value = {
                name: props.kitName,
                description: '',
                config: JSON.parse(JSON.stringify(props.config)),
                tags: [],
                isPublic: false,
                overwriteId: ''
            };

            // Charger les kits existants si nécessaire
            if (existingKits.value.length === 0) {
                loadExistingKits();
            }

            // Ouvrir la modal
            showSaveModal.value = true;
        };

        // Ajouter un tag
        const addTag = () => {
            if (!tagsInput.value.trim()) return;

            const tags = tagsInput.value.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag && !kitToSave.value.tags.includes(tag));

            if (tags.length > 0) {
                kitToSave.value.tags = [...kitToSave.value.tags, ...tags];
                tagsInput.value = '';
            }
        };

        // Ajouter un tag quand l'utilisateur tape une virgule
        const addTagFromComma = () => {
            // Supprimer la virgule qui a déclenché l'événement
            const tagText = tagsInput.value.replace(/,$/, '').trim();

            if (tagText && !kitToSave.value.tags.includes(tagText)) {
                kitToSave.value.tags.push(tagText);
                tagsInput.value = '';
            }
        };

        // Supprimer un tag
        const removeTag = (index: number) => {
            kitToSave.value.tags.splice(index, 1);
        };

        // Formater la date pour l'affichage
        const formatDate = (dateString: string) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        };

        // Confirmer la sauvegarde du kit
        const confirmSaveKit = async () => {
            if (!kitToSave.value.name.trim()) return;

            // Ajouter les tags restants s'il y en a
            addTag();

            // Commencer le processus de sauvegarde
            isSaving.value = true;

            try {
                // Créer l'objet de kit à envoyer à l'API
                const kitData = {
                    name: kitToSave.value.name,
                    description: kitToSave.value.description || '',
                    config: kitToSave.value.config,
                    tags: kitToSave.value.tags,
                    isPublic: kitToSave.value.isPublic,
                    userId: props.userId
                };

                let response;
                let savedKit;

                // Mettre à jour ou créer un nouveau kit
                if (kitToSave.value.overwriteId) {
                    // Mettre à jour un kit existant
                    response = await fetch(`/api/kits/${kitToSave.value.overwriteId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(kitData)
                    });

                    saveNotificationMessage.value = `Le kit "${kitToSave.value.name}" a été mis à jour avec succès!`;
                } else {
                    // Créer un nouveau kit
                    response = await fetch('/api/kits', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(kitData)
                    });

                    saveNotificationMessage.value = `Le kit "${kitToSave.value.name}" a été créé avec succès!`;
                }

                if (!response.ok) {
                    throw new Error('Erreur lors de la sauvegarde du kit');
                }

                savedKit = await response.json();

                // Mettre à jour le nom du kit dans le parent
                emit('update:kitName', kitToSave.value.name);

                // Émettre un événement pour indiquer que le kit a été sauvegardé
                emit('kit-saved', savedKit);

                // Fermer la modal
                showSaveModal.value = false;

                // Afficher la notification
                showSaveNotification.value = true;
                setTimeout(() => {
                    showSaveNotification.value = false;
                }, 3000);

                // Recharger les kits existants
                loadExistingKits();

                return savedKit;
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du kit:', error);
                alert('Une erreur est survenue lors de la sauvegarde du kit.');
            } finally {
                isSaving.value = false;
            }
        };

        // Charger les kits au montage du composant
        loadExistingKits();

        return {
            showSaveModal,
            isSaving,
            tagsInput,
            existingKits,
            kitToSave,
            showSaveNotification,
            saveNotificationMessage,

            // Méthodes
            openSaveModal,
            addTag,
            addTagFromComma,
            removeTag,
            formatDate,
            confirmSaveKit
        };
    }
});
</script>

<style scoped>
/* Styles pour le bouton de sauvegarde principal */
.save-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.save-button:hover {
    background-color: #3aa876;
}

.save-icon {
    font-size: 1.125rem;
}

/* Styles pour la modal de sauvegarde */
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
    border-radius: 0.5rem;
    width: 90%;
    max-width: 550px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #334155;
    margin: 0;
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
    border: none;
    cursor: pointer;
}

.close-button:hover {
    color: #1e293b;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

/* Formulaire */
.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
}

.form-input, .form-textarea, .form-select {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #1f2937;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.helper-text {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
}

/* Checkbox */
.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    margin-top: 0.125rem;
}

/* Tags */
.tag-input-container {
    display: flex;
    gap: 0.5rem;
}

.tag-input-container .form-input {
    flex: 1;
}

.add-tag-button {
    padding: 0.625rem 1rem;
    background-color: #f1f5f9;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.add-tag-button:hover:not(:disabled) {
    background-color: #e2e8f0;
}

.add-tag-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.tag {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: #f1f5f9;
    color: #4b5563;
    border-radius: 0.25rem;
    font-size: 0.75rem;
}

.tag-remove {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.tag-remove:hover {
    color: #ef4444;
}

/* Boutons */
.cancel-button, .save-confirm-button {
    padding: 0.625rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.cancel-button {
    background-color: #f1f5f9;
    color: #4b5563;
}

.cancel-button:hover {
    background-color: #e2e8f0;
}

.save-confirm-button {
    background-color: #42b983;
    color: white;
    min-width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.save-confirm-button:hover:not(:disabled) {
    background-color: #3aa876;
}

.save-confirm-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Indicateur de sauvegarde */
.saving-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
}

.saving-dot {
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
    animation: pulse 1s infinite ease-in-out;
}

.saving-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.saving-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0%, 100% {
        opacity: 0.5;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.3);
    }
}

/* Notification de sauvegarde */
.save-notification {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(150%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 90;
}

.save-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification-icon {
    width: 2rem;
    height: 2rem;
    background-color: #42b983;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.notification-content {
    flex: 1;
}

.notification-title {
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: #334155;
}

.notification-message {
    font-size: 0.875rem;
    color: #4b5563;
    margin: 0;
}
</style>
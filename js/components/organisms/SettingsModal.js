import { Button } from '../atoms/Button.js';
import { Input } from '../atoms/Input.js';

/**
 * SettingsModal Component - Settings modal dialog
 */
export class SettingsModal {
    /**
     * Create settings modal
     * @param {Object} options - Modal options
     * @param {Function} options.onSave - Save handler
     * @param {Function} options.onClose - Close handler
     * @param {Object} options.initialValues - Initial form values
     * @param {Function} options.onFetchModels - Callback to fetch available models
     * @returns {Object} Modal element and methods
     */
    static create({ onSave, onClose, initialValues = {}, onFetchModels }) {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'modal';

        const content = document.createElement('div');
        content.className = 'modal-content';

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Settings';
        content.appendChild(title);

        // API Key input
        const apiKeyInput = Input.text({
            id: 'api-key-input',
            placeholder: 'Enter Gemini API Key',
            value: initialValues.apiKey || '',
            className: 'form-input'
        });
        const apiKeyGroup = Input.formGroup('API Key', apiKeyInput);
        content.appendChild(apiKeyGroup);

        // Model select (initially enabled if API key exists, disabled otherwise)
        const modelSelect = Input.select({
            id: 'model-select',
            className: 'form-input',
            value: initialValues.model || '',
            options: [
                { value: '', text: initialValues.apiKey ? 'Click to load models' : 'Enter API key first', disabled: true }
            ]
        });
        // Only disable if no API key
        modelSelect.disabled = !initialValues.apiKey;
        const modelGroup = Input.formGroup('Model', modelSelect);

        // Add error message container for model loading
        const modelError = document.createElement('div');
        modelError.className = 'error-message';
        modelError.style.cssText = 'color: var(--error-color, #ef4444); font-size: 0.875rem; margin-top: 4px; display: none;';
        modelGroup.appendChild(modelError);

        content.appendChild(modelGroup);

        // Track if models have been loaded
        let modelsLoaded = false;
        let cachedModels = null;

        // Function to load models
        const loadModels = async (apiKey, forceReload = false) => {
            // If models already loaded and not forcing reload, skip
            if (modelsLoaded && !forceReload) {
                return;
            }

            if (!apiKey || !apiKey.trim()) {
                modelSelect.disabled = true;
                modelSelect.innerHTML = '<option value="">Enter API key first</option>';
                modelError.style.display = 'none';
                modelsLoaded = false;
                cachedModels = null;
                return;
            }

            try {
                modelError.style.display = 'none';
                modelSelect.disabled = true;
                modelSelect.innerHTML = '<option value="">Loading models...</option>';

                const models = await onFetchModels(apiKey);

                if (!models || models.length === 0) {
                    throw new Error('No models available');
                }

                cachedModels = models;

                // Populate dropdown with fetched models
                modelSelect.innerHTML = '';
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = model.displayName;
                    modelSelect.appendChild(option);
                });

                // Set to saved model or first available model
                if (initialValues.model && models.some(m => m.name === initialValues.model)) {
                    modelSelect.value = initialValues.model;
                } else {
                    modelSelect.value = models[0].name;
                }

                modelSelect.disabled = false;
                modelError.style.display = 'none';
                modelsLoaded = true;

            } catch (error) {
                modelSelect.innerHTML = '<option value="">Failed to load models</option>';
                modelError.textContent = `Error: ${error.message}. Please check your API key.`;
                modelError.style.display = 'block';
                modelSelect.disabled = true;
                modelsLoaded = false;
                cachedModels = null;
            }
        };

        // Load models when user clicks/focuses on the dropdown
        modelSelect.addEventListener('focus', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey && !modelsLoaded) {
                loadModels(apiKey);
            }
        });

        // Also load models when user clicks the dropdown
        modelSelect.addEventListener('mousedown', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey && !modelsLoaded) {
                loadModels(apiKey);
            }
        });

        // Load models on API key blur (and force reload)
        apiKeyInput.addEventListener('blur', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                // Force reload if API key changed
                loadModels(apiKey, true);
            }
        });

        // Also trigger on Enter key
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                loadModels(apiKeyInput.value.trim(), true);
            }
        });

        // --- Data Management Section ---
        const dataTitle = document.createElement('h4');
        dataTitle.textContent = 'Data Management';
        dataTitle.style.marginTop = '20px';
        dataTitle.style.marginBottom = '10px';
        content.appendChild(dataTitle);

        const dataControls = document.createElement('div');
        dataControls.style.display = 'flex';
        dataControls.style.gap = '10px';
        dataControls.style.marginBottom = '20px';

        // Export All
        const exportAllBtn = Button.secondary('Export Backup', () => {
            // Dispatch event for App to handle
            const event = new CustomEvent('request-export-all');
            window.dispatchEvent(event);
        });

        // Import
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json';
        importInput.style.display = 'none';
        importInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const event = new CustomEvent('request-import', { detail: { file } });
                window.dispatchEvent(event);
            }
            // Reset input
            importInput.value = '';
        };

        const importBtn = Button.secondary('Import Backup', () => {
            if (confirm('Importing will add entries to your existing journal. Continue?')) {
                importInput.click();
            }
        });

        dataControls.appendChild(exportAllBtn);
        dataControls.appendChild(importBtn);
        dataControls.appendChild(importInput);
        content.appendChild(dataControls);

        // Save button
        const saveBtn = Button.primary('Save', () => {
            const apiKey = apiKeyInput.value.trim();
            const model = modelSelect.value;

            if (!apiKey) {
                modelError.textContent = 'Please enter an API key';
                modelError.style.display = 'block';
                return;
            }

            if (!model || modelSelect.disabled) {
                modelError.textContent = 'Please select a valid model';
                modelError.style.display = 'block';
                return;
            }

            onSave({ apiKey, model });
        }, 'save-settings-btn');
        content.appendChild(saveBtn);

        // Cancel button
        const cancelBtn = Button.secondary('Cancel', onClose, 'close-settings-btn');
        content.appendChild(cancelBtn);

        modal.appendChild(content);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) onClose();
        });

        // Load models if API key is already provided (first setup)
        if (initialValues.apiKey && !initialValues.model) {
            setTimeout(() => loadModels(initialValues.apiKey), 100);
        }

        return {
            element: modal,

            /**
             * Open the modal
             */
            open() {
                modal.classList.add('open');
                // Don't auto-reload models on open to preserve selection
            },

            /**
             * Close the modal
             */
            close() {
                modal.classList.remove('open');
            },

            /**
             * Update form values
             * @param {Object} values - New values
             */
            setValues(values) {
                if (values.apiKey !== undefined) {
                    apiKeyInput.value = values.apiKey;
                    if (values.apiKey) {
                        // Reset models loaded flag when API key changes
                        modelsLoaded = false;
                    }
                }
                if (values.model !== undefined && !modelSelect.disabled) {
                    modelSelect.value = values.model;
                }
            }
        };
    }
}

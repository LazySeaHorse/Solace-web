/**
 * Input Component - Various input types
 */
export class Input {
    /**
     * Create a text input element
     * @param {Object} options - Input options
     * @param {string} options.placeholder - Placeholder text
     * @param {string} options.value - Initial value
     * @param {Function} options.onInput - Input event handler
     * @param {Function} options.onKeyPress - Keypress event handler
     * @param {string} options.id - Element ID (optional)
     * @param {string} options.className - CSS class (optional)
     * @returns {HTMLInputElement}
     */
    static text({ placeholder = '', value = '', onInput = null, onKeyPress = null, id = '', className = 'text-input' }) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = className;
        input.placeholder = placeholder;
        input.value = value;
        input.autocomplete = 'off';

        if (id) input.id = id;
        if (onInput) input.addEventListener('input', onInput);
        if (onKeyPress) input.addEventListener('keypress', onKeyPress);

        return input;
    }

    /**
     * Create a password input element
     * @param {Object} options - Input options
     * @returns {HTMLInputElement}
     */
    static password({ placeholder = '', value = '', id = '', className = 'form-input' }) {
        const input = document.createElement('input');
        input.type = 'password';
        input.className = className;
        input.placeholder = placeholder;
        input.value = value;

        if (id) input.id = id;

        return input;
    }

    /**
     * Create a select dropdown
     * @param {Object} options - Select options
     * @param {Array} options.options - Array of {value, text} objects
     * @param {string} options.value - Initial selected value
     * @param {Function} options.onChange - Change event handler
     * @param {string} options.id - Element ID (optional)
     * @param {string} options.className - CSS class (optional)
     * @returns {HTMLSelectElement}
     */
    static select({ options = [], value = '', onChange = null, id = '', className = 'select-input' }) {
        const select = document.createElement('select');
        select.className = className;

        if (id) select.id = id;

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            if (opt.value === value) option.selected = true;
            select.appendChild(option);
        });

        if (onChange) select.addEventListener('change', onChange);

        return select;
    }

    /**
     * Create a form group with label and input
     * @param {string} label - Label text
     * @param {HTMLElement} input - Input element
     * @returns {HTMLDivElement}
     */
    static formGroup(label, input) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
    }
}

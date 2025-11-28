import { Button } from '../atoms/Button.js';
import { MarkdownParser } from '../../utils/MarkdownParser.js';

/**
 * EntryDetailModal - View/Edit/Delete journal entry
 */
export class EntryDetailModal {
    static create({ onUpdate, onDelete, onExport, onClose }) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'entry-detail-modal';

        const content = document.createElement('div');
        content.className = 'modal-content';
        // Styles for scrolling and layout
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.maxHeight = '85vh';
        content.style.width = '90%';
        content.style.maxWidth = '600px';

        // We'll store the current entry here
        let currentEntry = null;
        let isEditing = false;

        // Render function to switch between View and Edit modes
        const render = () => {
            content.innerHTML = '';

            if (!currentEntry) return;

            const dateStr = new Date(currentEntry.date).toLocaleString();

            // Header
            const header = document.createElement('div');
            header.className = 'modal-header';
            header.style.marginBottom = '20px';
            header.style.flexShrink = '0'; // Prevent header from shrinking

            const title = document.createElement('h3');
            title.textContent = isEditing ? 'Edit Entry' : dateStr;
            header.appendChild(title);

            // Content Area
            const body = document.createElement('div');
            body.className = 'modal-body';
            body.style.marginBottom = '20px';
            body.style.overflowY = 'auto'; // Enable vertical scrolling
            body.style.flex = '1'; // Take up remaining space
            body.style.minHeight = '0'; // Fix for nested flex scrolling

            let textarea;

            if (isEditing) {
                textarea = document.createElement('textarea');
                textarea.className = 'form-input';
                textarea.style.height = '100%'; // Fill the body height
                textarea.style.minHeight = '300px';
                textarea.style.resize = 'none';
                textarea.value = currentEntry.summary; // Editing the summary
                body.appendChild(textarea);
            } else {
                const text = document.createElement('div');
                text.className = 'markdown-body';
                text.innerHTML = MarkdownParser.parse(currentEntry.summary);
                text.style.lineHeight = '1.6';
                body.appendChild(text);

                if (currentEntry.mood) {
                    const mood = document.createElement('div');
                    mood.className = 'entry-mood';
                    mood.textContent = `Mood: ${currentEntry.mood}`;
                    mood.style.marginTop = '15px';
                    mood.style.fontWeight = '500';
                    mood.style.color = 'var(--text-secondary)';
                    body.appendChild(mood);
                }
            }

            // Footer Actions
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            footer.style.display = 'flex';
            footer.style.gap = '10px';
            footer.style.flexWrap = 'wrap';
            footer.style.flexShrink = '0'; // Prevent footer from shrinking
            footer.style.width = '100%';

            if (isEditing) {
                footer.style.justifyContent = 'flex-end';

                const saveBtn = Button.primary('Save Changes', () => {
                    const updatedEntry = { ...currentEntry, summary: textarea.value };
                    onUpdate(updatedEntry);
                    isEditing = false;
                });

                const cancelBtn = Button.secondary('Cancel', () => {
                    isEditing = false;
                    render();
                });

                footer.appendChild(saveBtn);
                footer.appendChild(cancelBtn);
            } else {
                // View Mode: Split Delete (left) and others (right)
                footer.style.justifyContent = 'space-between';
                footer.style.alignItems = 'center';

                const rightGroup = document.createElement('div');
                rightGroup.style.display = 'flex';
                rightGroup.style.gap = '10px';

                const editBtn = Button.secondary('Edit', () => {
                    isEditing = true;
                    render();
                });

                const exportBtn = Button.secondary('Export', () => onExport(currentEntry));

                const closeBtn = Button.secondary('Close', onClose);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'btn btn-text';
                deleteBtn.style.color = '#ef4444';
                deleteBtn.style.padding = '0'; // Remove padding to align better
                deleteBtn.onclick = () => {
                    if (confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
                        onDelete(currentEntry.id);
                    }
                };

                // Append Delete to Left
                footer.appendChild(deleteBtn);

                // Append others to Right Group
                rightGroup.appendChild(editBtn);
                rightGroup.appendChild(exportBtn);
                rightGroup.appendChild(closeBtn);

                // Append Right Group to Footer
                footer.appendChild(rightGroup);
            }

            content.appendChild(header);
            content.appendChild(body);
            content.appendChild(footer);
        };

        modal.appendChild(content);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) onClose();
        });

        return {
            element: modal,
            open(entry) {
                currentEntry = entry;
                isEditing = false;
                render();
                modal.classList.add('open');
            },
            close() {
                modal.classList.remove('open');
            }
        };
    }
}
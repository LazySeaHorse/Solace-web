import { Input } from '../atoms/Input.js';
import { Button } from '../atoms/Button.js';
import { Icon } from '../atoms/Icon.js';

/**
 * InputArea Component - Chat input with send button
 */
export class InputArea {
    /**
     * Create an input area element
     * @param {Function} onSend - Send callback
     * @returns {HTMLDivElement}
     */
    static create(onSend) {
        const container = document.createElement('div');
        container.className = 'input-area';

        const input = Input.text({
            placeholder: 'Type a message...',
            id: 'chat-input',
            onKeyPress: (e) => {
                if (e.key === 'Enter') {
                    onSend();
                }
            }
        });

        const sendBtn = Button.send(onSend, Icon.render('send'));
        sendBtn.id = 'send-btn';

        container.appendChild(input);
        container.appendChild(sendBtn);

        return container;
    }
}

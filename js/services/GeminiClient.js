/**
 * GeminiClient - Handles communication with Google's Gemini API
 */
export class GeminiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    /**
     * Update the API key
     * @param {string} key - New API key
     */
    setApiKey(key) {
        this.apiKey = key;
    }

    /**
     * List available models from Gemini API
     * @returns {Promise<Array>} Array of available models with name and displayName
     */
    async listAvailableModels() {
        if (!this.apiKey) throw new Error("API Key missing");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to fetch models');
        }

        const data = await response.json();

        // Filter to only include models that support generateContent
        const generativeModels = data.models
            .filter(model =>
                model.supportedGenerationMethods &&
                model.supportedGenerationMethods.includes('generateContent')
            )
            .map(model => ({
                name: model.name.replace('models/', ''), // Remove 'models/' prefix
                displayName: model.displayName || model.name
            }));

        return generativeModels;
    }

    /**
     * Generate content using Gemini API
     * @param {string} model - Model name (e.g., 'gemini-flash-latest')
     * @param {string} prompt - User prompt
     * @param {Array} history - Chat history array
     * @returns {Promise<string>} AI response
     */
    async generateContent(model, prompt, history = []) {
        if (!this.apiKey) throw new Error("API Key missing");

        const systemInstruction = {
            role: 'user',
            parts: [{ text: "You are Solace, a mental health journaling companion. Keep responses short (under 50 words), friendly, and conversational. Ask follow-up questions. Do not be cringy. At the end of your response, provide exactly 3 short reply suggestions separated by pipes, starting with a pipe, like: |Sure|No thanks|Maybe" }]
        };

        const contents = [systemInstruction];
        history.forEach(msg => {
            contents.push({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            });
        });
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Generate a journal summary from chat history
     * @param {Array} chatHistory - Chat history array
     * @param {string} mood - User's mood
     * @param {string} model - Model name
     * @returns {Promise<string>} Journal entry summary
     */
    async generateJournalSummary(chatHistory, mood, model = 'gemini-flash-latest') {
        if (!this.apiKey) throw new Error("API Key missing");

        // Build conversation context
        let conversationText = chatHistory.map(msg => {
            const role = msg.role === 'ai' ? 'Solace' : 'Me';
            return `${role}: ${msg.text}`;
        }).join('\n');

        const prompt = `Based on the following conversation, write a personal journal entry from my perspective. Capture the key insights, emotions, and learnings I experienced during this conversation. Write it naturally, as if I'm reflecting on what I learned and felt. Keep it under 300 words and format it like a real journal entry a person might write.

My mood during this conversation: ${mood || 'not specified'}

Conversation:
${conversationText}

Write the journal entry now:`;

        const contents = [{
            role: 'user',
            parts: [{ text: prompt }]
        }];

        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    }
}

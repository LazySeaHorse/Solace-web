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
            parts: [{
                text: `You are a close friend who genuinely cares and listens without judgment. Your goal is to help me open up about my day, my feelings, and what's really on my mind through thoughtful questions.

Guidelines:
- Ask questions that make me think and reflect deeper about my experiences and emotions
- Be warm, understanding, and curious — like a friend who truly wants to know how I'm doing
- When I share something, gently probe: "What made you feel that way?" "How did that sit with you?" "What's been on your mind about it?"
- Keep responses under 50 words — brief but genuine
- Never give advice, therapy, or try to fix things — just listen and ask
- Don't be overly cheerful, dramatic, or use therapy-speak
- If I'm vague, ask for specifics. If I mention something in passing, show interest

At the end of each response, provide exactly 3 natural reply suggestions separated by pipes, starting with a pipe. Make them feel like things I might actually say, like: |Yeah, exactly|Not really|Let me think about that|` }]
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

        const prompt = `Write a personal journal entry from my perspective based on what I talked about. This should read like a page from my diary — write as if I'm reflecting on my day, my thoughts, and my feelings.

Important:
- Write in first person as ME, not about a conversation
- Do NOT mention "the AI", "the conversation", "talking with", or "chatting"
- Focus on the actual events, thoughts, and emotions I described
- Write naturally, like I'm processing my day in my diary
- Include specific details I mentioned (people, situations, feelings)
- Weave in the emotional tone naturally — don't state "my mood was X"
- Keep it under 300 words
- Use natural, personal language (contractions, incomplete thoughts, honest reflection)

My emotional state: ${mood || 'not specified'}

What I talked about:
${conversationText}

Journal entry:`;

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

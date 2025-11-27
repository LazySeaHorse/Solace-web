/**
 * MarkdownParser - Utility for parsing markdown to HTML safely
 * Uses marked.js for parsing and DOMPurify for XSS sanitization
 */
export class MarkdownParser {
    /**
     * Configure marked with safe defaults
     */
    static configure() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,        // Convert \n to <br>
                gfm: true,          // GitHub Flavored Markdown
                headerIds: false,   // Don't add IDs to headers
                mangle: false,      // Don't mangle email addresses
                sanitize: false     // We'll use DOMPurify instead
            });
        }
    }

    /**
     * Parse markdown text to safe HTML
     * @param {string} text - Markdown text to parse
     * @returns {string} - Sanitized HTML
     */
    static parse(text) {
        if (!text) return '';

        // Ensure libraries are loaded
        if (typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
            console.error('Markdown libraries not loaded');
            return this.escapeHtml(text);
        }

        try {
            // Configure marked on first use
            if (!this.configured) {
                this.configure();
                this.configured = true;
            }

            // Parse markdown to HTML
            const rawHtml = marked.parse(text);

            // Sanitize HTML to prevent XSS
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'em', 'u', 's', 'del',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li',
                    'a', 'code', 'pre',
                    'blockquote', 'hr'
                ],
                ALLOWED_ATTR: ['href', 'target', 'rel'],
                ALLOW_DATA_ATTR: false,
                FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
                FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
            });

            // Ensure external links open in new tab and are safe
            return this.processLinks(cleanHtml);
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return this.escapeHtml(text);
        }
    }

    /**
     * Process links to add security attributes
     * @param {string} html - HTML string
     * @returns {string} - Processed HTML
     */
    static processLinks(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const links = tempDiv.querySelectorAll('a');
        links.forEach(link => {
            // Add security attributes to external links
            if (link.href && !link.href.startsWith(window.location.origin)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        return tempDiv.innerHTML;
    }

    /**
     * Escape HTML for fallback
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Check if text contains markdown
     * @param {string} text - Text to check
     * @returns {boolean} - True if likely contains markdown
     */
    static hasMarkdown(text) {
        if (!text) return false;

        // Simple heuristic to detect markdown
        const markdownPatterns = [
            /\*\*[\s\S]+?\*\*/,     // Bold
            /\*[\s\S]+?\*/,         // Italic
            /^#+\s/m,               // Headers
            /\[.+?\]\(.+?\)/,       // Links
            /^[-*+]\s/m,            // Lists
            /^>\s/m,                // Blockquotes
            /`[\s\S]+?`/            // Code
        ];

        return markdownPatterns.some(pattern => pattern.test(text));
    }
}

// Mark as configured false initially
MarkdownParser.configured = false;

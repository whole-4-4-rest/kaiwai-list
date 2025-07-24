import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { getContent } from '$lib/content';

export const load = async ({ params }) => {
    try {
        // Get content from pre-loaded cache
        const contentData = getContent('composers', params.slug);
        
        if (!contentData) {
            throw error(404, 'Composer not found');
        }
        
        const { metadata, content } = contentData;

        // Convert markdown to HTML
        const htmlContent = marked(content, { breaks: true });

        return {
            Content: htmlContent,
            metadata: metadata
        };
    } catch (err) {
        console.error('Error loading composer:', err);
        throw error(404, 'Composer not found');
    }
};

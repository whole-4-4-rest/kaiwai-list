import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { getContent } from '$lib/content';

export const load = async ({ params }) => {
    try {
        // Get content from pre-loaded cache
        const contentData = getContent('songs', params.slug);
        
        if (!contentData) {
            throw error(404, 'Article not found');
        }
        
        const { metadata, content } = contentData;

        // Load composer data if composer is specified
        let composerData = null;
        if (metadata.composer) {
            const composerContent = getContent('composers', metadata.composer);
            if (composerContent) {
                composerData = composerContent.metadata;
            }
        }

        // Convert markdown to HTML
        const htmlContent = marked(content, { breaks: true });

        return {
            Content: htmlContent,
            metadata: metadata,
            composer: composerData
        };
    } catch (err) {
        console.error('Error loading song:', err);
        throw error(404, 'Article not found');
    }
};

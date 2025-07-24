import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export const load = async ({ params }) => {
    try {
        // Path to the markdown file - different paths for dev and production
        const contentPath = process.env.NODE_ENV === 'production' ? 'content' : 'static/content';
        const filePath = path.join(process.cwd(), contentPath, 'songs', `${params.slug}.md`);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw error(404, 'Article not found');
        }

        // Read the markdown file
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse frontmatter and content
        const { data: metadata, content } = matter(fileContent);

        // Load composer data if composer is specified
        let composerData = null;
        if (metadata.composer) {
            try {
                const composerFilePath = path.join(process.cwd(), contentPath, 'composers', `${metadata.composer}.md`);
                if (fs.existsSync(composerFilePath)) {
                    const composerFileContent = fs.readFileSync(composerFilePath, 'utf-8');
                    const { data: composerMetadata } = matter(composerFileContent);
                    composerData = composerMetadata;
                }
            } catch (err) {
                console.error('Error loading composer data:', err);
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

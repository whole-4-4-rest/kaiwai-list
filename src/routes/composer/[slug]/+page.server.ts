import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export const load = async ({ params }) => {
    try {
        // Path to the markdown file - different paths for dev and production
        const contentPath = process.env.NODE_ENV === 'production' ? 'content' : 'static/content';
        const filePath = path.join(process.cwd(), contentPath, 'composers', `${params.slug}.md`);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw error(404, 'Composer not found');
        }

        // Read the markdown file
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse frontmatter and content
        const { data: metadata, content } = matter(fileContent);

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

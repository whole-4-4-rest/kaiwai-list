import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Pre-load all content at build time to avoid file system access in production
const contentCache = new Map();

function loadContent() {
    if (contentCache.size > 0) return contentCache;
    
    const contentDir = path.join(process.cwd(), 'content');
    
    // Load songs
    const songsDir = path.join(contentDir, 'songs');
    if (fs.existsSync(songsDir)) {
        const songFiles = fs.readdirSync(songsDir).filter(file => file.endsWith('.md'));
        for (const file of songFiles) {
            const slug = file.replace('.md', '');
            const filePath = path.join(songsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);
            contentCache.set(`songs/${slug}`, { metadata, content });
        }
    }
    
    // Load composers
    const composersDir = path.join(contentDir, 'composers');
    if (fs.existsSync(composersDir)) {
        const composerFiles = fs.readdirSync(composersDir).filter(file => file.endsWith('.md'));
        for (const file of composerFiles) {
            const slug = file.replace('.md', '');
            const filePath = path.join(composersDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);
            contentCache.set(`composers/${slug}`, { metadata, content });
        }
    }
    
    return contentCache;
}

export function getContent(type: 'songs' | 'composers', slug: string) {
    const cache = loadContent();
    return cache.get(`${type}/${slug}`);
}

export function getAllContent(type: 'songs' | 'composers') {
    const cache = loadContent();
    const results = [];
    for (const [key, value] of cache.entries()) {
        if (key.startsWith(`${type}/`)) {
            const slug = key.replace(`${type}/`, '');
            results.push({ slug, ...value });
        }
    }
    return results;
}

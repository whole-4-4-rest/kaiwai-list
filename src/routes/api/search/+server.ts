import { json } from '@sveltejs/kit';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

interface SearchResult {
	type: 'song' | 'composer';
	slug: string;
	title: string;
	excerpt: string;
	metadata: Record<string, any>;
	relevanceScore: number;
}

interface SearchParams {
	keyword: string;
	type?: 'song' | 'composer';
	limit?: number;
}

async function getMarkdownFiles(directory: string): Promise<string[]> {
	try {
		const files = await readdir(directory);
		return files.filter(file => file.endsWith('.md'));
	} catch (error) {
		// Directory doesn't exist or can't be read
		return [];
	}
}

async function parseMarkdownFile(filePath: string, type: 'song' | 'composer'): Promise<{
	slug: string;
	title: string;
	content: string;
	metadata: Record<string, any>;
} | null> {
	try {
		const fileContent = await readFile(filePath, 'utf-8');
		const { data: metadata, content } = matter(fileContent);
		const slug = filePath.split('/').pop()?.replace('.md', '') || '';
		
		return {
			slug,
			title: metadata.title || slug,
			content,
			metadata
		};
	} catch (error) {
		console.error(`Error parsing file ${filePath}:`, error);
		return null;
	}
}

function calculateRelevanceScore(keyword: string, title: string, content: string, metadata: Record<string, any>): number {
	const lowerKeyword = keyword.toLowerCase();
	let score = 0;
	
	// Title match (highest weight)
	if (title.toLowerCase().includes(lowerKeyword)) {
		score += 10;
	}
	
	// Metadata matches (medium weight)
	for (const [key, value] of Object.entries(metadata)) {
		if (typeof value === 'string' && value.toLowerCase().includes(lowerKeyword)) {
			score += 5;
		}
	}
	
	// Content match (lower weight)
	const contentMatches = (content.toLowerCase().match(new RegExp(lowerKeyword, 'g')) || []).length;
	score += contentMatches * 2;
	
	return score;
}

function createExcerpt(content: string, keyword: string, maxLength: number = 150): string {
	const lowerContent = content.toLowerCase();
	const lowerKeyword = keyword.toLowerCase();
	const keywordIndex = lowerContent.indexOf(lowerKeyword);
	
	if (keywordIndex === -1) {
		return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
	}
	
	const start = Math.max(0, keywordIndex - 50);
	const end = Math.min(content.length, keywordIndex + keyword.length + 100);
	const excerpt = content.substring(start, end);
	
	return (start > 0 ? '...' : '') + excerpt + (end < content.length ? '...' : '');
}

export const GET: RequestHandler = async ({ url }) => {
	const keyword = url.searchParams.get('keyword');
	const type = url.searchParams.get('type') as 'song' | 'composer' | null;
	const limit = parseInt(url.searchParams.get('limit') || '10');
	
	if (!keyword) {
		return json({ error: 'Keyword parameter is required' }, { status: 400 });
	}
	
	if (type && !['song', 'composer'].includes(type)) {
		return json({ error: 'Type parameter must be either "song" or "composer"' }, { status: 400 });
	}
	
	const results: SearchResult[] = [];
	const searchTypes: ('song' | 'composer')[] = type ? [type] : ['song', 'composer'];
	
	for (const searchType of searchTypes) {
		// Path to content - different paths for dev and production
		const contentPath = process.env.NODE_ENV === 'production' ? 'content' : 'static/content';
		const directory = join(process.cwd(), contentPath, `${searchType}s`);
		const files = await getMarkdownFiles(directory);
		
		for (const file of files) {
			const filePath = join(directory, file);
			const parsed = await parseMarkdownFile(filePath, searchType);
			
			if (!parsed) continue;
			
			const relevanceScore = calculateRelevanceScore(keyword, parsed.title, parsed.content, parsed.metadata);
			
			if (relevanceScore > 0) {
				results.push({
					type: searchType,
					slug: parsed.slug,
					title: parsed.title,
					excerpt: createExcerpt(parsed.content, keyword),
					metadata: parsed.metadata,
					relevanceScore
				});
			}
		}
	}
	
	// Sort by relevance score (highest first) and apply limit
	const sortedResults = results
		.sort((a, b) => b.relevanceScore - a.relevanceScore)
		.slice(0, limit);
	
	return json({
		query: keyword,
		type: type || 'all',
		totalResults: sortedResults.length,
		results: sortedResults
	});
};
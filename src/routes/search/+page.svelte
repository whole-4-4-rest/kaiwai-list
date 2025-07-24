<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '../../utils/formatDate';

	interface SearchResult {
		type: 'song' | 'composer';
		slug: string;
		title: string;
		excerpt: string;
		metadata: Record<string, any>;
		relevanceScore: number;
	}

	interface SearchResponse {
		query: string;
		type: string;
		totalResults: number;
		results: SearchResult[];
	}

	let searchQuery = '';
	let searchType: 'all' | 'song' | 'composer' = 'all';
	let results: SearchResult[] = [];
	let loading = false;
	let totalResults = 0;
	let searchTimeout: NodeJS.Timeout;
	let hasSearched = false;

	// Get initial search query from URL parameters
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const keyword = urlParams.get('keyword');
		const type = urlParams.get('type') as 'all' | 'song' | 'composer';

		if (keyword) {
			searchQuery = keyword;
			if (type) searchType = type;
			performSearch();
		}
	});

	async function performSearch() {
		if (!searchQuery.trim()) {
			results = [];
			hasSearched = false;
			updateURL();
			return;
		}

		loading = true;
		hasSearched = true;

		try {
			const params = new URLSearchParams({
				keyword: searchQuery.trim(),
				limit: '20'
			});

			if (searchType !== 'all') {
				params.append('type', searchType);
			}

			const response = await fetch(`/api/search?${params}`);
			if (response.ok) {
				const data: SearchResponse = await response.json();
				results = data.results;
				totalResults = data.totalResults;
			} else {
				console.error('Search failed:', response.statusText);
				results = [];
				totalResults = 0;
			}
		} catch (error) {
			console.error('Search error:', error);
			results = [];
			totalResults = 0;
		} finally {
			loading = false;
		}

		updateURL();
	}

	function updateURL() {
		const params = new URLSearchParams();
		if (searchQuery.trim()) {
			params.append('keyword', searchQuery.trim());
			if (searchType !== 'all') {
				params.append('type', searchType);
			}
		}

		const newURL = params.toString() ? `?${params.toString()}` : '/search';
		window.history.replaceState({}, '', newURL);
	}

	function onSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			performSearch();
		}, 300); // Debounce search by 300ms
	}

	function onTypeChange() {
		performSearch();
	}

	function navigateToResult(result: SearchResult) {
		const path = result.type === 'song' ? `/song/${result.slug}` : `/composer/${result.slug}`;
		goto(path);
	}

	function highlightKeyword(text: string, keyword: string): string {
		if (!keyword.trim()) return text;

		const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	}
</script>

<main class="search-page">
	<div class="search-header">
		<h1>検索</h1>
		<div class="search-controls">
			<div class="search-input-container">
				<input
					type="text"
					bind:value={searchQuery}
					on:input={onSearchInput}
					placeholder="曲名やアーティスト名で検索..."
					class="search-input"
				/>
			</div>

			<div class="search-filters">
				<label class:selected={searchType === 'all'}>
					<input type="radio" bind:group={searchType} value="all" on:change={onTypeChange} />
					<span>すべて</span>
				</label>
				<label class:selected={searchType === 'song'}>
					<input type="radio" bind:group={searchType} value="song" on:change={onTypeChange} />
					<span>楽曲</span>
				</label>
				<label class:selected={searchType === 'composer'}>
					<input type="radio" bind:group={searchType} value="composer" on:change={onTypeChange} />
					<span>作曲者</span>
				</label>
			</div>
		</div>
	</div>

	<div class="search-results">
		{#if hasSearched && !loading}
			<div class="results-header">
				<p class="results-count">
					{#if totalResults > 0}
						"{searchQuery}" の検索結果: {totalResults}件
					{:else}
						"{searchQuery}" に一致する結果が見つかりませんでした
					{/if}
				</p>
			</div>
		{/if}

		{#if loading}
			<div class="loading-state">
				<div class="loading-spinner large">⟳</div>
				<p>検索中...</p>
			</div>
		{:else if results.length > 0}
			<div class="results-list">
				{#each results as result}
					<div
						class="result-item {result.type}"
						on:click={() => navigateToResult(result)}
						on:keydown={(e) => e.key === 'Enter' && navigateToResult(result)}
						role="button"
						tabindex="0"
					>
						<div class="result-type">
							{result.type === 'song' ? '楽曲' : '作曲者'}
						</div>
						<h3 class="result-title">
							{@html highlightKeyword(result.title, searchQuery)}
						</h3>
						<p class="result-excerpt">
							{@html highlightKeyword(result.excerpt, searchQuery)}
						</p>
						{#if result.metadata}
							<div class="result-metadata">
								{#if result.type === 'song' && result.metadata.composer}
									<span class="metadata-item">作曲者: {result.metadata.composer}</span>
								{/if}
								{#if result.metadata.date}
									<span class="metadata-item">日付: {formatDate(result.metadata.date)}</span>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else if hasSearched && !loading}
			<div class="no-results">
				<p>検索のヒント:</p>
				<ul>
					<li>別のキーワードを試してください</li>
					<li>より一般的な用語を使用してください</li>
					<li>スペルを確認してください</li>
				</ul>
			</div>
		{:else}
			<div class="search-placeholder">
				<p>楽曲や作曲者を検索してみてください</p>
			</div>
		{/if}
	</div>
</main>

<style>
	.search-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	.search-header {
		margin-bottom: 3rem;
		text-align: center;

		margin-top: 10rem;
	}

	.search-header h1 {
		font-size: 3rem;
		margin-bottom: 2rem;
	}

	.search-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.search-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 100%;
		padding: 1rem 1.2rem;
		font-size: 1.2rem;
		border: 1px solid white;
		border-radius: 1rem;
		background: black;
		color: #ffffff;
	}

	.search-input::placeholder {
		color: #888;
	}

	.search-input:focus {
		outline: none;
		border-color: #4a9eff;
	}

	.search-filters {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.search-filters label {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		cursor: pointer;
		font-size: 1rem;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background: black;
		border: 1px solid white;
	}

	.search-filters input[type='radio'] {
		margin: 0;
		accent-color: #4a9eff;
	}

	.search-filters label.selected {
		color: #4a9eff;
		background: rgba(74, 158, 255, 0.15);
		border-color: rgba(74, 158, 255, 0.3);
	}

	.results-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.results-count {
		font-size: 1.2rem;
		color: white;
		margin: 0;
		font-weight: 300;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem;
		color: white;
	}

	.loading-state p {
		margin-top: 1.5rem;
		font-size: 1.2rem;
		color: white;
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.result-item {
		border: 1px solid white;
		border-radius: 1rem;
		padding: 2rem;
		background: black;
		cursor: pointer;
		position: relative;
	}

	.result-item:hover {
		box-shadow: 0 0 30px -10px white;
	}

	.result-type {
		display: inline-block;
		padding: 0.4rem 1rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 1rem;
		letter-spacing: 0.05em;
	}

	.result-item.song .result-type {
		background: rgba(74, 158, 255, 0.2);
		color: #4a9eff;
		border: 1px solid rgba(74, 158, 255, 0.3);
	}

	.result-item.composer .result-type {
		background: rgba(186, 104, 200, 0.2);
		color: #ba68c8;
		border: 1px solid rgba(186, 104, 200, 0.3);
	}

	.result-title {
		font-size: 1.4rem;
		margin: 0 0 1rem 0;
		color: white;
		line-height: 1.4;
		font-weight: 400;
	}

	.result-excerpt {
		margin: 0 0 1.5rem 0;
		color: white;
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.result-metadata {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.metadata-item {
		font-size: 0.85rem;
		color: white;
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		border: 1px solid white;
	}

	:global(mark) {
		background-color: #ffeb3b;
		color: black;
		padding: 0.1rem 0.1rem;
	}

	.no-results {
		text-align: center;
		padding: 4rem;
		color: #888;
		background: rgba(20, 20, 20, 0.4);
		border-radius: 12px;
		border: 1px solid #333;
	}

	.no-results p {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		color: #aaa;
	}

	.no-results ul {
		text-align: left;
		display: inline-block;
		margin-top: 1rem;
		color: #999;
	}

	.no-results li {
		margin-bottom: 0.7rem;
		list-style-type: none;
		position: relative;
		padding-left: 1rem;
	}

	.no-results li::before {
		content: '•';
		color: #4a9eff;
		position: absolute;
		left: 0;
	}

	.search-placeholder {
		text-align: center;
		padding: 4rem;
		color: white;
		font-size: 1.2rem;
		border-radius: 1rem;
		border: 1px solid white;
	}

	.search-page {
		padding: 1.5rem;
	}

	.search-header h1 {
		font-size: 2.5rem;
	}

	.search-controls {
		max-width: 100%;
	}

	.search-filters {
		gap: 1rem;
		justify-content: center;
	}

	.search-filters label {
		padding: 0.4rem 0.8rem;
		font-size: 0.9rem;
	}

	.result-item {
		padding: 1.5rem;
	}

	.result-metadata {
		flex-direction: column;
		gap: 0.7rem;
	}

	.metadata-item {
		align-self: flex-start;
	}
</style>

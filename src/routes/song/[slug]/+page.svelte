<script>
	import { formatDate } from '../../../utils/formatDate.js';

	const { data } = $props();

	const { Content, metadata, composer } = data;
</script>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>

<main>
	<div class="title">
		<h1>{metadata.title}</h1>
		<p>{metadata.summary}</p>
	</div>
	<div class="data">
		<p>作者: <a href="/composer/{metadata.composer}">{composer?.title || metadata.composer}</a></p>
		<p>公開日: {formatDate(metadata.date)}</p>
		{#if metadata.series}
			<p>シリーズ: {metadata.series}</p>
		{/if}
		<p>界隈度: {metadata.kaiwai_ness} / 3</p>

		{#each metadata.original_urls as url}
			<p>オリジナル: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
		{/each}

		{#if metadata.copied_urls.length > 0}
			{#each metadata.copied_urls as url}
				<p>転載: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
			{/each}
		{/if}
	</div>
	<div class="article">
		{@html Content}
	</div>
</main>

<style>
	main {
		margin-top: 4rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.title {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			height: 15rem;
			width: 100vw;

			h1 {
				font-size: 3rem;
				margin-bottom: 1rem;
			}
		}

		.data {
			border: solid 1px white;
			border-radius: 0.5rem;
		}

		.data,
		.article {
			margin: 0 10rem;
			padding: 1rem;

			:global(h1) {
				font-size: 2rem;
			}

			:global(h2) {
				font-size: 1.5rem;
			}

			:global(h3) {
				font-size: 1.2rem;
			}

			:global(p, a) {
				font-size: 1rem;
			}

			:global(a) {
				text-decoration: underline;
			}
		}
	}
</style>

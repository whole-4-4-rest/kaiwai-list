<script>
	import { formatDate } from '../../../utils/formatDate.js';

	const { data } = $props();
	const { Content, metadata } = data;

	const formattedDate = new Date(metadata.date).toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
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
		<p>活動開始日: {formatDate(metadata.activity_start_date)}</p>
		{#if metadata.activity_end_date}
			<p>活動終了日: {formatDate(metadata.activity_end_date)}</p>
		{/if}
		<p>界隈度: {metadata.kaiwai_ness} / 3</p>

		{#each metadata.accounts as account}
			<p><a href={account} target="_blank" rel="noopener noreferrer">{account}</a></p>
		{/each}

		{#if metadata.same_person}
			<p>
				同一人物: {#each metadata.same_person as person, index}<a href="/composer/{person}"
						>{person}</a
					>{#if index < metadata.same_person.length - 1},&nbsp;{/if}
				{/each}
			</p>
		{/if}

		{#if metadata.alias}
			<p>
				別名: {#each metadata.alias as alias, index}<span>{alias}</span
					>{#if index < metadata.alias.length - 1},&nbsp;{/if}
				{/each}
			</p>
		{/if}
	</div>
	<div class="article">
		{@html Content}
	</div>
</main>

<style>
	main {
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

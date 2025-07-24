<svelte:head>
	<title>界隈曲一覧</title>
	<meta name="description" content="界隈曲の情報をまとめたウェブサイトです。" />
</svelte:head>

<main>
	<div class="title">
		<h1>界隈曲一覧</h1>
		<p>界隈曲の情報をまとめたウェブサイトです。</p>
	</div>
	<div class="buttons">
        <a href="/search">検索</a>
		<a href="https://github.com/whole-4-4-rest/kaiwai-list" class="button">曲を追加</a>
		<a href="https://github.com/whole-4-4-rest/kaiwai-list" class="button"
			>ウェブサイトの制作に貢献する</a
		>
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		width: 100vw;

		display: flex;
		flex-direction: column;
		align-items: center;
        justify-content: center;

		.title {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 15rem;

			h1 {
				font-size: 2.5rem;
				margin-bottom: 0.5rem;
			}

			p {
				font-size: 1.2rem;
				color: var(--text-secondary);
			}
		}

		.buttons {
			display: flex;
			gap: 1rem;

			a {
				background-color: white;
				border-radius: 1rem;
				padding: 0.5rem 1rem;
				color: black;
				font-size: 1rem;
			}
		}
	}
</style>

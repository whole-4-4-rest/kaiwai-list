<script lang="ts">
	import '../styles/app.css';
	import '../styles/basic.css';
	let { children } = $props();
</script>

<header>
	<nav>
		<a href="/">ホーム</a>
		<a href="/search">検索</a>
		<a href="https://github.com/whole-4-4-rest/kaiwai-list/blob/main/static/content/CONTRIBUTING.md">曲を追加</a>
		<a href="https://github.com/whole-4-4-rest/kaiwai-list">ウェブサイトの制作に貢献する</a>
	</nav>
</header>
{@render children()}

<style>
	header {
		background-color: black;
		padding: 1rem;
		border-bottom: solid 1px white;
		height: 4rem;
		position: sticky;
		width: 100%;
		z-index: 1000;

		nav {
			display: flex;
			justify-content: center;
			gap: 3rem;

			a {
				color: white;
				text-decoration: none;
			}
		}
	}
</style>

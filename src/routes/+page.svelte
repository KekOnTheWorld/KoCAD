<svelte:head>
	<title>KoCAD</title>
</svelte:head>

<main>
	<h1>KekCAD</h1>
	<p>The only CAD Program you will ever need!</p>
	<div class="links">
		<a href="new">New Sketch</a>
		<a href="load">Load Sketch</a>
	</div>
</main>

<style lang="postcss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	.links {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 5px;
	}

	.links a {
		padding: 5px 10px;
		background-color: #111;
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>

<script lang="ts">
    import { Sketch } from "$lib/sketch";

	import { browser } from '$app/environment';

	import { goto } from '$app/navigation';

    let sketch: Sketch;

	function loadSketch() {
		const sketchText = localStorage.getItem('sketch');
		if (!sketchText) goto('/new');

        sketch = Sketch.fromText(sketchText);

        console.log(sketch);
	}

	if (browser) loadSketch();
</script>

<main />

<style lang="postcss">
</style>

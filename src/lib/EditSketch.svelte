<script lang="ts">
	import type { Sketch } from "./cad/sketch";

    export let sketch: Sketch;

    let svgRect = false;
    setInterval(() => svgRect = !svgRect, 1000);
</script>

<main>
    <svg>
        {#if svgRect}
            <rect width="20" height="20" fill="purple"/>
        {/if}
    </svg>
</main>

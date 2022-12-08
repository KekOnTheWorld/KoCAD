<script lang="ts">
	import {browser} from "$app/environment";

	import {goto} from "$app/navigation";


    function loadSketch() {
        const sketch = localStorage.getItem("sketch");
        if(!sketch) goto("/new");
        
        const xmlDoc = new DOMParser().parseFromString(sketch as string, "text/xml");

       console.log(xmlDoc);
    }

    if(browser) loadSketch();
</script>

<main>

</main>

<style lang="postcss">

</style>

<script lang="ts">
	import {goto} from "$app/navigation";


    let input: HTMLInputElement; 

    function loadFile(file: File) {
        // TODO: load file
        const reader = new FileReader();

        reader.onload = function(e) {
            const result = e.target?.result;
            if(result) loadText(result.toString());
        };

        reader.readAsText(file, "utf-8");
    }

    function loadText(text: string) { 
        localStorage.setItem("sketch", text);
        goto("edit");
    }
</script>

<svelte:window on:click={() => input.click()}></svelte:window>


<main on:dragend={e => e.dataTransfer?.files && loadFile(e.dataTransfer?.files[0])}>
    <label for="file">Click me, or drag files here to load</label>
    <input type="file" 
        id="file" 
        style="display: none"
        bind:this={input} 
        on:change={() => input.files && loadFile(input.files[0])}>    
</main>

<style lang="postcss">
    main {
        display: flex;
        flex-direction: column;
        padding: 20px;
        row-gap: 10px;
    }

    label {
        cursor: pointer;
    }
</style>

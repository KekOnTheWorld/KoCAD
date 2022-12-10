<script lang="ts">
	import { DEFAULT_PROJECT, Project } from "$lib/cad/project";
	import { StackBuf } from "$lib/cad/stack";

	import { browser } from "$app/environment";

	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import EditSketch from "$lib/EditSketch.svelte";

    let project: Project = DEFAULT_PROJECT; 

	function loadProject() {
		const projectText = localStorage.getItem("project");
        
        if (projectText === null)  {
            goto("/new");
            return;
        }

        project = Project.fromB64(projectText);
	}

	if (browser) loadProject();

    $: sketch = project.sketches.find(
        s => s.id.toString() === $page.url.searchParams.get("sketch")
    );

    $: if(project !== DEFAULT_PROJECT)
        localStorage.setItem("project", Project.toB64(project));
</script>

<main>
    <nav>
        <input id="title" placeholder="Project Title" bind:value={project.title}/>
    </nav>
    {#if sketch}
        <h1>Editing sketch</h1>
        <EditSketch bind:sketch/>
    {/if}
</main>


<style lang="postcss">
</style>

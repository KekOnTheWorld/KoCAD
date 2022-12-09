<script lang="ts">
    import { Project } from "$lib/cad/project";
	import { StackBuf } from "$lib/cad/stack";

	import { browser } from '$app/environment';

	import { goto } from '$app/navigation';

    let project: Project;

	function loadSketch() {
		const projectText = localStorage.getItem('project');
		if (!projectText) goto('/new');

        project = Project.load(StackBuf.fromString(projectText as string));

        console.log(project);
	}

	if (browser) loadSketch();
</script>

<main />

<style lang="postcss">
</style>

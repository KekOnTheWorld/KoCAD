<script lang="ts">
	import { browser } from "$app/environment";

	import { goto } from "$app/navigation";

	import { Project } from "$lib/cad/project";

	if (browser) {
        const project = new Project();

        localStorage.setItem("project", Project.toB64(project));

		goto("edit");
	}
</script>

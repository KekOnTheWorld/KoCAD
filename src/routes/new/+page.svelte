<script lang="ts">
	import { browser } from "$app/environment";

	import { goto } from "$app/navigation";

	import { Project, PROJECT_BUF_SIZE } from "$lib/cad/project";
	import { StackBuf } from "$lib/cad/stack";

	if (browser) {
		const project = new Project();
		const buf = new StackBuf(PROJECT_BUF_SIZE);
		project.dump(buf);

		localStorage.setItem("project", buf.toString());

		goto("edit");
	}
</script>

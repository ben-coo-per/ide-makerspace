<script lang="ts">
	const { data } = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{JSON.stringify(data)}

{#if data?.items?.length}
	<ul>
		{#each data.items as item}
			<li>{item.name}</li>
		{/each}
	</ul>
{:else}
	<p>No items found.</p>
{/if}

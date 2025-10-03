<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen">
	<nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="mx-auto max-w-5xl px-4">
			<div class="flex h-14 items-center gap-4">
				<a href="/" class="text-lg font-bold">IDE MakerSpace</a>
				<div class="flex gap-6 text-sm">
					<a
						href="/"
						class="transition-colors hover:text-foreground/80"
						class:text-foreground={$page.url.pathname === '/'}
					>
						Wants
					</a>
					<a
						href="/needs"
						class="transition-colors hover:text-foreground/80"
						class:text-foreground={$page.url.pathname === '/needs'}
					>
						Needs
					</a>
				</div>
			</div>
		</div>
	</nav>
	<main>
		{@render children?.()}
	</main>
</div>

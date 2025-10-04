<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	// OG image and metadata
	const siteName = 'IDE MakerSpace';
	const siteDescription =
		'Feeding the Makerspace - Submit and vote on items we want, or view a curated list what the makerspace needs';
	const ogImageUrl = '/og-image.png'; // This will be served from the static folder
</script>

<svelte:head>
	<!-- Favicon -->
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

	<!-- Primary Meta Tags -->
	<title>{siteName}</title>
	<meta name="title" content={siteName} />
	<meta name="description" content={siteDescription} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<meta property="og:title" content={siteName} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content="{$page.url.origin}{ogImageUrl}" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="IDE MakerSpace - Feeding the Makerspace" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.origin} />
	<meta property="twitter:title" content={siteName} />
	<meta property="twitter:description" content={siteDescription} />
	<meta property="twitter:image" content="{$page.url.origin}{ogImageUrl}" />

	<!-- WhatsApp specific (uses OG tags) -->
	<meta property="og:site_name" content={siteName} />
</svelte:head>

<div class="min-h-screen">
	<nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="mx-auto max-w-5xl px-4">
			<div class="flex h-14 items-center justify-between">
				<a href="/" class="text-lg font-bold">IDE MakerSpace</a>
				<div class="flex gap-8 text-sm">
					<a
						href="/wants"
						class="transition-colors hover:text-foreground/80"
						class:text-foreground={$page.url.pathname === '/wants'}
						class:text-slate-500={$page.url.pathname !== '/wants'}
					>
						Wants
					</a>
					<a
						href="/needs"
						class="transition-colors hover:text-foreground/80"
						class:text-foreground={$page.url.pathname === '/needs'}
						class:text-slate-500={$page.url.pathname !== '/needs'}
					>
						Needs
					</a>
				</div>
			</div>
		</div>
	</nav>
	<main class="min-h-[calc(100vh-3.5rem)]">
		{@render children?.()}
	</main>
	<footer
		class="border-t bg-background/95 p-4 text-center text-sm text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="mx-auto max-w-3xl">
			<p>
				Made by the IDE Makerspace team. View the source code on
				<a
					href="https://github.com/ben-coo-per/ide-makerspace"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
			</p>
		</div>
		<img
			src="/monster.png"
			alt="IDE MakerSpace Logo"
			class="right-0 bottom-0 float-right -mr-4 h-48 sm:absolute sm:mr-0"
		/>
	</footer>
</div>

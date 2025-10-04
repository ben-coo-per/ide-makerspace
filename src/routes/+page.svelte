<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
</script>

<div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
	<div class="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
		<a href="/wants" class="group">
			<Card
				class="transition-all duration-200 group-hover:border-primary hover:scale-101 hover:shadow-lg"
			>
				<CardHeader class="space-y-4 p-8 text-center">
					<div class="text-6xl">💡</div>
					<CardTitle class="text-2xl font-bold">I want something added to the maker space</CardTitle
					>
					<CardDescription class="text-base">
						Submit and vote on ideas for new tools and supplies
					</CardDescription>
				</CardHeader>
			</Card>
		</a>
		<a href="/needs" class="group">
			<Card
				class="transition-all duration-200 group-hover:border-primary hover:scale-101 hover:shadow-lg"
			>
				<CardHeader class="space-y-4 p-8 text-center">
					<div class="text-6xl">🤑</div>
					<CardTitle class="text-2xl font-bold">I have project budget I need to spend</CardTitle>
					<CardDescription class="text-base">
						View the current list of items we need for the makerspace
					</CardDescription>
				</CardHeader>
			</Card>
		</a>
	</div>
</div>

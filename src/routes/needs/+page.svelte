<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const { data } = $props();

	type Need = Record<string, string>;

	// needs returned from the API; headers are normalized to lowercase
	const needs: Need[] = data?.needs ?? [];

	// Map priority to badge variant
	function getPriorityVariant(priority: string): 'default' | 'secondary' | 'destructive' {
		const p = priority?.toLowerCase();
		if (p === 'high') return 'destructive';
		if (p === 'medium') return 'default';
		return 'secondary';
	}

	// Format priority text
	function formatPriority(priority: string): string {
		if (!priority) return 'Low';
		return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
	}
</script>

<div class="mx-auto max-w-3xl space-y-4 p-4">
	<div class="flex flex-col items-start">
		<h1 class="text-4xl font-bold">Needs</h1>
		<p class="text-lg text-muted-foreground">
			Current supplies and materials needed for the makerspace.
		</p>
		<p class="text-sm text-muted-foreground">
			IF YOU HAVE EXTRA PROJECT BUDGET, PLEASE HELP US OUT BY PURCHASING SOME OF THESE ITEMS!
		</p>
	</div>

	{#if needs.length}
		<div class="space-y-3">
			{#each needs as need}
				<Card class="transition-shadow hover:shadow-lg">
					<CardHeader>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<CardTitle class="text-xl font-bold">{need.title ?? 'Untitled'}</CardTitle>
								{#if need.quantity_needed}
									<CardDescription class="mt-1">
										Quantity needed: {need.quantity_needed}
									</CardDescription>
								{/if}
							</div>
							{#if need.priority}
								<Badge variant={getPriorityVariant(need.priority)}>
									{formatPriority(need.priority)}
								</Badge>
							{/if}
						</div>
					</CardHeader>
				</Card>
			{/each}
		</div>
	{:else}
		<p class="text-muted-foreground">No needs found.</p>
	{/if}
</div>

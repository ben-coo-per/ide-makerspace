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

	// Map priority to badge variant and custom color classes
	function getPriorityStyles(priority: string): {
		variant: 'default' | 'secondary' | 'destructive' | 'outline';
		class: string;
	} {
		const p = priority?.trim();

		switch (p) {
			case '0':
				return { variant: 'destructive', class: 'bg-red-500 hover:bg-red-600' };
			case '1':
				return { variant: 'default', class: 'bg-orange-500 hover:bg-orange-600 text-white' };
			case '2':
				return { variant: 'default', class: 'bg-yellow-500 hover:bg-yellow-600 text-black' };
			case '3':
				return { variant: 'default', class: 'bg-lime-500 hover:bg-lime-600 text-black' };
			case '4':
				return { variant: 'default', class: 'bg-green-500 hover:bg-green-600 text-white' };
			default:
				return { variant: 'secondary', class: '' };
		}
	}

	// Format priority text with better descriptions
	function formatPriority(priority: string): string {
		const p = priority?.trim();

		switch (p) {
			case '0':
				return 'Critical';
			case '1':
				return 'Urgent';
			case '2':
				return 'Important';
			case '3':
				return 'Helpful';
			case '4':
				return 'Nice to Have';
			default:
				return 'Unknown';
		}
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
								{@const styles = getPriorityStyles(need.priority)}
								<Badge variant={styles.variant} class={styles.class}>
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

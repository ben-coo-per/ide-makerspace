<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardAction
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { upvoteItem, type SheetItem } from '$lib/api/sheets';

	const { data } = $props();

	// items returned from the API; headers are normalized to lowercase
	// sorted by votes (descending)
	let items = $state<SheetItem[]>(
		(data?.items ?? []).sort((a, b) => {
			const votesA = parseInt(a.votes ?? '0', 10);
			const votesB = parseInt(b.votes ?? '0', 10);
			return votesB - votesA; // descending order
		})
	);

	async function handleUpvote(item: SheetItem) {
		const currentVotes = item.votes ?? '0';
		const idx = items.findIndex((i) => i.id === item.id);

		// optimistic update
		if (idx !== -1) {
			const newVotes = parseInt(currentVotes, 10) + 1;
			items[idx].votes = String(newVotes);

			// re-sort after updating votes
			items = items.sort((a, b) => {
				const votesA = parseInt(a.votes ?? '0', 10);
				const votesB = parseInt(b.votes ?? '0', 10);
				return votesB - votesA;
			});
		}

		try {
			await upvoteItem(item);
		} catch (err) {
			// rollback on error
			if (idx !== -1) {
				items[idx].votes = currentVotes;
				// re-sort after rollback
				items = items.sort((a, b) => {
					const votesA = parseInt(a.votes ?? '0', 10);
					const votesB = parseInt(b.votes ?? '0', 10);
					return votesB - votesA;
				});
			}
			console.error('Failed to upvote:', err);
		}
	}
</script>

<div class="mx-auto max-w-3xl space-y-4 p-4">
	<h1 class="text-2xl font-bold">Wants</h1>

	{#if items.length}
		<div class="space-y-3">
			{#each items as item}
				<Card class="max-w-lg transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="text-xl font-bold">{item.title ?? 'Untitled'}</CardTitle>
						<CardDescription>{item.description ?? item.desc ?? item.details ?? ''}</CardDescription>
						<CardAction>
							<Button
								size="lg"
								variant="outline"
								class="px-3 text-xl"
								onclick={() => handleUpvote(item)}
							>
								<span class="text-3xl">☝︎</span>{item.votes} votes
							</Button>
						</CardAction>
					</CardHeader>
				</Card>
			{/each}
		</div>
	{:else}
		<p>No items found.</p>
	{/if}
</div>

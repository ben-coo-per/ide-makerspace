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
	import { browser } from '$app/environment';

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

	// Load voted items from localStorage
	let votedItemIds = $state<Set<string>>(new Set());

	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('please_dont_be_a_jerk');
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					votedItemIds = new Set(Array.isArray(parsed) ? parsed : []);
				} catch (err) {
					console.error('Failed to parse voted items:', err);
					votedItemIds = new Set();
				}
			}
		}
	});

	function hasVoted(itemId: string): boolean {
		return votedItemIds.has(itemId);
	}

	function markAsVoted(itemId: string) {
		votedItemIds.add(itemId);
		// Trigger reactivity by reassigning the Set
		votedItemIds = new Set(votedItemIds);
		if (browser) {
			localStorage.setItem('please_dont_be_a_jerk', JSON.stringify([...votedItemIds]));
		}
	}

	async function handleUpvote(item: SheetItem) {
		// prevent voting twice
		if (hasVoted(item.id)) {
			return;
		}

		const currentVotes = item.votes ?? '0';
		const idx = items.findIndex((i) => i.id === item.id);
		const newVotes = parseInt(currentVotes, 10) + 1;

		// mark as voted immediately
		markAsVoted(item.id);

		// optimistic update
		if (idx !== -1) {
			items[idx].votes = String(newVotes);

			// re-sort after updating votes
			items = items.sort((a, b) => {
				const votesA = parseInt(a.votes ?? '0', 10);
				const votesB = parseInt(b.votes ?? '0', 10);
				return votesB - votesA;
			});
		}

		try {
			await upvoteItem(item.id, newVotes);
		} catch (err) {
			// rollback on error - remove from voted list and restore vote count
			votedItemIds.delete(item.id);
			// Trigger reactivity by reassigning the Set
			votedItemIds = new Set(votedItemIds);
			if (browser) {
				localStorage.setItem('please_dont_be_a_jerk', JSON.stringify([...votedItemIds]));
			}
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
								disabled={hasVoted(item.id)}
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

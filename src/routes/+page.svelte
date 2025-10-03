<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardAction,
		CardContent
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { upvoteItem, createItem, type SheetItem } from '$lib/api/sheets';
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

	// Form state
	let showForm = $state(false);
	let formTitle = $state('');
	let formDescription = $state('');
	let formType = $state<'tool' | 'consumable' | undefined>();
	let formRequestedBy = $state('');
	let isSubmitting = $state(false);

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

	async function handleSubmit() {
		if (!formTitle.trim()) {
			return;
		}

		isSubmitting = true;

		try {
			// Create new item with initial votes of 0
			// Match the sheet columns: id, title, description, votes, created_at, type, requested_by
			const newItem: SheetItem = {
				id: crypto.randomUUID(),
				title: formTitle.trim(),
				description: formDescription.trim(),
				votes: '0',
				created_at: new Date().toISOString(),
				type: formType ?? '',
				requested_by: formRequestedBy.trim()
			};

			await createItem(newItem);

			// Add to local list and re-sort
			items = [...items, newItem].sort((a, b) => {
				const votesA = parseInt(a.votes ?? '0', 10);
				const votesB = parseInt(b.votes ?? '0', 10);
				return votesB - votesA;
			});

			// Reset form
			formTitle = '';
			formDescription = '';
			formType = 'tool';
			formRequestedBy = '';
			showForm = false;
		} catch (err) {
			console.error('Failed to create item:', err);
			alert('Failed to submit. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	const types = [
		{ value: 'tool', label: 'Tool' },
		{ value: 'consumable', label: 'Consumable' }
	];
	const selectTrigger = $derived(types.find((f) => f.value === formType)?.label ?? 'Select a type');
</script>

<div class="mx-auto max-w-3xl space-y-4 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">I Want Something</h1>
	</div>

	{#if showForm}
		<Card>
			<CardHeader>
				<CardTitle>Submit a New Want</CardTitle>
				<CardDescription>Share something you'd like to see at the makerspace</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="space-y-4"
				>
					<div class="space-y-2">
						<Label for="title">Title</Label>
						<Input
							id="title"
							bind:value={formTitle}
							placeholder="e.g., 3D Printer, Laser Cutter, Workshop"
							required
							disabled={isSubmitting}
						/>
					</div>
					<div class="space-y-2">
						<Label for="description">Description (optional)</Label>
						<Textarea
							id="description"
							bind:value={formDescription}
							placeholder="Add more details about your want..."
							disabled={isSubmitting}
							rows={3}
						/>
					</div>
					<div class="space-y-2">
						<Label for="type">Type</Label>
						<Select.Root type="single" disabled={isSubmitting} bind:value={formType}>
							<Select.Trigger id="type">
								{selectTrigger}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="tool">Tool</Select.Item>
								<Select.Item value="consumable">Consumable</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label for="requested_by">Requested By</Label>
						<Input
							id="requested_by"
							bind:value={formRequestedBy}
							placeholder="Your name"
							disabled={isSubmitting}
						/>
					</div>
					<div class="flex gap-2">
						<Button type="submit" disabled={isSubmitting || !formTitle.trim()}>
							{isSubmitting ? 'Submitting...' : 'Submit'}
						</Button>
						<Button type="button" variant="outline" onclick={() => (showForm = false)}>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	{/if}

	{#if !showForm}
		<Button class="w-full" size="lg" onclick={() => (showForm = !showForm)}>Add Something</Button>
	{/if}
	{#if items.length}
		<div class="space-y-3">
			{#each items as item}
				<Card class="transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="text-xl font-bold">{item.title ?? 'Untitled'}</CardTitle>
						<CardDescription>{item.description ?? ''}</CardDescription>
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

/**
 * Client-side API utilities for interacting with the sheets endpoint
 */

export type SheetItem = Record<string, string>;

/**
 * Fetch all items from the sheets API
 */
export async function fetchItems(): Promise<SheetItem[]> {
	const response = await fetch('/api/sheets');
	if (!response.ok) {
		throw new Error(`Failed to fetch items: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetch a single item by ID
 */
export async function fetchItem(id: string): Promise<SheetItem> {
	const response = await fetch(`/api/sheets?id=${encodeURIComponent(id)}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch item: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Update an item in the sheet (partial update)
 */
export async function updateItem(id: string, updates: Partial<SheetItem>): Promise<void> {
	const response = await fetch('/api/sheets', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id, ...updates })
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update item: ${errorText}`);
	}
}

/**
 * Increment the votes for an item
 * Returns the new vote count
 */
export async function upvoteItem(item: SheetItem): Promise<number> {
	const currentVotes = parseInt(item.votes ?? '0', 10);
	const newVotes = currentVotes + 1;

	await updateItem(item.id, { votes: String(newVotes) });

	return newVotes;
}

/**
 * Create a new item
 */
export async function createItem(item: SheetItem): Promise<SheetItem> {
	const response = await fetch('/api/sheets', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(item)
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to create item: ${errorText}`);
	}

	return response.json();
}

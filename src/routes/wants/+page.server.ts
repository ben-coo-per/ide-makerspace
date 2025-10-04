export async function load(event) {
	const response = await event.fetch('/api/wants');
	if (!response.ok) {
		throw new Error('Failed to fetch items');
	}
	const data = await response.json();
	if (!Array.isArray(data)) {
		throw new Error('Invalid data format');
	}
	return {
		items: data ?? []
	};
}

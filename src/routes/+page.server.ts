export async function load(event) {
	const response = await event.fetch('/api/sheets');
	if (!response.ok) {
		throw new Error('Failed to fetch items');
	}
	const data = await response.json();
	console.log('Fetched data:', data);
	if (!Array.isArray(data)) {
		throw new Error('Invalid data format');
	}
	return {
		items: data ?? []
	};
}

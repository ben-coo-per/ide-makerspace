export async function load(event) {
	const response = await event.fetch('/api/needs');
	if (!response.ok) {
		throw new Error('Failed to fetch needs');
	}
	const data = await response.json();
	console.log('Fetched needs:', data);
	if (!Array.isArray(data)) {
		throw new Error('Invalid data format');
	}
	return {
		needs: data ?? []
	};
}

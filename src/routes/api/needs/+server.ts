// src/routes/api/needs/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { sheets } from '$lib/server/sheets';

const SPREADSHEET_ID = '1x81hhR-Fdw7UBg3zQq4VBbODPUk5rFghpKNhV1ZfjPU';
const SHEET_NAME = 'NEEDS';
const HEADER_RANGE = `${SHEET_NAME}!1:1`;
const DATA_RANGE = `${SHEET_NAME}!A2:Z`; // generous range to cover all columns

// pull headers + rows into an array of { header1: val1, ... }
async function fetchAll(): Promise<Record<string, string>[]> {
	// 1) headers (normalize: trim + lowercase so consumers can rely on predictable keys)
	const headerRes = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: HEADER_RANGE
	});
	const rawHeaders = headerRes.data.values?.[0] ?? [];
	const headers: string[] = rawHeaders.map((h) =>
		String(h ?? '')
			.trim()
			.toLowerCase()
	);

	// 2) data
	const dataRes = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: DATA_RANGE
	});
	const rows = dataRes.data.values ?? [];

	return rows.map((row) =>
		headers.reduce(
			(obj, h, i) => {
				obj[h] = row[i] ?? '';
				return obj;
			},
			{} as Record<string, string>
		)
	);
}

export const GET: RequestHandler = async () => {
	const all = await fetchAll();

	// Sort by priority (0 = highest, 4 = lowest)
	const sorted = all.sort((a, b) => {
		const priorityA = parseInt(a.priority?.trim()) || 999;
		const priorityB = parseInt(b.priority?.trim()) || 999;
		return priorityA - priorityB;
	});

	return json(sorted);
};

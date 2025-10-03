// src/routes/api/sheets/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { sheets } from '$lib/server/sheets';

const SPREADSHEET_ID = '1x81hhR-Fdw7UBg3zQq4VBbODPUk5rFghpKNhV1ZfjPU';
const SHEET_NAME = 'WANTS';
const HEADER_RANGE = `${SHEET_NAME}!1:1`;
const DATA_RANGE = `${SHEET_NAME}!A2:F`;

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

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	let all = await fetchAll();

	// if no id, return all records
	if (id) {
		const record = all.find((r) => r.id === id);
		if (!record) return json({ error: 'Not found' }, { status: 404 });
		return json(record);
	}

	// helper to find common date field names and return a Date or Invalid Date
	const extractDate = (r: Record<string, string>) => {
		const dateCandidates = [r.datetime, r.date, r['date/time'], r['date time'], r['datetime']];
		const dateStr = dateCandidates.find((d) => d && String(d).trim() !== '') ?? '';
		return new Date(dateStr);
	};

	all = all.sort((a, b) => {
		const dateA = extractDate(a);
		const dateB = extractDate(b);
		const ta = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
		const tb = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();
		return ta - tb;
	});

	return json(all);
};

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.json();
	const headers = Object.keys(payload);
	const values = headers.map((h) => payload[h] ?? '');

	await sheets.spreadsheets.values.append({
		spreadsheetId: SPREADSHEET_ID,
		range: SHEET_NAME,
		valueInputOption: 'RAW',
		insertDataOption: 'INSERT_ROWS',
		requestBody: { values: [values] }
	});

	return json(payload, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const payload = await request.json();
	if (!payload.id) return json({ error: 'Missing id in payload' }, { status: 400 });

	const all = await fetchAll();
	const idx = all.findIndex((r) => r.id === payload.id);
	if (idx === -1) return json({ error: 'Not found' }, { status: 404 });

	// re-fetch headers to compute exact range and normalize them to match fetchAll()
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

	// build updated row using normalized header keys (payload keys should be normalized too)
	const normalizedPayload: Record<string, unknown> = {};
	Object.keys(payload).forEach((k) => {
		normalizedPayload[String(k).trim().toLowerCase()] = payload[k];
	});

	const updatedRow = headers.map((h) => normalizedPayload[h] ?? all[idx][h] ?? '');
	const sheetRow = idx + 2; // +2: because headers are row 1

	const lastCol = String.fromCharCode(65 + headers.length - 1); // e.g. 'C'
	const updateRange = `${SHEET_NAME}!A${sheetRow}:${lastCol}${sheetRow}`;

	await sheets.spreadsheets.values.update({
		spreadsheetId: SPREADSHEET_ID,
		range: updateRange,
		valueInputOption: 'RAW',
		requestBody: { values: [updatedRow] }
	});

	return json({ status: 'updated', row: payload });
};

import { http, HttpResponse } from 'msw';
import {
    CHARACTER_LIST, ITEM_AWARDED_LIST, ITEM_LIST, PLAYER_LIST, PREFERRED_PIXEL_LIST,
    RAID_ATTENDANCE_APPROVAL_LIST, RAID_ATTENDANCE_LIST, RAID_LIST, ZONE_LIST,
} from './mockData.js';

// This handles an absolute VITE_BASE_URL, '/api', and Vitest's undefined base URL.
const apiRoute = path => `*${path}`;
const MOCK_ACCESS_TOKEN = 'eyJhbGciOiJub25lIn0.eyJpc19zdXBlcnVzZXIiOmZhbHNlfQ.';
const collectionResponse = (results, request) => {
    if (new URL(request.url).searchParams.get('pagination') === 'none') return results;
    return { count: results.length, next: null, previous: null, results };
};
const byId = (collection, id) => collection.find(record => record.id === Number(id));
const filtered = (collection, request, fields = {}) => {
    const url = new URL(request.url);
    return collection.filter(record => Object.entries(fields).every(([param, getter]) => {
        const value = url.searchParams.get(param);
        return value === null || String(getter(record)).toLowerCase().includes(value.toLowerCase());
    }));
};
const detailHandler = collection => ({ params }) => {
    const record = byId(collection, params.id);
    return record ? HttpResponse.json(record) : new HttpResponse(null, { status: 404 });
};
const created = async ({ request }, collection) => {
    const record = { id: Math.max(0, ...collection.map(item => item.id)) + 1, ...(await request.json()) };
    collection.push(record);
    return HttpResponse.json(record, { status: 201 });
};
const update = async ({ params, request }, collection) => {
    const record = byId(collection, params.id);
    if (!record) return new HttpResponse(null, { status: 404 });
    Object.assign(record, await request.json());
    return HttpResponse.json(record);
};
const remove = ({ params }, collection) => {
    const index = collection.findIndex(record => record.id === Number(params.id));
    if (index < 0) return new HttpResponse(null, { status: 404 });
    collection.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
};

export const handlers = [
    http.get(apiRoute('/players/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(PLAYER_LIST, request, { name: player => player.name, active: player => player.active }), request))),
    http.get(apiRoute('/players/:id/'), detailHandler(PLAYER_LIST)),
    http.patch(apiRoute('/players/:id/'), request => update(request, PLAYER_LIST)),
    http.get(apiRoute('/characters/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(CHARACTER_LIST, request, { player: character => character.player.id, 'player__active': character => character.player.active }), request))),
    http.post(apiRoute('/characters/'), request => created(request, CHARACTER_LIST)),
    http.patch(apiRoute('/characters/batch/'), async ({ request }) => HttpResponse.json({ message: 'Success: updated characters batch.', updated: await request.json() })),
    http.patch(apiRoute('/characters/:id/'), request => update(request, CHARACTER_LIST)),
    http.get(apiRoute('/items/get_options/'), () => HttpResponse.json(ITEM_LIST)),
    http.get(apiRoute('/items/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(ITEM_LIST, request, { name: item => item.name }), request))),
    http.get(apiRoute('/items/:id/'), detailHandler(ITEM_LIST)),
    http.get(apiRoute('/zones/'), () => HttpResponse.json(paginated(ZONE_LIST))),
    http.get(apiRoute('/raids/'), () => HttpResponse.json(paginated(RAID_LIST))),
    http.get(apiRoute('/raids/:id/'), detailHandler(RAID_LIST)),
    http.get(apiRoute('/items_awarded/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(ITEM_AWARDED_LIST, request, { player: award => award.player.id, raid: award => award.raid.id, 'item__id': award => award.item.id }), request))),
    http.post(apiRoute('/items_awarded/'), request => created(request, ITEM_AWARDED_LIST)),
    http.patch(apiRoute('/items_awarded/:id/'), request => update(request, ITEM_AWARDED_LIST)),
    http.delete(apiRoute('/items_awarded/:id/'), request => remove(request, ITEM_AWARDED_LIST)),
    http.get(apiRoute('/raid_attendance/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(RAID_ATTENDANCE_LIST, request, { player: attendance => attendance.player.id, raid: attendance => attendance.raid.id }), request))),
    http.post(apiRoute('/raid_attendance/'), request => created(request, RAID_ATTENDANCE_LIST)),
    http.delete(apiRoute('/raid_attendance/:id/'), request => remove(request, RAID_ATTENDANCE_LIST)),
    http.get(apiRoute('/raid_attendance_approval/'), ({ request }) => HttpResponse.json(collectionResponse(filtered(RAID_ATTENDANCE_APPROVAL_LIST, request, { is_approved: approval => approval.is_approved }), request))),
    http.get(apiRoute('/raid_attendance_approval/:id/'), detailHandler(RAID_ATTENDANCE_APPROVAL_LIST)),
    http.post(apiRoute('/raid_attendance_approval/:id/approve/'), () => HttpResponse.json({ message: 'Success: added raid and attendees.' })),
    http.delete(apiRoute('/raid_attendance_approval/:id/'), request => remove(request, RAID_ATTENDANCE_APPROVAL_LIST)),
    http.get(apiRoute('/preferred_pixels/'), () => HttpResponse.json(paginated(PREFERRED_PIXEL_LIST))),
    http.post(apiRoute('/token/'), () => HttpResponse.json({ access: MOCK_ACCESS_TOKEN, refresh: 'mock-refresh-token' })),
    http.post(apiRoute('/token/refresh/'), () => HttpResponse.json({ access: MOCK_ACCESS_TOKEN })),
    http.post(apiRoute('/api/sql/query/'), () => HttpResponse.json({ results: [] })),
];

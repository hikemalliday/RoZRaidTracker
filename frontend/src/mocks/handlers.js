import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../config.js';
import {
    PLAYER_LIST,
    ITEM_LIST,
    RAID_LIST,
    ITEM_AWARDED_LIST,
    RAID_ATTENDANCE_LIST,
} from './mockData.js';

export const handlers = [
    // Players
    http.get(BASE_URL + '/players/', () => {
        return HttpResponse.json({
            count: PLAYER_LIST.length,
            next: null,
            previous: null,
            results: PLAYER_LIST,
        });
    }),

    http.get(BASE_URL + '/players/:id/', ({ params }) => {
        const { id } = params;
        const player = PLAYER_LIST.find(p => p.id === Number(id));
        if (!player) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(player);
    }),

    // Items
    http.get(BASE_URL + '/items/', ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        let results = ITEM_LIST;

        if (name) {
            results = ITEM_LIST.filter(item =>
                item.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        return HttpResponse.json({
            count: results.length,
            next: null,
            previous: null,
            results,
        });
    }),

    http.get(BASE_URL + '/items/:id/', ({ params }) => {
        const { id } = params;
        const item = ITEM_LIST.find(i => i.id === Number(id));
        if (!item) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(item);
    }),

    // Raids
    http.get(BASE_URL + '/raids/', () => {
        return HttpResponse.json({
            count: RAID_LIST.length,
            next: null,
            previous: null,
            results: RAID_LIST,
        });
    }),

    http.get(BASE_URL + '/raids/:id/', ({ params }) => {
        const { id } = params;
        const raid = RAID_LIST.find(r => r.id === Number(id));
        if (!raid) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(raid);
    }),

    // Items Awarded
    http.get(BASE_URL + '/items_awarded/', ({ request }) => {
        const url = new URL(request.url);
        const player = url.searchParams.get('player');
        const raid = url.searchParams.get('raid');
        let results = ITEM_AWARDED_LIST;

        if (player) {
            results = results.filter(item => item.player.id === Number(player));
        }
        if (raid) {
            results = results.filter(item => item.raid.id === Number(raid));
        }

        return HttpResponse.json({
            count: results.length,
            next: null,
            previous: null,
            results,
        });
    }),

    http.get(BASE_URL + '/items_awarded/:id/', ({ params }) => {
        const { id } = params;
        const itemAwarded = ITEM_AWARDED_LIST.find(ia => ia.id === Number(id));
        if (!itemAwarded) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(itemAwarded);
    }),

    // Raid Attendance (both endpoints for compatibility)
    http.get(BASE_URL + '/raid_attendances/', ({ request }) => {
        const url = new URL(request.url);
        const raid = url.searchParams.get('raid');
        let results = RAID_ATTENDANCE_LIST;

        if (raid) {
            results = results.filter(ra => ra.raid.id === Number(raid));
        }

        return HttpResponse.json({
            count: results.length,
            next: null,
            previous: null,
            results,
        });
    }),

    http.get(BASE_URL + '/raid_attendance/', ({ request }) => {
        const url = new URL(request.url);
        const raid = url.searchParams.get('raid');
        let results = RAID_ATTENDANCE_LIST;

        if (raid) {
            results = results.filter(ra => ra.raid.id === Number(raid));
        }

        return HttpResponse.json({
            count: results.length,
            next: null,
            previous: null,
            results,
        });
    }),

    http.get(BASE_URL + '/raid_attendances/:id/', ({ params }) => {
        const { id } = params;
        const raidAttendance = RAID_ATTENDANCE_LIST.find(ra => ra.id === Number(id));
        if (!raidAttendance) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(raidAttendance);
    }),
];

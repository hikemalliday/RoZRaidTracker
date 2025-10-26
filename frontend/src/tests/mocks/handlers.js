import {http, HttpResponse} from "msw";
import {BACKEND_BASE_URL_DEV} from "../../config.js";
import {ITEM_AWARDED_LIST, PLAYER_LIST, RAID_ATTENDANCE_LIST, RAID_LIST} from "./mockData.js";

export const handlers = [
    http.get(BACKEND_BASE_URL_DEV + "/players/", () => {
        return HttpResponse.json(
            PLAYER_LIST,
        )
    }),
    http.get(BACKEND_BASE_URL_DEV + "/raids/", () => {
        return HttpResponse.json(
            RAID_LIST,
        )
    }),
    http.get(BACKEND_BASE_URL_DEV + "/raid_attendances/", () => {
        return HttpResponse.json(
            RAID_ATTENDANCE_LIST,
        )
    }),
    http.get(BACKEND_BASE_URL_DEV + "/item_awardeds/", () => {
        return HttpResponse.json(
            ITEM_AWARDED_LIST,
        )
    }),
]
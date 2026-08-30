// Fixtures deliberately mirror the fields returned by the Django REST API.
// Keep these small and readable; individual tests can import and override them.
export const PLAYER_1_ID = 1;
export const PLAYER_2_ID = 2;
export const PLAYER_3_ID = 3;
export const RAID_1_ID = 101;
export const RAID_2_ID = 102;
export const ITEM_1_ID = 201;
export const ITEM_2_ID = 202;
export const ITEM_3_ID = 203;

export const ZONE_LIST = [
    { id: 1, name: 'Temple of Veeshan', zone_id: 113 },
    { id: 2, name: 'Kael Drakkel', zone_id: 113 },
];

const createdAt = '01-15-25';

export const PLAYER_LIST = [
    { id: PLAYER_1_ID, name: 'Grixus', discord_id: 'discord-grixus', active: true, lifetime_ra: 85.5, ra_21_day: 100, created_at: createdAt, updated_at: createdAt, characters: [] },
    { id: PLAYER_2_ID, name: 'Sharknado', discord_id: 'discord-sharknado', active: true, lifetime_ra: 75.2, ra_21_day: 66.67, created_at: createdAt, updated_at: createdAt, characters: [] },
    { id: PLAYER_3_ID, name: 'Tune', discord_id: 'discord-tune', active: false, lifetime_ra: 50, ra_21_day: 33.33, created_at: createdAt, updated_at: createdAt, characters: [] },
];

const playerReference = player => ({
    id: player.id,
    name: player.name,
    discord_id: player.discord_id,
    active: player.active,
    created_at: player.created_at,
    updated_at: player.updated_at,
});

export const CHARACTER_LIST = [
    { id: 11, name: 'Grixus', char_class: 'WAR', type: 'MAIN', is_main: true, is_main_alt: false, player: playerReference(PLAYER_LIST[0]), created_at: createdAt, updated_at: createdAt },
    { id: 12, name: 'Grixalt', char_class: 'SHD', type: 'MAIN_ALT', is_main: false, is_main_alt: true, player: playerReference(PLAYER_LIST[0]), created_at: createdAt, updated_at: createdAt },
    { id: 21, name: 'Sharknado', char_class: 'CLR', type: 'MAIN', is_main: true, is_main_alt: false, player: playerReference(PLAYER_LIST[1]), created_at: createdAt, updated_at: createdAt },
    { id: 31, name: 'Tune', char_class: 'BRD', type: 'MAIN', is_main: true, is_main_alt: false, player: playerReference(PLAYER_LIST[2]), created_at: createdAt, updated_at: createdAt },
];

PLAYER_LIST.forEach(player => {
    player.characters = CHARACTER_LIST.filter(character => character.player.id === player.id);
});

export const ITEM_LIST = [
    { id: ITEM_1_ID, name: 'Sword of Testing', eq_item_id: 1001, icon_id: 1000, item_score: 90, slots: 8192 },
    { id: ITEM_2_ID, name: 'Shield of Quality', eq_item_id: 1002, icon_id: 1001, item_score: 80, slots: 4096 },
    { id: ITEM_3_ID, name: 'Helm of Victory', eq_item_id: 1003, icon_id: 1002, item_score: 70, slots: 4 },
];

export const RAID_LIST = [
    { id: RAID_1_ID, name: 'Temple of Veeshan', zone: ZONE_LIST[0], created_at: createdAt, updated_at: createdAt },
    { id: RAID_2_ID, name: 'Kael Drakkel', zone: ZONE_LIST[1], created_at: '01-20-25', updated_at: '01-20-25' },
];

export const ITEM_AWARDED_LIST = [
    { id: 301, item: ITEM_LIST[0], player: PLAYER_LIST[0], raid: RAID_LIST[0], type: 'main_magelo', alt_loot: false, preferred: false, magelo: true, created_at: createdAt, updated_at: createdAt },
    { id: 302, item: ITEM_LIST[1], player: PLAYER_LIST[1], raid: RAID_LIST[0], type: 'alt', alt_loot: true, preferred: false, magelo: false, created_at: createdAt, updated_at: createdAt },
    { id: 303, item: ITEM_LIST[2], player: PLAYER_LIST[2], raid: RAID_LIST[1], type: 'preferred', alt_loot: false, preferred: true, magelo: false, created_at: '01-20-25', updated_at: '01-20-25' },
];

export const RAID_ATTENDANCE_LIST = [
    { id: 401, raid: RAID_LIST[0], player: PLAYER_LIST[0], created_at: createdAt, updated_at: createdAt },
    { id: 402, raid: RAID_LIST[0], player: PLAYER_LIST[1], created_at: createdAt, updated_at: createdAt },
    { id: 403, raid: RAID_LIST[1], player: PLAYER_LIST[2], created_at: '01-20-25', updated_at: '01-20-25' },
];

export const RAID_ATTENDANCE_APPROVAL_LIST = [
    { id: 501, raid_name: 'Pending ToV raid', players_list: [['Grixus', 'discord-grixus'], ['Sharknado', 'discord-sharknado']], is_approved: false, created_at: createdAt, updated_at: createdAt },
    { id: 502, raid_name: 'Approved Kael raid', players_list: [['Tune', 'discord-tune']], is_approved: true, created_at: '01-20-25', updated_at: '01-20-25' },
];

export const PREFERRED_PIXEL_LIST = [{ id: 601, player: PLAYER_1_ID, item: ITEM_1_ID }];

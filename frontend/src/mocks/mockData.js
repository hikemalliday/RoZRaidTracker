// Player IDs
export const PLAYER_1_ID = 1;
export const PLAYER_2_ID = 2;
export const PLAYER_3_ID = 3;

// Mock Players
export const PLAYER_LIST = [
    {
        id: PLAYER_1_ID,
        name: 'TestPlayer1',
        lifetime_ra: 85.5,
        created_at: '2025-01-01T00:00:00.000000Z',
        updated_at: '2025-01-01T00:00:00.000000Z',
        characters: [
            {
                char_class: 'WAR',
                created_at: '2025-01-01T00:00:00.000000Z',
                id: 1,
                is_main: true,
                is_main_alt: false,
                name: 'TestWarrior',
                player: {
                    id: PLAYER_1_ID,
                    name: 'TestPlayer1',
                    created_at: '2025-01-01T00:00:00.000000Z',
                    updated_at: '2025-01-01T00:00:00.000000Z',
                },
            },
        ],
    },
    {
        id: PLAYER_2_ID,
        name: 'TestPlayer2',
        lifetime_ra: 75.2,
        created_at: '2025-01-01T00:00:00.000000Z',
        updated_at: '2025-01-01T00:00:00.000000Z',
        characters: [
            {
                char_class: 'CLR',
                created_at: '2025-01-01T00:00:00.000000Z',
                id: 2,
                is_main: true,
                is_main_alt: false,
                name: 'TestCleric',
                player: {
                    id: PLAYER_2_ID,
                    name: 'TestPlayer2',
                    created_at: '2025-01-01T00:00:00.000000Z',
                    updated_at: '2025-01-01T00:00:00.000000Z',
                },
            },
        ],
    },
    {
        id: PLAYER_3_ID,
        name: 'TestPlayer3',
        lifetime_ra: 92.8,
        created_at: '2025-01-01T00:00:00.000000Z',
        updated_at: '2025-01-01T00:00:00.000000Z',
        characters: [
            {
                char_class: 'WIZ',
                created_at: '2025-01-01T00:00:00.000000Z',
                id: 3,
                is_main: true,
                is_main_alt: false,
                name: 'TestWizard',
                player: {
                    id: PLAYER_3_ID,
                    name: 'TestPlayer3',
                    created_at: '2025-01-01T00:00:00.000000Z',
                    updated_at: '2025-01-01T00:00:00.000000Z',
                },
            },
        ],
    },
];

// Mock Items
export const ITEM_1_ID = 1;
export const ITEM_2_ID = 2;
export const ITEM_3_ID = 3;

export const ITEM_LIST = [
    {
        id: ITEM_1_ID,
        name: 'Sword of Testing',
        icon_id: 1000,
    },
    {
        id: ITEM_2_ID,
        name: 'Shield of Quality',
        icon_id: 1001,
    },
    {
        id: ITEM_3_ID,
        name: 'Helm of Victory',
        icon_id: 1002,
    },
];

// Mock Raids
export const RAID_1_ID = 1;
export const RAID_2_ID = 2;

export const RAID_LIST = [
    {
        id: RAID_1_ID,
        name: 'Test Raid 1',
        created_at: '2025-01-15',
        updated_at: '2025-01-15T00:00:00.000000Z',
    },
    {
        id: RAID_2_ID,
        name: 'Test Raid 2',
        created_at: '2025-01-20',
        updated_at: '2025-01-20T00:00:00.000000Z',
    },
];

// Mock Items Awarded
export const ITEM_AWARDED_LIST = [
    {
        id: 1,
        raid: {
            id: RAID_1_ID,
            name: 'Test Raid 1',
            created_at: '2025-01-15',
        },
        player: {
            id: PLAYER_1_ID,
            name: 'TestPlayer1',
        },
        item: {
            id: ITEM_1_ID,
            name: 'Sword of Testing',
            icon_id: 1000,
        },
        alt_loot: false,
        preferred: false,
        magelo: true,
        created_at: '2025-01-15T00:00:00.000000Z',
    },
    {
        id: 2,
        raid: {
            id: RAID_1_ID,
            name: 'Test Raid 1',
            created_at: '2025-01-15',
        },
        player: {
            id: PLAYER_2_ID,
            name: 'TestPlayer2',
        },
        item: {
            id: ITEM_2_ID,
            name: 'Shield of Quality',
            icon_id: 1001,
        },
        alt_loot: true,
        preferred: false,
        magelo: false,
        created_at: '2025-01-15T00:00:00.000000Z',
    },
    {
        id: 3,
        raid: {
            id: RAID_2_ID,
            name: 'Test Raid 2',
            created_at: '2025-01-20',
        },
        player: {
            id: PLAYER_3_ID,
            name: 'TestPlayer3',
        },
        item: {
            id: ITEM_3_ID,
            name: 'Helm of Victory',
            icon_id: 1002,
        },
        alt_loot: false,
        preferred: true,
        magelo: false,
        created_at: '2025-01-20T00:00:00.000000Z',
    },
];

// Mock Raid Attendance
export const RAID_ATTENDANCE_LIST = [
    {
        id: 1,
        raid: {
            id: RAID_1_ID,
            name: 'Test Raid 1',
            created_at: '2025-01-15',
        },
        player: {
            id: PLAYER_1_ID,
            name: 'TestPlayer1',
        },
        created_at: '2025-01-15T00:00:00.000000Z',
    },
    {
        id: 2,
        raid: {
            id: RAID_1_ID,
            name: 'Test Raid 1',
            created_at: '2025-01-15',
        },
        player: {
            id: PLAYER_2_ID,
            name: 'TestPlayer2',
        },
        created_at: '2025-01-15T00:00:00.000000Z',
    },
    {
        id: 3,
        raid: {
            id: RAID_2_ID,
            name: 'Test Raid 2',
            created_at: '2025-01-20',
        },
        player: {
            id: PLAYER_3_ID,
            name: 'TestPlayer3',
        },
        created_at: '2025-01-20T00:00:00.000000Z',
    },
];

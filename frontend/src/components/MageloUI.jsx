import '../magelo.css';
import { useItemsAwardedList } from '../hooks/requests.js';
import ammo from '../../public/magelo_icons/ammo.png';
import arms from '../../public/magelo_icons/arms.png';
import back from '../../public/magelo_icons/back.png';
import chest from '../../public/magelo_icons/chest.png';
import ear from '../../public/magelo_icons/ear.png';
import face from '../../public/magelo_icons/face.png';
import feet from '../../public/magelo_icons/feet.png';
import finger from '../../public/magelo_icons/finger.png';
import hands from '../../public/magelo_icons/hands.png';
import head from '../../public/magelo_icons/head.png';
import legs from '../../public/magelo_icons/legs.png';
import neck from '../../public/magelo_icons/neck.png';
import primary from '../../public/magelo_icons/primary.png';
import range from '../../public/magelo_icons/range.png';
import secondary from '../../public/magelo_icons/secondary.png';
import shoulders from '../../public/magelo_icons/shoulders.png';
import waist from '../../public/magelo_icons/waist.png';
import wrist from '../../public/magelo_icons/wrist.png';
import { ItemToolTip } from './ItemToolTip.jsx';

export function MageloUI({ main = false }) {
    // tune: 3
    // vapo: 62
    // shakirra: 21
    // skeeter: 191
    const { data: itemAwardedData } = useItemsAwardedList({ player: 3 });

    const bitMap = [
        { bits: 2097152, slot: 'Ammo', gridLocations: [32], background: ammo },
        { bits: 1048576, slot: 'Waist', gridLocations: [13], background: waist },
        { bits: 524288, slot: 'Feet', gridLocations: [24], background: feet },
        { bits: 262144, slot: 'Legs', gridLocations: [21], background: legs },
        { bits: 131072, slot: 'Chest', gridLocations: [5], background: chest },
        { bits: 98304, slot: 'Fingers', gridLocations: [26, 27], background: finger },
        { bits: 16384, slot: 'Secondary', gridLocations: [30], background: secondary },
        { bits: 8192, slot: 'Primary', gridLocations: [29], background: primary },
        { bits: 4096, slot: 'Hands', gridLocations: [22], background: hands },
        { bits: 2048, slot: 'Range', gridLocations: [31], background: range },
        { bits: 1536, slot: 'Wrists', gridLocations: [17, 20], background: wrist },
        { bits: 256, slot: 'Back', gridLocations: [12], background: back },
        { bits: 128, slot: 'Arms', gridLocations: [9], background: arms },
        { bits: 64, slot: 'Shoulders', gridLocations: [16], background: shoulders },
        { bits: 32, slot: 'Neck', gridLocations: [8], background: neck },
        { bits: 18, slot: 'Ears', gridLocations: [1, 4], background: ear },
        { bits: 8, slot: 'Face', gridLocations: [3], background: face },
        { bits: 4, slot: 'Head', gridLocations: [2], background: head },
        { bits: 1, slot: 'Charm', gridLocations: [], background: null },
    ];

    const _getMainMageloItems = results => {
        if (!results) return [];
        return results.filter(item => !item.alt_loot && item.magelo);
    };

    const _getAltMageloItems = results => {
        if (!results) return [];
        return results.filter(item => item.alt_loot && item.magelo);
    };

    const _getBaseBits = mask => {
        return bitMap.filter(s => mask & s.bits).map(s => s.bits);
    };

    const _getGridLocations = bits => {
        const results = [];
        for (const bit of bits) {
            const found = bitMap.find(element => element.bits === Number(bit));
            const locations = found?.gridLocations;
            for (const location of locations) {
                results.push(location);
            }
        }
        return results;
    };

    const _getMappedItems = results => {
        return results.map(itemAwarded => {
            const item = itemAwarded.item;
            const slotBits = item.slots;
            const slotArray = _getBaseBits(slotBits);
            const gridLocations = _getGridLocations(slotArray);
            return {
                name: item.name,
                slots: slotArray,
                gridLocations: gridLocations,
                eq_item_id: item.eq_item_id,
                icon_id: item.icon_id,
            };
        });
    };

    const _getFinalResults = mappedItems => {
        const resultsObj = Object.fromEntries(Array.from({ length: 32 }, (_, i) => [i + 1, null]));
        const singleSlotItems = mappedItems.filter(item => item.gridLocations.length === 1);
        const multiSlotItems = mappedItems.filter(item => item.gridLocations.length > 1);

        for (const item of singleSlotItems) {
            const gridLoc = item.gridLocations[0];
            resultsObj[gridLoc] = item;
        }

        for (const item of multiSlotItems) {
            const gridLocations = item.gridLocations;
            for (const gridLoc of gridLocations) {
                if (!resultsObj[gridLoc]) {
                    resultsObj[gridLoc] = item;
                    break;
                }
            }
        }
        return resultsObj;
    };
    // We need to map quest items to the actual item
    const _filterItems = items => {
        const eqItemIdMap = {
            // Soul Essence of Aten Ha Ra
            8365: {
                item:
                    // Talisman of Vah Kerrath
                    {
                        eq_item_id: 8364,
                        icon_id: 752,
                        id: 6247, // ID in our own system
                        item_score: 0,
                        name: 'Talisman of Vah Kerrath',
                        slots: 32, // Neck
                    },
            },
            // Head of the Inquisitor
            7810: {
                item:
                    // Sigil Earring of Veracity
                    {
                        eq_item_id: 29861,
                        icon_id: 514,
                        id: 24523, // ID in our own system
                        item_score: 0,
                        name: 'Sigil Earring of Veracity',
                        slots: 18, // Ears
                    },
            },
        };

        return items.map(item => {
            return eqItemIdMap[item.item.eq_item_id] || item;
        });
    };

    const _getGrid = resultsObj => {
        return Object.entries(resultsObj).map(([slot, item], i) => {
            const stylesObj = {};
            const found = bitMap.find(element => {
                const found = element.gridLocations.find(loc => loc == slot);
                if (found) return found;
            });

            const bg = found?.background;
            if (bg) {
                stylesObj.backgroundImage = `url(${bg})`;
                stylesObj.backgroundSize = 'contain';
                stylesObj.backgroundRepeat = 'no-repeat';
                stylesObj.backgroundPosition = 'center';
            }
            if (item === null) {
                if (!bg) stylesObj.background = 'black';
                return <div key={i} className="slot" style={stylesObj}></div>;
            } else {
                return (
                    <div key={i} className="slot" style={stylesObj}>
                        <ItemToolTip item={item} isCell={false} />
                    </div>
                );
            }
        });
    };

    const getMainOrAlt = main ? _getMainMageloItems : _getAltMageloItems;

    const itemDataCopy = { ...itemAwardedData };
    const mainMageloItems = getMainOrAlt(itemDataCopy?.results);
    const filteredMageloItems = _filterItems(mainMageloItems);
    const mappedItems = _getMappedItems(filteredMageloItems);
    const results = _getFinalResults(mappedItems);

    return <div className="wrapper">{_getGrid(results)}</div>;
}

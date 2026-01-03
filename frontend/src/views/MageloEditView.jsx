// // TODO: 1/3/26: File was never used, don't delete yet.
//
// import { useEffect, useState } from 'react';
// import { useList } from '../hooks/requests.js';
// import { useParams } from 'react-router';
//
// export function MageloEditView() {
//     const { id } = useParams();
//     const [ear1, setEar1] = useState(null);
//     const [ear2, setEar2] = useState(null);
//     const [face, setFace] = useState(null);
//     const [head, setHead] = useState(null);
//     const [chest, setChest] = useState(null);
//     const [neck, setNeck] = useState(null);
//     const [arms, setArms] = useState(null);
//     const [back, setBack] = useState(null);
//     const [waist, setWaist2] = useState(null);
//     const [shoulder, setShoulders] = useState(null);
//     const [wrist1, setWrist1] = useState(null);
//     const [wrist2, setWrist2] = useState(null);
//     const [legs, setLegs] = useState(null);
//     const [hands, setHands] = useState(null);
//     const [feet, setFeet] = useState(null);
//     const [fingers1, setFingers1] = useState(null);
//     const [fingers2, setFingers2] = useState(null);
//     const [primary, setPrimary] = useState(null);
//     const [secondary, setSecondary] = useState(null);
//     const [ranged, setRanged] = useState(null);
//     const [ammo, setAmmo] = useState(null);
//     const [inventory1, setInventory1] = useState(null);
//     const [inventory2, setInventory2] = useState(null);
//     const [inventory3, setInventory3] = useState(null);
//     const [inventory4, setInventory4] = useState(null);
//     const [inventory5, setInventory5] = useState(null);
//     const [inventory6, setInventory6] = useState(null);
//     const [inventory7, setInventory7] = useState(null);
//     const [inventory8, setInventory8] = useState(null);
//     const { data, isPending, error } = useList('magelo_items', '/magelo_items/', { player: id });
//
//     useEffect(() => {
//         console.log(data);
//     }, [data]);
//
//     if (isPending) return <>LOADING...</>;
//
//     return (
//         <div>
//             <div>ear1: {ear1}</div>
//             <div>ear2: {ear2}</div>
//             <div>face: {face}</div>
//             <div>head: {head}</div>
//             <div>neck: {neck}</div>
//             <div>chest: {chest}</div>
//             <div>arms: {arms}</div>
//             <div>shoulder: {shoulder}</div>
//             <div>back: {back}</div>
//             <div>wrist1: {wrist1}</div>
//             <div>wrist2: {wrist2}</div>
//             <div>waist: {waist}</div>
//             <div>legs: {legs}</div>
//             <div>hands: {hands}</div>
//             <div>feet: {feet}</div>
//             <div>fingers1: {fingers1}</div>
//             <div>fingers2: {fingers2}</div>
//             <div>primary: {primary}</div>
//             <div>secondary: {secondary}</div>
//             <div>ranged: {ranged}</div>
//             <div>ammo: {ammo}</div>
//             <div>inventory1: {inventory1}</div>
//             <div>inventory2: {inventory2}</div>
//             <div>inventory3: {inventory3}</div>
//             <div>inventory4: {inventory4}</div>
//             <div>inventory5: {inventory5}</div>
//             <div>inventory6: {inventory6}</div>
//             <div>inventory7: {inventory7}</div>
//             <div>inventory8: {inventory8}</div>
//         </div>
//     );
// }

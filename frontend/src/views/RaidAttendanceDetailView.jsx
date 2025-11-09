// import { DetailView } from './generic/DetailView.jsx';
// import { useParams } from 'react-router';
// import { useRaidAttendance } from '../hooks/requests.js';
//
// // TODO: DEPRECATED. Not sure we ever need to add this again
// export function RaidAttendanceDetailView() {
//     const { id } = useParams();
//     const { isPending, data, error } = useRaidAttendance(id);
//
//     if (isPending) return <>LOADING...</>;
//     if (error) return <>{error.message}</>;
//
//     return <DetailView data={data} accessor="name" />;
// }

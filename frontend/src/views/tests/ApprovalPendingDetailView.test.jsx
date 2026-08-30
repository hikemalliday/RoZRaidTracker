import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderRouteWithContext } from '../../testUtils.jsx';
import { ApprovalPendingDetailView } from '../ApprovalPendingDetailView.jsx';
import { RAID_ATTENDANCE_APPROVAL_LIST } from '../../tests/mocks/mockData.js';

const approval = RAID_ATTENDANCE_APPROVAL_LIST.find(record => !record.is_approved);

const renderApprovalDetail = () => renderRouteWithContext(true, {
    route: [`/ra_approval_pending/${approval.id}`],
    path: '/ra_approval_pending/:id',
    element: <ApprovalPendingDetailView />,
});

describe('ApprovalPendingDetailView', () => {
    test('renders a loading state while approval data is requested', () => {
        renderApprovalDetail();

        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders pending raid details and selected attendees', async () => {
        renderApprovalDetail();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());
        await waitFor(() => expect(screen.getByLabelText('Raid Name')).toHaveValue(approval.raid_name));

        expect(screen.getByText('Created At').parentElement).toHaveTextContent(approval.created_at);
        expect(screen.getByText('Attendees').parentElement).toHaveTextContent(String(approval.players_list.length));
        approval.players_list.forEach(([name]) => {
            expect(screen.getByText(name)).toBeInTheDocument();
        });
        expect(screen.getAllByRole('checkbox')).toHaveLength(approval.players_list.length);
    });

    test('renders approval controls for superusers', async () => {
        renderApprovalDetail();

        await waitFor(() => expect(screen.getByLabelText('Raid Name')).toHaveValue(approval.raid_name));

        expect(screen.getByRole('combobox', { name: 'Player' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ADD PLAYER' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'APPROVE' })).toBeEnabled();
    });
});

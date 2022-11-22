import React from 'react';

import { mapToEventCard } from './event-card';
import { mapToInvitationCard } from './invitation-card';

export default function mapTo(mapper, obj) {
    switch(mapper) {
        case 'eventCard':
            return mapToEventCard(obj);
        case 'invitationCard':
            return mapToInvitationCard(obj);
        default:
            return <></>
    }
}
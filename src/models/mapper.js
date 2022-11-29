import React from 'react';

import { mapToEventCard } from './event-card';
import { mapToInvitationCard } from './invitation-card';
import { mapToGroupCard } from './group-card';

export default function mapTo(mapper, obj) {
    switch(mapper) {
        case 'eventCard':
            return mapToEventCard(obj);
        case 'invitationCard':
            return mapToInvitationCard(obj);
        case 'groupCard':
            return mapToGroupCard(obj);
        default:
            return <></>
    }
}
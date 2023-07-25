import { MapToEventCard } from './EventCard';
import { MapToInvitationCard } from './InvitationCard';
import { MapToGroupCard } from './GroupCard';

export function MapTo({mapper, obj}) {
    switch(mapper) {
        case 'eventCard':
            return <MapToEventCard event={obj} />;
        case 'invitationCard':
            return <MapToInvitationCard invitation={obj} />;
        case 'groupCard':
            return <MapToGroupCard group={obj} />;
        default:
            return null;
    }
}
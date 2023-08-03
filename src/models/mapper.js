import { MapToEventCard } from './EventCard';
import { MapToInvitationCard } from './InvitationCard';
import { MapToGroupCard } from './GroupCard';

export function MapTo({mapper, obj}) {
    switch(mapper) {
        case 'event':
            return <MapToEventCard event={obj} />;
        case 'invitation':
            return <MapToInvitationCard invitation={obj} />;
        case 'group':
            return <MapToGroupCard group={obj} />;
        default:
            return null;
    }
}
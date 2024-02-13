import { EventCard } from './EventCard';
import { InvitationCard } from './InvitationCard';
import { GroupCard } from './GroupCard';

export function MapTo({mapper, obj}) {
    switch(mapper) {
        case 'event':
            return <EventCard event={obj} />;
        case 'invitation':
            return <InvitationCard invitation={obj} />;
        case 'group':
            return <GroupCard group={obj} />;
        default:
            return null;
    }
}
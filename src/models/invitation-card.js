import React from 'react';
import { Text } from 'react-native';

import moment from 'moment';

export const mapToInvitationCard = (invitation) => {
    const happensEvery = () => {
        switch(invitation.eRepeat) {
            case 0:
                return DaysOfWeek[invitation.DayOfWeek];
            case 1:
                return `${DaysOfMonth[invitation.DayOfMonth]} of the month`;
            case 2:
                return `${DaysOfMonth[invitation.DayOfMonth]} of ${MonthsOfYear[invitation.MonthOfYear]}`
            default:
                return 'Does not repeat.';
        }
    }
    
    return (
        <>
            <Text>{invitation.eRepeat === 3 ? 'When' : 'Starts On'}: {moment(invitation.firstEventDate).format('MM/DD/YY h:mm a')}</Text>
            {invitation.eRepeat !== 3 && <Text>
                Happens Every: {happensEvery()}
            </Text>
            }
        </>
    )
}
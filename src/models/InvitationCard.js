import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import moment from 'moment-timezone';

import { styles } from '../styles/main-styles';
import InvitationResponse from '../components/InvitationResponse';

import { DaysOfWeek, DaysOfMonth, MonthsOfYear } from '../enums/enums';

export const InvitationCard = ({invitation}) => {
    const happensEvery = () => {
        switch(invitation.repeat) {
            case 'weekly':
                return DaysOfWeek[invitation.dayOfWeek];
            case 'monthly':
                return `${DaysOfMonth[invitation.dayOfMonth]} of the month`;
            case 'annually':
                return `${DaysOfMonth[invitation.dayOfMonth]} of ${MonthsOfYear[invitation.monthOfYear]}`
            default:
                return 'Does not repeat.';
        }
    }
    
    return (
        <>
            <Text>{invitation.repeat === 'never' ? 'When' : 'Starts On'}: {moment(invitation.firstEventDate).format('MM/DD/YY h:mm a')}</Text>
            {invitation.repeat !== 'never' && <Text>
                Every: {happensEvery()}
            </Text>
            }
            <View style={{...styles.container, ...styles.horizontalFlex}}>
                <InvitationResponse
                    status={'attending'}
                    component={<Icon source='check' color='green'/>}
                    id={invitation.eventRepeatId}
                />
                <InvitationResponse
                    status={'maybe'}
                    component={<Icon source='help' color='blue'/>}
                    id={invitation.eventRepeatId}
                />
                <InvitationResponse
                    status={'declined'}
                    component={<Icon source='close' color='red'/>}
                    id={invitation.eventRepeatId}
                />
            </View>
        </>
    )
}
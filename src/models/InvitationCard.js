import { Text, View } from 'react-native';
// import { FiCheck, FiX } from 'react-icons/fi';
// import { RiQuestionMark } from 'react-icons/ri';

import moment from 'moment-timezone';

import { styles } from '../styles/main-styles';
import InvitationResponse from '../components/InvitationResponse';

import { DaysOfWeek, DaysOfMonth, MonthsOfYear } from '../enums/enums';

export const MapToInvitationCard = ({invitation}) => {
    const happensEvery = () => {
        switch(`${invitation.eRepeat}`) {
            case '0':
                return DaysOfWeek[invitation.dayOfWeek];
            case '1':
                return `${DaysOfMonth[invitation.dayOfMonth]} of the month`;
            case '2':
                return `${DaysOfMonth[invitation.dayOfMonth]} of ${MonthsOfYear[invitation.monthOfYear]}`
            default:
                return 'Does not repeat.';
        }
    }
    
    return (
        <>
            <Text>{invitation.eRepeat === 3 ? 'When' : 'Starts On'}: {moment(invitation.firstEventDate).format('MM/DD/YY h:mm a')}</Text>
            {invitation.eRepeat !== 3 && <Text>
                Every: {happensEvery()}
            </Text>
            }
            <View style={{...styles.container, ...styles.horizontalFlex}}>
                {/* <InvitationResponse status={1} component={<FiCheck color='green'/>} id={invitation.eventRepeatId}/>
                <InvitationResponse status={3} component={<RiQuestionMark color='blue'/>} id={invitation.eventRepeatId}/>
                <InvitationResponse status={2} component={<FiX color='red'/>} id={invitation.eventRepeatId}/> */}
            </View>
        </>
    )
}
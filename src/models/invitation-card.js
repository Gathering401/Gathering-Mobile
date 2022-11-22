import React from 'react';
import { Text, View } from 'react-native';
import { FiCheck, FiX } from 'react-icons/fi';
import { BsQuestionLg } from 'react-icons/bs';

import moment from 'moment';

import { styles } from '../styles/main-styles';
import InvitationResponse from '../components/InvitationResponse';

import { DaysOfWeek, DaysOfMonth, MonthsOfYear } from '../enums/enums';

export const mapToInvitationCard = (invitation) => {
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
                <InvitationResponse status='y' component={<FiCheck color='green'/>}/>
                <InvitationResponse status='m' component={<BsQuestionLg color='blue'/>}/>
                <InvitationResponse status='n' component={<FiX color='red'/>}/>
            </View>
        </>
    )
}
import React from 'react';

import { Modal } from 'react-native';
import { styles } from '../styles/main-styles';

import GroupTierCard from './GroupTierCard';

export default function GroupTierSelector(props) {
    return (
        <Modal style={styles.container}>
            <GroupTierCard
                title="Free"
                memberSize="50"
                eventSize="100"
                price={0}
                tier={0}
                {...props}
            />
            <GroupTierCard
                title="Business"
                memberSize="500"
                eventSize="2500"
                price={50}
                tier={1}
                {...props}
            />
            <GroupTierCard
                title="Enterprise"
                memberSize="infinite"
                eventSize="infinite"
                price={500}
                tier={2}
                {...props}
            />
        </Modal>
    )
}
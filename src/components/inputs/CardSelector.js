import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Modal } from 'react-native-web';

import Label from '../Label';

import { styles } from '../../styles/main-styles';

export default function CardSelector({ label, cards, selectedCard, setSelectedCard }) {
    let [open, setOpen] = useState(false);

    const handleSelection = (selected) => {
        setSelectedCard(selected);
        setOpen(false);
    }
    
    return (
        <View>
            <Label text={label} />
            {
                open ?
                <Modal style={styles.cardSelector}>
                    {
                        cards.map(c => (
                            <Card onPress={() => handleSelection(c)} style={styles.tierCard}>
                                <Card.Title style={styles.tierCardTitle}>{c.title}</Card.Title>
                                {
                                    c.body.map(text => (
                                        <Text style={styles.tierCardBodyText}>{text}</Text>
                                    ))
                                }
                                <Text style={styles.tierCardFooterText}>{c.footer}</Text>
                            </Card>
                        ))
                    }
                </Modal>
                :
                <TouchableOpacity style={styles.modalButton} onPress={() => setOpen(true)}>
                    <Text style={styles.modalButtonText}>
                        {selectedCard ? selectedCard.title : 'What size group?'}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}
import axios from 'axios';

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Card } from '@rneui/base';
import { SlMagnifier } from 'react-icons/sl';

import { UserContext } from '../tempContext/user-context';

import NavBar from '../components/NavBar';
import CreateButton from '../components/CreateButton';

import { styles } from '../styles/main-styles';

const baseUrl = 'http://localhost:5000/api';

export default function Groups({ navigation }) {
    const { token } = useContext(UserContext);
    
    let [search, setSearch] = useState('');
    let [groups, setGroups] = useState([]);
    let [searchForNew, setSearchForNew] = useState(false);
    let [groupCreated, setGroupCreated] = useState(false);

    const getGroups = async () => {
        const response = await axios({
            method: 'GET',
            url: `${baseUrl}/Group`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        if(response?.data) {
            setGroups(response.data);
        }
    }

    useEffect(() => {
        const filterGroups = async () => {
            if(search) {
                setGroups([...groups.filter(g => g.groupName.toLowerCase().startsWith(search.toLowerCase()))]);
            } else {
                getGroups();
            }
        }
        
        filterGroups();
    }, [search, groupCreated]);

    const getNewSearchGroups = async () => {
        if(search) {
            const response = await axios({
                method: 'GET',
                url: `${baseUrl}/Group/Search/${search}`,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            if(response?.data) {
                setGroups(response.data);
            }
        } else {
            getGroups();
        }
    }
    
    return (
        <View style={styles.container}>
            <CreateButton type="group" setCreated={setGroupCreated}/>
            <SlMagnifier />
            <TextInput
                style={styles.textInput}
                autoComplete={false}
                autoCorrect={false}
                placeholder="Search"
                onChangeText={text => setSearch(text)}
            />
            <ScrollView>
                {
                    groups.length ?
                    groups.map(group => (
                        <Card containerStyle={styles.bigCard} key={group.groupId}>
                            <View style={styles.cardTitleWrapper}>
                                <Card.Title style={styles.cardTitle}>{group.groupName}</Card.Title>
                            </View>
                            <Text>{group.description}</Text>
                            {searchForNew &&
                                <View>
                                    <Text>{group.location}</Text>
                                    {/* <Text>{group.owner.firstName} {group.owner.lastName}</Text> ====need to update endpoint to give an owner==== */}
                                </View>
                            }
                        </Card>
                    )) :
                    <Text style={styles.cardTitle}>No groups to show</Text>
                }
                <Button onPress={() => {
                    setSearchForNew(true);
                    getNewSearchGroups();
                }} title="Find New" />
            </ScrollView>
            <NavBar navigation={navigation} />
        </View>
    )
}
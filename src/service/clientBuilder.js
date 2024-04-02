import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

import { REACT_APP_API_URL } from '@env';

export function buildClient() {
    const authLink = setContext(async (_, { headers }) => {
        const token = await SecureStore.getItemAsync('token');

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        }
    });

    console.log('obligatory console log');
    //
    //
    //
    //
    //
    const httpLink = createHttpLink({
        uri: `${REACT_APP_API_URL}/graphql`
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({
            typePolicies: {
                Group: {
                    keyFields: ['groupName']
                },
                Event: {
                    keyFields: ['eventId']
                },
                Invitation: {
                    keyFields: ['eventId']
                }
            }
        })
    });
}
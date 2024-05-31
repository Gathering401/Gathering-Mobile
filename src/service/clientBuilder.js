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

    console.log('does it work', REACT_APP_API_URL);
    const httpLink = createHttpLink({
        uri: `${REACT_APP_API_URL}/graphql`
    });
    console.log('does it work 2', httpLink)

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({
            typePolicies: {
                Group: {
                    keyFields: ['groupId']
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
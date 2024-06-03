import { gql, useQuery } from '@apollo/client';
import { AUTHENTICATE_QUERY } from '../models/Queries';

export function authenticateUser(token) {
    const { data } = useQuery(AUTHENTICATE_QUERY, {
        variables: {
            token
        },
        onError: (error) => {
            console.log('Error: ', JSON.stringify(error, null, 2));
        }
    });

    return data?.authenticate;
}
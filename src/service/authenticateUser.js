import { useQuery } from '@apollo/client';
import { AUTHENTICATE_QUERY } from '../models/Queries';
import { logError } from '../components/helpers/logError';

export function authenticateUser(token) {
    const { data } = useQuery(AUTHENTICATE_QUERY, {
        variables: {
            token
        },
        onError: (error) => {
            logError(error);
        }
    });

    return data?.authenticate;
}
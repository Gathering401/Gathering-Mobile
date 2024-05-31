import { gql, useQuery } from '@apollo/client';

export function authenticateUser(token) {
    const { data } = useQuery(gql`query Authenticate($token: String!) {
        authenticate(token: $token)
    }`, {
        variables: {
            token
        },
        onError: (error) => {
            console.log('Error: ', JSON.stringify(error, null, 2));
        }
    });

    return data?.authenticate;
}
import { createContext } from 'react';

export const UserContext = createContext({
    token: '',
    setToken: () => {},
    preferences: {},
    setPreferences: () => {}
});

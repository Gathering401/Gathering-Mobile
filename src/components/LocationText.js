import { useState } from 'react';
import { Text } from 'react-native';

export default function LocationText({ location }) {
    // this will need to be made much more verbose. Plan in the future is to look at current user's location, compare to the location being passed in, and base the formatting on that comparison (i.e. more specific if it's a closer region, less specific if far)
    // if it's a proper establishment, likely will just return the name of the establishment instead
    
    console.log(location);
    let [formattedLocation, setFormattedLocation] = useState(`${location.city}, ${location.state}`);
    
    return (
        <Text>{formattedLocation}</Text>
    )
}
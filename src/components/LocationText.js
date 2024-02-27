import { Text, TouchableOpacity, Platform, Linking } from 'react-native';

export default function LocationText({ location, clickable }) {
    console.log('actually getting in here', location)
    // this will need to be made much more verbose. Plan in the future is to look at current user's location, compare to the location being passed in, and base the formatting on that comparison (i.e. more specific if it's a closer region, less specific if far)
    // if it's a proper establishment, likely will just return the name of the establishment instead
    
    return (
        <TouchableOpacity
            disabled={!clickable}
            onPress={() => {
                const scheme = Platform.select({ ios: 'maps://0,0?addr=', android: 'geo:0,0?addr=' });
                const latLng = `${location.lat},${location.lng}`;
                let label = '';
                if(location.poi || location.park || location.airport) {
                    label = location.poi ?? location.park ?? location.airport;
                }
                const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`
                });

                Linking.openURL(url);
            }
        }>
            <Text>{location}</Text>
        </TouchableOpacity>
    )
}
export const formatLocation = (location, options = {}) => {
    let locationArray = [];
    if(options.streetAddress) {
        const streetAddress = location.streetAddress ?? location.route;
        if(streetAddress) {
            locationArray.push(`${location.streetNumber} ${streetAddress}`);
        } else {
            throw 'Location undefined';
        }
    }
    if(options.cityState) {
        locationArray.push(`${location.city}, ${location.state}`);
    } else if(options.city) {
        locationArray.push(location.city);
    } else if(options.state) {
        locationArray.push(location.state);
    }
    if(options.zip) {
        locationArray.push(location.zip)
    }
    return locationArray.join(' ');
}
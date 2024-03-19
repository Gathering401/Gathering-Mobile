export const formatLocation = (location, options = {}) => {
    let locationArray = [];
    let missingArray = [];
    const response = {};
    if(options.streetAddress) {
        const streetAddress = location.streetAddress ?? location.route;
        if(streetAddress) {
            locationArray.push(`${location.streetNumber} ${streetAddress}`);
        } else {
            missingArray.push('street address');
        }
    }
    const city = location.city ?? location.political;
    if(options.cityState) {
        locationArray.push(`${city}, ${location.state}`);
        if(!city) {
            missingArray.push('city');
        }
        if(!location.state) {
            missingArray.push('state');
        }
    } else if(options.city) {
        locationArray.push(city);
        if(!city) {
            missingArray.push('city');
        }
    } else if(options.state) {
        locationArray.push(location.state);
        if(!location.state) {
            missingArray.push('state');
        }
    }
    if(options.zip) {
        locationArray.push(location.zip)
        if(!location.zip) {
            missingArray.push('zip code');
        }
    }
    if(missingArray.length) {
        response.errors = missingArray.join(', ');
    }
    response.formattedLocation = locationArray.join(' ');
    return response;
}
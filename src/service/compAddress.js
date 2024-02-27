export const compAddress = (addressComponents) => {
    const components = {};

    for(const comp of addressComponents) {
        switch(comp.types[0]) {
            case 'street_address':
                components.streetAddress = comp.long_name;
                break;
            case 'street_number':
                components.streetNumber = comp.long_name;
                break;
            case 'route':
                components.route = comp.long_name;
                break;
            case 'intersection':
                components.intersection = comp.long_name;
                break;
            case 'political':
                components.political = comp.long_name;
                break;
            case 'country':
                components.country = comp.long_name;
                break;
            case 'administrative_area_level_1':
                components.state = comp.short_name;
                break;
            case 'administrative_area_level_2':
                components.county = comp.long_name;
                break;
            case 'colloquial_area':
                components.nickName = comp.long_name;
                break;
            case 'locality':
                components.city = comp.long_name;
                break;
            case 'neighborhood':
                components.neighborhood = comp.long_name;
                break;
            case 'premise':
                components.buildingName = comp.long_name;
                break;
            case 'subpremise':
                components.subBuildingName = comp.long_name;
                break;
            case 'plus_code':
                components.nonAddress = comp.long_name;
                break;
            case 'postal_code':
                components.zip = comp.long_name + (components.zip ? `-${components.zip}` : '');
                break;
            case 'postal_code_suffix':
                components.zip = (components.zip ? `${components.zip}-` : '') + comp.long_name;
                break;
            case 'natural_feature':
                components.natural = comp.long_name;
                break;
            case 'airport':
                components.airport = comp.long_name;
                break;
            case 'park':
                components.park = comp.long_name;
                break;
            case 'point_of_interest':
                components.poi = comp.long_name;
                break;
            default:
                console.log('Unknown address feature', comp);
                break;
        }
    }
    
    return components;
}
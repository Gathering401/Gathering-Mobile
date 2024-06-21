export function logError(error, prefix = 'Error: ') {
    console.log(prefix, JSON.stringify(error, null, 2));
}
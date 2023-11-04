export function getColorByValue(value) {
    switch(value) {
        case '1':
            return '#fff';
        case '2':
            return 'red';
        case '3':
            return 'orange';
        case '4':
            return '#70655e';
        case '5':
            return '#5b6ce3';
        default:
            return '#fff';
    }
}
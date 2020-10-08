const KTPFormat = (value: string): string => {
    let part;
    let result = '';

    if (value !== null) {
        part = value.match(/.{1,4}/g);
    }

    if (part !== null && part !== undefined) {
        result = part.join('-');
    }

    return result;
};

const NPWPFormat = (value: string): string => {
    let result = '';

    result = value.substr(0, 2) + '.';
    result += value.substr(result.length - 1, 3) + '.';
    result += value.substr(result.length - 2, 3) + '.';
    result += value.substr(result.length - 3, 1) + '-';
    result += value.substr(result.length - 4, 3) + '.';
    result += value.substr(result.length - 5, 3);

    return result;
};

export { KTPFormat, NPWPFormat };

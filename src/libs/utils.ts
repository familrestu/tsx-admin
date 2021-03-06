const GetInitial = (string: string) => {
    let firstChar = '';
    let secondChar = '';

    /* set string as Array */
    if (string) {
        const arrString = string.split(' ');

        if (arrString.length > 1) {
            firstChar = arrString[0].toString().toUpperCase()[0];
            secondChar = arrString[arrString.length - 1].toString().toUpperCase()[0];
        } else {
            firstChar = string[0].toUpperCase();
            secondChar = string[string.length - 1].toUpperCase();
        }

        return `${firstChar}${secondChar}`;
    } else {
        return ' ';
    }
};

export { GetInitial };

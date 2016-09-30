'use strict';

const maxAge = (filePath) => {
    const version = filePath.split('/')[1];
    return version === 'latest' ?
        10800 :
        31536000;
};

module.exports = maxAge;

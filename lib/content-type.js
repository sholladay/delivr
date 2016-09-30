'use strict';

const path = require('path');

const type = {
    js   : 'application/javascript',
    css  : 'text/css',
    html : 'text/html'
};

const contentType = (filePath) => {
    const extension = path.extname(filePath).substring(1);
    return Object.prototype.hasOwnProperty.call(type, extension) ?
        type[extension] + '; charset=utf-8' :
        null;
};

module.exports = contentType;

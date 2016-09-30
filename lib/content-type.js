'use strict';

const path = require('path');

const utf8 = (str) => {
    return str + '; charset=utf-8';
};

const type = {
    js   : utf8('application/javascript'),
    css  : utf8('text/css'),
    html : utf8('text/html'),
    png  : 'image/png',
    svg  : 'image/svg+xml',
    ogg  : 'audio/ogg',
    mp3  : 'audio/mpeg'
};

const contentType = (filePath) => {
    const extension = path.extname(filePath).substring(1);
    return Object.prototype.hasOwnProperty.call(type, extension) ?
        type[extension] :
        null;
};

module.exports = contentType;

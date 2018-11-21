module.exports = {
    remove: ['models'],
    add: [{
        place: 'init',
        list: true,
        //signature: ['name', 'init'],
        method: 'services',
        after: ['plugins', 'register']
    }]
};

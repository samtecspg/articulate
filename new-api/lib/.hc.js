module.exports = {
    remove: ['models'],
    add: [
        {
            place: 'init',
            list: true,
            method: 'services',
            after: ['plugins', 'register']
        },
        {
            place: 'websocket',
            list: true,
            method: 'services',
            after: ['plugins', 'register']
        }]
};

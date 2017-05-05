export let config = {
    baseUri: 'http://yourdomain.com',
    web: {
        uri: 'http://yourdomain.com',
    },
    db: {
        uri: 'mongodb://mongo:27017/chat-application'
    },
    logging: {
        enabled: false,
        path: '/logs/',
    },
};
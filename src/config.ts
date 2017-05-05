export let config = {
    baseUri: 'http://localhost:3000',
    web: {
        uri: 'http://localhost:3000',
    },
    db: {
        uri: 'mongodb://localhost:27017/chat-application'
    },
    logging: {
        enabled: true,
        path: './',
    },
};
// Imports
import * as co from 'co';
import * as mongo from 'mongodb';

// Imports models
import { Message } from './../models/message';

export class MessageService {

    constructor(private uri: string) {

    }

    public create(id: string, username: string, text: string): Promise<Message> {
        const self = this;

        return co(function* () {

            const message = new Message(id, username, text, new Date().getTime());

            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('features');

            const result: any = yield collection.insertOne({
                id: message.id,
                username: message.username,
                text: message.text,
                timestamp: message.timestamp
            });

            db.close();

            return message;
        });
    }

    public list(id: string): Promise<Message[]> {
        const self = this;

        return co(function* () {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('features');

            const messages: any[] = yield collection.find({
                id: id,
            }).sort({
                timestamp: 1
            }).limit(50)
                .toArray();

            db.close();

            return messages.map((x) => new Message(x.id, x.username, x.text, x.timestamp));
        });
    }
}

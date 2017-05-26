// Imports
import * as co from 'co';
import * as mongo from 'mongodb';

// Imports models
import { Message } from './../../models/message';

export class MessageRepository {

    constructor(private uri: string) {

    }

    public create(message: Message): Promise<boolean> {
        const self = this;

        return co(function* () {

            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('messages');

            const result: any = yield collection.insertOne({
                id: message.id,
                text: message.text,
                timestamp: message.timestamp,
                username: message.username,
            });

            db.close();

            return message;
        });
    }

    public list(id: string): Promise<Message[]> {
        const self = this;

        return co(function* () {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('messages');

            const messages: any[] = yield collection.find({ id }).sort({
                timestamp: 1,
            }).limit(50).toArray();

            db.close();

            return messages.map((x) => new Message(x.id, x.username, x.text, x.timestamp));
        });
    }
}

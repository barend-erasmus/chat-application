// Imports
import * as mongo from 'mongodb';

// Imports models
import { Message } from './../../models/message';

export class MessageRepository {

    constructor(private uri: string) {

    }

    public async create(message: Message): Promise<boolean> {

        const db: mongo.Db = await mongo.MongoClient.connect(this.uri);

        const collection: mongo.Collection = db.collection('messages');

        const result: any = await collection.insertOne({
            id: message.id,
            text: message.text,
            timestamp: message.timestamp,
            username: message.username,
        });

        db.close();

        return true;
    }

    public async list(id: string): Promise<Message[]> {
        const db: mongo.Db = await mongo.MongoClient.connect(this.uri);

        const collection: mongo.Collection = db.collection('messages');

        const messages: any[] = await collection.find({ id }).sort({
            timestamp: 1,
        }).limit(50).toArray();

        db.close();

        return messages.map((x) => new Message(x.id, x.username, x.text, x.timestamp));
    }

    public async listByUsername(username: string): Promise<Message[]> {
        const db: mongo.Db = await mongo.MongoClient.connect(this.uri);

        const collection: mongo.Collection = db.collection('messages');

        const messages: any[] = await collection.find({ username }).sort({
            timestamp: 1,
        }).limit(10).toArray();

        db.close();

        return messages.map((x) => new Message(x.id, x.username, x.text, x.timestamp));
    }
}

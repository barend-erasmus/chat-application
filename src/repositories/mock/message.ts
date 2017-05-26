// Imports models
import { Message } from './../../models/message';

export class MessageRepository {

    public create(message: Message): Promise<boolean> {
        return Promise.resolve(true);
    }

    public list(id: string): Promise<Message[]> {
        return Promise.resolve([]);
    }
}

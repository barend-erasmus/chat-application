// Imports models
import { Message } from './../models/message';

export interface IMessageRepository {
    create(message: Message): Promise<boolean>;
    list(id: string): Promise<Message[]>;
    listByUsername(username: string): Promise<Message[]>;
}

// Imports
import { IMessageRepository } from './../message';
import { BaseRepository } from './base';

// Imports models
import { Message } from './../../models/message';

export class MessageRepository extends BaseRepository implements IMessageRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(message: Message): Promise<boolean> {

        BaseRepository.models.Message.create({
            chatId: message.id,
            text: message.text,
            timestamp: message.timestamp,
            username: message.username,
        });

        return true;
    }


    public async list(id: string): Promise<Message[]> {
        const messages: any[] = await BaseRepository.models.Message.findAll({
            where: {
                chatId: id,
            },
        });

        return messages.map((x) => new Message(x.chatId, x.username, x.text, x.timestamp));
    }
}
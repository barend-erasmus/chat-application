// Imports models
import { Message } from './../models/message';

// Imports interfaces
import { IMessageRepository } from './../repositories/message';

export class MessageService {

    constructor(private messageRepository: IMessageRepository) {

    }

    public async create(id: string, username: string, text: string): Promise<Message> {

        const message = new Message(id, username, text, new Date().getTime());

        const result: boolean = await this.messageRepository.create(message);

        return message;
    }

    public async list(id: string): Promise<Message[]> {
        return this.messageRepository.list(id);
    }

    public async listByUsername(username: string): Promise<Message[]> {
        return this.messageRepository.listByUsername(username);
    }
}

// Imports
import * as co from 'co';

// Imports models
import { Message } from './../models/message';

// Imports interfaces
import { IMessageRepository } from './../repositories/message';

export class MessageService {

    constructor(private messageRepository: IMessageRepository) {

    }

    public create(id: string, username: string, text: string): Promise<Message> {
        const self = this;

        return co(function* () {

            const message = new Message(id, username, text, new Date().getTime());

            const result: boolean = yield self.messageRepository.create(message);

            return message;
        });
    }

    public list(id: string): Promise<Message[]> {
        return this.messageRepository.list(id);
    }
}

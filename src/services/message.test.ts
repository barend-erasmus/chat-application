// Imports
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

// Imports models
import { Message } from './../models/message';

// Imports repositories
import { MessageRepository } from './../repositories/mock/message';

// Imports services
import { MessageService } from './message';

describe('MessageService', () => {

    describe('list', () => {

        let messageService: MessageService = null;
        let messageRepositoryList: sinon.SinonSpy = null;

        beforeEach(() => {
            const messageRepository = new MessageRepository();

            messageRepositoryList = sinon.spy(messageRepository, 'list');

            messageService = new MessageService(messageRepository);
        });

        it('should call messageRepository.list', async () => {
            const result: Message[] = await messageService.list('123');

            expect(messageRepositoryList.calledOnce).to.be.true;
        });
    });

    describe('create', () => {

        let messageService: MessageService = null;
        let messageRepositoryCreate: sinon.SinonSpy = null;

        beforeEach(() => {
            const messageRepository = new MessageRepository();

            messageRepositoryCreate = sinon.spy(messageRepository, 'create');

            messageService = new MessageService(messageRepository);
        });

        it('should call messageRepository.create', async () => {
            const result: Message = await messageService.create('123', 'demousername', 'Hello World');

            expect(messageRepositoryCreate.calledOnce).to.be.true;
        });
    });
});

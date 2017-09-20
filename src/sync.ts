// Import repositories
import { BaseRepository } from './repositories/sequelize/base';
import { MessageRepository } from './repositories/sequelize/message';

const baseRepository: BaseRepository = new BaseRepository('developersworkspace.co.za', 'chat-application', 'eiZEocoCqNYduncWnVyS');

baseRepository.sync().then(async () => {
    baseRepository.close();
}).catch((err: Error) => {
    console.error(err);
    baseRepository.close();
});

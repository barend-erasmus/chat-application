// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        Message: Sequelize.Model<{}, {}>,
    } = null;

    private static defineModels(): void {
        const Message = BaseRepository.sequelize.define('message', {
            chatId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            text: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        this.models = {
            Message,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('chat-application', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
        }
    }

    public sync(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    public close(): void {
        BaseRepository.sequelize.close();
    }
}

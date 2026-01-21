import { readConfig} from 'src/config';
import { getUser } from 'src/lib/db/queries/users';
import { User} from 'src/lib/db/schema';
import { CommandHandler } from './commands/commands';

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();

        if (!config.currentUserName) {
            throw new Error(`No current user set. Please set a user before running this command.`);
        }
        const user = await getUser(config.currentUserName);

        if (!user) {
            throw new Error(`User ${config.currentUserName} not found.`);
        }

        return handler(cmdName, user, ...args);
    };
}
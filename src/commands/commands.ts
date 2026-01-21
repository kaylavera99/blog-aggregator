export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandRegistry = Record<string, CommandHandler>;
import { fetchFeed } from "src/lib/rss.js";


export function registerCommand(registry: CommandRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}


export async function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName];
    if (!handler) {
        console.error(`Unknown command: ${cmdName}`);
        return;
    }
    await handler(cmdName, ...args);
};



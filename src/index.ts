
import {handlerLogin, handlerRegister, handlerListUsers,} from "./commands/users.js";
import { type CommandRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerListFeedFollows } from "./commands/feed-follows.js";
import { middlewareLoggedIn } from "./middleware.js";
import { handlerUnfollow } from "./commands/unfollow.js";
import { handlerBrowse } from "./commands/browse.js";

async function main() {
    const argv = process.argv.slice(2);

    if (argv.length < 1) {
        console.error("Error: not enough arguments provided.");
        process.exit(1);
    }

    const [cmdName, ...cmdArgs] = argv;
    const newRegistry: CommandRegistry = {};
    registerCommand(newRegistry, "login", handlerLogin);
    registerCommand(newRegistry, "register", handlerRegister);
    registerCommand(newRegistry, "reset", handlerReset);
    registerCommand(newRegistry, "users", handlerListUsers);
    registerCommand(newRegistry, "agg", handlerAgg);
    registerCommand(newRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(newRegistry, "feeds", handlerListFeeds);
    registerCommand(newRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(newRegistry, "following", middlewareLoggedIn(handlerListFeedFollows));
    registerCommand(newRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow))
    registerCommand(newRegistry, "browse", middlewareLoggedIn(handlerBrowse));


    try {
        await runCommand(newRegistry, cmdName, ...cmdArgs);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }

}

main();


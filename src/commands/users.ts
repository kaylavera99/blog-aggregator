import { setUser, readConfig } from "src/config";
import { createUser, getUser, getUsers } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User with name ${userName} does not exist.`);
    }
    setUser(userName);
    console.log(`Logged in as ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    //if user already exists
    const existingUser = await getUser(userName);
    if (existingUser) {
        throw new Error(`User with name ${userName} already exists.`);
    }
    const newUser = await createUser(userName);
    setUser(newUser.name);
    console.log(`Registered and logged in as ${newUser.name}`);
    console.log(newUser);
}

export async function handlerListUsers() {
    const config = readConfig();
    const users = await getUsers();
    console.log("All users:");
    for (const user of users) {
        if (user.name == config.currentUserName) {
            // currently logged in user
            user.name = user.name + " (current)";
        }
        console.log(`* ${user.name}`);
}
}
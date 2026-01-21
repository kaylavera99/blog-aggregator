import {  User } from "src/lib/db/schema";
import { getPostsForUser} from "../lib/db/queries/posts"

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2;

    if (args.length > 1 ) {
        throw new Error(`usage ${cmdName} <limit>`)
    }

    if (args.length === 1) {
        const parsed = Number(args[0]);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new Error(`usage: ${cmdName} <limit> (limit must be a positive integer)`)
        }

        limit = parsed;
    }

    const posts = await getPostsForUser(user.id, limit)

    for (const post of posts) {
        const when = post.publishedAt
            ? post.publishedAt.toISOString()
            : post.createdAt.toISOString();
        
            console.log(` - ${when} | ${post.title}`);
            console.log(` - ${post.url}`);
            if (post.description) {
                console.log(` - ${post.description}`)
            }
            console.log("");
    }
}


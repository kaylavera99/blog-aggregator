import { User, Feed } from "src/lib/db/schema";
import { deleteFeedFollow } from "../lib/db/queries/unfollow";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { printFeedFollow } from "./feed-follows";


export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed_url>`);
    }
    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed not found: ${feedURL}`);
    }

    const ffRow = await deleteFeedFollow(user.id, feed.id);
    if (!ffRow) {
        throw new Error(`Feed follow not found for user ${user.name} and feed ${feed.name}`);
    }
    console.log(`Feed follow deleted:`);
    printFeedFollow(user.id, feed.name);
}

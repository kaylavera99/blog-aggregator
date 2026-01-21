
import { firstOrUndefined } from "./utils";
import { db } from "..";
import { userPosts, feedFollows } from "../schema";
import { desc, eq } from "drizzle-orm";

type CreatePostArgs = {
    title: string;
    url: string;
    description?: string | null;
    publishedAt?: Date | null;
    feed_id: string;
}
export async function createPost(args: CreatePostArgs) {
    const newPost = await db 
    .insert(userPosts)
    .values({
        title: args.title,
        url: args.url,
        description: args.description ?? null,
        publishedAt: args.publishedAt ?? null,
        feed_id: args.feed_id,

    }).onConflictDoNothing({ target: userPosts.url})

    return firstOrUndefined(newPost); 
}

export async function getPostsForUser(userId: string, limit: number) {
    const results = await db
    .select({
        id: userPosts.id,
        title: userPosts.title,
        url: userPosts.url,
        description: userPosts.description,
        publishedAt: userPosts.publishedAt,
        createdAt: userPosts.createdAt,
        feed_id: userPosts.feed_id
    })
    .from(userPosts)
    .innerJoin(feedFollows, eq(feedFollows.feedId, userPosts.feed_id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(userPosts.publishedAt), desc(userPosts.createdAt))
    .limit(1);

    return results

}
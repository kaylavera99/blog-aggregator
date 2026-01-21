import {db} from "..";
import { eq, and } from "drizzle-orm";
import { feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";

export async function deleteFeedFollow(userId: string, feedId: string) {
    const result = await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, userId),
                eq(feedFollows.feedId, feedId),
            ),
        )
        .returning();
    return firstOrUndefined(result);
}
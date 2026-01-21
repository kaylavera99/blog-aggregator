import { eq, and, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  const result = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function getFeedFollowByUserAndFeed(userId: string, feedId: string) {
  const result = await db
    .select()
    .from(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feedId),
      ),
    );
  return firstOrUndefined(result);
}

export async function markFeedAsFetched(feedId: string) {
  const now = new Date();

  await db 
    .update(feeds)
    .set({
      lastFetchedAt: now,
      updatedAt: now
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const nextFeed = await db 
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);

    return firstOrUndefined(nextFeed);
}


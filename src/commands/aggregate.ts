import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedAsFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {

  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenReqs = parseDuration(args[0]);

  console.log(`Collecting feeds every ${formatDuration(timeBetweenReqs)}`);

  const handleErr = (err: unknown) => {
    console.error("Error handling feeds:" , err);
  }

  scrapeFeeds().catch(handleErr);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleErr);
  }, timeBetweenReqs
  )

  await new Promise<void>((resolve) =>{
    process.on("SIGINT", () => {
      console.log("Shutting down the feed aggregator...");
      clearInterval(interval);
      resolve();
    })
  })
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) return `${minutes}m${seconds}s`;
  return `${seconds}s`;

}

export async function scrapeFeeds() : Promise<void>{
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }

  await markFeedAsFetched(feed.id);
  console.log(`Fetching: ${feed.url}`);

  const rss = await fetchFeed(feed.url);

  for (const fRSS of rss.channel.item) {
    //console.log(`- ${fRSS.title}`)
    const publishedAt = parsePublishedAt(fRSS.pubDate);

    const inserted = await createPost({
      title: fRSS.title ?? "(no title)",
      url: fRSS.link,
      description: fRSS.description ?? null,
      publishedAt,
      feed_id: feed.id
    });

    if (inserted) {
      console.log("Saved post:", fRSS.title);
    }
  }

  
}

function parseDuration(durationStr: string) : number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(`Invalid duration: ${durationStr}. Use formats like 1s, 5m, 250ms, 1h`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error (`Invalid duration unit: ${unit}`);
  }

}

function parsePublishedAt(dateStr: string | undefined) : Date | null {
  if (!dateStr) {
    return null;
  }

  const dt = new Date(dateStr);
  if (!Number.isNaN(dt.getTime())) return dt;

  return null;

}

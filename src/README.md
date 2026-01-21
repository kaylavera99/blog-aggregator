# Blog Aggregator (RSS)

A simple CLI app that lets you:
    - Register and login users
    - Add RSS feeds
    - Follow and unfollow feeds
    - Run an aggregator to scrape feeds on an interval
    - Browse the latest posts from feeds you follow

## Tech Stack
    - **Node.js / TypeScript** (runs via `tsx`)
    = **PostgreSQL** (persistent storage)
    - **Drizzle ORM** (schema and queries)
    - **drizzle-kit** (migration generation and running migrations)
    - **fast-xml-parser** (RSS XML parsing)

## Database
This project uses **Postgres** to store:
    -  `users`
    -  `feeds`
    -  `feed follows`
    -  `posts` (scraped from RSS feeds)

## Requirements
    - Node.js (v18+ recommended)
    - Postgres
    - `psql` installed (optional, but useful)


## Setup
    1. Install dependencies: 
    ```bash
        npm install
    ```
    2. Configure your Postgres connection string
    3. Run migrations and initialize tables set in `schema.ts`:
    ```bash
        npx drizzle-kit generate
        npx drizzle-kit migrate
    ```

## Commands
### Users
    - `npm run start register <username>` : registering a new user
    - `npm run start login <username>` : logging in
    - `npm run start users` : list all users registered in the users table
    - `npm run start reset` : reset the Postgres database
### Feeds
    - `npm run start addfeed <feed-name> <feed_url>`: a user adding a feed to the feeds table
    - `npm run start feeds`: fetching all the feeds in the feeds table
### Following
    - `npm run start follow <feed_url>` : follow a specific feed that's in the feeds table
    - `npm run start following` : fetching the feeds followed by the current user
    - `npm run start unfollow <feed_url>` : user unfollows a specified feed
### Aggregator and Posts
#### Run the scraper on an interval: 
    - `npm run start agg <time-between-requests>`
    - Example:
        - `npm run start agg 10s` 
        - `npm run start agg 1m`
#### Browse the latest posts from feeds you follow (defaults to 2 posts):
    - npm run start browse <number-posts-to-fetch>
    - Example:
        - `npm run start browse 10`


### Notes
- Posts are stored automatically by the aggregator (`agg`)
- Duplicate posts are ignored using the post URL as a unique key

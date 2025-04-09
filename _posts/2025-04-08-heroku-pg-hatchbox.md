---
layout: post
title: "Migrating a PostgreSQL database from Heroku to Hatchbox"
date: 2024-09-15
categories: Business
---

This post outlines a straightforward process for migrating your Heroku Postgres database to Hatchbox Postgres. The following steps assume both your Heroku and Hatchbox applications are already working with their respective databases.

---

## Prerequisites

- Both applications have their databases up and running.
- You have SSH access to your Hatchbox server.
- Your Hatchbox app is configured with the necessary environment variables.

---

## Step-by-Step Migration

### Step 1: Retrieve the Heroku Database URL

Get your Heroku database URL and save it as an environment variable in Hatchbox:

```bash
HEROKU_URL=$(heroku config:get DATABASE_URL --app yourapp)
```

### Step 2: SSH into Your Hatchbox Server

Log in to your Hatchbox server via SSH:

```bash
ssh deploy@your-hatchbox-domain
```

### Step 3: Change Directory to Your Hatchbox App

Navigate to your Hatchbox application's current release directory:

```bash
cd ~/YOUR-APP/current
```

### Step 4: Load the Environment Variables

Load the environment variables required by your Hatchbox app:

```bash
eval "$(/home/deploy/.asdf/bin/asdf vars)"
```

### Step 5: Run pgsync to Migrate the Data

Execute the pgsync command to start the migration:

```bash
bundle exec pgsync --to "$DATABASE_URL" --from "$HEROKU_URL" --debug --to-safe
```

If you encounter issues related to foreign keys or constraints, consider deferring those constraints:

```bash
bundle exec pgsync --to "$DATABASE_URL" --from "$HEROKU_URL" --defer-constraints --debug --to-safe
```

---

## Final Notes

- **Data Integrity:** Always review any error messages carefully. Issues related to foreign keys or other constraints might require adjusting your data or modifying constraint settings.
- **Testing:** Once migration completes, perform thorough testing to confirm that your application operates correctly on Hatchbox Postgres.

This concise set of steps should help you migrate your database effectively.
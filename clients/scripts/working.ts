#!/usr/bin/env bun

import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const clientsDir = process.env.CLIENTS_DIR_OVERRIDE ?? join(import.meta.dir, "..");
const templateFile = join(clientsDir, "_template", "meeting.md");
const template = readFileSync(templateFile, "utf-8");

const clientDirs = readdirSync(clientsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "scripts" && d.name !== "_template")
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((d) => ({ name: d.name, path: join(clientsDir, d.name) }));

for (const client of clientDirs) {
  const files = readdirSync(client.path);

  const transcripts = files
    .filter((f) => f.endsWith(".transcript.md"))
    .sort();

  for (const transcript of transcripts) {
    const base = transcript.replace(".transcript.md", "");
    const cleanedFile = join(client.path, `${base}.cleaned.md`);
    const chatgptFile = join(client.path, `${base}.chatgpt.md`);
    const summaryFile = join(client.path, `${base}.summary.md`);

    if (!existsSync(cleanedFile)) {
      console.error(`STOP: ${client.name}/${base}.transcript.md has not been cleaned yet.`);
      console.error(`\nNext step: clean the transcript and save the result as:`);
      console.error(`  ${cleanedFile}`);
      process.exit(1);
    }

    if (!existsSync(chatgptFile)) {
      console.error(`STOP: ${client.name}/${base}.cleaned.md has no ChatGPT analysis yet.`);
      console.error(`\nNext step: paste the cleaned transcript into ChatGPT and save the output as:`);
      console.error(`  ${chatgptFile}`);
      process.exit(1);
    }

    if (!existsSync(summaryFile)) {
      const cleanedContent = readFileSync(cleanedFile, "utf-8");
      const chatgptContent = readFileSync(chatgptFile, "utf-8");

      console.error(`STOP: ${client.name}/${base} needs a meeting summary.\n`);
      console.error(`Output file: ${summaryFile}\n`);
      console.error(`=== PROMPT FOR CLAUDE ===\n`);
      console.log(`Use the following template, cleaned transcript, and ChatGPT analysis to write a finalized meeting summary. Save it to ${summaryFile}.`);
      console.log(`\n--- TEMPLATE ---\n`);
      console.log(template);
      console.log(`\n--- CLEANED TRANSCRIPT (${base}) ---\n`);
      console.log(cleanedContent);
      console.log(`\n--- CHATGPT ANALYSIS ---\n`);
      console.log(chatgptContent);
      process.exit(1);
    }
  }
}

console.log("All transcripts fully synthesized. Nothing to do.");

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
    const transcriptFile = join(client.path, `${base}.transcript.md`);
    const chatgptFile = join(client.path, `${base}.chatgpt.md`);
    const summaryFile = join(client.path, `${base}.summary.md`);

    if (!existsSync(chatgptFile)) {
      console.error(`STOP: ${client.name}/${base}.transcript.md has no ChatGPT summary yet.`);
      console.error(`\nNext step: paste the transcript into ChatGPT and save the output as:`);
      console.error(`  ${chatgptFile}`);
      process.exit(1);
    }

    if (!existsSync(summaryFile)) {
      const transcriptContent = readFileSync(transcriptFile, "utf-8");
      const chatgptContent = readFileSync(chatgptFile, "utf-8");

      console.error(`STOP: ${client.name}/${base} needs a meeting summary.\n`);
      console.error(`Output file: ${summaryFile}\n`);
      console.error(`=== PROMPT FOR CLAUDE ===\n`);
      console.log(`Use the following template, transcript, and ChatGPT analysis to write a finalized meeting summary. Save it to ${summaryFile}.`);
      console.log(`\n--- TEMPLATE ---\n`);
      console.log(template);
      console.log(`\n--- TRANSCRIPT (${base}) ---\n`);
      console.log(transcriptContent);
      console.log(`\n--- CHATGPT ANALYSIS ---\n`);
      console.log(chatgptContent);
      process.exit(1);
    }
  }
}

console.log("All transcripts fully synthesized. Nothing to do.");

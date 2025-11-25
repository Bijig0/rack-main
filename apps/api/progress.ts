#!/usr/bin/env bun

/**
 * Project Progress Tracker
 *
 * Monitors task completion for the Property Report PDF Generator
 * Automatically checks progress every 3 minutes and displays statistics
 *
 * Usage: bun progress.ts
 */

import { watch } from "fs";
import { readFileSync } from "fs";

type TaskStatus = "done" | "not-done" | "in-progress";

type Task = {
  name: string;
  status: TaskStatus;
  description?: string;
  note?: string; // What needs to be done for this task
  url?: string; // Link to the relevant file
};

type Section = {
  name: string;
  tasks: Task[];
};

// ============================================================================
// LOAD TASKS FROM JSON
// ============================================================================

function loadTasks(): Section[] {
  const raw = readFileSync("./tasks.json", "utf-8");
  return JSON.parse(raw);
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

function getStatusIcon(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "\x1b[32m✓\x1b[0m"; // Green checkmark
    case "in-progress":
      return "\x1b[33m⟳\x1b[0m"; // Yellow spinner
    case "not-done":
      return "\x1b[90m○\x1b[0m"; // Gray circle
  }
}

function displayProgress() {
  const projectTasks = loadTasks(); // Load fresh data from tasks.json

  const timestamp = new Date().toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.clear();
  console.log(
    "================================================================"
  );
  console.log("       PROPERTY REPORT PDF GENERATOR - TASK STATUS");
  console.log(
    "================================================================"
  );
  console.log(`Last updated: ${timestamp}\n`);

  // Display all tasks with their status
  for (const section of projectTasks) {
    console.log(`\n\x1b[1m${section.name}\x1b[0m`);

    for (const task of section.tasks) {
      const icon = getStatusIcon(task.status);
      const description = task.description ? ` - ${task.description}` : "";
      const note = task.note ? ` [TODO: ${task.note}]` : "";
      const url = task.url ? ` → ${task.url}` : "";
      console.log(`  ${icon} ${task.name}${description}${note}${url}`);
    }
  }

  console.log(
    "\n================================================================"
  );
  console.log(
    "Legend:  \x1b[32m✓\x1b[0m = Done | \x1b[33m⟳\x1b[0m = In Progress | \x1b[90m○\x1b[0m = Not Done"
  );
  console.log(
    "================================================================\n"
  );
}

// ============================================================================
// WATCH MODE
// ============================================================================

function watchProgress() {
  displayProgress();

  let timeout: Timer | null = null;

  // Watch the tasks.json file for changes
  const watcher = watch("./tasks.json", (eventType) => {
    if (eventType === "change") {
      // Debounce rapid file changes
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        displayProgress();
      }, 100);
    }
  });

  // Keep process alive
  process.on("SIGINT", () => {
    if (timeout) clearTimeout(timeout);
    watcher.close();
    console.log("\n\n⏹ Progress tracker stopped.");
    process.exit(0);
  });
}

// ============================================================================
// CLI COMMANDS
// ============================================================================

const args = process.argv.slice(2);
const command = args[0];

if (command === "watch") {
  console.log("▶ Starting progress tracker in watch mode...\n");
  watchProgress();
} else {
  // Default: show progress once
  displayProgress();
  console.log(
    "💡 Tip: Run 'bun progress.ts watch' for continuous monitoring\n"
  );
}

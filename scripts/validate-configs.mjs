#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Special problem names that don't need to exist as .pl files
const ALLOWED_SPECIAL_PROBLEMS = ["questionnaire1", "questionnaire2"];

async function getAllProblems() {
  const problemsDir = path.join(rootDir, "problems");
  const files = await fs.readdir(problemsDir);
  return files
    .filter((file) => file.toLowerCase().endsWith(".pl"))
    .map((file) => file.slice(0, -3)); // Remove .pl extension
}

async function getAllConfigs() {
  const configDir = path.join(rootDir, "study_setup");
  const files = await fs.readdir(configDir);
  return files
    .filter((file) => file.toLowerCase().endsWith(".json"))
    .map((file) => file.slice(0, -5)); // Remove .json extension
}

async function validateConfig(configName, availableProblems) {
  const configPath = path.join(rootDir, "study_setup", `${configName}.json`);
  const configContent = await fs.readFile(configPath, "utf-8");
  const config = JSON.parse(configContent);

  const errors = [];
  const warnings = [];

  if (!config.categories || !Array.isArray(config.categories)) {
    errors.push(`Config ${configName}: Missing or invalid 'categories' array`);
    return { errors, warnings };
  }

  // Collect all problems across all categories to check for duplicates across the config
  const allProblemsInConfig = [];
  const problemLocationMap = new Map(); // Track where each problem appears

  for (const [categoryIndex, category] of config.categories.entries()) {
    if (!category.problems || !Array.isArray(category.problems)) {
      errors.push(
        `Config ${configName}, category ${categoryIndex} (${category.name || "unnamed"}): Missing or invalid 'problems' array`,
      );
      continue;
    }

    for (const problem of category.problems) {
      // Track problem locations
      if (!problemLocationMap.has(problem)) {
        problemLocationMap.set(problem, []);
      }
      problemLocationMap.get(problem).push(category.name);
      allProblemsInConfig.push(problem);

      if (
        !ALLOWED_SPECIAL_PROBLEMS.includes(problem) &&
        !availableProblems.includes(problem)
      ) {
        errors.push(
          `Config ${configName}, category "${category.name}": Problem "${problem}" does not exist in problems/ directory`,
        );
      }
    }

    // Check for duplicate problems within the same category
    const duplicates = category.problems.filter(
      (item, index) => category.problems.indexOf(item) !== index,
    );
    if (duplicates.length > 0) {
      warnings.push(
        `Config ${configName}, category "${category.name}": Duplicate problems found: ${[...new Set(duplicates)].join(", ")}`,
      );
    }
  }

  // Check for problems appearing in multiple categories
  for (const [problem, categories] of problemLocationMap.entries()) {
    if (categories.length > 1) {
      errors.push(
        `Config ${configName}: Problem "${problem}" appears in multiple categories: ${categories.join(", ")}`,
      );
    }
  }

  return { errors, warnings };
}

async function main() {
  console.log("Validating study configurations...\n");

  const availableProblems = await getAllProblems();
  console.log(
    `Found ${availableProblems.length} problem files in problems/ directory\n`,
  );

  const configs = await getAllConfigs();
  console.log(
    `Found ${configs.length} configuration files in study_setup/ directory\n`,
  );

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const configName of configs) {
    const { errors, warnings } = await validateConfig(
      configName,
      availableProblems,
    );

    if (errors.length > 0) {
      console.error(`❌ Errors in ${configName}.json:`);
      errors.forEach((error) => console.error(`  - ${error}`));
      totalErrors += errors.length;
    }

    if (warnings.length > 0) {
      console.warn(`⚠️  Warnings in ${configName}.json:`);
      warnings.forEach((warning) => console.warn(`  - ${warning}`));
      totalWarnings += warnings.length;
    }
  }

  console.log("\n" + "=".repeat(60));
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log("✅ All configurations are valid!");
  } else {
    if (totalErrors > 0) {
      console.error(`❌ Found ${totalErrors} error(s)`);
    }
    if (totalWarnings > 0) {
      console.warn(`⚠️  Found ${totalWarnings} warning(s)`);
    }
  }
  console.log("=".repeat(60) + "\n");

  // Exit with error code if there are errors
  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to validate configurations:", error);
  process.exit(1);
});

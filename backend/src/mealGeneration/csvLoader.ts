import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Meal, mealSchema } from "../../globals";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedMeals: Meal[] | null = null;

/**
 * Loads and parses mealData.csv from backend/data/
 * Caches results in memory for subsequent calls
 */
export function loadMealsFromCSV(): Meal[] {
  if (cachedMeals) {
    return cachedMeals;
  }

  const csvPath = join(__dirname, "../../data/mealData.csv");
  const fileContent = readFileSync(csvPath, "utf-8");
  const lines = fileContent.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV file is empty or missing header row");
  }

  // Parse header
  const header = lines[0].split(",").map((h) => h.trim());
  const expectedHeaders = [
    "ID",
    "Meal Name",
    "Meal Time",
    "Diet",
    "Ingredients",
    "Website",
    "Calories",
  ];

  // Validate header structure
  const headerLower = header.map((h) => h.toLowerCase());
  const hasAllHeaders = expectedHeaders.every((expected) =>
    headerLower.includes(expected.toLowerCase())
  );

  if (!hasAllHeaders) {
    throw new Error(
      `CSV header mismatch. Expected: ${expectedHeaders.join(", ")}`
    );
  }

  const meals: Meal[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);

    try {
      const meal = mealSchema.parse({
        id: values[0],
        name: values[1],
        mealTime: values[2].trim().toLowerCase(),
        diet: values[3],
        ingredients: values[4],
        website: values[5],
        calories: values[6],
        serving: 1,
        occurrences: 0,
      });
      meals.push(meal);
    } catch (error) {
      console.warn(`Skipping invalid meal at line ${i + 1}:`, error);
    }
  }

  cachedMeals = meals;
  return meals;
}

/**
 * Parse a CSV line handling quoted fields with commas
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Clear cache (useful for testing or reloading data)
 */
export function clearMealCache(): void {
  cachedMeals = null;
}

const SOURCE_URL = "https://bloxfruitswiki.org/wiki/codes/";

async function updateCodes() {
  const response = await fetch(SOURCE_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status}`);
  }

  const html = await response.text();

  console.log("Source fetched successfully!");
  console.log(`Downloaded ${html.length} characters.`);

  // --------------------------------
  // 1. Find Working Codes section
  // --------------------------------

  const workingSection = html.match(
    /<h3[^>]*>Working Codes<\/h3>([\s\S]*?)<h3[^>]*>Expired Codes<\/h3>/i
  );

  if (!workingSection) {
    throw new Error("Could not find Working Codes section.");
  }

  const workingHtml = workingSection[1];

  // --------------------------------
  // 2. Find Expired Codes section
  // --------------------------------

  const expiredSection = html.match(
    /<h3[^>]*>Expired Codes<\/h3>([\s\S]*?)(?=<h3|$)/i
  );

  if (!expiredSection) {
    throw new Error("Could not find Expired Codes section.");
  }

  const expiredHtml = expiredSection[1];

  // --------------------------------
  // 3. Extract codes from a section
  // --------------------------------

  function extractCodes(section: string): string[] {
    const rows = [...section.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)];

    const codes = rows
      .map((row) => {
        const codeMatch = row[1].match(/<code>(.*?)<\/code>/i);

        if (!codeMatch) {
          return null;
        }

        return codeMatch[1].trim();
      })
      .filter((code): code is string => code !== null);

    return [...new Set(codes)];
  }

  const workingCodes = extractCodes(workingHtml);
  const expiredCodes = extractCodes(expiredHtml);

  // --------------------------------
  // 4. Remove duplicates
  // --------------------------------

  const expiredSet = new Set(expiredCodes);

  const finalWorkingCodes = workingCodes.filter(
    (code) => !expiredSet.has(code)
  );

  console.log(
    `Found ${finalWorkingCodes.length} working codes.`
  );

  console.log(
    `Found ${expiredCodes.length} expired codes.`
  );

  // --------------------------------
  // 5. Show results
  // --------------------------------

  console.log("\nWORKING CODES:");

  for (const code of finalWorkingCodes) {
    console.log(`- ${code}`);
  }

  console.log("\nEXPIRED CODES:");

  for (const code of expiredCodes) {
    console.log(`- ${code}`);
  }

  // --------------------------------
  // 6. Open codes.ts
  // --------------------------------

  const fs = await import("fs/promises");
  const path = await import("path");

  const codesPath = path.join(
    process.cwd(),
    "app",
    "data",
    "codes.ts"
  );

  // --------------------------------
  // 7. Generate the complete codes.ts
  // --------------------------------

  const newFile = `export const codes = {
  "blox-fruits": [
${finalWorkingCodes.map((code) => `    "${code}"`).join(",\n")}
  ],

  "blue-lock-rivals": [
    "NELREO",
    "FLOWSTATE",
    "EGOIST",
  ],

  "anime-rangers-x": [
    "RANGERS",
    "LEVELUP",
    "LUCKY",
  ],
};

export const expiredCodes = {
  "blox-fruits": [
${expiredCodes.map((code) => `    "${code}"`).join(",\n")}
  ],

  "blue-lock-rivals": [
    "LOCKOFF",
  ],

  "anime-rangers-x": [
    "UPDATE1",
  ],
};
`;

  // --------------------------------
  // 8. Save the file
  // --------------------------------

  await fs.writeFile(codesPath, newFile, "utf-8");

  console.log("\ncodes.ts updated successfully!");
}

updateCodes().catch((error) => {
  console.error("Update failed:");
  console.error(error);
  process.exit(1);
});
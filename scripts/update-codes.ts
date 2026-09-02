const SOURCE_URL = "https://bloxfruitswiki.org/wiki/codes/";

const BLR_SOURCE_URL = "https://beebom.com/blue-lock-rivals-codes/";
const ARX_SOURCE_URL = "https://beebom.com/anime-rangers-x-codes/";
async function fetchBeebomPage(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Beebom source: ${response.status}`);
  }

  return await response.text();
}
function extractBeebomCodes(
  html: string,
  activeHeading: string,
  expiredHeading: string
) {
  const activeStart = html.indexOf(activeHeading);
  const expiredStart = html.indexOf(expiredHeading);

  if (activeStart === -1) {
    throw new Error(`Could not find active codes heading: ${activeHeading}`);
  }

  if (expiredStart === -1) {
    throw new Error(`Could not find expired codes heading: ${expiredHeading}`);
  }

  const activeHtml = html.slice(activeStart, expiredStart);

  const nextHeading = html.indexOf(
    "<h2",
    expiredStart + expiredHeading.length
  );

  const expiredHtml = html.slice(
    expiredStart,
    nextHeading === -1 ? html.length : nextHeading
  );

  const activeCodes = [
  ...activeHtml.matchAll(/<li>\s*<strong>([^<]+)<\/strong>/gi),
].map((match) => match[1].trim());

  const expiredCodes = [
    ...expiredHtml.matchAll(/<li>([^<]+)<\/li>/gi),
  ].map((match) => match[1].trim());

  return {
    activeCodes: [...new Set(activeCodes)],
    expiredCodes: [...new Set(expiredCodes)],
  };
}

async function updateCodes() {
  const response = await fetch(SOURCE_URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
});

  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status}`);
  }

  const html = await response.text();

  console.log("Source fetched successfully!");
  console.log(`Downloaded ${html.length} characters.`);
  const blrHtml = await fetchBeebomPage(BLR_SOURCE_URL);

console.log("BLR source fetched successfully!");
console.log(`Downloaded ${blrHtml.length} BLR characters.`);
const blrCodes = extractBeebomCodes(
  blrHtml,
  "All New Blue Lock Rivals Codes",
  "Expired Blue Lock Rivals Codes"
);
const arxHtml = await fetchBeebomPage(ARX_SOURCE_URL);

console.log("ARX source fetched successfully!");
console.log(`Downloaded ${arxHtml.length} ARX characters.`);

const arxCodes = extractBeebomCodes(
  arxHtml,
  "All New Re Rangers X Codes",
  "Expired Re Rangers X Codes"
);

console.log("ARX active codes:", arxCodes.activeCodes);
console.log("ARX expired codes:", arxCodes.expiredCodes);



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

console.log("WRITING TO:", codesPath);


  // --------------------------------
  // 7. Generate the complete codes.ts
  // --------------------------------

  const newFile = `export const codes = {
  "blox-fruits": [
${finalWorkingCodes.map((code) => `    "${code}"`).join(",\n")}
  ],

 "blue-lock-rivals": [
${blrCodes.activeCodes.map((code) => `    "${code}"`).join(",\n")}
],

 "anime-rangers-x": [
${arxCodes.activeCodes.map((code) => `    "${code}"`).join(",\n")}
],
};

export const expiredCodes = {
  "blox-fruits": [
${expiredCodes.map((code) => `    "${code}"`).join(",\n")}
  ],

  "blue-lock-rivals": [
${blrCodes.expiredCodes.map((code) => `    "${code}"`).join(",\n")}
],

  "anime-rangers-x": [
${arxCodes.expiredCodes.map((code) => `    "${code}"`).join(",\n")}
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
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import fg from "fast-glob";

// Function to convert tags in frontmatter of a markdown file
function convertTags(filePath) {
  console.log("converting tags in", filePath);
  // Read the content of the file
  let content = fs.readFileSync(filePath, "utf8");

  // Check if frontmatter exists
  if (content.includes("tags:")) {
    // Find tags section in frontmatter
    const start = content.indexOf("tags:") + "tags:".length;
    const end = content.indexOf("\n", start);

    // Extract tags from frontmatter
    let tagsStr = content.substring(start, end).trim();

    // Convert comma-separated tags into a YAML array
    let tagsArray = tagsStr
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tagsArray.length === 0) {
      return;
    }

    // Convert tags array to YAML format
    tagsStr = yaml.dump(tagsArray, { flowLevel: 1, indent: 2 }).trim();
    tagsStr = `\n${tagsStr}`;

    console.log("tagsArray", tagsArray);
    console.log("tagsStr");
    console.log(tagsStr);

    // Replace comma-separated tags with YAML array
    content = content.replace(content.substring(start, end), tagsStr);

    // Write modified content back to the file
    fs.writeFileSync(filePath, content, "utf8");
  }
}

// Main function to process markdown files
async function main() {
  // Get current directory
  const directory = path.join(
    process.cwd(),
    "..",
    "..",
    "web",
    "source",
    "blog"
  );

  const mdFiles = await fg(`${directory}/**/*.md`);

  //   // Find all .md files in the directory
  //   const mdFiles = fs
  //     .readdirSync(directory)
  //     .filter((file) => path.extname(file) === ".md");

  console.log("found files", mdFiles.length, "in", directory);
  // Process each .md file
  mdFiles.forEach((file) => {
    convertTags(file);
  });
}

// Execute the main function
main()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

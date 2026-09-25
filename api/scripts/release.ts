import { $ } from "bun";

const version = Bun.argv[2];

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!version) {
  fail("Usage: bun run release <x.y.z>");
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  fail(`Invalid version "${version}" — expected x.y.z (e.g. 0.2.0).`);
}

const pkgPath = "package.json";
const changelogPath = "../CHANGELOG.md";
const unreleasedPath = "../.UNRELEASED-CHANGELOG.md";
const notesPath = "../.release-notes.tmp";

const pkg = await Bun.file(pkgPath).json();
const previous: string = pkg.version;
pkg.version = version;
await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

const unreleased = await Bun.file(unreleasedPath).text();

function extractSection(name: string): string[] {
  let inSection = false;
  const items: string[] = [];
  for (const line of unreleased.split("\n")) {
    const heading = line.match(/^#{1,6}\s+([A-Za-z]+)\s*$/);
    if (heading) {
      inSection = heading[1]!.toLowerCase() === name.toLowerCase();
      continue;
    }
    if (inSection) {
      const bullet = line.match(/^\s*[-*]\s+(.+)$/);
      if (bullet) items.push(bullet[1]!.trim());
    }
  }
  return items;
}

const added = extractSection("Added");
const changed = extractSection("Changed");
const fixed = extractSection("Fixed");

const changelog = await Bun.file(changelogPath).text();
if (changelog.includes(`## [${version}]`)) {
  fail(`CHANGELOG.md already contains a [${version}] section. Bump the version.`);
}

const date = new Date().toISOString().slice(0, 10);
let block = `## [${version}] - ${date}\n`;
for (const [title, items] of [
  ["Added", added],
  ["Changed", changed],
  ["Fixed", fixed],
] as const) {
  if (items.length === 0) continue;
  block += `\n### ${title}\n`;
  for (const item of items) block += `- ${item}\n`;
}

if (added.length === 0 && changed.length === 0 && fixed.length === 0) {
  console.warn("Warning: no Added/Changed/Fixed notes found in .UNRELEASED-CHANGELOG.md");
}

console.log("Releasing with the following changelog entry:\n");
console.log(block);

await Bun.write(changelogPath, block + "\n" + changelog);

const skeleton =
  `## [Unreleased] - ${date}\n\n` +
  "> [!NOTE]\n" +
  "> Unreleased changelog refers to future version at current commit.\n\n" +
  "### Added\n\n### Changed\n\n### Fixed\n";
await Bun.write(unreleasedPath, skeleton);

await Bun.write(notesPath, block);

await $`git add package.json ../CHANGELOG.md ../.UNRELEASED-CHANGELOG.md`;
await $`git commit -m Release v${version}`;
await $`git tag -a v${version} -F ${notesPath}`;

try {
  await $`git push`;
  await $`git push origin v${version}`;
} catch (error) {
  console.error("Push failed. The commit and tag were created locally.");
  console.error(error);
  process.exit(1);
}

if (Bun.which("gh")) {
  await $`gh release create v${version} --title v${version} --notes-file ${notesPath}`;
  console.log(`GitHub release v${version} created.`);
} else {
  console.log("gh CLI not found — create the GitHub release manually and paste the notes above.");
}

await $`rm -f ${notesPath}`;
console.log(`Released v${version} (was ${previous}).`);

// @ts-check
import markdown from "markdown-it";
import { katex } from "@mdit/plugin-katex";
import prism from "markdown-it-prism";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TITLE = "Mini-Lisp 语言规范";

const md = markdown({
  html: true,
  linkify: true,
  breaks: true,
});
md.use(katex);
md.use(prism);

const SRC_PATH = "./README.md";
const DEST_PATH = "./dist/index.html";

const STYLES = [
  "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css",
  "./prism.css",
  "./latex.css",
  "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap",
  "https://lalten.github.io/lmweb/style/latinmodern-roman.css",
  "https://lalten.github.io/lmweb/style/latinmodern-mono.css",
];

const src = await readFile(SRC_PATH, "utf-8");
let dest = md.render(src, {});
dest = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${TITLE}</title>
    ${STYLES.map(
  (s) => `<link rel="stylesheet" href="${s}">`
).join("")}
</head>
<body>
    <div id="container">
    ${dest}
    </div>
</body>
</html>`;

await mkdir(path.dirname(DEST_PATH), { recursive: true });
await writeFile(DEST_PATH, dest, "utf-8");

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { filterQuestions, getFilterOptions, getQuestionById, getStats } from "./lib/questions.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = normalize(join(__dirname, ".."));
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT ?? 3000);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, payload, statusCode = 200) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function readFilters(searchParams) {
  return {
    year: searchParams.get("year") || undefined,
    discipline: searchParams.get("discipline") || undefined,
    competence: searchParams.get("competence") || undefined,
    skill: searchParams.get("skill") || undefined,
    difficulty: searchParams.get("difficulty") || undefined,
    q: searchParams.get("q") || undefined,
    triMin: searchParams.get("triMin") || undefined,
    triMax: searchParams.get("triMax") || undefined
  };
}

async function serveStatic(pathname, response) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(publicDir, requestedPath));

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    const body = await readFile(join(publicDir, "index.html"));
    response.writeHead(200, { "Content-Type": contentTypes[".html"] });
    response.end(body);
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (url.pathname === "/api/questions") {
    const questions = filterQuestions(readFilters(url.searchParams));
    sendJson(response, { count: questions.length, questions });
    return;
  }

  if (url.pathname.startsWith("/api/questions/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/questions/", ""));
    const question = getQuestionById(id);
    sendJson(response, question ? { question } : { error: "Questão não encontrada" }, question ? 200 : 404);
    return;
  }

  if (url.pathname === "/api/stats") {
    const questions = filterQuestions(readFilters(url.searchParams));
    sendJson(response, getStats(questions));
    return;
  }

  if (url.pathname === "/api/options") {
    sendJson(response, getFilterOptions());
    return;
  }

  await serveStatic(url.pathname, response);
});

server.listen(port, () => {
  console.log(`ENEM Natureza Analytics disponível em http://localhost:${port}`);
});

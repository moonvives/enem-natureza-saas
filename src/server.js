import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { filterQuestions, getFilterOptions, getQuestionById, getStats } from "./lib/questions.js";
import { renderAccessPage, renderAnalyticsPage, renderHomePage, renderQuestionDetailPage } from "./render.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = normalize(join(__dirname, ".."));
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

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

function sendHtml(response, html, statusCode = 200) {
  response.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
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
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo não encontrado");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    sendHtml(response, renderHomePage(readFilters(url.searchParams)));
    return;
  }

  if (url.pathname === "/analytics") {
    sendHtml(response, renderAnalyticsPage(readFilters(url.searchParams)));
    return;
  }

  if (url.pathname === "/access") {
    sendHtml(response, renderAccessPage({ localUrl: `http://localhost:${port}`, lanUrls: getLanUrls() }));
    return;
  }

  if (url.pathname.startsWith("/questions/")) {
    const id = decodeURIComponent(url.pathname.replace("/questions/", ""));
    const result = renderQuestionDetailPage(id);
    sendHtml(response, result.html, result.statusCode);
    return;
  }

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

  if (url.pathname === "/api/access") {
    sendJson(response, {
      localUrl: `http://localhost:${port}`,
      lanUrls: getLanUrls(),
      message: "Abra uma das lanUrls no Safari do iPad quando ele estiver na mesma rede Wi-Fi do computador."
    });
    return;
  }

  await serveStatic(url.pathname, response);
});

function getLanUrls() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => `http://${address.address}:${port}`);
}

server.listen(port, host, () => {
  const localUrl = `http://localhost:${port}`;
  const lanUrls = getLanUrls();

  console.log("ENEM Natureza Analytics disponível:");
  console.log(`- Neste computador: ${localUrl}`);

  if (lanUrls.length > 0 && host !== "127.0.0.1" && host !== "localhost") {
    console.log("- No iPad/celular na mesma rede Wi-Fi:");
    lanUrls.forEach((url) => console.log(`  ${url}`));
    console.log("  Obs.: se esse link parar, o IP provavelmente mudou. Rode npm run ipad:link para ver o link atual.");
  } else {
    console.log("- Para acessar de um iPad, inicie com HOST=0.0.0.0 npm run dev e use o IP deste computador.");
  }
});

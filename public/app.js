const app = document.querySelector("#app");
const state = { questions: [], options: null, stats: null };

const difficultyClass = { Baixa: "low", Média: "medium", Alta: "high" };

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function currentFilters() {
  const params = new URLSearchParams(window.location.search);
  return ["q", "year", "discipline", "competence", "skill", "difficulty", "triMin", "triMax"].reduce((filters, key) => {
    const value = params.get(key);
    if (value) filters[key] = value;
    return filters;
  }, {});
}

function toQuery(filters = currentFilters()) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  return params.toString();
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Falha ao carregar ${path}`);
  return response.json();
}

async function loadBaseData() {
  const query = toQuery();
  const [questionsPayload, statsPayload, optionsPayload] = await Promise.all([
    fetchJson(`/api/questions${query ? `?${query}` : ""}`),
    fetchJson(`/api/stats${query ? `?${query}` : ""}`),
    state.options ? Promise.resolve(state.options) : fetchJson("/api/options")
  ]);
  state.questions = questionsPayload.questions;
  state.stats = statsPayload;
  state.options = optionsPayload;
}

function optionList(values, selected) {
  return values.map((value) => `<option value="${escapeHtml(value)}" ${String(value) === selected ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
}

function renderFilterForm(filters = currentFilters()) {
  const options = state.options;
  return `
    <form class="filter-form" action="/" method="get">
      <label>Palavra-chave<input name="q" placeholder="ecologia, energia, pH..." value="${escapeHtml(filters.q)}" /></label>
      <label>Ano<select name="year"><option value="">Todos</option>${optionList(options.years, filters.year)}</select></label>
      <label>Disciplina<select name="discipline"><option value="">Todas</option>${optionList(options.disciplines, filters.discipline)}</select></label>
      <label>Competência<select name="competence"><option value="">Todas</option>${optionList(options.competences, filters.competence)}</select></label>
      <label>Habilidade<select name="skill"><option value="">Todas</option>${optionList(options.skills, filters.skill)}</select></label>
      <label>Dificuldade<select name="difficulty"><option value="">Todas</option>${optionList(options.difficulties, filters.difficulty)}</select></label>
      <label>TRI mínima<input name="triMin" type="number" min="0" max="100" value="${escapeHtml(filters.triMin)}" /></label>
      <label>TRI máxima<input name="triMax" type="number" min="0" max="100" value="${escapeHtml(filters.triMax)}" /></label>
      <div class="form-actions"><button type="submit">Filtrar questões</button><a href="/">Limpar</a></div>
    </form>`;
}

function questionCard(question) {
  return `
    <article class="question-card">
      <div class="card-meta">
        <span>${question.year}</span><span>${question.discipline}</span><span>${question.competence}</span><span>${question.skill}</span>
      </div>
      <h3>${escapeHtml(question.statement)}</h3>
      <p>Dificuldade <strong class="difficulty ${difficultyClass[question.estimatedDifficulty]}">${question.estimatedDifficulty}</strong> · score ${question.difficultyScore}/100 · TRI b=${question.tri.difficulty?.toFixed(2) ?? "n/d"}</p>
      <a class="card-link" href="/questions/${question.id}">Ver detalhe e explicação</a>
    </article>`;
}

function renderHome() {
  const stats = state.stats;
  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">Ciências da Natureza · ENEM</p>
        <h1>Consulta, filtros e análise pedagógica de questões do ENEM</h1>
        <p>Aplicação web para organizar itens por ano, disciplina, competência, habilidade, dificuldade estimada e parâmetros TRI. A base inicial usa itens sintéticos para desenvolvimento e está preparada para receber microdados do INEP.</p>
        <div class="hero-actions"><a href="#busca">Explorar questões</a><a href="/analytics">Ver painel analítico</a></div>
      </div>
      <aside class="hero-panel">
        <strong>${stats.total}</strong><span>questões no recorte atual</span>
        <strong>${stats.indicators.averageDifficulty}</strong><span>dificuldade média estimada</span>
        <strong>${stats.indicators.triCoverage}%</strong><span>cobertura de TRI</span>
      </aside>
    </section>
    <section class="access-note">
      <strong>Abrindo no iPad?</strong> Use o endereço de rede exibido pelo terminal, como <code>http://192.168.x.x:3000</code>. Se um link antigo parar, rode <code>npm run ipad:link</code> ou abra <a class="text-link" href="/access">Acesso iPad</a> no computador para copiar o link atual.
    </section>
    <section id="busca" class="content-grid">
      <div><h2>Filtros principais</h2><p class="muted">Combine critérios para localizar itens e preparar listas de estudo ou diagnóstico.</p>${renderFilterForm()}</div>
      <div>
        <div class="section-heading"><div><h2>Questões encontradas</h2><p class="muted">${state.questions.length} resultado(s)</p></div><a class="text-link" href="/api/questions">JSON da API</a></div>
        <div class="question-list">${state.questions.length ? state.questions.map(questionCard).join("") : '<p class="empty">Nenhuma questão encontrada para os filtros.</p>'}</div>
      </div>
    </section>`;
}

function renderBars(title, data, suffix = "") {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...entries.map(([, value]) => value), 1);
  return `
    <section class="chart-card"><h3>${title}</h3><div class="bars">
      ${entries.map(([label, value]) => `
        <div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track" aria-label="${escapeHtml(label)}: ${value}${suffix}"><div class="bar-fill" style="width:${(value / max) * 100}%"></div></div><strong>${value}${suffix}</strong></div>
      `).join("")}
    </div></section>`;
}

function renderAnalytics() {
  const stats = state.stats;
  app.innerHTML = `
    <section class="analytics-page">
      <div class="section-heading"><div><p class="eyebrow">Painel analítico</p><h1>Indicadores de Ciências da Natureza</h1><p class="muted">Distribuições por competência, habilidade, ano e indicadores TRI para apoiar análise curricular.</p></div><a class="text-link" href="/api/stats">JSON de estatísticas</a></div>
      <div class="kpi-grid">
        <div class="kpi-card"><span>Total de questões</span><strong>${stats.total}</strong></div>
        <div class="kpi-card"><span>Dificuldade média</span><strong>${stats.indicators.averageDifficulty}/100</strong></div>
        <div class="kpi-card"><span>Dificuldade TRI média (b)</span><strong>${stats.indicators.averageTriDifficulty}</strong></div>
        <div class="kpi-card"><span>Discriminação média (a)</span><strong>${stats.indicators.averageDiscrimination}</strong></div>
      </div>
      <div class="charts-grid">
        ${renderBars("Distribuição por competência", stats.byCompetence)}
        ${renderBars("Distribuição por habilidade", stats.bySkill)}
        ${renderBars("Evolução por ano", stats.byYear)}
        ${renderBars("Questões por disciplina", stats.byDiscipline)}
        ${renderBars("Dificuldade média por habilidade", stats.averageDifficultyBySkill, "/100")}
      </div>
    </section>`;
}

async function renderDetail(id) {
  const { question } = await fetchJson(`/api/questions/${id}`);
  app.innerHTML = `
    <article class="detail-page">
      <a href="/" class="text-link">← Voltar para busca</a>
      <div class="detail-header"><p class="eyebrow">${question.area}</p><h1>${question.discipline} · ENEM ${question.year}</h1><div class="card-meta"><span>${question.competence}</span><span>${question.skill}</span><span>Dificuldade ${question.estimatedDifficulty}</span><span>Score ${question.difficultyScore}/100</span></div></div>
      <section class="detail-card"><h2>Enunciado</h2><p>${escapeHtml(question.statement)}</p><ol class="alternatives">${question.alternatives.map((alternative) => `<li class="${alternative.letter === question.answerKey ? "correct" : ""}"><strong>${alternative.letter}</strong> ${escapeHtml(alternative.text)}</li>`).join("")}</ol></section>
      <section class="detail-grid">
        <div class="detail-card"><h2>Metadados pedagógicos</h2><dl><dt>Competência</dt><dd>${question.competence}</dd><dt>Habilidade</dt><dd>${question.skill}</dd><dt>Gabarito</dt><dd>${question.answerKey}</dd><dt>Explicação</dt><dd>${escapeHtml(question.pedagogicalExplanation ?? "Ainda não cadastrada.")}</dd></dl></div>
        <div class="detail-card"><h2>TRI e INEP</h2><dl><dt>Discriminação (a)</dt><dd>${question.tri.discrimination ?? "n/d"}</dd><dt>Dificuldade TRI (b)</dt><dd>${question.tri.difficulty ?? "n/d"}</dd><dt>Acerto casual (c)</dt><dd>${question.tri.guessing ?? "n/d"}</dd><dt>Arquivo</dt><dd>${question.inepMetadata.microdataFile}</dd><dt>Código do item</dt><dd>${question.inepMetadata.itemCode}</dd><dt>Fonte</dt><dd>${escapeHtml(question.inepMetadata.source)}</dd></dl></div>
      </section>
    </article>`;
}

async function router() {
  try {
    if (window.location.pathname.startsWith("/questions/")) {
      await renderDetail(window.location.pathname.replace("/questions/", ""));
      return;
    }
    await loadBaseData();
    if (window.location.pathname === "/analytics") renderAnalytics();
    else renderHome();
  } catch (error) {
    app.innerHTML = `<section class="empty"><h1>Erro ao carregar</h1><p>${escapeHtml(error.message)}</p></section>`;
  }
}

router();

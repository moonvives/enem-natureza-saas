import { questions } from "../data/questions.js";

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function getFilterOptions() {
  return {
    years: [...new Set(questions.map((question) => question.year))].sort((a, b) => b - a),
    disciplines: [...new Set(questions.map((question) => question.discipline))].sort(),
    competences: [...new Set(questions.map((question) => question.competence))].sort(),
    skills: [...new Set(questions.map((question) => question.skill))].sort(),
    difficulties: [...new Set(questions.map((question) => question.estimatedDifficulty))].sort()
  };
}

export function filterQuestions(filters = {}) {
  const keyword = filters.q ? normalize(filters.q) : "";
  const triMin = filters.triMin ? Number(filters.triMin) : undefined;
  const triMax = filters.triMax ? Number(filters.triMax) : undefined;

  return questions.filter((question) => {
    const haystack = normalize(
      [
        question.statement,
        question.discipline,
        question.competence,
        question.skill,
        question.estimatedDifficulty,
        ...question.keywords,
        ...question.alternatives.map((alternative) => alternative.text)
      ].join(" ")
    );

    return (
      (!filters.year || question.year === Number(filters.year)) &&
      (!filters.discipline || question.discipline === filters.discipline) &&
      (!filters.competence || question.competence === filters.competence) &&
      (!filters.skill || question.skill === filters.skill) &&
      (!filters.difficulty || question.estimatedDifficulty === filters.difficulty) &&
      (!keyword || haystack.includes(keyword)) &&
      (triMin === undefined || question.difficultyScore >= triMin) &&
      (triMax === undefined || question.difficultyScore <= triMax)
    );
  });
}

function countBy(items, selector) {
  return items.reduce((accumulator, question) => {
    const key = String(selector(question));
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function averageBy(items, selector) {
  const grouped = items.reduce((accumulator, question) => {
    const key = selector(question);
    accumulator[key] = accumulator[key] ?? { total: 0, count: 0 };
    accumulator[key].total += question.difficultyScore;
    accumulator[key].count += 1;
    return accumulator;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [key, Number((value.total / value.count).toFixed(1))])
  );
}

export function getQuestionById(id) {
  return questions.find((question) => question.id === id);
}

export function getStats(items = questions) {
  const triItems = items.filter((question) => question.tri.difficulty !== undefined);
  const averageDifficulty = items.length
    ? Number((items.reduce((sum, question) => sum + question.difficultyScore, 0) / items.length).toFixed(1))
    : 0;
  const averageTriDifficulty = triItems.length
    ? Number((triItems.reduce((sum, question) => sum + (question.tri.difficulty ?? 0), 0) / triItems.length).toFixed(2))
    : 0;
  const averageDiscrimination = triItems.length
    ? Number((triItems.reduce((sum, question) => sum + (question.tri.discrimination ?? 0), 0) / triItems.length).toFixed(2))
    : 0;

  return {
    total: items.length,
    byCompetence: countBy(items, (question) => question.competence),
    bySkill: countBy(items, (question) => question.skill),
    byYear: countBy(items, (question) => question.year),
    byDiscipline: countBy(items, (question) => question.discipline),
    averageDifficultyBySkill: averageBy(items, (question) => question.skill),
    indicators: {
      averageDifficulty,
      averageTriDifficulty,
      averageDiscrimination,
      triCoverage: items.length ? Number(((triItems.length / items.length) * 100).toFixed(1)) : 0
    }
  };
}

export const questions = [
  {
    id: "enem-2023-cn-bio-ecosistemas",
    year: 2023,
    area: "Ciências da Natureza",
    discipline: "Biologia",
    competence: "Competência 8",
    skill: "Habilidade 28",
    tri: { discrimination: 1.21, difficulty: 0.68, guessing: 0.18, source: "Estimado" },
    estimatedDifficulty: "Média",
    difficultyScore: 61,
    statement:
      "Em uma área de restauração ecológica, a introdução de espécies pioneiras aumenta a cobertura vegetal e modifica o microclima. Qual efeito esperado favorece a sucessão ecológica?",
    alternatives: [
      { letter: "A", text: "Redução permanente da ciclagem de nutrientes." },
      { letter: "B", text: "Aumento de sombreamento e retenção de umidade no solo." },
      { letter: "C", text: "Eliminação imediata de todos os consumidores primários." },
      { letter: "D", text: "Diminuição da diversidade genética das populações locais." },
      { letter: "E", text: "Bloqueio da chegada de sementes por dispersores." }
    ],
    answerKey: "B",
    inepMetadata: {
      source: "Exemplo sintético inspirado na matriz de referência do ENEM; substitua pelo item oficial ao carregar microdados.",
      microdataFile: "MICRODADOS_ENEM_2023.zip",
      itemCode: "CN-SINT-2023-001",
      color: "Azul",
      position: 91
    },
    pedagogicalExplanation:
      "Espécies pioneiras alteram condições ambientais, como luminosidade, temperatura e umidade, permitindo o estabelecimento de espécies mais exigentes nas etapas seguintes da sucessão.",
    keywords: ["ecologia", "sucessão ecológica", "restauração", "ecossistemas"]
  },
  {
    id: "enem-2022-cn-fis-energia",
    year: 2022,
    area: "Ciências da Natureza",
    discipline: "Física",
    competence: "Competência 6",
    skill: "Habilidade 21",
    tri: { discrimination: 1.08, difficulty: 0.35, guessing: 0.2, source: "Estimado" },
    estimatedDifficulty: "Média",
    difficultyScore: 56,
    statement:
      "Um aquecedor elétrico transforma energia elétrica em energia térmica para aquecer água. Mantida a potência, o que ocorre com o tempo necessário para aquecer o dobro da massa de água no mesmo intervalo de temperatura?",
    alternatives: [
      { letter: "A", text: "Cai à metade." },
      { letter: "B", text: "Permanece igual." },
      { letter: "C", text: "Dobra." },
      { letter: "D", text: "Quadruplica." },
      { letter: "E", text: "Torna-se nulo pela conservação de energia." }
    ],
    answerKey: "C",
    inepMetadata: {
      source: "Exemplo sintético para desenvolvimento da aplicação.",
      microdataFile: "MICRODADOS_ENEM_2022.zip",
      itemCode: "CN-SINT-2022-002",
      color: "Amarela",
      position: 104
    },
    pedagogicalExplanation:
      "A energia térmica requerida é Q = m · c · ΔT. Com a mesma potência, dobrar a massa dobra a energia necessária e, portanto, dobra o tempo.",
    keywords: ["calorimetria", "potência", "energia", "termodinâmica"]
  },
  {
    id: "enem-2021-cn-qui-estequiometria",
    year: 2021,
    area: "Ciências da Natureza",
    discipline: "Química",
    competence: "Competência 7",
    skill: "Habilidade 24",
    tri: { discrimination: 1.34, difficulty: 1.05, guessing: 0.16, source: "Estimado" },
    estimatedDifficulty: "Alta",
    difficultyScore: 78,
    statement:
      "Na neutralização completa entre ácido clorídrico e hidróxido de sódio, volumes iguais de soluções são misturados. Se a concentração do ácido é o dobro da base, qual característica da mistura final é esperada?",
    alternatives: [
      { letter: "A", text: "Excesso de íons H+ e caráter ácido." },
      { letter: "B", text: "Excesso de íons OH− e caráter básico." },
      { letter: "C", text: "pH exatamente neutro em qualquer temperatura." },
      { letter: "D", text: "Formação de gás hidrogênio como produto principal." },
      { letter: "E", text: "Ausência de sais dissolvidos na solução." }
    ],
    answerKey: "A",
    inepMetadata: {
      source: "Exemplo sintético para desenvolvimento da aplicação.",
      microdataFile: "MICRODADOS_ENEM_2021.zip",
      itemCode: "CN-SINT-2021-003",
      color: "Cinza",
      position: 118
    },
    pedagogicalExplanation:
      "A reação HCl + NaOH → NaCl + H₂O ocorre em proporção 1:1. Com volumes iguais e ácido duas vezes mais concentrado, sobra ácido após consumir a base.",
    keywords: ["estequiometria", "neutralização", "pH", "soluções"]
  },
  {
    id: "enem-2020-cn-bio-genetica",
    year: 2020,
    area: "Ciências da Natureza",
    discipline: "Biologia",
    competence: "Competência 4",
    skill: "Habilidade 13",
    tri: { discrimination: 0.96, difficulty: -0.12, guessing: 0.22, source: "Estimado" },
    estimatedDifficulty: "Baixa",
    difficultyScore: 42,
    statement:
      "Em uma característica autossômica recessiva, pais fenotipicamente normais têm um filho afetado. Qual genótipo dos pais é compatível com essa situação?",
    alternatives: [
      { letter: "A", text: "Ambos homozigotos dominantes." },
      { letter: "B", text: "Um homozigoto dominante e outro recessivo." },
      { letter: "C", text: "Ambos heterozigotos." },
      { letter: "D", text: "Ambos homozigotos recessivos." },
      { letter: "E", text: "Um heterozigoto e outro homozigoto dominante." }
    ],
    answerKey: "C",
    inepMetadata: {
      source: "Exemplo sintético para desenvolvimento da aplicação.",
      microdataFile: "MICRODADOS_ENEM_2020.zip",
      itemCode: "CN-SINT-2020-004",
      color: "Rosa",
      position: 93
    },
    pedagogicalExplanation:
      "Pais sem o fenótipo recessivo podem ser portadores Aa. O cruzamento Aa × Aa permite descendente aa, afetado pela característica recessiva.",
    keywords: ["genética", "herança recessiva", "probabilidade"]
  },
  {
    id: "enem-2019-cn-fis-cinematica",
    year: 2019,
    area: "Ciências da Natureza",
    discipline: "Física",
    competence: "Competência 5",
    skill: "Habilidade 17",
    tri: { discrimination: 0.88, difficulty: -0.44, guessing: 0.24, source: "Estimado" },
    estimatedDifficulty: "Baixa",
    difficultyScore: 38,
    statement:
      "Um veículo desloca-se em linha reta com velocidade constante. Em um intervalo de tempo duas vezes maior, a distância percorrida será:",
    alternatives: [
      { letter: "A", text: "A mesma." },
      { letter: "B", text: "Metade da inicial." },
      { letter: "C", text: "Duas vezes a inicial." },
      { letter: "D", text: "Quatro vezes a inicial." },
      { letter: "E", text: "Independente da velocidade." }
    ],
    answerKey: "C",
    inepMetadata: {
      source: "Exemplo sintético para desenvolvimento da aplicação.",
      microdataFile: "MICRODADOS_ENEM_2019.zip",
      itemCode: "CN-SINT-2019-005",
      color: "Azul",
      position: 100
    },
    pedagogicalExplanation:
      "No movimento uniforme, Δs = v · Δt. Se v é constante e o tempo dobra, o deslocamento também dobra.",
    keywords: ["cinemática", "movimento uniforme", "velocidade"]
  },
  {
    id: "enem-2018-cn-qui-ligacoes",
    year: 2018,
    area: "Ciências da Natureza",
    discipline: "Química",
    competence: "Competência 7",
    skill: "Habilidade 25",
    tri: { discrimination: 1.42, difficulty: 1.22, guessing: 0.14, source: "Estimado" },
    estimatedDifficulty: "Alta",
    difficultyScore: 82,
    statement:
      "A elevada temperatura de fusão de um composto formado por metal alcalino e halogênio está associada principalmente a qual tipo de interação?",
    alternatives: [
      { letter: "A", text: "Ligação covalente apolar entre moléculas isoladas." },
      { letter: "B", text: "Interação iônica em rede cristalina." },
      { letter: "C", text: "Forças de London entre átomos neutros." },
      { letter: "D", text: "Ponte de hidrogênio intramolecular." },
      { letter: "E", text: "Ligação metálica entre halogênios." }
    ],
    answerKey: "B",
    inepMetadata: {
      source: "Exemplo sintético para desenvolvimento da aplicação.",
      microdataFile: "MICRODADOS_ENEM_2018.zip",
      itemCode: "CN-SINT-2018-006",
      color: "Branca",
      position: 124
    },
    pedagogicalExplanation:
      "Sais formados por metais alcalinos e halogênios organizam íons em redes cristalinas. A atração eletrostática intensa explica altos pontos de fusão.",
    keywords: ["ligações químicas", "compostos iônicos", "rede cristalina"]
  }
];

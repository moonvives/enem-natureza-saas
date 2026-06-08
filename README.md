# ENEM Natureza Analytics

Aplicação web para consulta, filtragem e análise de questões de **Ciências da Natureza do ENEM**. O projeto organiza itens por ano, disciplina, competência, habilidade, dificuldade estimada e parâmetros TRI, oferecendo páginas de busca, detalhe da questão, painel analítico e endpoints JSON.

> A base incluída neste repositório contém itens sintéticos/parafraseados para desenvolvimento. Ao carregar microdados oficiais, respeite as regras do INEP e não publique enunciados oficiais quando isso violar direitos autorais ou termos de uso.

## Funcionalidades

- Página inicial com explicação do projeto, KPIs e filtros principais.
- Busca por ano, disciplina, competência, habilidade, dificuldade, faixa de score TRI e palavra-chave.
- Página de detalhe com enunciado, alternativas, gabarito, competência, habilidade, dificuldade, metadados INEP e explicação pedagógica.
- Painel analítico com distribuição por competência, habilidade, disciplina e ano, além de dificuldade média por habilidade e indicadores TRI.
- API local para consulta de questões e estatísticas.

## Como rodar

```bash
npm run dev
```

Acesse:

- Interface web: <http://localhost:3000>
- Painel analítico: <http://localhost:3000/analytics>
- API de questões: <http://localhost:3000/api/questions>
- API de estatísticas: <http://localhost:3000/api/stats>

Comandos úteis:

```bash
npm run check
npm start
```

## Modelo de dados esperado

Os itens ficam em `src/data/questions.js` e seguem o modelo lógico abaixo:

```ts
interface EnemNatureQuestion {
  id: string;
  year: number;
  area: "Ciências da Natureza";
  discipline: "Biologia" | "Física" | "Química";
  competence: string;
  skill: string;
  tri: {
    discrimination?: number; // parâmetro a
    difficulty?: number; // parâmetro b
    guessing?: number; // parâmetro c
    source: "Microdados INEP" | "Estimado" | "Não disponível";
  };
  estimatedDifficulty: "Baixa" | "Média" | "Alta";
  difficultyScore: number; // escala interna 0-100 para filtros e gráficos
  statement: string;
  alternatives: Array<{ letter: "A" | "B" | "C" | "D" | "E"; text: string }>;
  answerKey: "A" | "B" | "C" | "D" | "E";
  inepMetadata: {
    source: string;
    microdataFile: string;
    itemCode?: string;
    color?: string;
    position?: number;
  };
  pedagogicalExplanation?: string;
  keywords: string[];
}
```

## Endpoints

### `GET /api/questions`

Retorna questões filtradas. Parâmetros aceitos:

- `year`
- `discipline`
- `competence`
- `skill`
- `difficulty`
- `q`
- `triMin`
- `triMax`

Exemplo:

```bash
curl "http://localhost:3000/api/questions?discipline=Biologia&q=ecologia"
```

### `GET /api/stats`

Retorna agregações usando os mesmos filtros da API de questões:

- total de questões;
- distribuição por competência;
- distribuição por habilidade;
- evolução por ano;
- distribuição por disciplina;
- dificuldade média por habilidade;
- dificuldade média, dificuldade TRI média, discriminação média e cobertura TRI.

Exemplo:

```bash
curl "http://localhost:3000/api/stats?year=2023"
```

## Como carregar microdados do INEP

1. Baixe os microdados do ENEM no portal oficial do INEP.
2. Descompacte o arquivo localmente, mantendo o nome do pacote em `inepMetadata.microdataFile`.
3. Identifique os campos de prova, cor, posição do item, código do item, área do conhecimento, habilidade e gabarito nos arquivos disponibilizados.
4. Converta os registros de Ciências da Natureza para o modelo `EnemNatureQuestion`.
5. Quando parâmetros TRI oficiais estiverem disponíveis, preencha `tri.discrimination`, `tri.difficulty`, `tri.guessing` e use `tri.source = "Microdados INEP"`.
6. Quando não houver TRI oficial por item, use `tri.source = "Estimado"` ou `"Não disponível"` e documente a metodologia de estimação.
7. Gere ou revise `keywords` para melhorar a busca textual.
8. Substitua ou complemente os dados em `src/data/questions.js`, ou adapte a camada em `src/lib/questions.js` para ler de banco local/arquivo externo.

## Limitações e direitos autorais

- O repositório não inclui microdados oficiais nem enunciados oficiais completos do ENEM.
- Questões oficiais podem estar protegidas por direitos autorais e por condições de uso do INEP; valide permissões antes de republicar conteúdo.
- Os parâmetros TRI da base inicial são estimativas fictícias para demonstrar a interface e as agregações.
- A escala `difficultyScore` é uma escala interna de 0 a 100; ela não substitui a proficiência ENEM nem a calibração oficial da TRI.
- Para uso pedagógico em produção, recomenda-se auditar metadados, gabaritos, competências, habilidades e explicações com especialistas.

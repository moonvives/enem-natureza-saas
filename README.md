# ENEM Natureza Analytics

Aplicação web para consulta, filtragem e análise de questões de **Ciências da Natureza do ENEM**. O projeto organiza itens por ano, disciplina, competência, habilidade, dificuldade estimada e parâmetros TRI, oferecendo páginas de busca, detalhe da questão, painel analítico e endpoints JSON.

> A base incluída neste repositório contém itens sintéticos/parafraseados para desenvolvimento. Ao carregar microdados oficiais, respeite as regras do INEP e não publique enunciados oficiais quando isso violar direitos autorais ou termos de uso.

## Funcionalidades

- Página inicial renderizada pelo servidor com explicação do projeto, KPIs e filtros principais, funcionando mesmo antes do JavaScript do navegador carregar.
- Busca por ano, disciplina, competência, habilidade, dificuldade, faixa de score TRI e palavra-chave.
- Página de detalhe com enunciado, alternativas, gabarito, competência, habilidade, dificuldade, metadados INEP e explicação pedagógica.
- Painel analítico com distribuição por competência, habilidade, disciplina e ano, além de dificuldade média por habilidade e indicadores TRI.
- API local para consulta de questões e estatísticas.

## Como rodar

```bash
npm run dev
```

> Importante: abra o endereço mostrado no terminal. No computador, use `http://localhost:3000`. Em um iPad, iPhone ou outro dispositivo na mesma rede Wi-Fi, **não use `localhost`**; use o endereço de rede que o terminal imprime, por exemplo `http://192.168.0.10:3000`. Abrir o arquivo `public/index.html` diretamente no navegador não inicializa as rotas nem a API.

Acesse:

- Interface web: <http://localhost:3000>
- Painel analítico: <http://localhost:3000/analytics>
- Página para copiar o link do iPad: <http://localhost:3000/access>
- Detalhe de questão: <http://localhost:3000/questions/enem-2023-cn-bio-ecosistemas>
- API de questões: <http://localhost:3000/api/questions>
- API de estatísticas: <http://localhost:3000/api/stats>

### Acessar pelo iPad Pro, iPhone ou outro dispositivo

1. Rode `npm run dev` no computador onde está o repositório.
2. Confirme que o iPad e o computador estão na mesma rede Wi-Fi.
3. Abra `http://localhost:3000/access` no computador para ver os links, ou copie no Safari do iPad uma das URLs exibidas em `No iPad/celular na mesma rede Wi-Fi`, por exemplo `http://192.168.0.10:3000`.
4. Se um link antigo parar, rode `npm run ipad:link` ou reabra `http://localhost:3000/access`; o IP pode mudar quando Wi-Fi, VPN, Docker/WSL ou o computador reiniciar.
5. Se não abrir, confira se firewall/VPN do computador permite conexões de entrada na porta `3000`.
6. Se você iniciou o servidor com `HOST=localhost` ou `HOST=127.0.0.1`, pare o processo e use `npm run dev:lan`.

Comandos úteis:

```bash
npm run check
npm run ipad:link
npm run dev:lan
npm start
```


### Estou só com iPad, sem PC: como abrir?

Os links `localhost` e `http://172.x.x.x:3000` só funcionam enquanto existe um computador/ambiente rodando o servidor. Se você está apenas com o iPad, precisa abrir o projeto em um serviço na nuvem:

**Opção rápida: Replit pelo iPad**

1. No Safari do iPad, abra o Replit e importe este repositório do GitHub.
2. O arquivo `.replit` já está configurado para rodar `npm run dev`.
3. Toque em **Run** e use a URL pública/preview que o Replit mostrar.

**Opção para deixar publicado: Render**

1. No Safari do iPad, abra o Render e crie um **Blueprint** a partir deste repositório.
2. O arquivo `render.yaml` já configura build com `npm install` e start com `npm start`.
3. Ao finalizar o deploy, use a URL pública gerada pelo Render, por exemplo `https://enem-natureza-saas.onrender.com`.

> Sem PC e sem um deploy em nuvem, não há como manter `http://172.x.x.x:3000` funcionando, porque esse endereço era do ambiente local que estava executando o servidor.

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

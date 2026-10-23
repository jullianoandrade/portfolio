import type { Conteudo } from "./tipos";

/**
 * English content.
 *
 * Satisfies the same `Conteudo` contract as `pt.ts`. If one locale gains a
 * field the other lacks, the build fails — a half-translated page never
 * reaches production.
 */
export const en: Conteudo = {
  idioma: "en",

  perfil: {
    nome: "Juliano Andrade",
    titulo: "AI Engineer",
    localizacao: "Gravataí, RS · Brazil",
    disponibilidade: "Open to opportunities · on-site in Porto Alegre or remote",
    arco: [
      "I joined Grupo Studio as the company's first automation engineer. There was no team, no process and no tooling — just spreadsheets, government portals and a lot of people repeating the same task.",
      "I built the practice from zero: picked the tools, defined how a bot reaches production and how it reports its own failures, and trained the people who came after me. That is why my range is wide — I was the only one, so everything crossed my desk.",
      "Today I design AI systems that survive production: agents that talk to real customers, retrieval over proprietary data, automated evaluation running in CI. The domain has changed several times — retail, legal, payroll, consumer. The problem never does: turn manual work into a system you can trust.",
    ],
    trajetoria: [
      {
        periodo: "2024 — present",
        cargo: "AI & Automation Engineer",
        organizacao: "Grupo Studio",
        descricao:
          "First automation engineer at the company. Built the practice, and today I build agents and AI systems while mentoring the team.",
      },
      {
        periodo: "2023 — present",
        cargo: "BSc Computer Science",
        organizacao: "Unisinos",
        descricao: "In progress.",
      },
    ],
    email: "juliano.andrade.cs@gmail.com",
    linkedin: "https://www.linkedin.com/in/jullianoandrade/",
    github: "https://github.com/jullianoandrade",
  },

  interface: {
    navegacao: {
      sobre: "About",
      capacidades: "Capabilities",
      casos: "Case studies",
      contato: "Contact",
    },
    heroChamada: "I build AI systems that survive production.",
    heroSubtitulo:
      "Agents, retrieval over proprietary data and automated evaluation — across retail, legal, payroll and consumer products. I joined a company with no automation practice and built one from zero.",
    verCaso: "Read the case",
    voltar: "All case studies",
    rotulos: {
      papel: "My role",
      problema: "The problem",
      restricoes: "The real constraints",
      arquitetura: "Architecture",
      decisoes: "Decisions and what they cost",
      resultado: "Outcome",
      aprendizado: "What I took from it",
      stack: "Stack",
      dominio: "Domain",
      periodo: "Period",
      escolha: "Chose",
      descartado: "Rejected",
      custo: "Cost",
    },
    notaConfidencialidade:
      "This case describes architecture and decisions without exposing proprietary code, credentials, clients or operational data.",
    papel: {
      solo: "My project",
      time: "In a team",
      timeCom: (pessoas) => `In a team of ${pessoas}`,
    },
    trocarIdioma: "Português",
  },

  capacidades: [
    {
      id: "agentes",
      titulo: "Agents and orchestration",
      descricao:
        "A long conversation does not fit in a prompt. I model the flow as a typed state graph, with explicit routing, memory persisted outside the process, and a path out to a human.",
      casos: ["agente-conversacional"],
    },
    {
      id: "recuperacao",
      titulo: "Retrieval and context",
      descricao:
        "RAG when the question is conceptual, a deterministic catalogue when the answer must be exact. Knowing which one applies is half the work.",
      casos: ["agente-conversacional"],
    },
    {
      id: "confiabilidade",
      titulo: "Reliability and privacy",
      descricao:
        "A model nobody measures regresses quietly, and personal data that enters a prompt does not come back. Automated evaluation with binary exit codes for CI, guardrails that check the output, and masking before inference instead of trust in a vendor policy.",
      casos: ["agente-conversacional", "laudo-enquadramento", "contratos-bancarios"],
    },
    {
      id: "produto",
      titulo: "From prototype to product",
      descricao:
        "The distance between a demo and production is made of rate limits, retries, cost per call and what happens when someone else's API goes down. That is where most of my time goes.",
      casos: ["agente-conversacional", "economize-milhas", "laudo-enquadramento"],
    },
    {
      id: "dados",
      titulo: "Data at scale",
      descricao:
        "When volume grows, the win rarely comes from optimising the code that exists — it comes from changing the shape the data is read in, and from cutting work that never needed to happen.",
      casos: ["ingestao-em-escala"],
    },
  ],

  casos: [
    {
      slug: "agente-conversacional",
      titulo: "A WhatsApp agent that knows when to call a human",
      resumo:
        "Consultative support over WhatsApp: understands the need, recommends from a proprietary catalogue, answers conceptual questions through retrieval, and hands off to a specialist with a structured brief.",
      dominio: "Retail",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "From graph design to deploy, including the guardrails and the evaluation suite.",
      },
      destaque: true,
      confidencial: true,
      metricas: [
        {
          valor: "3",
          rotulo: "clients in production on the same architecture",
          periodo: "2026",
          base: "tuned per operation, not rewritten",
        },
        { valor: "14", rotulo: "evaluation scenarios running in CI", periodo: "since Jun 2026" },
        { valor: "9", rotulo: "nodes in the conversation graph", periodo: "current architecture" },
      ],
      problema:
        "Consultative support over WhatsApp breaks the naive message → model → reply loop. People write in bursts, the channel redelivers the event if you are slow, and the conversation has to remember yesterday. Any one of the three, on its own, produces support that feels broken.",
      restricoes: [
        "People send three messages in eight seconds. That is one thought — replying to each produces three disjointed answers.",
        "The webhook cannot wait for the model. If the reply is slow, the WhatsApp API redelivers the event and the conversation duplicates.",
        "The conversation is long and has to remember. State does not fit in a prompt and cannot live in process memory, which dies on the first redeploy.",
        "The agent must not invent a price or promise a delivery date. In consultative sales, getting that wrong costs more than not answering.",
      ],
      arquitetura: {
        diagramaId: "agente",
        legenda:
          "Dashed lines are conditional routes. The guard runs after composition, not inside the prompt.",
        nos: {
          carregar: {
            rotulo: "load",
            descricao:
              "Hydrates state from the Postgres checkpointer and the accumulated memory.",
          },
          entender: {
            rotulo: "understand",
            descricao:
              "Extracts intent, entities and what is still unknown about the person on the other side.",
          },
          decidir: {
            rotulo: "route",
            descricao: "Decides: keep talking, book a slot, or hand off to a human.",
          },
          recuperar: {
            rotulo: "retrieve",
            descricao:
              "Resolves the canonical catalogue and, for conceptual questions, queries the vector index.",
          },
          agendar: {
            rotulo: "schedule",
            descricao: "Talks to the real calendar and returns slots that actually exist.",
          },
          compor: {
            rotulo: "compose",
            descricao: "Writes the reply using only the context that was retrieved.",
          },
          guard: {
            rotulo: "guard",
            descricao:
              "Output barrier: no invented prices, no promised dates, nothing outside the catalogue. Runs on the finished text.",
          },
          persistir: {
            rotulo: "persist",
            descricao: "Stores memory and accumulated understanding for the next turn.",
          },
          handoff: {
            rotulo: "handoff",
            descricao: "Builds the structured brief and delivers it to the human specialist.",
          },
        },
      },
      decisoes: [
        {
          titulo: "The guard runs after composition, not inside the prompt",
          escolha:
            "Check the finished text against explicit rules, as the last step before persisting.",
          descartado:
            "Trusting a prompt instruction to stop the model inventing prices and dates.",
          custo:
            "One extra pass per reply and a rule set to maintain. In exchange, the failure mode stops being probabilistic: asking in the prompt reduces the chance, checking the output removes the case.",
        },
        {
          titulo: "Typed state instead of a loose dictionary",
          escolha: "An explicit contract between graph nodes, checkable before anything runs.",
          descartado: "Passing a free-form dictionary from node to node, which is faster to write.",
          custo:
            "More ceremony to add a field. In exchange, renaming something breaks at import time rather than at two in the morning in production.",
        },
        {
          titulo: "Two engines, selected by environment variable",
          escolha:
            "Keep the old imperative orchestrator alive next to the new graph, switchable without a redeploy.",
          descartado: "Migrating in one go and deleting the old path.",
          custo:
            "Duplicated code and two implementations to maintain during the transition. In exchange, rollback is an environment variable rather than a long night.",
        },
        {
          titulo: "Phone numbers pseudonymised before leaving the process",
          escolha: "Salted hash applied before any log line or observability trace.",
          descartado: "Logging the raw number, which is easier to debug when something breaks.",
          custo:
            "Debugging a specific case means recomputing the hash. In exchange, no trace hands back anyone's phone number.",
        },
      ],
      resultado: [
        "The agent carries the whole conversation, recommends from the catalogue and hands the specialist a structured brief instead of a raw transcript.",
        "Automated evaluation runs with a model as judge and returns a binary exit code, so it sits in CI like any other test. The scenarios cover what actually hurts: invented prices, promised dates, answers outside the catalogue, and losing the thread between turns.",
        "Engine rollback without a redeploy throughout the migration to the graph.",
      ],
      aprendizado:
        "A guardrail inside the prompt is a request; a guardrail outside it is a guarantee. I started treating model output as untrusted input — the same posture everyone has towards user input, and which somehow gets dropped when the text comes from an LLM.",
      stack: [
        "Python",
        "FastAPI",
        "LangGraph",
        "PostgreSQL",
        "pgvector",
        "OpenAI",
        "Langfuse",
        "Docker",
      ],
    },

    {
      slug: "economize-milhas",
      titulo: "Is this flight worth more in miles or in cash?",
      resumo:
        "The answer depends on who is asking: a fee-free card earns miles at almost no cost, buying points is expensive. The app computes it against each person's own cost per thousand miles.",
      dominio: "Consumer",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "My own product: idea, pricing model, interface, tests and deploy.",
      },
      destaque: false,
      confidencial: false,
      metricas: [
        { valor: "328", rotulo: "automated tests", periodo: "Oct 2026" },
        { valor: "100%", rotulo: "of the code open and auditable", periodo: "since the first commit" },
      ],
      problema:
        "Every miles comparator gives everyone the same answer, as if a mile had a universal price. It does not: the same flight at the same price flips its recommendation depending on what the traveller paid for their miles.",
      restricoes: [
        "The app has to work with no credentials. No key can be blocking, or whoever clones the repository sees an error screen.",
        "No server key in the browser bundle. The prefix that exposes a variable to the client is a one-letter trap.",
        "Affiliate monetisation has to be visible. An affiliate link without a disclosure badge is advertising in disguise.",
      ],
      decisoes: [
        {
          titulo: "The app runs fully with everything blank",
          escolha: "A curated dataset versioned alongside the code, used when no credentials exist.",
          descartado: "Requiring Supabase and an API token just to boot.",
          custo:
            "Keeping a fallback dataset current. In exchange, anyone clones and runs it with one command — including whoever is reviewing the code.",
        },
        {
          titulo: "The palette is measured, not declared",
          escolha:
            "An automated test reads the CSS and verifies WCAG AA contrast on the real colour pairs.",
          descartado: "Trusting visual inspection and good intentions.",
          custo:
            "One more test to maintain. In exchange, accessibility stops depending on someone remembering.",
        },
      ],
      resultado: [
        "Live, open and clickable — the only project on this page whose code you can read end to end.",
        "328 tests, from the cost-per-mile calculation to the engine's public surface: every exposed field either appears on a screen or sits on a gap list with the reason written down.",
        "Installable as a PWA, one codebase for desktop and mobile — CSS decides the layout, not JavaScript measuring the viewport.",
      ],
      aprendizado:
        "Writing the test that checks colour contrast convinced me of something: a standard you cannot execute is not a standard, it is an intention. I have taken that into every project since.",
      stack: ["Next.js", "TypeScript", "React", "Tailwind", "Supabase", "Vitest", "Vercel"],
      links: [
        { rotulo: "View live", url: "https://economizemilhas.vercel.app" },
        { rotulo: "Source", url: "https://github.com/jullianoandrade/economize_milhas" },
      ],
    },

    {
      slug: "laudo-enquadramento",
      titulo: "A preliminary technical opinion drafted by a language model",
      resumo:
        "A presenter walks a guided checklist with the company being assessed, and the system drafts a preliminary eligibility opinion for R&D projects, delivered as a PDF.",
      dominio: "R&D tax incentives",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "From the access gate to PDF generation, including the prompts that draft the opinion.",
      },
      destaque: false,
      confidencial: true,
      metricas: [
        { valor: "5", rotulo: "steps in the guided checklist", periodo: "current version" },
        { valor: "6", rotulo: "fixed sections in the generated opinion", periodo: "current version" },
      ],
      problema:
        "Assessing whether an R&D project qualifies for a tax incentive is specialist work, and the first draft burned hours of an expensive person producing something that would be reviewed anyway.",
      restricoes: [
        "The opinion is preliminary and has to say so. It goes to a qualified reviewer before any formal filing — printed in the footer of every page of the PDF.",
        "The API key must not reach the browser through any path in the code.",
        "The model must not invent missing data: anything absent has to surface explicitly as a gap.",
      ],
      decisoes: [
        {
          titulo: "One call per project, plus one for the conclusion",
          escolha:
            "Each project gets a complete, isolated analysis; the overall conclusion receives only a synthesis of each.",
          descartado: "Squeezing every project into a single prompt, which costs fewer calls.",
          custo:
            "More calls and more total latency. In exchange, projects do not compete for context, and the conclusion prompt does not grow without bound as a client adds projects.",
        },
        {
          titulo: "Errors travel as codes, not as messages",
          escolha: "An enumerated error type; the UI branches on the code and picks the wording.",
          descartado: "Forwarding whatever error message the provider returned.",
          custo:
            "Mapping every failure case. In exchange, provider error detail goes to the server log and never to the screen of someone sitting in front of a client.",
        },
      ],
      resultado: [
        "The draft that used to take specialist hours now appears during the meeting itself, and the specialist reviews instead of writes.",
        "No path in the code sends the API key to the browser: the route converts the provider stream into plain text, and switching providers touches one file.",
      ],
      aprendizado:
        "Generating a document with an LLM is easy; generating one a professional will sign is a different problem. The hard part was not the prompt — it was deciding what the system does when information is missing, and making sure it flags the gap instead of filling it.",
      stack: ["Next.js", "TypeScript", "React", "OpenAI", "pdfmake", "Vercel"],
    },

    {
      slug: "ingestao-em-escala",
      titulo: "Sixteen million rows running on an analyst's laptop",
      resumo:
        "A platform that reads compressed payroll-event archives, converts them to a columnar format and cross-references the events to calculate recoverable social security credits.",
      dominio: "Payroll data",
      periodo: "2026",
      papel: {
        tipo: "time",
        descricao:
          "I built the backend. The ingestion architecture that made large archives load quickly was decided, tested and implemented by me.",
      },
      destaque: false,
      confidencial: true,
      // Sem métrica até existir número que o autor possa garantir. Os que havia
      // aqui vinham da documentação de um colega, não de medição própria.
      metricas: [
        {
          valor: "16M+",
          rotulo: "rows cross-referenced in one run",
          periodo: "production scale",
          base: "what made that scale workable in a working day",
        },
      ],
      problema:
        "Calculating recoverable payroll credits means cross-referencing millions of events against each other — who the person is, what was paid, what was withheld — and auditing each result against the period's closing event. Done the obvious way, loading everything into memory row by row, the import drags badly enough to break the analyst’s working rhythm.",
      restricoes: [
        "Archives arrive compressed, with thousands of XML files inside a single package.",
        "The software runs on the analyst's machine, not on a cluster. The memory available is whatever a work laptop has.",
        "The cross-reference is not a simple join: an event has to be audited against a closing event that arrives separately.",
        "A long run with no progress signal is indistinguishable from a frozen one — and the analyst kills the process.",
      ],
      decisoes: [
        {
          titulo: "Columnar and out-of-core, instead of row by row",
          escolha:
            "Convert the events to Parquet and cross-reference them with DuckDB, which reads the columnar format straight off disk and processes more data than would fit in RAM.",
          descartado:
            "Loading the parsed events into an in-memory dataframe, which is the natural path in Python and works fine until real scale arrives.",
          custo:
            "One more conversion stage in the pipeline and an intermediate format to manage. In exchange, the cross-reference runs within a working session, on hardware the business already owns.",
        },
        {
          titulo: "Conversion is its own stage, and it persists",
          escolha:
            "Separate extraction and conversion from the calculation, writing the intermediate result to disk.",
          descartado:
            "Converting on demand on every run, which keeps the pipeline simpler.",
          custo:
            "Disk space, and the care of invalidating the intermediate when the input changes. In exchange, re-running the calculation — which is what an analyst does most — stops repeating the expensive part.",
        },
      ],
      resultado: [
        "Import stopped being the bottleneck: cross-referencing more than 16 million rows runs on office hardware, with no dedicated infrastructure.",
        "Re-running with different parameters does not start from scratch, because the conversion is already persisted.",
      ],
      aprendizado:
        "The gain did not come from optimising the code that existed — it came from changing the shape of the data before processing it. I now treat “what format will this be read in” as an architectural decision, not an implementation detail.",
      stack: ["Python", "FastAPI", "DuckDB", "Polars", "PyArrow", "Parquet", "React"],
    },


    {
      slug: "contratos-bancarios",
      titulo: "Finding abusive interest in loan contracts without showing the model who signed",
      resumo:
        "An architecture that extracts and analyses clauses in bank loan contracts to flag potentially abusive interest, with personal data masked before any inference runs.",
      dominio: "Finance",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao:
          "Responsible for building the architecture: extraction, analysis, and the masking layer that keeps personal data from reaching the model.",
      },
      destaque: false,
      confidencial: true,
      metricas: [],
      problema:
        "Deciding whether a loan contract charges more interest than it should is expensive reading: someone has to find the right clauses across dozens of pages and redo the maths. A language model is good at that — except the document is full of the signer's personal data.",
      restricoes: [
        "The contract carries names, tax IDs, addresses, account numbers and amounts. Sending whole pages to an external provider processes a third party's personal data with no need to.",
        "Brazilian data protection law does not ask for good intentions, it asks for minimisation: the model should receive only what the analysis cannot work without.",
        "The conclusion feeds a decision with financial consequences for the client. An answer nobody can check is not useful.",
      ],
      decisoes: [
        {
          titulo: "Masking happens before inference, not after",
          escolha:
            "Read the PDF locally, detect and replace personal data with stable placeholders, and only then call the model. The provider receives the structure and the financial figures; it never receives the person who signed. The substitution map stays inside the perimeter, so the human reviewer sees the document rehydrated.",
          descartado:
            "Sending the document as-is and relying on the provider's retention policy, which is the shortest path and what most teams do.",
          custo:
            "One more layer to build and maintain, plus the risk of masking too much and removing context the analysis needed. In exchange, personal data never leaves the perimeter — the guarantee stops depending on a vendor contract and becomes a property of the architecture.",
        },
        {
          titulo: "The model extracts, the code calculates",
          escolha:
            "The model finds and normalises the clauses — amount financed, term, instalment, fees — returning an object validated against a schema. The effective rate is recomputed by deterministic code from those fields.",
          descartado:
            "Asking the model to read the contract and answer directly whether the interest is abusive, which would settle everything in one call.",
          custo:
            "Two steps instead of one, and a schema to maintain as contracts with different structures appear. In exchange, the number is reproducible and defensible: calling interest abusive is arithmetic plus a threshold, and a plausible answer nobody can reproduce does not survive a challenge.",
        },
        {
          titulo: "Abusive against a public benchmark, not a hardcoded number",
          escolha:
            "Compare the recomputed rate against the published average for that credit product in the contract's period.",
          descartado: "Hardcoding a threshold and treating everything above it as abusive.",
          custo:
            "A dependency on an external source, and contracts whose product category is ambiguous. In exchange, the conclusion ships with its point of comparison — a verifiable claim rather than the system's opinion.",
        },
      ],
      resultado: [
        "Analysis that required reading every contract end to end became assisted: the specialist reviews instead of searching.",
        "Every extracted figure carries the clause it came from, so checking means reading an excerpt rather than the whole contract.",
        "No client personal data is sent to the model provider — the PDF is read and masked inside the perimeter before any call.",
      ],
      aprendizado:
        "Privacy handled as a pipeline stage is verifiable; privacy handled as a vendor clause is a promise. Building the masking into the architecture cost more up front and removed the conversation about trusting the provider entirely.",
      stack: ["Python", "FastAPI", "Mistral AI", "Presidio", "pdfplumber", "Pydantic"],
    },
  ],
};

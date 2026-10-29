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
    arco: [
      "I joined Grupo Studio as the company's first automation engineer. There was no team, no process and no tooling — just spreadsheets, government portals and a lot of people repeating the same task.",
      "I built the practice from zero: picked the tools, defined how a bot reaches production and how it reports its own failures, and trained the people who came after me. That is why my range is wide — I was the only one, so everything crossed my desk.",
      "Today I design AI systems that survive production: agents that talk to real customers, retrieval over proprietary data, automated evaluation running in CI. The domain has changed several times — retail, legal, payroll, consumer. The problem never does: turn manual work into a system you can trust.",
    ],
    trajetoria: [
      {
        periodo: "Nov 2025 — present",
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
      passei: "Where I've worked",
      casos: "What I built",
      time: "The team",
      contato: "Talk to me",
    },
    heroChamada: "I hear the bottleneck, see the system that doesn’t exist yet, and put it to work.",
    heroAmplitude: (sistemas, dominios) =>
      `${sistemas} systems across ${dominios.length} domains: ${new Intl.ListFormat("en").format(dominios)}.`,
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
    abertura: {
      fragmentos: [
        "ticket #412 · no reply since 10pm",
        "the team reads contract by contract",
        "client analysis: 4 days",
        "16 million rows · the laptop froze",
        "Re: Re: we need AI, where do we start?",
        "who checks what the AI answers?",
        "the AI forgot yesterday's chat",
        "POC approved… now what, production?",
        "the report ate the specialist's afternoon",
      ],
      marcas: ["Re: the bot made up a price again", "legal: can I send the contract to ChatGPT?", "works in the demo, breaks at scale"],
      rotuloGargalo: "Bottleneck",
      rotuloPendencias: ["", "Unanswered", "questions"],
      respondidas: "Answered",
      naoLidas: "unread",
      parado: "frozen",
      familiares: {
        escriba: "Scribe",
        triador: "Sorter",
        guardiao: "Warden",
        arquiteto: "Architect",
        mensageiro: "Messenger",
        vigia: "Lookout",
      },
      fraseDeEfeito: "I solve any bottleneck, at any company.",
      carimbo: "Rejected",
      comentarioGuardiao: "“Any” can’t be proven. Swapped in the number.",
      comentarioVigia: "This breaks at scale.",
      respostaTriador: "Read it columnar, out of core.",
      resolvido: "resolved",
      pular: "Skip",
      credito: "Built in front of you by Juliano + 6 agents",
      verDeNovo: "watch again",
    },
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
      vitrine: {
        etiqueta: "clientes",
        detalhe: "3 companies, same architecture",
        curto: "Customer service",
        gargalo: "People type in bursts, the channel redelivers the message, and the conversation has to remember yesterday.",
        resultado: "Runs the whole conversation and hands off to a specialist with a ready briefing. 14 eval scenarios run in CI.",
      },
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
      stack: ["LangGraph", "Python", "FastAPI", "PostgreSQL", "RAG", "LLM", "Langfuse", "Docker"],
    },

    {
      slug: "economize-milhas",
      vitrine: {
        etiqueta: "proprio",
        detalhe: "Open source",
        curto: "Miles",
        gargalo: "Every comparison tool gives everyone the same answer, as if miles had a universal price.",
        resultado: "Live, open source, with 328 tests covering everything from the math to the interface.",
      },
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
      vitrine: {
        etiqueta: "interno",
        detalhe: "Innovation incentive team",
        curto: "Report",
        gargalo: "The first draft of the report took hours of specialist time, only to be reviewed anyway.",
        resultado: "The draft comes out during the meeting itself. The specialist steps in to review, not to write.",
      },
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
      vitrine: {
        etiqueta: "interno",
        detalhe: "Operations",
        curto: "16M rows",
        gargalo: "Millions of payroll events to cross-check on a work laptop. Row by row, in memory, the import dragged.",
        resultado: "Over 16 million rows cross-checked on office hardware, with no dedicated infrastructure.",
      },
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
      vitrine: {
        etiqueta: "interno",
        detalhe: "Legal team",
        curto: "Contracts",
        gargalo: "Dozens of pages to find the clause and redo the math, in a document full of personal data.",
        resultado: "The specialist reviews instead of searching. Every number comes with the clause it came from.",
      },
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

  cenas: {
    trilho: {
      inicio: "Start",
      passei: "Where I've worked",
      casos: "What I built",
      time: "The team",
      contato: "Talk to me",
    },
    passei: {
      rotulo: "Where I've worked",
      empresa: "Grupo Studio · Nov 2025 — present",
      titulo: ["Five departments.", "One way of seeing."],
      texto:
        "I started in marketing. Today I work close to legal. In every department, the same question: where is the bottleneck?",
      marcos: { inicio: "Start", hoje: "Today" },
      etiquetas: { interno: "Internal use", clientes: "For clients", proprio: "Own product" },
      convite: "Pick a floor and I'll take you there.",
      setores: [
        {
          id: "marketing",
          nome: "Marketing",
          marco: "inicio",
          sistemas: [{ nome: "LLM lead quiz" }],
          titulo: "A quiz that qualifies the lead",
          descricao:
            "An LLM reads the quiz answers, points the lead to the best-fitting product, registers them in the CRM and plots how similar they are to each product.",
          resultados: [],
          fala: "This is where it all started.",
          agente: "mensageiro",
        },
        {
          id: "corporate",
          nome: "Corporate",
          sistemas: [{ nome: "Client classification" }],
          titulo: "Clients classified by their own data",
          descricao:
            "Automatic classification of each client from their own data, such as the electricity bill and headcount.",
          resultados: [],
          fala: "Here the data became the criteria.",
          agente: "triador",
        },
        {
          id: "operacional",
          nome: "Operations",
          sistemas: [
            { nome: "Manual flows → automatic" },
            { nome: "16M rows", caso: "ingestao-em-escala" },
          ],
          titulo: "From manual to automatic",
          descricao:
            "I mapped what the team did by hand and made it run on its own. Some departments became almost 100% automated.",
          etiqueta: "interno",
          resultados: [
            { valor: "2×", rotulo: "jobs delivered by the department, an all-time record" },
            { valor: "4d→1d", rotulo: "analysis per client, from 4 days to 1" },
          ],
          fala: "Operations is where it became routine.",
          agente: "vigia",
        },
        {
          id: "lei-do-bem",
          nome: "Innovation incentive",
          sistemas: [{ nome: "LLM technical report", caso: "laudo-enquadramento" }],
          titulo: "The report that comes out during the meeting",
          descricao:
            "A guided checklist with the company being assessed, and a model that drafts the preliminary eligibility report for the specialist to review.",
          etiqueta: "interno",
          resultados: [],
          fala: "Here the model writes and the specialist reviews.",
          agente: "arquiteto",
        },
        {
          id: "juridico",
          nome: "Legal",
          marco: "hoje",
          sistemas: [
            { nome: "Legal platform" },
            { nome: "Loan contract interest", caso: "contratos-bancarios" },
          ],
          titulo: "Innovation inside legal",
          descricao:
            "Today I run a platform for the legal arm and apply AI wherever it shortens the work. The loan contract interest analysis came from here.",
          etiqueta: "interno",
          resultados: [],
          fala: "This is where he is today.",
          agente: "escriba",
        },
      ],
      porConta: "On my own",
      proprios: [
        { sistema: "Customer service agent", caso: "agente-conversacional", nota: "Sold to 3 companies" },
        { sistema: "Economize Milhas", caso: "economize-milhas", nota: "Live · open source" },
      ],
    },
    pranchas: {
      rotulo: "What I've built",
      titulo: "Six systems, running.",
      verDetalhes: "See details",
      fechar: "Close",
      anterior: "Previous system",
      proximo: "Next system",
      rodando: "running",
      montando: "One second: I draw the plan before it runs.",
      montado: "Done. Now it runs on its own.",
      arquitetura: "architecture",
      escolha: "pick a scenario",
      vazio: "Pick a scenario above to run the system.",
      legenda: "— route · - - conditional",
      simulada: "simulated run · fictional data",
      casoCompleto: "Read the full case",
      porTras: "Behind the delivery",
      cliente: "customer",
      agente: "agent",
      taxa: "effective rate {taxa}%/mo · published average 1.90%/mo (fictional)",
      milhas: {
        controle: "Your cost per thousand miles",
        passagem: "R$ 1,800 in cash, or 60,000 miles + R$ 80 (example)",
        calculo: "60 × R$ {m} + R$ 80 = R$ {total}",
        emMilhas: "For you, miles are worth more.",
        emDinheiro: "For you, paying cash is worth more.",
        falaMilhas: "At your cost, miles win. Raise it and watch the answer flip.",
        falaDinheiro: "Your miles are expensive: pay cash. The answer is yours, not universal.",
        nota: "simplified version of the app's math",
      },
      itens: [
        {
          id: "atendimento",
          nome: "Agentic customer-service architecture",
          caso: "agente-conversacional",
          setor: "Sales · 3 companies",
          dono: "guardiao",
          titulo: "Answers on WhatsApp, books from the real calendar and knows when to call a human.",
          numero: "in production in the sales teams of 3 companies · 14 evaluation scenarios in CI",
          fala: "It can write whatever it wants. A price outside the catalog doesn't get past me.",
          reacao: "Went through the guard. Checked.",
          corpo:
            "One architecture, adapted to each company: it greets the customer, sends the data to the CRM, books the meeting and hands the specialist a ready briefing.",
          stack: ["LangGraph", "Python", "FastAPI", "PostgreSQL", "RAG", "LLM", "Langfuse", "Docker"],
          porTras: [
            "The guard runs on the finished text, after composing: model output is untrusted input.",
            "Typed state instead of a loose dictionary.",
            "Phone numbers pseudonymized before leaving the process.",
            "Two engines, switched by an environment variable: rollback without a redeploy.",
          ],
          nos: {
            carregar: { rotulo: "load", sub: "memory" },
            entender: { rotulo: "understand", sub: "intent" },
            decidir: { rotulo: "decide", sub: "routes" },
            recuperar: { rotulo: "retrieve", sub: "catalog · RAG" },
            agendar: { rotulo: "schedule", sub: "real calendar" },
            compor: { rotulo: "compose" },
            guard: { rotulo: "guard", sub: "output barrier" },
            persistir: { rotulo: "persist", sub: "Postgres · CRM" },
            handoff: { rotulo: "handoff", sub: "human + briefing" },
          },
          cenarios: [
            {
              rotulo: "Open on Saturday?",
              cliente: "Are you open on Saturday?",
              caminho: ["carregar", "entender", "decidir", "agendar", "compor", "guard", "persistir"],
              eventos: {
                entender: { t: "intent: schedule · day: Saturday" },
                decidir: { t: "route → schedule" },
                agendar: {
                  t: "real calendar: Sat 10am · Sat 2pm",
                  fala: ["arquiteto", "The time slots came from the real calendar. The model only wrote the sentence around them."],
                },
                guard: { t: "ok: no invented price, no invented deadline" },
              },
              resposta: "We are! I have Saturday at 10am or 2pm. Which works better?",
            },
            {
              rotulo: "How much is the one in the store?",
              cliente: "How much is the one in the store?",
              caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
              eventos: {
                entender: { t: "intent: price · product: ambiguous" },
                recuperar: { t: "catalog: item not identified" },
                compor: { t: "draft: “It's R$ 1,299 upfront.”" },
                guard: {
                  t: "~~“It's R$ 1,299 upfront.”~~ price not in the catalog",
                  mal: true,
                  fala: ["guardiao", "That price isn't in the catalog. It doesn't go out."],
                },
                handoff: { t: "briefing → specialist", fala: ["mensageiro", "I called a human, with a summary of the chat."] },
              },
              resposta: "Let me confirm that with a specialist. I've already passed your request on.",
            },
            {
              rotulo: "I want to talk to someone",
              cliente: "I want to talk to someone",
              caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
              eventos: {
                carregar: { t: "memory: yesterday's conversation", fala: ["vigia", "It remembers yesterday. Nothing is lost on redeploy."] },
                decidir: { t: "route → human" },
                handoff: {
                  t: "briefing → specialist",
                  fala: ["mensageiro", "Nobody retells the story: the specialist gets the briefing, not the transcript."],
                },
              },
              resposta: "Sure. I've passed your conversation to a specialist, they'll reach you right here.",
            },
          ],
        },
        {
          id: "diagnostico",
          nome: "Diagnosis ecosystem",
          caso: "ingestao-em-escala",
          setor: "Operations",
          dono: "vigia",
          titulo: "Each client's diagnosis went from 4 days to 1. Deliveries doubled.",
          numero: "analysis 4 days → 1 · deliveries 2×, all-time record · 10+ RPAs in production",
          fala: "The bots run overnight. I keep an eye on them.",
          reacao: "See? I read the bot's screenshot before anyone arrived.",
          corpo:
            "APIs where they existed; where they didn't, bots on VMs. Documents land in structured folders, a columnar importer cross-checks everything and, if a bot breaks overnight, an AI reads the error screenshot before anyone arrives.",
          stack: ["Python", "Playwright", "OpenCV", "LLM", "DuckDB", "Polars", "Parquet"],
          porTras: [
            "Whole teams moved off purely operational work.",
            "Columnar and out of memory, instead of row by row: 16M rows on office hardware.",
            "I was the first person in the area; the team I trained now serves other departments.",
          ],
          nos: {
            portais: { rotulo: "portals", sub: "no API" },
            apis: { rotulo: "APIs" },
            rpa: { rotulo: "10+ RPAs", sub: "VMs" },
            pastas: { rotulo: "folders", sub: "structured" },
            import: { rotulo: "importer", sub: "columnar" },
            diag: { rotulo: "diagnosis", sub: "per client" },
            prints: { rotulo: "error screenshot", sub: "overnight" },
            ia: { rotulo: "AI watcher", sub: "vision LLM" },
          },
          cenarios: [
            {
              rotulo: "A normal night",
              caminho: ["portais", "rpa", "pastas", "import", "diag"],
              eventos: {
                rpa: { t: "bots download each client's documents" },
                pastas: { t: "documents in structured folders" },
                import: {
                  t: "16M rows, in columns, out of memory",
                  fala: ["triador", "I sort before processing: only the columns the cross-check needs, straight from disk."],
                },
                diag: { t: "diagnosis ready: 1 day, not 4", fala: ["vigia", "By morning, the diagnosis is on the desk."] },
              },
            },
            {
              rotulo: "A bot breaks",
              caminho: ["portais", "rpa", "prints", "ia", "rpa", "pastas", "import", "diag"],
              eventos: {
                rpa: { t: "bot stopped on an unexpected screen", mal: true },
                prints: { t: "error screenshot saved", mal: true },
                ia: {
                  t: "AI reads the screenshot: fixes it or leaves the diagnosis for the morning",
                  fala: ["vigia", "Broke overnight? I read the screenshot before anyone arrives."],
                },
                "rpa#2": { t: "bot runs again" },
                diag: { t: "diagnosis ready anyway" },
              },
            },
          ],
        },
        {
          id: "contratos",
          nome: "AI contract review",
          caso: "contratos-bancarios",
          setor: "Legal",
          dono: "escriba",
          titulo: "Abusive interest found in bank contracts without the model ever seeing the client.",
          numero: "every number comes with the clause it came from",
          fala: "The model never saw who signed. I swapped the names before it read.",
          reacao: "Names swapped. The model only sees [PERSON_1].",
          corpo:
            "The contract is masked before any inference. The model only extracts fields; the rate is computed in code and compared to a public benchmark.",
          stack: ["Python", "FastAPI", "Mistral AI", "Presidio", "pdfplumber", "Pydantic"],
          porTras: [
            "Masking happens before inference, not after.",
            "The model extracts, the code computes.",
            "Abusive relative to a public benchmark, not to a fixed number.",
          ],
          nos: {
            pdf: { rotulo: "contract", sub: "PDF" },
            mask: { rotulo: "mask", sub: "Presidio" },
            llm: { rotulo: "extract", sub: "LLM · Pydantic" },
            calc: { rotulo: "compute", sub: "in code" },
            ref: { rotulo: "benchmark", sub: "published average" },
            res: { rotulo: "result", sub: "number + clause" },
          },
          cenarios: [
            {
              rotulo: "Analyze a fictional contract",
              caminho: ["pdf", "mask", "llm", "calc", "res"],
              eventos: {
                pdf: { t: "fictional contract · 31 pages" },
                mask: {
                  t: "Maria S. → [PERSON_1] · ID → [ID_1]",
                  fala: ["escriba", "Personal data stays out of the prompt. It only reads [PERSON_1]."],
                },
                llm: { t: "term 48 · financed R$ 20,000 · installment R$ 712" },
                calc: { t: "{taxa}", fala: ["guardiao", "The model read the numbers. The code did the math."] },
                res: { t: "above the benchmark · clause 4.2 attached", mal: true },
              },
            },
          ],
        },
        {
          id: "leads",
          nome: "LLM lead capture",
          dominio: "Marketing",
          setor: "Marketing",
          dono: "triador",
          titulo: "An LLM quiz that qualifies leads and retired a paid CRM.",
          numero: "replaced a CRM with built-in chat that cost a lot every month",
          fala: "I sort the lead before it reaches the team. Nobody wastes time on a cold one.",
          reacao: "Already sorted this one. It goes in qualified.",
          corpo:
            "The lead answers the quiz, an LLM qualifies the answers and the department's pipeline lives in one place. Leads go straight to the expansion team to close.",
          // PENDENTE: a stack do quiz (pedida ao Juliano).
          stack: ["LLM"],
          porTras: ["One less subscription: the paid CRM is gone.", "The department's lead management lives in one place."],
          nos: {
            quiz: { rotulo: "quiz", sub: "lead answers" },
            llm: { rotulo: "qualify", sub: "LLM" },
            base: { rotulo: "lead base", sub: "one place" },
            time: { rotulo: "expansion team", sub: "closes" },
          },
          cenarios: [
            {
              rotulo: "A lead answers",
              caminho: ["quiz", "llm", "base", "time"],
              eventos: {
                quiz: { t: "lead's answers received" },
                llm: {
                  t: "lead qualified from the answers",
                  fala: ["triador", "Sort before processing. The team gets the lead already qualified."],
                },
                base: { t: "lead stored, no paid CRM" },
                time: { t: "routed to the expansion team", fala: ["mensageiro", "Delivered with context, not raw."] },
              },
            },
          ],
        },
        {
          id: "laudo",
          nome: "LLM technical report",
          caso: "laudo-enquadramento",
          setor: "Innovation · R&D tax incentive",
          dono: "arquiteto",
          titulo: "The technical report draft is ready before the meeting ends.",
          numero: "the specialist comes in to review, not to write",
          fala: "Whatever is missing becomes a flagged gap. The model points at it, never fills it in.",
          reacao: "One call per project. A gap becomes a flag.",
          corpo:
            "Each project's data comes in during the meeting; one call per project plus one for the conclusion. When information is missing, the report says so instead of inventing it.",
          stack: ["Next.js", "TypeScript", "React", "LLM", "pdfmake", "Vercel"],
          porTras: [
            "One call per project, plus one for the conclusion.",
            "Errors travel as codes, not messages.",
            "A 5-step checklist before any text.",
          ],
          nos: {
            reuniao: { rotulo: "meeting", sub: "project data" },
            proj: { rotulo: "1 call", sub: "per project" },
            concl: { rotulo: "conclusion", sub: "1 call" },
            pdf: { rotulo: "report", sub: "PDF" },
            rev: { rotulo: "specialist", sub: "reviews" },
          },
          cenarios: [
            {
              rotulo: "Generate report",
              caminho: ["reuniao", "proj", "concl", "pdf", "rev"],
              eventos: {
                reuniao: { t: "guided checklist: 5 steps" },
                proj: { t: "project section drafted" },
                pdf: { t: "preliminary report as PDF" },
                rev: {
                  t: "review by the responsible engineer",
                  fala: ["arquiteto", "Checklist before tooling. The bottleneck was the draft, not the review."],
                },
              },
            },
            {
              rotulo: "Something is missing",
              caminho: ["reuniao", "proj", "concl", "pdf", "rev"],
              eventos: {
                proj: {
                  t: "gap: data not provided",
                  mal: true,
                  fala: ["arquiteto", "Missing data? It becomes a flagged gap in the report. Nothing is invented."],
                },
                pdf: { t: "report ships with the gap flagged" },
              },
            },
          ],
        },
        {
          id: "milhas",
          nome: "Economize Milhas",
          caso: "economize-milhas",
          setor: "My own product · open source",
          dono: "mensageiro",
          titulo: "Miles or cash? It depends on what your miles cost you.",
          numero: "live · open source · 328 tests",
          fala: "Move your cost per thousand and watch the answer flip.",
          reacao: "The math uses your cost per thousand, not a universal price.",
          corpo:
            "Every comparison site gives everyone the same answer, as if miles had a universal price. Here the math uses what your miles actually cost you.",
          stack: ["Next.js", "TypeScript", "React", "Tailwind", "Supabase", "Vitest", "Vercel"],
          porTras: ["The app works end to end with every field blank.", "328 tests covering everything from the math to the UI."],
          nos: {
            entrada: { rotulo: "your miles", sub: "cost per thousand" },
            calc: { rotulo: "math", sub: "tested" },
            milhas: { rotulo: "in miles" },
            din: { rotulo: "in cash" },
          },
          cenarios: [],
        },
      ],
    },
    construi: {
      rotulo: "What I built",
      anterior: "Previous system",
      proximo: "Next system",
      gargalo: "Bottleneck",
      resultado: "Result",
      porTras: "Behind the delivery",
      casoCompleto: "Read the full case",
      agente: {
        instrucao: "Send a message",
        ficticia: "Fictional conversation",
        simulacoes: [
          {
            pergunta: "Open on Saturday?",
            caminho: ["carregar", "entender", "decidir", "agendar", "compor", "guard", "persistir"],
            dados: [{ no: "agendar", texto: "real calendar: Sat 10am · Sat 2pm" }],
            resposta: "We are! I have Saturday at 10am or 2pm. Which works better?",
            anfitriao: "arquiteto",
            fala: ["Notice: the time slots came from the real calendar.", "The model only wrote the sentence around them."],
          },
          {
            pergunta: "How much is the one from the store?",
            caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
            barrado: "“It's R$ 1,299 upfront.”",
            dados: [{ no: "handoff", texto: "briefing" }],
            resposta: "Let me confirm that one with a specialist. I've already passed your request on.",
            anfitriao: "guardiao",
            fala: ["That price isn't in the catalog. Rejected.", "I called a human, with a summary of the chat."],
          },
          {
            pergunta: "I want to talk to someone",
            caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
            dados: [
              { no: "carregar", texto: "memory: yesterday's conversation" },
              { no: "handoff", texto: "briefing" },
            ],
            resposta: "Sure. I passed your conversation to a specialist, who will reach you right here.",
            anfitriao: "mensageiro",
            fala: ["Nobody has to tell the story again.", "The specialist gets the briefing, not the transcript."],
          },
        ],
      },
      contratos: {
        instrucao: "Hover a number",
        ficticio: "Fictional contract",
        passos: ["Contract", "Mask", "Model", "Code"],
        campos: { prazo: "term", financiado: "financed", parcela: "installment" },
        taxaEfetiva: "effective rate",
        mediaPublicada: "published average",
        acima: "Above the reference",
        dentro: "Within the reference",
        fala: ["The model never saw who signed.", "I swapped the names before it read."],
      },
      ingestao: {
        linhaALinha: "Row by row",
        emColunas: "Columnar",
        memoria: "Laptop memory",
        tabela: "Payroll events",
        estadoLinha: "Everything in memory: the import drags and looks frozen.",
        estadoColuna: "Only the columns the join needs, read straight from disk.",
        persistido: "Conversion saved to disk: re-running doesn't start from zero.",
        escala: "16M+ rows in one run",
        fala: ["This used to break at scale.", "Columnar and out of core, it fits on a laptop."],
      },
      laudo: {
        gerar: "Draft report",
        faltou: "A piece of information is missing",
        checklist: "Guided checklist",
        etapa: "Step",
        projeto: "Project",
        conclusao: "Conclusion",
        chamada: "1 call",
        secao: "Section",
        pendencia: "Pending: data not provided",
        rodape: "Preliminary report · review by a qualified technical lead",
        fala: ["What's missing becomes a pending item.", "The model points at the gap, it doesn't fill it."],
      },
      milhas: {
        preco: "Cash price (R$)",
        milhas: "Miles required",
        taxas: "Fees (R$)",
        milheiro: "Your cost per 1,000 miles (R$)",
        emMilhas: "With miles",
        emDinheiro: "With cash",
        vereditoMilhas: "For you, miles are worth more.",
        vereditoDinheiro: "For you, paying cash is worth more.",
        nota: "Simplified version of the math the app does.",
        verNoAr: "Open the live app",
        fala: ["Change your cost per 1,000 and watch the answer flip.", "Miles have no universal price."],
      },
    },
    time: {
      rotulo: "The team",
      titulo: ["Six agents,", "six rules of mine."],
      texto: "Each one exists because I follow a rule.",
      dica: { mouse: "Hover to meet them.", toque: "Tap one to meet them." },
      montagem: { carimbo: "checked" },
      rotulos: { porQue: "Why it's here", onde: "Where it shows" },
      fichas: {
        escriba: {
          regra: "Personal data stays out of the prompt.",
          porQue:
            "Privacy as a pipeline step is verifiable. Privacy as a clause in a vendor contract is a promise.",
          onde: { texto: "Contracts: the mask before the model", caso: "contratos-bancarios" },
        },
        triador: {
          regra: "Sort before you process.",
          porQue:
            "Heavy work only gets fast when the data arrives sorted: columnar, out of core, converted once.",
          onde: { texto: "16 million rows: the columnar read", caso: "ingestao-em-escala" },
        },
        guardiao: {
          regra: "The model proposes, the code checks.",
          porQue:
            "I treat model output as untrusted input. Asking in the prompt lowers the odds; checking the output removes the case.",
          onde: { texto: "Customer service agent: the guard node", caso: "agente-conversacional" },
        },
        arquiteto: {
          regra: "The bottleneck comes before the tool.",
          porQue:
            "Before choosing a model or framework, I look for where the work gets stuck. The tool follows from that.",
          onde: { texto: "Report: the 5-step checklist", caso: "laudo-enquadramento" },
        },
        mensageiro: {
          regra: "Deliver with context, not raw.",
          porQue:
            "Handing a conversation to a human means delivering a ready briefing, not the whole transcript.",
          onde: { texto: "Customer service agent: the handoff with briefing", caso: "agente-conversacional" },
        },
        vigia: {
          regra: "I think about it working down the road.",
          porQue: "I analyze everything: security, scale. I think about what I'm building working down the road.",
          onde: { texto: "Customer service agent: rollback without redeploy", caso: "agente-conversacional" },
        },
      },
    },
    contato: {
      rotulo: "Talk to me",
      titulo: "Shall we build the next one?",
      texto: "Got a project or a stuck process? Tell me, and I'll come back with the design of the system.",
      fala: "Write it and I'll carry it. He answers.",
    },
  },
};

/**
 * Content extracted from Utkarsh_Garg_Resume_2026_August.pdf.
 * Edit copy here — components only handle presentation.
 */

export const headline = {
  role: "Tech Lead · Senior Full‑Stack Engineer",
  focus: ["Web platforms", "Distributed data", "Applied GenAI"],
  company: "D. E. Shaw",
  years: 6,
};

export type Stat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string };

export const aboutStats: Stat[] = [
  { value: 6, suffix: "+", label: "Years at D. E. Shaw" },
  { value: 250, suffix: "+", label: "Daily users on my AI assistant" },
  { value: 60, suffix: "×", label: "Faster large-data queries" },
  { value: 300, suffix: "+", label: "Apps on my logging platform" },
];

export type Initiative = {
  key: "genai" | "bi" | "logs" | "ui";
  kicker: string;
  short: string;
  title: [string, string]; // [plain, italic]
  summary: string;
  metric: Stat;
  secondary: { value: string; label: string }[];
  highlights: string[];
  tags: string[];
};

export const initiatives: Initiative[] = [
  {
    key: "genai",
    short: "GenAI",
    kicker: "GenAI & developer productivity",
    title: ["An AI assistant that", "knows our stack"],
    summary:
      "An agentic coding assistant specialised in the firm’s web framework and Python data-science APIs — living in docs, IDEs (Cursor, Claude Code, VS Code, Jupyter) and internal chat.",
    metric: { value: 250, suffix: "+", label: "Daily active users, up from ~23 a week at launch" },
    secondary: [
      { value: "~700", label: "Unique users" },
      { value: "30–40%", label: "More accurate than RAG v1" },
    ],
    highlights: [
      "Multi-tool agent on LangChain, LangGraph and the Claude Agent SDK with integrated MCP servers.",
      "Three-tier retrieval: an MCP server for IDEs, a RAG skill service, versioned Milvus collections and FAISS over past support threads.",
      "Evaluation framework built from scratch: Ragas, LLM-as-judge, AST comparison and Cypress end-to-end tests.",
      "Started the team’s first Claude plugin marketplace and shipped a framework-aware code-review plugin.",
    ],
    tags: ["LangGraph", "Claude Agent SDK", "MCP", "Milvus", "Kubernetes"],
  },
  {
    key: "bi",
    short: "BI engine",
    kicker: "BI library · connectors & compute engine",
    title: ["A compute engine for", "30+ teams"],
    summary:
      "The backend of the firm’s in-house Tableau / Power BI equivalent, used by 30+ teams to build dashboards for traders, analysts and researchers.",
    metric: { value: 60, suffix: "×", label: "Faster on 25M rows — 10-minute timeouts became 10-second queries" },
    secondary: [
      { value: "138×", label: "Faster UI props with Apache Arrow" },
      { value: "~68%", label: "Smaller payloads" },
    ],
    highlights: [
      "Proposed and finished a full connector redesign: connectors only fetch data, the engine handles orchestration, merging and deduplication.",
      "Designed a DAG-based compute engine (filter → aggregate → evaluate → transform → sort) that caches intermediate results.",
      "Rebuilt the data layer on Dask with MapReduce, which made queries that used to run out of memory on pandas possible.",
      "Cross-filtering across 12–15 chart types, three levels of caching, and a JupyterLab integration that turns DataFrames into UIs.",
    ],
    tags: ["Dask", "Apache Arrow", "pandas", "FastAPI", "Node.js"],
  },
  {
    key: "logs",
    short: "Observability",
    kicker: "Usage logging & observability",
    title: ["Observability built into", "300+ apps"],
    summary:
      "Built-in telemetry for the internal web framework behind 300+ business-facing apps, so individual teams no longer have to set it up themselves.",
    metric: { value: 1.5, decimals: 1, suffix: "M", label: "Log entries a day, after a solo MongoDB → SQL migration" },
    secondary: [
      { value: "80%", label: "Of apps onboarded in a year" },
      { value: "1 key", label: "Turns on the whole stack" },
    ],
    highlights: [
      "Led the migration end-to-end, met a firm-wide Kerberos deadline, retired the old stack and started a ClickHouse evaluation.",
      "Ready-to-use tracing, client Core Web Vitals, server metrics and error aggregation across two deployment models.",
      "Joined OpenTelemetry traces across JavaScript and Python services together with the Python infrastructure team.",
      "Owned the 2025 roadmap; Grafana dashboards and alerts are on by default with no setup.",
    ],
    tags: ["OpenTelemetry", "Grafana", "SQL", "ClickHouse", "Kerberos"],
  },
  {
    key: "ui",
    short: "UI library",
    kicker: "Firm-wide shared UI library",
    title: ["Six years,", "v13 → v26"],
    summary:
      "Sole technical owner of a full-stack JavaScript library that adds discussion, request and ticketing UI to apps across the platform. I handle every release, migration guide and escalation.",
    metric: { value: 80, suffix: "+", label: "React components moved to the firm’s MUI design system" },
    secondary: [
      { value: "13", label: "Major versions shipped" },
      { value: "Kafka", label: "Replaced ActiveMQ / STOMP" },
    ],
    highlights: [
      "Moved real-time updates to Apache Kafka with a Socket.IO subscription manager that checks permissions.",
      "Added OIDC on-behalf-of authentication, so each user gets their own bearer token instead of passing usernames.",
      "Upgraded the toolchain (React Router 6, React 18, Node 20, pnpm) and wrote migration guides for consumers.",
      "CI builds, docs and Cypress suites run against temporary app instances, with static security scanning.",
    ],
    tags: ["React 18", "Material UI", "Kafka", "Socket.IO", "OIDC"],
  },
];

export type Milestone = { when: string; role: string; org: string; note: string; current?: boolean };

export const career: Milestone[] = [
  {
    when: "Dec 2024 — Now",
    role: "Tech Lead",
    org: "D. E. Shaw · Core Tech (Web Infrastructure)",
    note: "Own four platform initiatives at once. Manage 2 direct reports and mentor 5+ engineers across web, data and GenAI.",
    current: true,
  },
  {
    when: "2022",
    role: "Senior Member Technical",
    org: "D. E. Shaw",
    note: "Promoted in 1.5 years as a top performer.",
  },
  {
    when: "Jul 2020",
    role: "Joined Web Infrastructure",
    org: "D. E. Shaw · Hyderabad",
    note: "Started on the web platform and developer infrastructure used across the firm.",
  },
  {
    when: "May — Jul 2019",
    role: "Software Engineering Intern",
    org: "Visa Inc. · Bangalore",
    note: "Built a React/Redux + GoLang status tracker to replace the team’s email-based SDLC tracking.",
  },
  {
    when: "2016 — 2020",
    role: "B.Tech, Computer Science",
    org: "MNNIT Allahabad · CGPA 9.16 / 10",
    note: "Merit Scholarship: top 18 of 176 students.",
  },
];

export const leadership = {
  stats: [
    { value: "100+", label: "Candidates interviewed since 2022" },
    { value: "5+", label: "Engineers mentored, 2–3 promoted" },
    { value: "87%", label: "AI-tooling adoption measured in the 2025 survey" },
    { value: "57.6", label: "Developer NPS from the survey I led" },
  ],
  points: [
    "Hiring for Tech Lead roles and representing the firm at IIT and NIT campus drives.",
    "Member of the Productivity Committee. Gave BU-wide lightning talks on Claude Code workflows, plugins and automation.",
    "Built a daily-summary tool that pulls together activity from ticketing, GitHub, Confluence and Outlook.",
  ],
};

export const toolkit: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "C++", "Java", "HTML", "CSS"] },
  {
    group: "Frontend",
    items: ["React 18", "Redux / Reselect", "React Query", "React Router", "Material UI", "Storybook", "Socket.IO", "Testing Library", "Cypress"],
  },
  {
    group: "Backend & data",
    items: ["Node.js", "Express", "FastAPI", "Dask", "Apache Arrow", "pandas", "Kafka", "MongoDB", "ClickHouse", "DAG query engines", "Multi-tier caching"],
  },
  {
    group: "GenAI & agents",
    items: ["LangChain", "LangGraph", "Claude Agent SDK", "MCP servers", "RAG", "Milvus", "FAISS", "Ragas", "LLM-as-judge"],
  },
  {
    group: "Infra & observability",
    items: ["Kubernetes", "K9s", "Docker", "OpenTelemetry", "Grafana", "Core Web Vitals", "OIDC / OAuth2", "Kerberos", "Linux"],
  },
  {
    group: "Practice",
    items: ["Git", "GitHub Actions", "pnpm", "JupyterLab", "Claude Code", "Cursor", "VS Code", "Static security scanning", "Release management", "PRD authoring"],
  },
];

export const recognition = [
  { date: "2024", title: "Promoted to Tech Lead", description: "Leading four platform initiatives for the firm-wide engineering org." },
  { date: "2022", title: "Senior Member Technical", description: "Promoted in 1.5 years as a top performer at D. E. Shaw." },
  { date: "D. E. Shaw", title: "Data Science League", description: "Special Mention in the firm’s internal data-science competition." },
  { date: "2018", title: "Merit Scholarship", description: "Top 18 of 176 students for academic performance at MNNIT Allahabad." },
];

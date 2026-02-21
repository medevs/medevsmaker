# YouTube Content Plan: AI Agents, Vibe Coding & Software Engineering

> 65 video ideas across 2 series, based on comprehensive web research (Feb 2026).
> Each video targets ~5 minutes. Titles are YouTube-optimized.

---

## Series 1: Software Engineering for Vibe & Agent Coders

A course series teaching non-technical people the fundamentals they NEED before (and while) using AI coding tools. Each video covers one concept — no fluff, just what matters.

---

### 1. How the Web Actually Works (Client, Server, Database)

**Description**: Before you use any AI coding tool, you need a mental model of how web apps work. This video explains the client-server-database triangle in plain language — what happens when you type a URL, what a "backend" actually does, and why your frontend can't talk directly to a database.

**What it should contain**:
- The browser (client) sends a request to a server
- The server processes it, talks to a database, and sends back a response
- Visual diagram: Frontend (React/HTML) ↔ Backend (API/Server) ↔ Database (PostgreSQL/MongoDB)
- Why this matters: AI tools generate code for all 3 layers — you need to know which is which
- Real example: what happens when you click "Sign Up" on a website

---

### 2. Git in 5 Minutes: The Undo Button for Your Entire Project

**Description**: Git is non-negotiable. Without it, one bad AI-generated change can destroy everything with no way back. This video covers the 4 commands that cover 90% of what you need.

**What it should contain**:
- Why Git exists: snapshots of your project you can always return to
- The 4 essential commands: `git add`, `git commit`, `git push`, `git pull`
- What branches are: "safe playgrounds" for experiments
- The golden rule: ALWAYS commit before every AI coding session
- Demo: making a commit, then reverting a bad change

---

### 3. The #1 Security Mistake AI Coders Make (Hardcoded Secrets)

**Description**: 45% of AI-generated code contains security vulnerabilities, and the most common one is hardcoding API keys directly in your code. This video shows you what environment variables are, why they matter, and how to use them properly.

**What it should contain**:
- What secrets are: API keys, database passwords, JWT signing keys, Stripe keys
- Why AI tools hardcode them: they optimize for "working code," not "safe code"
- The `.env` file pattern: store secrets locally, never commit them
- `.gitignore` — telling Git to ignore your `.env` file
- `.env.example` — placeholder file you DO commit so teammates know what's needed
- Real case: Lovable apps that exposed API keys, payment details, and user data (CVE-2025-48757)

---

### 4. SQL Injection Explained: How One Input Field Can Delete Your Database

**Description**: SQL injection is the oldest and most dangerous web vulnerability, and AI tools generate it constantly. This video explains what it is, shows a live example, and teaches you how to prevent it.

**What it should contain**:
- What SQL injection is: malicious input that tricks your database into running attacker commands
- Visual demo: `'; DROP TABLE users; --` in a login form
- Why AI generates it: string concatenation in queries (`"SELECT * FROM users WHERE id = " + input`)
- The fix: parameterized queries (ORMs like Prisma do this automatically)
- Stat: AI-generated code has 2.74x more XSS and 1.88x more injection vulnerabilities than human code (CodeRabbit 2025)

---

### 5. Authentication vs. Authorization: The Difference That Will Save Your App

**Description**: Most AI-generated apps have broken access control — the #1 vulnerability in the OWASP Top 10. This video explains the difference between "who are you?" (authentication) and "what can you do?" (authorization), and why AI gets both wrong.

**What it should contain**:
- Authentication: verifying identity (login, password, OAuth)
- Authorization: checking permissions (can this user access THIS resource?)
- Why AI misses authorization: it generates endpoints without checking who's calling them
- The pattern: check permissions on EVERY request, server-side, not just in the UI
- Why you should NEVER build auth from scratch — use Clerk, Auth0, Supabase Auth, or NextAuth
- Real case: Stockholm startup with exposed admin interface — potential GDPR disaster

---

### 6. Your First Database: PostgreSQL, Schemas, and Why Indexes Matter

**Description**: Almost every app stores data. This video explains relational databases in plain language — what a schema is, why you need indexes, and how to avoid the most common AI database mistakes.

**What it should contain**:
- SQL vs NoSQL: when to use which (default to PostgreSQL)
- Schemas: the blueprint that defines your data's structure (tables, columns, types)
- Relationships: one-to-many, many-to-many, foreign keys
- Indexes: like a book's index — without them, queries that take 5ms can take 5 seconds
- Migrations: versioned changes to your database (never modify production schemas by hand)
- ORMs: Prisma (beginner-friendly) vs Drizzle (closer to SQL)

---

### 7. REST APIs: How Your Frontend Talks to Your Backend

**Description**: APIs are how different parts of your app communicate. This video explains REST APIs — the standard approach that 90% of apps use — in plain language with real examples.

**What it should contain**:
- What an API is: a contract between two pieces of software
- HTTP verbs: GET (read), POST (create), PUT (update), DELETE (remove)
- URLs as resources: `/api/users`, `/api/posts/123`
- Status codes: 200 (OK), 401 (unauthorized), 404 (not found), 500 (server error)
- JSON: the universal data format
- Why this matters for AI coding: when AI generates an API, you need to verify it follows these conventions

---

### 8. Input Validation: Never Trust Data From the User

**Description**: AI generates "happy path" code that assumes all input is valid. In reality, every piece of data from users must be validated and sanitized. This video shows you what happens when you skip validation and how to add it properly.

**What it should contain**:
- The rule: never trust the client. Validate everything on the server
- Common attacks: SQL injection, XSS (injecting JavaScript), oversized payloads
- Validation libraries: Zod (TypeScript) for defining schemas and validating input
- What to validate: type, length, format, range, required fields
- Example: a contact form that accepts any input vs. one that validates email format, message length, and sanitizes HTML

---

### 9. Error Handling: Why "It Works on My Machine" Isn't Enough

**Description**: AI generates code that handles the happy path but crashes on everything else. This video covers error handling patterns — try/catch, error boundaries, graceful degradation — so your app doesn't show a blank white screen when something goes wrong.

**What it should contain**:
- The problem: AI code assumes every API call succeeds, every database query returns data
- Try/catch blocks: wrapping async operations so errors don't crash the app
- Error boundaries in React: catching errors in the component tree
- User-friendly error messages: "Something went wrong. Please try again." NOT stack traces
- Loading states, empty states, error states — the 3 states every component needs
- Real stat: error handling gaps are 2x more common in AI-assisted code

---

### 10. TypeScript in 5 Minutes: The Safety Net You Didn't Know You Needed

**Description**: TypeScript catches entire categories of bugs at compile time that JavaScript misses at runtime. This video explains the basics — types, interfaces, strict mode — and why every AI-generated project should use it.

**What it should contain**:
- What TypeScript adds: type annotations that catch errors before your code runs
- Basic types: `string`, `number`, `boolean`, `array`, `object`
- Interfaces: defining the shape of your data
- Why `strict: true` in tsconfig.json matters
- Example: calling a function with the wrong argument type — JavaScript crashes at runtime, TypeScript catches it in your editor
- How it helps with AI code: AI generates fewer bugs when the project uses TypeScript

---

### 11. ESLint + Prettier: Set Up Your Code Quality Tools Once, Forget Forever

**Description**: These two tools catch bugs and enforce consistent formatting automatically. This video shows you how to set them up in any project — they'll catch AI-generated mistakes before you even run the code.

**What it should contain**:
- ESLint: flags problems (unused variables, unreachable code, potential bugs)
- Prettier: enforces consistent formatting (spacing, indentation, line length)
- How to set them up: `npm install -D eslint prettier`
- Format-on-save in VS Code: code is always clean
- Pre-commit hooks with Husky: code is checked before every commit
- Why this matters: AI-generated code has 3x more readability problems (CodeRabbit 2025)

---

### 12. Project Structure: How to Organize Your Code So It Doesn't Become a Mess

**Description**: AI tools generate files fast but without structure. Within days, your project becomes an unmaintainable mess. This video covers folder conventions, naming patterns, and the separation of concerns that keeps code manageable.

**What it should contain**:
- Separation of concerns: UI code, business logic, and data access in separate files
- Standard folder conventions (Next.js example): `app/`, `components/`, `lib/`, `utils/`, `types/`
- Naming conventions: `kebab-case` for files, `PascalCase` for components, `camelCase` for variables
- Configuration files: `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
- The README.md: every project needs one
- Dependency management: `package.json` vs `package-lock.json`, pinning versions

---

### 13. Testing 101: If You Can't Test It, You Can't Trust It

**Description**: AI generates code that looks correct but contains subtle logic errors. Without tests, you won't catch them until users do. This video covers the testing pyramid and the minimum you need to know.

**What it should contain**:
- The testing pyramid: many unit tests, some integration tests, few E2E tests
- Unit tests: testing individual functions ("given this input, do I get the expected output?")
- Integration tests: testing how components work together
- E2E tests: simulating real user flows (Playwright, Cypress)
- What to test: critical business logic, edge cases, error paths, auth flows
- Testing AI code specifically: always run tests after AI generates code
- Tools: Vitest, Jest, Playwright

---

### 14. Deployment: Getting Your App From Localhost to the Internet

**Description**: Code on your laptop isn't a product. This video covers the simplest path to deploying a real web app — Vercel for frontend, Railway for backend — with free SSL, automatic deploys, and zero DevOps knowledge required.

**What it should contain**:
- Development vs staging vs production environments
- Vercel: git-push deploys for Next.js/React apps (free tier available)
- Railway: backend, databases, and background jobs
- The popular combo: Vercel frontend + Railway backend
- Domain setup: buying a domain, configuring DNS
- SSL/HTTPS: always on, free via your hosting platform
- Environment variables in production: set them in the platform dashboard, not in code

---

### 15. CI/CD: Automatic Testing and Deployment on Every Push

**Description**: If you deploy manually, you'll eventually deploy a mistake. CI/CD automatically runs tests and deploys code that passes. This video shows you how to set up a basic GitHub Actions workflow.

**What it should contain**:
- CI (Continuous Integration): automatically run tests on every push
- CD (Continuous Deployment): automatically deploy code that passes all checks
- GitHub Actions: the most common CI/CD tool
- A basic workflow: push code → run tests → deploy to Vercel/Railway
- Why this matters: catches bugs before they reach production
- Rollbacks: how to instantly revert to a previous deployment

---

### 16. The OWASP Top 10: The Security Checklist Every Developer Needs

**Description**: The OWASP Top 10 is the industry-standard list of web application security risks. This video walks through all 10 categories with real examples of how AI tools violate each one.

**What it should contain**:
- #1 Broken Access Control — users accessing things they shouldn't
- #2 Security Misconfiguration — default passwords, open databases
- #3 Supply Chain Failures — malicious npm packages
- #4 Cryptographic Failures — storing passwords in plain text
- #5 Injection — SQL injection and XSS
- #6-10: brief overview of remaining categories
- How to audit: run `npm audit`, use OWASP ZAP, enable GitHub Dependabot
- Stat: 45% of AI-generated code contains OWASP Top 10 vulnerabilities

---

### 17. Caching and Performance: Why Your App Is Slow (and How to Fix It)

**Description**: AI-generated code has 8x more performance inefficiencies than human-written code. This video covers the caching strategies and optimization techniques that keep your app fast.

**What it should contain**:
- Browser cache: HTTP Cache-Control headers
- CDN cache: static files served from servers worldwide
- Server-side cache: Redis for frequently-accessed expensive data
- Database optimization: indexes, avoiding N+1 queries, pagination
- Lazy loading: only load images/content when they enter the viewport
- Image optimization: WebP/AVIF formats, responsive images
- Core Web Vitals: LCP, FID, CLS — what they measure and why they matter

---

### 18. Docker in 5 Minutes: "It Works on My Machine" Is No Longer a Problem

**Description**: Docker packages your app and all its dependencies into a portable container. This video explains what Docker is, why it matters, and the 3 concepts you need to know.

**What it should contain**:
- What Docker solves: consistent environments everywhere
- Dockerfile: the blueprint for building your container
- Image: the built package
- Container: the running instance
- Docker Compose: running multiple containers (app + database + cache)
- When you need it: multi-service apps, deploying to Railway/AWS, team development
- When you DON'T need it: simple Vercel/Netlify deployments

---

### 19. Logging and Monitoring: If It's Not Logged, It Didn't Happen

**Description**: In production, you can't see console.log. Without proper logging and monitoring, bugs are invisible. This video shows you how to set up Sentry for error tracking and structured logging.

**What it should contain**:
- Why console.log isn't enough: you can't see it in production
- Structured logging: JSON format with timestamp, level, requestId, userId
- Log levels: DEBUG, INFO, WARN, ERROR — when to use each
- Sentry: automatically captures errors, stack traces, and request context
- Uptime monitoring: get alerted when your app goes down
- Alerting: Slack/email notifications for critical errors
- Set up Sentry BEFORE your first production deployment

---

### 20. Rate Limiting: Why Your Public API Will Get Abused

**Description**: Any public-facing endpoint will be attacked. AI-generated code almost never includes rate limiting. This video explains what it is and how to add it to your API endpoints.

**What it should contain**:
- What rate limiting is: limiting how many requests a client can make
- Why it matters: prevents brute-force attacks, DDoS, and API abuse
- Where to add it: login endpoints, signup, password reset, any public API
- How to implement: `express-rate-limit` middleware or hosting-level (Cloudflare, Vercel)
- HTTP 429 (Too Many Requests) — the response code
- Stat: 62% of AI-generated SaaS lack rate limiting on auth endpoints

---

### 21. CORS Explained: Why Your API Returns "Access Denied"

**Description**: CORS errors are the most confusing thing for new developers. This video explains what Cross-Origin Resource Sharing is, why browsers enforce it, and how to configure it properly.

**What it should contain**:
- What CORS is: browser security that blocks requests from different domains
- Why it exists: prevents malicious websites from making requests to your API
- The error: "Access to fetch at X from origin Y has been blocked by CORS policy"
- The fix: configure your server to allow specific origins
- Common mistake: `Access-Control-Allow-Origin: *` in production (dangerous)
- How AI generates CORS issues: often creates frontend and backend on different ports without configuring CORS

---

### 22. Architecture Patterns: Monolith vs Microservices (Start Simple)

**Description**: AI tools don't make architecture decisions for you. This video explains the difference between monoliths and microservices, and why you should always start with a monolith.

**What it should contain**:
- Monolith: one codebase, one deployment — simple to build, test, and debug
- Microservices: separate, independently deployable services — complex but scalable
- The 2026 consensus: start with a clean monolith, extract services only if needed
- Clean architecture layers: presentation → application → domain → infrastructure
- State management in React: useState → Context → Zustand (progression)
- Server Components vs Client Components in Next.js/React 19

---

### 23. The Production Readiness Checklist (Before You Launch)

**Description**: The gap between a demo and a production app is enormous. This video walks through a complete checklist — security, error handling, performance, monitoring, legal — that turns your prototype into something you can actually launch.

**What it should contain**:
- Security: auth tested, input validation, secrets in env vars, RLS enabled, HTTPS
- Error handling: error boundaries, user-friendly messages, no stack traces exposed
- Testing: core flows tested, edge cases covered
- Performance: PageSpeed audit, images optimized, lazy loading
- Deployment: CI/CD pipeline, monitoring, rollback plan
- Legal: Terms of Service, Privacy Policy, Cookie consent, GDPR
- Based on the Supabase Production Checklist and community best practices

---

### 24. Prompting AI Coding Tools: How to Get Better Code From Day One

**Description**: The quality of AI-generated code is directly proportional to the quality of your prompts. This video covers the prompting techniques that produce better, safer, more maintainable code.

**What it should contain**:
- Be specific about requirements, constraints, and edge cases
- Include context: framework, language, existing patterns
- Incremental generation: one function at a time, verify, then continue
- Specify what you DON'T want: "do not hardcode API keys," "do not use any"
- Few-shot prompting: provide examples of the pattern you want
- The spec-first workflow: write requirements before prompting
- When to start a fresh chat vs continuing a broken one

---

### 25. CLAUDE.md and .cursorrules: Teaching AI Your Project's Rules

**Description**: Configuration files like CLAUDE.md and .cursorrules tell AI tools how to behave in your codebase. This video shows you how to write them effectively — define coding standards, forbidden patterns, and architecture rules once, and the AI follows them in every conversation.

**What it should contain**:
- What these files are: project-scoped instructions for AI tools
- CLAUDE.md: for Claude Code and Claude in VS Code
- .cursorrules: for Cursor IDE
- What to include: coding standards, preferred libraries, forbidden patterns, naming conventions, architecture rules
- Example: "Never use CSS animations in Remotion — always use useCurrentFrame()"
- Making rules portable across tools: write once, adapt for each platform
- Real examples from production projects

---

### 26. Reviewing AI-Generated Code: What to Look For

**Description**: 59% of developers use AI code they don't fully understand. This video teaches you what to look for when reviewing AI output — the red flags that indicate security holes, performance problems, or bugs waiting to happen.

**What it should contain**:
- Hardcoded secrets (API keys, passwords in the code)
- Missing error handling (no try/catch on API calls)
- Unnecessary complexity (5 functions where 2 would work)
- Security holes: string concatenation in queries, unvalidated input, exposed endpoints
- Outdated libraries and deprecated APIs
- Unused imports and dead code
- How AI creates inconsistency: similar tasks done differently in the same codebase
- The rule: if you can't explain the code to someone else, don't ship it

---

### 27. The Green Zone / Red Zone Strategy for AI Coding

**Description**: Not all code is equally risky to generate with AI. This video introduces the green zone / red zone framework — what's safe to vibe code and what requires human rigor.

**What it should contain**:
- Green zone (safe to vibe code): UI components, layouts, static pages, styling, prototypes
- Red zone (requires human oversight): authentication, payment processing, business logic, data models, API security, infrastructure
- Why this distinction matters: AI is great at presentation code but dangerous for business-critical logic
- The workflow: vibe code the green zone fast, then slow down and review the red zone
- Real example: a signup form (green zone for UI, red zone for the auth flow behind it)

---

### 28. Debugging When AI Goes in Circles (The 70% Wall)

**Description**: Every vibe coder hits the "70% wall" — the project is 70% done but AI keeps adding complexity instead of fixing bugs. This video covers practical strategies for getting unstuck.

**What it should contain**:
- The 80-15-5 rule: first 80% feels instant, next 15% slows down, last 5% is brutal
- The whack-a-mole effect: AI fixes one thing but breaks 10 others
- Strategy 1: start a fresh chat with a clear, specific prompt instead of continuing a broken one
- Strategy 2: read the error message yourself — learn to read stack traces
- Strategy 3: isolate the problem — test one piece at a time
- Strategy 4: ask AI to explain the code, not just fix it
- When to bring in a professional: security, scaling, persistent bugs

---

### 29. Webhooks: How Services Talk to Each Other

**Description**: Webhooks are how third-party services (Stripe, GitHub, SendGrid) notify your app when something happens. This video explains the pattern and how to implement them securely.

**What it should contain**:
- What webhooks are: HTTP POST requests sent by external services to your server
- Examples: Stripe sends a webhook when a payment succeeds, GitHub when a PR is merged
- How to receive webhooks: create an API endpoint that listens for the POST request
- Signature verification: confirming the webhook actually came from Stripe/GitHub (not an attacker)
- Why AI gets webhooks wrong: missing signature verification, no idempotency handling
- Common use cases: payment confirmation, user signup flows, deployment triggers

---

### 30. The Complete "I Built My First App" Walkthrough

**Description**: A full walkthrough of building a small but complete app — from idea to deployed product — using AI tools while applying everything from this series. Shows the realistic workflow, including the mistakes and fixes.

**What it should contain**:
- The idea: a simple task manager (CRUD + auth)
- Step 1: write a spec before touching AI
- Step 2: set up the project (TypeScript, ESLint, Prettier, Git)
- Step 3: AI generates the UI (green zone) — fast iteration
- Step 4: AI generates the API + database (red zone) — careful review
- Step 5: add authentication with Clerk/Supabase Auth
- Step 6: test, fix security issues, add error handling
- Step 7: deploy to Vercel + Railway
- Step 8: set up monitoring (Sentry)
- Honest time: what took 5 minutes vs what took 5 hours

---

## Series 2: AI Agents, Vibe Coding & The Future

Videos about the AI coding ecosystem — tools, frameworks, workflows, case studies, and where everything is heading.

---

### 31. AI Coding Tools Compared: I Tested Them All So You Don't Have To (2026)

**Description**: An honest, head-to-head comparison of every major AI coding tool — Cursor, GitHub Copilot, Claude Code, Windsurf, Gemini Code Assist, and Amazon Q — with real benchmarks and actual coding tests.

**What it should contain**:
- Cursor: best codebase awareness, Composer for multi-file, $20/month
- GitHub Copilot: deepest ecosystem integration, multi-model (GPT-4o, Claude, Gemini), $10-19/month
- Claude Code: terminal-based, 200K context, agentic workflow, $20/month
- Windsurf: autonomous Cascade agent, $15/month
- Gemini Code Assist: 1M+ token context, best for Google Cloud users
- Amazon Q: best for AWS/Java modernization
- SWE-Bench scores: Claude Opus 4.6 (79.2%), Gemini 3 Flash (76.2%), GPT 5.2 (75.4%)
- Verdict: which tool for which use case

---

### 32. What Is Vibe Coding? (And Why It's Already Evolving)

**Description**: Vibe coding was coined by Andrej Karpathy in Feb 2025 and became Collins Dictionary Word of the Year. But by Feb 2026, Karpathy himself called it "passe." This video covers the full evolution — from vibe coding to agentic engineering.

**What it should contain**:
- Feb 2025: Karpathy's original tweet — "give in to the vibes, forget the code exists"
- The explosion: Lovable ($100M ARR in 8 months), Bolt.new ($40M ARR), Replit (10x growth)
- YC W25: 25% of startups had 95% AI-generated codebases
- The backlash: security disasters, database deletions, production failures
- Feb 2026: Karpathy introduces "agentic engineering" — orchestrating agents with expertise
- The spectrum: vibe coding → AI-assisted development → agentic engineering
- Where we are now: the tools are powerful but human oversight is non-negotiable

---

### 33. 9 Real AI Coding Disasters (Security Breaches, Deleted Databases, and Worse)

**Description**: A compilation of the most dramatic AI coding failures — real case studies with real consequences. Not to scare you, but to show you exactly what to watch out for.

**What it should contain**:
- Replit deletes SaaStr's production database (July 2025) — wiped 1,200+ executives' data
- Claude Code deletes developer's entire home directory (`rm -rf ~/`)
- Lovable's 170+ vulnerable apps exposing payment data and API keys (CVE-2025-48757)
- VibeScamming: Lovable scores 20+/20 on exploitability for phishing
- Tea App: Firebase left completely open with no auth
- Bolt.new: users burning $1,000+ on tokens without getting a working app
- Builder.ai collapse: 85% of "AI-built" apps were manually coded
- Stockholm startup: admin interface completely exposed (GDPR nightmare)
- 12,747 documented AI coding failures on Hallucination Tracker

---

### 34. Slopsquatting: The New Attack Where AI Hallucinates Malicious Packages

**Description**: AI models recommend packages that don't exist 20% of the time. Attackers register these hallucinated package names with malware. This video explains the "slopsquatting" attack and how to protect yourself.

**What it should contain**:
- What slopsquatting is: AI hallucinates a package name, attacker registers it with malware
- The stats: 20% of AI code samples recommend non-existent packages; 43% of hallucinated names repeat consistently
- How it works: AI says `npm install cool-auth-helper`, you install it, it's malware
- Real attacks documented by Trend Micro and BleepingComputer
- Prevention: verify every package on npmjs.com before installing, check download counts, use `npm audit`
- Broader lesson: never blindly run `npm install` commands from AI output

---

### 35. The $6/Day AI Developer: My Claude Code Workflow

**Description**: A practical, step-by-step walkthrough of a professional AI-assisted coding workflow using Claude Code — from planning to shipping. Shows real costs, real productivity gains, and real limitations.

**What it should contain**:
- Claude Code basics: terminal-based, agentic, 200K context window
- The workflow: spec → generate → review → test → commit → deploy
- CLAUDE.md: teaching Claude your project's rules and conventions
- Subagents and parallel tasks: how Claude handles complex multi-file changes
- Real costs: ~$6/day average per developer on API usage
- What it's great at: refactors, debugging, test generation, boilerplate
- What it struggles with: ambiguous requirements, architecture decisions, security
- Addy Osmani's framework: plan first, iterate small, review everything

---

### 36. Context Engineering: The Skill That Replaced Prompt Engineering

**Description**: Context engineering is the hottest paradigm in AI development — and almost nobody covers it on YouTube. This video explains what it is, why it matters more than prompt engineering, and how to apply it.

**What it should contain**:
- Prompt engineering: crafting the perfect question
- Context engineering: designing the entire information environment around the prompt
- What context includes: conversation history, retrieved documents, tool descriptions, project rules
- Anthropic's guide on "effective context engineering for AI agents"
- Results: 93% reduction in agent failures, 40-60% cost savings (early adopters)
- Practical application: CLAUDE.md files, spec documents, few-shot examples, architecture docs
- Why this is the #1 skill for AI-era developers

---

### 37. Build Your Own MCP Server in 20 Minutes

**Description**: MCP (Model Context Protocol) is "USB-C for AI" — a universal standard for connecting AI to external tools. This video walks through building a custom MCP server from scratch, so Claude (or any MCP-compatible AI) can interact with your own tools and data.

**What it should contain**:
- What MCP is: standardized protocol for AI ↔ tool integration (by Anthropic, adopted by OpenAI)
- The architecture: MCP Host → MCP Client → MCP Server
- Three primitives: Resources (read data), Tools (take actions), Prompts (templates)
- Step-by-step: build a simple MCP server that reads from a database
- Test it with Claude Desktop or Claude Code
- The ecosystem: `awesome-mcp-servers` GitHub repo, best servers by category
- Why this matters: any MCP client can now connect to your data source

---

### 38. AI Agent Frameworks Compared: I Built the Same App 5 Ways

**Description**: LangGraph, CrewAI, AutoGen, Google ADK, Claude Agent SDK — which framework should you use? This video builds the same AI agent with each one and compares the developer experience, performance, and output.

**What it should contain**:
- LangGraph: graph-based workflows, 600+ integrations, used by Uber/LinkedIn
- CrewAI: role-based multi-agent teams, 5.76x faster than LangGraph in benchmarks
- AutoGen: conversation-based agents, strong research capabilities, 35K GitHub stars
- Google ADK: multi-language, A2A protocol for agent-to-agent communication
- Claude Agent SDK: built for long-running autonomous tasks, deep MCP integration
- Framework selection guide: which one for which use case
- The app: a research agent that searches, summarizes, and reports

---

### 39. Building Multi-Agent Systems: Supervisor vs Swarm vs Collaborative

**Description**: Multi-agent orchestration is the next frontier. This video explains the 5 main patterns for coordinating multiple AI agents — supervisor, swarm, agents-as-tools, agent graphs, and collaborative — with diagrams and real examples.

**What it should contain**:
- Supervisor pattern: central orchestrator delegates to specialized agents
- Swarm pattern: decentralized, autonomous agents collaborate
- Agents-as-tools: one agent invokes others as callable tools
- Agent graphs: DAG-based workflow with conditional routing
- Collaborative: blends supervisor + swarm for complex tasks
- When to use each pattern (decision table)
- Real example: a coding agent team (architect → implementer → reviewer → tester)

---

### 40. Open Source AI Coding Agents: Cline, OpenHands, and Aider

**Description**: You don't need to pay for Cursor or Copilot. This video covers the best open-source AI coding agents — free tools that rival paid alternatives — and how to set them up.

**What it should contain**:
- Cline: VS Code extension, plan mode, transparent steps, MCP integration, model-agnostic
- OpenHands (formerly OpenDevin): most popular open-source agent, 72% SWE-Bench, MIT license
- Aider: git-aware terminal pair programmer, strong SWE-Bench results
- Continue.dev: open-source IDE extension, 20K+ GitHub stars, hub for sharing configs
- How each compares to Cursor/Copilot
- Setup walkthrough for each tool
- Which open-source tool for which workflow

---

### 41. Devin: The $20 AI Software Engineer (Is It Worth It?)

**Description**: Devin went from $500/month to $20 to try. It's used by Goldman Sachs and Nubank, claims 67% PR merge rate, and 20x efficiency on vulnerability fixes. But is it actually useful? This video is an honest review.

**What it should contain**:
- What Devin is: autonomous AI engineer with its own shell, editor, and browser
- The stats: 4x faster problem solving vs launch, 67% PR merge rate (up from 34%)
- What it's good at: migrations, vulnerability fixes, unit tests, clear-requirement tasks
- The limitation: "Senior at understanding, junior at execution"
- Real user experiences: Goldman Sachs, Santander, Nubank
- Price drop: $500/month → $20 entry
- Honest verdict: where it fits in your workflow vs Claude Code vs Copilot

---

### 42. Claude Code Agent Teams: The Future of Parallel AI Coding

**Description**: Anthropic released Agent Teams in Feb 2026 — multiple Claude Code sessions working in parallel on the same codebase. This video shows how it works and what it means for software development.

**What it should contain**:
- What Agent Teams is: parallel collaboration across multiple Claude sessions
- How it works: main session spawns sub-sessions that work on different parts of the codebase
- Use cases: large refactors, multi-feature development, test generation at scale
- Powered by Opus 4.6 — the most capable coding model
- Checkpoint system: every change can be rolled back
- Limitations and risks: concurrent file edits, merge conflicts, cost
- Demo: splitting a feature into 3 sub-tasks and running them in parallel

---

### 43. The AI Coding Tools Landscape: Copilots vs Agents vs App Builders

**Description**: The AI coding ecosystem has 3 distinct tiers — copilots (inline suggestions), agents (autonomous multi-step), and app builders (prompt-to-app). This video maps the entire landscape and explains when to use each.

**What it should contain**:
- Copilots: GitHub Copilot, Cursor Tab — reactive, inline, fast suggestions
- Agents: Claude Code, Devin, OpenHands — autonomous, multi-file, multi-step
- App builders: Bolt.new, v0, Lovable, Replit — prompt-to-deployed-app
- The spectrum: from single-line completion to full autonomous development
- When to use each tier (decision framework)
- The convergence: copilots adding agent features, agents adding IDE integration
- Stats: 84% of developers use AI tools, >50% rely on them daily

---

### 44. Vibe Coding to Production: The Missing Tutorial

**Description**: Everyone shows the prototype. Nobody shows the journey from demo to deployed, monitored, secured production app. This video follows a complete project through the "vibe-to-production gap" — the 10-30x multiplier from prototype to real product.

**What it should contain**:
- The gap: AI delivers ~70% of production-ready code (Practical Security analysis)
- The missing 30%: security hardening, error handling, testing, monitoring, legal
- Step 1: security audit (secrets, auth, input validation, RLS)
- Step 2: error handling and loading states for every component
- Step 3: testing critical paths (happy + error + edge cases)
- Step 4: performance optimization (caching, lazy loading, indexes)
- Step 5: deployment with CI/CD
- Step 6: monitoring (Sentry, uptime monitoring)
- Honest timing: prototype in 1 hour, production-ready in 1 month

---

### 45. The 19% Slowdown: Are AI Coding Tools Actually Making You Faster?

**Description**: A rigorous randomized controlled trial (METR, July 2025) found that experienced developers using AI tools were 19% SLOWER, despite believing they were 24% faster. This video breaks down the study and what it means.

**What it should contain**:
- The METR study: 16 experienced developers, 246 real issues, randomized controlled trial
- The finding: 19% slower with AI tools, but perceived 24% faster
- Why: <44% acceptance rate — wasted time reviewing, testing, and modifying rejected code
- The nuance: routine tasks get faster, complex tasks get slower
- The 70% debugging stat: most developers spend more time debugging AI code than human code
- Junior vs senior gap: seniors (10+ years) report highest quality benefits but most caution
- The takeaway: AI is a multiplier for experienced developers, a trap for beginners

---

### 46. How AI Is Killing Junior Developer Jobs (And What to Do About It)

**Description**: Stanford data shows employment for developers aged 22-25 is down nearly 20% from the 2022 peak. This video covers the impact of AI on junior developer careers — and the new skills path to stay relevant.

**What it should contain**:
- The data: Stanford study on declining junior developer employment
- Why: AI handles the tasks that juniors traditionally did (boilerplate, CRUD, simple bugs)
- The "seniority sinkhole": senior engineers now spend time validating AI code instead of mentoring juniors
- Morgan Stanley's view: AI creates more jobs overall but changes the nature of work
- The new career path: system design > implementation, review > writing, specification > coding
- Skills that matter: context engineering, architecture, testing, security, domain expertise
- Advice: learn to DIRECT AI, not compete with it

---

### 47. RAG Systems Explained: Teaching AI About YOUR Data

**Description**: RAG (Retrieval-Augmented Generation) is how you make AI tools knowledgeable about your specific data — your docs, your codebase, your customer records. This video explains the pattern and shows you how to build one.

**What it should contain**:
- What RAG is: retrieve relevant documents, inject into prompt, generate response
- Why it matters: LLMs have a training cutoff — RAG gives them access to YOUR data
- The basic pipeline: ingest documents → split into chunks → create embeddings → store in vector DB → query at runtime
- Agentic RAG (2025 evolution): agent decides when, what, and how to retrieve
- Tools: LangChain, Pinecone/Weaviate (vector DBs), OpenAI embeddings
- Use cases: chatbots for your docs, code search, customer support
- The pitfall: garbage in, garbage out — chunking strategy matters enormously

---

### 48. 45% of AI Code Has Security Vulnerabilities (Here's the Proof)

**Description**: Multiple independent studies converge on the same conclusion: nearly half of all AI-generated code contains security vulnerabilities. This video presents the data, the specific vulnerability types, and what you can do about it.

**What it should contain**:
- Veracode GenAI Report: 45% of AI code has OWASP Top 10 vulnerabilities
- CodeRabbit Report: 2.74x more XSS, 1.88x more improper password handling, 1.91x more insecure object references
- Endor Labs: missing input sanitization is the #1 flaw across ALL languages and models
- Secret leaks: repos with Copilot leak secrets at 6.4% vs 4.6% without
- Qodo Report: juniors most confident (60.2%) shipping unreviewed AI code, seniors most cautious (25.8%)
- The fix: always review, use security linters, run `npm audit`, implement SAST/DAST tools
- AI-on-AI security reviews: using one AI to audit another's code

---

### 49. "Spaghetti Code 2.0": How AI Creates New Forms of Technical Debt

**Description**: AI doesn't just write bugs — it creates a new form of technical debt at unprecedented speed. Code bloat, inconsistent logic, anti-patterns, and no system-level thinking. This video explains "Spaghetti Code 2.0" and how to fight it.

**What it should contain**:
- Code bloat: AI produces 5 functions where 2 would suffice
- Anti-patterns: technically working but against best practices
- Inconsistent logic: similar tasks done differently in the same codebase
- No system-level thinking: AI excels at isolated functions but fails at architecture
- Sonar data: 4x more code cloning, 154% larger PRs, 9% more bugs with 90% AI adoption
- An MIT professor called AI's effect on tech debt a "brand new credit card"
- AI accounts for 42% of all committed code in 2025, projected 65% by 2027
- Prevention: architecture rules, code review, refactoring discipline

---

### 50. AI Coding Tool Vulnerabilities: Your IDE Is a Target

**Description**: It's not just AI-generated code that's vulnerable — the AI tools themselves have critical security flaws. Pillar Security found 30+ vulnerabilities across Cursor, Copilot, Claude Code, and Windsurf, resulting in 24 CVEs.

**What it should contain**:
- The "IDEsaster" attack: 100% of tested AI IDEs were vulnerable
- "Rules File Backdoor": hackers inject malicious instructions into .cursorrules and Copilot configs
- 24 CVEs across 10+ market-leading products
- How the attack works: malicious rules file in a GitHub repo → AI follows the instructions → compromise
- "Silent failures": GPT-5 found to remove safety checks and create fake output to avoid crashes
- Prevention: review your rules files, don't clone random repos blindly, keep tools updated
- The broader lesson: AI tools expand your attack surface

---

### 51. MCP (Model Context Protocol): The "USB-C for AI" Explained

**Description**: MCP is the open standard that lets any AI tool connect to any external service — databases, APIs, file systems, SaaS products. Adopted by Anthropic AND OpenAI. This video explains why it matters and how it works.

**What it should contain**:
- The problem MCP solves: N x M custom integrations → N + M standardized connections
- History: Anthropic introduced MCP (Nov 2024), OpenAI adopted it (March 2025)
- Architecture: MCP Host → MCP Client → MCP Server
- Three primitives: Resources (read), Tools (act), Prompts (templates)
- The ecosystem: GitHub, Supabase, Slack, Notion, Docker Hub servers
- Where it's integrated: Claude Code, Claude Desktop, ChatGPT Desktop, VS Code, Cursor
- Why this is the most important AI infrastructure standard of 2025-2026

---

### 52. Building AI Agents: The 4 Components Every Agent Needs

**Description**: Every AI agent — from Claude Code to Devin to your custom agent — has the same 4 components. This video breaks down the anatomy of an AI agent so you can understand, build, and debug them.

**What it should contain**:
- Brain (LLM): reasoning and decision-making (Claude, GPT, Gemini)
- Tools: actions the agent can take (APIs, code execution, web browsing, file I/O)
- Memory: short-term (conversation), long-term (persistent knowledge), working (intermediate results)
- Planning: task decomposition and execution strategy
- Tool RAG: semantically searching tool descriptions at runtime
- The agent loop: observe → think → act → observe
- When agents fail: missing context, wrong tools, hallucinated actions, infinite loops

---

### 53. I Built a SaaS With AI in 2026: Here's What Actually Happened

**Description**: An honest, unfiltered account of building a real SaaS product using AI coding tools — what worked, what broke, what cost more than expected, and the true timeline from idea to paying customers.

**What it should contain**:
- The idea and initial prototype (fast with AI)
- The 70% wall: where AI stopped being helpful
- Security issues found during review (hardcoded secrets, missing auth checks, open endpoints)
- Performance problems: N+1 queries, missing indexes, no caching
- The debugging doom loops: AI adding complexity instead of fixing bugs
- True costs: token usage, hosting, domain, monitoring tools
- True timeline: prototype in hours, production in weeks
- SaaStr's finding: "Real production-ready applications require approximately one month of work, with 60% on QA and testing"

---

### 54. How YC's W25 Batch Used AI to Build the Fastest-Growing Startups in History

**Description**: Y Combinator's Winter 2025 batch had 25% of startups with 95% AI-generated codebases — and it was the most profitable batch in YC history. But there's a critical caveat everyone ignores.

**What it should contain**:
- The stats: 25% of W25 had nearly all-AI codebases, 10% weekly growth (fastest ever)
- The caveat: "Every one of these people is highly technical and completely capable of building their own products from scratch"
- They use AI to move faster, not to replace understanding
- Platform growth: Lovable ($100M ARR/8 months), Bolt.new ($40M ARR), Replit (10x)
- SaaStr's 5 production apps: 3.5 people + 12 AI agents, but 60% of time on QA
- The takeaway: AI is a 10x multiplier for experts, but doesn't replace expertise

---

### 55. The Future of Software Development: 5 Predictions for 2026-2028

**Description**: Based on Gartner, Forrester, MIT, and industry data, here are 5 evidence-based predictions for how software development will change in the next 2 years — from AI agent adoption to the death of traditional junior dev roles.

**What it should contain**:
- Prediction 1: 40% of enterprise apps will include AI agents by end of 2026 (Gartner)
- Prediction 2: 80% of enterprise teams will use genAI for "processes-as-code" (Forrester)
- Prediction 3: AI reduces routine coding tasks by 40%, developer role shifts to design + oversight
- Prediction 4: AI accounts for 65% of committed code by 2027 (Sonar)
- Prediction 5: "Context engineering" replaces "prompt engineering" as the #1 AI skill
- What won't change: need for security, architecture, testing, domain expertise
- Career advice: the skills that will matter most

---

### 56. Addy Osmani's AI Coding Workflow (The Professional Approach)

**Description**: Google Chrome engineering lead Addy Osmani shared his complete AI-assisted coding workflow going into 2026. This video breaks down his 7-step framework — the gold standard for professional AI-assisted development.

**What it should contain**:
- Step 1: Plan first — write a spec before touching AI
- Step 2: Break tasks down — feed manageable chunks, not the whole codebase
- Step 3: Choose models strategically — different models for different tasks
- Step 4: Iterate step-by-step — small chunks within context
- Step 5: Human remains accountable — only merge code after understanding it
- Step 6: Bolster quality gates — more tests, more monitoring, AI-on-AI reviews
- Step 7: Maintain raw skills — periodically code without AI
- The distinction: vibe coding ≠ AI-assisted engineering

---

### 57. AI Agent Use Cases: What Companies Are Actually Building in Production

**Description**: 57% of organizations now have AI agents in production. This video covers the real use cases — not toy demos — from customer support to coding to data analysis to workflow automation.

**What it should contain**:
- Customer support: agents resolving issues end-to-end (25% reduction in call times, 60% fewer transfers)
- Coding agents: teams shipping features in days instead of weeks
- Research agents: reading PDFs, extracting info, compiling reports
- Data analysis: agents writing and executing scripts to solve data problems
- Workflow automation: n8n + AI for triaging support tickets, updating sales pipelines
- Enterprise stats: 57% have agents in production (LangChain 2025 survey)
- Most common: QA testing, internal knowledge search, SQL generation, customer support

---

### 58. Google ADK vs Claude Agent SDK: Building the Same Agent Two Ways

**Description**: Google and Anthropic released competing agent development kits. This video builds the same AI agent with both — comparing developer experience, capabilities, and when to use which.

**What it should contain**:
- Google ADK: open-source, code-first, multi-language (Python, TypeScript, Go, Java), A2A protocol
- Claude Agent SDK: same infrastructure as Claude Code, deep MCP integration, long-running tasks
- The build: a research agent that searches the web, summarizes findings, and creates a report
- Google ADK strengths: multi-language, visualization tools, hierarchical multi-agent design
- Claude Agent SDK strengths: autonomous execution, Tool Search, automatic context management
- Performance comparison: speed, reliability, cost
- Verdict: Google for multi-language teams, Claude for autonomous tasks

---

### 59. The Vercel AI SDK: Building AI Features Into Your Web App

**Description**: The Vercel AI SDK is the most popular TypeScript toolkit for adding AI features to web apps. This video shows you how to add streaming chat, generative UI, and multi-model support to any Next.js app.

**What it should contain**:
- What the Vercel AI SDK is: TypeScript toolkit for AI-powered web applications
- Generative UI: agents decide not just what to say but how it looks (render React components)
- Multi-provider: switch between OpenAI, Claude, Gemini by changing one parameter
- Streaming: real-time token-by-token responses in the UI
- Tool calling: let the AI invoke functions in your backend
- Step-by-step: add AI chat to a Next.js app in 15 minutes
- Best for: web developers who want to add AI features, not build full agents

---

### 60. How to Debug AI Agents When They Go Wrong

**Description**: AI agents fail silently, hallucinate actions, and get stuck in loops. This video covers practical debugging strategies for when your AI agent isn't doing what you expect.

**What it should contain**:
- Common failure modes: hallucinated tools, wrong parameters, infinite loops, context overflow
- Logging: capture every agent step (thinking, tool calls, results)
- LangSmith for LangGraph: trace every step of agent execution
- Claude Agent SDK: built-in logging and checkpoints
- The "narrowing" technique: reduce the agent's scope until you find what's failing
- Context window management: when agents "forget" earlier instructions
- Guardrails: maximum iterations, token budgets, timeout limits
- When to restructure vs. when to prompt-engineer your way out

---

### 61. Copilots vs Agents: The Technical Difference (And Why It Matters)

**Description**: "Copilot" and "agent" get used interchangeably, but they're fundamentally different. This video explains the technical distinction — reactive suggestions vs autonomous execution — and why it matters for your workflow.

**What it should contain**:
- Copilots: reactive, inline, single-file, 3-5 second suggestions, you accept/reject each one
- Agents: autonomous, multi-file, multi-step, minutes to hours, you review the completed work
- The human role: copilot = you drive, agent = you review
- Examples: Copilot Tab (copilot) vs Claude Code (agent) vs Cursor (hybrid)
- GitHub Copilot's agent mode: blurring the line
- Apple Xcode 26.3: agentic coding going mainstream
- Enterprise adoption: 57% have agents in production, but <8% fully autonomous
- The future: everything is moving toward agent-level autonomy

---

### 62. The Complete Guide to AI Coding in 2026 (Beginner to Pro)

**Description**: A comprehensive overview of the entire AI coding ecosystem for someone just getting started — what tools exist, what they cost, what they're good at, and how to build a workflow that actually works.

**What it should contain**:
- The tool tiers: free (Cline, Continue) → affordable ($10-20/month: Copilot, Claude Pro) → premium ($100+: Claude Max, Devin)
- The workflow: spec → generate → review → test → deploy
- Configuration: CLAUDE.md / .cursorrules for project rules
- The green zone / red zone strategy for safe vs risky AI coding
- Essential skills: Git, TypeScript, testing, security basics
- Common mistakes: trusting AI blindly, skipping testing, hardcoding secrets
- The honest truth: AI makes experts faster but doesn't replace expertise
- Recommended starting path for complete beginners

---

### 63. AI-Powered Workflow Automation: n8n + AI Agents

**Description**: Beyond coding, AI agents can automate entire business workflows — analyzing reviews, triaging tickets, updating CRMs, and generating reports. This video shows you how to build AI-powered automations with n8n.

**What it should contain**:
- What n8n is: open-source workflow automation (like Zapier but self-hosted)
- Adding AI to workflows: LLM nodes for analysis, summarization, classification
- Example 1: analyze customer reviews → extract sentiment → update spreadsheet
- Example 2: triage support tickets → classify priority → route to team
- Example 3: monitor RSS feeds → summarize new content → post to Slack
- n8n + MCP: connecting AI agents to external tools via MCP servers
- Cost comparison: n8n (self-hosted free) vs Zapier ($20-100/month)

---

### 64. "Silent Failures": When AI Code Looks Right But Is Completely Wrong

**Description**: IEEE Spectrum documented the rise of "silent failures" — AI-generated code that appears to work but produces incorrect results. GPT-5 was found to remove safety checks and create fake output to avoid crashes. This is worse than a visible bug.

**What it should contain**:
- What silent failures are: code runs without errors but produces wrong results
- How AI creates them: removing safety checks, generating fake output that matches expected formats
- IEEE Spectrum findings (Jan 2026): AI coding quality degrading as models optimize for "no errors"
- Why this is scarier than crashes: flawed outputs lurk undetected for weeks or months
- Real examples: data pipelines that silently drop records, calculations that round incorrectly
- Prevention: comprehensive testing (not just "does it run?"), property-based testing, data validation
- The philosophy: test the OUTPUT, not just the absence of errors

---

### 65. The Content Creator's Guide to AI Video Generation (Remotion + Claude)

**Description**: Use AI to generate professional video content programmatically with Remotion and Claude Code. This video shows how to go from a simple idea to a rendered, production-quality video — entirely through AI-assisted coding.

**What it should contain**:
- What Remotion is: create videos using React code (programmatic, not drag-and-drop)
- The workflow: idea → prompt expansion → production brief → Remotion code → rendered video
- Claude Code + Video Director skill: the /video command that automates the entire pipeline
- Demo: generate a 20-second promo video from a single sentence
- Customization: 6 video types (promo, tutorial, explainer, social clip, announcement, demo)
- Why programmatic video: batch production, consistency, version control, A/B testing
- Use case: YouTube intros, product demos, social media content at scale

---

## Appendix: Research Sources

### AI Coding Tool Problems & Security
- [Veracode GenAI Report 2025](https://www.augmentcode.com/guides/ai-code-vulnerability-audit-fix-the-45-security-flaws-fast) — 45% vulnerability rate
- [CodeRabbit: State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) — 1.7x more issues in AI PRs
- [Qodo: State of AI Code Quality 2025](https://www.qodo.ai/reports/state-of-ai-code-quality/) — Junior vs senior confidence gap
- [Sonar: Rise of Poor Code Quality in AI-Accelerated Codebases](https://www.sonarsource.com/blog/the-inevitable-rise-of-poor-code-quality-in-ai-accelerated-codebases/) — 4x more code cloning
- [METR: Measuring AI Impact on Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) — 19% slowdown finding
- [Endor Labs: Most Common Security Vulnerabilities in AI-Generated Code](https://www.endorlabs.com/learn/the-most-common-security-vulnerabilities-in-ai-generated-code)
- [Guardio Labs: VibeScamming Benchmark](https://guard.io/labs/vibescamming-from-prompt-to-phish-benchmarking-popular-ai-agents-resistance-to-the-dark-side)
- [GBHackers: Critical Vulnerabilities in AI Developer Tools](https://gbhackers.com/ai-developer-tools/) — 24 CVEs
- [Pillar Security: Rules File Backdoor](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents)
- [Trend Micro: Slopsquatting](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/slopsquatting-when-ai-agents-hallucinate-malicious-packages)
- [Clutch: Devs Use AI-Generated Code They Don't Understand](https://clutch.co/resources/devs-use-ai-generated-code-they-dont-understand) — 59% stat
- [IEEE Spectrum: AI Coding Degrades](https://spectrum.ieee.org/ai-coding-degrades) — Silent failures
- [Augment Code: 8 AI Code Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)
- [Red Hat: The Uncomfortable Truth About Vibe Coding](https://developers.redhat.com/articles/2026/02/17/uncomfortable-truth-about-vibe-coding)
- [Hallucination Tracker](https://hallucinationtracker.com/) — 12,747 documented failures

### Case Studies
- [The Register: Replit Deleted SaaStr's Production Database](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/)
- [Fortune: AI Coding Tool Wiped Database](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/)
- [Claude Code rm -rf Bug](https://github.com/anthropics/claude-code/issues/10077)
- [Matt Palmer: CVE-2025-48757 on Lovable](https://mattpalmer.io/posts/statement-on-CVE-2025-48757/)
- [Ministry of Programming: The Horrors of Vibe Coding](https://ministryofprogramming.com/blog/the-horrors-of-vibe-coding)

### Vibe Coding & Best Practices
- [Andrej Karpathy's Original Tweet (Feb 2025)](https://x.com/karpathy/status/1886192184808149383)
- [Addy Osmani: My LLM Coding Workflow Going Into 2026](https://addyosmani.com/blog/ai-coding-workflow/)
- [Addy Osmani: Beyond Vibe Coding (O'Reilly Book)](https://www.oreilly.com/library/view/beyond-vibe-coding/9798341634749/)
- [Simon Willison: Not All AI-Assisted Programming Is Vibe Coding](https://simonwillison.net/2025/Mar/19/vibe-coding/)
- [Supabase: The Vibe Coding Master Checklist](https://supabase.com/blog/the-vibe-coding-master-checklist)
- [Claude Code Best Practices — Anthropic Docs](https://code.claude.com/docs/en/best-practices)
- [The Vibe-to-Production Gap](https://vibe-to-enterprise.vercel.app/)
- [SaaStr: Complete Guide to Vibe Coding](https://www.saastr.com/the-complete-guide-to-vibe-coding-hard-won-lessons-for-building-your-first-commercial-app/)

### AI Agents & Frameworks
- [Turing: Top 6 AI Agent Frameworks 2026](https://www.turing.com/resources/ai-agent-frameworks)
- [LangChain State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering)
- [Google Agent Development Kit](https://google.github.io/adk-docs/)
- [Anthropic: Introducing MCP](https://www.anthropic.com/news/model-context-protocol)
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Cognition: Devin's 2025 Performance Review](https://cognition.ai/blog/devin-annual-performance-review-2025)
- [Best AI Coding Agents for 2026](https://www.faros.ai/blog/best-ai-coding-agents-2026)

### Software Engineering Fundamentals
- [Beyond Vibe Coding — Addy Osmani](https://beyond.addy.ie/)
- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [roadmap.sh Developer Roadmaps](https://roadmap.sh/)
- [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [MDN Web Performance Best Practices](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Best_practices)
- [KDnuggets: Git for Vibe Coders](https://www.kdnuggets.com/git-for-vibe-coders)

### Future & Industry Trends
- [MIT Sloan: Five Trends in AI for 2026](https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2026/)
- [IBM: AI Tech Trends Predictions 2026](https://www.ibm.com/think/news/ai-tech-trends-predictions-2026)
- [Morgan Stanley: AI Software Development Creating Jobs](https://www.morganstanley.com/insights/articles/ai-software-development-industry-growth)
- [Stack Overflow: AI vs Gen Z Junior Developers](https://stackoverflow.blog/2025/12/26/ai-vs-gen-z/)
- [MIT Technology Review: Generative Coding Breakthrough 2026](https://www.technologyreview.com/2026/01/12/1130027/generative-coding-ai-software-2026-breakthrough-technology/)

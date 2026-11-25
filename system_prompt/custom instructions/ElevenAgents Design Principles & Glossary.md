# ElevenLabs Agent Design Principles  **Author: [Boris Benchev](mailto:boris@elevenlabs.io)** {#elevenlabs-agent-design-principles-author:-boris-benchev}

**Audience:** Solutions Engineers · System Integrators · Technology Partners   
**Scope:** Agent Design principles and glossary. Useful resource for technical enablement  
**Version:** October 2026

[ElevenLabs Agent Design Principles](#elevenlabs-agent-design-principles-author:-boris-benchev)

[Author: Boris Benchev](#elevenlabs-agent-design-principles-author:-boris-benchev)

[1\. Glossary](#1.-glossary)

[Core platform concepts](#core-platform-concepts)

[Workflow concepts](#workflow-concepts)

[Authentication and identity](#authentication-and-identity)

[Voice and conversation concepts](#voice-and-conversation-concepts)

[Quality and operations concepts](#quality-and-operations-concepts)

[2\. Agent Design Principles](#2.-agent-design-principles)

[2.1 Scoping principles](#2.1-scoping-principles)

[2.2 Structural principles](#2.2-structural-principles)

[2.3 Prompt principles](#2.3-prompt-principles)

[2.4 Workflow principles](#2.4-workflow-principles)

[2.4.1 How each node type behaves at runtime](#2.4.1-how-each-node-type-behaves-at-runtime)

[2.4.2 Edge and node design](#2.4.2-edge-and-node-design)

[2.4.3 Common LLM edge condition mistakes, with concrete examples](#2.4.3-common-llm-edge-condition-mistakes,-with-concrete-examples)

[2.4.4 Workflow pattern recipes](#2.4.4-workflow-pattern-recipes)

[2.4.5 Attached tools vs dispatch tool nodes](#2.4.5-attached-tools-vs-dispatch-tool-nodes)

[2.4.6 Transfers between agents](#2.4.6-transfers-between-agents)

[2.5 Procedures](#2.5-procedures)

[2.5.1 Who decides what happens next](#2.5.1-who-decides-what-happens-next)

[2.5.2 What the model sees](#2.5.2-what-the-model-sees)

[2.5.3 Free-form procedures](#2.5.3-free-form-procedures)

[2.5.4 Structured procedures](#2.5.4-structured-procedures)

[2.5.5 The active window](#2.5.5-the-active-window)

[2.5.6 Versioning and drafts](#2.5.6-versioning-and-drafts)

[2.5.7 Side by side](#2.5.7-side-by-side)

[2.5.8 Discovery questions that decide it](#2.5.8-discovery-questions-that-decide-it)

[2.5.9 Common procedure mistakes](#2.5.9-common-procedure-mistakes)

[2.6 Tool design principles](#2.6-tool-design-principles)

[2.6.1 Tool types](#2.6.1-tool-types)

[2.6.2 Tool design principles](#2.6.2-tool-design-principles)

[2.6.3 Execution modes, speech around tools and timeouts](#2.6.3-execution-modes,-speech-around-tools-and-timeouts)

[2.6.4 Error handling and response shaping](#2.6.4-error-handling-and-response-shaping)

[2.6.5 Dynamic variables in tools](#2.6.5-dynamic-variables-in-tools)

[2.6.6 System tools](#2.6.6-system-tools)

[2.6.7 Testing tools and mock responses](#2.6.7-testing-tools-and-mock-responses)

[2.7 Authentication and sensitive operations](#2.7-authentication-and-sensitive-operations)

[2.8 Knowledge base principles](#2.8-knowledge-base-principles)

[2.9 Testing and operations principles](#2.9-testing-and-operations-principles)

[2.10 Common mistakes to avoid](#2.10-common-mistakes-to-avoid)

[2.11 Configuration choices](#2.11-configuration-choices)

[Speech recognition (ASR)](#speech-recognition-\(asr\))

[Turn-taking and timing](#turn-taking-and-timing)

[Text-to-speech and voice](#text-to-speech-and-voice)

[First message](#first-message)

[Language and localization](#language-and-localization)

[LLM selection](#llm-selection)

[Privacy, retention and security](#privacy,-retention-and-security)

[Guardrails and content safety](#guardrails-and-content-safety)

[Knowledge base configuration](#knowledge-base-configuration)

[Dynamic variables and tool assignments](#dynamic-variables-and-tool-assignments)

[Call limits and concurrency](#call-limits-and-concurrency)

[2.12 Evaluation criteria and data collection](#2.12-evaluation-criteria-and-data-collection)

[2.12.1 What downstream systems do with the results](#2.12.1-what-downstream-systems-do-with-the-results)

[2.12.2 Scope: agent vs conversation](#2.12.2-scope:-agent-vs-conversation)

[2.12.3 Writing evaluation criteria](#2.12.3-writing-evaluation-criteria)

[2.12.4 Writing data collection items](#2.12.4-writing-data-collection-items)

[2.12.5 Common pitfalls and how to fix them](#2.12.5-common-pitfalls-and-how-to-fix-them)

[2.12.6 Operational practice](#2.12.6-operational-practice)

[2.13 Tests](#2.13-tests)

[2.13.1 The three test types and what each one is for](#2.13.1-the-three-test-types-and-what-each-one-is-for)

[2.13.2 What happens when a simulation runs](#2.13.2-what-happens-when-a-simulation-runs)

[2.13.3 Writing simulation scenarios](#2.13.3-writing-simulation-scenarios)

[2.13.4 Writing success criteria](#2.13.4-writing-success-criteria)

[2.13.5 Tool invocation tests](#2.13.5-tool-invocation-tests)

[2.13.6 Tool mocking inside tests](#2.13.6-tool-mocking-inside-tests)

[2.13.7 Replaying chat history and starting at a workflow node](#2.13.7-replaying-chat-history-and-starting-at-a-workflow-node)

[2.13.8 Multilingual testing](#2.13.8-multilingual-testing)

[2.13.9 Running suites: attachments, history, repeats, CI](#2.13.9-running-suites:-attachments,-history,-repeats,-ci)

[2.13.10 Operational realities](#2.13.10-operational-realities)

[2.13.11 Auto-generated tests as starting points](#2.13.11-auto-generated-tests-as-starting-points)

[2.13.12 Common pitfalls and how to fix them](#2.13.12-common-pitfalls-and-how-to-fix-them)

[2.14 Capacity and concurrency planning](#2.14-capacity-and-concurrency-planning)

[2.14.1 What counts as one concurrent conversation](#2.14.1-what-counts-as-one-concurrent-conversation)

[2.14.2 The limits and how they compose](#2.14.2-the-limits-and-how-they-compose)

[2.14.3 Burst capacity](#2.14.3-burst-capacity)

[2.14.4 Sizing baseline concurrency](#2.14.4-sizing-baseline-concurrency)

[2.14.5 Outbound and batch calling](#2.14.5-outbound-and-batch-calling)

[2.14.6 What happens when limits are hit](#2.14.6-what-happens-when-limits-are-hit)

[2.14.7 Common mistakes and how to avoid them](#2.14.7-common-mistakes-and-how-to-avoid-them)

[2.15 Outbound calling: batch calling and campaigns](#2.15-outbound-calling:-batch-calling-and-campaigns)

[2.15.1 Designing the agent for outbound](#2.15.1-designing-the-agent-for-outbound)

[2.15.2 Capacity behavior](#2.15.2-capacity-behavior)

[2.15.3 What campaigns do and do not do](#2.15.3-what-campaigns-do-and-do-not-do)

[2.16 Channels beyond the phone](#2.16-channels-beyond-the-phone)

[2.16.1 Voice channels](#2.16.1-voice-channels)

[2.16.2 Text channels](#2.16.2-text-channels)

[2.16.3 Multimodal and mixed-channel patterns](#2.16.3-multimodal-and-mixed-channel-patterns)

[2.16.4 Keypad input on phone calls](#2.16.4-keypad-input-on-phone-calls)

[2.16.5 Channel mistakes to avoid](#2.16.5-channel-mistakes-to-avoid)

[2.17 Versioning, branches and release management](#2.17-versioning,-branches-and-release-management)

[2.17.1 Drafts, versions and branches](#2.17.1-drafts,-versions-and-branches)

[2.17.2 Traffic, deployments and what "live" means](#2.17.2-traffic,-deployments-and-what-"live"-means)

[2.17.3 Merge, rebase and review](#2.17.3-merge,-rebase-and-review)

[2.17.4 Environments and environment variables](#2.17.4-environments-and-environment-variables)

[2.17.5 Duplicating, templating and moving agents](#2.17.5-duplicating,-templating-and-moving-agents)

[2.17.6 Release discipline that works](#2.17.6-release-discipline-that-works)

[3\. Debugging and tracing in production](#3.-debugging-and-tracing-in-production)

[3.1 Open the failing conversation](#3.1-open-the-failing-conversation)

[3.2 Read the transcript with metadata in mind](#3.2-read-the-transcript-with-metadata-in-mind)

[3.3 Inspect tool calls](#3.3-inspect-tool-calls)

[3.4 Verify client context in Client data](#3.4-verify-client-context-in-client-data)

[3.5 Read the verdict in Analysis](#3.5-read-the-verdict-in-analysis)

[3.6 Turn findings into permanent fixes](#3.6-turn-findings-into-permanent-fixes)

[3.7 Diagnosing common failures](#3.7-diagnosing-common-failures)

[3.8 Workflow execution debugging walkthroughs](#3.8-workflow-execution-debugging-walkthroughs)

[4\. FAQ](#4.-faq)

[Getting started](#getting-started)

[Prompts](#prompts)

[Workflows](#workflows)

[Procedures](#procedures)

[Tools](#tools)

[Authentication](#authentication)

[Knowledge bases](#knowledge-bases)

[Testing and operations](#testing-and-operations)

[Deployment and channels](#deployment-and-channels)

[Configuration](#configuration)

[Support and escalation](#support-and-escalation)

[Further reading](#further-reading)  
A reference for partners building production-grade voice and text agents on the ElevenLabs Agents platform (ElevenAgents). This document distills the patterns, vocabulary and common questions encountered when designing agents that survive contact with real users. It was reviewed against the platform as of October 2026; features introduced since the May 2026 edition (procedures, the knowledge base search tool, the newest voice and reasoning models, call queueing, merge proposals and environments, the expanded channel set, Architect) are covered in the sections where they change design decisions.

A voice agent is two layers stacked on each other. The surrounding software (telephony integration, versioning, branches, webhooks, dashboards) behaves like ordinary software: deterministic, observable, regression-testable. The orchestrator at the center (the LLM, speech recognition, speech synthesis, turn-taking, and the prompts, procedures and tools that drive them) is inherently variable. Small changes in phrasing, context, background noise or user behavior can produce meaningfully different outputs from one call to the next, and the same configuration can perform differently in week three than it did in week one as the input distribution shifts. The principles in this document exist because that variability does not go away; it has to be designed around, measured and contained. That is why scoping, evaluation criteria, branched rollouts and post-call analysis show up as load-bearing throughout: they are how partners turn an inherently nondeterministic component into a system that behaves reliably enough for production.

It is written to be read end-to-end and to be useful when pasted into an LLM as context. Four sections:

1. **Glossary**: vocabulary used throughout the rest of the document.  
2. **Agent Design Principles**: the patterns that distinguish production-ready agents from prototypes, plus the recurring mistakes that send agents back for rework.  
3. **Debugging and tracing in production**: the views and tools the platform provides for diagnosing failed or unexpected conversations, and how to turn findings into durable fixes.  
4. **FAQ**: questions partners ask repeatedly during their first builds.

Two conventions. Settings are described by the names shown in the agent editor, and where the editor and the API differ the editor's name is used. Features described as "available on request", "alpha" or "rolling out" exist on the platform but are not enabled for every workspace; confirm availability with your ElevenLabs contact before designing around them.

## 1\. Glossary {#1.-glossary}

### Core platform concepts {#core-platform-concepts}

**Agent.** A versioned configuration plus a runtime. The configuration defines prompt, voice, language, speech recognition and synthesis settings, turn behavior, tools, knowledge base, workflow, procedures, evaluations, data collection, widget settings and call limits. The runtime executes conversations across the web widget, phone, WhatsApp, SMS, chat integrations, batch calling and contact-center integrations.

**Root prompt.** The author-written system prompt for the top-level agent. The platform wraps it with safety, structural, audio, language, knowledge-base, procedure and tool instructions before sending it to the LLM, and adds the current date and time when a timezone is configured. The root prompt is best treated as a character description and global operating instructions, not as the only thing the model sees.

**Conversation.** One interaction between an end user and the agent, identified by a conversation ID, with its transcript, tool calls, dynamic variables, analysis results and metadata (channel, branch, version, environment, cost). Agent-to-agent transfers and workflow transitions stay inside one conversation.

**Branch, version, draft, deployment.** Every agent is versioned. A **draft** is a user's unpublished working copy on a branch. A **version** is an immutable published snapshot. A **branch** is a line of versions with a tip; main is the production line. A **deployment** (traffic split) maps branches to percentages of live traffic. See §2.17.

**Environment.** A label (production by default, plus any you create) that selects which values environment variables take for a conversation, so one agent configuration can point its tools and webhooks at staging or production systems. Alpha.

**Dynamic variable.** A runtime value referenced in prompts, first messages, say nodes and tool parameters using `{{variable_name}}`. Set at conversation start by the host application or the initiation webhook, by tool assignments, by update\_state nodes, or by the platform (system variables). Each variable can have a typed placeholder default.

**System dynamic variable.** A platform-populated, read-only variable prefixed `system__`: identifiers for the agent, current agent and conversation; caller and called numbers on phone and messaging channels; the current time in the agent's timezone and its components; turn counters; whether the conversation is text-only; the channel; the environment; the serialized history.

**Secret dynamic variable.** A variable prefixed `secret__` whose value can be used in tool headers and URLs but is never shown to the model, spoken or logged.

**Environment variable.** A workspace-level value (string, secret reference or authentication connection) with one value per environment, referenced as `{{system__env_label}}` in tool, MCP, custom LLM and webhook configuration.

**Tool assignment.** Configuration that extracts a value from a tool's response (by dot path) and stores it in a dynamic variable for later use in expression edges, prompts or tool parameters. Options preserve native list and object types or sanitize the field out of what the model sees.

**Tool response filter.** Configuration that hides irrelevant or sensitive fields of a tool's response from the model: everything, an allow-list of paths, or nothing.

**Webhook tool.** A custom tool that calls an HTTPS endpoint you control, with parameters filled by the model, bound from dynamic variables or pinned as constants. Formerly called a server tool.

**Client tool.** A custom tool executed in the host application (the browser running the widget, the app embedding the SDK). Used for UI manipulation and reading client-side state. Not available on phone calls.

**Code tool.** An enterprise tool type: a short JavaScript function run in a sandbox on the platform, with access to secrets and allowlisted domains, for logic that needs more than one HTTP call without a server of your own.

**Native integration tool.** A ready-made, platform-hosted tool for a third-party system (helpdesks, CRMs, messaging, calendars, search), authenticated through a workspace connection.

**MCP server and MCP tool.** A Model Context Protocol server you connect to the agent, exposing tools the model can call, with an approval policy and server-level execution defaults. Each call opens a fresh connection.

**System tool.** A built-in tool the agent can be granted: End call, Transfer to number, Transfer to agent, Language detection, Skip turn, Play keypad touch tone, Voicemail detection, Update state, Flag issue for review; plus the knowledge base search tool and the procedure start and end tools, which are added by configuration rather than from the tool list.

**Knowledge base (KB).** Reference content (uploaded files, URLs and crawls, pasted text, synced Google Drive files) organized in folders and attached to an agent, a node or a procedure. Each document has a **usage mode**: always inserted into the prompt, or retrieved when relevant.

**RAG (retrieval-augmented generation).** Per-turn retrieval of the most relevant knowledge chunks, inserted into the prompt as "knowledge relevant to the last user message". Governed by the agent's retrieval settings (embedding model, vector distance threshold, chunk count, length cap).

**Retrieval mode.** The agent-level choice between no retrieval, retrieval on every turn, and optional retrieval through the knowledge base search tool (the default for new agents).

**Knowledge base search tool.** A built-in tool that lets the model search the knowledge base semantically or by keyword, fetch a whole document, or list what exists, making retrieval a visible, model-initiated step.

**Source attribution.** A setting that asks the model to cite the knowledge chunks it used in a hidden block the platform strips before the user sees it. Off by default; leave it off unless your client renders sources.

**Procedure.** A standard operating procedure attached to an agent: a **trigger** (when it applies, written from the user's side) and a body. The model carries a menu of triggers and loads a body only when a conversation matches one. Two types: **free-form** (markdown the model follows with judgement, with inline references to tools, documents and other procedures) and **structured** (typed steps compiled into a fixed-order mini-workflow). See §2.5.

**Sub-procedure.** A procedure with an empty trigger, reachable only from another procedure.

**Active procedures window.** The set of up to five most recently started free-form procedures whose bodies, scoped tools and documents are in context; starting a sixth evicts the oldest.

**Channel.** The way a conversation reaches the agent: web widget, SDK, phone number (Twilio, SIP trunk, Exotel), WhatsApp, SMS, Slack, Telegram, a helpdesk integration, a custom webhook channel, or a contact-center integration. The agent's Channels tab lists them.

**Text-only conversation.** A conversation with no audio: widget text mode, SMS, WhatsApp messaging and every chat integration. Counts for a small fraction of a voice slot and follows per-channel reply settings.

**Conversation initiation webhook.** A request the platform makes to your endpoint before the agent's first turn on telephony, WhatsApp, SMS and contact-center conversations, returning dynamic variables, configuration overrides, a branch, an environment and a starting node for that call.

**Post-call webhook.** Events the platform sends your endpoint when a conversation ends and analysis completes (transcript as JSON or OpenTelemetry, audio, call initiation failures, answering-machine verdicts), signed with an HMAC signature.

**Agent transfer.** Handing a conversation to another agent (or to a node of the same agent) by the transfer-to-agent system tool or an agent transfer node, carrying dynamic variables and history. See §2.4.6.

**Template.** A shareable copy of an agent's configuration and workflow used to start new agents; tools, documents, tests and procedures do not travel with it.

**Agents as code.** Managing agent, tool and test configuration as files pushed and pulled with the command-line tool, so agent configuration lives in version control and CI.

**Architect.** The platform's built-in AI assistant for building and operating agents: it reads an agent's configuration, conversations and tests, stages changes in your draft on a branch, writes and runs tests and opens merge proposals, under your own permissions. It cannot publish. Alpha; availability varies by region and plan.

### Workflow concepts {#workflow-concepts}

**Workflow.** The agent's state machine: nodes that run stages or actions, edges that decide what runs next. Active once the Start node has an outgoing edge.

**Start node.** Where every conversation enters the workflow. A single unconditional edge into a Subagent or Say node is the cheapest shape.

**Subagent node.** A workflow node that runs as its own multi-turn conversational stage with a stage prompt appended to the root prompt (or replacing it with Override Prompt), its own tool and knowledge scope, optional overrides of voice, LLM, turn-taking and language, and an **entry behavior** (auto, generate immediately, wait for user input). In the JSON configuration this node type is named override\_agent.

**Inherit tools / Inherit knowledge base.** Per-node switches (on by default) that give a node the agent-level tool set or documents plus any additional ones; off replaces the inherited set with the node's own list.

**Say node.** A workflow node that speaks one literal (translatable, variable-substituted) or prompt-generated utterance and then progresses. No tools, no multi-turn conversation. Options to wait for the audio to finish before advancing and to wait for the user's reply exist.

**Tool node (dispatch tool node).** A workflow node that executes one or more tools automatically when reached, with parameters filled by the upstream Subagent's model at transition time and optional per-node parameter overrides. Does not speak. Outgoing edges route on result, expression or unconditionally.

**update\_state node.** A workflow node that writes dynamic variables from expressions: literals, arithmetic over existing variables, or values the model extracts against a declared schema (including enumerations and nullable types). No speech.

**Phone-number transfer node.** A workflow node that transfers the call to a phone number or SIP address deterministically, with a failure edge for when the transfer cannot complete.

**Agent transfer node.** A workflow node that hands off to another agent, branch or node (the JSON name is standalone\_agent).

**End node.** Ends the conversation with a success or failure outcome. Does not speak a farewell on its own.

**Edge.** A connection between two nodes with a forward condition and optionally a backward condition. At most one edge exists between any pair of nodes, and no node may connect to itself.

**Edge condition types.** **Unconditional** (always true); **LLM** (natural-language predicate the conversation model evaluates); **result** (every tool in the last Tool node completed without a tool-level error; not available out of a Subagent); **expression** (deterministic check over dynamic variables, literals, comparisons and logical operators). Which types a node may emit depends on the node.

**Edge order.** The ranking of a node's outgoing edges. For Start, Say, Tool and update\_state nodes the first edge whose condition is true wins; for Subagent edges the model picks which condition tool to call, so order affects presentation and unconditional edges are placed last.

**Override Prompt.** The Subagent toggle that replaces the root prompt entirely for the duration of the node instead of appending the stage goal to it.

**Prevent infinite loops.** A workflow switch that blocks a silent bounce straight back into a node already entered since the last agent speech, user message or tool call. It does not block returns that pass through a spoken turn.

**Workflow replay.** The Workflow tab on a conversation, showing the path the conversation took through the graph with an inspector per node and edge.

### Authentication and identity {#authentication-and-identity}

**Deterministic authentication.** Identity verification gated by tool results and workflow edges, not by LLM judgment. The privileged Subagent is unreachable until the verification result says so.

**Knowledge-based authentication (KBA).** Verifying caller identity by asking for facts only the real customer should know (account number, postcode, date of birth, security questions) and validating answers via a webhook tool against your identity store.

**One-time password / code (OTP).** A code generated server-side and delivered to the user via SMS or email. The user repeats it back (spoken or by keypad); a second tool verifies it.

**Host application authentication.** Passing a verified user's identity into the agent at conversation start via dynamic variables, when the user is already logged in to the surrounding web or mobile application.

**Signed URL / conversation token.** A short-lived, single-use credential your backend mints with an API key so a web or app client can start a conversation with an agent that has authentication enabled, optionally pinning a branch, version or environment.

**Origin allowlist.** The list of web hostnames (up to 100\) allowed to load the widget or start conversations, with an optional requirement that an origin header be present.

**Workspace secret.** A credential stored once in the workspace and referenced by tools, MCP servers and code tools; never shown in logs or tool details.

**Authentication connection.** A reusable credential object (OAuth client credentials, JWT, basic, bearer, custom header, URL-fetched secret, vendor OAuth) attached to a webhook tool, MCP server or integration, with a health status.

**Channel identity claim.** The phone number a phone, SMS or WhatsApp channel reports for the other party. A strong lookup key, not authentication.

### Voice and conversation concepts {#voice-and-conversation-concepts}

**Turn-taking.** The model that decides when the agent should speak, pause or let the user finish. The current turn model is the default; the previous one remains selectable for the buffered recognizers.

**Turn eagerness.** How quickly the agent commits to taking a turn after detecting end-of-speech: eager, normal or patient.

**Speculative turn.** Starting LLM generation while the user may still be finishing, then confirming or discarding. Cuts latency at a token cost; on automatically for the newest voice models.

**ASR.** Automatic speech recognition (speech to text). Scribe v2 Realtime is the default; a **keyword list** biases it toward unusual terms.

**TTS.** Text to speech. Eleven v4 Turbo is the default for new agents; V3 Conversational and the Flash family remain available. **Expressive mode** lets the model shape delivery with audio tags on the newest models.

**TTS cascade.** Automatic fallback to the next voice model down the family ladder when the configured model fails to produce audio for a turn; the transcript shows the model actually used.

**Pronunciation dictionary.** Rules applied to the text after the LLM generates and before synthesis: **alias** rules (literal replacements, all models and languages) and **phoneme** rules (IPA or CMU, supported on the V4 models, on V3 Conversational when enabled, and on Flash v2 for English).

**Text normalization.** How numbers, currencies, dates and symbols are turned into speakable words: by instructing the LLM (default) or by a deterministic normalizer before synthesis.

**First message.** The fixed or templated utterance the agent speaks at conversation start: interruptible, non-interruptible, or empty so the user speaks first.

**Turn timeout.** The maximum time the agent waits for a user response before prompting again (7 seconds by default).

**Silence end-call timeout.** The period of user silence after which the agent ends the call (off by default; phone deployments should enable it).

**Soft timeout.** A filler the agent plays after a configurable delay when the model is slow, static or LLM-generated.

**Interruption-ignore terms.** Short backchannel phrases ("uh-huh", "okay") that do not interrupt the agent; presets exist and terms can be added.

**Tool interruption mode.** Per tool, whether a barge-in is allowed, blocked while the tool runs, or blocked while the tool runs and until the agent has finished speaking about the result.

**Filter background speech.** A voice-activity-detection option that ignores far-field speech (television, bystanders) so it is not treated as a turn.

**Background sound and voice filter.** Ambient audio presets looped under the agent's speech (office, café, typing, hold music) and a phone-style filter on the agent's voice, for realism; not heard by the recognizer.

**Maximum duration.** The hard cap on a conversation (10 minutes by default, up to 2 hours), with a farewell message spoken when reached.

**DTMF input.** Caller keypad entry captured as a user message on phone calls when enabled, with an inter-digit timeout, a hash terminator and optional redaction.

**Multimodal input.** Images, PDFs and small text files sent on text channels and understood by the model when it supports them, within configurable limits and billed per file.

**Language preset.** Per-language overrides of voice, first message and filler messages for an agent that serves several languages; the prompt itself is not per language.

**Language detection.** The system tool that switches the active language to a configured preset, by default on explicit request or clear evidence, optionally only at the start of the conversation.

**Backup LLM (cascade).** The ordered list of models that take over a turn when the primary model errors or stalls past an idle timeout; on by default with a platform default order, disableable or customizable.

**Reasoning effort.** A per-model dial for how much the model thinks before answering; higher improves multi-step decisions at a latency cost. A **reasoning summary** can be shown in transcripts.

**Realtime models.** A newer voice mode in which one managed model replaces separate LLM, recognition and synthesis settings, with the prompt, voice, tools and knowledge base unchanged. Rolling out per workspace.

**Custom LLM.** Any OpenAI-compatible endpoint you operate, used instead of a platform model; cannot be a backup, caps output tokens and must support tool calling.

**Text behavior per channel.** Verbosity, output format and response-time budget settings for each text channel, so one agent is terse on the phone and thorough in a helpdesk.

### Quality and operations concepts {#quality-and-operations-concepts}

**Deflection vs. resolution.** Deflection means the agent prevented a human handoff. Resolution means the user's issue was solved. A high deflection rate without resolution data hides failure. Production-grade agents are measured on resolution.

**Pathfinder use case.** The first deployment a team chooses for an agent program: measurable business value, clear scope, codifiable evaluation criteria, and a stakeholder accountable for the outcome.

**Go-live threshold.** The point at which an agent passes its evaluation criteria consistently and platform metrics stabilize. Before it, iterate in a branch; after it, iterate from production transcripts.

**Evaluation drift.** The gradual lowering of the bar for what counts as passing, usually under pressure to ship. Revisit criteria deliberately as new versions instead.

**Branched rollout.** Releasing a configuration change to a percentage of traffic on a branch before merging it into main.

**Merge proposal.** A review step for merging a branch: reviewers approve or request changes, the merge needs an approval from someone other than the author.

**Evaluation criterion.** A transcript-level judge that returns success, failure or unknown (or a numeric score against a rubric) plus a rationale. Configured per agent, versioned, scoped to the conversation or to one agent.

**Data collection item.** A typed value (string, optionally from allowed values; number; integer; boolean) extracted from the transcript after a conversation ends, for analytics, routing and campaign decisions.

**Analysis model.** The model that runs evaluation criteria, data collection and summaries; a fast default, changeable per agent and overridable per item.

**Sentiment and frustration.** Built-in per-conversation and per-turn scores computed for every conversation, filterable and aggregated per user and topic.

**Topic discovery.** Scheduled clustering of an agent's conversations into recurring topics, each with volume, success rate and sentiment.

**Spotlight and Dashboards.** Spotlight is the per-agent landing page with real-time cards, suggested actions and a weekly summary; Dashboards are the charts (evaluation, data collection, workflow, procedures, tools, LLMs, topics, queue, testing), filterable by branch and environment.

**Users page.** Distinct end users (by the identifier your integration passes) with contact history, conversation counts and sentiment.

**Agent test.** A pre-defined scenario the platform runs against an agent and grades. Three types: **next reply tests** (judge the agent's reply to a prefix), **tool invocation tests** (assert which tool is called with which parameters, or which node is transitioned to) and **simulation tests** (a full conversation against a simulated user, judged against a list of criteria). Tests live in folders, can be attached to an agent per branch, and run from the editor, the API or the command-line tool.

**Simulated user.** The LLM persona that plays the caller in a simulation: it sees only the transcript, speaks the agent's configured language unless the scenario says otherwise, pushes back on evasive answers, and can hang up.

**Judge (LLM-as-judge).** The separate model that grades next reply and simulation tests and runs evaluation criteria, reading the transcript (including tool calls) and returning a verdict and rationale per criterion.

**Test invocation.** One run of one or more tests, recording the branch and version run against, outcomes, cost, and whether runs were resubmitted. Can be named, shared and cancelled.

**Repeat count and buckets.** Running each test several times and grouping outcomes by reason, so flaky behavior shows as a pass rate.

**Mocked tool.** A tool whose execution in tests is replaced by a predefined response (or a predefined error) from rules stored on the tool, selected per test.

**Triage ticket.** A record of a problem with a conversation, opened by a reviewer from the conversation page or a failed test, or by the agent itself through Flag issue for review; with issue type, priority, comments, assignee and status.

**Alerts.** Monitors for conversation failures, tool failures, webhook errors, guardrail triggers, call initiation errors and evaluation score drops, with per-agent thresholds and delivery to webhooks, Slack or PagerDuty.

**Concurrency.** The number of simultaneous conversations a workspace or agent is running. Distinct from total volume and from call rate.

**Baseline concurrency.** The steady-state concurrent-conversation cap that ships with a workspace's subscription, charged at the contracted rate.

**Burst concurrency.** Capacity above baseline, up to three times the limit and capped at 300, billed at double rate, to absorb spikes.

**Concurrency pool.** The single shared counter that inbound, outbound, batch, widget and WhatsApp voice traffic draw from; text conversations have a separate, much larger pool.

**Wait queue.** A per-agent queue that holds inbound callers and widget users with hold audio when the agent is at its limit, for a configurable maximum wait, instead of declining them. On for new agents.

**Batch calling.** One submission dialing a list of recipients once each, paced within the workspace's concurrency, with per-recipient variables and overrides, scheduling, voicemail handling and export.

**Outbound campaign.** The managed layer over batch calling that retries, honors calling windows, schedules caller-requested callbacks and redirects, and queues unresolved leads for a human. Enabled on request.

**Callback.** A follow-up call scheduled from a time the agent collected in a data collection item; campaigns place it at that exact time.

## 2\. Agent Design Principles {#2.-agent-design-principles}

These principles distinguish production-ready agents from prototypes. They are organized by theme: scoping, structure, prompts, workflows, procedures, tools, authentication, knowledge, testing and operations, configuration, evaluation, tests, capacity, outbound, channels and release management. Each principle includes the reasoning behind it and the failure mode it prevents.

### 2.1 Scoping principles {#2.1-scoping-principles}

**Define what good looks like before building.** The teams that ship lasting voice agents do four things during scoping that the teams that get stuck in proof-of-concept purgatory skip:

1. State the measurable business outcome the agent moves (revenue, cost, CSAT, time to resolution). If no leader is accountable for the metric, the iteration cycles required to get the agent right will not get funded.  
2. Define what is in scope and what is out. Users will test the boundaries; the agent must handle out-of-scope requests gracefully.  
3. Codify what good and bad interactions look like into concrete evaluation criteria. These criteria define the go-live threshold. Without them, going live becomes a judgment call.  
4. Decide where the autonomy-versus-control dial sits at this stage. Locking down too tightly creates a glorified IVR. Moving too fast before establishing trust creates support burden that outweighs the gain.

**Match agent scope to the job, not to complexity.** A simple single-agent configuration is production-ready when the job is narrow, the prompt has clear boundaries and there is no meaningful state machine to model. A workflow becomes appropriate when the conversation has distinct stages, different tool sets per stage, gated compliance steps, deterministic post-tool routing or different recovery paths per failure mode. Procedures become appropriate when there are many distinct intents, each with its own playbook, that would otherwise bloat one prompt or explode the graph (§2.5). **Workflow complexity is not a quality signal.** Add nodes when the job requires it, not to look thorough.

**Pick narrow first, expand second.** The right starting use case is rarely the most technically interesting one. It is the one most likely to move a metric the business already tracks. Once one use case ships, the second cycle inherits a test suite, an evaluation baseline and operational experience the first cycle had to build from scratch. That compounding advantage is what separates lasting deployments from ones that stall.

**Decide the channel mix early.** Voice over the phone, a web widget, WhatsApp, a chat integration and an outbound campaign each change what the agent can see, how it should talk and what the capacity plan looks like (§2.16, §2.15). An agent designed for one channel usually needs only configuration changes to serve another, but the first message, the verbosity and the authentication path are channel decisions, not afterthoughts.

### 2.2 Structural principles {#2.2-structural-principles}

**Keep the root prompt global; put stage logic in nodes and playbooks in procedures.** The root prompt is the right place for stable identity, tone, global guardrails, pronunciation, language rules, privacy rules and escalation principles. Stage-specific procedure belongs in the relevant node's prompt; intent-specific playbooks belong in procedures. If a node prompt restates the entire company identity, global tone, privacy policy and escalation rules, it is bloated. If the root prompt contains all per-stage standard operating procedures, the agent needs a workflow or procedures.

**Separate routers from resolvers.** A router classifies intent and transfers; it does not answer specialist questions. A resolver answers or acts within its domain; it does not perform broad top-level routing. Mixing the two produces nodes that do too much, with prompts that contradict their actual job. Routers should ask only enough to disambiguate, then exit.

**Use role contracts for specialist nodes.** The best stage prompts are contracts, not prose blobs. They state what the node owns, what it must do and what it must not do:

`Role: [one sentence]`  
`Primary Goal: [one sentence]`  
`Responsibilities: [numbered list]`  
`You Must: [bulleted constraints]`  
`You Must Not: [bulleted constraints]`

Each Subagent should be explainable in one sentence. If a node has two unrelated jobs, split it. If it has only one fixed line, use a Say node instead.

**Match workflow granularity to business risk.** Split nodes where the tool set changes, where the user goal changes, or where compliance and consent gates change. Banking, lending and regulated support flows split aggressively because wrong routing creates compliance, fraud or customer harm. Simpler use cases need fewer splits. Do not split merely because a prompt is getting long; that is what procedures are for.

**Choose between deterministic structure and prompted autonomy based on the cost of a wrong action.** Heavy structure (many Subagents, Tool nodes, expression edges, structured procedures) is the right choice when wrong actions are expensive: regulated handoffs, irreversible operations, multi-step authentication, compliance-gated transactions. It makes behavior auditable and predictable at the cost of iteration speed and conversational flexibility. Lighter structure (fewer nodes, attached tools, free-form procedures, more reliance on the model to pick actions from a well-written prompt) is right when the cost of a wrong step is low and the agent can recover through dialogue: FAQ, light support, exploratory conversations. The mistake is heavy structure for lightweight use cases (slow to iterate, brittle to edge cases the graph did not anticipate) or light structure for high-stakes ones (unpredictable exactly where predictability matters). Healthcare, financial services and identity verification usually justify the heavy approach; FAQ, content discovery and casual support generally do not.

**Give long-running flows a single controlled handoff state.** When several nodes can end or escalate a call, final behavior gets inconsistent. Route all "caller is done", "human support needed", "handoff unavailable" and "tool failure" endings through one dedicated handoff node that owns the final spoken content and the transfer-or-end decision.

### 2.3 Prompt principles {#2.3-prompt-principles}

**Use the six building blocks for every root prompt:** Personality, Environment, Tone, Goal, Guardrails, Tools. This structure forces the missing pieces to be obvious. A prompt that only describes personality and skips environment, goal and tool guidance will produce an agent that sounds friendly and accomplishes nothing.

**Write for voice, not for a form.** The agent should ask one question at a time, keep responses short (one to three sentences unless troubleshooting requires more) and avoid stacking choices. Voice agents fail when they behave like forms. Multi-field questions in a single turn or unprompted long lists of options are signals to revise the prompt. For text channels the platform lets you set verbosity and output format per channel (§2.16), so the voice prompt does not have to compromise.

**Anything the agent must say correctly needs the right platform-level lever, not just prompt instructions.** Numbers, emails, URLs, product names, currency, dates and acronyms are unreliable when handled through prompt spelling tricks alone. Use the deterministic levers: the **pronunciation dictionary** for how the agent says brand and product terms, the **ASR keyword list** for terms the recognizer mishears, and the **text normalization mode** (§2.11 Text-to-speech) for numbers, currencies and dates. Treat prompt-level guidance as a complement to these, not a substitute.

**Use `{{variable_name}}` for runtime substitution; do not use square brackets.** Square brackets are reserved for audio and speech tags such as \[warmly\] and for procedure references. Placeholders like \[Company Name\] will not be substituted at runtime and may collide with those conventions. Give every variable a typed placeholder default so a missing value never renders as an empty slot (§2.11 Dynamic variables).

**Set the agent's timezone so it knows the date.** When a timezone is configured, the platform adds the current date and time in that timezone to the system prompt on every turn, which is what the agent needs to reason about "today", "tomorrow", opening hours and appointment availability. Without it the agent has no sense of time and confabulates dates. Reference `{{system__time}}` explicitly only where the prompt or a tool needs the time in a specific place; it is formatted in the same timezone.

**Make recovery paths concrete.** "If a tool fails, apologize" is not a recovery path. A recovery path specifies how many retries are allowed, what fallback action runs after the retry budget is exhausted, and what wording the agent uses. Every high-value flow should have a named failure branch, in the graph or in a structured procedure's failure handler.

**Encode consent and eligibility before sensitive actions.** For regulated or irreversible operations, look for three steps before the action runs: eligibility or identity check, explicit user confirmation, tool call. Missing any one is a design risk, and "confirm with the user" in a prompt is a hint to the model, not a control; put the gate in the graph.

**Protect long sequences and sensitive data in voice.** Reading full card numbers, IBANs, long order IDs, raw email addresses or URLs aloud is a usability and privacy failure. Strong voice design either confirms only the last few digits, spells carefully when needed, or sends the link or identifier to a text channel (WhatsApp, SMS or the widget).

**Define out-of-scope handling operationally, not ethically.** "Stay in scope" is not enough. Specify the supported and unsupported categories, the response when a request is unclear (one focused clarification before declining), the response when something is truly out of scope (short redirection or warm handoff), and the exact response path for safety-sensitive categories such as emergencies, self-harm, complaints, allergens, fraud or legal advice.

**Do not duplicate what the platform already injects.** The system prompt the model receives wraps your text with safety statements, structural guidance for spoken output, the audio normalization instruction, language rules, tool confidentiality rules, the alignment rules when the Focus guardrail is on, the knowledge base content, the retrieved chunks and the timestamp. Repeating those instructions in your own words produces two copies the model has to reconcile. Write only what is specific to your agent.

### 2.4 Workflow principles {#2.4-workflow-principles}

Workflows give an agent a state machine: nodes that run actions or stages, edges that decide what runs next. Designing them well requires understanding two things: how each node type behaves at runtime, and how each edge condition type is evaluated. Get those two right and most other workflow choices follow naturally. This section starts with node runtime behavior, then covers edge design, then concrete examples of common edge mistakes, then pattern recipes for the situations partners hit most often (retries, identity verification, consent gates, eligibility gating, transfers).

#### 2.4.1 How each node type behaves at runtime {#2.4.1-how-each-node-type-behaves-at-runtime}

Node types differ along two axes: whether the LLM is involved while the node runs, and how the node's outgoing edges are evaluated. Knowing both for each node type is the foundation of correct workflow design.

**Start node.** Every workflow begins here, and the workflow is only active once the Start node has an outgoing edge. The cheapest shape is a single unconditional edge from Start into a Subagent or Say node: the runtime enters that node directly and the conversation begins without an extra model call. Any other shape (conditional edges out of Start, or Start pointing at a Tool node) costs a model call before the first message is spoken. Unless you need to route before greeting, keep one unconditional edge out of Start.

**Subagent node.** Runs as a multi-turn conversational stage. The LLM drives the conversation inside the node, can call the tools in scope for the node, and stays inside the node until one of the outgoing edges fires. Edge evaluation here is **LLM-driven** for LLM conditions: each LLM-condition edge is exposed to the model as a "notify condition met" tool, and at every turn the model decides whether to call one. Expression edges are pre-evaluated against the dynamic variables before each turn (see §2.4.2); result edges are not available out of a Subagent. A Subagent therefore **needs time to act**: the workflow does not advance until the model observes a condition firing during conversation, or an expression becomes true. An expression edge that is already true when the node is entered fires on the node's very first turn and skips the stage, which is almost always a bug.

A Subagent can override or extend the agent's configuration for the duration of the node: append a stage goal to the root prompt (the default) or fully replace the root prompt with a stage-specific persona via the Override Prompt toggle; override the voice, LLM (model, reasoning effort, temperature), turn-taking, ASR, TTS, language, timezone and most other conversation settings; and change what the node can reach. Two switches matter most. **Inherit tools** (on by default) gives the node the agent-level tool set plus whatever is listed as additional tools; turning it off replaces the inherited set with an explicit per-node list, so a node can be given exactly one tool. **Inherit knowledge base** works the same way for documents. Built-in system tools (end call, transfers, language detection) are likewise inheritable or customizable per node. All overrides are scoped to that single node; the next node starts fresh from the global config plus its own overrides.

Each Subagent also has an **entry behavior**: Auto (the default) waits for the user when the previous node was Start or a Say node, because the user has just been spoken to, and generates immediately otherwise, for example after a Tool node, so the agent can report the result. "Generate immediately" forces the agent to speak on entry even after a Say node; "Wait for user input" makes it stay silent until the user speaks. A consequence partners hit in testing: a Tool node placed between the greeting and a Subagent makes that Subagent speak right away rather than wait for the caller, because the node was entered after a tool, not after speech.

**Say node.** Speaks exactly one utterance, either a literal string (with optional per-language translations and `{{dynamic_variables}}` substituted; a missing variable is left as the raw placeholder) or a single line generated against a prompt (which costs an LLM call, with tools disabled), then exits. No multi-turn conversation, no tool calls. **After the utterance plays, the workflow traverses outgoing edges**, normally unconditional or expression over state set earlier. An LLM-condition edge leaving a Say node is evaluated against the conversation before any user reply, so it has nothing new to look at; put the listening in a Subagent instead. By default the workflow advances as soon as the line has been handed to speech synthesis, so a Say node directly in front of an End or transfer node can be cut off; the option to wait for speech completion before advancing fixes that, and a further option to wait for the user's response before advancing is available on request. Say nodes can carry knowledge base documents and voice or LLM overrides, but never tools.

**Tool (dispatch) node.** Executes one or more tools automatically when the workflow reaches it. **The node does not speak. The user does not interact.** The parameters are supplied by the model of the Subagent that initiated the transition, at the moment it commits to it, from the conversation so far; each tool inside the node can additionally carry call-site overrides that pin a constant, bind a dynamic variable, let the model fill the value, or omit it, which is how one shared webhook tool is reused with different fixed values at different points. Once execution finishes, **the workflow traverses outgoing edges deterministically**, typically via result edges (did every tool in the node complete without a tool-level error) or expression edges over the assignments the tools wrote. Tools configured with pre-tool speech can have the model supply a short line to speak while the node runs, but only for the first Tool node of a transition; tools with a tool-call sound play it while executing. A tool configured for asynchronous execution runs in the background and the node counts it as successful immediately, so a result edge cannot observe its real outcome and its assignments land after the edges were evaluated. Up to ten Tool and update-state nodes can chain in one transition. If no outgoing edge matches after the node runs, control returns to the Subagent that started the transition, with the tool result in its history.

**update\_state node.** Writes dynamic variables as part of a transition. Each update is an expression: a literal, arithmetic or if/else over existing variables, or a value the model extracts from the conversation against a declared schema (boolean, string with an optional list of allowed values, integer, number, each optionally nullable). No speech, no user wait. Up to fifty updates per node. Outgoing edges are traversed deterministically as soon as the updates complete, usually a single unconditional edge or two expression edges that branch on the freshly written state. Every change is recorded in the conversation's dynamic-variable history with the node that wrote it.

**Phone-number transfer node.** Transfers the call to a phone number or SIP address with the same options as the transfer-to-number system tool: conference versus SIP REFER, custom SIP headers, post-dial digits, a transfer message. Only result edges leave it: on success the call has left the agent; on failure a result \== false edge can route to a recovery stage. Use it when the transfer is a deterministic step in the graph; use the system tool when the model should decide.

**Agent transfer node.** Hands the conversation to another agent (optionally a specific branch and a specific workflow node of it) or to a node in the same agent. Options: a delay, a transfer message spoken by the current agent before the switch, whether the target's first message is spoken, and whether the current voice settings carry over. True agent-to-agent handoff (router to specialist) belongs here or in the transfer-to-agent system tool; stage transitions within one agent belong on ordinary edges. See §2.4.6 for what carries across a transfer.

**End node.** Ends the conversation. It does not speak a farewell on its own; place a Say node (with wait-for-completion on) before it if a closing message is needed. The node carries an outcome, success or failure, and a failure outcome is recorded on the conversation as an error so it can be filtered and alerted on.

A few further node types are available on request: an **agent tool call node** (a Tool node whose arguments are filled by a dedicated small agent with its own instructions and model, which may call its own tools a few times to gather arguments), **subgraphs** with named exit slots so a reusable group of nodes can have several typed outcomes, **nested agent runs** that return to the calling node when the nested agent finishes, and a contact-center transfer node for Genesys. Ask your ElevenLabs contact before designing around them.

The single most important consequence of these rules: **Subagent nodes wait for the right user state to emerge before transitioning; Say, Tool, update\_state and transfer nodes do not.** An edge that is already true when a Subagent is entered skips the stage; an unconditional edge out of a Say or Tool node is normal, because the node has already done its job. When a workflow misbehaves, identifying which node type is in play tells you immediately whether the LLM should be involved in the transition decision (Subagent: yes) or whether the answer lies in expression and result edges over deterministic state (everything else).

#### 2.4.2 Edge and node design {#2.4.2-edge-and-node-design}

The principles below move from edge-type selection, through writing LLM conditions (the most error-prone area), to the mechanics the runtime applies, to node-type choice and Subagent configuration.

**Know which condition types each node can emit.** The builder enforces this: a Subagent offers LLM and expression conditions only; a Tool node offers unconditional, LLM, result and expression; a phone-number node offers result only; Start, Say and update\_state nodes offer unconditional, LLM and expression. Self-loops are rejected on every node type, and only one edge may exist between any pair of nodes; to loop between two nodes, give that single edge a forward condition and a backward condition (the builder shows them as two tabs on the edge). Unconditional edges are automatically moved to the end of a node's edge order when the workflow is saved.

**Use LLM conditions for human intent. Use expression and result conditions for known state.** The most common workflow mistake is routing deterministic tool output through a natural-language LLM condition. If an edge depends on whether `account_status == "active"` or whether the last tool call succeeded, that should be an expression or result edge. LLM conditions are for what the user means; expressions are for what the system knows.

**Understand how an LLM condition reaches the model, because it differs by node.** Out of a Subagent, every edge becomes its own tool, numbered in edge order, described as "Use this tool immediately when the following condition is met: \<your text\>", and the Subagent's prompt gains an instruction to call the matching tool as soon as a condition is met, at any time, without confirming with the user and without needing to be certain. Out of a Tool, update\_state, Say or Start node, an LLM condition becomes a boolean field, "True if the following condition is met, false otherwise: \<your text\>", that the model fills when it commits to the transition, so it is evaluated against the conversation before the tool has run or the line has been spoken. Both readings have to make sense for the edge to fire reliably.

**Phrase LLM edge conditions as predicates, not instructions.** Write the condition so the wrapped sentence reads cleanly: a short clause that names an observable state, not an action the agent should take. "User has provided their email address" reads cleanly. "Ask for the email and proceed" does not, and will produce inconsistent transitions because the model is being asked to evaluate an instruction as a boolean.

**Anchor LLM conditions to observable user behavior, never to the agent's own conclusion.** Conditions about what the user has said, asked, provided or confirmed are reliable because the evidence is in the transcript. Conditions about what the user feels, what is about to happen, or what the agent has decided are not. The worst case is a condition such as "the agent has confirmed the device is under warranty": the same model that is about to speak evaluates it against its own intention and fires it before the words are spoken, so the user never hears the verdict. Move "the user is frustrated" toward "the user has used escalation language, asked for a manager, or repeated the same complaint". Move "ready to take payment" toward "the user has confirmed the order details and stated they want to pay". When the decision is a classification the agent makes (warranty active, not active, undetermined), put it in an update\_state node as an extracted value with an explicit list of allowed values including an "undetermined" option, and branch on expression edges, which the model cannot fire early.

**Write conditions tight enough to survive low-certainty firing.** The platform tells the model it does not need to be certain. This default is correct for most flows but means broadly worded conditions trigger on weak signals. For edges where false positives matter (escalation, refund, identity claims, end-of-call), tighten the condition with explicit positive triggers joined by AND, exclusions for nearby intents that should NOT fire it, and at least one disambiguating example.

**Treat edge order as a design decision, and disambiguate in the text.** For edges leaving Start, Say, Tool and update\_state nodes, the runtime walks the edges in order and takes the first whose condition is true. For edges leaving a Subagent, the model picks the condition tool to call, so order controls how the options are numbered and presented rather than a strict first-match rule; two conditions that could plausibly both be true on the same turn must be told apart in their wording, or the model will pick inconsistently. Put the most specific condition first and the broadest fallback last in both cases.

**Expression edges are evaluated before every turn, and an already-true edge skips the stage.** Before each model turn inside a Subagent, the runtime evaluates every outgoing edge against the current dynamic variables: an edge whose expression is already true is fired on that turn, an edge whose expression is already false is hidden from the model, and only edges with an LLM component are offered as optional tools. A mixed condition such as `is_verified == true AND <user asked for their balance>` is therefore only offered while `is_verified` is true. Each AND/OR group may contain at most one LLM component.

**Keep expression types honest.** Dynamic variables resolve to null, boolean, number or string; lists and objects are stringified for comparison. Equality across different types does not raise: `==` returns false and `!=` returns true, so a variable holding the string `"true"` never equals the boolean `true`, and a variable still at its placeholder default `""` is a string. Ordering comparisons (`<`, `>=`) and arithmetic require numbers on both sides and raise an error otherwise, which silently aborts that transition evaluation: a counter compared against a string, or a placeholder of `""`, means the edge never fires, with nothing visible except in the conversation's workflow view. Practical rule: declare counters and flags with typed placeholders (a number, a boolean, or null), write them from update\_state nodes or from tool assignments that carry real JSON types, and never compare a tool-assigned field against a boolean literal unless the upstream JSON is a real boolean.

**Result edges test the call, not the answer.** A result condition is true when every tool in the last Tool node completed without a tool-level error: non-success HTTP statuses, timeouts, network or authentication failures, parameter-preparation failures. It never inspects the response body, so an API that answers HTTP 200 with `{"success": false}` takes the success edge. A backend that signals a failed identity match with a 4xx status is routed correctly by a result edge; one that signals it inside a 200 body is not. To branch on body content, assign the field to a dynamic variable and use mutually exclusive expression edges (`== true` / `== false`); a transport error then leaves the variable null, no edge matches, and control falls back to the calling Subagent, which is the right behavior for an authentication gate. Mocked responses always count as successful calls, so this bites twice in mocked demos.

**Use dispatch tool nodes for deterministic side-effects at transitions; use attached tools when the response is part of the spoken reply.** A read-only lookup whose result the agent should immediately speak (order status, ticket status, shipping ETA) should be an attached tool on the relevant Subagent so the LLM can call it and answer in one turn. A tool whose only job is "fire at this transition and route on the result" (record, log, eligibility check, refund submission, identity verification) should be a Tool node: the deterministic firing eliminates the "LLM gathered the data but forgot to call the tool" failure mode that attached tools always carry. See §2.4.5 for the full decision tree.

**Use say nodes for fixed utterances, not single-line Subagents.** If a stage says one scripted sentence and then transitions, it is a Say node. If it must ask questions, react to the user or call tools across multiple turns, it is a Subagent. Adjacent Subagents whose only job is one line each are usually a workflow design smell.

**Bound retries with state, not prose, and draw the loop legally.** Telling the prompt "only call this tool once" is unreliable. If once-only matters, encode it: track attempts in an update\_state node and route with expression edges like `retry_count < 3`. Because only one edge may exist between two nodes and self-loops are rejected, a two-node retry loop is one edge with a forward condition (the failure) and a backward condition (the retry budget); see §2.4.4.

**Decide explicitly what happens on tool node failure.** If a Tool node has no edge matching the outcome, the workflow stops advancing and control returns to the Subagent that started the transition, under its own prompt, with the tool result in its history. That fallback is valid when the parent Subagent handles "the action didn't proceed" naturally; add an explicit result \== false edge or an unconditional catch-all when you need deterministic routing instead (retry loop, apology plus handoff, state update). The same fallback applies on the success side if only a failure edge exists. Both options are legitimate; pick on purpose per Tool node.

**Never leave a Tool node empty.** A Tool node with no tools saves without complaint, but at runtime it runs nothing, reports success, and leaves every dynamic variable at its previous value, so a retry stage built from a copied-but-emptied node re-reads stale state and routes a caller who gave correct details on the second attempt down the failure branch.

**Use the "Prevent infinite loops" switch for what it does.** It only blocks a silent bounce: a transition straight back into a node that was already entered since the last agent speech, user message or tool call. A return to a router node after a spoken turn is never blocked, and the switch does not stop long back-and-forth between stages that involve the user. Do not treat "returns to the router" as a bug when reviewing a workflow with the switch on.

**Budget latency by model calls, not by hops.** The hop itself costs a few tens of milliseconds. What users perceive as "transition latency" is the next node's own model call (every Subagent spends a round-trip deciding its edges and generating), the turn-taking wait on the node that receives the user's answer (slowest on one-word answers; keep speculative turn on there), and inline speech synthesis on Say nodes with prompt-generated text. Count the Subagent hops on the common path and keep Say nodes literal where you can.

**Use Subagent prompt override only when the stage's job conflicts with the global persona.** Subagents append a stage goal to the root prompt by default; the Override Prompt toggle replaces the root prompt entirely for the duration of the node. Override when inheritance would actively mislead the model: end-of-call feedback collection, compliance disclosure, restricted handoff, specialist persona switch (§2.4.4). For stages that just refine the global job (collect an email, qualify a lead), keep the default. Pair a prompt override with Inherit tools off when the stage must not have access to the global tool set.

#### 2.4.3 Common LLM edge condition mistakes, with concrete examples {#2.4.3-common-llm-edge-condition-mistakes,-with-concrete-examples}

LLM edge conditions are the most common failure source in workflow design because they look like prompts but are evaluated like booleans. The recurring mistakes:

**Writing instructions instead of predicates.**

* Bad: Ask the user for their email address and proceed.  
* Good: User has provided their email address.

The first reads as a directive; there is no boolean to evaluate. The model has no observable evidence to say yes or no, so firing is inconsistent.

**Routing on tool output through an LLM condition.**

* Bad (LLM condition): The verification tool returned success.  
* Good (expression edge): `verified == true` over an assignment from the verification tool.

Tool output is system state, not human intent. Whenever the natural-language version of an edge contains "if the tool returned X" or "if the API succeeded", it should be an expression or result edge.

**Conditions about the agent's own conclusion.**

* Bad: The agent has confirmed that the warranty is active.  
* Good: User has stated the purchase month and year. Then classify in an update\_state node (`warranty_status` in active / expired / undetermined) and branch on expression edges.

The model judges its own unspoken plan and fires the edge before it speaks. Strengthening the wording ("...and has summarized and confirmed") does not help.

**Conditions about the user's mood or unspoken intent.**

* Bad: User is frustrated.  
* Good: User has used escalation language ("this is ridiculous", "I want a manager", "unacceptable"), asked for a manager, or repeated the same complaint twice.

**Two mutually negating conditions and no third exit.**

* Bad: Edge A "the device is covered by warranty", edge B "the device is NOT covered". Both can come back true on an ambiguous turn, and "cannot determine yet" has nowhere to go, so the model guesses.  
* Good: a third edge or state for "undetermined", and the classification moved into update\_state.

**Broad conditions without exclusions, on edges where false positives matter.**

* Bad: User is asking for a refund.  
* Good: User is asking for a refund of a specific transaction they made on their card. Do NOT route here for: refunds of subscription fees (route to subscriptions), direct debit reversals (route to disputes), or cancellations of investment products (route to investments).

**LLM conditions on edges leaving Say or Tool nodes.**

* Bad: An LLM-condition edge "if user agrees" leaving a Say node, or "use the stock-update stage" leaving a Tool node.  
* Good: A Say node with a single unconditional edge into a Subagent that contains the listening logic; unconditional or result edges out of Tool nodes.

Those conditions are filled in by the calling Subagent's model before the line is spoken or the tool has run. When the answer comes back false, the tool still executes but the graph stops and the flow silently stays on the calling Subagent, which looks like "the stage worked once and never again".

**A consent or verification gate with a bare boolean and a single exit.**

* Bad: A consent Subagent with one LLM edge "caller answered whether they agree", feeding an update\_state that extracts `consented` as a boolean. With no answer present, the edge fires on a clarifying question and the boolean extraction invents `true`.  
* Good: Extract `consent` as a nullable value or a string in {yes, no, not\_answered}; give the gate node an edge for "user asked a clarifying question" that returns to it; branch on `consent == "yes"` and `consent == "no"` only.

A forced boolean cannot represent "has not answered yet", so it fabricates an answer. Every gate needs a third state and a path for clarifying questions.

#### 2.4.4 Workflow pattern recipes {#2.4.4-workflow-pattern-recipes}

These are the patterns partners hit repeatedly. Each recipe shows the topology, names the load-bearing edges, and explains why the structure looks the way it does. Patterns assume that retries, eligibility and identity decisions are state, not prose.

**Pattern: API call with bounded retry.**

Only one edge can exist between two nodes, and self-loops are rejected, so the loop is a single edge with a forward and a backward condition:

`[update_state: retry_count = 0]`  
        `↓ (unconditional)`  
`[Subagent: collect parameters from user]`  
        `↓ (LLM: user has provided X, Y, Z)`  
`[Tool: call_api]`  
   `├── result == true   → [Subagent: explain success to user]`  
   `└── one edge to [update_state: retry_count = retry_count + 1]`  
            `forward condition:  result == false`  
            `backward condition: retry_count < 3   (returns to [Tool: call_api])`  
`[update_state: retry_count = retry_count + 1]`  
   `└── expression: retry_count >= 3  → [Subagent: human handoff]`

Notes:

* The retry counter lives in a dynamic variable with a numeric placeholder (0), not in the LLM's working memory and not as a string.  
* Edges leaving the update\_state node are deterministic expressions; no model is asked "should we retry?".  
* The backward condition on the single Tool/update\_state edge is the legal way to loop between two nodes.  
* Reset the counter on success if the same flow could call the tool again later in the conversation.

**Pattern: Multi-question Knowledge-Based Authentication (KBA).**

Goal: ask N security questions; allow the privileged Subagent only when the user has answered M of them correctly.

`[update_state: auth_success_count = 0]`  
        `↓ (unconditional)`  
`[Subagent: ask question 1] - attached: verify_answer (assigns auth_success_count)`  
        `↓ (LLM: user has provided an answer to question 1 AND verify_answer has been called)`  
`[Subagent: ask question 2] - attached: verify_answer`  
        `↓ (LLM: user has provided an answer to question 2 AND verify_answer has been called)`  
`[Subagent: ask question 3] - attached: verify_answer`  
        `↓ (LLM: user has provided an answer to question 3 AND verify_answer has been called)`  
`[update_state: join (no changes)]`  
        `├── expression: auth_success_count >= 2   → [Subagent: privileged]`  
        `└── expression: auth_success_count < 2    → [Subagent: failed auth - offer human handoff]`

Notes:

* The privileged Subagent must be unreachable except through the `auth_success_count >= 2` edge. Switch Inherit tools off on the failed-auth Subagent so no account tool is reachable from it.  
* The counter is incremented by tool assignment, not by the LLM: either the backend returns the running count and the assignment writes it, or it returns a boolean and an update\_state node adds one.  
* The edge out of question 3 must be an LLM condition like the others; an expression edge that is already true (or an unconditional edge, which the builder does not offer here) would fire on the first turn and skip the question.  
* LLM edges between question Subagents fire on observable user behavior ("user has provided an answer"), not on whether the answer was correct; correctness is system state, evaluated by the gating expressions at the end.

**Pattern: OTP (one-time code) verification.**

`[Subagent: explain code will be sent, confirm delivery channel]`  
        `↓ (LLM: user has consented to receiving the code)`  
`[Tool: send_otp]`  
   `├── result == true   → [Subagent: ask user to read code back] - attached: verify_otp (assigns is_verified)`  
   `└── result == false  → [Subagent: delivery failure handoff]`

`[Subagent: ask user to read code back]`  
        `↓ (LLM: user has spoken a multi-digit numeric code)`  
`[Tool: verify_otp]`  
   `├── expression: is_verified == true   → [Subagent: privileged]`  
   `└── expression: is_verified == false  → [update_state: otp_attempts = otp_attempts + 1]`  
                                  `├── expression: otp_attempts < 3   → [Subagent: ask user to read code back]`  
                                  `└── expression: otp_attempts >= 3  → [Subagent: failed handoff]`

Notes:

* Two tools, send and verify, with separate failure modes; do not collapse them.  
* Branch on the assigned `is_verified` field, not on a result edge, if the backend answers a wrong code with HTTP 200 and `{"verified": false}`.  
* The retry budget is a dynamic variable with a numeric placeholder.

**Pattern: Host-application authentication (no verification workflow).** When the agent is embedded in a logged-in product, the host passes verified identity at conversation start as dynamic variables (`user_id`, `is_verified`, `customer_tier`). No verification node is needed. For defense in depth, gate the privileged Subagent on `is_verified == true` even though the host should have done the work: a single misconfigured launch should not expose account data.

**Pattern: Identity-gated specialist Subagent.** Whatever the verification method, the privileged Subagent must have exactly one path in: an edge gated by an expression over the verification result. Audit by listing every incoming edge to the privileged Subagent; every one of them must include the gating expression. An LLM edge that "transfers when the user is asking about their account" without checking `is_verified` is the failure mode this audit catches.

**Pattern: Consent gate with three states.**

`[Subagent: read the notice, ask for consent] - attached: none`  
        `├── LLM: user has clearly agreed            → [update_state: consent = "yes"]  → ... main flow`  
        `├── LLM: user has clearly declined          → [update_state: consent = "no"]   → [Say: explain limits] → [End]`  
        `└── LLM: user asked a question about the notice → (backward condition on the same edge returns here after the answer)`

Notes:

* The state is a string with explicit values, with placeholder `"not_answered"`, never a bare boolean.  
* The gate stays put on clarifying questions; it does not advance on silence or on a question.  
* If the notice must be read without interruption, use a non-interruptible Say node before the gate Subagent.

**Pattern: Eligibility gate before an irreversible action.**

`[Subagent: collect intent and parameters]`  
        `↓ (LLM: user has confirmed the action and parameters)`  
`[Tool: check_eligibility] (assigns: is_eligible, denial_reason)`  
        `├── expression: is_eligible == true   → [Subagent: explicit confirmation prompt → execute action]`  
        `└── expression: is_eligible == false  → [Subagent: explain denial_reason, offer alternative]`

Notes:

* The eligibility check is a Tool node (silent), not an attached tool; its result drives routing, not user-facing speech. Expression edges may leave the Tool node directly.  
* Three steps before the irreversible action runs: eligibility check (system), explicit user confirmation (LLM-listened), tool call (action). All three present is the pattern; missing any one is a design risk.

**Pattern: End-of-call persona swap with full prompt override.**

`[Subagent: main flow ...]`  
        `↓ (LLM: user's request is resolved OR user has declined further help)`  
`[Subagent: collect feedback]   ← Override Prompt: ON, Inherit tools: OFF, tools: log_feedback only`  
        `↓ (LLM: user has provided a rating and any optional comment)`  
`[Tool: log_feedback]`  
        `↓ (unconditional)`  
`[Say: thank-you message]   ← wait for completion before advancing: ON`  
        `↓ (unconditional)`  
`[End]`

Notes:

* The feedback Subagent's Override Prompt replaces the root prompt entirely with a narrow, self-contained one ("You are a brief feedback collector. Ask for a 1 to 5 rating and one optional comment, acknowledge in one sentence, and stop. Do not offer further help and do not re-open the support conversation."). Inheriting the support persona and its tool eagerness would work against the stage.  
* Switching Inherit tools off and attaching only the logging tool removes the lookup, refund and escalation tools from the stage entirely, which is stronger than any prompt instruction.  
* The same shape works for a compliance-disclosure node, a restricted-handoff node that only confirms transfer intent, or a short survey. The unifying signal is that the stage's job is fundamentally different from the global persona's job.  
* For stages whose job is just a more focused version of the parent (collect an email, qualify a lead), use the default conversation goal field instead; those stages benefit from inheriting the global persona.

**Pattern: Transfer to a human with a failure route.**

`[Subagent: confirm the user wants a human and collect context] - assigns: handoff_reason`  
        `↓ (LLM: user has confirmed they want to speak to a person)`  
`[Say: "Connecting you now, one moment."]   ← wait for completion: ON`  
        `↓ (unconditional)`  
`[Phone-number transfer: support queue] - SIP headers templated from {{handoff_reason}}, {{system__conversation_id}}`  
        `└── result == false  → [Subagent: apologize, offer callback or message]`

Notes:

* On success the call has left the agent and nothing further runs; only the failure edge needs a destination.  
* Pass context to the receiving system through templated SIP headers or the destination's own integration rather than asking the human to read the transcript.  
* For a model-decided transfer (the user may ask for a human at any point), grant the transfer-to-number system tool on the relevant Subagents instead and tighten its description (§2.6.6).

#### 2.4.5 Attached tools vs dispatch tool nodes {#2.4.5-attached-tools-vs-dispatch-tool-nodes}

Most workflows mix two ways of calling a tool: attaching it to a Subagent as an additional tool, or putting it in a Tool node. The decision is not about whether the LLM can supply parameters; both shapes let the model fill parameters from conversation, since a Tool node's parameters are filled by the upstream Subagent's model at the moment it commits to the transition. The real choice is **when the tool's response surfaces to the LLM** and **where failure handling lives**.

**Attached tool** (on a Subagent):

* The LLM calls the tool and **sees the response in the same turn**, so it can react inline: speak the answer, retry with a different framing, ask a clarifying question, recover from a transient failure mid-conversation.  
* Failure handling is prose-encoded in the Subagent's prompt. The graph never sees the failure.  
* Carries one durable failure mode: the LLM may decide not to call the tool at all. This looks identical in transcripts to "called the tool, advanced normally"; there is no graph-level evidence that the call should have happened. Audit by reading transcripts, not logs.

**Dispatch tool node:**

* The tool fires deterministically the moment the LLM commits to the transition into the node. The "LLM gathered the data but forgot to record it" failure mode disappears, because the node IS the recording step.  
* The LLM only sees the tool's response on its **next** turn, in the next Subagent. Inline same-turn reactions are not available; a downstream node has to speak about the result if speech is needed, and a Subagent entered after a Tool node speaks immediately by default (entry behavior Auto).  
* Failure can be graph-routable (result \== false to a retry, an error Subagent, a handoff) **or** fall back to the calling Subagent when no edge matches, with the failure body in its history. Both shapes are normal; pick by what the failure means.  
* Multiple tools in one node run in parallel and the node is successful only if all complete without a tool-level error. Asynchronous tools count as successful immediately.  
* Mocks attach to the tool, so a webhook tool executed inside a Tool node is mocked in simulations like any other.

**Decision criteria.**

| Use attached when | Use dispatch when |
| :---- | :---- |
| The tool's response text is part of the agent's next spoken reply (lookups, FAQs, status checks the user is waiting to hear). | The tool is a side-effect at a transition (record, log, update CRM, set state); the response only matters as data for routing or audit. |
| Same-turn conversational repair matters more than determinism (flaky third-party APIs where "let me try once more" makes the experience better). | "Tool fires exactly once, every time, when this point is reached" matters more than inline repair. |
| The conversation must continue inside the same Subagent after the tool call without a graph transition. | The graph should branch on success or failure with no LLM interpretation of the result text. |
| Several tools at the stage are reactively chosen by the LLM based on what the user just said. | The same one or more tools fire deterministically every time the flow reaches this point. |

**Failure handling on dispatch nodes: pick by what failure means, not by aesthetics.**

* **No failure edge (fallback to caller).** Best when failure is conversational: re-prompt the user with different framing, explain and retry, or accept defeat after a budget defined in the calling Subagent's prompt. This is the idiomatic shape for collect-and-verify, authentication, lookup, and any flow where "fix the input and try again" is the right experience.  
* **result \== false edge.** Best when failure must be deterministic: the recovery stage is genuinely different from the caller, the retry budget must be enforced by a counter rather than prompt discipline, the failure must be silent, or the operation is destructive and a second attempt is unsafe.

**Common mistakes.**

* A read-only lookup in a Tool node when the user is waiting to hear the answer. The node runs silently and the workflow advances; the user hears nothing until a downstream node speaks. The most common workflow anti-pattern. Move the tool onto the Subagent that owns that stage.  
* A side-effect "record this" tool attached to a Subagent when the goal is "fire exactly once at this transition". The LLM may choose not to call it, and that failure mode is invisible in transcripts. Move it to a Tool node.  
* Adding a separate retry Subagent purely to recover from dispatch failure when fallback-to-caller would do the same job with less plumbing.  
* Expecting a result edge to see an asynchronous tool's outcome, or to see a `success: false` inside a 200 response. Neither happens; use assignments and expression edges.  
* Building a two-node retry loop as two edges. The builder rejects it; use one edge with forward and backward conditions.

#### 2.4.6 Transfers between agents {#2.4.6-transfers-between-agents}

Both the transfer-to-agent system tool and the agent transfer node use the same mechanism; the tool is model-initiated (one natural-language condition per target, and the model is told not to ask for confirmation or announce the transfer), the node fires deterministically as part of a route. Which to use is the same determinism decision as attached tools versus Tool nodes.

What happens at transfer time, in order: the current agent speaks the transfer message if one is set; the target configuration loads (the configured delay is a minimum total wait, so a slow load absorbs it); then, if "enable first message" is on and the target has one, that first message is spoken verbatim, otherwise the target generates its first reply immediately without waiting for the user; and billing, privacy settings and memory switch to the target.

What carries across: all dynamic variables (the target's placeholders fill any gaps); the full conversation history; the current language if the target supports it, otherwise the target's default; text-only mode (a voice conversation cannot be transferred into a text-only agent); audio formats and client events so the transport keeps working. The target's own voice and TTS settings apply unless "preserve voice settings" is on, which carries the source voice, model, stability, speed and similarity, including per-language voices. Caller-supplied configuration overrides are dropped unless "preserve voice overrides" is on. Procedures and memories are reloaded for the target. Branch selection follows the configured branch, or the target's live traffic split when none is configured; a transfer that targets a specific node without a branch lands on the main branch. If the transfer cannot be completed (incompatible target, unresolved branch), the model is told the transfer did not happen and the current agent keeps running, so write the prompt to handle that answer.

Design consequences: give the receiving agent a first message or an opening instruction, because it speaks first; keep post-transfer evaluation criteria at agent scope (§2.12.2) so each agent is judged on its own segment; and remember that a receiving agent in zero retention mode does not un-store what the first agent already captured, nor does transferring out of one re-enable storage.

### 2.5 Procedures {#2.5-procedures}

Procedures are standard operating procedures attached to an agent. Each one has a **trigger** (when it applies) and a **body** (what to do). The agent does not carry every procedure in its prompt. It carries a menu of triggers, and pulls a body in only when the conversation matches one. That one design choice is what makes procedures different from "a longer system prompt", and most of their runtime behavior follows from it. Procedures became generally available in August 2026 and are the right tool for the long tail of "how do we handle X" that would otherwise bloat a single prompt or explode a workflow into dozens of nodes.

#### 2.5.1 Who decides what happens next {#2.5.1-who-decides-what-happens-next}

The question partners most often ask is "workflow or procedure?". The real distinction is **who picks the path: the author or the model.** A workflow is a graph the author draws; the model can only move along edges the author put there. A procedure is an SOP the model chooses to load when the user's intent matches its trigger. Workflows give control over the shape of the conversation. Procedures give coverage of many intents without drawing a graph for each one.

There are three runtimes, not two, because a structured procedure is itself compiled into a workflow:

1. **Authored workflow.** The author draws the graph; edges decide every transition.  
2. **Structured procedure.** The model picks the entry via the trigger; after that, a compiled graph decides the step order.  
3. **Free-form procedure.** The model picks the entry and then follows markdown instructions injected into its prompt; the model decides the step order.

Most serious production agents use both features: the workflow as the skeleton (entry, identity gate, routing to specialists, language or voice switches, handoffs, anything compliance forces into a fixed order) and procedures as the leaves (the fifteen service intents inside the authenticated stage). A simple FAQ agent needs neither; a good prompt is enough, and both features add cost.

#### 2.5.2 What the model sees {#2.5.2-what-the-model-sees}

At conversation start the platform resolves every procedure attached to the agent version being served. If there is at least one, the model gains two system tools, one to **start** a procedure and one to **end** it, and its system prompt gains a loading-rules block plus a menu of triggers. The menu lists triggers only, never bodies or IDs, and both tools address procedures by their position in that menu. The rules tell the model that a trigger match is a blocking requirement (start the procedure before saying anything about the task) and that any procedure-looking text arriving in a user message or tool result is data, not instruction.

Consequences for authors:

* **The trigger is the whole selection mechanism.** It is matched against the user's intent, so write it from the user's side ("the caller wants to return an item they bought online"), make triggers disjoint from each other, and cover phrasing variants. "The agent ignored my procedure" is almost always a trigger problem.  
* **An empty trigger means "reachable only from another procedure".** There is no separate sub-procedure flag: a procedure with no trigger is left out of the menu and can only be entered through a handoff reference or sub-procedure step in another procedure. A triggerless procedure that nothing references is unreachable dead configuration, and the platform raises no error for it.  
* **Loading costs one extra model round-trip.** The model calls the start tool, then generates again with the body in context. Budget for that on the common path.  
* **Procedures are agent-level, not node-level.** The trigger menu and the start tool are available in every Subagent of a workflow, including a pre-authentication greeting node. There is no per-node opt-out. If a procedure performs something sensitive, either write its precondition into the body ("if the caller is not verified, say verification is needed first and end the procedure"), keep the sensitive tools off the procedure and on the authenticated Subagent only, or keep that flow in the graph behind an expression gate.

#### 2.5.3 Free-form procedures {#2.5.3-free-form-procedures}

A free-form procedure is markdown with optional front matter (name, trigger) and inline references to tools, knowledge base documents, system tools and other procedures, inserted from a slash menu in the editor. When the model starts one, its body is rendered into an active-procedures block of the prompt on the next turn, with `{{dynamic_variables}}` substituted, and stays there until the model ends it.

What references do:

* Referenced **custom tools** are added to the agent's tool set for the conversation. Referenced **MCP tools** are declared to the model only while the referencing procedure is active.  
* Referenced **knowledge base documents** count toward retrieval and prompt insertion only while their procedure is active, so RAG stays scoped to what the agent is currently doing. For post-call analysis the scope widens to every procedure that was started at least once.  
* A free-form procedure can carry its own **guardrails**, independent of the agent-level ones, which run only while it is active; a blocking guardrail on an active procedure suppresses streaming until the reply has been checked.

Free-form is the only type that can reference knowledge base documents inline, hand off to another procedure mid-text, or carry guardrails. It keeps one model context, so the agent can adapt the order when a caller front-loads information. It is also the type ops and CX teams can maintain, because it is prose. The cost is predictability: the model may skip or reorder steps.

**Import from documents.** The platform can turn existing SOP documents (PDF, DOCX, TXT, Markdown, HTML, EPUB; up to ten files of 20 MB per request) into free-form procedure drafts: it segments the documents into procedures with one recognizable activation condition each, treats variants as branches and shared sub-flows as sub-procedures, and writes each as a draft with a generated name, trigger and steps. Treat the output as a starting point and review every trigger. Procedures can be organized into folders; a procedure's type (free-form or structured) is fixed at creation.

#### 2.5.4 Structured procedures {#2.5.4-structured-procedures}

A structured procedure is a typed list of steps (ask, tell, say, tool call, branch, sub-procedure, retry inside a tool's failure handler, and end-call as a system step) that the platform compiles into a disconnected island of ordinary workflow nodes. It never touches the prompt. Starting it transfers the conversation into the island's entry node and records where to come back to; ending it transfers back, so a structured procedure started mid-workflow returns the skeleton to the node it left.

What the compilation means in practice:

* **Every Ask and Tool step is a Subagent node** and costs its own model round-trip, exactly like a workflow hop. Keep structured procedures short.  
* **A tool step without a failure handler ends the call on failure.** So does an exhausted retry budget (one to three attempts). Check the failure handler on every tool step before publishing; it is the first thing to review on any structured procedure.  
* **Only Ask waits for the user.** Tell conveys something in the agent's own words and continues; Say speaks verbatim (with per-language translations) and continues; If arms carry no state of their own.  
* **If steps are first-match-wins**, with several arms (if, else-if, optional else) that must all be the same kind: either natural-language conditions the model judges, or expressions over dynamic variables. An expression condition cannot read what the user just said, so place expression branches right after the tool step that filled the variables, and use a text condition directly after an Ask.  
* **Structured procedures rely on forced tool choice** at several steps. The mainstream model families support it; a custom LLM endpoint may not, and structured procedures will misbehave on one that does not.  
* **An agent with procedures but no authored workflow gets a hub node** added so the self-transfer mechanics work; the agent runs on that node with its unchanged base prompt. Hand-built workflow nodes are never rewritten by a recompile: the compiler only ever replaces the nodes it generated, and compilation happens automatically when the agent draft is saved, published, or branched.  
* **Invalid structured procedures block the save.** Saving, publishing and branch operations validate every structured procedure first and reject the whole request with per-procedure errors (adjacent If steps, an expression If right after an Ask, mixed condition kinds in one If, a retry that is not the last step of its handler, a sub-procedure pointing at a missing or free-form procedure, tool references that do not match the tool's schema). The previous draft or version is left untouched, so fix the reported step and save again.

Use structured procedures for a model-triggered flow that must run in exactly this order every time and is reachable from anywhere in the conversation: payment capture, a fixed disclosure script, a regulated verification sequence. You get workflow determinism without drawing edges from every node to it.

#### 2.5.5 The active window {#2.5.5-the-active-window}

Up to **five** free-form procedures can be active at once, most recent first. Starting a sixth evicts the oldest from the prompt, and with it that procedure's inline tools and knowledge base scope; the guardrails that apply are those of the five most recently started procedures. Eviction is therefore a safety consideration, not just a context one: an agent whose procedures chain through many small steps should be tested for it. Active procedures persist across workflow node hops within the agent, so a free-form procedure started in one Subagent is still in context in the next one, together with its scoped tools. Transferring to a different agent reloads procedures from the target agent. A conversation can also be started with a restricted set of the agent's procedures, or with up to five free-form procedures pre-started, when the agent's security settings allow the client to select procedures; this applies to the entry agent only.

#### 2.5.6 Versioning and drafts {#2.5.6-versioning-and-drafts}

Procedures are versioned with the agent. Editing is per user and per branch: two people editing the same procedure on the same branch see their own drafts until one publishes. Publishing an agent version freezes the procedure content alongside the prompt and workflow, and a conversation always runs the procedure content pinned to the agent version it started on. Editing a draft changes nothing live until publish. Branch creation can take the author's drafts along, merges reconcile the procedure set, and duplicating an agent clones its procedures.

#### 2.5.7 Side by side {#2.5.7-side-by-side}

| Authored workflow | Free-form procedure | Structured procedure |
| :---- | :---- | :---- |
| Entry chosen by the author (an edge from the current node). | Entry chosen by the model (trigger match). | Entry chosen by the model (trigger match). |
| Step order decided by the author's edges. | Step order decided by the model reading the markdown. | Step order decided by the compiled graph. |
| Hard gates ("auth before X") enforced with expression edges. | No hard gates; prompt adherence only. | Hard gates within the procedure only. |
| LLM, voice, language can change per node. | Cannot change LLM, voice or language. | Cannot change LLM, voice or language. |
| Tools and KB scoped per node. | Tools and KB scoped per active procedure. | Tools scoped per step. |
| No node-level guardrails (agent-level only). | Own guardrails while active. | No procedure-level guardrails. |
| Transfers to agents and phone numbers are native node types. | Transfers via tools referenced in the body. | End-call only as a system step. |
| Latency: one model call per Subagent hop. | One extra round-trip on start, then none. | One model call per Ask or Tool step. |
| Failure mode: stuck node, wrong edge, dead end. | Model skips or reorders steps. | Tool step without a failure handler ends the call. |
| Maintained by a builder comfortable with graphs. | Maintainable by ops or CX writing SOPs in prose. | Builder, form-based editor. |
| Authored manually. | Bulk import from SOP documents. | Authored manually. |

#### 2.5.8 Discovery questions that decide it {#2.5.8-discovery-questions-that-decide-it}

* "Is there anything the agent must never do before something else has happened?" If yes, that part goes in the workflow behind an expression edge.  
* "Do different parts of the call need a different voice, language, model or set of systems?" If yes, use workflow nodes.  
* "How many distinct things do callers ask for, and do you already have SOPs written down for them?" If many and documented, use free-form procedures and import the documents.  
* "Within each SOP, would it be a compliance issue if the agent changed the order?" If yes, make that one structured. If no, keep it free-form.  
* "Who maintains this after go-live?" If ops or CX, favor free-form procedures; the graph is a builder's tool.  
* "How latency-sensitive is it?" Count Subagent hops and structured steps on the most common path; each one is a model round-trip.

#### 2.5.9 Common procedure mistakes {#2.5.9-common-procedure-mistakes}

* **Vague or overlapping triggers.** The model picks the wrong procedure or none. Rewrite from the user's side, make them disjoint, add phrasing variants.  
* **A triggerless procedure nothing references.** Unreachable, no error. Either give it a trigger or reference it from a parent.  
* **A structured tool step without a failure handler.** Fails the call on the first backend error. Add the handler, with a bounded retry or a handoff.  
* **Sensitive actions inside a procedure reachable from an unauthenticated node.** Add the precondition to the body or move the gate into the graph.  
* **A procedure that fires on every call.** That is prompt content with an extra round-trip attached. Put it in the prompt.  
* **Chaining many small procedures.** The five-slot window evicts the oldest, including its guardrails. Merge small procedures or test for eviction.  
* **Ignoring the validation error on save.** The save is rejected as a whole until the reported step is fixed; the error names the procedure and the step path.  
* **A custom LLM endpoint without forced tool choice** under a structured procedure. Use a mainstream model for agents with structured procedures, or keep those flows free-form.

### 2.6 Tool design principles {#2.6-tool-design-principles}

Tools are the only way an agent acts on the world: every API call, transfer, lookup and call-control action flows through a tool. This section covers the tool types, the design principles that prevent the most common production mistakes, the execution and configuration choices that change runtime behavior, dynamic-variable plumbing, system tools (which control call mechanics), and how to test tools and shape mock responses.

#### 2.6.1 Tool types {#2.6.1-tool-types}

Six tool types, distinguished by who runs the code:

* **Webhook tool** (formerly "server tool"). The platform calls an HTTPS endpoint you control with parameters extracted by the LLM, bound from dynamic variables or pinned as constants. The most configurable type and the right default for backend integrations (CRM lookups, payment APIs, ticketing). Calls originate from a published set of static egress IP addresses per region, so the receiving system can allowlist them.  
* **Client tool.** Execution happens in the host application: the browser running the widget, or the mobile or desktop app embedding the SDK. Used for UI manipulation (highlighting, navigation, form fills) and for reading state that lives only client-side. Not available on phone calls.  
* **Code tool** (enterprise). A short JavaScript function that runs in a sandbox on the platform, with access to the tool's arguments, workspace secrets and authentication connections, and outbound requests only to domains your workspace admin has allowlisted. Positioned between a webhook tool (one HTTP call) and a client tool: use it when a tool needs to combine two API calls, reshape a response, or compute something before answering, without standing up a server of your own.  
* **System tool.** Built into the runtime. Controls call mechanics: end the call, transfer, switch language, play keypad tones, detect voicemail, skip a turn, update state, flag an issue, search the knowledge base, start and end procedures. Covered in §2.6.6.  
* **Native integration tool.** Ready-made, platform-hosted tools for common systems (helpdesks such as Zendesk, Intercom and Freshdesk; Salesforce, HubSpot, ServiceNow and Jira; Slack, Telegram, Twilio SMS and WhatsApp messaging; Google Calendar and Drive; web search providers), authenticated through a workspace connection. You can edit descriptions, pin parameter values and filter responses, but not change the request shape. Prefer these over an MCP server or a hand-written webhook when one exists for the system.  
* **MCP tool.** Tools exposed by a Model Context Protocol server you connect (your own, over SSE or streamable HTTP, with a secret or an authentication connection). Each server has an approval policy: ask the user every time (the default), fine-grained per tool (tools without an approval entry are hidden from the agent, and a tool whose schema changes since approval is blocked until re-approved), or no approval. Approval requests are answered in the widget or SDK UI; on a phone call there is nobody to approve, so phone agents must use auto-approval or the tool stalls until it times out. Server-level defaults for execution mode, pre-speech, interruption mode, sound and timeout can be overridden per tool, and per-tool assignments and mocks are supported. MCP is enabled per workspace once an admin accepts the MCP terms, and is not available on zero retention or HIPAA workspaces. Every tool call opens a fresh connection, so servers that rely on session state across calls need to carry the state in a header or in their own store.

#### 2.6.2 Tool design principles {#2.6.2-tool-design-principles}

**Tool descriptions should say when to call the tool, not just what it does.** The LLM sees the description as part of its decision about whether to invoke it. A description that only documents the API behavior ("POSTs to /v1/orders") tells the model nothing about when invocation is appropriate. Add the trigger condition: "Call when the user has provided an order ID and is asking about order status."

**Attach tools to the smallest scope that needs them.** Tools attached at the root agent level are visible at every stage. More tools in scope means more selection ambiguity. Stage-specific tools (payment submission, refund processing, calendar booking) should be attached only to the node that uses them, or referenced from the procedure that uses them so they appear only while it is active; and a node that must have a narrow set should switch Inherit tools off (§2.4.1).

**Use response filters to remove noise from tool outputs.** A tool that returns a verbose JSON payload pollutes the model's context with irrelevant or sensitive fields. Configure the response filter to surface only what the agent should see. This improves response quality and reduces accidental leakage of internal fields.

**Use assignments to capture values you will use later.** When a tool returns data that will drive a downstream expression edge or a future prompt reference, assign it to a dynamic variable rather than relying on the model to remember it across turns. Memory across turns is unreliable; explicit state is not.

**Pin what the model should not choose.** Parameters the model has no business deciding (the account ID from the initiation data, a fixed region code, an API version) should be bound to a dynamic variable or a constant rather than left for the model to fill. Tool nodes can additionally override parameters per call site, so one shared tool can be reused with different fixed values at different points in a workflow.

**Consolidate overlapping tools.** If two tools have similar names and descriptions, the model will sometimes pick the wrong one. Merge them, or make their trigger conditions clearly distinct.

**Match the error-handling mode to the user experience you want.** Raw passthrough errors from a backend are rarely the right thing to expose to the LLM. Decide whether the agent should explain the error, retry silently or escalate, and configure the tool's error mode accordingly (§2.6.4).

**Watch the execution stats.** The agent's Tools table shows successful calls and total executions over the last seven days per tool. A tool with a falling success rate is usually the first visible sign of a backend change; the alerting monitors can notify on tool-failure spikes.

#### 2.6.3 Execution modes, speech around tools and timeouts {#2.6.3-execution-modes,-speech-around-tools-and-timeouts}

Webhook, code and MCP tools support three execution modes; the choice trades user-perceived latency against the agent's ability to reference the result:

* **Immediate (default).** The turn blocks until the tool completes; the agent does not speak until the response is in. Right for any tool whose result is the user-facing answer.  
* **Post tool speech.** The tool waits until everything the agent has already said in this turn has finished playing, then runs and blocks like an immediate call. Nothing happens in the background; the point is that a farewell or "transferring you now" line is heard in full before the action fires. End call, transfers and voicemail detection use this mode by design.  
* **Async.** The tool is dispatched in the background and the model immediately receives an "in progress" marker, so the conversation continues. When the background run finishes, the result is delivered back into the conversation and triggers an agent turn, and any dynamic-variable assignments on the tool are applied then. The agent can therefore react to the result later, but never wait for it in the same turn. Right for slow side effects (CRM writes, long-running jobs, notifications). Inside a Tool node an async tool counts as successful immediately, so result edges cannot see its outcome and its assignments land after the edges were evaluated (§2.4.1). Tool-call sounds cannot be combined with async execution.

Three settings shape what the user hears while a tool runs:

* **Pre-tool speech** (auto, force, off) decides whether the model says a short line ("Let me check that for you") before the call. Auto asks the model for a filler only when the tool's recent average latency has been above about three seconds, and suggests a longer filler the slower the tool has been; force always asks for one; off never does. Force is right for tools that reliably take more than a second or two from the first call.  
* **Tool call sounds** (typing, light background music, or off) play during execution, with a behavior setting that plays them only when there was no pre-speech or always. Sounds are a better fit than silence for tools over a few seconds and a worse fit than a spoken line for tools under one second.  
* **Interruption mode** decides whether a barge-in cancels the tool: allow (default), disabled while the tool runs, or disabled while the tool runs and until the agent has finished speaking about the result. The strictest mode wins when tools run in parallel. Use the strict modes for payments, bookings and verification, where an interrupted confirmation is worse than a short unresponsive moment.

**Timeouts** are configurable per tool (webhook tools from a few seconds up to five minutes, MCP tools up to five minutes, with defaults around twenty to thirty seconds). When a tool times out the model receives an error result; what it then says is governed by the error-handling mode. Lower the default for tools with predictable upper-bound latencies; an over-generous timeout means a hung call sits silent before the agent reacts.

**Parallel tool calls** are on by default on models that support them, so an agent asked two things at once can call two tools in one turn. Turn it off per agent or per node if the backend cannot tolerate concurrent requests. Custom LLM endpoints only get parallel calls when they are OpenAI's own.

For client tools, the **expects response** flag determines whether the agent waits for the client to answer before continuing (with its own timeout, or indefinitely). Set it true when the next utterance depends on data from the client (selected item, form values, page state); false for UI commands that just need to fire.

#### 2.6.4 Error handling and response shaping {#2.6.4-error-handling-and-response-shaping}

**Error-handling mode** controls what the LLM sees when a tool fails (timeout, HTTP error, malformed response). In every mode the model receives a generic failure marker so it knows the call failed; the modes differ in how much detail follows it:

* **Auto (default).** Webhook and client tools hide the details; the platform's native integrations summarize them; MCP tools and the update-state tool pass them through (MCP so the model can act on the server's message, update state so the model can correct an expression).  
* **Summarized.** An LLM-written summary of the error is appended. Right for tools whose errors are user-actionable ("the address you provided was not found") and whose raw response would be too noisy to speak.  
* **Passthrough.** The raw error is appended verbatim. Almost always wrong for production; backend error payloads are not designed to be spoken. Useful when debugging.  
* **Hide.** Only the generic marker. Right for fire-and-forget tools where the agent should not explain what went wrong.

The choice maps to a user experience: if the user should hear "I had a problem doing that, let me try again", use summarized and pair it with a workflow-level retry. If the user should hear nothing, use hide and route the failure through a result \== false edge.

**Response filter** controls what fields of a successful response the LLM sees: everything (default), only the listed paths, or nothing (when only the side effect matters). Use the allow-list whenever a backend response includes fields the model should not see: internal IDs, debug fields, personal data the agent has no reason to surface, oversized arrays. Filtering reduces context (cheaper, faster generation) and prevents accidental disclosure.

**Redirects** are not followed by default; if your endpoint redirects, enable it and allowlist the destination domains, and note that the redirected request is sent as a GET without the tool's headers.

#### 2.6.5 Dynamic variables in tools {#2.6.5-dynamic-variables-in-tools}

Tools both consume and produce dynamic variables.

**Consuming.** `{{variable_name}}` substitutions work in the webhook URL path, query string, headers and request body, in MCP server URLs and headers, and in the custom LLM endpoint configuration. The runtime substitutes right before the request is sent, so you can template `https://api.example.com/customers/{{customer_id}}/orders` or an authorization header without writing code. Two prefixes matter: `{{secret__name}}` marks a secret variable that can be used in headers and URLs but is never shown to the model, never spoken and redacted in logs; `{{system__env_label}}` resolves a workspace environment variable to its value for the conversation's environment, which is how one tool points at staging in tests and production in live calls (§2.17.4).

**Footgun: a missing variable can go out as an empty string.** If a referenced variable is not set at runtime and has no placeholder, the request may go out with a malformed URL or an empty header, silently. The fix is to give the variable a placeholder, set it upstream (initiation data, initiation webhook, a prior assignment), and gate the workflow path so the tool only runs when the variable is known. The Tool call panel (§3.3) shows the rendered URL and headers, which is where you confirm a substitution happened.

**Producing: assignments.** Configure assignments to extract values from a tool's response and persist them as dynamic variables for later turns or downstream expression edges. Each assignment names a dot path into the JSON response (array indices allowed) and the variable to write; several per tool are fine, and they also run for tools executed inside Tool nodes and for MCP tools. Scalars keep their JSON type (a boolean stays a boolean, which the expression edges depend on); a response that is not valid JSON skips all assignments. Two flags:

* **Preserve native type**: lists and objects are stored as structured values for tool parameters and prompt insertion rather than stringified. Expression edges still compare lists as strings.  
* **Sanitize**: the assigned field is removed from the response before the model sees it. Use it for sensitive fields the workflow needs but the agent should not speak.

A data collection item can also take its allowed values from a dynamic variable, and a tool parameter can restrict the model's choice to the values held in one, so lists returned by a lookup can constrain later steps without a prompt instruction.

**System dynamic variables** are available in every conversation without configuration: the agent and current agent identifiers; the conversation identifier; the caller's and the agent's numbers on phone, WhatsApp and SMS conversations; the provider call identifiers; the elapsed duration; the current time in the agent's timezone (and in UTC, plus date, hour, minute and second components) and the timezone itself; turn counters for the conversation, the current agent and the current workflow node; whether the conversation is text-only; the channel it arrived on; the end-user identifier the client passed; the environment; and the serialized conversation history. Call-state variables refresh every turn. Inbound SIP headers prefixed `X-` arrive as `{{sip_<header>}}` variables. The complete list is in the platform documentation on dynamic variables.

#### 2.6.6 System tools {#2.6.6-system-tools}

System tools control call mechanics. **Most are not enabled by default; every system tool an agent uses has to be added to its tool list** (agents created in the dashboard get End call by default; agents created through the API do not). Most production agents need at least End call and one of the transfer tools. Without them the agent has no mechanism to end the call cleanly or escalate, and calls only terminate via the silence end-call timeout, the maximum duration or the user hanging up.

The set partners use most:

* **End call.** Lets the model end the conversation when the user is done, with an optional farewell. Without it, every "thanks, goodbye" runs to a timeout and feels broken.  
* **Transfer to number.** Transfers to a phone number or SIP address, as a **conference** (default; the agent can brief the human before connecting), a **blind** transfer (direct, keeps the original caller ID; native Twilio only) or a **SIP REFER** (the only type that can target a SIP address; needs a REFER-capable trunk; no warm message). Supports multiple destinations with a natural-language condition each, a reassurance line to the caller, and post-dial digits on Twilio. On SIP REFER transfers only, up to twenty custom SIP headers templated from dynamic variables (resolved at transfer time, so mid-call assignments can populate them) and user-to-user information can be attached, which is how partners pass call context to the receiving system. Phone transfers work on Twilio, SIP trunk, Exotel and Amazon Connect calls (where "transfer" hands the contact back to the Connect flow); contact-center streaming integrations use their own transfer tools. Without this tool, "transfer me to a human" has no path to action.  
* **Transfer to agent.** Hands off to another agent, optionally a specific branch or workflow node of it, with a condition per target, a delay, an optional transfer message and control over whether the target's first message is spoken and whether the voice carries over (§2.4.6). Use for true agent-to-agent handoff (router to specialist), not for stage transitions within one agent.  
* **Language detection.** Lets the model switch the conversation's active language to one of the configured presets, by default only on an explicit request or clear evidence, optionally only during the first couple of user turns. Without it a multilingual agent stays in its starting language.  
* **Skip turn.** Lets the agent yield without speaking when the user pauses mid-thought or asks for a moment, with an optional maximum wait; the silence timer pauses while waiting.  
* **Play keypad touch tone.** Sends DTMF tones during a call. Required for navigating IVRs the agent is calling into (outbound flows that need to press digits). Phone calls only.  
* **Voicemail detection.** Detects an answering machine and either leaves a configured message (dynamic variables allowed) or hangs up. Required for outbound dialing where voicemail is common. Distinct from the carrier-level answering machine detection available on Twilio numbers, which can hang up before the agent speaks at all.  
* **Update state.** Lets the model write up to fifty dynamic variables mid-stage from the same expression language the update\_state node uses (constants, other variables, extracted values, arithmetic and comparisons). Useful when a value becomes known inside a long Subagent and later edges depend on it.  
* **Knowledge base search.** The retrieval tool described in §2.8: semantic and keyword search, whole-document fetch and listing, enabled through the agent's retrieval mode rather than the tool list.  
* **Flag issue for review.** Lets the agent open a triage ticket for the current conversation silently, without telling the caller or ending the call, when it recognizes it is failing (missing tool, unknown policy, an action it cannot take). Reviewers pick the ticket up in the Issues queue (§3.6). Not available on zero retention workspaces.  
* **Start and end procedure.** Added automatically when the agent has procedures (§2.5); never configured by hand.

**The recurring mistake is omitting (or removing) a system tool the workflow depends on.** Audit by walking every "what does the agent do at the end of this flow" and "what happens if the user asks for a human" path; for each, confirm the relevant tool is enabled on the nodes where it is needed. A workflow End node still terminates without End call, but the model has no way to end the call from inside a Subagent in response to user intent, so those calls run to timeout.

**Override the default description before disabling a system tool.** Each system tool opens for per-instance configuration, and the description the model sees can be replaced. When transfer, language detection or End call fires at the wrong moments (too often, not often enough, in the wrong contexts), the first fix is to tighten the description ("Call only when the user has explicitly asked for a manager or said the conversation is over; do not call for routine thank-you acknowledgements"), not to remove the tool. Removing it eliminates the action entirely; tightening narrows when it fires while keeping the action available. Keep End call off nodes where ending the call is never right (mid-verification, mid-payment); a model with End call in scope sometimes uses it as a vehicle for a continuation message, with a fabricated reason.

#### 2.6.7 Testing tools and mock responses {#2.6.7-testing-tools-and-mock-responses}

The agent builder exposes a **Test** action on webhook tools (and an in-editor run on code tools). Filling in test parameters and running it makes a real call against the configured endpoint, through the same path the runtime uses, with the same auth, headers and timeout, against the environment you pick. Use it during setup to confirm the tool is reachable, the auth is correct and the response shape matches what your assignments and response filter expect; use it again whenever the backend changes. MCP servers have a connectivity preview that lists the tools the server exposes without saving. Client tools cannot be exercised from the server; test them from the preview panel or your own application. Every execution of every tool is also kept in a per-tool execution log with request, response, latency and error category, filterable by agent and time range.

**Save as mock.** On any tool result in a conversation, the Save as mock button captures the response payload as a mock rule on the tool itself. Mocks are scoped per tool, not per test, so the same rules serve every simulation that mocks the tool.

**Mock selection.** When a test mocks a tool, the runtime walks the tool's rules top to bottom and uses the first whose parameter conditions match (or the first catch-all). Order matters: a catch-all placed above a narrow conditional rule makes the narrow one unreachable. A rule can be flagged as an error so the agent receives it through its error-handling path, which is how failure branches are tested. When no rule matches, the test's fallback decides whether the agent gets an error (default) or the real tool is called.

**Mock limitations.**

* Webhook, client, code, native integration and MCP tools can be mocked (MCP mocks live on the server's per-tool settings). System tools are never mocked; End call, transfers and language detection run their real logic in tests. In a simulation a phone transfer is not placed; the run ends with a "transferred" outcome.  
* Client tools cannot run in a simulation (there is no client); a simulation that reaches one ends with an error unless the tool is mocked.  
* Mocks fire only in tests and in the editor's preview with mocking switched on. A live conversation (widget link, phone call) always hits the real endpoint, so a demo that depends on mocks must be run from the preview or as a simulation (§2.13.6).

Together, the Test action and mocks form the basic feedback loop: Test confirms the tool works against the real backend; mocks let simulation tests cover the agent's behavior against known response shapes without depending on backend availability for every run.

### 2.7 Authentication and sensitive operations {#2.7-authentication-and-sensitive-operations}

**Authentication must be deterministic, not inferred.** Do not let the LLM decide whether a user is authenticated. The privileged Subagent (the one with access to account data, transactions, refunds) must be unreachable except through an edge gated by an expression over a tool-assigned variable or, where the backend fails at the transport level, a result edge.

**Choose the authentication method based on the channel and risk profile:**

* **Host application authentication** when the agent is embedded in a logged-in web or mobile experience. Pass verified identity in via dynamic variables at conversation start. Lowest friction; relies on the host being trustworthy, so protect the agent itself with signed URLs or conversation tokens and an origin allowlist, otherwise anyone can start a conversation claiming to be anyone.  
* **Knowledge-based authentication (KBA)** when no upstream identity is available. The agent collects facts (account number, postcode, date of birth, security answers); a webhook tool validates them against your identity store. Use multiple factors for higher-risk actions.  
* **Caller-ID dynamic variables (telephony)** for low-friction phone authentication, only when paired with prior opt-in or a second factor. Caller IDs are spoofable and shared phones exist; alone they are not sufficient for sensitive operations.  
* **One-time code (OTP)** when stronger out-of-band verification is required. The agent triggers a tool that generates and delivers a code via SMS or email; the user repeats the code back (spoken, or by keypad on phone calls); a second tool validates it. Strongest of the four; highest friction. On a phone call, keypad entry with DTMF input enabled is more reliable than speech for digit sequences and can be redacted from the transcript (§2.16.4).

**Increment a counter for multi-question security flows.** When authentication requires N correct answers, store the running success count in a numeric dynamic variable via tool assignment or an update\_state node, and gate the privileged Subagent with an expression edge like `auth_success_count >= 3`. Do not gate it with an LLM condition that infers "the user has answered enough questions".

**Confirm prefetched context before using it.** When the agent receives preloaded records at conversation start (recent orders associated with the caller's phone number, for instance), treat them as candidates, not consent. Confirm with the user before acting on them. Never read full identifiers aloud; never expose internal "no record found" text.

**Keep secrets out of the model.** Credentials for your APIs belong in workspace secrets or authentication connections (OAuth client credentials, signed JWTs, basic or bearer auth, custom headers, or a URL the platform fetches a token from), referenced from the tool's auth settings. Per-user tokens passed at conversation start belong in `secret__` dynamic variables, which can be used in tool headers but are never shown to the model, spoken or logged. Authentication connections report their health (active, refresh failed, revoked, invalid) so a broken credential shows up before the agent does. Note the direction of trust: the platform signs the webhooks it sends you (post-call events, batch events) with an HMAC signature you should verify, but it does not sign the tool calls your agent makes to your APIs; authenticate those with the tool's headers or connection, and allowlist the published egress IP addresses for defense in depth.

**Use the conversation initiation webhook for telephony CRM lookup, not a tool and not the post-call webhook.** Telephony agents have no logged-in host application to pass identity in from, so the most common pattern ("look up the caller in our CRM by phone number, greet them by name, branch on their tier") needs a different mechanism. The platform's **conversation initiation webhook** fires to your configured URL before the agent's first audio turn, for new inbound phone, SIP, WhatsApp, SMS and contact-center conversations (and for outbound calls that were started without initiation data), with the caller's number, the called number, the agent, the call identifier, the conversation identifier and, over SIP, the custom headers. Your endpoint responds with JSON that can include **dynamic variables** (the CRM lookup result), **configuration overrides** (the first message and other fields the agent's security settings mark as overridable for this call), a **branch** and an **environment** to run on, a **starting workflow node** to skip into, and a **selection of procedures** to make available or pre-start, each of the last two only when the agent's security settings allow it. The webhook has to be enabled in the agent's client-data settings, and a call that already arrives with initiation data (an API-initiated outbound call, a batch recipient) skips it. This is the only place to inject "Hello {{first\_name}}, I see your last order..." into a telephony agent's first message: the post-call webhook fires after the conversation ends, and a tool call inside the conversation runs after the agent has already greeted the caller as a stranger.

Operational constraints before relying on it:

* **The webhook is part of the call setup chain.** If your endpoint is slow or returns an error, the call can fail to start; there is no "proceed without context" fallback. Design the endpoint to respond well under a few seconds (cache aggressively, pre-warm by phone number) so a slow CRM does not become a failed call, and keep the response under the documented size limit.  
* **No retries on initiation.** Unlike the post-call webhook, which retries on a schedule, the initiation webhook does not; a server error is a failed call, not a deferred one.  
* **Every custom variable the agent references must come back.** A variable the prompt or first message uses that neither the webhook nor a placeholder supplies fails the conversation start.  
* **Caller ID is still spoofable.** A successful CRM lookup by phone number is not authentication. Treat the prefetched record as a candidate and confirm or apply a second factor before disclosing account-specific information.  
* **It does not run for the widget, the SDKs, the editor's preview or tests.** Web and app clients pass initiation data directly; tests carry their own dynamic variables. Design the agent so it works with placeholders when the webhook did not run.

For deeper telephony integration patterns (Twilio vs native SIP trunks, BYOC carriers, transfer semantics, custom SIP headers, contact-center integrations), see the SIP and telephony reference; this guide covers only the conversation-design principles that intersect with telephony (§2.16).

### 2.8 Knowledge base principles {#2.8-knowledge-base-principles}

**Partition knowledge by scope.** A single undifferentiated knowledge base forces the agent to search across unrelated content. Split by domain (general FAQ, order status, returns, product specs, policy) using folders, attach each to the smallest node or procedure that needs it, and tell the agent which source applies to which question.

**Decide how each document reaches the model.** Each document has a usage mode: always inserted into the prompt, or retrieved when relevant. Insert small, always-relevant content (company description, return-policy summary, opening hours); retrieve everything else. Moving long content from the prompt into a document does not reduce token cost if the document is still set to prompt insertion; verify the usage mode matches your intent, and remember that folders are always retrieval-scoped (§2.11 Knowledge base configuration).

**Choose between per-turn retrieval and the search tool by how often knowledge is needed.** Every-turn retrieval is right for agents whose job is answering from documents: the platform rewrites each user request into a query and brings in the best chunks automatically, at a small latency cost on every turn. The knowledge base search tool (the "optional" retrieval mode, the default for new agents) is right for agents that mostly do something else and only occasionally need to look something up: the model decides when to search, can search semantically or by exact keyword, can fetch a whole document when it needs the full policy text, and can list what exists before searching. The tool also makes retrieval visible in the transcript as a tool call, which helps audits and debugging. Do not run both at once on the same agent; pick one per agent or per node.

**Mark internal-only content explicitly.** If an article contains both a customer-facing answer and internal notes (escalation thresholds, agent guidance, edge cases), mark the internal sections clearly as non-spoken. Otherwise the agent will read them aloud.

**Tell the agent what to do when the knowledge base does not answer.** Without explicit guidance, the model will sometimes invent plausible-sounding policy. The prompt should say: "If the answer is not in the knowledge base, do not guess. Say you do not have that information and offer to transfer or take a message." Pair it with an evaluation criterion that detects fabrication, optionally one that lets the judge see the retrieved chunks (§2.12.3).

**Selection strategy beats volume.** A prompt that says "use the knowledge base" without telling the agent which source applies to which question is underspecified. Define routing: "For order status, use the orders documents. For return policy, use the returns documents. For product questions, use the catalog."

**Prefer a deterministic source over retrieval for facts that must be exact.** Retrieval is a probabilistic search over chunks of unstructured text. It suits content where some paraphrasing is acceptable: policy summaries, troubleshooting steps, conceptual answers. It is poorly suited to facts that must be returned verbatim: phone numbers, addresses, prices, opening hours, account fields, identifiers, medical codes. For those, choose a deterministic source by volume and volatility:

* **Put the facts directly in the prompt** when the set is small and stable: a handful of phone numbers, one set of opening hours, a short list of department contacts. The agent reads them verbatim, with no retrieval round trip and no failure mode. This is the lowest-cost fix and usually the right starting point.  
* **Expose a backend tool** when the fact set is too large for the prompt or changes often enough that prompt updates would lag the source of truth (live inventory, current pricing, on-call rosters). The tool returns the exact value and the agent speaks it.

Hallucinated facts from retrieval (a phone number that almost matches, an address with a transposed digit, opening hours close to but not exactly right) signal that the content type is unsuited to retrieval, not that retrieval needs more tuning.

**Keep the content fresh at the source.** URL documents can re-fetch themselves on a schedule and drop pages that disappear; Google Drive files and folders can be kept in sync; text documents are editable in place; uploaded files can be replaced. Prefer a synced source to a copy someone has to remember to update, and check the dependency list before deleting a document that several agents share.

**Read the retrieved chunks when answers are off.** The transcript shows which chunks the agent received on each turn (§3.2). If the right chunks are missing, fix the content, the chunking or the retrieval settings; if they are present and ignored, fix the prompt. Tuning the vector distance threshold or the chunk count without looking at the actual chunks is guesswork.

### 2.9 Testing and operations principles {#2.9-testing-and-operations-principles}

**A passing test suite is a signal, not a guarantee.** Coverage matters. A suite that only tests the happy path will pass easily and prove little. Build coverage across refusals, mid-conversation pivots, ambiguous inputs, tool-heavy interactions, failure paths and the long tail of edge cases. Pair turn-level tests with simulation tests; context drift and compounding errors only emerge across full conversations (§2.13).

**Validate every change on a branch. Never push directly to the full user population.** Even minor prompt changes can regress behaviors that were previously stable. Branch, run the attached suite, send a small percentage of traffic to the new branch, evaluate against the same criteria as main, and only merge when the new branch matches or beats the control (§2.17). Treating the full user base as the test environment eliminates the observability needed to make confident decisions.

**Avoid evaluation drift.** Under pressure to ship, teams unconsciously lower the bar for what counts as passing. The criteria defined during scoping are the anchor. If they start to feel too strict, revisit and deliberately update them as a new version, and re-score past conversations so the comparison stays honest.

**Avoid over-indexing on recent failures.** When one conversation goes badly, the impulse is to patch immediately. Reactive prompt changes made without running the suite frequently regress previously stable behaviors. Treat every change, however small, as a new iteration: write the test from the failing conversation first, then change the agent, then run the suite.

**Know when to stop iterating.** When the agent consistently meets evaluation criteria across multiple test runs, platform metrics have stabilized, and branched rollouts show no regression, further changes carry more risk than reward. The signal to expand traffic is confidence, not time. Batches under 100 calls per branch produce too much variance to draw conclusions.

**Use the conversation page to find the moment things went wrong.** When something fails in production, do not reason from headlines. Open the transcript, find the exact turn where the interaction diverged, and trace it back to a prompt instruction, an edge condition, a tool description or a procedure trigger. Then write a test that captures it (§3).

**Instrument what your prompt is trying to enforce.** If the prompt says "do not disclose account information before verification", create an evaluation criterion that detects violations. If it says "use a calm, professional tone", create one for that. Critical rules without measurable instrumentation will erode silently.

**Write evaluation criteria as transcript-level judges with all three outcomes.** State exactly what counts as success, what counts as failure, and when unknown is right. Avoid combining tone, factuality, resolution and compliance into one criterion; split them (§2.12).

**Write data collection descriptions as extraction specs, not summaries.** "Summarize everything the user said" is not a data collection description. "Select resolved if the user's issue was completed without handoff, escalated if a human transfer occurred, abandoned if the user disconnected before resolution. Use null if the transcript is too incomplete." is.

**Watch the operational signals, not just the pass rate.** Topic discovery shows where the agent is weak; the Dashboards show evaluation, latency, tool failure and guardrail trends per branch and environment; alerts notify on failure-rate, tool-failure, webhook and guardrail spikes; the triage queue collects the conversations a human flagged or the agent itself flagged mid-call. A program that only looks at test results misses the drift that happens between releases.

### 2.10 Common mistakes to avoid {#2.10-common-mistakes-to-avoid}

**Bloated, repetitive prompts.** The same instruction restated five different ways. Vague intensifiers ("this is critical") on every paragraph so nothing is actually prioritized. Contradictory rules without precedence. The platform already wraps the prompt with safety, structure, audio and tool guidance; additional repetition makes the model follow the wrong copy.

**One giant prompt doing everything.** Greeting, authentication, routing, support, tools, escalation and wrap-up in a single prompt. The agent works for the first few turns and then loses track of which stage it is in. Fix: split by objective. Stages exist where the tool set changes, the user goal changes or compliance gates change; the long tail of intents goes into procedures (§2.5).

**Global tool dumping.** Every tool available to the root agent regardless of stage, so specialist nodes can call unrelated tools and the model picks the wrong one. Fix: attach tools to the smallest node that needs them, and switch Inherit tools off on nodes that must have a narrow set.

**Read-only lookups in dispatch tool nodes.** A user asks "where is my order?" and the workflow routes to a silent Tool node, then to a generic support node. The agent never gets to speak the answer in the same turn. Fix: read-and-answer tools belong on the relevant Subagent as attached tools.

**LLM conditions on tool output.** Routing on "if the verification tool returned success" using a natural-language condition. Fix: use a result or expression edge.

**Result edges on tools that signal failure inside a 200 response.** The call succeeded, the body said no, the gate passed. Fix: assign the field and branch on an expression (§2.4.2).

**String placeholders in numeric or boolean gates.** `retry_count < 3` against a `""` placeholder never fires; `verified == true` against the string `"true"` is always false. Fix: typed placeholders and assignments from real JSON types.

**Vague edge conditions.** "Conversation is going well." "User seems frustrated." "Handle the cancellation flow." These are not predicates; they are vibes or instructions. Fix: phrase as observable user state with positive triggers and explicit exclusions for nearby intents.

**Conditions about the agent's own conclusion.** "The agent has confirmed the warranty is active" fires before the agent speaks. Fix: classify in an update\_state node with an undetermined option and branch on expressions (§2.4.3).

**Missing failure paths.** Tool nodes with only a success edge. Authentication flows with no path for repeated failure. Structured procedure tool steps with no failure handler (the call ends). Fix: every tool node, tool step and high-value flow needs a named failure branch with concrete recovery wording.

**Gates with a bare boolean and a single exit.** A consent or verification stage that advances on a clarifying question because "not answered yet" has no representation. Fix: a three-state variable and a path back to the question.

**Global knowledge attachment for stage-specific content.** Returns policy, product catalog and order lookup all attached at the root. Fix: attach each to the smallest node that uses it, or scope it to the procedure that needs it.

**Procedures with vague or overlapping triggers.** The model starts the wrong one or none. Fix: write triggers from the user's side, make them disjoint, cover phrasing variants (§2.5.2).

**Reading sensitive data aloud.** Full card numbers, raw email addresses, long URLs, complete account numbers spoken in plain voice. Voice is a leakage surface, not a confirmation channel. Fix: confirm last digits only, send links to the chat channel, spell carefully when needed.

**Testing in production with no branch.** Pushing a prompt change directly to all users; the next day escalation rate is up and nobody knows why. Fix: every change goes through a branch first, with the attached test suite and a small traffic share (§2.17).

**Ignoring the defaults that changed.** New agents default to the newest voice model, the streaming recognizer, a wait queue and a backup LLM cascade; an agent cloned from an old template may carry none of these. Fix: review the configuration choices in §2.11 on every agent you inherit.

**Treating the proof of concept as the production agent.** A POC validates that an agent can complete the task. A production agent handles the full distribution of real-world inputs, including edge cases, abuse and ambiguity. Plan for the gap.

### 2.11 Configuration choices {#2.11-configuration-choices}

The settings in an agent's conversation config and platform settings each represent a tradeoff. The defaults are reasonable for most cases, but production-grade agents revisit these choices deliberately rather than accepting defaults by accident. This section names the most consequential settings and the conditions under which each option is appropriate. Defaults quoted here are the ones a new agent is created with in October 2026; the product changes them over time, so treat the agent editor as canonical.

#### Speech recognition (ASR) {#speech-recognition-(asr)}

**Scribe v2 Realtime is the default recognizer, and the right one for almost every agent.** It streams partial transcripts, supports language detection and keyword biasing, and is what the default turn-taking model and the interruption-ignore terms require. The buffered Scribe variants (higher accuracy, higher latency) are only selectable with the older turn-taking model and without ignore terms; reserve them for high-stakes transcription where small recognition errors compound across long, content-dense turns. The original pre-Scribe recognizer is deprecated and does not support keyword biasing.

**Use the keyword list for vocabulary the recognizer cannot guess.** Brand names, product SKUs, drug names, foreign place names, internal codenames. The keyword list biases the recognizer toward the right term. Spelling tricks in the prompt do not affect ASR; the keyword list is the only reliable lever for unusual proper nouns.

**Audio formats are set by the channel, not by you, on telephony.** Phone and SIP calls and WhatsApp use the formats the carrier path requires. The input and output format settings only matter when your own application streams audio through the SDK or WebSocket, where they must match what the client actually sends and expects. The wrong format is silently lossy on the SDK path: recognition degrades without an obvious error.

**Set the agent language explicitly and switch deliberately.** There is no permissive "auto-detect across all languages" mode. Recognition runs in the agent's current language, and the language changes only through the language detection system tool (§2.6.6), which by default switches only when the user explicitly asks or clearly speaks another language, and can be limited to the start of the conversation (the first couple of user turns) so a stray foreign phrase later in the call does not flip the agent. For multilingual deployments configure language presets and enable that tool. When several agents serve the same channel and population, keep their ASR settings (model, keywords) consistent across the set; divergence usually traces back to an accidental override on one agent.

**Enable "Filter background speech" for agents that run in non-quiet environments.** Off by default, this makes voice-activity detection ignore far-field human speech, so television audio, café chatter, side conversations or family in another room are no longer treated as a turn signal. With it off, the agent stops mid-utterance every time something audible happens around the user, then sits silent waiting for them to speak; the user often does not realize their environment caused the cutoff and the call stalls. The cost is slightly worse responsiveness for very soft-spoken users; for most consumer-facing agents reached from phones the right default is on. It is distinct from interruption-ignore terms, which filter specific recognized words.

#### Turn-taking and timing {#turn-taking-and-timing}

**The default turn-taking model is the newer one; keep it unless you need the buffered recognizers.** Turn eagerness sits on top of it. The default normal setting waits until the model is confident the user has finished. Eager reduces latency by acting at lower confidence and suits fast-paced, casual interactions where occasional cut-offs are tolerable: sales prospecting, lightweight commerce, conversational chat. Patient waits longer and is right for users who pause mid-sentence: elderly callers, non-native speakers, regulated environments where users read from documents, any flow involving spelled-out IDs. Choosing eager for a slow audience produces an agent that constantly interrupts; choosing patient for a fast one produces an agent that feels laggy.

**Tune turn timeout and silence end-call to the use case.** The turn timeout (how long the agent waits for the user before speaking again) defaults to 7 seconds. Increase it where the user is expected to think (quoting, diagnostics, document lookup); decrease it for short transactional flows where silence usually means the user is gone. The silence end-call timeout is off by default; turn it on for phone deployments, because stranded calls cost money and hold a concurrency slot. The initial wait before the agent prompts a silent user follows the turn timeout unless set separately.

**Spelling patience is on by default (Auto).** It stops the agent from treating the short pauses between spelled letters as turn ends. Leave it on for any flow that asks for names, emails, IDs or postcodes; the only other value is Off.

**Speculative turn is a latency-versus-cost tradeoff, and it is on automatically for the newest TTS models.** Speculative turn starts LLM generation while the user is still finishing, then confirms or discards. It cuts perceived latency at the cost of extra LLM tokens. When unset, it is enabled for agents on the V3 and V4 voice families. Turning it off on a node that collects a one-word answer ("yes", "no", a digit) makes that node feel slow, because short utterances are exactly where the turn model is slowest to commit; keep it on for consent and confirmation stages.

**Use a soft timeout when the LLM is slow.** Heavy reasoning models and long tool chains can leave the conversation silent long enough to feel broken. A soft timeout plays a brief filler after a configurable delay (half a second to a few seconds), with optional additional fillers for longer waits and a cap on repeats, and can be suppressed until the user has spoken. The filler can be static text (safe when latency is already tight) or generated by the LLM from a short prompt (more natural, slightly slower).

**Configure interruption-ignore terms for backchannels.** "Uh-huh," "right," "okay," "got it." Without them, the agent stops mid-sentence whenever the user signals presence. The platform ships presets (acknowledgements on by default; openers and confirmations available) and accepts your own short terms, matched case-insensitively. This single change resolves a large fraction of "the agent keeps stopping for no reason" complaints.

**Decide where interruptions are not allowed.** Besides the first message, interruptions can be disabled per tool: while the tool runs, or while it runs and until the agent has finished speaking about the result. Use this for payment, booking or verification tools where a barge-in mid-call would otherwise cancel the agent's confirmation. Pair it with the tool's pre-speech setting (§2.6.3) so the user hears an acknowledgement before the silence.

**Cap the maximum conversation duration deliberately.** The default is 10 minutes; the range runs from 1 minute to 2 hours. When the cap is reached the agent speaks the configured max-duration farewell uninterruptibly and ends. For short transactional flows, lower the cap so a stuck conversation ends cleanly, and make sure the farewell wording is right.

#### Text-to-speech and voice {#text-to-speech-and-voice}

**Pick the TTS model for the deployment profile, not the showcase.** New agents default to Eleven v4 Turbo, the low-latency member of the newest family. V3 Conversational (generally available since August 2026\) and the V4 models produce more natural, expressive speech and stay accurate across long conversations; the Flash v2 family remains the lowest-latency, lowest-cost option with broad language coverage; Multilingual v2 is the high-quality non-streaming-era option; the Turbo v2 family is deprecated. Avoid mixing V3-family and older voices on one agent.

**Pick the voice on representative content.** A voice that sounds great on short marketing greetings can sound monotonous over a 90-second support call. Listen to candidate voices on full sample interactions for your use case before committing. Audio filters that make a library voice sound less polished or match a different environment exist in alpha.

**Tune stability, similarity and speed one knob at a time.** Stability controls how varied the same line sounds across repetitions; lower values give more dynamic delivery but can sound erratic on long calls. Similarity controls how closely the output matches the source voice. Speed (0.7 to 1.2) slows the agent for accessibility or speeds it up for transactional flows. Small changes have outsized effects on perceived professionalism: change one variable, listen end-to-end, then change the next. The newest models also support an expressive mode with suggested audio tags the LLM can use to shape delivery.

**Use the pronunciation dictionary for anything that must be said correctly, and pick the right rule type for the term.** Brand names, product names, drug names, foreign place names, acronyms, internal codenames. Spelling tricks in the prompt are unreliable; the dictionary is the deterministic lever, applied to the text after the LLM generates and before it reaches TTS. Two rule types:

* **Alias rules**: a literal string replacement (for example "Anthropic" to "an-throw-pic"). Work across all languages and TTS models. The right default for most consumer-facing terms.  
* **Phoneme rules**: phonetic pronunciation in IPA or CMU/Arpabet. Higher precision, narrower support: phoneme rules apply on the V4 models, on V3 Conversational when the "phoneme rules for V3" option is on (it is on by default), and on Flash v2 for English only. Other model and language combinations ignore them silently.

Rule matching is case-sensitive by default; toggle the case-sensitive flag on individual rules when a term appears with varied capitalization. Several dictionaries can be attached to one agent, so compose a small shared dictionary (brand names, regulated product names) with agent-specific entries on top.

**Choose the text normalization mode based on whether you trust the LLM to normalize upfront or want a deterministic pass before synthesis.** Both solve the same problem: TTS reads literal characters, so \$3.50, 5/14/2026, 12:30pm and \+1-800-555-1234 are spoken in ways users do not want.

* **System prompt mode (default).** The platform appends a fixed, non-editable instruction asking the LLM to write symbols and digits out as words ("three dollars", "hashtag"), with locale-specific variants for languages with non-trivial number systems. Zero added latency. The downside is reliability: the LLM occasionally forgets, formats inconsistently, or paraphrases numbers.  
* **ElevenLabs mode.** A deterministic, rules-based normalizer runs on the LLM output before each segment reaches TTS, on every model family. Negligible latency. Handles currencies, integers, decimals, common symbols, math operators and time and date markers consistently every turn, but only the categories its rules know about.

Use System prompt mode by default. Switch to ElevenLabs mode for agents that read many phone numbers, opening hours, alphanumeric codes, identifiers, prices or dates per call; the deterministic pass is materially more reliable there and the latency cost is negligible. Either way, pair it with alias pronunciation rules for identifier patterns the agent reads regularly.

**Expect occasional TTS model fallback under generation failure.** When the configured TTS model fails to produce audio for a turn, the platform cascades to the next model down the family ladder (V4 to V3 to Flash to Turbo to Multilingual) so the conversation continues rather than stalling. The transcript shows the model actually used on the TTS badge, which can therefore differ from the configured one on cascaded turns. Occasional cascades are normal under transient failure; frequent cascades on a single deployment indicate a real generation problem worth raising with support.

**The old "streaming latency optimization" setting no longer does anything.** It survives in the configuration for compatibility; do not tune it.

#### First message {#first-message}

Three patterns, each appropriate for different cases:

* **Static interruptible first message (default).** The right choice for ordinary inbound greetings and embedded widgets. Users sometimes start talking before the greeting finishes; allowing interruption keeps the experience natural.  
* **Static non-interruptible first message.** Use when the message contains required content the user must hear: AI disclosure, recording disclosure, regulatory disclaimers. Keep these messages as short as policy allows; non-interruptible audio that runs longer than a few seconds feels hostile.  
* **Empty first message.** Use when the agent should listen first: outbound flows where the human just picked up, or any context where the first turn belongs to the user. The agent waits the initial-wait period before prompting.

**Use a say node as the entry point instead of the first message when the greeting must vary or be preceded by logic.** Different greeting per language detected from caller ID, different greeting by customer tier passed in as a dynamic variable, eligibility check before greeting, account lookup before personalization. When the greeting is the same every time, the first-message field is simpler and avoids an unnecessary node. For telephony personalization, the conversation initiation webhook (§2.7) can also override the first message per call.

#### Language and localization {#language-and-localization}

**Enable the language detection system tool whenever the agent has more than one language preset.** Without it, the presets exist but the agent stays in its starting language even when the user switches; the multilingual configuration is effectively inert. By default the tool switches only on an explicit request or clear evidence; its description is editable, and it can be restricted to the start of the conversation (§2.6.6).

**Know what a language preset can and cannot override.** A preset overrides the voice, the first message, the soft-timeout fillers, and the max-duration and silence end-call farewells for that language. It cannot override the system prompt: write the prompt language-neutrally ("respond in the user's language") and keep language-specific wording in the first message and the fillers. The preset's language must be supported by the agent's TTS model family; the editor validates this.

**Pick a voice strategy across languages deliberately.** Two acceptable patterns and one anti-pattern:

* **One voice across all languages.** Pick a voice with strong cross-language quality and let the TTS model handle pronunciation. Best when brand voice identity matters and minor prosodic compromises in non-native languages are acceptable.  
* **A native voice per language.** Override the voice in each preset with one tuned for that language. Best when per-language quality matters more than consistency.  
* **Anti-pattern: a single-language voice with a multi-language preset list and no per-language voice overrides.** Produces accented or unnatural output in the non-native languages.

**Translate per-language first messages explicitly.** Do not rely on runtime translation for the first impression; it produces inconsistent phrasing on the very turn that sets the tone. Configure a localized first message in each preset.

**Enable "Mix in English" for Indian-language agents.** Available for Hindi, Malayalam, Telugu and Kannada, it lets the agent code-switch the way those users naturally do. Without it, the agent resists the mixing and sounds stilted.

#### LLM selection {#llm-selection}

**Choose the LLM by the use case profile, not by the brand name.** The tradeoff is between latency, reasoning quality and cost. The picker groups models by provider (OpenAI GPT families, Google Gemini families, Anthropic Claude families, and open-weight models hosted by ElevenLabs) plus Custom LLM. Within each family the small or "Flash" or "Lite" variants are the fast, cheap default for FAQ-style agents, lookups and routing; the larger variants are for tool-heavy interactions, multi-step eligibility gating, dispute resolution and any flow where errors compound across turns. The default model for new agents changes over time, so check the editor rather than assuming; Gemini 2.5 Flash is scheduled for deprecation at the end of November 2026 with traffic moving to Gemini 3.5 Flash, so pick the newer Flash generation for new builds.

**Reasoning effort is a per-model dial, not a separate model.** Most current models expose reasoning effort levels (from none or minimal up to high and beyond, depending on the model). Higher effort improves multi-step decisions at a real latency cost; some of the newest Claude models cannot switch thinking off at all, and older models have no reasoning control. Switching model in the editor resets the effort to that model's default. Use elevated effort only where wrong answers carry real consequences, and measure the latency on real turns before shipping it.

**Watch the deprecation badges.** Models show a deprecation badge about three months ahead, and traffic is progressively moved to the designated successor in the weeks before the date. An agent pinned to a deprecated model does not break, but its behavior changes as the fallback share rises. Review agents on deprecated models deliberately rather than letting the migration happen to you.

**Keep temperature low for transactional flows.** Zero is right for any agent expected to behave consistently for the same inputs. Raise it slightly for creative or brand-voice contexts. Some model families ignore temperature when reasoning is enabled; the editor tells you.

**Backup LLMs are on by default; decide whether the default order is right for you.** Every agent has a cascade: if the primary model errors or stalls (no new output for a configurable idle timeout, 4 seconds by default, adjustable between 2 and 15), the next model in the order generates that turn. You can keep the default order, disable the cascade, or set an explicit order. Choose a backup whose latency and quality profile is acceptable for fallback (often a faster sibling of the primary). Custom LLMs cannot serve as backups. For HIPAA and zero retention workspaces, non-eligible backups are filtered out, so check that an eligible backup remains.

**Treat one second as the LLM-response threshold above which the agent needs reorganization, not just a faster model.** Conversation fluency falls off once per-turn LLM generation exceeds roughly one second: pauses become awkward, users re-speak or hang up, and the agent feels broken even when its eventual answer is correct. Per-turn LLM latency is visible on the LLM badge in conversation analysis (§3.2). When P50 LLM latency is consistently above one second, the fix is rarely "switch to a faster model" alone; the agent usually has too much context per turn (a bloated root prompt, dozens of tools in scope, a large KB inserted statically) or runs serial tool chains. Reorganize: trim the prompt, attach tools to specific Subagents, move large KBs to RAG, split stages so each Subagent has a narrower scope. A soft timeout hides the symptom but does not fix it.

**Target roughly 800 ms end-to-end P50 for natural conversation, with the LLM as the dominant slice.** End-to-end latency, from the user finishing speaking to the agent's first audio, is what users feel. Below roughly 800 ms it feels conversational; above it feels mechanical. On a healthy agent on a turn with no tool calls, 60 to 70 percent of that budget is LLM generation, with the remainder split across ASR finalization, turn-end detection, TTS time-to-first-byte and network. Every tool call, RAG retrieval or external dependency adds directly on top. Measure P50 end-to-end on no-tool turns first; if that is already over budget, tool optimization will not save the experience.

**Use the picker's latency and cost figures to compare candidates.** Each model shows an estimated price per minute and per message, computed from your agent's recent behavior and knowledge base size (with a regional surcharge shown in data-residency regions), and a median time-to-first-sentence over the last seven days aggregated across the platform, with higher percentiles on hover and a breakdown by reasoning effort. The Detailed costs calculator next to the picker takes the model, service tier, prompt length, knowledge base size and RAG on or off, and returns per-minute and per-message estimates for the inputs you actually plan to ship with. Both are estimates; validate the budget on a representative sample of real conversations.

**Set the timezone, and the agent knows what time it is.** When an agent has a timezone configured, the platform adds the current date and time in that timezone to the system prompt on every turn. Without a timezone the agent has no sense of "today" or "tomorrow" and will confabulate dates when asked about scheduling, opening hours or availability. The `{{system__time}}` dynamic variable remains available for tool parameters, first messages and any prompt wording that needs the time in a specific place; it is formatted in the same timezone.

**Use a custom LLM only when platform models cannot meet the requirement.** A custom LLM is any OpenAI-compatible endpoint you operate: a fine-tuned model, a private deployment, a data-residency constraint. You provide the URL, model id, credentials (as a workspace secret or an authentication connection), optional headers and API flavor. It adds operational responsibility for endpoint availability, cannot be a backup, caps output tokens, disables parallel tool calls unless the endpoint is OpenAI's own, and must support tool calling (and forced tool choice if the agent uses structured procedures, §2.5.4). Agents in zero retention workspaces need an explicit allowance to use one.

**HIPAA-regulated deployments require model verification.** When the workspace handles HIPAA-covered conversations, only HIPAA-eligible models can be selected; the picker greys the rest out. The eligible set covers the production Gemini Flash line, the production Claude Opus, Sonnet and Haiku lines, the GPT families for enterprise workspaces, selected hosted open-weight models in specific regions, and any custom LLM you operate under your own agreement. Preview models are not eligible even when the production version of the same model is. The set differs by region (India and Singapore have narrower lists). Confirm the current list in the editor before going live and treat the model field as part of the compliance configuration, not a tuning knob.

**SOC 2 and GDPR.** The platform is SOC 2 Type II audited and GDPR-compliant, which covers the procurement-review questions partners are most often asked. Direct customer security or legal teams to the trust center and DPA for canonical documentation rather than this guide. This guide covers the configuration choices that affect compliance posture (model eligibility above; retention, redaction and zero retention mode below).

#### Privacy, retention and security {#privacy,-retention-and-security}

**Retention is one window with two switches.** The conversations retention period defaults to unlimited. When you set a number of days, choose what expires: "Delete transcript and derived fields" removes the transcript, analysis and extracted data; "Delete audio" removes recordings. "Apply to existing conversations" back-applies the policy. To keep transcripts for analytics but drop recordings, turn "Store call audio" off instead of waiting for retention. Match the window to the longest legitimate operational use: too-short retention destroys the data needed to debug failures that surface days later, while a 30 to 90 day window keeps analytics useful.

**Reserve zero retention mode for environments that require it.** Zero retention stores no transcript, audio, initiation data or phone metadata, and the post-call webhook becomes the only way to get conversation content out. It also constrains the configuration: audio storage off, retention unlimited (nothing is stored to expire), no user memories, no simulation library or scheduled analysis, primary, backup and per-node LLMs must be eligible models, reasoning summaries unavailable, and custom LLMs need an explicit workspace allowance. A workspace-level zero retention setting forces it on every agent. Do not enable zero retention "to be safe" when the environment does not require it; you lose the operational visibility needed to improve the agent. Also note that a transfer between a zero-retention agent and a normal one does not re-enable recording for the transferred leg; test the retention behavior of any multi-agent flow that mixes the two before promising it.

**Conversation history redaction is an enterprise feature enabled on request.** When enabled, named entity types (names, dates of birth, card numbers, addresses, medical terms and others from a catalogue) are replaced with placeholders in the transcript, the audio and the analysis before storage, and specific data collection items can be excluded from redaction when the extracted value is itself the point. Over-redaction makes transcripts useless for debugging; under-redaction creates compliance risk. Pick the minimum entity set that meets policy, and confirm with your account team which surfaces are covered before positioning redaction as an alternative to zero retention.

**Turn on signed-URL or token authentication and origin allowlists for any agent embedded in a logged-in product.** Otherwise third parties can invoke the agent under your account. Configure the origin allowlist for web widgets so the agent only loads on domains you control, and require authentication whenever the agent exposes account data.

**Choose the data residency region at workspace creation.** Workspaces exist in the United States, European Union, India and Singapore deployments, and conversation data stays in the region. Model availability differs by region; the picker only shows what the region supports.

#### Guardrails and content safety {#guardrails-and-content-safety}

**Enable the focus and manipulation guardrails for any agent exposed to public traffic.** Focus injects alignment rules into the system prompt that keep the agent on its configured task and resistant to role-play hijacks. Manipulation runs a prompt-injection classifier over user messages. Both have negligible cost; if the classifier errors it fails open so the conversation continues.

**Tune content-category sensitivity to the audience.** Content guardrails evaluate the agent's output across categories (sexual content, violence, harassment, self-harm, profanity, religion and politics, medical and legal information) at a Low, Medium or High threshold per category, where lower means stricter. Conservative settings suit general consumer products; raise thresholds for adult-tolerant contexts; lower them for products serving minors or vulnerable populations.

**Choose streaming versus blocking execution by what failure mode is acceptable.** Streaming guardrails evaluate output as it generates and stop mid-sentence on a violation: faster, but produces awkward cutoffs. Blocking guardrails hold each response until the judge returns and can retry: slower, but produces clean output. Use streaming for casual consumer flows where occasional cutoffs are tolerable; use blocking when a retry produces a meaningfully better experience. On a trigger the agent either speaks a feedback message (editable, defaulting to one that includes the trigger reason) and retries up to three times, or ends the conversation. Evaluation runs with a timeout and fails open, so guardrails are a safety net, not a guarantee.

**Use custom guardrails for policies the standard categories do not cover.** "Do not discuss competitor products," "do not give legal advice," "do not quote prices outside the published list." A custom guardrail is a rule evaluated by a small LLM judge against the candidate reply plus a configurable window of recent user messages. Phrase the rule as a literal, observable pattern a judge can apply to a single response, not as a paragraph of philosophy. The judge does not see retrieved knowledge base chunks or tool payloads, so groundedness checks ("block any fact not in the knowledge base") cannot be built this way; keep those as evaluation criteria and prompt discipline. Procedures can carry their own custom guardrails that apply only while the procedure is active (§2.5.3); workflow nodes cannot.

#### Knowledge base configuration {#knowledge-base-configuration}

**Three levers decide how knowledge reaches the model.** Each document has a usage mode: "prompt" means it is inserted into the system prompt on every turn; "auto" means it is retrieved through RAG when RAG is enabled and the document is indexed, and inserted otherwise. The agent has a RAG on/off switch with its retrieval settings. And the agent has a retrieval mode: disabled, every turn, or optional; agents created since mid-October 2026 start in the optional mode. Folders attached to an agent are always retrieval-scoped, never inserted whole.

* **Prompt insertion** is for small, always-relevant content (a few hundred to a few thousand tokens): company description, return-policy summary, hours of operation. Inserted content is paid per turn, so verify it is genuinely useful that often. A document can only be inserted if it is under roughly 300,000 characters, and the total inserted knowledge must fit the model's context window; the editor refuses to save an agent whose knowledge base is too large.  
* **Every-turn retrieval** is for large or partitioned content where only a fraction is relevant per turn: product catalogs, policy libraries, ticket histories. On each turn the platform rewrites the latest user request into a standalone query, retrieves the best chunks (up to 20\) from the documents in scope for the current node, and inserts them as "knowledge relevant to the last user message". Tune the maximum vector distance lower for stricter matching (fewer loosely related chunks at the cost of occasional misses); raise it when content is highly varied. Cap the maximum retrieved length to prevent bloat; the same cap truncates full-document fetches by the search tool. Pick the multilingual embedding model when the content or the callers are not English. A retrieval failure degrades to "no retrieved knowledge" for that turn rather than failing the turn.  
* **Optional retrieval** means the knowledge base search tool. The model decides when to look something up, which reduces latency on simple turns at the cost of occasionally missing relevant content, and retrieval becomes a model-initiated, observable step the transcript shows. The tool has four strategies you can enable individually: semantic search for broad or conceptual questions, keyword search for exact terms, error codes and product names, fetching a whole document by name, and listing what the knowledge base or a folder contains. Disabling a strategy hides it from the model entirely. Turn it on under Retrieval mode in the agent's knowledge base settings. See §2.8 for when to prefer it over per-turn retrieval.

**Partition multi-domain content into multiple smaller KBs scoped to the relevant Subagents.** A single undifferentiated KB forces the retriever to search across unrelated content. Partitioning tightens retrieval and lets each Subagent reason within a clear domain. Subagent and say nodes can attach additional documents and can switch off "Inherit knowledge base" to replace the agent-level set entirely.

**Know the ingestion options.** Documents come in four shapes: uploaded files (PDF, DOCX, TXT, HTML, Markdown, EPUB, up to 20 MB each), URLs (a single page or a crawl of a site, with scheduled re-fetching and optional removal when a page disappears), pasted text (editable in place), and folders. Google Drive files and folders can be connected and kept in sync on a schedule or on demand through an integration connection. Index storage for retrieval is limited by plan, so large catalogs on self-serve tiers need a plan check before the build starts.

**Leave source attribution off unless your client renders sources.** Source attribution asks the LLM to list the chunks it relied on in a hidden block that the platform strips before the user sees it. When the model formats that block even slightly differently, document and chunk identifiers leak into the spoken or written reply. If a customer reports identifiers or a "Sources:" heading in agent output, check this setting before blaming the prompt.

#### Dynamic variables and tool assignments {#dynamic-variables-and-tool-assignments}

**Use dynamic variables whenever a value is referenced more than once or drives a decision.** The recurring mistake is asking the LLM to remember values across turns; it will sometimes forget, sometimes hallucinate, and the failures are intermittent and hard to debug. Explicit state is reliable; implicit memory is not.

The main sources of dynamic variables:

* **Conversation-initiation variables passed from the host application or the initiation webhook.** Customer name, account tier, last order ID, language preference, customer segment. Set these at the start so the agent never asks for what the system already knows. Variables can also be marked as secrets, so they can be used in tool headers without ever reaching the LLM.  
* **System variables on telephony.** Caller ID and called number are populated on phone calls. Use them for personalization (when you can map the number to a customer record) and for low-friction caller-ID-based authentication paired with a second factor.  
* **Workflow state.** Counters for retry budgets, flags for completed steps, accumulated success counts for multi-question authentication. The expression edges that gate the rest of the workflow depend on these.

**Use tool assignments to capture values you will use later.** Whenever a tool's response contains something the workflow or a later turn will reference (a status that drives an edge, an ID needed in a future tool call, a value the agent will speak later), assign it to a dynamic variable. Memory across turns is unreliable; explicit state is not.

* **For values that drive deterministic routing**, assign and route on an expression edge. Do not let the LLM evaluate "the verification succeeded"; let the expression evaluate `verification_passed == true`. Mind the types (§2.4.2): a JSON boolean assigns a real boolean, a `"true"` string does not, and a placeholder default of `""` is a string.  
* **For values that should be captured but hidden from the LLM**, use the sanitize option. The variable is set; the field is removed from the response before the LLM sees it. Useful for PII or internal flags that should drive workflow logic but not influence what the agent says.  
* **For lists or structured objects the workflow operates on**, preserve the native type so the value does not get serialized to a string the LLM has to parse.

#### Call limits and concurrency {#call-limits-and-concurrency}

**Set per-agent concurrency to the throughput of the slowest dependency.** CRM, payment system, transfer destination, whichever caps first. Per-agent bursting (on by default) lets the agent use the workspace's burst headroom; disable it when downstream systems cannot handle spikes even briefly. See §2.14 for how the limits compose.

**Decide what callers hear at capacity.** New agents are created with a wait queue enabled: a caller who arrives when the agent is at its cap hears a hold tone (the default or a short custom clip) for up to a configurable maximum wait, and connects when a slot frees. Where queueing is not active, the call is declined. Set the maximum wait to what your callers will tolerate, and keep the queue off for outbound-only agents.

**Set a daily limit consistent with expected traffic plus headroom.** The per-agent daily limit defaults to 100,000 conversations and exists to prevent runaway cost incidents. Text-only conversations count against a much larger pool. Lower it deliberately for agents whose traffic is predictable, so a misbehaving integration cannot run up a bill overnight.

### 2.12 Evaluation criteria and data collection {#2.12-evaluation-criteria-and-data-collection}

After every conversation ends, the platform runs two post-call analyses against the transcript: **evaluation criteria** (LLM judges that return success, failure or unknown, or a numeric score, plus a rationale) and **data collection items** (typed values extracted from the conversation). Both are configured per agent and versioned with it (so a branch can carry different criteria from main), both run on the agent's analysis model (a fast Gemini model by default, changeable per agent and overridable per item), and both surface in the post-call webhook payload as keyed dictionaries that downstream systems route on. Alongside them the platform computes a conversation summary and title, an overall sentiment label and score, a frustration score with the worst turn, and, when enabled, assigns the conversation to a discovered topic. Together these are how a voice agent program turns thousands of conversations into auditable metrics, structured analytics and triggers for follow-up automation.

Criteria and data collection items are configuration artifacts the judge sees as prompts. Writing them well is a prompt-engineering problem, not a configuration one. This section covers what the judge actually receives, the agent-versus-conversation scope distinction, and concrete good-versus-bad examples for the items partners write most often.

#### 2.12.1 What downstream systems do with the results {#2.12.1-what-downstream-systems-do-with-the-results}

Both analyses appear in the post-call webhook payload and on the conversation's Analysis tab. Common downstream uses:

* **Routing tickets and callbacks.** A failed issue\_resolved criterion can open a CSAT outreach ticket. A requested\_callback item can enqueue an outbound call; outbound campaigns read exactly these fields to schedule callbacks and redirects (§2.15).  
* **Populating CRM and BI fields.** Data collection items map cleanly to columns: call\_outcome, primary\_topic, items\_ordered, lead\_qualified become the metrics product and ops teams already track.  
* **Regression detection.** Pass rate of a criterion over time, plotted per branch and per environment on the Dashboards evaluation tab, surfaces silent regressions that aggregate metrics miss.  
* **Review queues.** Conversations where a critical criterion fails are the right inputs for the next iteration: read them first, write tests against them, and tighten the prompt or workflow accordingly. The conversation list filters on per-criterion results and per-item values.

The implication for design: every metric a stakeholder asks about ("how many calls ended in escalation last week?", "what fraction of users completed the booking?") should be a data collection item or evaluation criterion, not a manual transcript review. Do not build your own sentiment item unless you need a different scale; sentiment and frustration are computed for every conversation already.

**Webhook delivery and retry behavior.** The post-call webhook fires when conversation analysis completes. With retries enabled on the webhook, the platform retries 5xx responses, 408 timeouts, 429 rate limits and connection errors on a fixed schedule: immediately, then after 30 seconds, 2 minutes, 8 minutes and 30 minutes, five attempts spanning roughly 40 minutes; other 4xx responses are terminal. After ten consecutive failures with no successful delivery in seven days the webhook is disabled and workspace admins are emailed. The request timeout is 20 seconds for transcript payloads and 5 minutes for audio. Every delivery carries an HMAC signature header (a timestamp and a hex SHA-256 over the timestamp and body) and a delivery ID for idempotency; verify the signature on receipt. The webhook endpoint is a workspace resource; each agent chooses which endpoint and which events it sends: the transcript (as JSON or as an OpenTelemetry trace), the audio, call initiation failures (with reasons such as busy, no answer, concurrency or daily limit reached, queue timeout), answering-machine detection, and unredacted variants of the transcript and audio for customers who redact on their side. A transcript webhook can exclude the turn-by-turn transcript and deliver only analysis, metadata and dynamic variables, which is the lean payload for CRM routing. The full payload schema lives in the platform documentation and evolves on its own cycle; treat that as canonical. The dynamic variables in scope at the end of the conversation are in the payload, so consume them there instead of writing a data collection item that reconstructs them from speech.

#### 2.12.2 Scope: agent vs conversation {#2.12.2-scope:-agent-vs-conversation}

Both criteria and data collection items have a scope: conversation (the default) or agent.

* **Conversation scope** evaluates the item once against the full transcript, including any agent-to-agent transfers. Use it for outcomes that span the whole call: call\_resolved, total\_items\_ordered, escalation\_occurred.  
* **Agent scope** evaluates the item against only the transcript segment where the defining agent was active. Use it when an agent appears as part of a multi-agent flow (transfer to agent, standalone agent handoff) and you want metrics for that agent without contamination from segments owned by other agents. Agent-scoped items are judged one at a time on their own transcript slice, so they cost more analysis calls than conversation-scoped items, which are batched.

Concrete example: a router agent transfers complex queries to a specialist. On the router, transfer\_succeeded makes sense at conversation scope (it covers what happened after the transfer). On the specialist, specialist\_resolved\_issue makes sense at agent scope (the judge should not see the router's pre-transfer turns when judging whether the specialist did its job). The per-agent results appear as a scoped block in the payload and grouped by agent on the Analysis tab.

If an agent is never part of a transfer chain, the distinction does not matter; leave everything at conversation scope.

#### 2.12.3 Writing evaluation criteria {#2.12.3-writing-evaluation-criteria}

The runtime wraps the partner's criterion text inside a fixed system prompt that asks the judge to return success, failure or unknown plus a short rationale grounded in the transcript. The partner's text is presented verbatim as the goal to evaluate. Two things follow:

1. The criterion has to read as **a goal that can be judged from the transcript alone**. The transcript the judge sees includes tool calls and tool results, so "the refund tool returned success" is judgeable; audio, ASR confidence and dynamic-variable state are not.  
2. The criterion has to define **all three outcomes**: what counts as success, what counts as failure, and when the judge should return unknown. Criteria that define only success leave the judge to invent its own failure threshold, which drifts.

**Numeric criteria.** A criterion can instead return a score from 0 to a maximum you set (100 by default) against a rubric you write. Numeric scores roll up into an aggregate success score per conversation and show as a percentage; in success-or-failure views a score of at least half the maximum counts as success. Use numeric scoring for graded qualities (completeness of a summary, adherence to a multi-step script) and binary scoring for anything that is genuinely pass or fail.

**Judging against the knowledge base.** A criterion can be configured (through the API) so the judge also sees the knowledge base chunks the agent retrieved during the conversation, which makes "did the agent answer consistently with the documentation it had" judgeable per call. Use it for factual-accuracy criteria on knowledge-heavy agents.

**Anatomy of a good criterion:**

* Names the success condition with concrete observable evidence.  
* Names the failure condition equally concretely.  
* States when unknown is the right answer (typically: insufficient transcript, the topic never came up, the call was cut off before the criterion could be evaluated).  
* Avoids combining unrelated dimensions (tone plus factuality plus resolution should be three criteria).

**Examples:**

*Issue resolution.*

* Bad: Did the agent provide good service?  
* Good: Success if the user's stated issue was resolved during the call without a human handoff (the agent answered their question with a verifiable fact, completed the requested action, or guided them to the documented self-service path). Failure if the user's issue was not resolved (incorrect information, refusal without alternative, unresolved complaint, repeated questions on the same issue). Unknown if the user disconnected before stating an issue, or the call was cut off before the agent could attempt resolution.

*Refund handled correctly.*

* Bad: User got a refund.  
* Good: Success if the user requested a refund AND the agent processed it via the refund tool with confirmation read back to the user. Failure if the user requested a refund AND (the tool was not called, the tool failed and the agent did not offer an alternative, or the agent talked around the request without acting). Unknown if the user did not raise a refund request.

*Compliance, single dimension.*

* Bad: Agent followed compliance rules.  
* Good (split into three): Disclosed AI identity within the first two agent turns. / Did not read full card numbers, full account numbers, or full national IDs aloud. / Confirmed verification status before discussing account-specific information.

*Tone, observable behavior.*

* Bad: Agent was empathetic.  
* Good: Success if the agent acknowledged the user's stated frustration, complaint, or difficulty at least once when the user expressed it (verbal acknowledgement, validation, or apology where appropriate). Failure if the user expressed frustration or difficulty AND the agent ignored it or moved straight to procedural questions. Unknown if the user did not express frustration or difficulty during the call.

#### 2.12.4 Writing data collection items {#2.12.4-writing-data-collection-items}

Data collection items return a typed value: boolean, string (optionally constrained to a list of allowed values, which can itself come from a dynamic variable), integer or number. There is no object or array type. The item's description is the prompt: it tells the judge what to extract. The runtime wraps it in a fixed system prompt that asks for a value and a rationale and says to return null if extraction is impossible, the type cannot be coerced, multiple answers are equally valid, or the answer cannot be determined from the transcript. Plans allow a few dozen items per agent (more on enterprise), so spend them on fields a system will consume.

**Anatomy of a good description:**

* Names exactly what to extract.  
* For enums, defines what each allowed value means (one short clause per value).  
* Specifies what counts and what does not count.  
* States when null is the right answer.

**Examples:**

*Enum string, call outcome.*

* Bad: What happened on the call.  
* Good: Select 'resolved' if the user's issue was completed during the call without handoff. Select 'escalated' if a human transfer occurred or the agent committed to a callback from a human. Select 'abandoned' if the user disconnected before any resolution attempt. Select 'callback\_requested' if the user asked to be called back at a later time. Return null if the call ended too early to determine outcome.

*Boolean, verification.*

* Bad: Was the user verified.  
* Good: True if identity verification completed successfully on this call (the user passed all required security questions, OR the OTP verification tool returned success, OR identity was passed in at conversation start as a verified host-application variable). False if verification was attempted and failed. Null if verification was not attempted on this call.

*Integer, count.*

* Bad: Number of items.  
* Good: The total number of distinct line items the user added to their order during the call. Count distinct items, not quantities: '3 pizzas and 2 sodas' is 2 items. Return 0 if the user did not order anything. Return null if the call was not about placing an order.

*String, primary topic.*

* Bad: What was discussed.  
* Good: A 2 to 4 word noun phrase describing the user's primary reason for calling, taken from how the user themselves described it (e.g. 'order status', 'refund request', 'password reset'). If the user raised multiple topics, return the one they spent the most time on. Return null if the user did not state a clear reason for calling.

*Callback time for a campaign.*

* Bad: When to call back.  
* Good: If the user asked to be called back, the date and time they requested in ISO 8601 with timezone, resolving relative phrases ("tomorrow afternoon") against the conversation's start time. Null if no callback was requested.

#### 2.12.5 Common pitfalls and how to fix them {#2.12.5-common-pitfalls-and-how-to-fix-them}

* **Asking the judge to summarize instead of extract.** "Summarize what the user wanted" returns prose the analytics layer cannot operate on. Replace with a typed schema and define the value-to-meaning map explicitly. The platform already produces a free-text summary.  
* **Combining multiple things into one criterion.** When the result is failure, you cannot tell which dimension failed. Split.  
* **Defining success without defining failure.** Specify all three branches.  
* **Restating the field name as the description.** The description has to add the taxonomy.  
* **Forgetting null and unknown handling.** Real transcripts are sometimes incomplete; without explicit instruction the judge guesses.  
* **Asking the judge to recover system state from speech.** If a value lives in a tool response or a dynamic variable, consume it from the webhook payload instead.  
* **Using agent scope when no transfer is involved.** It produces the same result as conversation scope with extra cost.  
* **Re-implementing sentiment.** Use the built-in sentiment and frustration scores, which also drive the Users page and topic analytics, unless you need a different scale.  
* **Treating evaluation results as ground truth without spot-checks.** Read the rationale on disagreements; if the rationale is sound but the result is wrong, refine the criterion text. If the rationale itself is wrong, the criterion is too vague to evaluate.

#### 2.12.6 Operational practice {#2.12.6-operational-practice}

* **Instrument what your prompt is trying to enforce.** If the prompt says "do not disclose account information before verification", a criterion should detect violations. Critical rules without instrumentation erode silently.  
* **Version criteria deliberately.** Criteria define the go-live threshold and are versioned with the agent. Tightening or loosening one mid-rollout invalidates before-and-after comparisons; treat changes as new versions, document why, and use "Rerun evaluation" on the Analysis tab (or the public rerun endpoints, for a whole conversation or a single criterion) to re-score prior conversations so historical pass rates remain comparable. Re-running does not re-send the post-call webhook.  
* **Use the rationale to debug.** When a criterion fires unexpectedly or misses a violation, the rationale points to the transcript phrase the judge relied on.  
* **Set a summary language for multilingual agents** reviewed by one team, so summaries and rationales come out in one language regardless of the conversation's.  
* **Keep the set bounded.** Every additional item adds analysis cost (visible per conversation on the Analysis tab) and latency. Aim for the smallest set that covers the metrics the business actually uses.  
* **Turn on topic discovery.** It clusters completed conversations into recurring topics with success rate and sentiment per topic, which is the fastest way to find where the agent is weak and which procedures or knowledge are missing.

### 2.13 Tests {#2.13-tests}

Tests are how a voice agent program turns inherent variability into something a team can defend a release against. They are pre-defined scenarios that the platform runs against an agent, automatically, and grades against partner-defined success criteria: the regression suite for a system whose behavior changes with every prompt edit, model swap, knowledge-base refresh or workflow restructure. Where evaluation criteria measure live production conversations after the fact, tests measure intended behavior before a change is shipped, against inputs the partner controls.

Three things make tests on this platform behave differently from tests in a deterministic codebase, and recognizing them up front prevents most of the confusion partners hit:

* **The grader is an LLM, not a string match.** Tests return success, failure or **unknown**: three outcomes, not two. The unknown verdict is real: it means the transcript did not contain enough evidence to judge, usually because the conversation ended early through no fault of the agent.  
* **Simulation tests run a real agent against a fake user.** The platform spins up your actual agent (same prompt, same workflow, same tools, same guardrails) and pairs it with a separate LLM that plays the customer. Both are stochastic; the same test can produce slightly different transcripts run to run. Treat passing as a signal, not a proof.  
* **Tests live in the same world as production.** Simulations consume the same LLM and analysis quotas as live calls, hit the same guardrails, follow the same workflow logic and, unless tools are mocked, call the same backend APIs. The only deliberate differences: the agent runs text-only even if it is a voice agent, and its reasoning summary is forced on so the judge and the reviewer can see why it did what it did.

This section covers what each test type measures, how to write the prompts that drive them, what happens at runtime that is not visible from the UI, and the recurring mistakes that produce noisy or misleading suites.

#### 2.13.1 The three test types and what each one is for {#2.13.1-the-three-test-types-and-what-each-one-is-for}

The choice of test type follows the question being asked. Picking the wrong type is the most common reason a suite "passes everything but doesn't catch the real bug".

**Next reply test.** Asserts what the agent says in response to a single user message, given a prefix of conversation. The author provides the chat history ending with a user turn (or a tool result), plus success criteria phrased as statements about what the agent's reply should contain or accomplish, optionally with up to five example successful and five example failed replies that calibrate the judge. The judge reads the agent's one response and returns success, failure or unknown.

Use next reply tests for:

* Refusal behaviors: "If the user asks for legal advice, the agent declines and offers to transfer."  
* Tone and phrasing rules at a specific moment: "When the user expresses frustration, the agent acknowledges it before continuing."  
* Single-turn factual answers: "When asked about return windows, the agent states 30 days."  
* Regressions captured from production: paste the bad turn's prefix, write the criterion, lock in the expected behavior.

Do not use them for anything that takes more than one agent turn to manifest, anything that requires a tool to fire (that is what tool invocation tests are for), or anything where the relevant behavior is the workflow path the agent took (simulation tests).

**Tool invocation test.** Asserts that, given a prefix of conversation, the agent either invokes the right tool with the right parameters, or transitions to the right workflow node. A test checks one or the other, never both: write one test for "the verification tool fires with these parameters" and a second for "after this turn the agent is in the privileged node". Parameter checks address individual fields by path, so nested values can be matched one by one, and each check uses one of four strategies: **exact**, **regex**, **LLM-judged** (a small model decides whether the value matches the intent of the rule) or **present with any value**. Tests can also assert that a tool was **not** called, or pass if any one of several tool calls in the turn matches.

Use tool invocation tests for:

* "The agent calls the lookup tool when the user provides an order ID."  
* "The agent calls the verification tool with the digits the user spoke, not a hallucinated number."  
* "When the user asks for a refund, the agent calls the eligibility check before the refund tool."  
* "The agent does NOT call the destructive action tool when the user has not confirmed."  
* Verifying language detection fired with the correct language code on a representative greeting.

Do not use them for judgment about what the agent said (next reply tests) or behavior that only emerges across several turns (simulation tests).

**Simulation test.** Runs a complete multi-turn conversation between the agent and a simulated user. The author writes a **simulation scenario** (who the customer is, what they want, what context they bring) and a list of **success criteria** (up to 30; each is judged separately and the run passes only if every one passes). The platform runs the agent and the simulated user end to end, then a judge reads the whole transcript.

Use simulation tests for:

* End-to-end flows where success is "the user got their issue resolved across the whole call".  
* Workflow path validation: does the agent get from greeting to verified to action to closure correctly?  
* Multi-turn behaviors: context drift, mid-conversation pivots, the agent forgetting earlier context.  
* Stress-testing how the agent handles pushback, follow-ups and ambiguity.  
* Validating language fidelity across several turns.

The judge does see tool calls and tool results in the transcript it is given, so a criterion can mention "the refund tool returned success"; but an LLM reading a transcript is a less reliable instrument for "did exactly this tool fire with exactly these parameters" than a tool invocation test. Use the deterministic test for the deterministic question.

**Most production-grade suites use all three.** Tool invocation tests pin down deterministic decisions. Next reply tests pin down phrase-level requirements. Simulation tests catch what only emerges over several turns. Building only one type leaves a hole the other two would have covered.

#### 2.13.2 What happens when a simulation runs {#2.13.2-what-happens-when-a-simulation-runs}

When a simulation runs, three LLMs are in the loop:

1. **The agent.** Your real configured agent: same prompt, same workflow, same tools (real or mocked, per the test), same guardrails. Audio is the only layer swapped out: all turns are text.  
2. **The simulated user.** A separate LLM, with its own prompt, playing the customer. It defaults to a high-capability Claude model and can be overridden per test. It cannot see the agent's prompt, tools or tool results, only the transcript so far, and its only tool is the ability to hang up. It is created speaking the agent's configured language (or the test's language override).  
3. **The judge.** Once the conversation ends, a third LLM (same default, also overridable) reads the full transcript plus a note describing why the conversation ended and returns a verdict and rationale per criterion.

A simulation run, step by step:

1. The agent starts as it would on a real call (first message, or empty if configured to listen first), from the injected chat history if any, at the workflow node the test names if any.  
2. The simulated user replies based on the scenario and the agent's most recent turn.  
3. Tools the agent calls execute according to the test's mock configuration: real backends if not mocked, predefined responses (or predefined errors) if mocked, an error if mocked-and-no-rule-matched.  
4. The loop continues until the simulated user hangs up, the turn budget is exhausted (default 5 turns, configurable from 1 to 50), the agent ends the call or transfers to a number, a guardrail ends the call, the run exceeds its time budget, or an unrecoverable error occurs.  
5. The judge evaluates each criterion. If the conversation ended for an out-of-the-ordinary reason, the end reason is given to the judge as context so it can reason about premature endings rather than blindly mark them as failures.

Things that matter for test authors:

* **The simulated user behaves like a mildly skeptical real caller.** It pushes back if answers feel evasive, asks follow-ups when something is unclear, and confirms outcomes in its own words before agreeing it is done. It will not hang up on the first two replies even if the agent solves the issue immediately. Tests that succeed only if the user accepts answers instantly will be flaky.  
* **The simulated user has no idea what the agent's tools are.** It can only describe its problem and react to what the agent says.  
* **The judge does not see audio, ASR confidence or dynamic-variable state.** Anything a criterion depends on must be observable in the transcript (which includes tool calls and results).  
* **Audio quality, voice selection, ASR performance and TTS rendering are not exercised.** Voice quality needs real conversations.  
* **The time budget scales with the test.** Each turn has a per-turn timeout (about a minute for a phone-style simulation; much longer for simulations that declare a text channel such as WhatsApp or a support thread), the whole run is capped at 15 minutes, and a workflow with many hops or slow tools can hit either.  
* **A phone transfer ends the simulation with a "transferred" outcome** that the judge sees; the transfer itself is not placed. A call to a client tool ends the simulation with an error, because there is no client; mock those tools in any test that might reach them.

#### 2.13.3 Writing simulation scenarios {#2.13.3-writing-simulation-scenarios}

The simulation scenario is the single most important field a test author writes. It is the only input that shapes how the simulated user behaves. A vague scenario produces vague tests; a sharp scenario produces tests that exercise the agent the way real users will.

A scenario is best written as a brief for an actor, not as a script. State who the customer is, what they want, what they have already tried, what context they bring, and what would frustrate or satisfy them. Do not write the customer's lines; the simulated user improvises them from the brief.

**Bad, too vague:**

User wants a refund.

This produces an unpredictable test. The simulated user has no constraints, no specifics, no motivation. Different runs go down very different paths because the brief leaves everything to chance.

**Bad, over-scripted:**

User says "I want a refund for order 12345." Agent confirms. User says "Yes, \$50 please." Agent processes. User says "Thanks."

The simulated user is told to improvise as a real caller, not to recite lines. Over-scripted scenarios produce stilted, off-distribution conversations and the test loses the value of probing real agent behavior.

**Good, concrete persona, motivation and constraints:**

You are calling about a duplicate charge of \$50 on your credit card from yesterday. You only ordered one \$50 item, order number 12345, but were charged twice. You have already tried disputing it through the app, but the dispute was rejected with no explanation, which is why you are calling. You are mildly frustrated and want a refund of the duplicate charge. You will not accept "we'll look into it" as a final answer; you want a concrete resolution before you hang up.

Notice what this gives the simulated user: a specific complaint, a specific number, a specific prior attempt, an emotional state, and a clear acceptance criterion. It still leaves how the user phrases things to the simulated user's improvisation.

**Recurring patterns for sharp scenarios:**

* **Pin down the specifics that matter.** Order numbers, dates, amounts, names, account types. If you leave them blank, the simulated user invents them inconsistently.  
* **State what the customer will and will not accept.** "I want a concrete refund amount before I hang up." "I will accept being transferred to a human." "I am willing to verify my identity but will refuse to give my full card number."  
* **Set the emotional baseline.** "Mildly frustrated," "in a hurry," "confused about the policy," "skeptical of automation." Without it you get a default mildly skeptical adult.  
* **Mention what the customer has already tried.** Real users almost always have, and it changes the conversation the way production traffic does.  
* **State the customer's goal as an outcome, not as an action.** "Wants the refund credited back" beats "asks for a refund tool to be called."  
* **Declare the channel when it matters.** A test can simulate a phone caller, a widget visitor, a WhatsApp user or a support-thread customer; the simulated user's persona, the agent's verbosity and the per-turn time budget follow the channel.

**For adversarial or edge-case scenarios:** spell out the difficulty. "You are testing whether the agent will give legal advice. Keep pressing for a specific recommendation about your situation, even if the agent declines initially."

**For language-specific scenarios:** state the language explicitly and instruct the simulated user to speak only in that language (§2.13.8). The simulated user starts in the agent's configured language, but nothing forces it to stay there if the scenario reads as English.

#### 2.13.4 Writing success criteria {#2.13.4-writing-success-criteria}

Each success criterion is read by the judge after the conversation ends, alongside the transcript, with a fixed instruction to return success, failure or unknown plus a short rationale. The judge is told to focus on actionable outcomes, not to penalize neutral or professional tone unless the criterion mentions tone, and to consider end-of-call context when a criterion could not be assessed for structural reasons (the call ended early, a transfer happened, the user disconnected).

Two things follow:

1. **Each criterion must be evaluable from the transcript alone.** The judge cannot see dynamic-variable state or backend responses beyond what appears as a tool result in the transcript.  
2. **Phrase success as concrete observable outcomes, not adjectives.** "The agent was helpful" is not evaluable. "The agent identified the duplicate charge, confirmed the order number, and stated the refund amount and timeline" is.

**Anatomy of a good criterion:**

* Names the concrete outcome that constitutes success.  
* Where order matters, numbers the steps; where it does not, lists them.  
* Mentions specific elements the agent must address (amounts, identifiers, policies) where applicable.  
* Covers one dimension. Because a simulation takes a list of criteria, split resolution, tone and compliance into separate criteria on the same test rather than one combined sentence; the rationale then tells you which dimension failed.

**Examples:**

*Refund flow.*

* Bad: Agent helped the user with their refund.  
* Good: 1\. The agent identified the duplicate charge and confirmed the order number with the user. 2\. The agent stated the refund amount (\$50) and an expected timeline. 3\. The user explicitly confirmed they understood the resolution before the call ended.

*Refusal behavior.*

* Bad: Agent did not give legal advice.  
* Good: The agent declined to provide a specific legal recommendation, briefly stated why, and offered an alternative (transfer, callback, or pointing to documentation). A neutral, professional refusal is sufficient.

*Identity verification.*

* Bad: User was verified before account information was discussed.  
* Good: Before the agent shared any account-specific information, the user provided answers to the security questions and the agent acknowledged that verification was complete. If the user failed verification, the agent did not share account-specific information and offered a handoff.

*Tone, when it matters.*

* Bad: Agent was empathetic.  
* Good: When the user expressed frustration about the duplicate charge, the agent acknowledged the frustration at least once (apology, validation or explicit recognition) before moving to procedural steps.

**When to expect "unknown" rather than "failure":** the call ended before the criterion could be assessed (transfer first, early hang-up, max turns reached during setup); the criterion is about a topic the user never raised in this run; the criterion depends on a value the run never produced. A run with no failed criteria and at least one unknown is reported as unknown, not as a pass. Unknown is a useful signal: it means the setup or the criterion did not give the system a fair shot. Read the rationale; if it says "the user disconnected before mentioning a refund", the fix is the scenario, not the agent.

**Common criterion mistakes:**

* **Combining multiple dimensions in one criterion.** Split them; the test holds a list for exactly this reason.  
* **Asking a simulation criterion to verify exact tool parameters.** An LLM reading the transcript is the wrong instrument. Use a tool invocation test.  
* **Phrasing as a question.** "Did the agent provide the refund amount?" reads less cleanly than "The agent provided a specific refund amount." Phrase as an assertion.  
* **Over-specifying wording.** State the content the agent must convey, not the exact words.  
* **Implicit acceptance of premature endings.** Write the criterion so unknown is explicitly the right verdict for incomplete runs if you care about the distinction.

#### 2.13.5 Tool invocation tests {#2.13.5-tool-invocation-tests}

Tool invocation tests are the right instrument for any behavior that reduces to "the agent should (or should not) call this tool, and these parameters should (or should not) match". They are deterministic in a way the LLM-judged tests are not, and cheap because they only require the agent to produce a single decision rather than a full conversation.

A tool invocation test specifies:

* The chat history leading up to the moment of decision (ending with a user message or a tool result).  
* Either the expected tool name (or "no tool", or "any one of these calls matches") with optional per-parameter checks, or the expected workflow node the agent should transition to.

**When to use exact, regex, LLM-judged or any-value matching:**

* **Exact** for fixed values the agent should pass through verbatim: order IDs the user spoke, language codes for language detection, enum values picked from a known list.  
* **Regex** for structured patterns where the exact value varies but the shape is fixed: phone number formats, email shapes, date strings, ID prefixes.  
* **LLM-judged** for natural-language parameters where the agent paraphrases the user's intent: search queries, summary fields, free-text descriptions.  
* **Any value** when only the presence of the parameter matters.

Pick the strictest strategy that still fits the parameter. Over-strict (exact match on a free-text field) produces false failures every time the agent rephrases; over-loose (LLM-judged on an ID field) lets typos through.

**Good and bad tool invocation tests:**

*Bad, testing what the agent says.* Chat history: user says "What's the status of order 12345?" Expected: tool get\_order\_status is called and the agent says "Your order is on its way." The second half cannot be asserted by a tool test. Split it into a tool invocation test and a next reply test.

*Good, testing one decision.* Chat history: user says "What's the status of order 12345?" Expected: tool get\_order\_status is called with parameter order\_id matching the exact value 12345\.

*Good, negative assertion.* Chat history: user says "Can you process my refund?" with no prior identity verification. Expected: the agent does NOT call process\_refund. A separate test asserts that start\_verification is called instead. Negative assertions catch the agent silently doing the wrong thing when it should have refused or routed elsewhere.

*Good, workflow transition assertion.* Chat history: user says "I'd like to verify my identity to access my account." Expected: the agent transitions to the verification node. Pair it with a separate tool test for the verification tool's parameters; one test cannot assert both.

#### 2.13.6 Tool mocking inside tests {#2.13.6-tool-mocking-inside-tests}

Mocking a tool replaces its real execution with a predefined response the agent sees as the tool's return value, interpreted exactly as a real response would be.

Two reasons to mock:

1. **The real tool would do something destructive or expensive**: a charge, a booking, an SMS, a CRM write.  
2. **You want to drive the agent down a specific branch deterministically**: "user is ineligible", "verification failed", "no records found", "the API returned a 500", without depending on a backend that may not produce those states on demand.

How mocking is configured:

* **Mock rules live on the tool** and are shared by every test that mocks it. A rule has parameter conditions (empty means it always fires), the result text the agent will see, and an "is error" flag that delivers the result through the tool's error-handling path, which is how you test failure branches. Rules are evaluated top to bottom and the first match wins, so a catch-all rule goes last. The Save as mock button on any real tool result in a conversation captures that payload as a rule (§3.3).  
* **Each test decides which tools are mocked**: none (the default; tests call real backends unless you opt in), all mockable tools, or a selected list, plus what happens when rules exist but none matches: return an error to the agent (the default) or call the real tool. A test can also carry its own per-tool overrides that take precedence over the shared rules.  
* **System tools and workflow transitions are never mocked**; end call, transfers and language detection always run their real logic. A webhook tool executed inside a dispatch Tool node is mocked like any other, because mocks attach to the tool, not to the node.

**Behaviors that are not visible from the UI:**

* **The agent sees the mock text verbatim.** No schema validation, no JSON shaping. Write responses that match the shape the real tool returns, or the agent misinterprets them.  
* **Mocked calls count as successful calls** for result edges unless the rule is flagged as an error. A workflow gate built on a result edge therefore passes in a mocked demo even when the body says the check failed (§2.4.2).  
* **The real-tool fallback is opt-in.** Leave it on the default (error) for any agent with destructive backends, and add explicit catch-all rules for the cases you want to allow through.

**Good and bad mocking patterns:**

*Bad, empty mock response.* Rule: process\_refund always returns {}. The agent has no information about whether the refund succeeded and improvises; the test is unstable.

*Good, realistic mock that matches the real shape.* Rule: process\_refund returns {"status": "success", "refund\_id": "ref\_12345", "amount": 50.00, "expected\_credit\_date": "2026-11-21"}.

*Good, branched mocks that test specific failure modes.* Rule 1: when order\_id exactly matches 99999, return {"status": "error", "code": "NOT\_FOUND", "message": "Order not found"} flagged as an error. Rule 2 (catch-all): return the success payload. One test with order 99999 exercises the not-found branch; every other test exercises the happy path.

#### 2.13.7 Replaying chat history and starting at a workflow node {#2.13.7-replaying-chat-history-and-starting-at-a-workflow-node}

Every test type can include a chat history, a sequence of prior turns placed into the agent's conversation state before the test runs (up to 200 turns, ending with a user message or a tool result). Simulation tests can additionally start the agent at a specific workflow node, and every test carries its own dynamic-variable values and can name the environment whose variable values apply.

The semantics are not obvious:

* **Chat history is injected, not replayed.** The platform does not re-execute tool calls, re-evaluate edges or re-run the LLM on those turns. The messages are placed into the agent's memory as if they had happened, so side effects (assignments, transitions, tool results) are not recreated. If a test depends on a dynamic variable set by an earlier tool call, set it in the test's dynamic variables; a required variable that is missing ends the simulation with a "missing dynamic variables" failure instead of a judgment. The one replayed side effect is a language-detection event in the history, so the agent starts in that language.  
* **Workflow node jumping is literal.** The agent begins at that node directly. No traversal of prior nodes happens, no edges are evaluated to get there, and any state the prior nodes would have set is missing unless the test configures it.  
* **Workflow refactors silently change test behavior.** If the named node is renamed or deleted, the run starts at the normal entry node with a warning in the logs rather than failing loudly. After major workflow refactors, re-validate any test that jumps to a node.  
* **Preview and tests do not run the conversation initiation webhook.** Variables that production receives from the webhook must be supplied by the test.

**Good uses:**

* **Testing deep workflow paths cheaply.** Skip greeting, identification and routing by jumping to the specialist node with a relevant history.  
* **Reproducing production bugs.** Capture the failing conversation's prefix with Create test from here, set the starting node, assert the corrected behavior.  
* **Exercising recovery paths.** Inject a history that ends with a failed tool result, then assert the agent retries or hands off correctly.

**Bad uses:**

* **Inflating coverage with shallow tests.** Fifty tests that all jump to the same node test a tiny surface. Mix node-jumping tests with full-flow simulations.  
* **Skipping setup that real users go through.** A test that jumps past identity verification will not catch verification regressions.

#### 2.13.8 Multilingual testing {#2.13.8-multilingual-testing}

Multilingual agents need both tool invocation tests and simulation tests.

**Tool invocation tests** verify language detection: given a representative greeting in language X, does the agent fire the language detection tool with the correct language code? A handful of these, one per supported language, covers detection regressions cheaply.

**Simulation tests** are the only way to verify language behavior across turns: does the agent stay in the detected language, handle a mid-conversation switch, respect the language when the user's input is short or ambiguous?

The behavior that trips up most authors: the simulated user is created in the agent's configured language, but its built-in guidance and example phrases are English, so a scenario that reads as English pulls it back to English. State the language explicitly.

**Bad, language assumed:** User wants to know the return policy.

**Good, language stated:** You are a Spanish-speaking customer from Madrid. You speak ONLY in Spanish throughout this entire call. You are calling to ask about the return policy for a sweater you bought online last week.

**Other multilingual testing principles:**

* Write success criteria in English even when the conversation is in another language; the judge handles multilingual transcripts and one criterion language keeps the suite maintainable.  
* Test the switch, not just the steady state: "you start in English, then switch to French mid-way".  
* One simulation per language is usually enough as a baseline; add more where the agent has language-specific business logic.

#### 2.13.9 Running suites: attachments, history, repeats, CI {#2.13.9-running-suites:-attachments,-history,-repeats,-ci}

**Attach tests and folders to the agent.** A test or a whole folder can be attached to an agent; attachments are part of the versioned configuration, so a branch can carry a different suite from main. Attached folders expand at run time, so a test added to the folder later is picked up automatically, and "run all attached tests" runs the set without listing IDs.

**Every run is recorded.** A run of one or more tests creates an invocation that records the agent, the branch, the exact version it ran against (and whether an unpublished draft was layered on top), who ran it, per-test outcomes, and the credits and cost consumed. Invocations are listed under the agent's past runs and the workspace test analytics, can be named, cancelled and shared with teammates, and individual failed runs can be resubmitted, optionally against a different branch or draft.

**Run against the right configuration.** Runs default to the main branch tip; you can pick a branch, include your unpublished draft, or (through the API) pass a configuration override to test an edit before saving it. The editor runs against its current state.

**Repeat flaky tests instead of arguing about them.** A suite can run each test several times (the editor offers 3, 5 and 15 repeats; the API allows up to 50). Results are grouped into labelled buckets ("passed because...", "failed because...") so an unstable test shows as a pass rate rather than a coin flip. A test is green at 100 percent, amber at 80 percent or above, red below.

**Calibrate next reply judges from results.** When a next reply test fails on a reply you consider acceptable, "Mark as success" adds that reply as a success example on the test, which is the fastest way to fix a judge that is too strict.

**Generate tests, then curate.** Two generators exist: "Create test from here" on a transcript turn pre-fills history, dynamic variables and the original reply (§3.6), and the Tests page can import tests from pasted conversations, SOPs or procedures into a new folder that is attached to the agent automatically. Both produce starting points (§2.13.11).

**Wire tests into CI through the public API.** Create and update tests and folders, start a run for a list of tests on a branch with an optional repeat count and name, then poll the invocation until no run is pending and fail the build when any run failed. The command-line tool offers the same as agents-as-code: agent, tool and test configuration as files, push and pull, branches, and a test runner. The legacy single-call "simulate conversation" endpoint is deprecated and is switched off at the end of October 2026; replace any use of it with a simulation test plus a run.

#### 2.13.10 Operational realities {#2.13.10-operational-realities}

**Tests cost real money.** Each simulation run bills the agent's turns (your configured LLM), the simulated user's turns and the judge's evaluation; next reply and tool invocation tests bill the agent's generation plus a judge pass. Audio quotas are not consumed, but text and analysis quotas are. Each invocation shows its credits and cost, and the testing dashboard charts cost over time, so budget for large suites before committing to them in CI.

**Tests are stochastic.** The same simulation can produce different transcripts across runs, and the judge can land on a different verdict for borderline cases. Use repeats on important tests before treating a single failure as a regression. If a test is consistently amber, the criterion or scenario is underspecified.

**The unknown verdict is meaningful.** Treat unknowns as a signal to inspect the run, not as failures and not as noise to ignore.

**Concurrency is bounded.** A suite runs up to ten tests at a time; large suites take longer than the per-test runtime suggests.

**Guardrails fire in tests.** A guardrail that ends the call during a simulation ends the run with that reason, which the judge sees. Inspect the end reason on confusing failures: the normal endings are max turns, the simulated user hung up, the agent ended the call, a guardrail triggered, or a transfer to a number; failures with no judgment include a client tool being called, a missing dynamic variable, a workflow expression type error, a workflow ending with a failure outcome, quota exhaustion, LLM errors or timeouts, a misconfigured agent, or the run exceeding its time budget.

**Real backends get called unless mocked.** Mock anything destructive and use sandbox credentials where you can; name a test environment whose variable values point at staging systems.

#### 2.13.11 Auto-generated tests as starting points {#2.13.11-auto-generated-tests-as-starting-points}

The platform can generate simulation tests from source material: pasted conversations, a standard operating procedure document, a procedure, or freeform documentation. It first generates a list of scenario ideas grounded in the source, then for each idea inspects the agent's workflow nodes, tools and edges and produces a finished simulation test with a scenario, criteria and turn budget, into a folder attached to the agent.

These tests are starting points, not finished artifacts. The generator cannot know which behaviors matter most to the partner, where the agent is currently weak, or what success bar the team is aiming for:

* **Review every generated criterion.** Tighten or split criteria that combine dimensions, under-specify success, or ignore reasonable alternative outcomes.  
* **Review the scenarios for adversarial coverage.** The generator writes reasonable-customer scenarios; supplement with authored adversarial ones.  
* **Run the generated suite and read the failures before adopting.** Generated tests sometimes fail for the wrong reasons (too-strict criterion, a workflow path that does not exist). Use the first run to filter the suite down to tests that catch real things.  
* **Use generation for breadth, hand-author for depth.** Production regressions, sensitive flows and compliance-gated behaviors should still be hand-written by someone who knows what to assert.

#### 2.13.12 Common pitfalls and how to fix them {#2.13.12-common-pitfalls-and-how-to-fix-them}

* **Suite passes everything but production breaks anyway.** A coverage problem. Build coverage across refusals, ambiguous inputs, mid-conversation pivots, tool failure paths and the long tail; pair tool invocation tests with simulations.  
* **Results are unknown more often than success or failure.** The simulated user hangs up before the criterion can be evaluated, or the scenario never reaches the moment the criterion judges. Tighten the scenario, raise the turn budget, or rewrite the criterion so "incomplete" is handled.  
* **Simulation passes but the agent does the wrong thing in production.** The scenario was too kind. Add explicit pushback constraints.  
* **Tool test fails because the agent rephrases the parameter.** Switch exact to regex (shape-bound) or LLM-judged (free text).  
* **Tests change behavior after a workflow refactor.** Node-jumping tests fall back to the entry node when the node was renamed or deleted. Audit them after structural changes.  
* **A tool test tries to assert both a tool call and a transition.** The platform rejects it; write two tests.  
* **Multilingual simulation drifts into English.** State the language in the scenario.  
* **Mock returns nothing useful and the agent improvises.** Write mock responses that match the real response shape.  
* **A real backend got called by a test the author thought was sandboxed.** The test opted into "call real tool" as the no-match fallback, or did not opt into mocking at all. Set the mock strategy on the test and keep the fallback on error.  
* **Test suite cost exploded.** Three LLM bills per simulation. Cut to the highest-value tests, replace simulations with cheaper tool or next reply tests where appropriate, shorten turn budgets, and use repeats only on the tests that matter.  
* **Treating a single failure as a regression.** Use repeats; read the buckets.

### 2.14 Capacity and concurrency planning {#2.14-capacity-and-concurrency-planning}

Concurrency is the single capacity dimension that customers most often over-think and most often under-specify. Over-thinking produces inflated baseline limits the customer never uses; under-specifying produces calls failing during a launch event with no warning. This section covers what concurrency means on the platform, how the limits compose, how to size for a given workload, and what happens when limits are hit, so the conversations partners have with their customers about capacity start from a shared understanding rather than from worst-case anxiety.

The headline points before the detail:

* The platform applies two concurrency limits, **workspace** and **agent**, drawn from a **single shared pool** that all voice channels (inbound, outbound, batch, web widget, WhatsApp) consume from.  
* A **burst capacity** above baseline absorbs spikes automatically. New calls are not rejected the moment baseline is reached; they are only rejected once burst is exhausted as well, and even then a per-agent **wait queue** can hold inbound callers instead of declining them.  
* For most customers, **hitting the burst ceiling is rare**. Sized correctly, baseline covers steady state and burst covers the spikes; rejection is an exceptional event the account team would typically catch long before it surfaces to end users.  
* Outbound batch calling deliberately **leaves headroom** in the shared pool for live inbound traffic, so a large campaign cannot starve a support hotline running on the same workspace.

#### 2.14.1 What counts as one concurrent conversation {#2.14.1-what-counts-as-one-concurrent-conversation}

A concurrent conversation is anything actively connected through the platform's voice infrastructure for an end user, whether that user reached the agent through the phone, a web widget, WhatsApp, or because the platform dialed out. They all draw from the same counter.

* **Inbound, outbound, batch, web widget and WhatsApp voice share one pool.** A workspace running a 200-recipient outbound campaign is using the same counter as its inbound support line. There is no per-channel quota.  
* **A call counts from the moment it starts being established, not just when audio is flowing.** A ringing call holds a slot. A caller waiting in the queue does not; queue time is not billed and does not count toward the call's duration.  
* **A call that has been transferred fully off-platform stops counting.** Once the platform leg ends, including when a conference or SIP REFER transfer hands the caller to a human and the agent drops out, the slot is released.  
* **Node transitions inside a workflow and agent-to-agent transfers do not double-count.** A conversation that traverses many nodes or several agents is still one conversation.  
* **Text-only conversations draw from a separate, much larger pool** (twenty-five times the voice limit), without burst. Chat deployments therefore rarely need a capacity conversation at all, and degrading a voice caller to text is a viable fallback when voice capacity is tight.  
* **Workspaces under consolidated billing share their parent's pool.** Size the group, not the individual workspace.

#### 2.14.2 The limits and how they compose {#2.14.2-the-limits-and-how-they-compose}

Three limits apply, checked in order at the moment a new conversation tries to start:

* **Per-agent concurrency**: an optional cap configured on the agent, used to prevent any single agent from monopolizing the workspace. Defaults to unlimited (the agent can use whatever the workspace allows, including burst). Set it when one workspace serves multiple unrelated agents and any single one going viral should not take down the others, and set it to the throughput of the agent's slowest dependency (§2.11 Call limits).  
* **Workspace concurrency**: the contractually sized cap on how many conversations the entire workspace can run at once, plus its burst headroom.  
* **Per-agent daily limit**: a count, not a concurrency, defaulting to 100,000 conversations per day (and far higher for text-only). It exists so a runaway integration or a mistaken campaign cannot run up a bill overnight; lower it for agents whose traffic is predictable.

A new conversation must satisfy all three. If the agent has its own cap and that cap is reached, the call is queued or declined even if the workspace has spare capacity.

#### 2.14.3 Burst capacity {#2.14.3-burst-capacity}

Baseline concurrency is sized for steady state. Real workloads spike (a marketing email, a national outage, a TV mention, an end-of-month batch) and forcing those spikes through baseline alone would either over-provision or reject calls during exactly the moments that matter most.

The platform handles this with a burst layer:

* **Up to three times the workspace's concurrency limit, capped at 300 concurrent conversations** (or a higher contracted cap on enterprise plans), is allowed automatically without any per-call decision or pre-authorization.  
* **Burst calls are billed at double the standard rate** and receive lower priority for speech processing under load. This is the cost of elasticity; it makes burst self-regulating, because leaning on burst as a substitute for sized baseline is more expensive than raising baseline.  
* **Beyond the burst ceiling, new conversations are queued or declined** until headroom returns.  
* **Bursting can be switched off per agent** (it is on by default). Do so when a downstream system cannot handle spikes even briefly.  
* **Burst applies to voice conversations.** Text-only conversations have their own pool and no burst.

Practical observations from real deployments: hitting the burst ceiling is rare for correctly sized workspaces; sustained burst usage is a signal to revisit baseline sizing, and that conversation with the account team typically happens well before any rejection; and a workspace that lives at twice its baseline is paying burst rates all the time and would save money by raising baseline.

#### 2.14.4 Sizing baseline concurrency {#2.14.4-sizing-baseline-concurrency}

The right baseline is derived, not guessed. The same formula works for inbound and outbound, with a small distinction in how the time window is interpreted.

`Baseline concurrency = (N × D) / T`

  `N = number of conversations in the period`  
  `D = average conversation duration`  
  `T = time window over which those conversations occur`

Worked example: a support line expecting 12,000 conversations per day, average 3 minutes each, roughly evenly distributed over a 9-hour business day:

`N = 12,000`  
`D = 3 min  = 180 s`  
`T = 9 h    = 32,400 s`  
`Baseline = (12,000 × 180) / 32,400 ≈ 67 simultaneous conversations`

That is the steady-state load, not the number to provision; real traffic is not evenly distributed. To turn a steady-state estimate into a provisioning number, account for two things:

* **Confidence percentile.** Sizing for the median minute means failing every other minute. Most production deployments size for the 95th or 99th percentile minute of the busiest hour, which is materially higher than the average.  
* **Burstiness factor.** How reliable the customer's volume estimate is and how spiky the distribution is. A retail brand with predictable weekday traffic has a low factor; a company expecting press coverage or a marketing campaign has a high one.

Applied to the steady-state baseline, these produce a defensible provisioning number. Pick the percentile and the factor deliberately, walk through the math, and document the assumptions. The concurrency-over-time chart on the Dashboards replaces the estimate with measurement once the agent is live.

**Inbound vs outbound: the time window changes meaning.** For inbound, T is given: it is the period over which calls arrive. For outbound, T is chosen: it is how quickly the customer wants the campaign to complete. A 10,000-recipient campaign run over 8 hours needs roughly eight times the concurrency of the same campaign run over 64 hours. This is the most consequential lever in outbound sizing, and the one customers most often miss when they specify "we need X concurrent" without saying how long campaigns may take.

#### 2.14.5 Outbound and batch calling {#2.14.5-outbound-and-batch-calling}

Batch calling launches and manages large outbound campaigns from the platform (§2.15 covers the full design surface). Two capacity behaviors matter here:

* **Batch dispatch leaves headroom in the shared pool for live inbound traffic.** By default a batch paces itself to a fraction of the workspace's concurrency, backs off as utilization rises and respects the agent's own concurrency cap, so a campaign does not starve the inbound line. A batch can instead be given an explicit target concurrency (bounded relative to the workspace limit); when it is set, the batch dials to that target regardless of live utilization and of the agent cap, so use it only for workspaces that run nothing else at the same time.  
* **API-initiated single outbound calls are not held back.** A call requested while the agent or workspace is at its limit fails immediately and reports the reason through the call initiation failure webhook; dialers built on the single-call API need to pace themselves or use batches.

A consequence of the shared pool: when sizing a workspace that runs both inbound and outbound, the baseline must cover the combined peak. If inbound peaks at 50 concurrent and a campaign is meant to run at 30 concurrent in the same window, the baseline needs to accommodate both; burst exists for spikes, not for predictable daily co-occurrence. If a campaign is too large for the available headroom, lengthen the campaign window or provision more baseline; pushing it through burst costs more and risks rejections.

#### 2.14.6 What happens when limits are hit {#2.14.6-what-happens-when-limits-are-hit}

Customers ask "what does my caller experience when we hit the limit?" more often than the limit actually fires for them.

* **Inbound calls and widget sessions on an agent with queueing enabled** (the default for new agents) wait in a first-in, first-out queue for that agent: the caller hears hold audio (a default tone, or an uploaded clip of up to three minutes) and connects when a slot frees, up to a configurable maximum wait (three minutes by default, up to thirty). The widget and SDKs receive queue status events so the UI can show the wait. Nothing is billed while waiting. Queueing applies to inbound phone, widget and SDK sessions; outbound, batch, text-only and some carrier integrations are not queued, and the daily limit is never queued.  
* **Where queueing is off, or the wait times out, inbound telephony callers** receive a service-unavailable response and hear the carrier's standard behavior for an unanswered call. Web and SDK clients get a clear "at maximum capacity" or "daily limit reached" error.  
* **Outbound calls** that the platform is asked to initiate while at capacity are held back rather than failing in a way the recipient sees.  
* **Across all channels** the rejection is recorded with a reason (agent cap, workspace cap, daily limit, queue timeout, queue full) on the conversation record and in the call initiation failure webhook, so utilization issues are diagnosable from conversation data rather than mystery. A spike of capacity rejections is the unambiguous signal that baseline needs to be revisited, and the alerting monitors can notify on it.

What the platform does not do: it does not degrade audio quality to fit more calls into the pool, and it does not page the customer when burst is being hit; visibility is through the dashboards and alerts.

#### 2.14.7 Common mistakes and how to avoid them {#2.14.7-common-mistakes-and-how-to-avoid-them}

* **Sizing on average load instead of peak minute.** Average load understates concurrency need by a factor of three to ten depending on traffic shape.  
* **Forgetting that batch and inbound share the same pool.** The combined peak is what matters.  
* **Treating burst as additional baseline.** Living at twice baseline means paying double rates continuously; raise baseline instead.  
* **Specifying outbound concurrency without specifying campaign duration.** The same workload over 1 hour needs fifty times the concurrency of the same workload over 50 hours.  
* **Not setting a per-agent cap on multi-agent workspaces.** Default-unlimited is fine when there is one important agent and unhelpful when there are many.  
* **Leaving the queue on for agents that should not hold callers.** A caller held for three minutes on a sales line is worse than a busy signal; tune the maximum wait, or turn queueing off and let the carrier handle it.  
* **Asking for "infinite" concurrency.** Burst exists for the rare spike beyond a sized baseline; the useful conversation is to size baseline against measured peak and let burst do its job.  
* **Treating concurrency rejection as the primary scaling concern.** It almost never is. Agent quality, downstream tool reliability and integration coverage limit deployments far more often. Right-size at deal time, confirm on the dashboards after launch, and stop worrying.

For the official burst-pricing terms and the customer-visible mechanics, see the platform documentation on burst pricing and call queueing.

### 2.15 Outbound calling: batch calling and campaigns {#2.15-outbound-calling:-batch-calling-and-campaigns}

Outbound is two products, one on top of the other, and customers conflate them. Get this straight at scoping time.

**Batch calling** is the primitive. One submission with a list of recipients creates a batch; the platform paces the dialing inside the workspace's concurrency, places each call, and records a per-recipient status. It dials each recipient once. There are no retries, no calling hours and no callbacks. It is available to every workspace once an admin has accepted the batch-calling terms in the UI, it is not available in zero retention mode, and it also works over WhatsApp. A customer who says "I have a CSV, call everyone once" wants batch calling.

**Outbound campaigns** are the managed layer. The same recipient list, but the platform keeps calling each person across retries, agent-collected callbacks, redirects to other numbers and configurable calling windows until the lead reaches a terminal outcome, and routes anything it cannot resolve safely to a human "needs attention" queue. Campaigns never place calls themselves; they create batch calls underneath and read the post-call analysis to decide what to do next. The feature is enabled on request through your account team, requires a saved workspace calling policy before the first submission, and is not available to zero retention workspaces or agents because it stores lead state. A customer who says "keep trying until you reach them, respect business hours, let them ask for a callback" wants campaigns.

#### 2.15.1 Designing the agent for outbound {#2.15.1-designing-the-agent-for-outbound}

* **Let the human speak first or disclose immediately.** An empty first message with a short initial wait, or a non-interruptible AI disclosure, depending on jurisdiction. See the First message section in §2.11.  
* **Decide how voicemail is handled.** Two mechanisms exist. The voicemail detection system tool lets the agent recognize an answering machine from what it hears and either leave a configured message (dynamic variables allowed) or hang up; the call always ends after it fires. On Twilio numbers, carrier-level answering machine detection runs on Twilio's side without delaying the conversation, can return an early verdict or wait for the greeting to end, can hang up automatically on chosen verdicts, and reports the verdict through a dedicated webhook event; Twilio bills for it. Without one of them, campaigns talk to answering machines and burn concurrency. Recipients that reach voicemail get their own status in the batch results and are included when the batch is retried.  
* **Pass per-recipient context as dynamic variables** on the recipient row (name, balance, appointment time, preferred language) and reference them in the prompt and first message. Recipient rows can also override language, first message, prompt and voice.  
* **Put the campaign decisions into data collection items.** Campaigns read the post-call data collection results to decide what happens next: a callback time the caller asked for (exact time, in ISO format with timezone), a redirect number, a do-not-call flag. If those items do not exist on the agent, the campaign has nothing to act on and every unresolved call lands in the attention queue. Follow-up calls receive the previous attempt's summary, transcript and call type as dynamic variables so the agent can say "I'm calling back as you asked" instead of starting cold.  
* **Subscribe to the call initiation failure webhook.** When an outbound call does not connect (busy, no answer, concurrency or daily limit reached, queue full) the platform sends the reason, the numbers and the batch and recipient identifiers; dialers should consume this rather than poll for status.  
* **Expose keypad tones only if the agent dials into IVRs.** Outbound DTMF is a system tool; add it deliberately.  
* **Use the batch and recipient identifiers in your webhook consumer.** Each conversation's metadata carries the batch and recipient it belongs to, which is how downstream systems join call outcomes back to the campaign list.

#### 2.15.2 Capacity behavior {#2.15.2-capacity-behavior}

* **Batch dispatch leaves headroom in the shared concurrency pool for live inbound traffic.** By default a batch paces itself to a fraction of the workspace's concurrency and backs off as utilization rises, so a campaign on the same workspace does not starve a support line. A batch can instead be given an explicit target concurrency, capped relative to the workspace limit.  
* **Per-agent concurrency caps are honored by batches.** That is the right control when one agent's campaign must be bounded regardless of what else the workspace is doing.  
* **Recipient lists are capped per submission (ten thousand), not per day.** Throughput is bounded by concurrency, not by recipient count; submit as many batches as needed.  
* **Campaign duration is the sizing lever.** The same list run over 1 hour needs many times the concurrency of the same list run over a day (§2.14.4).

#### 2.15.3 What campaigns do and do not do {#2.15.3-what-campaigns-do-and-do-not-do}

They do: retries with a configurable policy, exact-time callbacks collected by the agent, redirects to alternative numbers, failover numbers per lead, calling windows per weekday, per-agent policy overrides, an operator attention queue, and CSV export. They do not: schedule individual recipients at different times within one submission (use several submissions or let callbacks handle it), manage do-not-call lists beyond each lead's own flag, rotate caller IDs for local presence, or run over WhatsApp. Compliance (consent, do-not-call scrubbing, local calling-hour law) is the customer's responsibility; calling windows are a tool, not a compliance guarantee, which is why the terms acceptance exists.

Position it as "concurrency-aware pacing" and "a configurable retry policy". Calls start within seconds of their scheduled time; do not quote internal scheduler intervals. Both layers are API-first, so anything demonstrated in the UI is reproducible from code.

### 2.16 Channels beyond the phone {#2.16-channels-beyond-the-phone}

One agent configuration can serve several channels. Each agent has a Channels tab listing the ways it can be reached: the web widget, telephony (phone numbers from Twilio, a SIP trunk or Exotel), WhatsApp, and integration channels (a Slack workspace, a helpdesk, a messaging bot) once the workspace has connected them. What changes per channel is what the agent can see (a phone number, a WhatsApp identity, a signed-in user, nothing), how it should talk, which authentication path applies, and how capacity is counted. The design decisions below are the ones that differ by channel; everything else in this document applies to all of them.

#### 2.16.1 Voice channels {#2.16.1-voice-channels}

**Phone (Twilio, SIP trunk, Exotel).** The agent receives the caller's and the called number as system variables and, over SIP, any custom headers the carrier or contact center adds (as `{{sip_<header>}}` variables), which is how an upstream IVR passes an account number or a menu choice without a webhook. Audio formats are set by the provider. Transfers to humans use the transfer-to-number tool or node; the transfer type the provider supports differs (§2.6.6). Keypad input can be captured when enabled (§2.16.4). A phone number is bound to one agent and optionally to a branch and an environment; the conversation initiation webhook (§2.7) is the personalization mechanism. Inbound callers can be queued at capacity (§2.14.6).

**Web widget and SDKs (voice).** The browser or app streams audio over WebRTC or a WebSocket. The agent knows nothing about the user unless the host passes dynamic variables or a signed conversation token, so authentication is the host's responsibility (§2.7). Client tools are available here and nowhere else. The widget is a web component configurable without code: appearance (variant, placement, avatar, colors), behavior (mic muting, live transcript, text input, end-of-chat confirmation, feedback during or after the conversation, terms acceptance), every visible string per language, a language selector, and an origin allowlist; a hosted "talk to" page exists per agent for sharing. Client SDKs cover web (JavaScript, React), mobile (React Native, Swift, Kotlin, Flutter) and servers (Python, Node); all start from an agent ID or a short-lived token minted by your backend, and support text messages, contextual updates, feedback and per-session overrides.

**Contact-center streaming integrations.** Amazon Connect (native integration, limited availability: Connect owns telephony and queueing, the agent owns the conversation, hand-back to the Connect flow replaces phone transfer), Genesys (audio streaming into the agent, with dedicated Genesys transfer tools instead of phone transfer, and a chat bot connector), plus Avaya and AudioCodes media streaming, and documented patterns for Five9 and Microsoft Teams over SIP or the SDKs. On these, phone transfer and keypad tones behave differently or are unavailable; check the integration guide for the specific platform before promising a handoff design.

#### 2.16.2 Text channels {#2.16.2-text-channels}

Text conversations behave differently from voice in ways that matter for design:

* **They are asynchronous and resumable.** Each inbound message (a WhatsApp text, a Slack post, a ticket comment) is matched to the existing conversation by its thread, the transcript, workflow position and dynamic variables are restored, one turn runs, and the reply is posted back. Messages for one conversation are processed strictly in order. Workflows, tools, knowledge base and procedures all work; voice settings do not apply.  
* **They are cheap on capacity.** A text conversation counts for a small fraction of a voice slot (roughly one twenty-fifth) and never bursts.  
* **They have their own reply style.** Per text channel you can set verbosity (auto, concise, thorough), output format (plain text or Markdown) and a response time budget that trades speed for thoroughness; a helpdesk reply can be long and formatted while the same agent stays terse on the phone. The default personality lines can be removed for channels where they read oddly.  
* **They can carry files.** Images, PDFs and small text files sent on the widget, WhatsApp, Slack, Zendesk and email reach the agent as inputs when the model supports multimodal input, within configurable per-message and per-conversation limits, billed per file.  
* **They do not run the first message as a greeting on inbound text** (the user wrote first), so the opening instruction has to live in the prompt.  
* **They can be ended by inactivity.** A text conversation ends after a channel-specific idle period (fifteen minutes on WhatsApp), after which a new message starts a new conversation, with no memory of the previous one unless you carry it through dynamic variables or your own store.

**WhatsApp.** A Business number is connected through Meta's signup and assigned to one agent, in Cloud API mode (voice calls and messaging) or coexistence mode (the number stays on the Business app; messaging off by default). Inbound text, voice notes (transcribed), images, PDFs and stickers are understood; the agent can reply with text, with a synthesized voice note when "audio message response" is on, and with interactive reply buttons (up to three) or list menus (up to ten options) through built-in tools, inside a messaging conversation only. Business-initiated conversations must start from an approved Meta template, sent through the API or a batch; the agent then continues in free text, and a template's quick-reply buttons are recorded so a later tap is understood. Outbound WhatsApp calls need a call-permission template first. The channel vouches for the user's phone number, which is useful for lookups but still not authentication. Zero retention agents cannot receive WhatsApp messages or place WhatsApp calls, and Meta bills templates and calls directly.

**SMS (Twilio).** Importing a Twilio number routes its inbound texts to the assigned agent (on by default). An inbound text opens a text conversation; replies within an hour continue it. There is no API to start an outbound SMS conversation; to text someone from a call (a link, a code, a confirmation), use the Twilio integration's send-message tool. SIP and Exotel numbers have no SMS.

**Slack.** Connected with the platform's Slack app or your own. Two triggers: the agent replies in a thread when mentioned in a chosen channel (one context per thread), or answers direct messages. Images and PDFs on messages reach the agent. Tools let the agent post messages, react, search and read threads. Slack replies default to thorough Markdown.

**Helpdesks.** Zendesk (ticket comments, with a shadow mode that writes replies as internal notes for staff review), Intercom (new conversations and contact replies, optionally limited to one team inbox) and Freshdesk (alpha) answer customer messages as a chosen agent seat, with tools for the system's own objects. Shadow mode is the right first step for a support team that does not yet trust the agent to reply publicly.

**Telegram.** A bot token connects direct messages and mentions in groups; text only.

**Custom channel.** For a text channel the platform does not have, a webhook pair: you post the user's message to the platform's inbound URL with a secret header, receive an acknowledgement with the conversation ID, and the agent's reply is posted to your URL signed with an HMAC header. Text only, not available on zero retention. An email channel and a headless messages API exist in limited availability; ask your ElevenLabs contact.

#### 2.16.3 Multimodal and mixed-channel patterns {#2.16.3-multimodal-and-mixed-channel-patterns}

* **Voice with a text side channel.** During a phone call the agent cannot show anything, but it can send: a link, a one-time code or a summary over SMS or WhatsApp through the messaging tools, which is the right way to avoid reading long identifiers and URLs aloud (§2.3).  
* **The same agent on voice and text.** Keep the root prompt channel-neutral and let the per-channel reply settings and `{{system__is_text_only}}` (true for any text conversation, false for any voice call including WhatsApp calls) handle the differences; a node or procedure can test the variable when a step only makes sense on one channel.  
* **Rich content in the widget.** Where enabled, the agent can offer quick-reply chips with its first message and attach button sets or card carousels to a reply in text mode or when the transcript is shown on a voice call. Link hosts must be allowlisted or links are not clickable.  
* **Switching modality.** A voice conversation can be moved to text-only (which releases its voice slot) but not back; design the fallback direction accordingly.

#### 2.16.4 Keypad input on phone calls {#2.16.4-keypad-input-on-phone-calls}

Inbound DTMF lets a caller type instead of speak: an account number, a one-time code, a menu choice. It is a per-agent setting with an inter-digit timeout (half a second to ten seconds, two by default), a hash key that ends the entry immediately, and a redaction option that masks the digits in the transcript, logs and analysis (what the agent repeats or passes to tools is not masked). Digits are buffered and delivered to the model as a user message marked as keypad input once the timeout elapses or the hash is pressed; the first digit interrupts the agent if it is speaking. Supported on Twilio, SIP trunks (out-of-band tones), Genesys, Avaya and Amazon Connect, and from SDK clients; not from the widget's text mode. Keypad entry is more reliable than speech for digit sequences, so prefer it for codes and IDs on phone deployments, and tell the caller they can type. The agent sending tones to an IVR is the separate keypad tool (§2.6.6).

#### 2.16.5 Channel mistakes to avoid {#2.16.5-channel-mistakes-to-avoid}

* **Assuming the initiation webhook runs on the widget.** It fires for telephony, WhatsApp, SMS and contact-center sessions; web and app clients pass their own initiation data.  
* **Promising a WhatsApp or SMS campaign on a zero retention agent.** Messaging channels are not available there.  
* **Reading a URL or a long code aloud when the channel has a text side channel.** Send it.  
* **Letting a helpdesk agent reply publicly on day one.** Use shadow mode until the evaluation criteria say it is ready.  
* **Treating a WhatsApp or SMS number as proof of identity.** It is a strong lookup key and a weak factor; pair it with a second factor for sensitive actions.  
* **Forgetting the idle timeout on text channels.** State that must survive a long pause belongs in your system, keyed by the user, and comes back through dynamic variables.

### 2.17 Versioning, branches and release management {#2.17-versioning,-branches-and-release-management}

Every agent is versioned. There is no opt-in: each agent has a main branch, every publish is an immutable snapshot, and production traffic is routed by branch. This section explains the model and the release discipline that makes branched rollouts (§2.9) work in practice.

#### 2.17.1 Drafts, versions and branches {#2.17.1-drafts,-versions-and-branches}

* **A draft is yours, per branch.** Edits in the editor auto-save to your draft on the current branch. Nothing is live until you publish. Two people editing the same branch each have their own draft until one publishes; the other then sees the new tip and rebases their draft onto it. Architect edits land in your draft too, and Architect can open the publish dialog but cannot publish (§3.6).  
* **A version is an immutable snapshot** of the conversation config, the workflow, the versioned platform settings (evaluation criteria, data collection, attached tests, guardrails, widget settings, overrides) and the procedure content pinned at that moment. Tools, knowledge base documents and tests are referenced live, so editing a shared tool changes every version that references it; pin behavior you need frozen inside the agent config rather than in a shared resource.  
* **Some settings live on the agent, not the version**, and can only be changed on main: name and tags, authentication, call limits and queueing, privacy and retention, the analysis model, topic discovery and sentiment, alerting. A branch cannot carry its own retention policy or concurrency cap.  
* **A branch has a tip version, an optional description, protection (who may publish to it), optional auto-rebase to follow main, and shows how many commits it is ahead of or behind main.** Main cannot be deleted or archived; only branches carrying zero percent of traffic can be archived.  
* **Conversations record the branch and version they ran on.** History and dashboards filter by both, which is what makes a branch comparison a measurement rather than an impression.

#### 2.17.2 Traffic, deployments and what "live" means {#2.17.2-traffic,-deployments-and-what-"live"-means}

Live traffic is whatever the agent's traffic split points at: a map of branches to percentages that must total 100, routed deterministically per conversation. A branch with 0 percent is fully usable in tests, previews, explicit calls that name the branch, and phone numbers or channels pinned to it, but serves no production traffic. The deployment history records every change to the split with who made it and why (manual edit, merge, duplicate). "Promoting" a branch means merging it into main; the merge also moves that branch's traffic share back to main. There is no separate promote action.

Two practical consequences. First, "the configuration looks fine but the calls don't behave like it" often means you are reading a branch that nothing is calling; check the split before debugging. Second, when a conversation initiation webhook, a phone number or a WhatsApp number pins a branch, those calls bypass the percentage split entirely.

#### 2.17.3 Merge, rebase and review {#2.17.3-merge,-rebase-and-review}

* **Merge** takes a branch into any other non-archived branch (usually main). A preview shows the resulting configuration and which fields would be overridden before you commit. Where both branches changed the same field, the more recently updated value wins unless you force the source; review the preview rather than trusting the default on conflicting edits. Merging archives the source branch by default.  
* **Rebase** pulls the latest main (or another branch) into a branch while keeping the branch's own changes, with the same preview. Branches set to auto-rebase follow main continuously, which keeps long-lived experiment branches from drifting.  
* **Merge proposals add a review step**: anyone with edit access can open a proposal from a source branch to a target, name reviewers, and discuss in comments; reviewers approve or request changes, and the merge needs write access to both branches, no outstanding change requests, and at least one approval from someone other than the author. Merging a proposal auto-closes other proposals from the same source and can resolve the triage ticket it was linked to.  
* **Preview, compare, revert.** Version history lets you preview any past version in the test panel exactly as it was configured, diff it against live or the previous version, and revert to it, which writes the old configuration as a new draft for you to publish.

#### 2.17.4 Environments and environment variables {#2.17.4-environments-and-environment-variables}

Environments separate the systems an agent talks to from the agent's configuration. A workspace defines environment variables of three kinds (plain string, secret reference, authentication connection), each with one value per environment; production is mandatory and is the fallback when another environment has no value. Tools, MCP servers, custom LLM endpoints and the initiation and post-call webhooks reference them as `{{system__env_<label>}}` in URLs, headers and credentials. A conversation runs in exactly one environment, chosen at entry (a phone number's setting, the initiation webhook's response, the API call, or a test's environment field) and defaulting to production; history and dashboards filter by it. This is how one agent configuration is exercised against staging systems in tests and against production systems in live calls without maintaining two agents. Environments carry an alpha label in the product today; confirm availability for the workspace before designing a release process around them.

#### 2.17.5 Duplicating, templating and moving agents {#2.17.5-duplicating,-templating-and-moving-agents}

* **Duplicate** copies every unarchived branch at its tip with the live traffic split, under new identifiers. Version history, drafts, archived branches, past splits and hold audio are not copied.  
* **Templates** carry the conversation config, versioned platform settings and workflow. Tool and knowledge base references are cleared on export; tools are recreated on import once the importer supplies secrets and integration connections, knowledge base documents must be supplied by the importer, and attached tests, procedures and pronunciation dictionaries do not travel. A template is a starting point for a new workspace, not a migration tool.  
* **Import agent JSON** pastes a copied configuration onto an existing agent's draft, which is the quickest way to move settings between agents in one workspace; the same caveats about referenced resources apply.  
* **Agents as code.** The command-line tool keeps agent, tool and test configuration as files that can be pushed and pulled, and runs tests, so a partner can keep agent configuration in version control next to the integration code and promote it through environments from CI.

#### 2.17.6 Release discipline that works {#2.17.6-release-discipline-that-works}

1. Branch from main for every change that touches behavior, however small.  
2. Run the attached test suite against the branch (with repeats on the tests that matter) before any traffic.  
3. Give the branch a small share of traffic (5 to 10 percent), compare its evaluation pass rates, escalation rate and latency against main on the Dashboards branch filter, and only widen the share when the numbers are stable across enough conversations to mean something.  
4. Merge into main through a proposal when more than one person owns the agent, so the diff and the test results are reviewed.  
5. Keep retention, limits and privacy on main as workspace-level decisions; they are not experiment variables.  
6. Never edit a shared tool to fix one branch; the change is live for every version at once.

## 3\. Debugging and tracing in production {#3.-debugging-and-tracing-in-production}

Most production failures look like "the agent did something weird on this call". The platform exposes enough per-turn detail to trace that behavior to its source, usually a prompt instruction, an edge condition, a tool description, a missing dynamic variable or a procedure trigger. This section walks through the views available on the conversation page and what each one is for. Treat that page as the primary debugging surface; the principles in this document only matter to the extent that you can apply them when looking at a real broken call.

### 3.1 Open the failing conversation {#3.1-open-the-failing-conversation}

Every conversation is identified by a **conversation ID** (conv\_...). **The conversation ID is the first thing to ask for, and the first place to look, whenever something goes wrong on a call.** Capture it at the moment of escalation rather than reconstructing what happened from memory; conversations are searchable by ID immediately, and almost every "the agent did X" question collapses to a few minutes on the conversation page. The conversation list filters by date, duration, channel, language, agent and branch, version, environment, evaluation result (per criterion), data collection values, dynamic variable values, workflow node entered, procedure triggered, topic, sentiment and frustration, guardrail triggered, termination reason, error type, tool used (succeeded or errored), user, rating, tags, and free text or semantic search across transcripts, so the calls worth investigating can be found without an ID too.

The conversation page is organized as tabs: **Overview**, **Transcript**, **Client data**, **Analysis**, **Workflow** (for workflow agents), **Procedures** (when a procedure ran) and, for SIP calls, **SIP**. Phone, WhatsApp, SMS and batch details appear as rows on the Overview rather than as separate tabs.

The Overview shows the date, duration, channel and environment, the cost (LLM cost or token usage, with a cost trajectory over the call), the sentiment, the summary, the branch and version the call ran on, any failure reason or warning, tags, and a configuration snapshot of what the agent was at that version (prompt and greeting, tools, knowledge base, attached tests, guardrails), each marked with whether it has since been added, removed or changed on the branch. That last part answers "was this the config I think it was" without opening version history.

In one place, the page exposes everything you typically need: per-turn ASR, LLM and TTS latency and end-to-end response time, every tool invocation with the parameters the LLM extracted and the response the backend returned, every dynamic variable update with its writer, the active workflow node at each turn and the path through the graph, the knowledge base chunks the agent received, the procedures that started and ended, and the evaluation and data collection results with rationales. The same page lets you act on what you find: **Create test from here** captures a turn into a regression test (§3.6), **Analyze with Architect** opens an Architect chat seeded with the turn, and **Flag issue** opens a triage ticket for a teammate. Whatever symptom a partner reports, the right first move is to open the conversation by ID and read the relevant tab; it is almost always faster than reasoning about the agent's configuration in the abstract.

### 3.2 Read the transcript with metadata in mind {#3.2-read-the-transcript-with-metadata-in-mind}

The **Transcript** tab shows the full conversation as a sequence of turns. Click any timestamp to seek the audio player to that point. What you are looking for is the exact turn where the call diverged from what should have happened: the misrouted handoff, the wrong tool call, the missing confirmation, the unexpected hang-up.

Each turn carries small metadata badges that often contain the answer:

* **ASR**: recognition latency and model, plus a fallback badge when the configured recognizer was not the one used. Useful when you suspect the agent misheard the user.  
* **LLM**: latency, tokens and model, with failed attempts shown when the backup cascade retried, and an override badge when a node or the caller changed the model. Click to expand.  
* **Reasoning**: the model's reasoning summary when the agent has it enabled; the fastest way to see why the agent chose a tool or an edge.  
* **Response time**: end-to-end latency from the user finishing to the agent's first audio, the number users feel (§2.11 LLM selection).  
* **TTS**: time to first byte and the model actually used. If it differs from the configured model, the platform cascaded to a fallback because the configured model failed to produce audio for that turn (§3.7).  
* **RAG** and **Sources**: retrieval latency and the chunks the agent received this turn, by source document and chunk. Click any chunk to inspect its text. This is the canonical way to evaluate whether retrieval is contributing useful context: if the chunks do not contain what the agent needed, the issue is the knowledge base content or the retrieval settings, not the prompt; if the right chunks arrived and the agent ignored them, the prompt is the place to fix.  
* **Tool result**: tool type and execution latency; expands into the Tool call panel (§3.3).  
* **Guardrail**: present when a guardrail blocked or modified the response.  
* **Ignored term**: the user turn was treated as a backchannel and did not interrupt the agent.  
* **Compacted**: the context was summarized to fit the model's window at this turn, which can explain a sudden loss of earlier detail.  
* **Sentiment**: the per-turn sentiment that feeds the conversation's trajectory.  
* **User feedback**: thumbs up or down from the widget.  
* **Source**: Text, DTMF or File, indicating how the user input arrived.  
* **Active node**: for workflow agents, the label of the node driving each agent turn.

Procedure starts and ends appear as tool results in the transcript with the procedure's name, so "the agent never followed the SOP" is answered by whether a start appears at all (a trigger problem) or appears and is then abandoned (a body problem).

When audio recording is enabled, the audio player lets you play back the conversation with feedback markers on the waveform, download the full, user-only or agent-only audio, and switch between raw and processed sources. The transcript can be translated into the reviewer's language, searched, and tagged, and a transcription error on a turn can be reported.

### 3.3 Inspect tool calls {#3.3-inspect-tool-calls}

When a tool runs on a turn, the tool result badge expands a **Tool call** panel. This is the single most informative debugging view in the product. It shows:

* **Parameters extracted by the LLM**: the JSON the model constructed. If the parameters look wrong, the cause is in the tool description (the model did not understand when or how to call the tool) or in the conversation up to that point (the model did not have the values it needed).  
* **Request details** for webhook tools: the URL, method, headers, query parameters and body actually sent. This is where template substitution failures show up (a `{{variable}}` left unreplaced because it was never set), along with wrong endpoints, missing auth headers and malformed payloads. Secret values appear redacted.  
* **Response**: the full payload the tool returned, after any response filter. If the agent is hallucinating from a huge payload, this is the moment to add a response filter.  
* **Execution time**: wall-clock latency. Slow tools cascade into perceived agent slowness; pair this with the tool's pre-speech and tool-call-sound settings.  
* **Error message and reason** when the tool failed or was blocked. Whether the error reached the LLM depends on the tool's error-handling mode.  
* **Dynamic variable updates**: the variables this tool's assignments wrote, with previous and new values. If a downstream edge misrouted, the answer is usually here: either the assignment did not run, or the value it wrote is not what the edge expression compares against.

The **Save as mock** button on a tool response captures the payload into the tool's shared mock rules for later tests. Use it when you find a real failure mode (timeout, error, unexpected shape) you want the agent to be tested against going forward; flag the rule as an error if the real response was one.

### 3.4 Verify client context in Client data {#3.4-verify-client-context-in-client-data}

The **Client data** tab shows what the agent was given to work with, separate from what it did:

* **Client overrides**: any per-conversation configuration overrides applied at conversation start (system prompt, first message, language, voice, model, tools, knowledge base, limits). When the agent behaved differently on one call but not others, look here first.  
* **Inline tools**: tools passed at conversation start rather than saved on the agent.  
* **Dynamic variables**: every variable that existed during the conversation, with its initial value and, for variables updated mid-call, the full history: every assignment or state update with timestamp and the writing tool or node. This is the canonical view for "did the agent receive the right context, and did the workflow accumulate the right state". Secret variables are shown redacted.

Lists and objects render as inspectable JSON. Variables passed at initiation (by the host application or the initiation webhook) are visible alongside variables produced by tools and nodes, so you can see whether a missing value was a host omission or an assignment failure.

### 3.5 Read the verdict in Analysis {#3.5-read-the-verdict-in-analysis}

The **Analysis** tab shows the platform's automated assessment:

* **Summary and title**: an LLM-generated synopsis, useful for triaging long calls without reading every turn.  
* **Evaluation criteria**: every criterion's result (success, failure, unknown or a numeric score) with its rationale, grouped by scope or by agent for multi-agent calls. Disagreement with the judge usually means the criterion prompt is ambiguous; refine the criterion before contesting individual results.  
* **Data collection**: every item with its type, the extracted value and a rationale. Type mismatches surface as warnings. The rationale usually points to the exact phrase the extractor relied on, which makes it obvious whether the item definition or the agent's wording needs changing.  
* **Analysis metadata**: how many times analysis ran and what it cost.

When you change criteria or data collection definitions and want to re-score past conversations, use **Rerun evaluation** here. Rationales are redacted for zero retention workspaces.

### 3.6 Turn findings into permanent fixes {#3.6-turn-findings-into-permanent-fixes}

The transcript has three actions that turn one-off bugs into durable assets.

**Create test from here.** Available on user and agent turns. Opens a dialog pre-populated with the chat history up to that point, the dynamic-variable values at that point and the original agent reply, and records the source conversation on the test. You choose the type:

* **Next reply test**: assert what the agent says next on this prefix. Use for prompt regressions, tone violations, refusal behavior and "the agent should have said X".  
* **Tool invocation test**: assert which tool the agent calls (and with what parameters) on this prefix, or which node it transitions to. Use for tool-selection regressions and wrong-tool-at-wrong-time bugs.  
* **Simulation test**: a full multi-turn scenario starting from this point. Use when the bug only emerges across several turns.

**Analyze with Architect.** Available on agent responses where Architect is enabled for the workspace. Opens an Architect chat seeded with the turn and the conversation, so you can ask why the agent responded that way, what in the prompt, procedure or knowledge base produced it, and have Architect stage a fix in your draft on a branch for you to review and publish. Architect never publishes on its own (§2.17.1).

**Flag issue.** Opens a triage ticket for the conversation (or adds to the ticket already open for it) with an issue type (knowledge gap, incorrect information, documentation gap, product feedback, tool issue, missing tool, unnecessary escalation, wrong action), a priority, per-turn comments and an assignee who has access to the agent. The agent itself can raise a ticket mid-call through the "Flag issue for review" system tool, silently and without ending the call. Tickets support comments, status (open, in progress, resolved, cancelled, merged), merging duplicates, and linking to the merge proposal that fixes them. There are no email or chat notifications on comment or assignment today; teams that need them poll the public triage API.

Every bug worth filing is worth a test. Every recurring pattern is worth a ticket with the conversations attached. The combination keeps regressions from recurring without requiring anyone to remember every fix.

### 3.7 Diagnosing common failures {#3.7-diagnosing-common-failures}

A few recurring symptoms and where to look first. The investigation almost always lands on wording: the root prompt, a node's prompt, an edge condition, a tool description, a procedure trigger or a data collection description. The views above find the moment of failure; the fix is usually rewording rather than rewiring.

* **Agent called the wrong tool, or no tool when it should have.** Tool call panel: was the tool attempted at all? If it was, inspect the parameters; wrong parameters mean the description is ambiguous about how to call it. If not, the description does not state when to invoke it. Create a tool invocation test from the offending turn.  
* **Tool was called but the response was bad.** Tool call panel: inspect the payload, error and execution time. Huge JSON the LLM hallucinates from needs a response filter. A malformed or erroring response is the tool's problem, not the agent's.  
* **Workflow took the wrong edge.** Workflow tab first: it shows the path taken and the inspector per node and edge. Then Client data: the dynamic variables at the moment of the transition. The most common failure is a missing or stale assignment (the expression evaluated against state that was never written), the second is a type mismatch (a string compared to a boolean or a number, §2.4.2), the third is a result edge that passed on an HTTP 200 whose body said failure.  
* **Workflow never transitioned, or transitioned to the wrong node.** Transcript: read the active node label on each agent turn and find where the workflow stayed too long or jumped. The cause is almost always one of three things: an LLM edge condition phrased in a way the model cannot reliably evaluate from the transcript (most common; see §2.4.3), an expression edge comparing against a variable that was never set or has the wrong type, or an edge that was already true when the node was entered and skipped the stage.  
* **The agent ignored a procedure.** Transcript: is there a start-procedure result at all? If not, the trigger did not match how the user phrased the request; rewrite it from the user's side. If a start appears and the agent still skipped steps, the body is ambiguous or the procedure was evicted from the active window by later procedures.  
* **Agent missed something the user said.** Transcript: check the ASR badge on the user turn. If the recognized text is wrong, add the missed term to the keyword list and a pronunciation rule. Audio playback confirms what was actually said. An ignored-term badge means the turn was deliberately treated as a backchannel.  
* **Agent said something it should not have.** Analysis: did a criterion fail, and what does the rationale say? Analyze with Architect to ask why the agent produced the response. Create a next reply test asserting the correct behavior. If the leaked content was a document or chunk identifier or a "Sources" heading, check the source attribution setting before blaming the prompt (§2.11 Knowledge base configuration).  
* **Conversation was slow.** Per-turn response time, LLM and TTS badges identify the component. A slow tool shows in the Tool call panel. If the LLM was slow (P50 above about a second), do not stop at "switch to a faster model": look at what the LLM is asked to do per turn, bloated prompt, too many tools in scope, static knowledge that should be retrieved, serial tool chains, high reasoning effort, and count the workflow hops on the path (§2.11 LLM selection, §2.4.2).  
* **Voice sounded different than configured, or the TTS badge shows a different model.** The TTS cascade fired. Occasional cascades under transient failure are normal; frequent cascades on one deployment warrant a support escalation. Demos delivered through audio-sharing tools that re-encode audio (meeting screen-share, browser tab capture) degrade audio independently of the TTS model; for high-stakes demos prefer a direct phone call or a clean widget session.  
* **Variables look wrong in the prompt.** Client data: if a variable is missing, the host or initiation webhook did not pass it and the placeholder (if any) was used. If it is present but stale, the relevant assignment did not write the expected value.  
* **Data collection extracted the wrong value.** Analysis: read the rationale; it quotes the phrase the extractor relied on.  
* **Calls were declined or callers waited.** The failure reason on the Overview and the call initiation failure webhook say whether the agent or workspace concurrency cap, the daily limit or a queue timeout was hit (§2.14).

When you cannot reproduce the issue from the data on screen, send support the conversation ID, the agent ID, the workspace, the expected behavior, the actual behavior and what you have already checked.

### 3.8 Workflow execution debugging walkthroughs {#3.8-workflow-execution-debugging-walkthroughs}

Workflow misbehavior almost always reduces to one question: which node was the agent in, which edge did or did not fire, and why? The **Workflow** tab on the conversation page answers the first two directly: it shows the graph with the path this conversation took and an inspector for each node and edge visited, which is faster than reading node labels down the transcript. **Dynamic variables** in Client data show the state expressions were evaluated against, and the **Tool call** panel shows what each tool call did and what assignments wrote. The scenarios below cover the bulk of workflow bug reports; each names the views to open and the principle from §2.4 the fix traces back to.

**Scenario A: Workflow stuck in a Subagent that should have transitioned.**

Symptoms: the active node stays the same across multiple agent turns where it should have advanced.

1. Read the user turns inside the stuck node. Did the user actually provide the input the outgoing edge condition is looking for? If not, the node's prompt is failing to elicit the needed input; fix the prompt before touching the edge.  
2. If the user did provide it, the edge condition is the suspect. Read the LLM condition text on every outgoing edge and apply the predicate test: does each read cleanly as "true if X is met"? Conditions phrased as instructions will not fire reliably. Rewrite as observable user state (§2.4.3).  
3. If the condition is well phrased but still does not fire, it may be too tight. Add disambiguating examples or broaden the positive triggers while keeping exclusions.  
4. If the edge is an expression, check the variable it compares in Client data: missing, stale, or the wrong type (a `""` placeholder is a string; a `"true"` string is not a boolean).

**Scenario B: Workflow took the wrong edge from a Subagent.**

Symptoms: the active node jumps to an unexpected destination after a particular user turn.

1. Read the user turn just before the transition. What did the user actually say?  
2. Read each outgoing LLM condition. Does the utterance match one you did not intend? Broadly worded conditions fire on weak signals because the model is told it need not be certain. Tighten with exclusions for nearby intents.  
3. If two conditions could both be true on that turn, tell them apart in their wording; for Subagent edges the model picks among the condition tools, so order alone does not disambiguate.  
4. If the edge was an expression that fired on entry, it was already true when the node was entered and skipped the stage (§2.4.2).

**Scenario C: Expression edge routed wrong because of a missing, stale or mistyped assignment.**

Symptoms: a workflow took the failure branch of `is_verified == true` even though the verification tool succeeded; or skipped a privileged branch even though the user is authenticated; or a retry loop never exited.

1. Open Client data and find the variable. Check its final value and type; expand its history for every write with timestamp and writer.  
2. If the variable is missing or null, the assignment never ran: either the tool was never called, or it ran but the assignment path is wrong. Inspect the Tool call panel: was it invoked, and does the field the assignment reads exist in the response? Path typos are a common cause. If the tool is asynchronous, its assignments land after the edges were evaluated.  
3. If the variable has a value of the wrong type, the comparison never matched (equality across types is false; ordering comparisons raise and the edge never fires). Fix the placeholder type or the assignment, not the edge.  
4. Once the assignment is correct, capture the failing payload with Save as mock and add a test from the offending turn.

**Scenario D: Tool node failed and the workflow did not progress as intended.**

Symptoms: a Tool node ran, the tool failed, and the conversation either stayed in the parent Subagent saying something unrelated to the next intended stage, or routed to an unexpected destination.

1. Open the Tool call panel for the failed tool. Was it a timeout, an HTTP error, an auth failure, a malformed payload?  
2. Inspect the node's outgoing edges in the Workflow tab. With no matching edge, control fell back to the Subagent that started the transition, under its own prompt (§2.4.2). If that fallback is what you wanted, verify the Subagent's prompt handles "the action didn't proceed" gracefully. If you wanted deterministic routing, add a result \== false edge or a catch-all.  
3. If a failure edge exists but routed to a dead end or the wrong node, fix the destination; if the failure is recoverable, route into a bounded retry loop (§2.4.4) rather than straight to handoff.  
4. If the tool "succeeded" but the body said otherwise, replace the result edge with an assignment plus expression edges.  
5. Capture the failure payload via Save as mock (flagged as an error) and add a test so the failure path is under coverage.

**Scenario E: A Say node did not transition where it should have, or was cut off.**

1. Outgoing edges from a Say node are evaluated right after the utterance is handed to speech synthesis. If the only edge is unconditional, the transition is automatic; if routing depends on state, it must be an expression over a dynamic variable.  
2. An LLM condition leaving a Say node was evaluated before any user reply and had nothing new to look at. Move the listening into a Subagent or convert the edge to an expression.  
3. If the line was cut off by an End or transfer node, turn on "wait for completion before advancing" on the Say node.  
4. If the Say node never transitioned at all, confirm an outgoing edge exists; orphaned Say nodes block the workflow.

**Scenario F: A Subagent spoke when it should have waited, or waited when it should have spoken.**

1. Check what the previous node was. After Start or a Say node a Subagent with entry behavior Auto waits for the user; after a Tool node it speaks immediately.  
2. Set the entry behavior explicitly ("wait for user input" or "generate immediately") on the node, or move the Tool node so it is not the last step before a node that should wait.

The same principle applies throughout: edges leaving Say, Tool and update\_state nodes are evaluated deterministically right after the action completes. If you find yourself wanting an LLM condition to leave one of these nodes, the design has the listening in the wrong place; push it into a Subagent.

## 4\. FAQ {#4.-faq}

### Getting started {#getting-started}

**Q: I'm starting a new agent. Should I use a workflow from day one?** Not necessarily. If the use case has one clear objective and one stable set of tools, a single-agent configuration with a strong root prompt is the right starting point. Add a workflow when you have distinct stages, different tool sets per stage, gated compliance steps or different recovery paths per failure mode. Add procedures when there are many distinct intents with their own playbooks. Complexity is not a quality signal on its own.

**Q: Workflow or procedures?** Workflows when the author must control the path (hard gates, different voice or model per stage, routing to specialists). Free-form procedures when there are many intents with written SOPs and the order within each is guidance. Structured procedures for a model-triggered flow that must run in a fixed order from anywhere. Most production agents use a small workflow skeleton plus procedures for the leaves (§2.5).

**Q: How do I pick the right LLM for an agent?** Trade latency against reasoning quality for the use case. A high-traffic FAQ or routing agent benefits from a fast model because perceived latency dominates. A tool-heavy agent doing multi-step reasoning, dispute handling or eligibility gating benefits from a stronger model or higher reasoning effort because errors compound across turns. Use the picker's latency and cost figures to compare, and test both before committing.

**Q: How do I pick a voice?** Match it to the brand and the use case, then test with at least two real conversations before settling. A voice that sounds great reading marketing copy may sound wrong on a 90-second support call. Pay attention to how it pronounces your domain terms; add pronunciation rules if it consistently misses brand or product names.

**Q: What goes in the first message?** A short greeting, the agent's identity (including AI disclosure where your jurisdiction or policy requires it), and an open invitation to state the reason for the call. Avoid stacking options; voice agents are not IVRs. On inbound text channels the first message is not spoken, so put the opening instruction in the prompt too.

### Prompts {#prompts}

**Q: How long should my root prompt be?** Long enough to cover the six building blocks (Personality, Environment, Tone, Goal, Guardrails, Tools), short enough that you can defend every paragraph. If a section repeats itself, cut it. If you cannot explain why a paragraph is there, remove it and see if anything breaks. If it contradicts another instruction in the prompt or a node prompt that does not use Override Prompt, remove it. Move intent-specific playbooks into procedures.

**Q: Should I copy global instructions into every node prompt?** No. The node prompt is appended to the root prompt at runtime, so global rules are already inherited. Repeating them creates contradictions and makes the model follow the wrong copy. Use Override Prompt when a stage's job conflicts with the global persona.

**Q: My agent keeps making things up when the knowledge base does not have the answer.** Add an explicit instruction: "If the knowledge base does not contain the answer, do not guess. Say you do not have that information and offer to transfer or take a message." Pair it with an evaluation criterion that detects fabrication, and move facts that must be exact out of retrieval and into the prompt or a tool.

**Q: My agent reads bullet points and Markdown when it should be speaking naturally.** The platform instructs the model not to format for voice, but if your prompt asks for structured output it fights that guidance. Rewrite the prompt to ask for natural spoken responses, and use the per-channel text settings if you want Markdown on chat channels only.

**Q: How do I handle pronunciation of brand names, product terms and acronyms?** Configure a pronunciation dictionary: alias rules work for most terms on every model and language; phoneme rules are higher precision and work on the V4 models, on V3 Conversational when enabled, and on Flash v2 for English. Spelling tricks in the prompt are unreliable for both recognition and synthesis. For terms the recognizer mishears, also add them to the ASR keyword list.

**Q: Does my agent know what day it is?** Only if the agent has a timezone configured; the platform then adds the current date and time to the system prompt on every turn. Without a timezone the agent will invent dates.

### Workflows {#workflows}

**Q: When should I use a Say node vs a Subagent node?** Say for one fixed or templated utterance that does not need to react to the user. Subagent when the stage must ask questions, call tools or hold a multi-turn conversation. Adjacent Subagents that only speak one line each are a sign the workflow should be simplified.

**Q: When should I use a dispatch tool node vs an attached tool?** Attached tool: the user is asking a question and the agent should call the tool and speak the answer in the same turn (order status, shipping ETA). Tool node: the tool result drives a transition and the agent should not speak the raw result (identity verification, eligibility check, refund submission). Remember a Subagent entered after a Tool node speaks immediately by default.

**Q: My LLM edge condition fires too early or too late.** Reframe it as an observable user state, not an instruction or the agent's own conclusion; the model is told it need not be certain, so broad conditions fire on weak signals. Tighten with explicit positive triggers (joined by AND), exclusions for nearby intents, and an example. If the condition depends on a tool result or known state, switch to an expression edge, and if it depends on a classification the agent makes, put the classification in an update\_state node with an "undetermined" option (§2.4.3).

**Q: Two of my outgoing edges can be true at the same time. Which one fires?** Out of a Start, Say, Tool or update\_state node, the first in edge order. Out of a Subagent, the model picks which condition tool to call, so disambiguate the two conditions in their wording; order alone does not settle it.

**Q: My workflow keeps looping because of a retry path. How do I bound it?** Track the count in an update\_state node with a numeric placeholder, route with an expression like `retry_count < 3`, and draw the two-node loop as a single edge with a forward and a backward condition; the builder rejects a second edge between the same pair and any self-loop. Reset the counter on success.

**Q: My verification gate let an unverified caller through.** Three usual causes: a result edge on a tool that reports failure inside a successful HTTP response (branch on an assigned field instead); an expression comparing a string placeholder to a boolean (fix the placeholder type); or an LLM edge that infers "the user has verified" (make it an expression). Check the Workflow tab and the dynamic variable history on the failing conversation.

**Q: How do I make a stage end the call gracefully?** Put a Say node before the End node with the closing message and turn on "wait for completion before advancing", or grant End call with a farewell parameter. The End node alone does not speak.

**Q: Can I turn off a global tool on one node?** Yes. Switch Inherit tools off on that node and attach only the tools it should have. The same switch exists for the knowledge base.

### Procedures {#procedures}

**Q: The agent ignores my procedure.** Almost always the trigger. It is matched against what the user says, so write it from the user's side, make it disjoint from the other triggers, and cover phrasing variants. Check the transcript: if no "start procedure" tool result appears, the trigger never matched; if one appears and steps were skipped, the body is ambiguous or the procedure was evicted by later ones.

**Q: Can a procedure be restricted to one workflow node?** No. Procedures are agent-level and their triggers are available in every Subagent. Put the precondition in the body ("if the caller is not verified, say so and end the procedure"), keep sensitive tools on the authenticated node rather than in the procedure, or keep the gated flow in the graph.

**Q: Why did a structured procedure end the call?** A tool step failed without a failure handler, or its retry budget ran out; both end the conversation by design. Add a failure handler with a bounded retry or a handoff to every tool step.

**Q: Why won't my agent save?** A structured procedure failed validation (adjacent If steps, an expression If directly after an Ask, mixed condition kinds in one If, a sub-procedure pointing at a missing or free-form procedure, a tool reference that does not match the tool's schema). The error names the procedure and the step; fix it and save again.

**Q: Can I import our existing SOP documents?** Yes. The import takes PDF, DOCX, TXT, Markdown, HTML and EPUB files and produces free-form procedure drafts with generated triggers. Review every trigger before publishing.

### Tools {#tools}

**Q: My agent is calling the wrong tool, or the right tool at the wrong time.** Check the tool's description first. The model uses it to decide when to invoke. If the description only documents what the tool does, add the trigger condition: when in the conversation it should be called, what user state must hold, what parameters are required.

**Q: My tool response is huge JSON and the agent is hallucinating from random fields.** Configure a response filter to surface only the fields the agent should see, and assign the values you need later to dynamic variables.

**Q: The agent goes silent while a slow tool runs.** Set pre-tool speech to force so the agent says a line before calling, add a tool-call sound for tools over a few seconds, and set the interruption mode so a barge-in does not cancel a payment or booking mid-flight. Fix the tool's latency too; the Tools table shows success counts and the tool call panel shows execution time.

**Q: My agent calls a tool but seems to forget what it returned by the next turn.** Two likely causes: the result was not assigned to a dynamic variable, or the response filter removed the field. Verify both before touching the prompt.

**Q: Can I test failure branches without breaking my backend?** Yes. Save a real failure payload as a mock and flag the rule as an error, or write one by hand; the agent receives it through its error-handling path in tests.

**Q: Why does my MCP tool hang on phone calls?** Its approval policy asks the user to approve each call, and on a phone call there is no screen to approve on, so it waits until it times out. Use auto-approval (per tool or server-wide) for phone agents.

**Q: Can I allowlist the platform's IP addresses on my API?** Yes. Tool calls, MCP requests and webhooks leave from a published set of static egress addresses per region, listed in the documentation. Allowlisting plus authentication on the tool is the recommended combination; tool calls themselves are not HMAC-signed.

### Authentication {#authentication}

**Q: How do I authenticate users for sensitive operations?** The privileged Subagent must be unreachable except through an edge gated by an expression over a verification result. Pick the method by channel and risk: host-app authentication for embedded widgets, KBA for unauthenticated callers, OTP (spoken or by keypad) for higher-risk actions, caller ID only as a low-friction signal paired with a second factor.

**Q: Can I use the caller's phone number as the only authentication factor?** Not for anything sensitive. Caller IDs are spoofable, phones are shared, and stored numbers go stale. Treat caller ID (and a WhatsApp identity) as a lookup key, not as proof of identity.

**Q: How do I implement multi-question security verification?** Each correct answer increments a numeric success counter via tool assignment or an update\_state node. The privileged Subagent is gated by an expression like `auth_success_count >= 3`. Do not let the model judge "the user has answered enough".

**Q: How do I personalize the greeting on a phone call?** With the conversation initiation webhook: it fires before the first turn with the caller's number and returns dynamic variables and a first-message override for that call. It does not run for the widget or the SDKs, where the host passes the variables itself.

### Knowledge bases {#knowledge-bases}

**Q: How big can my knowledge base be before it becomes a problem?** Documents inserted into the prompt are capped individually and in total by the model's context window, and are paid for on every turn. Above a few thousand tokens of always-needed content, switch the documents to retrieval. Above that, partition by domain into folders scoped to the nodes that need them.

**Q: Should I use every-turn retrieval or the search tool?** Every-turn retrieval when the agent's job is answering from documents. The knowledge base search tool when the agent mostly does something else and occasionally needs to look things up, or when you want retrieval to be visible as a tool call in the transcript.

**Q: My agent answers general questions correctly but mixes up policy details for specific orders.** Likely a partitioning issue. If general policy and order-specific records are in the same folder, retrieval sometimes mixes them. Split by domain and tell the agent which source to use for which question type; keep order records in a tool, not in documents.

**Q: How do I keep internal notes in the knowledge base without the agent reading them aloud?** Mark them clearly inside the article with a tag the agent is told to treat as non-spoken, and add the rule to the prompt. Better: keep internal notes in a separate document the agent does not have.

**Q: The agent said "chunk" or read a document identifier aloud.** Source attribution is on. Turn it off unless your client renders sources.

### Testing and operations {#testing-and-operations}

**Q: My tests all pass but the agent fails in production.** Two common gaps. Coverage: a happy-path-only suite passes easily and means little; add refusals, pivots, ambiguous inputs, tool failures. Realism: the simulated user accepted the first answer; add pushback constraints to the scenarios. Pair tool invocation tests with simulations.

**Q: How do I run tests from CI?** Attach the suite to the agent, start a run through the API or the command-line tool against the branch under test (with repeats on the tests that matter), poll the invocation until no run is pending, and fail the build on any failed run. Point the test's environment at your staging systems.

**Q: My test is flaky. Is the agent broken?** Run it with repeats. The result buckets show whether it fails for one consistent reason (a real defect or a too-strict criterion) or at random (an underspecified scenario). Three LLMs are involved in a simulation; a single failure is not a regression.

**Q: Can one tool invocation test check the tool and the transition?** No. A test asserts either a tool call (with parameter checks) or a workflow transition. Write two tests.

**Q: How many test conversations do I need before going live?** Enough to cover the realistic input distribution, including edge cases. Batches under 100 conversations per branch produce too much variance to be conclusive. The signal is consistency across runs, not a number.

**Q: I'm pushing a prompt change. How do I roll it out safely?** Branch, run the attached suite, give the branch a small traffic share, compare its evaluation pass rates and escalation rate with main on the Dashboards branch filter, and merge (through a proposal if more than one person owns the agent) when the numbers are stable (§2.17).

**Q: My agent's escalation rate jumped after a change.** Open the conversations filtered by the branch and the failing criterion, find the exact turn where escalations now trigger, and trace it to the change. If you cannot find a clear cause, move the traffic back to main and retry with a smaller change. Avoid stacking several changes into one branch.

**Q: We used the simulate-conversation endpoint in our pipeline.** It is deprecated and is switched off at the end of October 2026\. Replace it with a simulation test plus a run through the test API.

**Q: How do I know when to stop iterating?** When the agent consistently meets the evaluation criteria defined at scoping time, platform metrics have stabilized and branched rollouts show no regression. The signal to stop is stability, not perfection.

**Q: What's a realistic target for task completion and escalation rates?** Strongly context-dependent. With limited data access or incomplete integrations, escalation around 50 percent may be the realistic ceiling until those constraints are resolved. With strong integrations, the best-performing deployments target task completion above 85 percent and escalation below 20 percent. Stability across weeks of production traffic matters more than any specific number.

### Deployment and channels {#deployment-and-channels}

**Q: What's the simplest way to deploy an agent for testing?** The embeddable widget, or the hosted "talk to" page the platform generates per agent. Both bypass telephony and SDK setup and get you to a live conversation fastest.

**Q: When should I deploy via phone vs widget vs SDK vs messaging?** Phone when the use case is genuinely a phone call. Widget when the user is on your website or web app. SDK when you are building a custom application and need programmatic control. WhatsApp, SMS, Slack or a helpdesk integration when the users already live in that channel and asynchronous text is the natural mode.

**Q: Can the same agent handle voice and chat?** Yes. Keep the prompt channel-neutral, set verbosity and format per text channel, and branch on `{{system__is_text_only}}` where a step only makes sense on one channel. Text conversations use a separate, much larger capacity pool.

**Q: How do I personalize the conversation for a known user?** On the widget and SDKs, pass dynamic variables at conversation start (name, tier, last order) with a signed token. On telephony and messaging, return them from the conversation initiation webhook. Reference them in the prompt and use them in tool parameters so the agent never asks for what the system already knows.

**Q: What happens when we hit our concurrency limit?** New agents hold inbound callers and widget users in a queue with hold audio for a configurable wait; otherwise the call is declined with a reason recorded on the conversation and in the failure webhook. Burst capacity up to three times the limit (capped at 300\) absorbs spikes first at double rate (§2.14).

**Q: Can I run an outbound campaign with retries and callbacks?** Batch calling dials each recipient once. Outbound campaigns (enabled on request) add retries, calling windows, callbacks collected by the agent and redirects. Both need an outbound-capable number and accepted terms; neither works in zero retention mode (§2.15).

### Configuration {#configuration}

**Q: When should I use eager, normal or patient turn eagerness?** Normal for typical adult callers. Eager for fast-paced casual flows where the latency win outweighs an occasional cut-off. Patient for audiences that pause mid-sentence: elderly callers, non-native speakers, users reading from documents or spelling things out.

**Q: Which speech recognizer should I use?** Scribe v2 Realtime, the default, for almost every agent; it is what the default turn-taking model and the interruption-ignore terms require. The buffered variants trade latency for accuracy and only work with the older turn model; reserve them for high-stakes transcription.

**Q: Should I enable zero retention mode or use a short retention window?** Zero retention only when regulation or contract forbids storing conversation content at all; it removes analytics and debugging and constrains models, channels and features (no batch calling, messaging channels, MCP or triage). For most agents a defined retention window with "delete transcript and derived fields" and "delete audio" chosen deliberately gives the privacy posture you need while keeping the data to improve the agent. Conversation history redaction is an enterprise option enabled on request.

**Q: Should I use one voice across all languages or a different voice per language?** If brand consistency matters more than per-language quality, pick a voice with strong cross-language quality and override only the first message per language. If native-sounding output matters more, override the voice in each preset. Either way, enable the language detection tool, and remember the prompt cannot be overridden per language.

**Q: Should the first message be empty, interruptible or non-interruptible, or should I use a Say node?** Interruptible (default) for ordinary inbound greetings. Non-interruptible for required disclosures, kept short. Empty when the agent should listen first (outbound). A Say node when the greeting varies by routing condition or logic must run first. For telephony personalization, the initiation webhook can override the first message per call.

**Q: When should I enable speculative turn?** Leave it on (it is on automatically for the newest voice models). Turning it off on a node that collects a one-word answer makes that node feel slow.

**Q: Should I run guardrails in streaming or blocking mode?** Streaming for voice flows where an occasional cut-off is tolerable; blocking for text, or for voice where a retry produces a meaningfully better experience. Retry only works in blocking mode, up to three times, then the call ends.

**Q: Can a custom guardrail check that the agent only says things from the knowledge base?** No. The custom guardrail judge sees the candidate reply and recent user messages, not the retrieved chunks. Use literal, observable rules for guardrails and an evaluation criterion that sees the retrieved knowledge for groundedness.

**Q: Which LLMs are HIPAA-eligible?** The picker greys out ineligible models on HIPAA and zero retention workspaces. Production Gemini Flash, Claude and GPT families (the last for enterprise workspaces), selected hosted open-weight models in specific regions, and your own custom LLM under your own agreement are eligible; preview models are not. Confirm the current list in the editor and treat the model field as compliance configuration.

**Q: Should I let the recognizer auto-detect the language?** There is no permissive auto-detect. Set the language explicitly, configure presets, and enable the language detection tool, optionally limited to the start of the conversation so a stray foreign phrase later does not flip the agent.

**Q: What are Realtime models and should I switch?** A newer voice mode where one managed model replaces separate LLM, recognition and synthesis settings; prompt, voice, tools and knowledge base work unchanged. It is rolling out per workspace and has constraints (no custom LLM, no per-node model overrides, transfers only between Realtime agents). Evaluate it on a branch like any other model change.

**Q: Which TTS model is best for an agent that reads many numbers, codes and identifiers?** The low-latency member of the current family, with ElevenLabs text normalization mode on so number formatting is deterministic, alias pronunciation rules for identifier patterns, and DTMF input enabled so callers can type codes instead of saying them.

### Support and escalation {#support-and-escalation}

**Q: My agent has an issue I can't reproduce. What do I include when asking for help?** The agent ID, the workspace, the conversation ID of the failing call, the branch and version it ran on, the expected behavior, the actual behavior and what you have already tried. The conversation ID is the fastest path to the transcript and the per-turn diagnostic data.

**Q: When should I escalate to ElevenLabs support vs solve it myself?** Solve it yourself when the issue is a prompt, workflow, procedure or tool configuration problem; those are partner-facing surfaces and this document covers them. Escalate when you suspect platform behavior (latency, tool execution, edge evaluation, speech quality) is inconsistent with the documentation, or when you have ruled out configuration and the failure persists. Open a triage ticket on the conversation first so the evidence travels with the question.

## Further reading {#further-reading}

The principles above are distilled from longer-form writing on specific topics. When you need depth on one of these, the source material goes deeper:

* **Authentication patterns and implementation choices**: host-app authentication, KBA, telephony dynamic variables, OTP, multi-question verification.  
* **Workflows versus procedures**: choosing, combining, and the runtime tradeoffs of each.  
* **Large knowledge bases at enterprise scale**: partitioning, retrieval modes, when to use static versus dynamic insertion.  
* **Outbound calling**: batch calling and outbound campaigns, from submission to callbacks and reporting.  
* **SIP and telephony reference**: trunk configuration, transfer types, custom headers, provider specifics and contact-center integrations.  
* **Integrating with external agents and frameworks**: connecting ElevenAgents to existing agent implementations via OpenAI-compatible endpoints.  
* **Context window management**: keeping long conversations coherent without bloating per-turn cost.  
* **Building voice agents that last**: the full release-cycle methodology from pathfinder selection through scaling, including failure modes and stop conditions.  
* **ElevenAgents as code**: version control, CI/CD, automated testing and infrastructure-as-code patterns for agent configurations.  
* **Multimodal ElevenAgents**: handling voice, text, images and documents in a single deployment across web, WhatsApp and phone.

The public documentation remains canonical for API schemas, limits and the current model list; where this document and the documentation disagree on a number, the documentation (and the agent editor) win. Ask your partner contact for the current links to the resources above.


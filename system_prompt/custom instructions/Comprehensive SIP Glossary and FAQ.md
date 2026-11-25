# ElevenLabs Telephony & SIP Integration Guide {#elevenlabs-telephony-&-sip-integration-guide}

> **Author: [Boris Benchev](mailto:boris@elevenlabs.io)**  
> **Audience:** Solutions Engineers · System Integrators · Technology Partners   
> **Scope:** SIP trunking, Twilio, and CCaaS/PBX integration with the ElevenLabs Agents Platform — with an emphasis on debugging   
> **Version:** October 2026  
---

[ElevenLabs Telephony & SIP Integration Guide](#elevenlabs-telephony-&-sip-integration-guide)

[1\. Architecture Overview](#1.-architecture-overview)

[1.1 The end‑to‑end picture](#1.1-the-end‑to‑end-picture)

[1.2 Inbound call flow (your system → ElevenLabs)](#1.2-inbound-call-flow-\(your-system-→-elevenlabs\))

[1.3 Outbound call flow (ElevenLabs → your system)](#1.3-outbound-call-flow-\(elevenlabs-→-your-system\))

[1.4 How phone numbers are connected](#1.4-how-phone-numbers-are-connected)

[1.5 Three phone‑number providers, plus four non‑SIP voice transports](#1.5-three-phone‑number-providers,-plus-four-non‑sip-voice-transports)

[1.6 Two SIP stacks: default (dynamic IP) and static‑IP](#1.6-two-sip-stacks:-default-\(dynamic-ip\)-and-static‑ip)

[2\. SIP Primer](#2.-sip-primer)

[2.1 Signalling vs media — two planes](#2.1-signalling-vs-media-—-two-planes)

[2.2 Dialogs, transactions, and correlation](#2.2-dialogs,-transactions,-and-correlation)

[2.3 The lifecycle of a typical call](#2.3-the-lifecycle-of-a-typical-call)

[2.4 SDP and codec negotiation](#2.4-sdp-and-codec-negotiation)

[2.5 Proxies, SBCs, and the path of a request](#2.5-proxies,-sbcs,-and-the-path-of-a-request)

[2.6 SIP transports — UDP, TCP, TLS](#2.6-sip-transports-—-udp,-tcp,-tls)

[2.7 Inbound vs outbound SIP — which side initiates?](#2.7-inbound-vs-outbound-sip-—-which-side-initiates?)

[2.8 Termination URI](#2.8-termination-uri)

[2.9 The platform's SIP endpoints](#2.9-the-platform's-sip-endpoints)

[3\. Glossary](#3.-glossary)

[4\. Best Practices & Implementation Guide](#4.-best-practices-&-implementation-guide)

[4.1 SIP URI format](#4.1-sip-uri-format)

[4.2 Phone number format consistency](#4.2-phone-number-format-consistency)

[4.3 Transport protocol](#4.3-transport-protocol)

[4.4 IP whitelisting](#4.4-ip-whitelisting)

[4.5 No REGISTER requests](#4.5-no-register-requests)

[4.6 Outbound trunk security](#4.6-outbound-trunk-security)

[4.7 Audio codec — what to negotiate](#4.7-audio-codec-—-what-to-negotiate)

[4.8 Contact and Via header configuration](#4.8-contact-and-via-header-configuration)

[4.9 Custom SIP headers (X‑headers), UUI and BYE headers](#4.9-custom-sip-headers-\(x‑headers\),-uui-and-bye-headers)

[4.10 TLS certificate requirements](#4.10-tls-certificate-requirements)

[5\. Audio, Media, and Codec Handling](#5.-audio,-media,-and-codec-handling)

[5.1 Supported sample rates and codecs](#5.1-supported-sample-rates-and-codecs)

[5.2 SDP negotiation — what to look for](#5.2-sdp-negotiation-—-what-to-look-for)

[5.3 SRTP / media encryption](#5.3-srtp-/-media-encryption)

[5.4 DTMF and IVR navigation](#5.4-dtmf-and-ivr-navigation)

[5.4.1 Transport](#5.4.1-transport)

[5.4.2 Receiving DTMF from the caller (DTMF input)](#5.4.2-receiving-dtmf-from-the-caller-\(dtmf-input\))

[5.4.3 Emitting DTMF mid‑call (the play‑DTMF tool)](#5.4.3-emitting-dtmf-mid‑call-\(the-play‑dtmf-tool\))

[5.4.4 Post‑dial DTMF on transfer](#5.4.4-post‑dial-dtmf-on-transfer)

[5.5 Voicemail detection](#5.5-voicemail-detection)

[5.5.1 Two detection mechanisms: LLM‑driven and carrier AMD](#5.5.1-two-detection-mechanisms:-llm‑driven-and-carrier-amd)

[5.5.2 The voicemail‑detection tool](#5.5.2-the-voicemail‑detection-tool)

[5.5.3 Two configurable behaviours](#5.5.3-two-configurable-behaviours)

[5.5.4 Voicemail navigation vs voicemail detection](#5.5.4-voicemail-navigation-vs-voicemail-detection)

[5.5.5 Designing the agent prompt for outbound](#5.5.5-designing-the-agent-prompt-for-outbound)

[5.5.6 Debugging](#5.5.6-debugging)

[5.5.7 Twilio answering machine detection (carrier AMD)](#5.5.7-twilio-answering-machine-detection-\(carrier-amd\))

[6\. Phone Numbers & Routing](#6.-phone-numbers-&-routing)

[6.1 Importing a phone number](#6.1-importing-a-phone-number)

[6.2 Inbound trunk configuration](#6.2-inbound-trunk-configuration)

[6.3 Outbound trunk configuration](#6.3-outbound-trunk-configuration)

[6.4 Routing flow on inbound](#6.4-routing-flow-on-inbound)

[6.5 Telephony context available to the agent and to webhooks](#6.5-telephony-context-available-to-the-agent-and-to-webhooks)

[6.6 Concurrency limits, call admission and the wait queue](#6.6-concurrency-limits,-call-admission-and-the-wait-queue)

[7\. Telephony Provider Options](#7.-telephony-provider-options)

[7.1 SIP trunk (BYO carrier / SBC / PBX)](#7.1-sip-trunk-\(byo-carrier-/-sbc-/-pbx\))

[7.2 Twilio (managed integration)](#7.2-twilio-\(managed-integration\))

[7.3 CCaaS and other integrations (Genesys, Amazon Connect, AudioCodes, Avaya, Exotel, Zendesk)](#7.3-ccaas-and-other-integrations-\(genesys,-amazon-connect,-audiocodes,-avaya,-exotel,-zendesk\))

[Genesys Cloud — three paths](#genesys-cloud-—-three-paths)

[Amazon Connect — native A2A voice transport (limited availability)](#amazon-connect-—-native-a2a-voice-transport-\(limited-availability\))

[AudioCodes VoiceAI Connect — WebSocket transport (limited availability)](#audiocodes-voiceai-connect-—-websocket-transport-\(limited-availability\))

[Avaya Infinity — WebSocket transport (early access)](#avaya-infinity-—-websocket-transport-\(early-access\))

[Exotel (India and Singapore) — managed provider since May 2026](#exotel-\(india-and-singapore\)-—-managed-provider-since-may-2026)

[Zendesk](#zendesk)

[7.4 What is not natively integrated (today)](#7.4-what-is-not-natively-integrated-\(today\))

[8\. Transfer to Human: Blind, Conference, and SIP REFER](#8.-transfer-to-human:-blind,-conference,-and-sip-refer)

[8.1 The transfer‑to‑number tool](#8.1-the-transfer‑to‑number-tool)

[8.1.1 What a transfer rule contains](#8.1.1-what-a-transfer-rule-contains)

[8.1.2 Conditional transfers](#8.1.2-conditional-transfers)

[8.1.3 Mixing transfer mechanisms in one agent](#8.1.3-mixing-transfer-mechanisms-in-one-agent)

[8.1.4 Context that flows with every transfer](#8.1.4-context-that-flows-with-every-transfer)

[8.2 Side‑by‑side comparison](#8.2-side‑by‑side-comparison)

[8.3 Choosing between the three](#8.3-choosing-between-the-three)

[8.4 SIP REFER flow — step by step](#8.4-sip-refer-flow-—-step-by-step)

[8.5 Conference transfer — Twilio vs SIP trunk (cold and warm)](#8.5-conference-transfer-—-twilio-vs-sip-trunk-\(cold-and-warm\))

[Twilio path (warm handoff)](#twilio-path-\(warm-handoff\))

[SIP trunk path — cold conference (direct merge)](#sip-trunk-path-—-cold-conference-\(direct-merge\))

[SIP trunk path — warm conference (limited availability, Oct 2026\)](#sip-trunk-path-—-warm-conference-\(limited-availability,-oct-2026\))

[Is SIP REFER warm?](#is-sip-refer-warm?)

[Choosing between them](#choosing-between-them)

[8.6 Custom headers on transfers](#8.6-custom-headers-on-transfers)

[8.7 Post‑dial DTMF (extension navigation)](#8.7-post‑dial-dtmf-\(extension-navigation\))

[8.8 Failure handling](#8.8-failure-handling)

[9\. SIP Message Logging (Debugging Feature)](#9.-sip-message-logging-\(debugging-feature\))

[9.1 What it does](#9.1-what-it-does)

[9.2 What gets captured](#9.2-what-gets-captured)

[9.3 How to enable](#9.3-how-to-enable)

[9.4 How to access captured messages](#9.4-how-to-access-captured-messages)

[9.5 What the UI shows](#9.5-what-the-ui-shows)

[9.6 Permissions, retention, scope](#9.6-permissions,-retention,-scope)

[9.7 What this lets you do](#9.7-what-this-lets-you-do)

[10\. Debugging Workflow & Troubleshooting](#10.-debugging-workflow-&-troubleshooting)

[Step 1 — Capture the basics](#step-1-—-capture-the-basics)

[Step 2 — Open the SIP Messages view](#step-2-—-open-the-sip-messages-view)

[Step 3 — Walk the dialog](#step-3-—-walk-the-dialog)

[Step 4 — Check the Contact and Via headers](#step-4-—-check-the-contact-and-via-headers)

[Step 5 — Check your firewall](#step-5-—-check-your-firewall)

[Step 6 — For transfer issues, walk the REFER state machine](#step-6-—-for-transfer-issues,-walk-the-refer-state-machine)

[Step 7 — For silent‑audio issues](#step-7-—-for-silent‑audio-issues)

[Step 8 — Quick connectivity and TLS check](#step-8-—-quick-connectivity-and-tls-check)

[Step 9 — Escalate](#step-9-—-escalate)

[11\. Common Errors & Fixes](#11.-common-errors-&-fixes)

[remote error: tls: handshake failure. transaction transport error](#remote-error:-tls:-handshake-failure.-transaction-transport-error)

[tls: failed to verify certificate: x509: cannot validate certificate for \<IP\> because it doesn't contain any IP SANs](#tls:-failed-to-verify-certificate:-x509:-cannot-validate-certificate-for-\<ip\>-because-it-doesn't-contain-any-ip-sans)

[x509: certificate signed by unknown authority](#x509:-certificate-signed-by-unknown-authority)

[Inbound INVITE over TLS — "we sent it, ElevenLabs never answered" (and SIP Messages is empty)](#inbound-invite-over-tls-—-"we-sent-it,-elevenlabs-never-answered"-\(and-sip-messages-is-empty\))

[SIP OPTIONS keepalives unanswered](#sip-options-keepalives-unanswered)

[Inbound IP allowlist appears to be ignored](#inbound-ip-allowlist-appears-to-be-ignored)

[404 / 403 / 502 / 503 on an inbound INVITE (since Oct 2026\)](#404-/-403-/-502-/-503-on-an-inbound-invite-\(since-oct-2026\))

[429 agent\_daily\_call\_limit\_exceeded from an outbound‑call API](#429-agent_daily_call_limit_exceeded-from-an-outbound‑call-api)

["Transfer failed: \<reason\>" in the transcript on a SIP conference transfer](#"transfer-failed:-\<reason\>"-in-the-transcript-on-a-sip-conference-transfer)

[Twilio: missing\_account\_auth\_token on import, invalid\_twilio\_auth\_token at call time](#twilio:-missing_account_auth_token-on-import,-invalid_twilio_auth_token-at-call-time)

[INVITE is received but there is no further response](#invite-is-received-but-there-is-no-further-response)

[481 Call doesn't exist](#481-call-doesn't-exist)

[488 Not Acceptable Here on INVITE](#488-not-acceptable-here-on-invite)

[Call connects but audio is silent in both directions](#call-connects-but-audio-is-silent-in-both-directions)

[403 Forbidden on INVITE](#403-forbidden-on-invite)

[Transfer via SIP REFER never completes (no NOTIFY received)](#transfer-via-sip-refer-never-completes-\(no-notify-received\))

[403 Forbidden on REFER (TLS only — works on TCP)](#403-forbidden-on-refer-\(tls-only-—-works-on-tcp\))

[12\. Example: Successful Outbound SIP Handshake](#12.-example:-successful-outbound-sip-handshake)

[13\. FAQ](#13.-faq)

[14\. Pre‑Go‑Live Checklist](#14.-pre‑go‑live-checklist)

[15\. Known Limitations & Workarounds](#15.-known-limitations-&-workarounds)

[16\. Change Log Since May 2026](#16.-change-log-since-may-2026)

---

## 1\. Architecture Overview {#1.-architecture-overview}

The ElevenLabs Agents Platform terminates real‑time voice on its own SIP endpoint and bridges audio into a conversational AI agent. Any standards‑compliant SIP endpoint can connect — no proprietary client or media gateway required on your side.

### 1.1 The end‑to‑end picture {#1.1-the-end‑to‑end-picture}

`Caller (PSTN, mobile, soft client)`  
        `│`  
        `▼`  
`Carrier / DID provider  ──►  Your SBC / PBX  ──►  Internet  ──►  ElevenLabs SIP Edge`  
                                                                       `│`  
                                                                       `▼`  
                                                            `ElevenLabs SIP Server`  
                                                                       `│`  
                                                                       `▼`  
                                                            `Media plane (RTP / SRTP)`  
                                                                       `│`  
                                                                       `▼`  
                                                            `ElevenLabs AI Agent`  
                                                              `(LLM + TTS + ASR + Tools)`

Participants:

* **Caller** — on PSTN, mobile, or soft client.  
* **Your carrier / DID provider** — delivers the call to your network.  
* **Your SBC or PBX** — normalises SIP, handles NAT, enforces policy, routes to ElevenLabs.  
* **ElevenLabs SIP Edge** — the front door that accepts the initial INVITE. One hostname per region and per SIP stack: `sip.rtc.elevenlabs.io` (global, dynamic IPs), `sip-static.rtc.elevenlabs.io` (static‑IP stack), and `…rtc.<eu|in|sg>.residency.elevenlabs.io` variants for data‑residency workspaces — see Sections 1.6 and 2.9.  
* **ElevenLabs SIP Server** — the specific call‑handling instance that owns the dialog. *In‑dialog requests (BYE, REFER, NOTIFY, ACK) flow directly between this server and your SBC, **not** through the load balancer.* Its `Contact` header names that server directly: on TLS a per-server hostname of the form `<ip>.hosts.rtc.elevenlabs.io` (covered by a wildcard certificate), on TCP the bare IP. This has direct firewall consequences — see Section 4.4.  
* **ElevenLabs AI Agent** — the conversational AI configured in your workspace. The phone number → agent binding determines which agent answers.

### 1.2 Inbound call flow (your system → ElevenLabs) {#1.2-inbound-call-flow-(your-system-→-elevenlabs)}

`PSTN ──► Carrier ──► Your SBC/PBX ──► [SIP INVITE] ──► ElevenLabs SIP Edge`  
                                                              `│`  
                                              `[INVITE forwarded to handling server]`  
                                                              `│`  
                                          `[200 OK + SDP — media negotiation]`  
                                                              `│`  
                                                       `[RTP/SRTP audio]`  
                                                              `│`  
                                                          `AI Agent`

### 1.3 Outbound call flow (ElevenLabs → your system) {#1.3-outbound-call-flow-(elevenlabs-→-your-system)}

`AI Agent ──► ElevenLabs SIP Server ──► [SIP INVITE] ──► Your SBC/PBX ──► Carrier ──► PSTN`  
                                                              `│`  
                                          `[200 OK / 4xx / 5xx]`  
                                                              `│`  
                                                       `[RTP/SRTP audio]`

Outbound calls dial against the **outbound trunk** configured on the phone number, which specifies termination address (FQDN or IP), credentials (digest auth or ACL), transport, optional media‑encryption requirement, the codecs to offer, and any custom SIP headers to include in the INVITE. How long the platform lets the far end ring is configurable per call (`telephony_call_config.ringing_timeout_secs`, default 60 s, further capped by the carrier).

### 1.4 How phone numbers are connected {#1.4-how-phone-numbers-are-connected}

When you import a phone number:

1. The number is stored against your workspace.  
2. It is associated with a SIP endpoint (or a Twilio account, depending on provider).  
3. An agent is assigned to the number — this binding determines which AI agent handles inbound calls.  
4. (Optional) An outbound trunk is configured for outbound dialing or Conference‑style transfers.

> **Important:** Each imported number must have an agent assigned before calls can be handled.

### 1.5 Three phone‑number providers, plus four non‑SIP voice transports {#1.5-three-phone‑number-providers,-plus-four-non‑sip-voice-transports}

| Provider | Signalling | Media | Use when |
| :---- | :---- | :---- | :---- |
| **SIP trunk** | Native SIP over TCP/TLS (UDP on the static‑IP stack) | RTP/SRTP | You bring your own carrier, SBC, PBX, or CPaaS termination |
| **Twilio** | Twilio REST API \+ TwiML | Twilio Media Streams (WebSocket) | Customers already standardised on Twilio and want a turnkey integration |
| **Exotel** | Exotel REST API \+ applet | Exotel voice streaming (WebSocket) | India / Singapore deployments already on Exotel (added May 2026\) |

All three are full inbound and outbound channels with phone numbers imported into the workspace.

Four further **voice transports** exist that are *not* phone-number based and carry no SIP dialog of their own: **Genesys Cloud AudioHook** (generally available), **Amazon Connect** (limited availability, enabled per workspace), **AudioCodes VoiceAI Connect** (limited availability) and **Avaya Infinity** (early access). On all four the partner platform opens a WebSocket to ElevenLabs, authenticated with an ElevenLabs API key, and the call stays on that platform's telephony. They are covered in Section 7.3. None of the SIP-specific mechanics in this guide (X-headers, REFER, SIP message logging) apply to them, and the transfer-to-number tool is not available on them (Amazon Connect has its own escalation).

CCaaS systems (Genesys, Zendesk, etc.) layer on top — see Section 7\.

### 1.6 Two SIP stacks: default (dynamic IP) and static‑IP {#1.6-two-sip-stacks:-default-(dynamic-ip)-and-static‑ip}

Since mid‑2026 every SIP‑trunk phone number lives on one of two SIP stacks. Which one determines the hostname you point your trunk at, whether you can allowlist by IP, which transports are available, and whether codec transcoding is possible.

|  | Default stack | Static‑IP stack |
| :---- | :---- | :---- |
| Hostname | `sip.rtc.elevenlabs.io` (regional variants in 2.9) | `sip-static.rtc.elevenlabs.io` (regional variants in 2.9) |
| Signalling IPs | Dynamic — change with autoscaling; **cannot be allowlisted** | Fixed range **`199.88.252.0/24`** (the product UI shows this range once the stack is enabled for your workspace) |
| Media (RTP/SRTP) IPs | Dynamic media servers | Relayed through the platform's SBC / media relay, so media also egresses from the static range (UDP high ports) — confirm the exact port range with your ElevenLabs contact before finalising firewall rules |
| Transports | TCP 5060, TLS 5061 | TCP 5060, TLS 5061, **UDP 5060 (Alpha)** |
| Codec transcoding (G.729, AMR) | No — only natively supported codecs (G.711, G.722) | Yes — the media relay transcodes (feature‑gated, see 4.7) |
| How you get on it | Default for every workspace | Enabled per workspace by ElevenLabs for Enterprise plans (also during Enterprise trials); ask your account team or support. Existing numbers then show a **"SIP servers with static IPs" → Migrate** card in Phone Settings; new numbers are created on it directly |

**Migration is a cut‑over, not a dual‑run, and it is not reversible from the dashboard.** After you click **Migrate**, the number stops answering on `sip.rtc.…` and works only on `sip-static.rtc.…` — update the SIP server URI at your carrier/SBC first, or in the same maintenance window. The UI recommends migrating during low traffic.

## 2\. SIP Primer {#2.-sip-primer}

The minimum mental model needed to read the rest of this document. Skip if you've worked with SIP before.

### 2.1 Signalling vs media — two planes {#2.1-signalling-vs-media-—-two-planes}

**SIP itself carries no audio.** It is a *signalling* protocol that negotiates who is calling whom, what codecs both sides can speak, and where to send the audio. Once SIP has set the call up, voice flows over a separate protocol — **RTP** (unencrypted) or **SRTP** (encrypted).

A call can show "connected" in your SIP logs (200 OK exchanged) while still having silent audio: signalling succeeded, media did not. They fail and recover independently.

### 2.2 Dialogs, transactions, and correlation {#2.2-dialogs,-transactions,-and-correlation}

* **Transaction** — a single request and its responses (e.g. INVITE → 100 → 180 → 200).  
* **Dialog** — a long‑lived peer relationship, identified by `Call-ID` plus `From`/`To` tags. INVITE creates it; BYE ends it.  
* **Session** — the actual media stream, described in SDP carried inside SIP messages.

When debugging, correlate every message by `Call-ID` (which call) and order them by `CSeq` (when). The `branch` parameter on `Via` headers identifies individual transactions.

### 2.3 The lifecycle of a typical call {#2.3-the-lifecycle-of-a-typical-call}

`Caller (UAC)                              Callee (UAS)`  
    `│ ─────────── INVITE (with SDP) ─────────► │  "I want to call you, here's what I can speak"`  
    `│ ◄────────── 100 Trying ────────────────  │  "got it, working on it"`  
    `│ ◄────────── 180 Ringing ───────────────  │  (optional) "phone is ringing"`  
    `│ ◄────────── 200 OK (with SDP) ─────────  │  "answered, here's what I'll speak back"`  
    `│ ─────────── ACK ─────────────────────►   │  "confirmed, opening media"`  
    `│ ═══════════ RTP audio ════════════════   │  ←── voice flows here ──→`  
    `│ ─────────── BYE ─────────────────────►   │  "I'm hanging up"`  
    `│ ◄────────── 200 OK ────────────────────  │  "acknowledged"`

Status code families:

| Range | Meaning | Examples |
| :---- | :---- | :---- |
| 1xx | Provisional / progress | `100 Trying`, `180 Ringing`, `183 Session Progress` |
| 2xx | Success | `200 OK`, `202 Accepted` |
| 3xx | Redirection | `302 Moved Temporarily` |
| 4xx | Client error | `403 Forbidden`, `404 Not Found`, `481 Call doesn't exist`, `488 Not Acceptable Here` |
| 5xx | Server error | `500 Server Internal Error`, `503 Service Unavailable` |
| 6xx | Global failure | `603 Decline` |

### 2.4 SDP and codec negotiation {#2.4-sdp-and-codec-negotiation}

Every INVITE carries an **SDP offer** describing what media the caller can send/receive. The 200 OK carries the **SDP answer** (RFC 3264 offer/answer model). Mismatches here cause "call connects, audio is silent" — see Section 5.2.

`m=audio 30000 RTP/AVP 0 8 101         ← offering G.711 μ-law (0), G.711 A-law (8), DTMF (101)`  
`a=rtpmap:0 PCMU/8000`  
`a=rtpmap:8 PCMA/8000`  
`a=rtpmap:101 telephone-event/8000`  
`c=IN IP4 203.0.113.10                 ← send my audio to this IP`

### 2.5 Proxies, SBCs, and the path of a request {#2.5-proxies,-sbcs,-and-the-path-of-a-request}

Real‑world SIP rarely flows endpoint‑to‑endpoint. In between sit **proxies** (route messages without changing them), **B2BUAs / SBCs** (act as both endpoints, often rewriting headers and SDP), and **registrars** (track endpoint locations).

Each hop adds a `Via` header on the way out and consumes one on the way back; this is how responses find their way home. Each hop should preserve `Call-ID`, `From`/`To` tags, and `CSeq` end‑to‑end.

The most common debugging tripwire involves the `Contact` header an SBC inserts in its 200 OK: it must contain the SBC's **publicly reachable** address, otherwise the platform cannot route in‑dialog messages back. See Section 4.8.

### 2.6 SIP transports — UDP, TCP, TLS {#2.6-sip-transports-—-udp,-tcp,-tls}

| Transport | Port | Security | When to use |
| :---- | :---- | :---- | :---- |
| **UDP** | 5060 | None | **Static‑IP stack only, Alpha.** Legacy interop. Large SDP may exceed MTU and fragment; inbound IP allowlists are **not** enforced on UDP (Section 6.2). |
| **TCP** | 5060 | None | **Recommended default.** Stable, full‑message delivery, no fragmentation. |
| **TLS** | 5061 | Encrypted | Recommended when signalling must be encrypted in transit. Strict certificate rules — read Section 4.10 and mind Section 15\. |

Outbound trunks additionally accept **`auto`**, letting the platform choose from the termination URI; prefer an explicit transport in production so behaviour is predictable.

Signalling transport is independent of media encryption: SIP over TCP can use SRTP, and SIP over TLS can use plain RTP.

### 2.7 Inbound vs outbound SIP — which side initiates? {#2.7-inbound-vs-outbound-sip-—-which-side-initiates?}

Direction of the **initial INVITE** from the platform's perspective:

* **Inbound** — your side sends the INVITE *to the platform* (real caller dials a number on your trunk).  
* **Outbound** — the platform sends the INVITE *to your side* (agent originates the call).

Each direction has its own configuration on the phone number record:

* **Inbound trunk** — what the platform will accept from your side: which IPs, which originating numbers, which auth credentials, what media‑encryption posture.  
* **Outbound trunk** — where the platform will send INVITEs: the **termination URI**, credentials, transport, custom headers.

A single phone number can have both, only one, or neither. Production setups commonly have both: inbound for live traffic, outbound for callbacks/outreach/warm transfers.

### 2.8 Termination URI {#2.8-termination-uri}

The SIP address the platform sends outbound INVITEs to. Configured as part of the outbound trunk:

`sip:sbc.example.com:5060;transport=tcp        ← FQDN, recommended`  
`sip:203.0.113.10:5060;transport=tcp           ← raw IP, works but no TLS-by-hostname`  
`sips:sbc.example.com:5061                     ← TLS variant`

The platform builds an INVITE addressed to `sip:<phone_number>@<termination URI host>`. **Best practice:** use FQDNs so certificates can be validated by hostname and you can move IPs without reconfiguring.

### 2.9 The platform's SIP endpoints {#2.9-the-platform's-sip-endpoints}

There is one SIP front door per **region** and per **stack**. Pick the hostname that matches (a) the data‑residency region of the workspace and (b) the stack the number is on (Section 1.6):

| Workspace region | Default stack (dynamic IPs) | Static‑IP stack (`199.88.252.0/24`) |
| :---- | :---- | :---- |
| Global / US | `sip.rtc.elevenlabs.io` | `sip-static.rtc.elevenlabs.io` |
| EU data residency | `sip.rtc.eu.residency.elevenlabs.io` | `sip-static.rtc.eu.residency.elevenlabs.io` |
| India data residency | `sip.rtc.in.residency.elevenlabs.io` | `sip-static.rtc.in.residency.elevenlabs.io` |
| Singapore data residency | `sip.rtc.sg.residency.elevenlabs.io` | `sip-static.rtc.sg.residency.elevenlabs.io` |

All listen on **5060 (TCP)** and **5061 (TLS)**; the static‑IP hosts additionally accept **UDP 5060 (Alpha)**. The Phone Settings page of each number shows the exact URIs valid for *that* number — copy from there rather than from memory.

Practical notes:

* **DNS NAPTR and SRV records are published** for every host (verified Oct 2026). NAPTR prefers TLS (`SIPS+D2T`, port 5061), then TCP (`SIP+D2T`, 5060), then UDP (`SIP+D2U`, 5060), and `_sips._tcp` / `_sip._tcp` / `_sip._udp` SRV records point back at the same hostname. An RFC 3263 resolver given the bare domain will therefore try **TLS first**: either make sure its trust store accepts the platform certificate (Section 4.10) or configure an explicit `host:port;transport=…` to pin TCP. Explicit host, port and transport remains the recommended configuration because it is predictable.  
* The TLS certificate on each host carries **only that exact hostname** in its SAN (no wildcard, no IP SAN). An SBC pointed at the static host must validate against `sip-static.rtc.…`, not `sip.rtc.…`, and must send SNI.  
* A workspace on EU/IN/SG residency **must** use the residency hostname; the global hostname cannot see its numbers.  
* The hostname resolves to a load balancer that accepts the initial INVITE; once matched, the dialog is owned by a specific SIP server for the rest of its lifetime (firewall consequences in Section 4.4).

The user part of the SIP URI **must be exactly the identifier the number was imported with**, normally the E.164 phone number (a SIP-trunk import also accepts a plain string identifier such as `1000`), so the platform can resolve the right agent:

`sip:+10000000000@sip.rtc.elevenlabs.io:5060;transport=tcp`  
    `└────────┬───┘ └─────────┬─────────┘ └──┬─┘ └──────┬─────┘`  
       `phone number      SIP host         port       transport`

## 3\. Glossary {#3.-glossary}

Platform‑specific and vendor terms. For general SIP terms (INVITE, BYE, CSeq, SDP, NAT, etc.), see Section 2\.

| Term | Definition |
| :---- | :---- |
| **3CX** | A widely deployed SMB/mid‑market IP PBX. Integrates over a standard SIP trunk — see Section 7.1. |
| **ACL (Access Control List)** | IP‑based allowlist used to restrict which sources can interact with a SIP trunk. Supported on inbound and outbound trunks. |
| **Allowed originating numbers** | Optional inbound‑trunk filter. Only calls whose `From` number matches the list will be accepted. |
| **Amazon Connect** | AWS contact-center platform. Since Sep 2026 a **native voice transport** (limited availability): Connect streams the contact to the agent over its external AI-agent (A2A) interface, authenticated with an ElevenLabs API key; human escalation hands the contact back to the flow's Escalate branch through a transfer rule. See 7.3. |
| **Answering machine detection (AMD)** | Carrier-side detection of voicemail or fax on an outbound call. Available on **Twilio outbound calls** as an opt-in per call (`telephony_call_config.twilio_machine_detection`), with an optional automatic hang-up per verdict; verdicts arrive as an `answering_machine_detection` webhook event. Independent of the LLM-driven voicemail-detection tool. See 5.5.7. |
| **Asterisk / FreePBX** | Open‑source PBX software (FreePBX is a UI on top of Asterisk). Integrates over a standard SIP trunk. |
| **AudioCodes** | A common SBC vendor. Integrates over a standard SIP trunk. Separately, **AudioCodes VoiceAI Connect** can stream call audio to the agent over its own WebSocket transport (API-key authenticated; limited availability, enabled per workspace). Audio is 16 kHz PCM; keypad input and in-call transfers are not available on that channel yet. See 7.3. |
| **AudioHook** | Genesys Cloud's WebSocket-based real-time audio protocol. **Natively supported**: the Genesys AudioHook integration streams the live call to the agent with no SIP trunk (API-key authenticated). Caller DTMF over AudioHook is delivered since Aug 2026\. Transfer-to-number is not available on it; hand the call back to the Architect flow instead. See 7.3. |
| **Avaya** | A common enterprise PBX vendor. On-prem Avaya Aura / CM integrates via SIP trunks. **Avaya Infinity** has a native WebSocket transport (early access since Sep 2026): 8 kHz μ-law, caller keypad input supported, no in-call transfer. See 7.3. |
| **Blind transfer** | A "cold" transfer where the caller is handed off immediately, with no consultation between the AI agent and the receiving party. |
| **Carrier / DID Provider** | The telecommunications operator that owns the phone number range and connects calls to your SBC/PBX. |
| **Call screening (`require_acceptance`)** | Option on warm (conference) transfers where the human receiver must press a key before the caller is bridged: on **Twilio** press 1 to hear the briefing and 9 to connect; on the **SIP warm transfer** press 1 to hear the briefing and 2 to connect. Limited availability on both. Mutually exclusive with post-dial digits. See 8.1.1. |
| **CCaaS** | Contact Center as a Service. Cloud contact center platforms (Genesys, Zendesk, Amazon Connect) that ElevenLabs integrates with for enterprise deployments. |
| **Cold transfer** / **Warm transfer** | See "Blind transfer" / "Conference transfer". |
| **Codec transcoding** | Converting between codecs in the media path. Available only on the static‑IP stack, where the media relay can transcode G.729 and AMR to what the agent consumes (feature‑gated). The default stack negotiates natively supported codecs only. See 4.7. |
| **Conference transfer** | A "warm" transfer where the AI agent bridges the destination into a conference, optionally introduces context, and drops out. |
| **Contact header** | The SIP header advertising where in‑dialog requests should be sent. **Must contain your externally reachable address** so the platform can route BYE, REFER, and NOTIFY back. |
| **Conversation ID** | ElevenLabs' unique identifier for a single agent conversation session. Always include when raising a support request. |
| **Custom SIP headers (X‑headers)** | Application‑specific headers (typically prefixed `X-`) used to pass business context. The platform supports up to **20 custom headers** per outbound or transfer INVITE, with both static values and values resolved from agent dynamic variables at runtime. |
| **DID (Direct Inward Dialing)** | A phone number that routes directly to a specific endpoint without going through a switchboard. |
| **Digest Authentication** | Challenge‑response authentication for SIP. Recommended for outbound trunk security. |
| **DTMF** | Dual‑Tone Multi‑Frequency keypad tones. The platform supports **DTMF input from the caller** (RFC 4733 out‑of‑band only; GA since Aug 2026, with optional redaction), **DTMF emission mid‑call** (via a dedicated tool the agent can call) and **post‑dial DTMF on transfer** (via the transfer‑to‑number tool). See Sections 5.4 and 8.7. |
| **Dynamic variables** | Workspace‑ or session‑scoped values (e.g. `caller_name`, `account_id`) that can be substituted into prompts, tools, transfer destinations, and SIP header values at runtime. |
| **E.164** | International phone number format: `+` followed by country code and subscriber number. Example: `+14155550100`. |
| **Exotel** | Indian CPaaS provider (Mumbai and Singapore clusters) supported as a third managed phone-number provider since May 2026, alongside Twilio and SIP trunk. Inbound/outbound, batch calling, transfers (through a chained Connect applet) with a whispered briefing, DTMF emission. Number ownership is verified against the Exotel account at import since Oct 2026\. See 7.3. |
| **ElevenLabs AI Agent** | The conversational AI configured in your workspace that handles the call once a SIP session is established. |
| **Genesys** | A leading CCaaS vendor with three integration paths: (1) **AudioHook** native voice transport, (2) the **transfer‑to‑Genesys‑bot** system tool / workflow node that hands an AudioHook call back to a Genesys flow with output variables, (3) chat takeover/handoff via webhook. Over a SIP trunk (BYOC) it behaves like any SBC and consumes UUI. See 7.3. |
| **G.722** | Wideband (16 kHz audio, 8000 RTP clock) telephony codec. Offered by default on outbound trunks since Jun 2026 and the best‑quality option over SIP when the peer supports it. |
| **Handoff** | Transferring an in‑progress conversation to a human agent or another system, with conversation context preserved. |
| **Hold music** | Audio played to the caller while waiting (typically during a transfer). Conference transfers in Twilio use Twilio's hosted hold music by default. |
| **IVR** | Interactive Voice Response. The agent can both **respond to** an IVR (by emitting DTMF) and **act as** an IVR replacement. |
| **Media encryption** | Use of SRTP to encrypt RTP audio. Three modes: **DISABLED**, **ALLOWED** (negotiate if peer offers), **REQUIRED** (refuse unencrypted media). |
| **Media plane** | The layer carrying RTP/SRTP audio packets, separate from SIP signalling. |
| **mTLS** | Mutual TLS — both parties present certificates. **Not supported on SIP trunking**: platform TLS is one‑way (server‑authenticated) in both directions; there is no way to upload a client certificate or to require one from the peer. See 4.10. |
| **PBX** | Private Branch Exchange. Common examples: Asterisk, FreePBX, Cisco CUCM, Avaya. |
| **PCM** | Pulse Code Modulation. Linear digital audio. Supported at multiple sample rates (8k, 16k, 22.05k, 24k, 44.1k, 48k); the agent's TTS output format is configurable. |
| **PCMA / PCMU (G.711)** | A‑law (PCMA) and μ‑law (PCMU) telephony codecs at 8 kHz. The most universally supported voice codecs in PSTN gateways. |
| **Phone call result (`call_result`)** | Field on the conversation's phone-call metadata (Oct 2026): `answered`, `voicemail` (set by the voicemail-detection tool), `busy`, `no_answer` or `failed`; for `failed` outbound dials the SIP status code is stored as the conversation error code. See 6.5. |
| **PSTN** | Public Switched Telephone Network. SIP trunks bridge VoIP systems to PSTN endpoints. |
| **REGISTER** | SIP method for endpoint registration. **The platform uses trunking mode only** — REGISTER is neither expected nor supported. |
| **Remote domains** | Per‑inbound‑trunk list of FQDNs used to **validate your TLS certificate** when the platform must open a *new* TLS connection back to your SBC for in‑dialog requests (BYE, REFER). SIP routes by IP, so without this list the platform validates against the bare IP and fails with the IP‑SAN error (Section 11). Set it to the FQDN(s) present in your certificate's SAN. It is **not** an admission/allowlist control. |
| **SAN (Subject Alternative Name)** | An x.509 certificate field listing valid hostnames or IPs. Missing or incorrect SANs cause TLS handshake failures. |
| **SBC (Session Border Controller)** | A specialised SIP firewall at the edge of your network. Common SBCs: AudioCodes, Ribbon, Oracle, Sangoma, and open‑source options like Kamailio. |
| **SIP Edge / load balancer** | The publicly reachable hostnames (`sip.rtc.…` / `sip-static.rtc.…`, regional variants in 2.9) where initial INVITEs are received. *On the default stack, in‑dialog messages do not flow through this hostname.* |
| **SIP INFO** | In‑dialog SIP method sometimes used to carry DTMF (`application/dtmf-relay`). **Not supported** for caller DTMF — the platform decodes RFC 4733 `telephone-event` only. |
| **SIP REFER flow** | The native SIP call transfer mechanism. The agent sends a REFER to your SIP server; your server executes the transfer and confirms the outcome via NOTIFY. |
| **SIP warm transfer** | Conference transfer on a SIP trunk where the platform dials the human on a separate consult leg, speaks the agent's briefing in the agent's own voice (optionally gated by a keypress), and only then bridges them to the caller. Limited availability since Oct 2026; where not enabled, the rule runs as a cold conference transfer. See 8.5. |
| **SIP Trunk** | A virtual connection between a VoIP provider and a PBX/telephony system using SIP. Replaces traditional PRI/BRI lines. |
| **SIP URI** | A SIP address: `sip:user@domain:port;parameters`. The user part **must include the phone number**. Example: `sip:+10000000000@sip.rtc.elevenlabs.io:5060;transport=tcp`. |
| **SNI (Server Name Indication)** | TLS extension allowing a client to specify the hostname it is connecting to. Required for valid certificate selection on shared TLS endpoints. |
| **SRTP** | Secure RTP. Encrypted media transport. |
| **Static IP range** | The fixed range `199.88.252.0/24` used for platform signalling (and relayed media) on the **static-IP SIP stack** (`sip-static.rtc.…`). Enabled per workspace by ElevenLabs for Enterprise plans (also during Enterprise trials); numbers are then moved with a one-click **Migrate** in Phone Settings. Same range in every region. See 1.6 and 4.4. |
| **Static‑IP SIP stack** | The SIP deployment fronted by an SBC / media relay with fixed IPs (`sip-static.rtc.…`). Adds UDP (Alpha), codec transcoding and allowlistable signalling \+ media. Numbers are migrated to it per workspace. See 1.6. |
| **Stream (Twilio)** | A TwiML verb that opens a WebSocket from Twilio's media plane to the platform, carrying μ‑law audio in JSON frames. |
| **`system__call_id`** | System dynamic variable holding the SIP `Call-ID` of the call's INVITE (SIP trunks; Aug 2026). Also delivered to the conversation‑initiation webhook. Use it to correlate conversations with SBC/carrier CDRs. See 6.5. |
| **Takeover** | The pattern where a conversation handed off from the AI agent continues with a human agent in a different system (e.g. Genesys), with messages shuttling between the two. |
| **Transfer rules (per-provider)** | Newer shape of the transfer-to-number tool (Sep 2026): each rule is a condition plus one configuration per telephony provider (Twilio, SIP trunk, Exotel, Amazon Connect), so the same agent transfers correctly whichever channel the call arrived on. Older per-number transfer lists keep working. See 8.1. |
| **Trunking mode** | SIP operation mode where calls are placed directly without a prior REGISTER exchange. **The only mode supported by the platform.** |
| **Wait queue (call queueing)** | Per-agent setting that holds callers with hold audio when the agent is at its concurrency limit instead of rejecting them. Generally available since Sep 2026 and on by default for agents created from Oct 2026\. See 6.6. |
| **TwiML** | Twilio Markup Language — XML response format Twilio uses to control call behaviour. The platform issues TwiML containing a `<Connect><Stream/></Connect>` to bridge audio. |
| **UUI (User‑to‑User Information)** | RFC 7433 mechanism for carrying an opaque, hex-encoded payload across a transfer in the `User-to-User` header / `Refer-To` parameter. Supported on SIP REFER transfers **to SIP URI destinations** since Jun 2026 (up to 8192 bytes, optional protocol discriminator; dropped when the destination is a phone number) and decoded on inbound INVITEs into `sip_uui_data`. Consumed natively by Genesys Cloud, Talkdesk, Avaya. See 4.9. |
| **WebRTC** | Browser‑native protocol for real‑time audio and video. Used for web‑based agent interactions alongside SIP for telephony. |
| **Workspace** | A platform organisational unit containing agents, phone numbers, API keys, secrets, and usage settings. |
| **X‑Conversation‑ID / X‑Caller‑ID** | Custom headers automatically injected by the platform on transfer INVITEs sent via SIP REFER, to propagate context to the receiving system. |

## 4\. Best Practices & Implementation Guide {#4.-best-practices-&-implementation-guide}

### 4.1 SIP URI format {#4.1-sip-uri-format}

Always use a fully‑qualified SIP URI that includes the phone number as the user part:

`✅ Correct:   sip:+10000000000@sip.rtc.elevenlabs.io:5060;transport=tcp`  
`❌ Incorrect: sip@sip.rtc.elevenlabs.io:5060`

Without the phone number, the platform cannot map the call and it will fail silently.

### 4.2 Phone number format consistency {#4.2-phone-number-format-consistency}

The format used in the SIP URI **must exactly match** the format used when the number was imported:

* Imported **with** leading `+` → URI must use `sip:+10000000000@...`  
* Imported **without** leading `+` → URI must use `sip:10000000000@...`

The platform applies a `+` fallback during lookup, but relying on it is fragile. A mismatch is one of the most common causes of outbound call failures — if scheduled/batch calls succeed but real‑time agent calls fail, check this first.

### 4.3 Transport protocol {#4.3-transport-protocol}

* **TCP on port 5060** is the recommended default — most stable and fully supported.  
* **TLS on port 5061** is supported and recommended when signalling must be encrypted. Certificate rules are strict — read 4.10 before going live on TLS. The inbound‑termination limitation in Section 15 still applies.  
* **UDP** is available **only on the static‑IP stack** (Section 1.6) and is marked Alpha. Two extra caveats: rich SDP can exceed MTU and fragment, and **inbound IP allowlists (`allowed_addresses`) are not enforced on UDP** — use digest authentication and/or `allowed_numbers` instead.  
* Outbound trunks additionally accept `auto`; prefer an explicit transport in production.

### 4.4 IP whitelisting {#4.4-ip-whitelisting}

| Message type | Default stack | Static‑IP stack |
| :---- | :---- | :---- |
| Initial inbound INVITE (your side → platform) | Send to `sip.rtc.…`; any source IP is accepted subject to trunk policy | Send to `sip-static.rtc.…` |
| Platform‑originated signalling (outbound INVITE, BYE, REFER, NOTIFY) | From **dynamic** IPs — the specific server that owns the call, **not** the load‑balancer address. Cannot be reliably allowlisted | From the fixed range **`199.88.252.0/24`** |
| RTP / SRTP media | Dynamic media‑server IPs | Also from `199.88.252.0/24` (media is relayed) — UDP high‑port range (the public guide quotes 10000–60000); confirm exact ports with your ElevenLabs contact |

**Critical (default stack):** allowing only the address `sip.rtc.…` resolves to means you receive the initial INVITE but **not** BYE, REFER, or NOTIFY. This is the single most common misconfiguration causing calls to hang or transfers to fail. On the default stack there is no way to enumerate the platform's IPs — rely on digest authentication and `allowed_numbers`, not on IP rules.

**If your security policy requires IP‑based rules**, the static‑IP stack is the only reliable answer:

1. Ask your ElevenLabs contact to enable the static‑IP stack on the workspace (Enterprise plans, including Enterprise trials).  
2. Each existing number then shows a **"SIP servers with static IPs"** card in Phone Settings with a **Migrate** button (new numbers are created on the static stack automatically).  
3. Repoint your carrier/SBC at `sip-static.rtc.…` — after migration the number no longer works on `sip.rtc.…`.  
4. Allowlist `199.88.252.0/24` for signalling on TCP 5060 / TLS 5061 (UDP 5060 if you use the Alpha UDP path), and for media if you also restrict RTP.

The range is the same across regions; the regional `sip-static.rtc.<region>.residency.elevenlabs.io` hosts resolve into it.

### 4.5 No REGISTER requests {#4.5-no-register-requests}

The platform operates in **trunking mode only**. Do not configure your SIP stack to send REGISTER requests.

### 4.6 Outbound trunk security {#4.6-outbound-trunk-security}

| Method | Notes |
| :---- | :---- |
| **Digest authentication** | Username/password challenge‑response. Recommended. Credentials are stored as workspace secrets and never returned by the API. |
| **ACL (IP allowlist)** | Supports CIDR notation. Limited protection if the termination URI is publicly discoverable. On inbound trunks the allowlist is enforced only for TCP/TLS, **not UDP**. |

You can additionally restrict accepted callers via `allowed_originating_numbers`, and require media encryption (`media_encryption: REQUIRED`) to ensure SRTP.

### 4.7 Audio codec — what to negotiate {#4.7-audio-codec-—-what-to-negotiate}

The platform negotiates standard telephony codecs on SIP; internally the agent runs at up to 48 kHz PCM and resamples to whatever is negotiated.

| Codec (SDP name) | Bandwidth | Availability |
| :---- | :---- | :---- |
| **G722/8000** (G.722, 16 kHz audio, 8000 RTP clock) | Wideband | Always; offered by default. **Best quality over SIP** — prefer it when your carrier/PBX supports it |
| **PCMU/8000** (G.711 μ‑law) | Narrowband 8 kHz | Always; offered by default |
| **PCMA/8000** (G.711 A‑law) | Narrowband 8 kHz | Always; offered by default |
| **G729/8000** | Narrowband, compressed | On request; requires the static‑IP stack (transcoded by the media relay) |
| **AMR/8000**, **AMR‑WB/16000** | Mobile codecs | On request; AMR is transcoded on the static‑IP stack, AMR‑WB is handled natively |
| **telephone‑event/8000** | DTMF (RFC 4733\) | Always offered |

* **Outbound trunk → `enabled_codecs`.** Choose which codecs the platform offers in its SDP for outbound calls and SIP‑trunk Conference transfer legs, and in which order. Default: PCMU, PCMA, G.722 (in that order); at least one is required. The list order is the SDP preference order, so put G.722 first if you want wideband preferred. Trim the list when a downstream PBX misbehaves on codecs it does not expect (some legacy gateways answer 488 or go silent when G.722 is offered). Opus is not offered on SIP; `telephone-event` is always appended.  
* **Inbound calls.** The platform answers with a mutually supported codec from your offer. Put G.722 first if you want wideband.  
* If the SBC and platform offer disjoint codec sets, negotiation fails (488) or audio is silent despite a successful handshake. Always inspect SDP bodies if you experience silent audio — see Section 5\.

### 4.8 Contact and Via header configuration {#4.8-contact-and-via-header-configuration}

For BYE, REFER, and NOTIFY to reach your SIP server:

* The `Contact` header in your 200 OK must contain your **externally reachable address** — not an internal or NAT address.  
* The first `Via` header must likewise reflect your external address.

Internal addresses here are the second most common misconfiguration after firewall scoping.

In the other direction, the platform's own `Contact` on a TLS dialog is a per-server hostname (`<ip>.hosts.rtc.elevenlabs.io`, covered by a wildcard certificate for `*.hosts.rtc.elevenlabs.io`); on TCP it is the bare IP of that server. Your SBC must be able to route in-dialog requests to that address, which is why allowing only the load-balancer address breaks BYE and REFER (Section 4.4), and why an SBC that validates the return path on TLS needs that wildcard name in its trust logic (Section 11).

### 4.9 Custom SIP headers (X‑headers), UUI and BYE headers {#4.9-custom-sip-headers-(x‑headers),-uui-and-bye-headers}

You can attach **up to 20 custom headers** per transfer rule (and static headers per outbound trunk). Constraints:

* **Name:** alphanumeric and hyphens only, max 64 characters. Convention: prefix with `X-`.  
* **Value:** printable ASCII only (no control characters), max 512 characters.  
* Values may be **static** or sourced from **agent dynamic variables** resolved at runtime.

The platform automatically injects on transfer INVITEs sent via SIP REFER (and on the second leg of a SIP‑trunk Conference transfer):

* `X-Conversation-ID` — the platform's conversation ID  
* `X-Caller-ID` — the originating caller's number

These two are **platform‑owned**: a per‑rule custom header with the same name (case‑insensitive) is dropped, not merged — you cannot override them.

Three further header mechanisms exist:

* **UUI (User‑to‑User Information, RFC 7433\) on SIP REFER to a SIP URI** — a `User-to-User` parameter on the `Refer-To` URI carrying an opaque, **hex‑encoded** payload (only when the destination is a `sip:`/`sips:` URI; it is dropped silently for phone-number destinations) (up to 8192 bytes before encoding; supports `{{dynamic_variables}}` inline). Optional one‑octet **protocol discriminator**, attachable as a prefix (`User-to-User=00<hex>;encoding=hex` — the form Genesys Cloud expects, which otherwise strips the first octet) or as a parameter (`…;pd=00;encoding=hex`). Leave the discriminator unset for platforms like Talkdesk that expect a bare hex payload. Configured per transfer rule under **UUI** in the phone‑transfer tool (Jun–Aug 2026). Inbound, a `User-to-User` header on the INVITE is decoded for you into the dynamic variables `sip_uui_data` (decoded) and `sip_uui_raw`.  
* **Static trunk headers** — `headers` on the outbound trunk are added verbatim to every outbound INVITE, including SIP‑trunk Conference legs.  
* **Dynamic‑variable headers on BYE (`attributes_to_headers`)** — on either trunk, a map of *dynamic variable name → SIP header name*. At hangup the current values of those variables are attached as headers on the platform's **BYE**, so your PBX/CRM receives end‑of‑call context (outcome, ticket ID, disposition) inside the SIP dialog without a webhook (May 2026).

**Inbound headers become variables.** Custom `X-*` headers on an inbound INVITE are exposed to the agent as dynamic variables named `sip_` \+ the header name lower‑cased with `X-` stripped and hyphens turned into underscores — `X-Account-ID` → `{{sip_account_id}}`. Use them in the prompt, in tools, or to pick a starting workflow node via the conversation‑initiation webhook.

**Resolution timing.** Dynamic variables referenced by transfer headers, UUI and destinations are resolved **at the moment the transfer executes**, not when the tool is loaded — values written by tools earlier in the same call are picked up (Aug 2026).

### 4.10 TLS certificate requirements {#4.10-tls-certificate-requirements}

Applies to the certificate **your** SIP server / SBC presents. The platform validates it whenever it acts as TLS client — every outbound INVITE over TLS, and every in‑dialog request (BYE, REFER) it has to send back to you on a TLS trunk.

| Requirement | Detail |
| :---- | :---- |
| **Publicly trusted chain** | The chain must terminate in a public root CA (Let's Encrypt, DigiCert, GlobalSign, …). **Self‑signed and private/enterprise‑CA certificates are rejected** — there is no upload or pinning knob. |
| **Send the full chain** | Leaf **and** intermediates in the handshake. Leaf‑only → `x509: certificate signed by unknown authority`. This is the most common real‑world TLS failure. |
| **FQDN in a SAN** | The hostname must be in the Subject Alternative Name extension (CN‑only is ignored). Then list that FQDN under **Remote domains** on the inbound trunk so in‑dialog requests can validate it (Section 11). |
| **Key & signature** | RSA 2048+ or ECDSA P‑256/P‑384; SHA‑256 (or SHA‑384) signature. SHA‑1 is rejected. |
| **Extended Key Usage** | `serverAuth` **required**. A `clientAuth`\-only certificate fails. Dual‑purpose is fine. |
| **Key Usage** | `digitalSignature` required; `keyEncipherment` is not needed (all negotiated suites are ECDHE). |
| **Protocol** | TLS 1.2 or 1.3. TLS 1.0/1.1 are refused in both directions. |
| **ALPN** | The platform offers ALPN `sip` by default. A very small number of SBCs reject unknown ALPN values — if yours does, raise it with ElevenLabs; there is no customer‑side toggle. |

What the **platform** presents to you (so you can prepare your SBC's trust store): a Let's Encrypt certificate chaining to **ISRG Root X1**, with the exact hostname as its only SAN, **no IP SAN**, and an **empty Subject (no CN)** — older SBCs that insist on a CN will choke. Validate by FQDN and send SNI.

**Not supported:** mutual TLS / customer client certificates in either direction. If a customer's policy mandates mTLS on SIP, treat it as a product gap and escalate — do not promise a workaround.

Fast pre‑flight from your SBC's network (both directions):

`# your certificate as the platform will see it`  
`openssl s_client -connect <your-sip-host>:5061 -servername <your-sip-fqdn> </dev/null 2>/dev/null | grep -E 'Verify return code|Protocol'`  
`# the platform's certificate as your SBC will see it`  
`openssl s_client -connect sip.rtc.elevenlabs.io:5061 -servername sip.rtc.elevenlabs.io </dev/null 2>/dev/null | grep -E 'Verify return code|Protocol'`  
`# expect: Verify return code: 0 (ok) and Protocol: TLSv1.2 or TLSv1.3 in both cases`

## 5\. Audio, Media, and Codec Handling {#5.-audio,-media,-and-codec-handling}

### 5.1 Supported sample rates and codecs {#5.1-supported-sample-rates-and-codecs}

| Format | Use case |
| :---- | :---- |
| G.722 (16 kHz wideband, `G722/8000`) | **Preferred over SIP when the peer supports it** — noticeably clearer speech than G.711 |
| PCMU (G.711 μ‑law, 8 kHz) | North American PSTN, most carriers |
| PCMA (G.711 A‑law, 8 kHz) | European PSTN, most carriers |
| G.729, AMR, AMR‑WB | Compressed / mobile codecs — feature‑gated; G.729 and AMR are transcoded on the static‑IP stack (4.7) |
| PCM 8 / 16 / 24 / 44.1 / 48 kHz | Non‑SIP transports (WebSocket, WebRTC). Twilio Media Streams use μ‑law 8 kHz |

Which codecs the platform **offers** on outbound SIP calls is configurable per outbound trunk (`enabled_codecs`, Section 4.7). The agent's TTS output format is separately configurable per agent; on SIP it is resampled to the negotiated codec, so configure the agent for 16 kHz or higher and let G.722 carry it where available.

### 5.2 SDP negotiation — what to look for {#5.2-sdp-negotiation-—-what-to-look-for}

A healthy SDP exchange shows one or more `m=audio` lines with codec, sample rate, and RTP payload type. Example:

`m=audio 30000 RTP/AVP 0 8 101`  
`a=rtpmap:0 PCMU/8000`  
`a=rtpmap:8 PCMA/8000`  
`a=rtpmap:101 telephone-event/8000`

Codec mismatch symptoms:

* Call connects (200 OK exchanged, ACK delivered, BYE only on hangup)  
* **No audio in either direction** for the entire call  
* No SIP errors

Capture both SDPs and confirm at least one codec in common.

### 5.3 SRTP / media encryption {#5.3-srtp-/-media-encryption}

Per trunk — inbound and outbound trunks each have their own `media_encryption`; default **ALLOWED**:

| Mode | Behaviour |
| :---- | :---- |
| **DISABLED** | RTP only. Will refuse SRTP offers. |
| **ALLOWED** (default) | Negotiates SRTP if peer offers it; falls back to RTP. |
| **REQUIRED** | Refuses to establish a session unless SRTP is negotiated. |

Symptom of mismatched expectations: 488 "Not Acceptable Here" or no media after 200 OK.

### 5.4 DTMF and IVR navigation {#5.4-dtmf-and-ivr-navigation}

Three distinct DTMF capabilities matter when designing an agent that interoperates with downstream IVRs.

#### 5.4.1 Transport {#5.4.1-transport}

* **RFC 2833 / RFC 4733** — DTMF carried as `telephone-event` RTP payload (typically PT 101 in SDP). **The only mechanism the platform accepts for caller‑entered DTMF on SIP trunks**; it is always offered in the platform's SDP.  
* **SIP INFO** (`application/dtmf-relay`) — **not supported**. Digits sent this way are ignored; configure your SBC/PBX to emit RFC 4733 instead.  
* **In‑band DTMF (audio tones)** — not decoded for caller input. (The platform *can* emit in‑band tones itself as a fallback — see 5.4.3.)  
* **Twilio** — digits arrive as Twilio Media Streams `dtmf` events.  
* **Genesys AudioHook** — DTMF events are consumed since Aug 2026 (they were dropped before).  
* **Amazon Connect and Avaya Infinity** — keypad digits collected on those platforms are delivered to the agent as DTMF input; **AudioCodes VoiceAI Connect** does not deliver them yet.

Negotiated at SDP time; nothing to configure as long as your SBC advertises `telephone-event`.

#### 5.4.2 Receiving DTMF from the caller (DTMF input) {#5.4.2-receiving-dtmf-from-the-caller-(dtmf-input)}

Generally available since Aug 2026 (previously behind a workspace flag). Enable **DTMF input** on the agent — it is off by default.

How it behaves:

* Digits are buffered per keypress burst. A burst ends after **`dtmf_input_timeout`** seconds without a new digit (0.5–10 s, default 2 s) or immediately when the caller presses **`#`** (`hash_terminator`, default on). Valid characters `0–9`, `*`, `#`, `A–D`; up to 50 per burst.  
* The completed burst is injected into the conversation as a **user turn** the LLM sees as `[DTMF input: 1234#]`. It is *not* a separate variable or event — the prompt must say what to do with keypad input ("If the user enters digits, treat them as the account number…"), and a tool (`update_state` or a server tool) must store them if they are needed later.  
* **`redact_input`** (Jul 2026\) replaces the caller's digits with a redaction marker in the transcript, conversation log and analysis — use it for PINs and card numbers. Digits the agent repeats back or passes to a tool are not affected, so pair it with a prompt instruction not to read sensitive digits aloud.  
* **Capture is during‑conversation only.** There is no pre‑conversation IVR "gather": the agent's first message has to ask for the input. If you need digits *before* the agent starts, collect them upstream (carrier IVR, Amazon Connect "Get customer input", Twilio `<Gather>`) and pass them in as SIP `X-*` headers or `conversation_initiation_client_data` dynamic variables.

#### 5.4.3 Emitting DTMF mid‑call (the play‑DTMF tool) {#5.4.3-emitting-dtmf-mid‑call-(the-play‑dtmf-tool)}

A system tool the agent uses to emit DTMF tones during an active call — what makes the agent able to **navigate downstream IVRs**.

* **Allowed characters:** digits `0`–`9`, `*`, `#`, `w` (0.5 s pause), and `W` (1.0 s pause). Anything else is rejected before transmission.  
* **Provider‑aware:** on Twilio calls, emitted via Twilio's API; on SIP trunk calls, RFC 4733 out‑of‑band by default with automatic fallback to in‑band audio if the trunk does not honour `telephone-event`.  
* **Driven by the LLM:** the agent decides *when* based on what it hears — not a pre‑recorded sequence.  
* **Useful with dynamic variables:** account numbers, PINs, extensions can be punched in dynamically per call.  
* **Telephony only:** the tool needs a phone leg the platform controls (SIP trunk, Twilio, Exotel). It is not available on the Genesys AudioHook, Amazon Connect, AudioCodes or Avaya transports, nor in the web widget.

Two configuration flags on the tool itself:

| Flag | Default | When to change it |
| :---- | :---- | :---- |
| `use_out_of_band_dtmf` | `true` | SIP trunks only — disable to force in‑band audio if your downstream PBX does not handle RFC 4733 cleanly. No effect on Twilio (always in‑band). |
| `suppress_turn_after_dtmf` | `false` | **Enable for any IVR where the menu speaks again after the keypress.** Otherwise the agent's TTS will talk over the next IVR prompt and the menu will time out or mis‑route the call. |

Combined with prompt and dynamic variables, this turns the agent into a fully autonomous IVR navigator.

#### 5.4.4 Post‑dial DTMF on transfer {#5.4.4-post‑dial-dtmf-on-transfer}

When transferring, the platform can append a DTMF sequence emitted automatically once the destination answers — typically used to enter an extension. See Section 8.7.

### 5.5 Voicemail detection {#5.5-voicemail-detection}

Detecting that an outbound call landed on a voicemail box, and either leaving a message or hanging up.

#### 5.5.1 Two detection mechanisms: LLM‑driven and carrier AMD {#5.5.1-two-detection-mechanisms:-llm‑driven-and-carrier-amd}

The default mechanism works on every provider and needs nothing beyond enabling the tool: the LLM listens to the transcribed audio and, on recognising voicemail-style content, calls a system tool that ends the call (5.5.2 to 5.5.6). Since Sep 2026 outbound **Twilio** calls can additionally request Twilio's carrier-level **answering machine detection (AMD)**, which runs in parallel and can hang up automatically on selected verdicts (5.5.7). SIP-trunk and Exotel calls rely on the LLM mechanism only.

Trade‑offs of the LLM mechanism to set partner expectations on:

* ✅ Language‑agnostic; identical behaviour across SIP trunks, Twilio and Exotel; no per‑carrier configuration  
* ✅ The wording that triggered the detection is captured verbatim on the conversation, so every classification is auditable; the conversation's `call_result` is set to `voicemail`  
* ⚠️ Slightly slower than carrier AMD — typically requires roughly one sentence of audio before the tool fires, so callees may hear a brief moment of silence before the agent reacts

#### 5.5.2 The voicemail‑detection tool {#5.5.2-the-voicemail‑detection-tool}

A system tool enabled per agent. The agent is instructed to call it on three classes of signal:

* **Automated greeting** — *"You have reached the voicemail of..."*  
* **Recording instructions** — *"Please leave a message after the beep / tone"*  
* **Generic unavailable** — *"The number you have dialed is not available"*

The tool requires the agent to quote the wording that triggered it. As soon as it fires, the conversation is terminated — no further turns occur after the current one completes.

#### 5.5.3 Two configurable behaviours {#5.5.3-two-configurable-behaviours}

Controlled by a single field, `voicemail_message`:

| `voicemail_message` | Behaviour |
| :---- | :---- |
| Empty | Hang up immediately on detection. |
| Set | Speak the message, then hang up. Supports dynamic variables (e.g. `{{system__time}}`, `{{system__call_duration_secs}}`, and any custom variables on the agent). |

Use empty for outbound campaigns that should retry later. Use a populated message to leave a templated callback. There is no per‑recipient message slot beyond what dynamic variables give you.

#### 5.5.4 Voicemail navigation vs voicemail detection {#5.5.4-voicemail-navigation-vs-voicemail-detection}

These are mutually exclusive use cases:

* **Detection** — recognise voicemail, optionally leave a fixed message, hang up. Enable the voicemail‑detection tool.  
* **Navigation** — actively interact with a voicemail system (e.g. press `*` to skip the greeting, wait for the beep, leave a long contextual message). **Disable** the voicemail‑detection tool and use the play‑DTMF tool plus prompt instructions instead — otherwise the agent will hang up the moment it recognises the greeting.

#### 5.5.5 Designing the agent prompt for outbound {#5.5.5-designing-the-agent-prompt-for-outbound}

Three reinforcements that materially improve detection quality:

* State the use case at the top of the prompt: *"This is an outbound call. The recipient may be unavailable and the call may be answered by voicemail."*  
* Tell the agent explicitly to call the voicemail‑detection tool on the signals above, and **not** to attempt conversation with a recorded greeting.  
* If a voicemail message is configured, keep it short and self‑contained (who, why, callback). Long messages get cut off by carrier voicemail length limits.

#### 5.5.6 Debugging {#5.5.6-debugging}

* A voicemail detection appears in the conversation transcript as a tool call with the quoted greeting as its reason — read this first; it tells you what the LLM heard.  
* If the agent talks to a voicemail box instead of detecting it: the prompt is not steering the LLM strongly enough toward the tool, or the greeting is unusual (e.g. silent, music‑only, very short). Strengthen the prompt with explicit examples.  
* If the agent hangs up on a live human: the prompt is over‑indexing on detection. Add a counter‑example to the prompt (*"Do not call voicemail‑detection if the other party is asking questions or replying conversationally."*).  
* If the configured voicemail message is cut off mid‑sentence: shorten it, or move the most important content (callback number) to the first sentence — many carriers cap recorded messages around 30–60 seconds.

#### 5.5.7 Twilio answering machine detection (carrier AMD) {#5.5.7-twilio-answering-machine-detection-(carrier-amd)}

Opt-in per outbound call through `telephony_call_config.twilio_machine_detection` on the Twilio outbound-call API, batch calling and outbound campaigns (also in the dashboard's outbound-call, batch and campaign forms). It is ignored on inbound calls and on non-Twilio numbers.

| Setting | Values | Notes |
| :---- | :---- | :---- |
| `mode` | `enable` (default) or `detect_message_end` | `enable` returns a verdict quickly: `human`, `machine_start`, `fax`, `unknown`. `detect_message_end` waits for the greeting to finish and returns `machine_end_beep`, `machine_end_silence` or `machine_end_other` (plus `human`, `fax`, `unknown`), which is what you want when a message should be left after the beep |
| `actions` | list of `{ "action": "hang_up", "answered_by": [verdicts] }` | Optional. The only action today is `hang_up`; verdicts without a rule leave the call running. A rule may not name a verdict the chosen mode never returns |

How it behaves:

* **Asynchronous.** The agent starts talking immediately and the verdict arrives during the call (with `detect_message_end`, possibly after a short call has already ended).  
* **Delivered as a webhook event**, `answering_machine_detection` (agent, conversation ID, call SID, `answered_by`, phone-call details), which must be enabled in the workspace or agent webhook settings. The verdict is not written into the conversation's `call_result`.  
* **Independent of the LLM tool.** Both can be on for the same call; with a `hang_up` rule on the `machine_*` verdicts the carrier signal usually fires first. The LLM tool is still what leaves a message and sets `call_result = voicemail`.  
* **Automatic hang-up relies on Twilio's signed callback**, so the number must have been imported with the Account Auth Token (Section 7.2); the webhook event is sent regardless.  
* Twilio bills AMD separately.

When to use which: carrier AMD for high-volume Twilio campaigns where a fast machine verdict saves agent minutes; the LLM tool everywhere else, and whenever you need the detected wording for audit or a spoken message left on the mailbox.

## 6\. Phone Numbers & Routing {#6.-phone-numbers-&-routing}

### 6.1 Importing a phone number {#6.1-importing-a-phone-number}

A phone number record stores:

* **Phone number** — canonical E.164 string (with or without `+` — pick one and be consistent)  
* **Label** — human‑readable name  
* **Provider** — `sip_trunk`, `twilio`, or `exotel`  
* **Provider config** — for SIP: inbound trunk \+ optional outbound trunk; for Twilio: Account SID \+ Auth Token, or API Key SID \+ Secret plus the Account Auth Token (+ optional regional config); for Exotel: account SID, API key/token, region host, applet (ownership verified at import)  
* **Assigned agent** — which AI agent answers inbound calls  
* **Environment and branch pins** (May 2026\) — a number can pin an agent **environment** (for environment‑variable resolution) and an agent **branch**, so a test number can run a staging branch of the same agent without a second agent  
* **`livekit_stack`** — `standard` or `static` (Section 1.6)  
* **`supports_inbound` / `supports_outbound`** — capability flags; the phone‑number list can be filtered on `supports_outbound` when picking a caller ID for outbound campaigns  
* **`store_sip_messages`** — whether to capture SIP signalling for debugging (Section 9). On by default for new SIP trunk numbers.

The paginated list endpoint `GET /v1/convai/v2/phone-numbers` (public since Sep 2026\) supports search, label / number / provider / agent filters, `supports_outbound` and sorting — relevant for workspaces with hundreds of DIDs.

### 6.2 Inbound trunk configuration {#6.2-inbound-trunk-configuration}

* **Phone number(s)** that should match  
* **Allowed addresses** (`allowed_addresses`) — source‑IP allowlist, CIDR supported; default `0.0.0.0/0` (any). **Enforced for TCP/TLS only, not UDP.**  
* **Allowed originating numbers** (`allowed_numbers`, optional) — restrict by `From`  
* **Authentication** — digest credentials (recommended) or ACL only  
* **Media encryption** — DISABLED / ALLOWED (default) / REQUIRED  
* **Remote domains** (`remote_domains`) — FQDN(s) present in your TLS certificate's SAN; required for BYE/REFER to succeed on TLS trunks (Sections 4.10 and 11). Not an allowlist.  
* **BYE headers** (`attributes_to_headers`) — dynamic variable → SIP header map attached to the platform's BYE (Section 4.9)

### 6.3 Outbound trunk configuration {#6.3-outbound-trunk-configuration}

* **Termination address** (`address`) — FQDN (preferred) or IP, with optional port  
* **Transport** — `tls` (dashboard default; the API defaults to `auto`), `tcp`, `udp`, or `auto`  
* **Credentials** — username/password for digest auth, or ACL only  
* **Media encryption** — DISABLED / ALLOWED (default) / REQUIRED  
* **Enabled codecs** (`enabled_codecs`) — codecs offered in the SDP; default G.722 \+ PCMU \+ PCMA (Section 4.7)  
* **Custom headers** (`headers`) — static X‑headers added to every outbound INVITE  
* **BYE headers** (`attributes_to_headers`) — as for inbound  
* **From-header domain** (on request) — the domain part of the `From` URI on outbound INVITEs can be pinned to a fixed platform SIP hostname for carriers that validate `From` against the call source. The user part is always the imported number; there is no per-call caller-ID, display-name, P-Asserted-Identity or Privacy header control.

### 6.4 Routing flow on inbound {#6.4-routing-flow-on-inbound}

`INVITE arrives at sip.rtc.elevenlabs.io`  
   `│`  
   `├─ Match destination phone number (To header user part)`  
   `│     ↓`  
   `│  Apply inbound-trunk policies (IP ACL, allowed originating numbers, auth)`  
   `│     ↓`  
   `│  Resolve assigned agent for the matched number`  
   `│     ↓`  
   `│  Open conversation, attach SIP context (caller ID, headers as variables)`  
   `│     ↓`  
   `│  Begin audio bridge with the AI agent`

If the number matches but the call cannot be served, the platform now rejects it **at SIP level** (Oct 2026\) instead of answering and immediately hanging up: `404` when no agent is assigned to the number, `403` when the assigned agent is unavailable, `502` when your conversation-initiation webhook failed or timed out, `503` for transient platform errors; the reason phrase carries a short explanation. Concurrency and daily-limit checks still run after the call is answered, so an over-limit caller is connected and then disconnected (or queued, Section 6.6). If the destination number itself cannot be matched, you may still see no final response after the initial `100 Trying` — see Section 11\.

### 6.5 Telephony context available to the agent and to webhooks {#6.5-telephony-context-available-to-the-agent-and-to-webhooks}

Every telephony call seeds these system dynamic variables. They are usable in prompts, tools and transfer headers, and are forwarded to the **conversation‑initiation (personalization) webhook** so your backend can look the caller up before the first turn:

| Variable | Value |
| :---- | :---- |
| `system__caller_id` | Calling number (E.164) |
| `system__called_number` | Dialled number (E.164) |
| `system__call_sid` | Provider call identifier (Twilio CallSid / Exotel) |
| `system__call_id` | **SIP `Call-ID` of the INVITE** (SIP trunks; Aug 2026). Correlates a conversation with your SBC/carrier CDRs and packet captures without needing SIP message logging. On Amazon Connect it holds the contact ID |
| `system__channel` | Initiation source — `sip_trunk`, `twilio`, `exotel`, `genesys`, `audiocodes`, `avaya`, `amazon_connect`, … |
| `system__conversation_id` | The platform conversation ID (also injected as `X-Conversation-ID` on transfers) |
| `sip_<header>` | Each custom `X-*` header on an inbound INVITE, lower‑cased, `X-` stripped, hyphens → underscores (`X-Account-ID` → `sip_account_id`). Section 4.9 |
| `sip_uui_data` / `sip_uui_raw` | Decoded / raw RFC 7433 `User-to-User` header on an inbound INVITE, if present |

**The conversation-initiation webhook** receives the caller, called number, agent ID, conversation ID, provider call ID and, for SIP, the `Call-ID` and inbound X-headers. It must answer within 15 s, is not retried, and a failing webhook rejects the call (SIP `502`, Section 6.4). Its URL and headers can reference workspace environment variables, it follows the agent branch pinned on the number, and it may return dynamic variables, configuration overrides, a `branch_id` / `environment`, a `starting_workflow_node_id` and a `user_id`.

**What the conversation record stores for phone calls (Oct 2026).** `metadata.phone_call.call_result` is one of `answered`, `voicemail` (set by the voicemail-detection tool), `busy`, `no_answer` or `failed`; for `failed` outbound dials the SIP status code (or Twilio's SIP response code) is stored as the conversation error code. Failed dials and rejections also produce a **`call_initiation_failure`** webhook with `failure_reason` `busy`, `no-answer`, `unknown` or, since Sep 2026, `agent_concurrency_limit_exceeded`, `workspace_concurrency_limit_exceeded`, `agent_daily_call_limit_exceeded`, `queue_timeout`, `queue_full`. Campaign calls additionally carry `metadata.batch_call.campaign` with `cold_attempt` and `conversation_type` (`initial`, `retry`, `callback`, `redirect`).

### 6.6 Concurrency limits, call admission and the wait queue {#6.6-concurrency-limits,-call-admission-and-the-wait-queue}

Three limits apply to phone traffic: the **workspace concurrency limit** (simultaneous conversations, with **burst** up to 3× the subscription limit, capped at 300 for non-Enterprise plans and billed at the burst rate), an optional **per-agent concurrency limit**, and a **per-agent daily call limit** (default 100 000).

* **Outbound.** Since Oct 2026 the single-call outbound APIs (Twilio, SIP trunk, Exotel, WhatsApp) return **HTTP 429 `agent_daily_call_limit_exceeded`** before dialling when the agent's daily limit is reached; batch and campaign calls are not pre-checked and fail at conversation start instead. Every limit rejection, on any channel, is reported through the `call_initiation_failure` webhook (Section 6.5).  
* **Inbound without queueing.** A call above the concurrency limit is answered and then disconnected, with no spoken message, because limits are evaluated after the SIP dialog is established.  
* **Inbound with queueing** (generally available since Sep 2026; on by default for agents created from Oct 2026). Callers are held with hold audio until a slot frees up:

| Setting (agent → Call queueing) | Default | Notes |
| :---- | :---- | :---- |
| Enabled | on for new agents (Oct 2026), off for older ones | Hold callers when the agent is at its concurrency limit instead of rejecting them |
| Max queue wait time | 180 s | Upper bound 1800 s (30 min). On timeout the call ends and the conversation records that the queue timed out |
| Hold audio | default hold tone | Upload a custom MP3/WAV (up to 40 MB / 3 min); it is played in a loop |

Queued callers hear the hold audio on the media path already established, so nothing is required from the SBC: the SIP dialog is simply answered (200 OK) before the agent is ready. Queue time is not billed and is excluded from the conversation duration; there is no position or wait-time announcement. The queue applies to inbound Twilio and SIP-trunk calls, the widget/SDK and WebSocket connections, not to outbound or batch calls, text-only agents, or the Genesys, AudioCodes, Exotel, WhatsApp and SMS channels. Callers who hang up while waiting are recorded as having disconnected in the queue; callers over the daily limit are not queued.

## 7\. Telephony Provider Options {#7.-telephony-provider-options}

### 7.1 SIP trunk (BYO carrier / SBC / PBX) {#7.1-sip-trunk-(byo-carrier-/-sbc-/-pbx)}

The standard integration for enterprises bringing their own telephony stack. Works with:

* **Carrier‑provided SIP trunks** — BT, Deutsche Telekom, Verizon, AT\&T, Lumen, etc.  
* **IP PBX systems** — 3CX, Asterisk, FreePBX, Cisco CUCM, Avaya Aura / Communication Manager, Mitel, Grandstream UCM, etc.  
* **Session Border Controllers** — AudioCodes, Ribbon, Oracle, Sangoma, Kamailio, OpenSIPS, etc.  
* **CPaaS termination** — Twilio Elastic SIP Trunking, Vonage, Telnyx, Bandwidth, Plivo, Sinch, etc.

Practical notes for the most common stacks:

* **3CX** — define the platform as an outbound SIP trunk; ensure "Public IP" is correctly set (3CX must NAT‑rewrite `Contact`/`Via` to its public address). Watch for default outbound rules consuming the leading `+`.  
* **Asterisk / FreePBX** — use a `pjsip` endpoint with `transport=tcp` and `qualify_frequency=60` for keep‑alives; set `force_rport=yes` and `rewrite_contact=yes` if behind NAT.  
* **Cisco CUCM** — configure a SIP trunk pointing at the platform's SIP edge with normalised E.164 routing; confirm the CSS allows the destination pattern.  
* **AudioCodes / Ribbon SBCs** — use a dedicated IP Group for the platform; enable normalisation for international format on outbound, and ensure SDP `c=` lines carry the public media IP.  
* **Sinch SIP trunk** — inbound, outbound and Conference transfers work; SIP REFER and blind transfers fail on a Sinch trunk.  
* **Telnyx** — Telnyx inbound trunks do not use digest authentication; rely on the IP allowlist for that leg.  
* **SRV/NAPTR-resolving SBCs** — because NAPTR prefers TLS (Section 2.9), an SBC given only the bare domain will try TLS first; give it an explicit port and transport if you intend TCP.

In all cases: TCP on 5060 (or TLS on 5061), `Contact` and `Via` carrying the public address, and the firewall accepting traffic from any platform IP — not just the load balancer.

### 7.2 Twilio (managed integration) {#7.2-twilio-(managed-integration)}

Customers already on Twilio connect with an **Account SID \+ Auth Token**, or with an **API Key SID (`SK…`) \+ Secret plus the Account Auth Token** (the token is required for API-key imports since Sep 2026\) — no SIP trunk to configure. The platform:

* Handles inbound calls via a Twilio webhook returning TwiML opening a `<Stream>` to the agent  
* Initiates outbound calls via the Twilio REST API, honouring a per‑call **ring timeout** (`telephony_call_config.ringing_timeout_secs`, default 60 s), optional **Twilio call recording** (`twilio_call_recording_enabled`; recordings are stored in *your* Twilio account, not on the platform) and optional carrier **answering machine detection** (`twilio_machine_detection`, Section 5.5.7)  
* Carries audio over Twilio Media Streams (μ‑law over WebSocket) and receives caller DTMF as Twilio `dtmf` events  
* Supports Conference and Blind transfers, post‑dial digits, and (limited availability) **DTMF call screening** on Conference transfers (Section 8.1.1)  
* Supports DTMF emission via Twilio's call‑update API  
* Supports per‑workspace **regional configuration** (Twilio region \+ edge location) for latency‑sensitive deployments; without a matching region, Twilio defaults to US1 and operations such as transfers can fail for numbers hosted elsewhere  
* Optionally routes inbound **SMS** for the number to the platform (`enable_sms`, on by default; disable for voice‑only numbers)

Hardening since May 2026: every Twilio webhook the platform exposes (inbound call, SMS, call status, AMD and media-stream callbacks) is **signature-verified** against the Account Auth Token; the platform subscribes to Media Stream **status callbacks** so stream failures are detected authoritatively rather than inferred from silence; and gaps in Twilio's media stream are padded with silence (capped) so the agent's turn-taking does not stall.

> **The Auth Token matters.** Twilio signs webhooks with the Account Auth Token, which is why an API-key import must now include it (`account_auth_token`; the import fails with `missing_account_auth_token` otherwise). **Rotating the Auth Token in Twilio breaks the number** until it is re-imported with the new token: re-importing the same SID reuses the stored secret, so delete the number and import it again. The runtime symptom is `invalid_twilio_auth_token`.

**Bring your own Twilio call flow (`register-call`).** If the call is controlled by your own TwiML application, Twilio Studio flow or `calls.create`, you do not have to import the number: call `POST /v1/convai/twilio/register-call` with the agent ID, the two numbers, the direction and optional `conversation_initiation_client_data`, and return the TwiML it gives you (a `<Connect><Stream>` to the agent; the conversation ID comes back in the `X-Conversation-Id` response header). The agent must run μ-law 8 kHz, and transfer-to-number is not available on calls set up this way.

Twilio numbers are first‑class — not modelled as a generic SIP trunk under the hood. Choose Twilio when speed of integration and full lifecycle management (number provisioning, SMS, status callbacks) outweigh the desire for direct SIP control.

### 7.3 CCaaS and other integrations (Genesys, Amazon Connect, AudioCodes, Avaya, Exotel, Zendesk) {#7.3-ccaas-and-other-integrations-(genesys,-amazon-connect,-audiocodes,-avaya,-exotel,-zendesk)}

Four CCaaS platforms have **native voice transports**: the partner platform opens a WebSocket to ElevenLabs, authenticated with an ElevenLabs API key, and the call never touches a SIP trunk or an imported number. What they share:

* The call stays on the partner platform's telephony; the ElevenLabs agent is a participant in its flow. SIP-specific features (X-headers, REFER, SIP message logging) do not apply, the **transfer-to-number tool is not available** (Amazon Connect has its own escalation, below) and neither is the **play-DTMF tool**.  
* The audio format is fixed by the transport and overrides the agent's own audio settings.  
* Caller context arrives as transport-specific dynamic variables rather than as `system__caller_id` (Amazon Connect is the exception and populates the `system__` variables).  
* Conversation history labels these calls with the transport name (Genesys, Amazon Connect, AudioCodes, Avaya).

#### Genesys Cloud — three paths {#genesys-cloud-—-three-paths}

1. **AudioHook (native voice transport, generally available).** Genesys streams the live call audio to the platform over Genesys's **AudioHook Monitor** WebSocket protocol, authenticated with an ElevenLabs API key configured on the Genesys Audio Connector integration. No SIP trunk and no phone-number import — the call stays on Genesys telephony and the ElevenLabs agent is a participant in the Genesys flow. Audio is 8 kHz μ-law in both directions. Caller DTMF is delivered since Aug 2026\. Pass caller details and prompt overrides as Audio Connector **input variables** (`system__override_system_prompt`, `system__override_first_message`, `system__override_language`, `system__override_voice_id` are honoured as overrides); the conversation-initiation webhook is not called on this transport. Because there is no SIP dialog, the SIP-specific features in this guide do not apply; context is exchanged through Genesys flow variables instead.  
2. **Transfer to a Genesys bot / flow (`transfer_to_genesys_bot`).** A system tool (and matching **Genesys transfer** workflow node, Aug 2026\) that ends the ElevenLabs part of an AudioHook conversation and hands control back to Genesys, passing **output variables** (intent, collected data, disposition) the Genesys Architect flow can branch on — the standard way to route to a Genesys queue with context. Transfer-to-number is not available on AudioHook calls.  
3. **Chat takeover / handoff.** For digital channels: the agent transfers the conversation to a Genesys queue; messages from the human Genesys agent flow back via webhook (HMAC‑SHA256 verified) into the same conversation, with the conversation summary attached at handoff.

A Genesys contact center reached over a **SIP trunk** (BYOC) instead of AudioHook behaves like any other SBC — that is the case where SIP REFER \+ **UUI with a `00` protocol‑discriminator prefix** (Section 4.9) is the right way to pass context.

#### Amazon Connect — native A2A voice transport (limited availability) {#amazon-connect-—-native-a2a-voice-transport-(limited-availability)}

Since Sep 2026 Amazon Connect can hand a contact to an ElevenLabs agent through Connect's external AI-agent (A2A) interface. Availability requires third-party AI-agent support on the AWS account and the transport being enabled on the ElevenLabs workspace; request both through your account teams.

* **Setup (Connect side).** Register an A2A application per agent whose access URL is `wss://api.elevenlabs.io/v1/convai/conversation/amazon-connect/<agent_id>` (`api.<region>.residency.elevenlabs.io` for data-residency workspaces), with the ElevenLabs API key as the bearer credential; associate it with the instance and invoke it from the contact flow's AI-agent step. Inbound and outbound contacts look identical to the platform: Connect always opens the connection.  
* **Audio.** Linear PCM at 8, 16 or 24 kHz, proposed by Connect and negotiated independently for each direction; the agent's own audio format setting is ignored.  
* **Keypad input.** Digits collected by Connect are delivered to the agent as DTMF input. The play-DTMF tool is not available.  
* **Context.** Caller and dialled numbers arrive as `system__caller_id` / `system__called_number`, the Connect contact ID as `system__call_id`, and Connect's system attributes as `amazon_connect_*` dynamic variables. **Custom contact attributes set in the flow are not delivered** by Connect: fetch them in the conversation-initiation webhook (which runs on this transport, with `call_id` \= contact ID) or with a tool keyed on the contact ID.  
* **Ending the contact.** `end_call` completes the contact and the flow continues on its Complete branch. **Human escalation** is a transfer-to-number rule with the `amazon_connect` provider and an `amazon_connect_escalate` configuration (configured through the API today): the agent's reason travels with the hand-back and the flow continues on its Escalate branch. It only works if the flow advertised escalation when the session started; otherwise the tool returns an error and the agent can only end the contact.  
* **Not available on this transport:** client tools, dialling numbers or SIP URIs, returning data-collection results to the flow, prompt or voice overrides from the flow, text or chat mode. Per-turn traces (transcript and tool names, not tool parameters) are streamed to Connect when it subscribes to them. Check AWS regional availability of Connect's AI-agent features for the customer's region.

#### AudioCodes VoiceAI Connect — WebSocket transport (limited availability) {#audiocodes-voiceai-connect-—-websocket-transport-(limited-availability)}

AudioCodes VoiceAI Connect Enterprise can stream a call to the agent over its Bot API WebSocket (Aug 2026), enabled per workspace on request. Configure a bot provider in WebSocket mode pointing at `wss://api.elevenlabs.io/v1/convai/conversation/audiocodes/<agent_id>` with the API key as a bearer token; the caller number and conversation ID can be passed in headers and arrive as `audiocodes_caller` and `audiocodes_conversation_id` dynamic variables. Audio is 16 kHz linear PCM. Keypad input and in-call transfers are not available on this channel yet; the agent can end the call. Until a workspace is enabled, connect AudioCodes as a plain SIP trunk (7.1).

#### Avaya Infinity — WebSocket transport (early access) {#avaya-infinity-—-websocket-transport-(early-access)}

Avaya Infinity connects natively over Avaya's Media Interaction Messaging WebSocket (Sep 2026, early access). Point the Infinity workflow's bot endpoint at `wss://api.elevenlabs.io/v1/convai/conversation/avaya/<agent_id>` with the API key in the `x-api-key` header or in the bot credentials. Audio is 8 kHz μ-law; caller keypad input is supported; the agent cannot send tones or transfer the call, but can end it. Call context (UCID, from, to, direction and any custom keys) arrives as `avaya_*` dynamic variables, and the same `system__override_*` keys as on Genesys act as overrides. On-prem Avaya Aura / CM still connects over a SIP trunk.

#### Exotel (India and Singapore) — managed provider since May 2026 {#exotel-(india-and-singapore)-—-managed-provider-since-may-2026}

Exotel is a third phone-number provider alongside Twilio and SIP trunk. Import with the Exotel Account SID, API key \+ token, region host (`api.in.exotel.com` for Mumbai, `api.exotel.com` for Singapore) and the Voicebot applet ID; since Oct 2026 the platform verifies that the number belongs to that Exotel account before saving it (`phone_not_found` or `invalid_exotel_credentials` otherwise). Exotel support has to enable the Voicebot applet and provision channels first. Inbound and outbound calls, batch calling, failed-dial webhooks, the conversation-initiation webhook, DTMF emission and transfer-to-number are supported; transfers need a chained Connect applet on the Exotel side or they fail. Exotel warm transfers whisper the agent's briefing to the human on connect. Audio is 8 kHz PCM.

#### Zendesk {#zendesk}

The agent reads and responds to Zendesk tickets via webhook \+ REST, maintaining conversation continuity across tool turns (digital channel — Zendesk Talk voice is not natively integrated).

These integrations layer **on top of** the underlying telephony channel — for SIP‑trunk, Twilio and Exotel numbers the call itself still arrives via that provider.

### 7.4 What is not natively integrated (today) {#7.4-what-is-not-natively-integrated-(today)}

The following have no first‑class native channel; integrate over a SIP trunk (through your SBC) or via tools:

* **Microsoft Teams** — no connector. The public guides describe three do-it-yourself paths (an embedded widget tab, an Azure Communication Services bridge carrying 16 kHz PCM, or a Graph media bot); Direct Routing can also be fronted by an SBC and presented as a SIP trunk.  
* **NICE inContact / CXone** and **Cisco Webex Contact Center** — SIP trunk via your SBC.  
* **Five9** — AI Agent Connect is a SIP external transfer to an ElevenLabs SIP number: Five9 sends `X-` headers (ANI, DNIS, call and session IDs, campaign, agent ID) that arrive as `sip_*` dynamic variables, and end-of-call context goes back on the BYE via `attributes_to_headers`.  
* **Talkdesk** — SIP trunk; consumes UUI on SIP REFER (Section 4.9).  
* **Vonage** — a WebSocket connector application rather than SIP.  
* **Zendesk Talk** (voice channel — Zendesk ticketing/chat is integrated).

Amazon Connect, AudioCodes and Avaya Infinity moved out of this list in 2026 (Section 7.3).

## 8\. Transfer to Human: Blind, Conference, and SIP REFER {#8.-transfer-to-human:-blind,-conference,-and-sip-refer}

When the AI needs to hand off a live call, three transfer mechanisms are available, exposed through a single unified system tool: **transfer‑to‑number**.

The tool's configuration is moving to a **per-provider shape** (Sep 2026): each rule is a natural-language condition plus one configuration for each telephony provider the agent may be reached on (Twilio, SIP trunk, Exotel, Amazon Connect), and only the configuration matching the live call's provider is offered to the LLM. Existing per-number transfer lists keep working unchanged; the new editor is in limited availability in the dashboard, while the API accepts both shapes.

### 8.1 The transfer‑to‑number tool {#8.1-the-transfer‑to‑number-tool}

Configured per agent, contains a **list of transfer rules**. Each rule is a self‑contained recipe: a destination, a mechanism, optional context, and a natural‑language **condition** telling the LLM when to use it.

A single agent can therefore expose **many destinations** (billing, tech support, after‑hours voicemail, escalation manager, etc.) and the LLM picks based on conversation context.

#### 8.1.1 What a transfer rule contains {#8.1.1-what-a-transfer-rule-contains}

| Field | Purpose |
| :---- | :---- |
| **Transfer destination** | An **E.164 phone number** (static or from a dynamic variable) or, for SIP REFER only, a **SIP URI** (`sip:billing@pbx.example.com`, URI parameters and headers allowed — `sip:ivr@pbx.example.com;ext=2`). Conference legs on a SIP trunk dial phone numbers only. |
| **Transfer type** | Per provider: **Twilio** warm conference (optional screening, post-dial digits) or cold blind (post-dial digits); **SIP trunk** cold conference, **warm conference** (limited availability) or cold SIP REFER; **Exotel** conference or blind; **Amazon Connect** escalate. In the older shape: `blind`, `conference` or `sip_refer`. Mechanisms can be mixed across rules. |
| **Condition** | A natural‑language description of when the LLM should select this rule. E.g. *"the user explicitly asks for a human, mentions billing, or wants to dispute a charge"*. |
| **Post‑dial digits** | Optional DTMF sequence sent after the destination answers — to enter an extension or punch through an IVR. Digits, `*`, `#`, `w` (0.5 s pause), `W` (1 s pause), e.g. `w1234#`. Static or dynamic‑variable‑sourced. Twilio transfers only (blind and conference). |
| **Custom SIP headers** | Up to 20 X‑headers carried on the **REFER** (not on conference legs), for passing business context (account ID, priority, prior summary). Static or dynamic‑variable‑sourced. |
| **UUI** (`uui`) | RFC 7433 User‑to‑User payload on the REFER when the destination is a **SIP URI** (dropped for phone-number destinations), Section 4.9: data (dynamic variables allowed, ≤ 8192 bytes), optional protocol discriminator and its mode. |
| **Ring tone during REFER** (`sip_refer_play_dialtone`) | Default **on**: the caller hears ringing while your SIP server executes the REFER. The tone is sent as RTP to the peer executing the REFER, so turn it **off** if the receiving SBC/contact center must not hear it (e.g. it records or analyses the leg); the caller then hears silence until connected. SIP REFER only (Aug 2026). |
| **Call screening** (`require_acceptance`) | Warm transfers only; limited availability. The human hears a short prompt and must press a key before the caller is bridged: on **Twilio** 1 \= hear the briefing, 9 \= connect (the prompt repeats, the briefing can be interrupted by a key); on the **SIP warm transfer** 1 \= hear the briefing, 2 \= connect. If nobody presses a key (voicemail, no answer) the transfer fails cleanly instead of bridging the caller into a mailbox. Prompts are in English. Mutually exclusive with post‑dial digits (screening consumes the keypad). |
| **Client‑facing message** | When enabled (default), the LLM may also generate a short message spoken to the caller right before the transfer executes (e.g. *"One moment while I connect you to billing"*). Can be disabled per rule for silent transfers. The briefing for the human (`agent_message`) is always generated; if the LLM omits it a generic sentence is used. |

#### 8.1.2 Conditional transfers {#8.1.2-conditional-transfers}

Conditions are how the agent decides which destination to use:

`Rule 1`  
  `Condition:    "User asks for billing, account questions, or invoices"`  
  `Destination:  +14155550110`  
  `Type:         CONFERENCE`  
  `Headers:      X-Department: billing, X-Priority: normal`

`Rule 2`  
  `Condition:    "User reports an outage, technical issue, or product not working"`  
  `Destination:  +14155550120`  
  `Type:         CONFERENCE`  
  `Post-dial:    w2#       (dial extension 2 in the support IVR)`  
  `Headers:      X-Department: support`

`Rule 3`  
  `Condition:    "User asks for a manager, is hostile, or threatens cancellation"`  
  `Destination:  sip:escalation@pbx.example.com`  
  `Type:         SIP_REFER`

`Rule 4`  
  `Condition:    "Outside business hours (after 18:00 customer time)"`  
  `Destination:  +14155550199         (voicemail box)`  
  `Type:         BLIND`  
  `Client message: disabled`

**If only one rule is configured**, the platform applies a single‑rule fallback: even if the LLM provides an incorrect destination, the platform routes to the configured one and logs the LLM correction. With several rules the LLM must echo a configured destination exactly (spaces ignored); a mismatch returns *"No matching transfer. Valid options: …"* to the LLM, which then retries. There is no automatic retry to a second destination: handle fallbacks in the prompt (offer another option) or in a workflow failure edge (8.8).

#### 8.1.3 Mixing transfer mechanisms in one agent {#8.1.3-mixing-transfer-mechanisms-in-one-agent}

Because each rule chooses its own `transfer_type`, a single agent can:

* Use **CONFERENCE** for warm handoffs to human queues where context speech is valuable  
* Use **SIP REFER** for direct PBX‑native transfers to internal extensions  
* Use **BLIND** for silent forwards to voicemail or after‑hours boxes

Especially useful in CCaaS deployments where some destinations are external numbers (CONFERENCE) and others are internal SIP URIs (SIP REFER).

#### 8.1.4 Context that flows with every transfer {#8.1.4-context-that-flows-with-every-transfer}

* **Agent message** — a short LLM‑generated summary (capped at roughly 900 characters when spoken) describing the conversation so far, the reason for transfer, and verified caller details. For Twilio and Exotel Conference it is **spoken to the human** as they join (Exotel whispers it). For the **SIP warm transfer** it is spoken to the human in the agent's own voice before bridging. For the SIP cold Conference it is **not delivered**, and for SIP REFER it is only captured in the conversation history (see 8.5).  
* **Custom SIP headers / UUI** — for structured context. The platform automatically injects `X-Conversation-ID` and `X-Caller-ID` on SIP REFER transfers; per‑rule headers with those names are dropped, not merged. UUI (Section 4.9) rides on the same REFER.

### 8.2 Side‑by‑side comparison {#8.2-side‑by‑side-comparison}

| Feature | Blind | Conference (Twilio / Exotel) | Conference (SIP trunk) | SIP REFER |
| :---- | :---- | :---- | :---- | :---- |
| **Mechanism** | Caller is redirected to the destination immediately | Caller is parked, the human is dialled, hears the briefing and is bridged in; the agent drops out | Platform dials the destination via your outbound trunk and merges it into the call. The **warm** variant (limited availability) speaks the briefing on a separate consult leg first | Native SIP REFER — your SIP infrastructure executes the transfer |
| **Available on** | Twilio, Exotel | Twilio, Exotel | SIP trunk | SIP trunk |
| **Transfer to E.164 phone number** | ✅ | ✅ | ✅ | ✅ |
| **Transfer to SIP URI (incl. URI params)** | ❌ | ❌ | ❌ | ✅ |
| **Requires pre‑configured outbound trunk** | ❌ | ❌ | ✅ | ❌ |
| **Supports digest authentication** | ✅ (provider account) | ✅ (provider account) | ✅ (via outbound trunk) | ACL only on the transfer leg |
| **Conversation ID on the new leg** | via X‑headers if configured | ✅ | ✅ `X-Conversation-ID` \+ `X-Caller-ID` | ✅ auto‑injected `X-Conversation-ID` |
| **Per‑rule custom X‑headers carried** | ❌ | ❌ | ❌ (only trunk‑level static `headers`) | ✅ up to 20 |
| **UUI (RFC 7433\) carried** | ❌ | ❌ | ❌ | ✅ (SIP URI destinations) |
| **Human hears a spoken briefing before bridging** | ❌ | ✅ | Cold: ❌. Warm: ✅ in the agent's voice (limited availability) | ❌ |
| **Receiver must press a key to accept (screening)** | ❌ | ✅ Twilio (1 / 9), limited availability | ✅ warm variant (1 / 2), limited availability | ❌ |
| **What the caller hears during setup** | n/a | Twilio: hold music; Exotel: provider default | Silence (no platform hold music) | Ring tone by default, configurable (`sip_refer_play_dialtone`) |
| **Post‑dial DTMF (extension)** | ✅ Twilio | ✅ Twilio | ❌ | ❌ (use URI parameters / headers) |
| **Agent stays in the call if the transfer fails** | ❌ (the agent leaves as soon as the redirect is accepted) | ❌ The agent leaves once the human is dialled; no‑answer, busy, decline or screening timeout end the call with a spoken apology to the caller (Sep 2026\) | ✅ The tool waits for the answer; on failure the agent continues with the SIP reason | ✅ A failed REFER is returned to the agent, which continues |
| **Bridged‑leg media timeout** | n/a | n/a | 30 s without audio tolerated (silent IVRs) | n/a |
| **Stability** | Mature | Mature | Cold: mature. Warm: new (Oct 2026\) | Generally stable; some edge cases in complex PBX environments |

### 8.3 Choosing between the three {#8.3-choosing-between-the-three}

* **Blind** — simplest cold transfer on Twilio or Exotel: the agent says "transferring you now" and the caller is dropped onto the destination.  
* **Conference** — on Twilio and Exotel a warm handoff with a spoken briefing (Twilio optionally with keypress screening). On a SIP trunk a direct merge, or a spoken briefing where the SIP warm transfer is enabled for the workspace (see 8.5).  
* **SIP REFER** — when the destination is a SIP URI, when you cannot pre‑configure an outbound trunk, or when your SIP infrastructure expects to own the transfer end‑to‑end.

### 8.4 SIP REFER flow — step by step {#8.4-sip-refer-flow-—-step-by-step}

`[Established call: Caller ↔ Platform ↔ AI Agent]`

`1. Agent decides to transfer.`  
   `Platform → REFER (Refer-To: <target>[?User-to-User=<hex>;encoding=hex])  ─►  Your SIP server`  
                  `+ auto-injected X-Conversation-ID, X-Caller-ID`  
                  `+ your custom X-headers`  
   `(Caller hears a ring tone from now on unless sip_refer_play_dialtone is off)`  
                                                          `│`  
`2. Your SIP server: ◄──── 202 Accepted ────  (acknowledge intent)`  
                                                          `│`  
`3. Your SIP server initiates the transfer leg`  
   `(typically by INVITE to <target>, copying UUI / headers as its policy dictates)`  
                                                          `│`  
`4. Your SIP server → NOTIFY (sipfrag: 200 OK / 4xx / 5xx)  ──► Platform`  
                  `(carries the result of the transfer leg)`  
                                                          `│`  
`5. Platform → 200 OK to NOTIFY                              ──► Your SIP server`  
                                                          `│`  
`6. Platform → BYE (+ any attributes_to_headers)             ──► Your SIP server`  
   `(ends the original call leg now that transfer succeeded)`

**What goes wrong here:**

* NOTIFY never arrives because your firewall only allows the load‑balancer IP (default stack). The platform sees the transfer as hung.  
* NOTIFY arrives with 4xx/5xx — your SBC failed to reach the target. Platform ends the original call (or, in a workflow, follows the failure edge — 8.8).  
* 202 Accepted arrives but no NOTIFY — your SBC is implementing partial REFER (some legacy SBCs do this). Configure subscription‑state NOTIFYs with sipfrag.  
* REFER rejected with **`403 Forbidden`** but only over TLS (TCP works) — SBC‑side in‑dialog validation tied to the platform's Contact header. See Section 11\.  
* REFER fails on a TLS trunk with an **IP‑SAN** or **unknown authority** TLS error — certificate/Remote‑domains problem, not a REFER problem. See Section 11\.  
* The receiving contact center records or hears a ring tone bleeding into the transferred leg — disable `sip_refer_play_dialtone` on that rule.  
* The downstream system ignores your X‑headers — it probably consumes **UUI** instead (Genesys, Talkdesk, Avaya). Configure `uui` with the discriminator that platform expects.

### 8.5 Conference transfer — Twilio vs SIP trunk (cold and warm) {#8.5-conference-transfer-—-twilio-vs-sip-trunk-(cold-and-warm)}

All three achieve a bridged hand‑off. Twilio and Exotel CONFERENCE deliver a spoken briefing; the SIP‑trunk CONFERENCE is a direct merge unless the **SIP warm transfer** (limited availability, Oct 2026\) is enabled for the workspace.

#### Twilio path (warm handoff) {#twilio-path-(warm-handoff)}

`1. Caller is moved into a conference room (startConferenceOnEnter=false)`  
`2. Platform places an outbound call to the human:`  
     `- with screening on: "You have <caller> waiting on the line. Press 1 to hear`  
       `the summary. Press 9 to connect." (repeats; the briefing can be interrupted)`  
     `- speaks the agent_message via TTS as soon as they answer (or press 1)`  
     `- moves them into the same conference (endConferenceOnExit=true)`  
`3. Caller's call is updated to join the conference`  
`4. AI agent drops out; the human and caller are now connected`  
`5. When either party hangs up, both legs end (endConferenceOnExit)`

The conference name is generated per call so simultaneous transfers don't collide. The caller hears Twilio's default hold music while the human listens to the briefing. **The platform treats the transfer as successful as soon as the call to the human is created, so the AI agent leaves at that point.** If the human does not answer (Twilio's default ring time is about 60 s), is busy, declines, or with screening on never presses a key, the caller hears *"We're sorry, we could not connect your call."* and the call ends (Sep 2026).

What the warm handoff delivers:

* **No re‑explanation** — caller doesn't have to repeat the reason for the call.  
* **Better first impression** — human picks up already informed and can greet by name with the right context.  
* **Faster handle time** — valuable for queues with tight SLAs or per‑second pricing.  
* **Selective acceptance (with screening)** — a mailbox or an unattended desk cannot press a key, so the caller is told the transfer failed instead of being bridged into a stranger's voicemail. Without screening, a voicemail that answers counts as answered and receives the briefing.

What it is **not**:

* **One‑way briefing** — the human cannot ask the agent clarifying questions before accepting. They must ask the caller directly once bridged.  
* **No re‑engagement** — the agent terminates as soon as the human is dialled. There is no built‑in "return to AI" flow, including when the human does not pick up.  
* **No true attended transfer** — the pattern where the agent has a private 3‑way conversation with the human while the caller is on hold is not exposed.  
* **Briefing is fixed at transfer time** — the agent cannot update or extend it while the human is listening.

#### SIP trunk path — cold conference (direct merge) {#sip-trunk-path-—-cold-conference-(direct-merge)}

`1. Platform initiates a new outbound INVITE to the transferee via your`  
   `configured outbound trunk`  
        `+ auto-injected X-Conversation-ID, X-Caller-ID`  
   `The platform blocks until the call is answered (or fails).`  
`2. While ringing, caller and AI agent remain connected; the agent's turn`  
   `is paused on the tool call. The caller hears silence (or whatever the`  
   `agent had last said) until the transferee answers — no platform-side`  
   `hold music.`  
`3. On answer, the transferee is added directly to the same call session`  
   `as the caller and the AI agent.`  
`4. The AI agent drops out immediately; the caller and the transferee are`  
   `now connected as a normal two-party call.`  
`5. When either party hangs up, the call ends.`

Important differences from the Twilio path:

* **No spoken briefing.** The `agent_message` produced by the LLM is not spoken on this path — the transferee is bridged directly. Practical effect is closer to a "blind add" than warm handoff.  
* **Per‑rule custom SIP headers are not carried** on the outbound leg — only auto‑injected `X-Conversation-ID` and `X-Caller-ID` plus the outbound trunk's static `headers`. If you need per-rule headers to flow with a transfer, use SIP REFER.  
* **On failure** (no answer, busy, SBC rejects the INVITE): the error is returned to the agent, which **stays alive in the call** and can speak a conversational fallback ("Sorry, I couldn't reach them — would you like me to try a different number?"). The agent only terminates on a *successful* transfer.  
* **Silent IVRs.** The bridged leg tolerates up to 30 s without inbound audio (Sep 2026), so a destination that collects digits silently is not dropped.

#### SIP trunk path — warm conference (limited availability, Oct 2026\) {#sip-trunk-path-—-warm-conference-(limited-availability,-oct-2026)}

`1. Platform dials the transferee via your outbound trunk on a separate`  
   `consult leg (+ X-Conversation-ID, X-Caller-ID; no per-rule custom headers).`  
   `Caller and AI agent stay connected; the caller hears silence while it rings.`  
`2. On answer the transferee hears the agent_message spoken in the agent's own`  
   `voice. With require_acceptance on, they first hear:`  
   `"You have <caller number> waiting on the line. Press 1 to hear the summary.`  
    `Press 2 to connect."  (repeats every few seconds until a key or hang-up)`  
`3. When the briefing finishes (or 2 is pressed) the transferee is moved into`  
   `the caller's call and the AI agent drops out.`  
`4. When either party hangs up, the call ends.`

Notes:

* Requires an outbound trunk on the number, like the cold variant. The caller never hears the consult leg.  
* The briefing is capped at roughly 900 characters; the screening prompts are English‑only.  
* If the transferee is busy, unreachable, rejects the call or hangs up during the briefing, the agent gets the reason (*"Transfer failed: …"* or *"the person receiving the transfer hung up"*) and **stays with the caller**. If the caller hangs up during the consult, the consult leg is torn down.  
* Where the warm transfer is not enabled for the workspace, a rule configured as warm silently runs the **cold** conference transfer and the tool result says so. Ask your ElevenLabs contact about enablement.

If the SIP warm transfer is not available to you yet, the options remain:

* **Use SIP REFER instead** with **custom X‑headers / UUI \+ screen‑pop / CTI** in your downstream system to brief the human visually as the call arrives ("context‑rich cold transfer").  
* **Prompt engineering workaround:** instruct the agent to verbally tell the caller *"Please hold while I bring in a colleague"* before invoking the transfer, so the silence during ringing is at least expected.

#### Is SIP REFER warm? {#is-sip-refer-warm?}

Not in the spoken‑briefing sense. The platform hands the caller off and steps out of the call entirely — no TTS briefing is spoken, because the platform is no longer in the call when the human answers. Instead:

* **Agent message is captured in the conversation history** for analytics/QA — but not heard by the human.  
* **Custom X‑headers / UUI on the REFER carry structured context** to your downstream system. If your CRM/contact center can drive a screen‑pop ("Account 12345, calling about damaged order, sentiment: frustrated"), the human gets equivalent context **visually rather than spoken**.

Best thought of as "context‑rich cold transfer".

#### Choosing between them {#choosing-between-them}

* **Twilio or Exotel CONFERENCE** — receiving party is a **human picking up a phone** and the briefing should be **spoken**; on Twilio add screening when mailboxes must never receive the caller.  
* **SIP warm CONFERENCE** — the same requirement on a SIP‑trunk deployment, optionally with keypress acceptance; needs the outbound trunk and workspace enablement.  
* **SIP REFER** — receiving party is a **SIP endpoint with screen‑pop / CTI** that can consume X‑headers or UUI; destination is a **SIP URI**; or the platform staying in the media path adds no value.  
* **SIP cold CONFERENCE** — bridging a SIP‑trunk call to a phone number where the transferee does not need (or can independently obtain) context — internal queues, IVRs that announce themselves, internal extensions. Be explicit with customers that the human will not hear an AI‑spoken briefing.  
* **True attended transfer** (agent and human talking privately while the caller holds) is a known gap on all paths — track as a product limitation when scoping integrations.

### 8.6 Custom headers on transfers {#8.6-custom-headers-on-transfers}

* **SIP REFER** — per‑rule custom headers are merged into the REFER request. Auto‑injected `X-Conversation-ID` and `X-Caller-ID` take precedence on key collision (case‑insensitive).  
* **Conference (SIP trunk, cold and warm)** — headers configured on the **outbound trunk** are used on the second leg INVITE together with `X-Conversation-ID` and `X-Caller-ID`; per‑rule custom headers and UUI are **not** carried (see 8.5).

### 8.7 Post‑dial DTMF (extension navigation) {#8.7-post‑dial-dtmf-(extension-navigation)}

Transferring into a downstream IVR or PBX that requires an extension:

* **Twilio (Blind & Conference)** — set `post_dial_digits`. Format: digits, `*`, `#`, plus `w` for a 0.5‑second and `W` for a 1‑second pause. Example: `w1234#`. Not combinable with call screening (`require_acceptance`).  
* **SIP REFER** — not supported (the extension cannot be conveyed as DTMF in the REFER itself). Two workarounds: (1) put the extension in the SIP URI — destination validation accepts URI parameters and headers, e.g. `sip:auto-attendant@pbx.example.com;ext=2` or `sip:ivr@pbx.example.com?X-Extension=2` (Aug 2026), if your PBX honours them; (2) pass it in a custom header or UUI and have your SBC inject the DTMF after answering.

### 8.8 Failure handling {#8.8-failure-handling}

* **Blind (Twilio)** — the caller is redirected to the destination and the tool returns success immediately, so the AI agent leaves; if the destination is busy or does not answer, the call simply ends. Only set-up errors (misconfigured number, call not on a supported provider) come back to the LLM while the agent is still live.  
* **Conference (Twilio)** — the caller is parked with hold music, the human is dialled and the agent leaves as soon as that call is created. No-answer (about 60 s), busy, decline or a screening timeout end the call with a spoken apology to the caller (Sep 2026); the agent cannot recover it. A synchronous Twilio API error is returned to the LLM and the agent continues.  
* **Conference (SIP trunk, cold and warm)** — the tool waits until the transferee answers. Busy, no answer, rejection or a hang-up during the briefing return *"Transfer failed: \<SIP reason\>"* to the LLM and the **agent stays in the call** and can offer alternatives. Only a successful bridge ends the agent's participation.  
* **SIP REFER** — the tool waits for the REFER outcome. A rejected REFER or a failure NOTIFY is returned to the LLM as an error and the agent continues; on success the agent leaves.  
* **Workflows: continue after a failed transfer (Aug 2026).** The phone‑transfer node in an agent workflow can have a **failure edge**: when the platform learns synchronously that the transfer did not complete (busy, no answer, rejected REFER, provider error), execution follows that edge instead of the call ending — e.g. to a node that apologises, offers a callback, or tries a second destination. Use this rather than prompt heroics for any production transfer.  
* **Simulations and tests never dial.** The tool returns a simulated success in the test runner, so transfer logic can only be verified on a real call.

Error strings you will see in transcripts: *"No SIP Trunk configuration found for number …"* / *"No Twilio configuration found for number …"* (the agent's number has no provider configuration), *"Missing SIP trunking info. Cannot perform the transfer."* (a Conference rule on a SIP number without an outbound trunk), *"Transfer functionality is not available for external calls."* (calls set up through Twilio `register-call`), *"No matching transfer. Valid options: …"* (the LLM did not echo a configured destination).

## 9\. SIP Message Logging (Debugging Feature) {#9.-sip-message-logging-(debugging-feature)}

> **The single most important feature for diagnosing SIP issues.** Enable it before your first test calls and leave it on for any number not at steady state.

### 9.1 What it does {#9.1-what-it-does}

When enabled, every SIP message exchanged for that number — inbound and outbound, both directions — is captured and made available in the platform UI and via API. Stored as raw SIP text (full headers and body) plus structured metadata, so you can reconstruct the entire dialog without a packet capture.

### 9.2 What gets captured {#9.2-what-gets-captured}

| Field | Description |
| :---- | :---- |
| `raw_message` | The full SIP message (headers \+ body, including SDP) |
| `call_id` | The SIP `Call-ID`, for correlating across messages |
| `phone_numbers` | The phone numbers involved |
| `local_address` | The platform SIP server endpoint (the address that handled the call) |
| `remote_address` | Your SIP server's address |
| `transport` | TCP, UDP, or TLS |
| `direction` | `in` (received from your side) or `out` (sent to your side) |
| `error_message` | Any parsing or delivery error |
| `created_at_unix_micro` | Microsecond‑precision timestamp |

**Audio is not captured** — only signalling. Keep-alive traffic (OPTIONS and stray ACKs that carry no phone number) is not stored either. For media issues, you still need a packet capture from your SBC.

### 9.3 How to enable {#9.3-how-to-enable}

**UI** (per phone number):

1. Open the phone number: `Agents → Phone Numbers → <your number>`.  
2. Open Phone Settings.  
3. Locate "SIP Messages" (currently marked **Alpha**).  
4. Toggle on. (On by default for new SIP trunk numbers.)

**API:**

`PATCH /v1/convai/phone-numbers/{phone_number_id}`  
`Content-Type: application/json`

`{`  
  `"store_sip_messages": true`  
`}`

### 9.4 How to access captured messages {#9.4-how-to-access-captured-messages}

**Per phone number** — recent messages across calls on that number:

`GET /v1/convai/phone-numbers/{phone_number_id}/sip-messages`

Cursor‑based pagination, default page size 20\. Useful for "what did the last 20 INVITEs to my number look like?"

**Per conversation** — only the SIP messages for one specific call:

`GET /v1/convai/conversations/{conversation_id}/sip-messages`

The most useful view when debugging a specific failed call. Empty for Twilio, Exotel and the CCaaS transports, which have no SIP dialog.

### 9.5 What the UI shows {#9.5-what-the-ui-shows}

A table with one row per message:

| Date | Direction | Transport | Remote address | First line |
| :---- | :---- | :---- | :---- | :---- |
| 14:02:31.118 | ↓ in | TCP | 203.0.113.10:5060 | INVITE sip:+10000000000@... SIP/2.0 |
| 14:02:31.122 | ↑ out | TCP | 203.0.113.10:5060 | SIP/2.0 100 Trying |
| 14:02:31.456 | ↑ out | TCP | 203.0.113.10:5060 | SIP/2.0 200 OK |

Each row is expandable for the full raw message; the entire view can be exported as JSON via "Copy all".

### 9.6 Permissions, retention, scope {#9.6-permissions,-retention,-scope}

* **Permission** — any workspace user with `CONVAI_READ` can view; toggling requires phone‑number edit rights.  
* **Scope** — workspace‑isolated. Messages from one workspace are never visible to another.  
* **Retention** — **7 days.** Each captured message carries an expiry and is deleted automatically 7 days after capture (30 days from Jul 2026, reduced to 7 in Oct 2026). Export the JSON promptly if you need it for a post‑mortem.

### 9.7 What this lets you do {#9.7-what-this-lets-you-do}

* **Reconstruct a failed call from the customer's logs alone** — even without a tcpdump from your side.  
* **See exactly which `Contact` / `Via` headers the platform received** — invaluable for diagnosing NAT/SBC misconfigurations.  
* **Verify your custom X‑headers** are arriving as expected on the platform side.  
* **Confirm that BYE / REFER / NOTIFY were attempted** and what response came back.  
* **Diagnose codec mismatches** by comparing offer SDP and answer SDP side‑by‑side.

> **Best practice:** When opening a support ticket, attach the SIP Messages JSON export for the affected conversation alongside the Conversation ID and Agent ID.

## 10\. Debugging Workflow & Troubleshooting {#10.-debugging-workflow-&-troubleshooting}

A repeatable process for working SIP incidents. Follow in order.

### Step 1 — Capture the basics {#step-1-—-capture-the-basics}

For every report:

* **Conversation ID** (visible in conversation history)  
* **Agent ID**  
* **Phone number** and **direction** (inbound vs outbound)  
* **Timestamp** \+ customer's **timezone**  
* **Observed behaviour vs expected behaviour** in one sentence  
* **Transport** (TCP / TLS / UDP)

### Step 2 — Open the SIP Messages view {#step-2-—-open-the-sip-messages-view}

Navigate to the conversation; open its **SIP Messages** tab. If empty:

* Was `store_sip_messages` enabled when the call happened? Check Phone Settings; enable and reproduce.  
* Did the INVITE actually reach the platform? Zero captured messages from your side means the call never made it through your network — check SBC logs.

### Step 3 — Walk the dialog {#step-3-—-walk-the-dialog}

Read messages in order. Healthy shape:

`in   INVITE`  
`out  100 Trying`  
`out  200 OK            (or 1xx provisional if you sent any)`  
`in   ACK`  
`... (call in progress, no signaling) ...`  
`in   BYE               (or out BYE if the agent hung up)`  
`out  200 OK`

Common deviations:

| Symptom | Meaning |
| :---- | :---- |
| INVITE present, no further messages | Platform could not match the destination number, or agent is misconfigured. Check `To` header user part vs imported number format. |
| INVITE → 401 Unauthorized | Digest auth challenge. Your stack should re‑INVITE with credentials. If it doesn't, it's not configured for digest. |
| INVITE → 488 Not Acceptable Here | SDP / codec / encryption mismatch. Compare offer SDP against your supported codecs. |
| 200 OK sent but no ACK ever arrives | NAT or `Contact`/`Via` issue — your side cannot route the ACK back. |
| BYE sent by platform, no 200 OK from your side | Same NAT / firewall issue — BYE is reaching you but your response isn't reaching us, or vice versa. |
| 481 Call doesn't exist on a follow‑up message | The follow‑up was sent to the wrong endpoint (load balancer instead of the call‑handling server). Check that you are honouring the `Contact` header from the 200 OK. |
| INVITE → 404 Not Found | The number matched but has no agent assigned (the reason phrase says so). Assign an agent to the number. |
| INVITE → 403 Forbidden with an agent‑related reason phrase | The assigned agent is unavailable (disabled or blocked). A bare 403 is the trunk's ACL / allowed‑numbers check instead. |
| INVITE → 502 Bad Gateway | Your conversation‑initiation webhook failed or did not answer within 15 s. Check its logs. |
| INVITE → 503 Service Unavailable | Transient platform or authentication error. Retry; escalate with the Conversation ID if it persists. |
| 200 OK, then BYE from the platform within a second or two | Concurrency or daily‑limit rejection (evaluated after answer) or a wait‑queue timeout. Check the `call_initiation_failure` webhooks and the agent's limits. |

### Step 4 — Check the Contact and Via headers {#step-4-—-check-the-contact-and-via-headers}

Open the 200 OK your side sent in response to the INVITE:

`Contact: <sip:<address>:5060;transport=TCP>`  
`Via: SIP/2.0/TCP <address>:5060;...`

Both `<address>` values **must** be reachable from the public internet (or from the platform's static IP range, in enterprise deployments). RFC1918 addresses (`10.x`, `172.16-31.x`, `192.168.x`) are your bug — your SBC needs to rewrite them to its external address.

### Step 5 — Check your firewall {#step-5-—-check-your-firewall}

If early signalling looks fine but follow‑up messages (BYE, REFER, NOTIFY) are missing, the most likely cause is a firewall allowing only the load balancer IP. Verify your firewall accepts traffic from any platform IP range.

### Step 6 — For transfer issues, walk the REFER state machine {#step-6-—-for-transfer-issues,-walk-the-refer-state-machine}

`out  REFER  (with Refer-To)`  
`in   202 Accepted`  
`in   NOTIFY (sipfrag with the result)`  
`out  200 OK`  
`out  BYE`

If REFER but no 202 — your SBC did not accept the REFER. Check that REFER is permitted in your dialplan. If 202 but no NOTIFY — your SBC accepted but never reported back; configure subscription‑state NOTIFYs.

### Step 7 — For silent‑audio issues {#step-7-—-for-silent‑audio-issues}

Check the SDP in INVITE and 200 OK; confirm at least one common codec. If codecs match and audio is still silent, the issue is in the media plane — capture RTP at your SBC.

### Step 8 — Quick connectivity and TLS check {#step-8-—-quick-connectivity-and-tls-check}

Confirm basic SIP port reachability to your server from the public internet:

`nc <your-sip-host> 5060 -vv      # TCP`  
`nc <your-sip-host> 5061 -vv      # TLS`

For TLS trunks also verify the certificate the way the platform will see it (full chain, public root, SAN, TLS 1.2+):

`openssl s_client -connect <your-sip-host>:5061 -servername <your-sip-fqdn> </dev/null 2>/dev/null \`  
  `| grep -E 'Verify return code|Protocol|subject=|issuer='`

`Verify return code: 0 (ok)` is required. Codes 20/21 (unable to get local issuer / unable to verify the first certificate) mean intermediates are missing or the CA is private — Section 4.10.

In the other direction (your SBC → platform), a failing TLS handshake shows up as "INVITE sent, no response" with **no** rows in SIP Messages. Run the same `openssl s_client` from the SBC's network against the platform hostname and check its trust store contains ISRG Root X1.

If any of this fails, the issue is at the network or TLS layer, not SIP configuration.

### Step 9 — Escalate {#step-9-—-escalate}

If the above doesn't yield a root cause, open a support request including:

| Field | Why it's needed |
| :---- | :---- |
| Conversation ID | Identifies the specific call for investigation |
| Agent ID | Confirms agent configuration and workspace context |
| Phone number \+ direction | Identifies the trunk/route under test |
| SIP Messages JSON export | Most efficient signal for triage |
| SIP message trace from your side | Useful as a cross‑check |
| Description of failure | Expected vs. actual behaviour |
| Transport in use (TCP / TLS / UDP) | Relevant for transport‑specific issues |
| Error messages or SIP response codes | e.g. 481, 403, 488, 500 |
| (Media issues only) packet capture | RTP analysis from your SBC |

## 11\. Common Errors & Fixes {#11.-common-errors-&-fixes}

### remote error: tls: handshake failure. transaction transport error {#remote-error:-tls:-handshake-failure.-transaction-transport-error}

**Cause:** TLS cannot be established between the platform and your SIP server. Typical reasons: your side offers only TLS 1.0/1.1; a cipher‑suite mismatch (the platform negotiates ECDHE/AES‑GCM suites under TLS 1.2 and the standard TLS 1.3 suites); an SBC that rejects the platform's ALPN `sip` offer; or an SBC that accepts only ECDSA signatures (the platform certificate is RSA).

**Fix:** enable TLS 1.2+ and modern ECDHE/AES‑GCM suites on the SBC; verify with `openssl s_client` (Section 10, Step 8). As an interim measure, fall back to TCP transport.

### tls: failed to verify certificate: x509: cannot validate certificate for \<IP\> because it doesn't contain any IP SANs {#tls:-failed-to-verify-certificate:-x509:-cannot-validate-certificate-for-<ip>-because-it-doesn't-contain-any-ip-sans}

Seen on the **outbound leg of an in‑dialog request** (BYE or REFER) on a TLS trunk: the call connected, but the platform cannot hang up or transfer, and you may see a later `481` because the BYE never landed.

**Cause:** SIP routes by IP — the `Contact` / `Record-Route` your SBC placed in the dialog carries a bare IP, so when the platform opens a new TLS connection back to you it validates your certificate against that IP. Public CAs do not issue IP SANs, so validation fails. **Re‑issuing your certificate with an IP SAN is not the fix** (and your IP may rotate).

**Fix:** on the **inbound** SIP trunk, set **Remote domains** to the FQDN(s) that appear in your certificate's SAN. The platform then validates the chain and accepts the certificate if it covers any listed domain, regardless of the IP it connected to. Requirements: the FQDN must be in a **SAN** (CN‑only is ignored) and the chain must still validate against a public root (Section 4.10). Putting the FQDN in the *outbound* trunk's termination address does **not** help — in‑dialog requests follow the route set, not the outbound trunk.

### x509: certificate signed by unknown authority {#x509:-certificate-signed-by-unknown-authority}

Same leg as above (platform → your SBC over TLS), but a **chain** failure rather than a name failure — Remote domains will not fix it.

**Cause, in order of likelihood:** (1) your SBC sends only the leaf certificate, without intermediates; (2) the certificate is from a private/enterprise CA or is self‑signed (never trusted — there is no way to upload a CA).

**Fix:** configure the SBC to present the full chain, or move to a publicly trusted certificate. Interim workaround: switch the trunk to TCP.

### Inbound INVITE over TLS — "we sent it, ElevenLabs never answered" (and SIP Messages is empty) {#inbound-invite-over-tls-—-"we-sent-it,-elevenlabs-never-answered"-(and-sip-messages-is-empty)}

**Cause:** almost always a **TLS handshake failure at your SBC**. TCP connects (so your logs show the INVITE as "sent") but the TLS session never completes, so the INVITE never reaches the SIP layer and no SIP response can be generated. A failed TLS session leaves **no** row in SIP Messages; a SIP‑level rejection would have produced a 4xx row.

**Checklist (your SBC):** trust store contains **ISRG Root X1** (Let's Encrypt); TLS 1.2+ enabled; certificate validated by **FQDN with SNI** (the platform certificate has no IP SAN and an empty Subject/CN); you are pointing at the right regional/static hostname (Section 2.9) and its **current** A record.

**Fast isolation:** switch the trunk to `sip:…:5060;transport=tcp` for one test call. If TCP connects, the problem is conclusively TLS.

### SIP OPTIONS keepalives unanswered {#sip-options-keepalives-unanswered}

The platform **does** answer OPTIONS with `200 OK` on every host, transport and stack. If your monitoring says otherwise:

* On the **static‑IP UDP path**, send a bare keepalive with **no user part** in the Request‑URI (`OPTIONS sip:<host>:5060`). A request with a user part (`OPTIONS sip:+4470…@…`) is treated as a call attempt, not a ping.  
* Requests carrying scanner‑like `User-Agent` strings, or arriving from a source that has tripped rate limiting, are dropped silently.  
* Most often the OPTIONS simply is not reaching the platform: wrong hostname/stack (e.g. probing the static IP while the number is still on the default stack), unprovisioned source, or a UDP/NAT gap. Confirm with a TCP test.

### Inbound IP allowlist appears to be ignored {#inbound-ip-allowlist-appears-to-be-ignored}

If `allowed_addresses` on the inbound trunk lets calls through from addresses you did not list, check the transport: the source‑IP allowlist is **enforced only for TCP/TLS**. On the (Alpha) UDP path use digest authentication or `allowed_numbers` for admission control.

### 404 / 403 / 502 / 503 on an inbound INVITE (since Oct 2026\) {#404-/-403-/-502-/-503-on-an-inbound-invite-(since-oct-2026)}

Inbound calls that cannot be served are rejected before answer, with a reason phrase: `404` no agent is assigned to the number; `403` the assigned agent is unavailable (a 403 with no agent-related reason phrase is your trunk's ACL / allowed-numbers check, below); `502` your conversation-initiation webhook failed or timed out (15 s); `503` transient platform error. Previously these calls were answered and immediately disconnected, which looked like a one-second call in your CDRs.

**Fix:** assign an agent, re-enable the agent, or fix the webhook; for a persistent `503` escalate with the Conversation ID and the SIP Messages export.

### 429 agent\_daily\_call\_limit\_exceeded from an outbound‑call API {#429-agent_daily_call_limit_exceeded-from-an-outbound‑call-api}

**Cause:** the agent's daily call limit is reached; since Oct 2026 the single-call outbound APIs refuse before dialling.

**Fix:** raise the limit on the agent or wait for the daily reset. Batch and campaign calls are not pre-checked and fail at conversation start instead; both cases also emit a `call_initiation_failure` webhook.

### "Transfer failed: \<reason\>" in the transcript on a SIP conference transfer {#"transfer-failed:-<reason>"-in-the-transcript-on-a-sip-conference-transfer}

**Cause:** the outbound leg to the transferee failed (busy, no answer, 4xx/5xx from your SBC, or the human hung up during a warm-transfer briefing). The reason is the SIP cause your SBC returned.

**Fix:** check the outbound trunk (termination URI, digest credentials, `enabled_codecs`) and that the destination is dialable from that trunk; read the leg in SIP Messages. The agent is still in the call and should offer an alternative.

### Twilio: missing\_account\_auth\_token on import, invalid\_twilio\_auth\_token at call time {#twilio:-missing_account_auth_token-on-import,-invalid_twilio_auth_token-at-call-time}

**Cause:** API-key imports must include the Account Auth Token because the platform verifies Twilio's webhook signatures. At call time the error means the stored token no longer matches Twilio (rotated).

**Fix:** import with `account_auth_token`; after a rotation delete the number and import it again with the current token (re-importing the same SID keeps the old secret).

### INVITE is received but there is no further response {#invite-is-received-but-there-is-no-further-response}

Since Oct 2026 a matched number answers with a 4xx/5xx instead (above), so continued silence after `100 Trying` means the destination number itself did not match any imported number, or on TLS the request never reached the SIP layer.

**Cause:** Destination phone number cannot be matched. Common reasons:

* Number dialled without country code or in a format that does not match the imported number.  
* Call directed to the wrong SIP endpoint.

**Fix:** Open SIP Messages for the call to confirm exactly what `To` header was received. Confirm the SIP endpoint shown on the phone number settings page, and verify dialled format matches imported format exactly.

### 481 Call doesn't exist {#481-call-doesn't-exist}

**Cause:** SIP server cannot find the referenced call. Either:

* The call has already ended.  
* A follow‑up message (BYE, NOTIFY, ACK) was sent to the load balancer rather than to the specific server address in the `Contact` header of the 200 OK.

**Fix:** Ensure all in‑dialog signalling is directed to the URI in the `Contact` header of the 200 OK — not to the load balancer hostname.

### 488 Not Acceptable Here on INVITE {#488-not-acceptable-here-on-invite}

**Cause:** SDP negotiation failure — no common codec, or media‑encryption requirements that cannot be reconciled.

**Fix:** Inspect both SDPs in SIP Messages. Ensure at least one shared codec (G.711 PCMA/PCMU is universally compatible). Align media encryption settings on the outbound trunk and your SBC.

### Call connects but audio is silent in both directions {#call-connects-but-audio-is-silent-in-both-directions}

**Cause:** Codec was negotiated but is not actually being produced/consumed correctly, or RTP is being blocked at the network layer.

**Fix:** Re‑examine SDP exchange to confirm codec and media addresses/ports. Check that RTP UDP ports are open at your SBC. If the media path includes NAT, confirm that your SBC is rewriting the `c=` connection address in SDP.

### 403 Forbidden on INVITE {#403-forbidden-on-invite}

**Cause:** Your inbound trunk has IP allowlist or `allowed_originating_numbers` configured and the call did not match.

**Fix:** Check inbound trunk configuration. Add the originating IP/number, or remove the restriction if intentional.

### Transfer via SIP REFER never completes (no NOTIFY received) {#transfer-via-sip-refer-never-completes-(no-notify-received)}

**Cause:** Either (1) firewall is blocking traffic from the call‑handling server, or (2) your SBC accepted the REFER (sent 202\) but does not implement subscription‑state NOTIFYs.

**Fix:** Confirm the firewall (Section 4.4). Then check your SBC's SIP REFER configuration — many SBCs require explicit configuration to send NOTIFYs back with the transfer result.

### 403 Forbidden on REFER (TLS only — works on TCP) {#403-forbidden-on-refer-(tls-only-—-works-on-tcp)}

**Symptom:** SIP REFER initiated by the platform is rejected by your SBC with `403 Forbidden`. Switching the trunk's signalling transport from TLS to TCP makes the same REFER succeed. The REFER method is permitted in your dialplan and the Refer‑To destination is allowed.

**Likely area:** The on‑wire difference between the two cases is the platform's `Contact` header — an **IP address** under TCP, a **hostname** under TLS. REFER creates an implicit subscription, so before accepting it your SBC needs to be confident it can route the resulting NOTIFYs back to that Contact. With a hostname under TLS, additional SBC validation can fire that has nothing to evaluate under TCP. The exact check is SBC‑specific and only the SBC's own log will name it.

**Possible causes** (any one can produce a 403 on the REFER):

* **Source‑IP / Contact binding** — SBC verifies that the Contact host resolves to (or matches) the source IP of the dialog. With a hostname this requires DNS resolution and can mismatch.  
* **TLS peer identity (RFC 5922\)** — the certificate presented on the connection must cover the Contact's hostname (SAN/CN). If the SBC's trust store does not chain to the platform's edge cert, or the SAN does not match, the SBC may reject the REFER because it cannot validate the return path.  
* **Connection reuse (RFC 5923\)** — if the SBC concludes it must open a *new* TLS connection to the Contact's hostname for NOTIFYs rather than reuse the existing one, and that new connection is blocked or fails certificate validation, the REFER may be rejected up front.  
* **`sip:` vs `sips:` scheme mismatch (RFC 5630\)** — some SBCs require `sips:` in the Contact for TLS dialogs and reject `sip:;transport=tls`.  
* **Other vendor‑specific in‑dialog policy** — individual SBCs may apply additional checks against the Contact host that are not covered above.

**Fix:**

1. **Short‑term workaround:** run the trunk's signalling on TCP. Media (SRTP) is independent of signalling transport.  
2. **Narrow the cause:** capture your SBC's logged reason for the specific 403 (cert mismatch, source‑IP mismatch, no route, scheme mismatch). Share that line when escalating.  
3. **SBC‑side adjustment** (once cause is identified): the relevant in‑dialog Contact / source‑IP / TLS validation can typically be relaxed on a per‑trunk basis on most carrier‑grade SBCs (Oracle/ACME, AudioCodes, Sansay, Sonus/Ribbon).

## 12\. Example: Successful Outbound SIP Handshake {#12.-example:-successful-outbound-sip-handshake}

Annotated example of a complete outbound call handshake. Use as a reference when validating your SIP configuration.

**INVITE (Platform → Your SIP server)**

`INVITE sip:+10000000000@your-sip-server.example.com;transport=tcp SIP/2.0`  
`Via: SIP/2.0/TCP <platform-ip>:5060;branch=z9hG4bK.xxxxx;alias`  
`CSeq: 1 INVITE`  
`Call-ID: <unique-call-id>`  
`To: <sip:+10000000000@your-sip-server.example.com;transport=tcp>`  
`From: "+10000000000" <sip:+10000000000@<platform-ip>:5060;transport=tcp>;tag=xxxx`  
`Contact: <sip:<platform-ip>:5060;transport=tcp>`  
`Content-Type: application/sdp`  
`Allow: INVITE, ACK, CANCEL, BYE, NOTIFY, REFER, MESSAGE, OPTIONS, INFO, SUBSCRIBE`  
`Max-Forwards: 70`  
`X-Conversation-ID: conv_abcd1234`

**100 Trying (Your SIP server → Platform)**

`SIP/2.0 100 Trying`  
`Via: SIP/2.0/TCP <platform-ip>:5060;rport=5060;received=<platform-ip>;branch=z9hG4bK.xxxxx;alias`  
`Call-ID: <unique-call-id>`  
`CSeq: 1 INVITE`

**200 OK (Your SIP server → Platform — call answered)**

`SIP/2.0 200 OK`  
`Via: SIP/2.0/TCP <platform-ip>:5060;rport=5060;received=<platform-ip>;branch=z9hG4bK.xxxxx;alias`  
`Call-ID: <unique-call-id>`  
`Contact: <sip:<your-external-ip>:5060;transport=TCP>`  
`CSeq: 1 INVITE`  
`Supported: 100rel, timer, replaces, norefersub`  
`Content-Type: application/sdp`

**BYE (Your SIP server → Platform — call ended)**

`BYE sip:<platform-ip>:5060;transport=tcp SIP/2.0`  
`Via: SIP/2.0/TCP <your-external-ip>:5060;rport;branch=z9hG4bKxxxx;alias`  
`Call-ID: <unique-call-id>`  
`CSeq: 2 BYE`  
`Reason: Q.850;cause=16`

**200 OK (Platform → Your SIP server — BYE confirmed)**

`SIP/2.0 200 OK`  
`Call-ID: <unique-call-id>`  
`CSeq: 2 BYE`

**Indicators of a healthy handshake:**

* `Contact` header in your 200 OK contains your **external** address — not internal or NAT.  
* `Call-ID` is identical across every message in the exchange.  
* `CSeq` increments correctly across requests.  
* BYE is acknowledged with a 200 OK — not silence or an error code.  
* All of the above messages appear in the SIP Messages view for the conversation.

## 13\. FAQ {#13.-faq}

**Q: From which IPs do platform SIP messages originate? What can I whitelist?**

Default stack: the initial inbound INVITE goes to `sip.rtc.…`; everything the platform *sends* (outbound INVITE, BYE, REFER, NOTIFY) comes from dynamic server IPs that cannot be enumerated — do not build IP rules on it. Static‑IP stack: all platform signalling (and relayed media) comes from `199.88.252.0/24` and you point your trunk at `sip-static.rtc.…`. Getting onto the static stack is a per‑workspace enablement followed by a one‑click **Migrate** per number (Sections 1.6, 4.4).

**Q: Which hostname do I use for an EU / India / Singapore data‑residency workspace?**

The residency variant: `sip.rtc.eu.residency.elevenlabs.io`, `sip.rtc.in.residency.elevenlabs.io`, `sip.rtc.sg.residency.elevenlabs.io` (or the `sip-static.rtc.<region>.residency…` equivalents). The global hostname cannot see a residency workspace's numbers. NAPTR/SRV records exist and prefer TLS; give host, port and transport explicitly if you intend TCP.

**Q: Should we send a REGISTER request to the platform?**

No. The platform uses trunking mode exclusively. REGISTER is neither required nor supported.

**Q: What transport protocols are supported?**

TCP (5060) and TLS (5061) everywhere; UDP (5060) only on the static‑IP stack, marked Alpha. TCP is recommended for production. TLS is fully supported but has strict certificate rules (Section 4.10) and the inbound‑termination limitation in Section 15\.

**Q: Do you support mutual TLS or a client certificate we issue?**

No. SIP TLS is one‑way in both directions: the platform validates *your* server certificate when it dials you and presents its own Let's Encrypt certificate when you dial it. There is no way to upload a customer CA or client certificate, and no field to require one. Treat mTLS requirements as a product gap and escalate.

**Q: Can we use a self‑signed or internal‑CA certificate on our SBC?**

No. The platform validates against public root CAs only and offers no pinning/upload knob. Use a publicly trusted certificate (Let's Encrypt is fine) with the FQDN in a SAN, and list that FQDN under Remote domains.

**Q: The platform "doesn't answer our OPTIONS pings".**

It does — on every host, transport and stack. Send a bare `OPTIONS sip:<host>` with no user part on the UDP static path, make sure you are probing the stack the number is actually on, and see Section 11\.

**Q: An outbound call is failing to connect. Where do I start?**

Confirm port reachability and, for TLS, `openssl s_client` (Section 10 Step 8). Then open SIP Messages and walk the dialog (Section 10 Step 3). If no INVITE shows up on your side and no messages were captured, escalate with the Conversation ID.

**Q: How do I correlate a platform conversation with our SBC/carrier CDRs?**

Use `system__call_id` — the SIP `Call-ID` of the INVITE, available as a dynamic variable, in the conversation‑initiation webhook payload and in post‑call data (Section 6.5). SIP message logging shows the same `Call-ID` on every captured message.

**Q: Which codec should we offer?**

Offer G.722 first with G.711 (PCMA/PCMU) as fallback. G.722 is offered by default on outbound trunks and gives markedly better speech quality than G.711. G.729/AMR are feature‑gated and need the static‑IP stack (transcoded).

**Q: Can the agent read DTMF the caller presses? Does SIP INFO work?**

Yes — enable **DTMF input** on the agent (GA since Aug 2026). Digits must arrive as RFC 4733 `telephone-event` RTP (or Twilio `dtmf` events / Genesys AudioHook events). **SIP INFO and in‑band tones are not decoded.** Digits reach the LLM as a `[DTMF input: …]` user turn; enable `redact_input` for PINs (Section 5.4.2).

**Q: What is the difference between Conference and SIP REFER transfer?**

See Section 8\. In short: Conference bridges in the destination (Twilio and Exotel deliver a spoken briefing, Twilio optionally with keypress screening; on a SIP trunk it is a direct merge unless the SIP warm transfer is enabled, which speaks the briefing in the agent's voice first); SIP REFER hands the transfer to your SIP infrastructure to execute.

**Q: Can the human hear a briefing on a SIP‑trunk transfer?**

Yes, with the **SIP warm transfer** (limited availability since Oct 2026): the platform dials the human on a consult leg, speaks the agent's summary in the agent's voice (optionally after they press 1, with 2 to connect) and only then bridges the caller. It needs an outbound trunk on the number and enablement for the workspace; where not enabled the rule runs as a cold conference transfer. REFER never carries a spoken briefing.

**Q: What happens when a Twilio conference transfer is not answered?**

The agent has already left (it leaves as soon as the human is dialled). After Twilio's ring timeout, a busy signal, a decline or an unanswered screening prompt, the caller hears "We're sorry, we could not connect your call." and the call ends (Sep 2026). Design the prompt or workflow so the caller knows a callback is possible, and use screening when a mailbox must not receive the caller.

**Q: Can SIP REFER transfer to a SIP URI rather than a phone number?**

Yes. SIP REFER supports both E.164 phone numbers and SIP URIs, including URI parameters and headers (`sip:ivr@pbx.example.com;ext=2`, `…?X-Queue=billing`). Conference and Blind only support phone numbers.

**Q: Does the SIP REFER transfer INVITE include the Conversation ID?**

Yes — automatically, as `X-Conversation-ID` on the REFER and the resulting INVITE leg, together with `X-Caller-ID`. These two are platform‑owned: a per‑rule custom header with the same name is dropped, not merged.

**Q: X‑headers or UUI — which should we use to pass context on a REFER?**

If the downstream system is a contact center that consumes RFC 7433 `User-to-User` (Genesys Cloud BYOC, Talkdesk, Avaya), use **UUI** — and set the protocol discriminator the way that platform expects (Genesys: prefix `00`). If it is a PBX/SBC/CTI layer that reads arbitrary headers, use **X‑headers** (up to 20). You can send both. Inbound, the platform decodes a `User-to-User` header on the INVITE into `sip_uui_data` (and `sip_uui_raw`) and exposes your `X-*` headers as `sip_<name>` dynamic variables (Section 4.9).

**Q: The receiving contact center hears ringing on the transferred leg. Why?**

By default the platform plays a ring tone to the caller while a SIP REFER completes, carried over RTP to the peer executing the REFER. Turn off **`sip_refer_play_dialtone`** on that transfer rule; the caller then hears silence until connected.

**Q: Can I transfer into a downstream IVR that requires an extension?**

For Twilio Blind and Conference, use `post_dial_digits` (e.g. `w1234#`; `w` \= 0.5 s, `W` \= 1 s pause). For SIP REFER, post‑dial DTMF is not supported — pass the extension as a URI parameter or in a custom header/UUI and have your downstream system inject the digits.

**Q: What happens when the agent is at its concurrency limit?**

With **call queueing** enabled on the agent (generally available; on by default for agents created from Oct 2026, Section 6.6) callers are held with hold audio for up to the configured wait time (default 3 min, max 30 min); queue time is not billed. Without it the call is answered and dropped. Outbound calls over the agent's daily limit are refused with HTTP 429 before dialling, and every limit rejection emits a `call_initiation_failure` webhook.

**Q: Do you support Twilio's answering machine detection?**

Yes, since Sep 2026, as an opt-in per outbound Twilio call (`telephony_call_config.twilio_machine_detection`): choose `enable` or `detect_message_end`, optionally add `hang_up` rules per verdict, and subscribe to the `answering_machine_detection` webhook event for the verdict. It runs alongside the LLM voicemail-detection tool, which remains the only option on SIP trunks and Exotel (Section 5.5.7).

**Q: We run Amazon Connect / AudioCodes VoiceAI Connect / Avaya Infinity. Do we need a SIP trunk?**

Not necessarily. All three have native WebSocket transports (Amazon Connect and AudioCodes in limited availability, Avaya in early access) authenticated with your ElevenLabs API key; the call stays on your platform and no number is imported (Section 7.3). The trade-off is that SIP features (X-headers, REFER, SIP message logging) and the transfer-to-number tool do not apply there; Amazon Connect escalates through its own flow branch instead. A SIP trunk through your SBC remains the fallback for everything else.

**Q: Can we control the caller ID or the From header on outbound SIP calls?**

The caller ID is always the imported number. On request the domain part of the From URI can be pinned to a fixed platform SIP hostname for carriers that validate it; there is no per-call display name, P-Asserted-Identity or Privacy header control.

**Q: How long are SIP messages kept?**

7 days from capture (since Oct 2026; previously 30), then deleted automatically. Export the JSON for anything you need to keep.

**Q: How do I capture SIP traffic for support?**

Enable **SIP message logging** (Section 9\) and reproduce. Export the SIP Messages JSON for the affected conversation and attach it to your ticket together with the Conversation ID and `system__call_id`.

## 14\. Pre‑Go‑Live Checklist {#14.-pre‑go‑live-checklist}

**Routing & numbers**

* SIP URI includes the phone number in the user part; leading `+` is consistent between the SIP URI and the imported number  
* The trunk points at the hostname for the **right region and stack** (Section 2.9) — `sip.rtc.…` vs `sip-static.rtc.…`, residency suffix where applicable; if the SBC resolves by NAPTR/SRV it will prefer TLS, so pin the transport explicitly if you intend TCP  
* An agent is assigned to the imported number; environment/branch pins (if any) are intentional

**Transport & security**

* Transport is TCP 5060 or TLS 5061 (UDP only on the static stack, and only with the ACL caveat understood)  
* TLS: certificate chains to a public root, full chain is sent, FQDN is in a SAN, TLS 1.2+, EKU `serverAuth` — verified with `openssl s_client` (Section 4.10)  
* TLS: **Remote domains** on the inbound trunk lists the FQDN in your certificate's SAN  
* Your SBC trusts ISRG Root X1 and validates the platform certificate by FQDN with SNI  
* Digest authentication configured on the outbound trunk; `allowed_numbers` / `allowed_addresses` on inbound as policy requires (ACL is TCP/TLS only)  
* Firewall: default stack — accepts platform signalling from any IP, **not just the load balancer**; static stack — `199.88.252.0/24` allowlisted for signalling (and media if RTP is restricted)  
* `Contact` and `Via` headers reflect your external SIP server address

**Media**

* Codec verified via SDP negotiation (G.722 preferred, G.711 fallback); `enabled_codecs` trimmed if the PBX misbehaves on unexpected codecs  
* Media encryption requirement matches between sides (SRTP REQUIRED on one side without RTP fallback on the other will fail)  
* `telephone-event` advertised if callers will use the keypad; DTMF input enabled on the agent (with `redact_input` for PINs)

**Transfers**

* If using Conference transfer on SIP: an outbound trunk is configured on the number  
* If using SIP REFER: REFER permitted in the dialplan, subscription‑state NOTIFYs configured, `sip_refer_play_dialtone` decided, UUI/X‑header contract agreed with the downstream system  
* Warm vs cold decided per destination: SIP warm transfer enabled for the workspace if a spoken briefing is required on SIP; on Twilio, screening on where a mailbox must never receive the caller, and the no‑answer behaviour (apology \+ hang‑up) understood  
* Twilio numbers imported with the Account Auth Token; AMD and per‑verdict hang‑up configured for outbound campaigns if wanted  
* At least one transfer tested end‑to‑end with the REFER/NOTIFY exchange read in SIP Messages; workflow failure edge in place

**Observability**

* **SIP message logging is enabled** on the phone number (Section 9\) before the first test calls (7‑day retention — export what you need to keep)  
* `call_initiation_failure` and, for Twilio AMD, `answering_machine_detection` webhook events subscribed where outbound reporting matters  
* `system__call_id` / `system__call_sid` captured in your CRM or post‑call webhook for CDR correlation

## 15\. Known Limitations & Workarounds {#15.-known-limitations-&-workarounds}

| Limitation | Status | Recommended workaround |
| :---- | :---- | :---- |
| **Agent‑initiated hangup does not always terminate TLS inbound calls** | Reported May 2026; not re‑verified since | Use TCP transport for inbound SIP calls; if you can reproduce it, capture SIP Messages (look for the BYE and its response) and escalate |
| **SIP signalling errors do not appear in conversation history natively** | Mitigated by SIP message logging (Section 9\) | Enable `store_sip_messages`; review the SIP Messages view alongside conversation history within the 7‑day retention window |
| **Default stack cannot allowlist platform IPs** | By design | Migrate the workspace's numbers to the static‑IP stack (`199.88.252.0/24`, Sections 1.6 / 4.4); Enterprise plans |
| **Inbound IP allowlist (`allowed_addresses`) is not enforced on UDP** | By design (UDP is Alpha, static stack only) | Digest authentication and/or `allowed_numbers` |
| **No mutual TLS / customer client certificates on SIP** | Not supported; no known roadmap item | One‑way TLS \+ digest auth \+ static‑IP allowlisting; escalate mTLS mandates as a product gap |
| **Self‑signed / private‑CA certificates rejected** | By design | Publicly trusted certificate with the FQDN in a SAN; Remote domains set |
| **No caller‑ID / From override per call on SIP; no P‑Asserted‑Identity or Privacy headers** | By design | The From user part is always the imported number; the From domain can be pinned on request (Section 6.3) |
| **SIP REFER does not support post‑dial DTMF** | By design | Extension as a SIP URI parameter (`;ext=…`) or in a custom header / UUI, injected by your downstream system |
| **Spoken warm handoff on SIP requires the SIP warm transfer, which is in limited availability** | Rolling out (Oct 2026\) | Ask your ElevenLabs contact; meanwhile Twilio or Exotel Conference for a spoken briefing, or SIP REFER \+ UUI / X‑headers for screen‑pop |
| **Twilio Conference: the agent leaves as soon as the human is dialled; no‑answer ends the call with an apology** | By design (Sep 2026\) | Use screening so mailboxes cannot accept; set caller expectations in the prompt; use a workflow failure edge for synchronous errors |
| **Per‑rule custom X‑headers and UUI not carried on SIP‑trunk Conference legs** | By design | Trunk‑level static `headers` on the outbound trunk, or use SIP REFER |
| **UUI only on SIP REFER to SIP URI destinations** | By design | Use a SIP URI destination, or pass context in X‑headers |
| **Conference transfer requires a pre‑configured outbound trunk on the SIP path** | By design | Configure an outbound trunk on the phone number, or use SIP REFER instead |
| **Transfer‑to‑number and the play‑DTMF tool are not available on the Genesys, AudioCodes, Avaya and Amazon Connect transports** | By design (no SIP leg the platform controls) | Hand back to the partner flow (Genesys output variables, Amazon Connect escalate); collect digits upstream |
| **Amazon Connect does not deliver custom contact attributes** | AWS platform behaviour | Fetch them in the conversation‑initiation webhook or a tool keyed on the contact ID |
| **Carrier answering‑machine detection only on Twilio outbound calls** | By design | LLM voicemail‑detection tool on SIP trunks and Exotel |
| **G.729 / AMR require transcoding** | On request; static‑IP stack only | Ask your ElevenLabs contact; otherwise negotiate G.722 / G.711 |
| **Wait queue not available for outbound/batch calls or the Genesys, AudioCodes, Exotel, WhatsApp and SMS channels** | By design | Size concurrency for peak; use `call_initiation_failure` webhooks to retry outbound |
| **DTMF call screening: Twilio Conference and SIP warm transfer only, limited availability** | Rolling out | Ask your ElevenLabs contact; on REFER use UUI/X‑headers screen‑pop |
| **AudioCodes VoiceAI Connect and Amazon Connect transports are enabled per workspace; Avaya Infinity is early access** | Limited availability | Request enablement; connect over a SIP trunk through your SBC in the meantime |
| **Microsoft Teams, NICE, Talkdesk, Five9, Cisco Webex CC have no native channels** | By design | Front them with your SBC and present the call as a generic SIP trunk (Five9 AI Agent Connect and Talkdesk UUI ride on SIP) |

## 16\. Change Log Since May 2026 {#16.-change-log-since-may-2026}

Platform changes surfaced by the September and October 2026 revisions (dates are when the change landed; items in limited availability may not be visible in a given workspace):

| Date | Change | Where in this guide |
| :---- | :---- | :---- |
| 2026-05-08 | Phone numbers can pin an agent **environment** and **branch** | 6.1 |
| 2026-05-14 | **Custom SIP BYE headers** — `attributes_to_headers` maps dynamic variables to headers on the platform's BYE | 4.9, 6.2, 6.3 |
| 2026-05-23 | **Exotel** added as a third managed phone‑number provider; warm‑transfer whisper followed 2026-06-09 | 1.5, 7.3 |
| 2026-06-10 | **Configurable outbound codecs** (`enabled_codecs`) | 4.7, 6.3 |
| 2026-06-25 | **UUI (RFC 7433\) on SIP REFER**; payload limit raised to 8192 bytes 2026-07-02; UI 2026-08-07 | 4.9, 8.1.1 |
| 2026-06-26 | **Two‑stage DTMF call screening** for Twilio Conference transfers (`require_acceptance`, feature‑gated); briefing made interruptible 2026-08-26 | 8.1.1, 8.2 |
| 2026-06-29 | **Static‑IP SIP stack** fronted by an SBC / media relay: static signalling \+ media IPs, UDP (Alpha), codec transcoding, one‑click Migrate; **G.722 offered by default** | 1.6, 2.9, 4.4, 4.7 |
| 2026-07-07 | Twilio inbound webhook **signature verification** hardened | 7.2 |
| 2026-07-16 | **SIP message logging retention set to 30 days** | 9.6 |
| 2026-07-20 | Twilio **call recording** option for platform‑originated calls (`twilio_call_recording_enabled`) | 7.2 |
| 2026-07-23 | Twilio Media Stream **status callbacks** for authoritative stream‑failure detection | 7.2 |
| 2026-07-29 | **DTMF input redaction** (`redact_input`) | 5.4.2 |
| 2026-08-03 | Platform synthesizes silence when Twilio stops sending audio frames | 7.2 |
| 2026-08-05 | **AudioCodes VoiceAI Connect** WebSocket transport (feature‑gated); **DTMF input on Genesys AudioHook** | 5.4.1, 7.3 |
| 2026-08-06 | Transfer headers / UUI / destinations resolve dynamic variables **at transfer execution time** | 4.9 |
| 2026-08-07 | **`transfer_to_genesys_bot`** system tool \+ Genesys transfer workflow node; SIP URI destinations accept **URI parameters / headers** | 7.3, 8.7 |
| 2026-08-10 | Avaya conversation source / auth method added ahead of a native transport (not GA); wait‑queue admission for Twilio inbound (feature‑gated) | 7.3, 6.6 |
| 2026-08-12 | **`system__call_id`** (SIP `Call-ID`) exposed as a dynamic variable and in the conversation‑initiation webhook | 6.5 |
| 2026-08-13 | Paginated phone‑number listing with label/number filters, sorting and `supports_outbound`; API‑key‑imported Twilio numbers handled in signature verification | 6.1, 7.2 |
| 2026-08-17 | Workflow phone‑transfer node can **continue after a failed transfer** (failure edge) | 8.8 |
| 2026-08-19 | Max‑duration farewell is spoken on voice calls before hangup | — |
| 2026-08-20 | **Wait queue** for SIP‑trunk and WebSocket callers (feature‑gated); custom **hold audio** 2026-08-24 | 6.6 |
| 2026-08-26 | **DTMF input generally available** (flag removed); **`sip_refer_play_dialtone`** makes the REFER ring tone configurable | 5.4.2, 8.1.1 |
| 2026-09-02 | **Twilio answering machine detection** configurable per outbound call, verdict delivered as the `answering_machine_detection` webhook event; SIP conference legs tolerate 30 s without audio; the agent's own number is matched with or without `+` | 5.5.7, 8.5 |
| 2026-09-10 | Signature verification on every Twilio webhook; **Account Auth Token required for API‑key imports** (2026-09-15) | 7.2 |
| 2026-09-11 | Twilio Conference: an unanswered, busy or declined human now ends the call with a spoken apology to the caller instead of an indefinite hold | 8.5, 8.8 |
| 2026-09-14 | **Call queueing** generally available; on by default for new agents from 2026-10-05 | 6.6 |
| 2026-09-17 | **Avaya Infinity** native WebSocket transport (early access) | 7.3 |
| 2026-09-18 | Paginated phone‑number list (`GET /v1/convai/v2/phone-numbers`) in the public API | 6.1 |
| 2026-09-22 | `call_initiation_failure` webhook also fired for concurrency, daily‑limit and queue rejections | 6.5, 6.6 |
| 2026-09-23 | **Amazon Connect** native A2A voice transport (limited availability); escalation through a transfer rule on 2026-09-29 | 7.3, 8.1.1 |
| 2026-09-25 | **Per‑provider transfer rules** (one configuration per provider per rule); older transfer lists unchanged | 8.1 |
| 2026-09-30 | From‑header domain selectable on outbound SIP trunks (on request) | 6.3 |
| 2026-10-01 | Inbound SIP calls that cannot be served are **rejected at SIP level** (404 / 403 / 502 / 503 with a reason phrase) instead of answered and dropped | 6.4, 10, 11 |
| 2026-10-07 | `phone_call.call_result` on conversations (`answered`, `voicemail`, `busy`, `no_answer`, `failed`); campaign attempt metadata on 2026-10-08 | 6.5 |
| 2026-10-09 | Exotel number ownership verified at import | 7.3 |
| 2026-10-13 | Outbound‑call APIs return **429** when the agent's daily call limit is reached | 6.6, 11 |
| 2026-10-14 | **SIP warm transfer** with optional keypress acceptance (limited availability); **SIP message retention reduced to 7 days**; Twilio AMD per‑verdict **hang‑up actions** (public API 2026-10-15) | 8.5, 9.6, 5.5.7 |
| 2026-10-19 | Campaigns from a SIP number accept PBX‑style dial strings (digits, `+`, `*`, `#`) instead of strict E.164 | — |
| 2026-10-26 | DNS NAPTR/SRV records confirmed live for all SIP hosts (TLS preferred) | 2.9 |

Corrections to the September 2026 text (verified against the platform on 2026-10-26):

* **NAPTR/SRV records now exist** for all SIP hosts and prefer TLS; the September text said none were published.  
* A **failed SIP REFER leaves the agent in the call** (the error is returned to the LLM); the September text said the call ended.  
* On **Twilio Conference the agent leaves as soon as the human is dialled**; downstream no‑answer ends the call with an apology, it is not surfaced to the agent.  
* **UUI rides only on REFER to a SIP URI** destination; it is dropped for phone‑number destinations.  
* The default outbound codec order is **PCMU, PCMA, G.722**, and the `enabled_codecs` order is the SDP preference order.  
* **Genesys AudioHook does not support transfer‑to‑number**; hand back to the flow instead. The **wait queue is generally available**, not a staged rollout.

Corrections to the May 2026 text that were wrong or incomplete at the time (not platform changes):

* The `IP SANs` TLS error is fixed by **Remote domains** on the inbound trunk, not by re‑issuing a certificate with an IP SAN (Section 11).  
* Genesys **AudioHook is a natively supported transport** (since 2025); the earlier text said it was not used.  
* **SIP INFO** DTMF is not supported in any configuration; only RFC 4733 `telephone-event` (Section 5.4.1).  
* `X-Conversation-ID` / `X-Caller-ID` **cannot be overridden** by per‑rule headers — platform values win.  
* Added the TLS certificate requirements, the no‑mTLS and no‑self‑signed positions, regional/residency SIP hostnames, DNS resolution behaviour, and the OPTIONS keepalive behaviour, none of which were documented before.


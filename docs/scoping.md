# NovaMart Voice Agent: Scoping Document

## Business outcome
The primary goal is **deflection**: resolve routine inbound calls (order status, policy questions, product questions, address changes) without a human agent. This frees human agents for exceptions, so handle time on the calls they do take goes down. **CSAT** is a guardrail metric: deflection must not come at the cost of customer satisfaction, so the agent escalates quickly when it cannot help.

## In scope
| Intent | What the agent does |
|---|---|
| Order inquiry | Collects the order ID and calls `lookup_order`; reports status, items, and expected delivery date. |
| Returns | Answers policy questions from the knowledge base, checks eligibility, and explains how to start a return. |
| Product questions | Answers and recommends from the 10-product Nova catalog only. |
| Shipping address change | Verifies identity with `verify_identity` (max 3 attempts), then calls `update_shipping_address` for processing orders only. |
| Escalation | Transfers to a human on request or when out of scope. |

## Out of scope, and how each is handled
| Request | Handling |
|---|---|
| Order cancellation, refunds, warranty or damage claims, policy exceptions | Transfer to a human agent with a short summary. |
| Competitor products or prices, price matching | Politely declines and steers back to NovaMart products. |
| Unrelated topics (general chit-chat, advice, news) | Declines once, restates what it can help with; ends the call if the caller persists. |
| Payment or account changes (cards, passwords, email) | Directs the caller to novamart.example or transfers to a human agent. |
| 3 failed identity verifications | Stops the address change and transfers to a human agent. |

## Evaluation criteria
1. **Verification gate holds:** in 100% of conversations, `update_shipping_address` is called only after `verify_identity` returned `success: true` in the same conversation.
2. **Order data is grounded:** every status, item, and delivery date the agent states matches the `lookup_order` response; when the response is `not_found`, the agent says so and does not invent an order.
3. **Correct escalation:** out-of-scope requests and the 3rd failed verification end in a `transfer_to_number` call or a clear handoff within 2 agent turns, never in a made-up answer.

## Autonomy vs. control
The agent sits in the **middle of the dial, leaning toward control**. For informational intents (orders, products, policy) it runs freely: it is read-only, low risk, and answers from tools or the knowledge base. For the one action that changes data (the shipping address), control is **structural, not prompt-based**: a workflow with a dispatch tool node for `verify_identity` and deterministic success/failure edges, where only the post-verification subagent has access to `update_shipping_address`. A wrong address change costs a real delivery and exposes customer data, so that path must not depend on the LLM following instructions.

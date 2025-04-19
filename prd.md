# PRD: Relationship Text Debug (Hackathon MVP v4 - WhatsApp MCP & Mem0)

## 1. Introduction & Goal

This document outlines the requirements for the "Relationship Text Debug" service, a **hackathon MVP**. The goal is to build a **minimal viable tool** that allows users to interact via commands sent to an **MCP server**, which in turn interacts with their **personal WhatsApp account** via an **unofficial bridge**. The system will use two core agents (Conversation Debugger, Response Drafter) sharing context via **Mem0** and retrieving relevant information using **Pinecone**. A simple **web client display** shows results.

**Architecture:** This relies on a two-component system:
1.  **Go WhatsApp Bridge:** Connects to the user's personal WhatsApp account using the `whatsmeow` library (unofficial WhatsApp Web API), handles QR code auth, stores messages locally (e.g., SQLite), and exposes an API for the Python server.
2.  **Python MCP Server (FastAPI):** Implements MCP tools, orchestrates agents, interacts with Mem0/Pinecone, and communicates with the Go bridge to send/receive WhatsApp messages.

**Disclaimer:** This approach uses unofficial libraries (`whatsmeow`) to interact with WhatsApp Web, which is inherently unstable, prone to breaking, and may violate WhatsApp's Terms of Service.

**Sources:**
*   WhatsApp Interaction Library: [whatsmeow (unofficial)](https://github.com/tulir/whatsmeow)
*   Reference MCP Implementation: [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp)
*   Pinecone: [https://docs.pinecone.io/guides/get-started/quickstart](https://docs.pinecone.io/guides/get-started/quickstart), [https://docs.pinecone.io/assistant-release-notes/2025](https://docs.pinecone.io/assistant-release-notes/2025) (Accessed April 2025)
*   Mem0: [https://github.com/mem0ai/mem0](https://github.com/mem0ai/mem0), [https://docs.ag2.ai/docs/ecosystem/mem0/](https://docs.ag2.ai/docs/ecosystem/mem0/) (Accessed April 2025)

## 2. Target Audience

Primarily couples aged 25-40 experiencing communication challenges in text-based arguments (specifically WhatsApp).

## 3. Core MVP Features

Focus on the absolute minimum required to demonstrate the concept via MCP interactions controlling personal WhatsApp.

*   **WhatsApp Connection & Interaction (via MCP Server & Go Bridge):**
    *   User connects their personal WhatsApp account to the **Go Bridge** via **QR code scan**.
    *   Users (or an integrated agent/tool) interact by calling **MCP tool endpoints** on the **Python MCP Server** (e.g., `/mcp/search_messages`, `/mcp/send_message`).
    *   The Python server translates MCP calls into requests to the **Go Bridge API**.
    *   The Go Bridge uses `whatsmeow` to perform actions (read/send messages) on the user's linked WhatsApp account.
    *   The linked WhatsApp session ID (managed by the Go Bridge) serves as the user identifier for Mem0/Pinecone.

*   **Web Client Display (Controlled via Backend):**
    *   A **very basic, read-only web page** displaying:
        *   Conversation snippets retrieved via MCP calls.
        *   Key insights from the `ConversationDebugAgent`.
        *   Drafted responses from the `ResponseDrafterAgent`.
    *   Updates to this display are **triggered by backend actions** resulting from MCP tool usage or agent processing. *The user does not interact directly with this display in the MVP.*

*   **Agent-Driven Analysis & Drafting (Triggered via MCP):**
    *   `ConversationDebugAgent`:
        *   Triggered by an internal call or an MCP tool invocation.
        *   Retrieves specified recent conversation context by calling the Go Bridge (via the Python server's MCP interface) and uses **Mem0**/**Pinecone**.
        *   Performs simplified analysis.
        *   Stores analysis summary in **Mem0** for the `ResponseDrafterAgent`.
        *   Updates the Web Client Display via the backend.
    *   `ResponseDrafterAgent`:
        *   Triggered by an internal call or MCP tool invocation.
        *   Uses context from **Mem0**/**Pinecone** and potentially the Go Bridge (via MCP) to draft response options.
        *   Sends drafted responses back to the user's WhatsApp by calling the `send_message` MCP tool (Python Server -> Go Bridge -> WhatsApp).
        *   Updates the Web Client Display via the backend.

*   **Shared Memory & Context Retrieval:**
    *   **Mem0:** Stores recent conversation history, agent analysis summaries, etc., within the session scope, shared between agents. Keyed by the Go Bridge's session identifier. [Ref: Mem0 Docs]
    *   **Pinecone:** Stores vector embeddings of conversation segments for semantic retrieval. [Ref: Pinecone Docs]
    *   **Go Bridge Storage (e.g., SQLite):** The Go bridge maintains its own local storage of message history retrieved via `whatsmeow`.

## 4. Technology Stack (MVP)

*   **WhatsApp Interaction:** Go WhatsApp Bridge using `whatsmeow` (unofficial library).
*   **Backend Interface:** Python MCP Server (FastAPI) providing MCP tool endpoints.
*   **Bridge <-> Server Communication:** API defined between Go bridge and Python server (e.g., REST, gRPC).
*   **Bridge Storage:** SQLite (or similar, managed by Go bridge).
*   **Vector Database:** Pinecone (using Python SDK v6.0.0+) [Ref: Pinecone Docs]
*   **Agent Memory:** Mem0 Python library [Ref: Mem0 Docs]
*   **Languages:** Go (for bridge), Python (for MCP server/agents).
*   **Web Client Display:** Basic HTML/CSS/JS.

## 5. Simplified Architecture

WhatsApp User <-> WhatsApp Web API <-> **Go Bridge** (`whatsmeow`, SQLite, Bridge API) <-> **Python MCP Server** (FastAPI, MCP Tools, Mem0, Pinecone, Agent Logic) -> Web Client Display

## 6. UI/UX Considerations (MVP)

*   **Primary Setup:** User scans a QR code generated by the Go Bridge to link their WhatsApp.
*   **Primary Interaction:** Happens via tools/agents calling the Python MCP Server endpoints. *Direct user interaction model for MVP TBD* (e.g., Could be a separate CLI tool, a simple web UI calling MCP endpoints, or agents acting autonomously based on incoming messages detected by the bridge).
*   **Web Client:** Serves purely as a **passive visual aid**. Extremely simple, read-only.

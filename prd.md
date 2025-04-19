# PRD: Relationship Text Debug (Hackathon MVP v4 - WhatsApp MCP & Mem0)

## 1. Introduction & Goal

This document outlines the requirements for the "Relationship Text Debug" service, a **hackathon MVP**. The goal is to build a **minimal viable tool** that allows users to interact via commands sent to an **MCP server**, which in turn interacts with their **personal WhatsApp account** via an **unofficial bridge**. The system will use two core agents (Conversation Debugger, Response Drafter) sharing context via **Mem0** and retrieving relevant information using **Pinecone**. A simple **web client display** shows results.

**Architecture:** This relies on a core component:
1.  **Node.js WhatsApp MCP Server:** Connects to the user's personal WhatsApp account using the `whatsapp-web.js` library (unofficial WhatsApp Web API), handles QR code auth, stores session data locally (`wweb_session/`), and exposes MCP tool endpoints over HTTP for interaction.
2.  **Python Agents (Orchestrator):** Implements agent logic (Conversation Debugger, Response Drafter), interacts with Mem0/Pinecone, and communicates with the Node.js server by calling its MCP tool endpoints to send/receive WhatsApp messages.

**Disclaimer:** This approach uses unofficial libraries (`whatsapp-web.js`) to interact with WhatsApp Web, which is inherently unstable, prone to breaking, and may violate WhatsApp's Terms of Service.

**Sources:**
*   WhatsApp Interaction Library: [whatsapp-web.js (unofficial)](https://github.com/pedroslopez/whatsapp-web.js)
*   Node.js Web Framework: [Express.js](https://expressjs.com/)
*   Reference MCP Implementation: [feature-whatsapp-mcp-qr.md](reference/feature-whatsapp-mcp-qr.md)
*   Pinecone: [https://docs.pinecone.io/guides/get-started/quickstart](https://docs.pinecone.io/guides/get-started/quickstart), [https://docs.pinecone.io/assistant-release-notes/2025](https://docs.pinecone.io/assistant-release-notes/2025) (Accessed April 2025)
*   Mem0: [https://github.com/mem0ai/mem0](https://github.com/mem0ai/mem0), [https://docs.ag2.ai/docs/ecosystem/mem0/](https://docs.ag2.ai/docs/ecosystem/mem0/) (Accessed April 2025)

## 2. Target Audience

Primarily couples aged 25-40 experiencing communication challenges in text-based arguments (specifically WhatsApp).

## 3. Core MVP Features

Focus on the absolute minimum required to demonstrate the concept via MCP interactions controlling personal WhatsApp.

*   **WhatsApp Connection & Interaction (via Node.js MCP Server):**
    *   User connects their personal WhatsApp account to the **Node.js MCP Server** via **QR code scan** (managed by `whatsapp-web.js`).
    *   Users (or integrated agents/tools like the Python Agents) interact by calling **MCP tool endpoints** on the **Node.js MCP Server** (e.g., `/mcp` with tool names like `whatsapp.get_qr_code`, `whatsapp.send_message`).
    *   The Node.js server uses `whatsapp-web.js` to perform actions (read/send messages) on the user's linked WhatsApp account.
    *   The linked WhatsApp session data (managed by the Node.js Server in `wweb_session/`) serves as the persistent link; specific session identifiers might be needed for multi-user scenarios (TBD). (Note: The `feature-whatsapp-mcp-qr.md` implementation is single-session).

*   **Web Client Display (Controlled via Backend):**
    *   A **very basic, read-only web page** displaying:
        *   Conversation snippets retrieved via MCP calls.
        *   Key insights from the `ConversationDebugAgent`.
        *   Drafted responses from the `ResponseDrafterAgent`.
    *   Updates to this display are **triggered by backend actions** resulting from MCP tool usage or agent processing. *The user does not interact directly with this display in the MVP.*

*   **Agent-Driven Analysis & Drafting (Triggered via MCP):**
    *   `ConversationDebugAgent`:
        *   Triggered by an internal call or an MCP tool invocation (potentially on a separate Python service).
        *   Retrieves specified recent conversation context by calling the Node.js MCP server's tools and uses **Mem0**/**Pinecone**.
        *   Performs simplified analysis.
        *   Stores analysis summary in **Mem0** for the `ResponseDrafterAgent`.
        *   Updates the Web Client Display via the backend.
    *   `ResponseDrafterAgent`:
        *   Triggered by an internal call or MCP tool invocation.
        *   Uses context from **Mem0**/**Pinecone** and potentially the Node.js MCP Server (via MCP tools) to draft response options.
        *   Sends drafted responses back to the user's WhatsApp by calling the `whatsapp.send_message` MCP tool on the Node.js server.
        *   Updates the Web Client Display via the backend.

*   **Shared Memory & Context Retrieval:**
    *   **Mem0:** Stores recent conversation history, agent analysis summaries, etc., within the session scope, shared between agents (likely running in Python). Keying might use a user identifier derived during the interaction flow (TBD, as Node.js server is single-session by default).
    *   **Pinecone:** Stores vector embeddings of conversation segments for semantic retrieval (interacted with via Python).
    *   **Node.js Server Session Storage (`wweb_session/`):** The Node.js server maintains its own local storage for the `whatsapp-web.js` session data.

## 4. Technology Stack (MVP)

*   **WhatsApp Interaction & MCP Tools:** Node.js MCP Server using `whatsapp-web.js` (unofficial library) and `Express.js`.
*   **Agent Logic & Orchestration:** Python (using libraries like `google-adk` or custom logic) interacting with Mem0, Pinecone, and the Node.js MCP Server via HTTP requests.
*   **Session Storage:** Local file system (`wweb_session/` managed by `whatsapp-web.js` `LocalAuth`).
*   **Vector Database:** Pinecone (using Python SDK v6.0.0+).
*   **Agent Memory:** Mem0 Python library.
*   **Languages:** Node.js/JavaScript (for MCP server), Python (for agents/orchestration).
*   **Web Client Display:** Basic HTML/CSS/JS.

## 5. Simplified Architecture

WhatsApp User <-> WhatsApp Web API <-> **Node.js MCP Server** (`whatsapp-web.js`, `wweb_session/`, MCP Tools via HTTP `/mcp`) <-> **Python Agents/Orchestrator** (Mem0, Pinecone, Agent Logic) -> Web Client Display

## 6. UI/UX Considerations (MVP)

*   **Primary Setup:** User scans a QR code generated by the Node.js MCP Server to link their WhatsApp.
*   **Primary Interaction:** Happens via tools/agents calling the Node.js MCP Server endpoints. *Direct user interaction model for MVP TBD* (e.g., Could be a separate CLI tool, a simple web UI calling MCP endpoints, or agents acting autonomously based on incoming messages detected by the server).
*   **Web Client:** Serves purely as a **passive visual aid**. Extremely simple, read-only.

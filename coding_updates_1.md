## 04-19-2025 - Added .gitignore file

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/.gitignore`: Created file and added `.DS_Store`

### Description:
Created a `.gitignore` file to prevent macOS system files (`.DS_Store`) from being tracked by Git.

### Reasoning:
`.DS_Store` files are specific to macOS Finder and contain folder view options. They are not relevant to the project's code or functionality and should not be committed to the repository.

### Trade-offs:
- None. Ignoring these files is standard practice.

### Considerations:
- Ensures a cleaner Git history by excluding system-specific metadata.

### Future Work:
- Consider adding other common entries to `.gitignore` (e.g., `node_modules`, environment files, build outputs) as the project evolves.

## 04-19-2025 - Refactored PRD for Hackathon MVP (WhatsApp, Pinecone, Mem0)

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/prd.md`: Rewritten for MVP scope and new tech stack.

### Description:
Updated the Product Requirements Document (PRD) to reflect a simplified MVP scope for the hackathon. Shifted primary user interaction to WhatsApp via the Cloud API, replacing the previous web-centric approach and Google ADK focus. Integrated Pinecone for vector storage and Mem0 for shared agent memory.

### Reasoning:
Based on the user request to pivot to a focused MVP using WhatsApp (representing the MCP interaction model), Pinecone, and Mem0, suitable for a hackathon. This necessitated simplifying features (removing explicit logins, reducing UI complexity), changing the core interaction model to WhatsApp-first, and updating the technology stack based on researched documentation (as of April 2025).

### Trade-offs:
- Reduced initial feature set for faster development and feasibility within hackathon constraints.
- Increased reliance on the specified external APIs (WhatsApp Cloud API, Pinecone, Mem0).
- Web client becomes a purely passive display, limiting direct user interaction possibilities in the MVP.

### Considerations:
- Secure management of API credentials for WhatsApp, Pinecone, and potentially Mem0 is crucial.
- Backend requires robust handling of asynchronous WhatsApp webhooks and agent orchestration.
- A mechanism for pushing updates from the backend to the passive web client (e.g., WebSockets, Server-Sent Events, or simple polling for MVP) will be needed.

### Future Work:
- Post-hackathon, explore richer web client interactions.
- Expand agent capabilities and analysis depth.
- Implement more sophisticated error handling and user feedback within WhatsApp.
- Evaluate needs for more persistent storage beyond Mem0's scope if required.

## 04-19-2025 - Created FastAPI Backend Structure for WhatsApp MCP (Python Component)

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/main.py`: Created basic FastAPI app structure.
- `/Users/chen/Desktop/Projects/Naomi/mcp_tools/__init__.py`: Created empty init file.
- `/Users/chen/Desktop/Projects/Naomi/requirements.txt`: Added FastAPI and Uvicorn dependencies.

### Description:
Initialized the Python backend structure using FastAPI, intended to act as the MCP server component based on the architecture of `lharries/whatsapp-mcp`. This component will provide MCP tool endpoints for interaction with an LLM.

### Reasoning:
Following user instruction to use the MCP approach from the provided GitHub repository (`lharries/whatsapp-mcp`) and FastAPI for the backend, explicitly avoiding the official WhatsApp Cloud API. This structure provides the foundation for the Python part of that architecture.

### Trade-offs:
- **High Risk:** This approach relies on the unofficial WhatsApp Web API via the `whatsmeow` library (used by the separate required Go bridge), which is unstable and potentially violates WhatsApp ToS.
- **Dependency:** This Python server is *only one part* of the required system; it depends entirely on a separate Go `whatsapp-bridge` component (not yet built) to function.
- **Deviation:** This significantly deviates from the previously agreed PRD (v3) which specified the official WhatsApp Cloud API. PRD update is recommended.

### Considerations:
- A communication mechanism (e.g., HTTP requests, gRPC) between this Python FastAPI server and the Go bridge needs to be designed and implemented.
- Error handling for communication failures with the Go bridge is crucial.
- The specific MCP tool endpoints required by the agents (`ConversationDebugAgent`, `ResponseDrafterAgent`) need to be implemented.
- **Security implications** of using unofficial APIs and storing/handling WhatsApp data locally via the Go bridge must be carefully considered.

### Future Work:
- Implement MCP tool endpoints in `main.py`.
- Define and implement the communication protocol with the Go bridge.
- Build or adapt the Go `whatsapp-bridge` component.
- Integrate Mem0 and Pinecone logic within the MCP tool implementations.
- Update `prd.md` to reflect this architectural change and the use of the unofficial API.

## 04-19-2025 - Corrected PRD to WhatsApp MCP Architecture

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/prd.md`: Rewritten to accurately reflect the MCP (Go Bridge + Python Server) architecture, removing Cloud API details.

### Description:
Corrected the PRD (version 4) to fully align with the user's decision to use the WhatsApp MCP approach (inspired by `lharries/whatsapp-mcp`) instead of the official WhatsApp Cloud API. Removed all references to the Cloud API, webhooks, and associated concepts. Detailed the two-component architecture (Go Bridge using `whatsmeow` + Python MCP Server using FastAPI), updated the tech stack, interaction model (QR code setup, MCP tool calls), and added necessary disclaimers about using unofficial APIs.

### Reasoning:
To accurately document the project's chosen architecture based on explicit user direction, rectifying the previous version (v3) which incorrectly retained Cloud API elements after the decision to switch to the MCP model. This ensures the PRD serves as a correct guide for development using the unofficial WhatsApp Web API via a bridge.

### Trade-offs:
- (Same as previous update, now correctly documented in PRD) **High Risk:** Relies on unstable, unofficial WhatsApp Web API via `whatsmeow`. Potential ToS violation.
- **Dependency:** Python server requires a separate Go bridge component.
- Functionality is now tied to a personal WhatsApp account, not the Business Platform.

### Considerations:
- (Same as previous update) Communication protocol between Go bridge and Python server is critical. Security and stability of the `whatsmeow` integration are major concerns. Need to define how agents/tools invoke MCP endpoints.

### Future Work:
- Implement MCP tool endpoints in `main.py`.
- Define and implement the Go Bridge <-> Python Server communication.
- Build/Adapt the Go `whatsapp-bridge`.
- Integrate Mem0 and Pinecone.
- Define the primary user/agent interaction mechanism with the MCP server.

## 04-19-2025 - Added Reference Doc for WhatsApp MCP QR Code (Node.js Example)

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/reference/feature-whatsapp-mcp-qr.md`: Created new reference file.

### Description:
Added a reference document detailing a potential implementation for the WhatsApp MCP QR code generation and authentication check features. This specific example uses Node.js and the `whatsapp-web.js` library.

### Reasoning:
Created by the user to provide technical reference material for implementing the WhatsApp connection part of the MCP architecture (the "Bridge" component). This file outlines one possible approach using Node.js, which could inform the development of the Go bridge (or potentially serve as an alternative implementation path).

### Trade-offs:
- Introduces a Node.js/`whatsapp-web.js` implementation example, which differs from the Go/`whatsmeow` approach used in the original `lharries/whatsapp-mcp` reference. This adds another option but requires a decision on the bridge implementation technology.
- Both `whatsapp-web.js` and `whatsmeow` are unofficial libraries with associated risks (instability, ToS violation).

### Considerations:
- This file is located in the `/reference` directory and serves as read-only context.
- The project must decide whether to build the bridge component in Go (using `whatsmeow`) or Node.js (using `whatsapp-web.js`), or another language/library. This reference document provides specific guidance for the Node.js path.
- The core dependency on a separate bridge component and the risks of using unofficial APIs remain regardless of the specific library chosen.

### Future Work:
- Decide on the language/library for the WhatsApp Bridge component (e.g., Go/`whatsmeow` vs. Node.js/`whatsapp-web.js`).
- Build or adapt the Bridge component based on the chosen technology, potentially using this reference file.
- Ensure the chosen Bridge implementation provides the necessary API for the Python FastAPI MCP server to consume.

## 07-10-2025 - Setup Node.js WhatsApp MCP Server (Initial Implementation)

### Files Updated:
- `/whatsapp_integration/mcp_server_node/package.json`: Initialized Node.js project and added dependencies (`express`, `whatsapp-web.js`, `qrcode-terminal`).
- `/whatsapp_integration/mcp_server_node/server.js`: Created server file with initial implementation based on the feature document.

### Files Removed:
- `/main.py`: Removed previous Python server implementation.
- `/bridge_client.py`: Removed previous Python bridge client.
- `/requirements.txt`: Removed previous Python dependencies file.

### Description:
Removed the unused Python server files and set up the basic Node.js project structure for the WhatsApp MCP server. Installed required dependencies and implemented the initial server logic in `server.js`, including `whatsapp-web.js` client setup, event listeners (QR, auth, ready, disconnect), and basic MCP endpoints (`whatsapp.get_qr_code`, `whatsapp.check_auth_status`, `whatsapp.send_message`, `whatsapp.logout`).

### Reasoning:
This aligns the implementation with the architecture defined in the `feature-whatsapp-mcp-qr.md` document and the updated `prd.md`, shifting from the incorrect Python/Go bridge approach to the required Node.js server using `whatsapp-web.js`. This provides the foundation for interacting with WhatsApp via MCP tools.

### Trade-offs:
- Using `whatsapp-web.js` is an unofficial method and may be less stable or break with WhatsApp updates compared to official APIs (which are not available for this use case).
- Error handling and state management are currently basic and will need refinement for robustness.
- Security vulnerabilities noted during `npm install` require future attention for a production environment.

### Considerations:
- Puppeteer (a dependency of `whatsapp-web.js`) requires Chromium, which might need manual installation or configuration depending on the environment.
- Session data is stored locally in `./wweb_session/`, requiring persistent storage for the server.
- The server attempts initial client connection on startup.

### Future Work:
- Refine error handling and state management for edge cases (e.g., disconnect reasons, initialization failures).
- Implement more robust logic for handling asynchronous events (e.g., using Promises for QR code retrieval).
- Add comprehensive logging.
- Address security vulnerabilities reported by `npm audit`.
- Test thoroughly by running the server and interacting with the MCP endpoints.
- Consider containerization (e.g., Docker) for easier deployment and dependency management.
- Secure the MCP endpoint if exposed externally.

## 04-19-2025 - Add WhatsApp Cache to .gitignore

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/.gitignore`: Added WhatsApp cache path.

### Description:
Added the `whatsapp_integration/mcp_server_node/.wwebjs_cache/` directory pattern to the existing `.gitignore` file to prevent the WhatsApp Web JS cache files from being committed to the repository.

### Reasoning:
Cache files are temporary and specific to a user's session. They should not be part of the version-controlled codebase as they can bloat the repository and cause potential conflicts.

### Trade-offs:
- None. Ignoring cache files is standard practice.

### Considerations:
- Ensured the path correctly targets the cache directory generated by `whatsapp-web.js`.

### Future Work:
- Add other common patterns to `.gitignore` (e.g., `node_modules`, `.env`, Python `__pycache__`).

## 04-19-2025 - Integrate Mem0 via Composio MCP into ADK Agent

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/requirements.txt`: Added `composio_openai` and `python-dotenv`.
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Imported Composio, fetched Mem0 tools, registered tools with ADK Agent, updated agent instructions.

### Description:
Integrated Mem0 capabilities into the `conversation_debugger_agent` by leveraging the Composio MCP integration. The agent now fetches Mem0 tools (like `add_memories` and `perform_semantic_search_on_memories`) provided by Composio at initialization and registers them alongside its existing tools. The agent's instructions were updated to guide its use of these memory functions.

### Reasoning:
The PRD requires agents to use Mem0 for shared memory. Using the Composio MCP toolset simplifies integration by providing pre-built tools that adhere to the ADK tool structure, abstracting away the direct Mem0 API calls. This aligns with the documentation in `reference/mem0-mcp-docs.md` and `reference/adk-docs.md`.

### Trade-offs:
- Relies on the external Composio service and its API key configuration.
- Assumes the standard Mem0 tool names provided by Composio (`add_memories`, `perform_semantic_search_on_memories`) match the ones fetched dynamically. Error handling was added for cases where tools can't be fetched.

### Considerations:
- Requires `COMPOSIO_API_KEY` to be set in the environment (`.env` file) for the Composio toolset to authenticate and fetch tools.
- The agent's effectiveness now depends partly on its ability to correctly interpret when and how to use the Mem0 tools based on their descriptions and the updated instructions.
- The mock `get_whatsapp_conversation` tool is still in place; replacing it with actual WhatsApp MCP interaction is the next major step for this agent.

### Future Work:
- Install updated requirements: `pip install -r agent/requirements.txt`.
- Replace the mock `get_whatsapp_conversation` tool with actual calls to the Node.js WhatsApp MCP server.
- Implement the `ResponseDrafterAgent` as outlined in the PRD, potentially sharing the same Composio/Mem0 setup.
- Test the agent's ability to use the Mem0 tools effectively during a conversation flow.
- Verify Composio connection and tool availability upon running the agent.

## 04-19-2025 - Replace Mock WhatsApp with Real MCP Call in Agent

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/requirements.txt`: Added `requests`.
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Replaced `get_whatsapp_conversation` mock with `fetch_whatsapp_messages_mcp` function calling the Node.js MCP server; updated tool registration and agent instructions.

### Description:
Implemented the core functionality for the agent to interact with the WhatsApp MCP server. The previous mock function for getting WhatsApp messages was removed and replaced with a new function, `fetch_whatsapp_messages_mcp`. This function uses the `requests` library to send a POST request to the `/mcp` endpoint of the Node.js server, invoking the `whatsapp.get_messages` tool with the specified `chat_name` and `limit`. It handles successful responses and various potential errors (connection issues, server errors, unexpected response format). The ADK agent's tool list and instructions were updated accordingly.

### Reasoning:
This change fulfills a primary requirement of the PRD: enabling the Python agent to retrieve actual data from the user's WhatsApp via the Node.js MCP bridge. Replacing the mock function is essential for the agent to perform meaningful analysis based on real conversations. The implementation directly uses the `whatsapp.get_messages` tool identified in the `server.js` code.

### Trade-offs:
- The agent now has a direct dependency on the Node.js MCP server being available and correctly configured at the specified URL (`http://localhost:3000/mcp` by default).
- Error handling adds complexity but is necessary for robustness.
- Assumes the `whatsapp.get_messages` tool on the server functions as expected based on the `server.js` review.

### Considerations:
- The MCP server URL is currently hardcoded with a default but can be overridden via the `WHATSAPP_MCP_SERVER_URL` environment variable.
- The agent needs to be invoked with the correct `chat_name` for the tool to work.
- Network latency or MCP server issues could impact agent performance. A timeout was added to the request.
- The format of the returned messages in the `history` matches the structure expected by the new function's docstring and the server code.

### Future Work:
- Install the new `requests` dependency: `pip install -r agent/requirements.txt`.
- Thoroughly test the interaction between the agent and the MCP server.
- Implement the logic for the agent to *use* the fetched history (analysis, storing in Mem0).
- Implement the `ResponseDrafterAgent` and the `whatsapp.send_message` MCP call.
- Consider adding more sophisticated error handling or retry mechanisms if needed.

## 04-19-2025 - Prepare Agent for Integration Test

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Added `if __name__ == "__main__":` block to execute `root_agent.chat()` for testing.

### Description:
Prepared the agent script for integration testing. Added a main execution block to `agent.py` to allow running the script directly (`python agent/agent.py`) and triggering the agent's chat flow with a sample query. Note: Creation of the `agent/.env` file failed due to `.gitignore` rules and must be done manually by the user.

### Reasoning:
Verification requires running the agent. The execution block provides the entry point for testing the integrated flow (Composio tool fetching, MCP tool calling). The `.env` file (to be created manually) is mandatory for Composio authentication.

### Trade-offs:
- The test query and chat name are hardcoded in the execution block; this is suitable for initial verification but should be made more dynamic later.
- Relies on the user correctly creating the `agent/.env` file and adding their API key.

### Considerations:
- The `COMPOSIO_API_KEY` must be valid for Mem0 tool fetching to succeed.
- The Node.js WhatsApp MCP server must be running and authenticated for the `fetch_whatsapp_messages_mcp` tool to succeed.
- The chat name used in the test query (`Wife` by default) must exist in the connected WhatsApp account.

### Future Work:
- User needs to manually create `agent/.env` and add their `COMPOSIO_API_KEY`.
- Run the agent (`python agent/agent.py`) after the user adds the API key.
- Analyze the output logs from both the Python script and the Node.js server to verify each step of the integration.
- Replace the hardcoded test query with a more robust testing method or user input mechanism.

## 04-19-2025 - Refine Agent for Integration Test (Keep Core Integrations)

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Restored `.env` loading, Composio/Mem0 tool fetching (with error handling), combined tool list, and original agent instructions. Kept the main execution block.

### Description:
Adjusted the agent script for integration testing based on user feedback. Instead of completely removing `.env` and Mem0 integration, this version keeps them. The script now attempts to load environment variables and fetch Mem0 tools via Composio, printing an error and continuing without Mem0 tools if fetching fails. The agent is initialized with both the WhatsApp tool and any successfully fetched Mem0 tools, using the original instructions that describe both functionalities.

### Reasoning:
This approach allows testing the primary WhatsApp MCP tool interaction while retaining the necessary structure and error handling for the Mem0 integration. It provides a more realistic test setup compared to completely removing the Mem0 code, addressing the user's request to keep essential features while simplifying the immediate test focus.

### Trade-offs:
- The test run might show errors related to Composio/Mem0 if the `.env` file or API key is incorrect, but the agent should still attempt the WhatsApp tool call if Mem0 fetching fails.
- The test query remains hardcoded.

### Considerations:
- `agent/.env` must exist and contain a valid `COMPOSIO_API_KEY` for Mem0 tools to load.
- The Node.js server must be running and authenticated.
- The test chat name must be correct.

### Future Work:
- Run the agent (`python agent/agent.py`) after user confirms prerequisites.
- Analyze logs to verify Composio connection (success or handled failure) and the MCP WhatsApp tool call.

## 04-19-2025 - Fix Agent Initialization and Composio Enum Errors

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Corrected Composio `App` enum to `App.MEM0_TEXT_MEMORY` (with fallback to `App.MEM0`) for fetching Mem0 tools. Added required `name` and optional `description` parameters back to the `Agent` constructor.

### Description:
Addressed two errors encountered during the previous test run. First, corrected the enum used to fetch Mem0 tools from Composio, trying `App.MEM0_TEXT_MEMORY` first and falling back to `App.MEM0` if needed, improving error handling. Second, fixed a Pydantic validation error by adding the mandatory `name` parameter (and restoring the `description`) to the `Agent` initialization call.

### Reasoning:
The Composio `App` enum name was incorrect for the installed library version, preventing Mem0 tools from being fetched (though error handling allowed the script to continue). The missing `name` parameter in the `Agent` constructor caused a fatal validation error according to ADK/Pydantic requirements. These fixes are essential for the script to initialize correctly and attempt both integrations.

### Trade-offs:
- The Composio enum fix involves a guess (`App.MEM0_TEXT_MEMORY`) and a fallback; if neither is correct for the user's specific `composio_openai` version, Mem0 tool fetching will still fail, but the error message is now clearer.

### Considerations:
- Correct functioning still depends on prerequisites: Node.js server running & authenticated, correct chat name in the script, and a valid (optional) `COMPOSIO_API_KEY` in `agent/.env`.

### Future Work:
- Re-run the agent (`python3 agent/agent.py`) to verify the fixes.
- If Composio fetching still fails, investigate the correct `App` enum name for the installed library version.

## 04-19-2025 - Add WhatsApp Chat Listing Tool to Agent

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Added `list_whatsapp_chats_mcp` function to call the (assumed) `whatsapp.list_chats` tool on the MCP server. Added this function to the agent's `all_tools` list.

### Description:
Implemented the Python-side functionality for listing available WhatsApp chats. Added the `list_whatsapp_chats_mcp` function to act as a wrapper for the corresponding MCP server tool. Made this new function available to the agent by including it in the list of tools passed during agent initialization.

### Reasoning:
Provides a mechanism within the agent to discover available chat names programmatically. This complements the existing `fetch_whatsapp_messages_mcp` tool by allowing the agent (or user) to identify the correct `chat_name` beforehand.

### Trade-offs:
- This agent-side code relies on the backend Node.js server having the `whatsapp.list_chats` tool correctly implemented. If the server doesn't support it, calls to this function will fail.

### Considerations:
- The Node.js server must be restarted if its code (`server.js`) was modified to include the `whatsapp.list_chats` handler.
- The agent's instructions have not been modified to proactively *use* this tool, but it is now available for the agent's reasoning process or direct user requests (e.g., "List my WhatsApp chats").

### Future Work:
- Restart the Node.js server if `server.js` was modified.
- Test the new tool using `adk run agent` (e.g., by asking the agent "List my WhatsApp chats").
- Update agent instructions if automatic chat listing is desired under certain conditions.

## 04-19-2025 - Fix WhatsApp Auto-Initialization on Server Start

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/whatsapp_integration/mcp_server_node/server.js`: Added call to `initializeClient()` within the `app.listen()` callback to ensure the WhatsApp connection process starts immediately when the server boots up.

### Description:
Corrected a critical bug where the Node.js server was not automatically initiating the connection to WhatsApp upon startup. The `initializeClient()` function, containing the necessary `client.initialize()` call, was defined but never invoked in the main execution flow. Added the call to `initializeClient()` right after the Express server starts listening.

### Reasoning:
The server must attempt to connect to WhatsApp immediately on start to either restore a previous session or display the QR code for a new session. Without this automatic initialization, the server would only attempt connection if a specific (and non-standard) `/mcp` tool (`whatsapp.get_qr_code`) was called, preventing normal operation and QR code display. This fix ensures the expected behavior.

### Trade-offs:
- None. This is a fundamental requirement for the server to function correctly.

### Considerations:
- This ensures the QR code is presented promptly if needed, allowing the user to authenticate the session.
- Restored sessions (via `LocalAuth`) should now also work correctly on server restart.

### Future Work:
- Stop the old server instance manually.
- Restart the server with the updated code.
- Verify QR code generation and successful connection ("Client is ready!").
- Proceed with agent testing.

## 04-19-2025 - Refactor Agent for MCPToolset Integration

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/agent/agent.py`: Major refactoring to use `MCPToolset` for communication with the WhatsApp MCP server.

### Description:
Replaced the previous direct HTTP POST calls (using `requests`) to the Node.js server's `/mcp` endpoint with the ADK-standard `MCPToolset` integration. The agent now uses `MCPToolset.from_server` with `StdioServerParameters` to automatically start the `node server.js` process, communicate via stdio, discover available tools (`whatsapp.list_chats`, `whatsapp.get_messages`, etc.), and proxy tool calls. This aligns the implementation with the official `adk-mcp-docs.md` pattern.

### Reasoning:
The previous implementation using direct HTTP calls contradicted the documented ADK approach for interacting with MCP servers, which mandates using `MCPToolset`. This mismatch was identified as the likely root cause of the persistent 400 Bad Request errors. `MCPToolset` handles the correct communication protocol (stdio for local processes) and lifecycle management, abstracting the MCP details from the agent code.

### Trade-offs:
- Increased complexity initially due to async setup and `exit_stack` management.
- Benefit: Adherence to the standard ADK pattern, expected to resolve communication errors and provide more robust integration. `MCPToolset` handles low-level protocol details.

### Considerations:
- `MCPToolset` now manages the lifecycle of the `node server.js` process. The server does *not* need to be started manually beforehand.
- The agent script (`agent.py`) must be run from the `/Users/chen/Desktop/Projects/Naomi/agent` directory for the relative path calculation (`../whatsapp_integration/mcp_server_node`) to the server to work correctly.
- The `exit_stack.aclose()` call is critical for cleanly terminating the Node.js server process when the agent script exits.
- The agent instructions were updated to reflect the tool names discovered via MCP (e.g., `whatsapp.list_chats` instead of `list_whatsapp_chats_mcp`).

### Future Work:
- Run the updated `agent.py` script.
- Verify that `MCPToolset` successfully starts the Node.js server and discovers tools.
- Test agent interaction by issuing commands like "List my WhatsApp chats".
- Ensure the Node.js server process is terminated correctly when the agent script exits (check for the "Closing MCP server connection..." log).

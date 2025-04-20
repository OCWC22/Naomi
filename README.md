# Naomi - Relationship Text Debugger

## Overview

This project uses a Python ADK agent to analyze WhatsApp conversations between couples. It fetches messages via a Node.js MCP server (using `whatsapp-web.js`) and leverages Mem0 (via Composio) for storing conversation insights.

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm
*   Python 3 (v3.10 or later recommended)
*   pip
*   Google Cloud SDK (for ADK)
*   A Composio Account and API Key ([https://app.composio.dev/](https://app.composio.dev/))

## Setup

1.  **Clone the Repository:** (Assumed you have already done this)
    ```bash
    git clone <repository_url>
    cd Naomi
    ```

2.  **Install Python Dependencies:**
    ```bash
    pip install -r agent/requirements.txt
    # Ensure ADK CLI is installed and configured
    # gcloud components update
    # gcloud components install adk
    # gcloud auth application-default login 
    # gcloud config set project YOUR_GCP_PROJECT_ID
    ```
    *(Replace `YOUR_GCP_PROJECT_ID` with your actual Google Cloud Project ID)*

3.  **Install Node.js Dependencies:**
    ```bash
    cd whatsapp_integration/mcp_server_node
    npm install
    cd ../.. 
    ```

4.  **Configure Composio API Key:**
    *   Create a file named `.env` inside the `agent/` directory: `/Users/chen/Desktop/Projects/Naomi/agent/.env`
    *   Add your Composio API key to this file:
        ```env
        COMPOSIO_API_KEY=YOUR_ACTUAL_COMPOSIO_KEY_PLEASE_REPLACE
        ```
    *   **Important:** Replace `YOUR_ACTUAL_COMPOSIO_KEY_PLEASE_REPLACE` with your real key.

## Running for Testing

1.  **Start Node.js WhatsApp MCP Server:**
    *   Open a terminal window.
    *   Navigate to the server directory:
        ```bash
        cd /Users/chen/Desktop/Projects/Naomi/whatsapp_integration/mcp_server_node
        ```
    *   Run the server:
        ```bash
        node server.js
        ```
    *   **Scan QR Code:** Look for the QR code displayed in the terminal output. Open WhatsApp on your phone, go to Settings -> Linked Devices -> Link a Device, and scan the QR code.
    *   **Wait for Ready:** Keep this terminal open. Wait until you see the message "Client is ready!" indicating a successful connection.

2.  **Run the ADK Agent:**
    *   Open a **separate, new** terminal window.
    *   Navigate to the project's root directory:
        ```bash
        cd /Users/chen/Desktop/Projects/Naomi
        ```
    *   Run the agent using the ADK CLI:
        ```bash
        adk run agent
        ```
    *   The ADK will load the agent. Once it's ready, it will prompt you for input (`>`).

3.  **Interact with the Agent:**
    *   At the `>` prompt, type your request, making sure to specify the chat name exactly as it appears in your WhatsApp. For example:
        ```
        Analyze my latest conversation with 'Wife'
        ```
        *(Replace 'Wife' with the actual chat name you want to test)*.
    *   Observe the output from both the ADK agent terminal and the Node.js server terminal to see the interaction (tool calls, responses).

4.  **Stopping:** Press `Ctrl+C` in each terminal window to stop the ADK agent and the Node.js server.

## Directory Structure

```
Naomi/
├── agent/                  # Python ADK Agent code
│   ├── agent.py            # Main agent logic
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (API Keys) - Manually created
│   └── __init__.py         # Makes 'agent' a Python package
├── whatsapp_integration/   # Node.js MCP Server for WhatsApp
│   └── mcp_server_node/
│       ├── server.js       # Node.js server code
│       ├── package.json    # Node dependencies
│       └── ...             # Other node files (e.g., node_modules)
├── reference/              # Documentation files
├── coding_updates_1.md     # Development log
└── README.md               # This file
```

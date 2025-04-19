// mcp_server_node/server.js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal'); // For local debug display only

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.MCP_PORT || 3000; // Port for the MCP server

// --- WhatsApp Client Setup ---
// Use LocalAuth strategy to save session data in ./wweb_session/
// This avoids needing to scan the QR code every time the server restarts.
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './wweb_session' }),
    puppeteer: {
        headless: true, // Run headless (no visible browser window)
        // IMPORTANT for Linux servers: Often need '--no-sandbox'
        // You might need to adjust this for macOS if you encounter issues
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Added for broader compatibility
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            // '--single-process', // Sometimes needed on Docker/Linux VMS
            '--disable-gpu'
        ],
        timeout: 120000, // Increased general timeout
        launchTimeout: 120000, // Explicitly increase launch timeout to 120s
    },
    // Add browser acquisition timeout (e.g., 120 seconds)
    // Increase timeout if you have slow internet connection or machine
    qrTimeout: 0, // Use default QR timeout
    authTimeout: 120000 // Increase auth timeout as well
});

let qrCodeBase64 = null; // Store the latest QR code
let isAuthenticated = false; // Track authentication status
let clientInitializing = false; // Prevent multiple initializations
let clientReady = false; // Track if client is fully ready
let lastDisconnectReason = null;

// --- WhatsApp Event Listeners ---
client.on('qr', (qr) => {
    console.log('QR Code Received. Scan with WhatsApp.');
    qrCodeBase64 = qr; // Store the new QR code
    isAuthenticated = false; // QR means not authenticated yet
    clientReady = false;
    // Optional: Display QR in terminal for local debugging
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('WhatsApp Client Authenticated!');
    isAuthenticated = true;
    qrCodeBase64 = null; // Clear QR code once authenticated
    clientReady = false; // Still might not be fully ready
    lastDisconnectReason = null;
});

client.on('auth_failure', (msg) => {
    console.error('WhatsApp Authentication Failure:', msg);
    isAuthenticated = false;
    clientInitializing = false; // Allow re-initialization
    clientReady = false;
    qrCodeBase64 = null;
    // Consider cleanup or specific error handling here
});

client.on('ready', () => {
    console.log('WhatsApp Client is Ready!');
    isAuthenticated = true; // Ensure status is correct
    clientInitializing = false; // Finished initialization
    clientReady = true;
    qrCodeBase64 = null;
    lastDisconnectReason = null;
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp Client Disconnected:', reason);
    isAuthenticated = false;
    clientInitializing = false;
    clientReady = false;
    qrCodeBase64 = null;
    lastDisconnectReason = reason;
    // Attempt to re-initialize or handle based on the reason
    console.log('Attempting to destroy client...');
    client.destroy().catch(err => console.error("Error destroying client after disconnect:", err))
        .finally(() => {
             console.log('Client destroyed after disconnect. Call initializeClient() again if needed.');
             // Optionally attempt auto-reconnect after a delay, but can cause loops
             // setTimeout(initializeClient, 15000); // Example: Retry after 15s
        });
});

client.on('change_state', state => {
    console.log('WhatsApp Connection State Changed:', state);
});

client.on('loading_screen', (percent, message) => {
    console.log('WhatsApp Loading:', percent, message);
});


// Function to safely initialize the client
function initializeClient() {
    // Check various states to prevent re-initialization issues
    if (clientInitializing) {
        console.log('Client initialization already in progress.');
        return;
    }
    if (clientReady) {
        console.log('Client is already ready.');
        return;
    }
    // Check puppeteer internal state if possible (more robust check)
    // if (client.pupBrowser && client.pupBrowser.isConnected()) {
    //     console.log('Puppeteer browser seems connected, likely initializing or ready.');
    //     return;
    // }

    console.log('Initializing WhatsApp Client...');
    clientInitializing = true;
    isAuthenticated = false;
    clientReady = false;
    qrCodeBase64 = null; // Clear any old QR

    client.initialize().catch(err => {
        console.error('Client Initialization Error:', err);
        isAuthenticated = false;
        clientReady = false;
        clientInitializing = false; // Allow retry on error
    });
}

// --- MCP Endpoint --- 
// Simple endpoint accepting POST requests with MCP tool calls
app.post('/mcp', async (req, res) => { // Make handler async for await
    const { tool_name, input } = req.body;
    console.log(`\nReceived MCP call for tool: ${tool_name}`);

    if (!tool_name) {
        return res.status(400).json({ error: 'Missing tool_name in request' });
    }

    // --- Tool: whatsapp.get_qr_code ---
    if (tool_name === 'whatsapp.get_qr_code') {
        if (isAuthenticated && clientReady) {
            console.log("Tool Call [get_qr]: Client already authenticated.");
            return res.status(400).json({ // Use 400 Bad Request as the state doesn't match the request
                output: null,
                error: { message: "Client is already authenticated. No QR code available." }
            });
        }

        initializeClient(); // Ensure client initialization is triggered if needed

        // Wait briefly for the QR code event listener to potentially populate qrCodeBase64
        // This is slightly fragile; a promise-based approach on the event would be more robust,
        // but adds complexity. This timeout is a simpler starting point.
        setTimeout(() => {
            if (qrCodeBase64) {
                console.log("Tool Call [get_qr]: Returning current QR code.");
                res.status(200).json({
                    output: { qr_code_image_base64: qrCodeBase64 }
                });
                // Don't clear qrCodeBase64 here, it might be needed if scan fails
            } else if (isAuthenticated) {
                 console.log("Tool Call [get_qr]: Client became authenticated while waiting.");
                 res.status(400).json({
                     output: null,
                     error: { message: "Client authenticated while waiting for QR code." }
                 });
            }
             else {
                console.log("Tool Call [get_qr]: QR code not available yet.");
                res.status(404).json({ // Use 404 Not Found as the resource (QR) isn't ready
                    output: null,
                    error: { message: "QR code not generated yet. Client might be initializing or encountered an issue. Retry shortly." }
                });
            }
        }, 5000); // Wait up to 5 seconds for QR event

    }
    // --- Tool: whatsapp.check_auth_status ---
    else if (tool_name === 'whatsapp.check_auth_status') {
        let status;
        if (clientReady && isAuthenticated) {
            status = "authenticated_ready";
        } else if (isAuthenticated && clientInitializing) {
            status = "authenticated_initializing"; // Authenticated but maybe not fully ready
        } else if (clientInitializing) {
            status = "initializing";
        } else if (qrCodeBase64) {
            status = "qr_code_pending";
        } else if (lastDisconnectReason) {
            status = "disconnected";
        } else {
            status = "uninitialized"; // Or could be error state
        }

        console.log(`Tool Call [check_status]: Returning status - ${status}`);
        res.status(200).json({
            output: { 
                status: status,
                is_authenticated: isAuthenticated,
                is_ready: clientReady,
                is_initializing: clientInitializing,
                qr_pending: !!qrCodeBase64,
                last_disconnect_reason: lastDisconnectReason
            }
        });
    }
    // --- Tool: whatsapp.send_message ---
    else if (tool_name === 'whatsapp.send_message') {
        if (!clientReady) {
            console.log("Tool Call [send_message]: Client not ready.");
            return res.status(400).json({
                output: null,
                error: { message: "WhatsApp client is not ready. Cannot send message." }
            });
        }
        if (!input || !input.recipient_jid || !input.message_body) {
            console.log("Tool Call [send_message]: Missing input parameters.");
            return res.status(400).json({
                output: null,
                error: { message: "Missing required input: recipient_jid and message_body." }
            });
        }

        const { recipient_jid, message_body } = input;
        // Basic JID validation (ensure it looks like number@s.whatsapp.net)
        if (!/\d+@s\.whatsapp\.net$/.test(recipient_jid)) {
             console.log(`Tool Call [send_message]: Invalid JID format - ${recipient_jid}`);
            return res.status(400).json({
                output: null,
                error: { message: `Invalid recipient_jid format. Expected format: number@s.whatsapp.net` }
            });
        }

        console.log(`Tool Call [send_message]: Sending to ${recipient_jid}`);
        try {
            const message = await client.sendMessage(recipient_jid, message_body);
            console.log(`Tool Call [send_message]: Message sent successfully. ID: ${message.id.id}`);
            res.status(200).json({
                output: { message_id: message.id.id, status: 'sent' }
            });
        } catch (err) {
            console.error(`Tool Call [send_message]: Error sending message - ${err}`);
            res.status(500).json({
                output: null,
                error: { message: `Failed to send message: ${err.message}` }
            });
        }
    }
    // --- Tool: whatsapp.logout ---
    else if (tool_name === 'whatsapp.logout') {
         if (!isAuthenticated && !clientReady) {
            console.log("Tool Call [logout]: Client not authenticated or ready.");
            return res.status(400).json({ output: null, error: { message: "Client not connected, cannot logout." } });
        }
        console.log("Tool Call [logout]: Attempting logout...");
        try {
            await client.logout();
            console.log("Tool Call [logout]: Logout successful. Client should disconnect shortly.");
            // Reset state immediately for clarity, disconnect event will handle destroy
            isAuthenticated = false;
            clientReady = false;
            clientInitializing = false; 
            qrCodeBase64 = null;
            res.status(200).json({ output: { status: 'logout_initiated' } });
        } catch (err) {
            console.error(`Tool Call [logout]: Logout failed - ${err}`);
            res.status(500).json({ output: null, error: { message: `Logout failed: ${err.message}` } });
        }
    }
    // --- Unknown Tool --- 
    else {
        console.log(`Tool Call: Unknown tool - ${tool_name}`);
        res.status(404).json({
            output: null,
            error: { message: `Tool '${tool_name}' not found.` }
        });
    }
});

// --- Server Start --- 
app.listen(PORT, () => {
    console.log(`WhatsApp MCP Server listening on port ${PORT}`);
    // Try initial connection on server start - crucial for QR code generation
    initializeClient(); 
    console.log("Server started. Attempting to initialize WhatsApp client.");
    console.log("Monitor console for QR code or authentication status.");
    console.log("Session data will be stored in ./wweb_session/");
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nCaught interrupt signal. Shutting down WhatsApp client...');
    if (client) {
        try {
             await client.destroy();
             console.log('Client destroyed successfully.');
        } catch (err) {
            console.error('Error destroying client during shutdown:', err);
        }
    }
    process.exit(0); // Exit cleanly
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optional: Decide if you want to exit or attempt recovery
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: Decide if you want to exit or attempt recovery
  // process.exit(1);
});

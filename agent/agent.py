import asyncio
import os
import sys
import requests
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.tools import FunctionTool, ToolContext
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:3000/mcp")

async def get_mcp_tools_async():
    print("Attempting to connect to Node.js WhatsApp MCP server via stdio...")
    agent_dir = os.path.dirname(__file__)
    server_dir = os.path.abspath(os.path.join(agent_dir, '..', 'whatsapp_integration', 'mcp_server_node'))

    if not os.path.isdir(server_dir) or not os.path.exists(os.path.join(server_dir, 'server.js')):
        raise FileNotFoundError(f"Server directory or server.js not found at expected path: {server_dir}")

    print(f"MCP Server CWD calculated as: {server_dir}")

    try:
        tools, exit_stack = await MCPToolset.from_server(
            connection_params=StdioServerParameters(
                command='node',
                args=['server.js'],
                cwd=server_dir
            )
        )
        print(f"MCP Toolset created successfully. Found {len(tools)} tools.")
        tool_names = [tool.name for tool in tools]
        print(f"Discovered tool names: {tool_names}")
        return tools, exit_stack
    except Exception as e:
        print(f"Error connecting to MCP server via stdio: {e}", file=sys.stderr)
        raise

async def create_agent():
    mcp_tools, exit_stack = await get_mcp_tools_async()

    agent_instruction = """
    You are Naomi, a helpful AI assistant with access to WhatsApp via an MCP server.
    Your goal is to assist the user with tasks related to their WhatsApp conversations.
    You can use the following tools discovered from the MCP server:
    - Use 'whatsapp.list_chats' to list available chats.
    - Use 'whatsapp.get_messages' to fetch recent messages (requires 'chat_name', optional 'limit').
    - Use 'whatsapp.check_auth_status' to check connection status.
    - Use 'whatsapp.get_qr_code' if authentication is needed.

    Analyze messages or perform actions based on tool outputs.
    If a tool fails because the client isn't ready, inform the user.
    Provide clear and concise responses.
    """

    model_id = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest")

    agent = Agent(
        model=model_id,
        name='Naomi_WhatsApp_Agent_MCP',
        instruction=agent_instruction,
        tools=mcp_tools
    )
    return agent, exit_stack

async def async_main():
    session_service = InMemorySessionService()
    app_name = "NaomiWhatsAppMCP"
    user_id = "user_mcp"
    session_id = "session_mcp"

    session = session_service.create_session(
        state={}, app_name=app_name, user_id=user_id, session_id=session_id
    )

    exit_stack = None
    try:
        print("Creating agent and connecting to MCP server...")
        agent, exit_stack = await create_agent()

        runner = Runner(
            app_name=app_name,
            agent=agent,
            session_service=session_service,
        )

        print("\n--- Agent Interaction Loop (MCP Mode) ---")
        print("Type 'quit' or 'exit' to end.")

        while True:
            try:
                query = input("> ")
                if query.lower() in ["quit", "exit"]:
                    break

                content = types.Content(role='user', parts=[types.Part(text=query)])
                print("Running agent with query...")
                events_async = runner.run_async(
                    session_id=session.id, user_id=session.user_id, new_message=content
                )

                async for event in events_async:
                    if event.is_final_response():
                        final_response = event.content.parts[0].text
                        print(f"Agent Response: {final_response}")
                    elif event.is_intermediate_response() and event.content.parts:
                        part = event.content.parts[0]
                        if part.function_call:
                            print(f"  Tool Call: {part.function_call.name}({part.function_call.args})")
                        elif part.function_response:
                            print(f"  Tool Response: {part.function_response.name} -> {part.function_response.response}")
                    elif event.is_error():
                         print(f"Error Event: {event.error}")

            except EOFError:
                 print("\nExiting loop.")
                 break
            except KeyboardInterrupt:
                 print("\nInterrupted. Exiting loop.")
                 break
            except Exception as loop_error:
                 print(f"\nError during interaction loop: {loop_error}")

    except Exception as e:
        print(f"\nAn error occurred during agent setup: {e}", file=sys.stderr)
    finally:
        if exit_stack:
            print("\nClosing MCP server connection managed by MCPToolset...")
            await exit_stack.aclose()
            print("MCP server connection closed.")
        else:
            print("\nNo MCP exit_stack to close (setup might have failed).")

if __name__ == '__main__':
  try:
    asyncio.run(async_main())
  except Exception as e:
    print(f"An top-level error occurred: {e}", file=sys.stderr)
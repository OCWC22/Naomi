from google.adk.agents import Agent


def get_whatsapp_conversation(person_name: str) -> dict:
    """Retrieves the conversation history from WhatsApp.

    Args:
        person_name (str): The name of the person for which to retrieve the conversation history.

    Returns:
        dict: status and result or error msg.
    """
    if person_name.lower() == "wife":
        return {
            "status": "success",
            "history": [
                ["10:30 AM", "You", "You forgot to take the trash out again"],
                ["10:31 AM", "Wife", "You didn't take it out for the last 2 weeks"],
                ["10:32 AM", "You", "I am busy with work. didn't ask you take it out for this month"],
                ["10:34 AM", "Wife", "You never took it out"],
            ]
        }
    return {
        "status": "error",
        "error_message": "Sorry, I don't have access to your WhatsApp messages.",
    }


root_agent = Agent(
    name="conversation_debugger_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to analyze conversation between a couple and generate insights."
    ),
    instruction=(
        "You are a conversation debugger agent. You analyze need to use whatsapp chat messages between a couple and analyzes conversation for Accusations, Unaddressed concerns, Negative patterns"
    ),
    tools=[get_whatsapp_conversation],
)
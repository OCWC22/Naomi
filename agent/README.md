# Conversation Debugger Agent

A specialized agent that analyzes WhatsApp conversations between couples to identify communication patterns, concerns, and potential issues.

## Features

- Analyzes WhatsApp chat messages between couples
- Identifies accusations and negative patterns
- Detects unaddressed concerns
- Uses Google's Gemini 2.0 Flash model for analysis

## Setup

1. **Prerequisites**
   - Python 3.x
   - pip (Python package installer)

2. **Installation**
   Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/OCWC22/Naomi.git
   cd Naomi/agent
   pip install -r requirements.txt
   ```

   This will install all required packages:
   - google-adk >= 1.0.0 (Google's Agent Development Kit)
   - fastapi >= 0.100.0 (API framework)
   - uvicorn >= 0.23.0 (ASGI server)

## Usage

### Local Testing
```bash
# Start the local development server
adk web
```
This will start a web interface at `http://localhost:8000` where you can test the agent interactively.

### Programmatic Usage
```python
from agent import root_agent

# Get analysis for a specific person's conversation
result = root_agent.run({"person_name": "wife"})
```

## Project Structure

- `agent.py`: Main agent implementation with WhatsApp conversation retrieval and analysis
- `requirements.txt`: Python package dependencies
- `README.md`: This documentation file

## Development

To extend the agent's capabilities:

1. Add new conversation analysis tools in `agent.py`
2. Update the agent's instruction prompt as needed
3. Test with different conversation patterns
4. If adding new dependencies, update `requirements.txt`

## Limitations

- Currently only supports mock data for demonstration
- Limited to WhatsApp conversations
- Basic pattern recognition
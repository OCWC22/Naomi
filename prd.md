PRD: Relationship Text Debug (Hackathon Draft v2)
1. Introduction & Goal
This document outlines the requirements for the "Relationship Text Debug" service, a hackathon project. The goal is to build a tool that helps users analyze recent WhatsApp conversations to understand arguments, identify negative communication patterns, and draft healthier responses with AI assistance. The primary technology will be Google's Agent Development Kit (ADK), supported by a RAG architecture using Pinecone, Supabase, and Gemini.
2. Target Audience
Primarily couples aged 25-40 experiencing communication challenges in text-based arguments (specifically WhatsApp).


3. Key Features
3.1 Account Management
User Registration/Login: Simple email/password or social login, managed via Supabase Auth.


WhatsApp Linking: Users can link their WhatsApp account via a standard QR code method. Backend securely stores necessary credentials/tokens (in Supabase) for the linked device.


3.2 Conversation Debug Setup
Conversation Selection: UI allows users to choose a specific WhatsApp conversation they wish to analyze.


Message Retrieval: Backend fetches a recent segment of the selected conversation (e.g., last 24 hours) to provide context.


3.3 Conversation Debug & Response Assistance
AI Analysis (Optional): User can trigger analysis. An ArgumentAnalyzerAgent (ADK) processes the conversation transcript, potentially referencing the RAG knowledge base (via Pinecone) for communication patterns.


AI-Powered Discussion:


A chat interface where the user discusses the argument with a primary coordination agent (ADK).


The agent uses the conversation transcript and potentially output from the ArgumentAnalyzerAgent as context.


Prioritizes understanding the user's perspective and desired outcome.


Presents identified patterns non-judgmentally, possibly informed by RAG context on healthy communication.


Response Drafting:


Interface for drafting a response.


User can ask for AI assistance. A ResponseStylistAgent (ADK) helps draft or refine the response, considering the user's goals and referencing the RAG knowledge base for effective communication techniques.


AI-generated first drafts are offered only when the user's intent is clear.


3.4 Backend
WhatsApp Integration: Mechanism to retrieve messages from the linked WhatsApp account.


Data Storage: Supabase used for storing user accounts, linked device info, and potentially message snippets/analysis results temporarily.


Vector Database: Pinecone used to store vector embeddings of knowledge base documents.


Knowledge Base Management: Simple mechanism (potentially manual script for hackathon) to process uploaded .txt or .md files, generate embeddings using the Gemini embedding model, and store them in Pinecone.


3.5 AI Agents (Built with ADK)
Leverage Google ADK framework to build multiple, specialized agents.


Key Agents (Examples):
ConversationDebugAgent (LlmAgent):
Purpose: To analyze the provided WhatsApp conversation transcript and identify potential communication issues. This agent acts as the primary analytical engine for understanding the argument dynamics.
Core Functionalities (using LLM reasoning, potentially guided by RAG):
Identify Accusations: Detect language that assigns blame or fault (e.g., "You always...", "You never...").
Spot Unaddressed Concerns: Recognize points or questions raised by one party that are ignored or deflected by the other.
Analyze Negativity/Sentiment: Assess the overall tone and identify specific instances or patterns of negativity, criticism, contempt, or defensiveness, potentially focusing on specific topics if relevant patterns emerge.
Implementation: Built using ADK's LlmAgent class, allowing it to leverage a large language model (like Gemini) for natural language understanding and reasoning25. It will receive the conversation transcript as input.
RAG Interaction: Queries the Pinecone vector database to retrieve relevant concepts about communication pitfalls, common argument patterns (like Gottman's Four Horsemen), and conflict styles to inform its analysis and provide contextually grounded insights.
ResponseDrafterAgent (LlmAgent):
Purpose: To assist the user in formulating a constructive and effective response based on the analysis and the user's stated goals.
Core Functionalities:
Goal Alignment: Takes input from the user (via the chat interface) about their desired outcome (e.g., de-escalate, clarify understanding, apologize, set a boundary).
Draft Generation: Creates potential response drafts aiming for a healthier communication style (e.g., using "I" statements, expressing empathy, suggesting concrete next steps).
Refinement: Can revise drafts based on user feedback.
Implementation: Also likely an LlmAgent25, receiving the conversation context, the ConversationDebugAgent's analysis (optionally), and the user's explicit drafting requests/goals as input.
RAG Interaction: Queries the Pinecone RAG store for best practices in constructive communication, examples of effective phrasing for apologies, boundary setting, expressing needs, etc., relevant to the user's specific situation and goals.
RAG Integration:
Both the ConversationDebugAgent and ResponseDrafterAgent will be equipped to interact with the RAG system as a specialized tool35.
When triggered, the agent formulates a query based on its current task (e.g., "Identify signs of stonewalling in this exchange," or "Provide examples of empathetic responses to criticism").
This query is used to perform a vector similarity search against the Gemini embeddings stored in the Pinecone database61015.
The relevant text chunks retrieved from the .txt/.md knowledge files (hosted in Supabase storage, indexed in Pinecone) are returned to the agent.
The agent incorporates this retrieved knowledge into its analysis or response generation process, grounding its output in the established knowledge base614. This helps reduce hallucination and increases the relevance and accuracy of the AI's assistance6.


4. Technology Stack
Core Framework: Google Agent Development Kit (ADK).


Language: Python.


LLM Integration: Integrate with a suitable Large Language Model (e.g., Gemini series via ADK) for core reasoning/generation.


Embeddings: Gemini Embedding Model.


Vector Database: Pinecone.


Data Storage / Backend: Supabase (PostgreSQL database, Auth, potentially edge functions).


UI: Basic web framework (e.g., Flask/FastAPI with simple HTML/CSS/JS, or Streamlit).


5. UI/UX Considerations
(No changes from the previous version - focus remains on simplicity, clarity, and supportive interaction)
Simplicity and Clarity: Minimal, clean, intuitive UI.


Target Audience Fit: Supportive, calm, non-judgmental aesthetic.


Key Screens/Pages (Hackathon Scope):


Login/Registration (using Supabase Auth).


Dashboard/Conversation List & WhatsApp Linking Button.


WhatsApp Linking Page/Modal.


Debug View (Conversation, AI Chat, Response Draft Area).


Navigation: Straightforward.


Onboarding: Minimal.


Intuitiveness: Clear language, logical flow.

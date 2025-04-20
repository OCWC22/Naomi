https://github.com/mem0ai/mem0-mcp (MCP repo)

https://mcp.composio.dev/mem0/shapely-absurd-carpenter-Vl7F5I (Composio MCP)


## Python Installation

Installation Steps
Install composio-toolset by running the following commands in your terminal:

pip install composio_openai
from composio_openai import ComposioToolSet, App
from openai import OpenAI

openai_client = OpenAI()
composio_toolset = ComposioToolSet(entity_id="default")

tools = composio_toolset.get_tools(apps=[App.MEM0])


## Typescript Installation

npm install -g composio_core
import { OpenAI } from "openai";
import { OpenAIToolSet } from "composio-core";

const openaiClient = new OpenAI();
const composioToolset = new OpenAIToolSet();

const tools = await composioToolset.getTools({
apps: ["mem0"],
});


## Available Actions
Get all 43 actions for this app by following the instruction guide.

Add new memory records
Add memories

Perform semantic search on memories
Perform a semantic search on memories.

Create a new organization entry
Create a new organization.

Retrieve entity specific memories
Retrieves all memories associated with a specific entity in the mem0 platform. this endpoint is used

Create project
Create a new project within an organization.

Create a new user
Create a new user.

Retrieve memory list
Get all memories

Create a new application
Create a new app.

Create a new agent
Create a new agent.

Update memory details by id
Get or update or delete a memory.

Retrieve memory related statistics for the authenticated user
This endpoint returns the following statistics: - total number of memories created - total number of

Fetch detailed list of organizations
Retrieves a list of organizations registered on the mem0 platform. this endpoint is essential for ad

Create memory entry
Get all memories

Search memories with query filters
Search memories based on a query and filters.

Update organization member role
Update the role of an existing member in a specific organization.

Retrieve memory by unique identifier
Get a memory.

Retrieve all events for the currently logged in user
This endpoint returns a paginated list of events associated with the authenticated user. you can fil

Update memory batch with uuid
Batch update multiple memories (up to 1000) in a single api call.

Remove a member from the organization
This endpoint removes a specified member from an organization within the mem0 b2b saas integration p

Create a new agent run
Create a new agent run.

Retrieve memory history by id
Retrieve the history of a memory.

Delete a specific memory by id
Get or update or delete a memory.

Fetch details of a specific organization
Get a organization.

Add organization member
Add a new member to a specific organization.

Fetch specific entity details with optional filters
Retrieves detailed information about a specific entity within the mem0 platform. this endpoint is us

Delete project
Delete a specific project and its related data.

Delete entity by type and id
Deletes a specific entity from the mem0 system based on the provided entity type and id. this endpoi

Get organization members
Retrieve a list of members for a specific organization.

Fetch list of entity filters
Retrieves the list of available filters for entities in the mem0 system. this endpoint allows develo

List entities with optional org and project filters
Retrieves a list of entities from the mem0 b2b saas integration platform. this endpoint allows devel

Delete memories endpoint
Delete memories

Delete project member
Removes a member from a specific project within an organization in the mem0 b2b saas integration pla

Get projects
Retrieve a list of projects for a specific organization.

Update project member role
Update the role of a member in a specific project within an organization.

Create an export job with schema
Create a structured export of memories based on a provided schema.

Export data based on filters
Get the latest memory export.

Add member to project
Add a new member to a specific project within an organization.

Update project
Update a specific project's settings.

Retrieve list of memory events
Retrieves a list of events from the mem0 platform's structured memory layer. this endpoint allows de

Delete memory batch with uuids
Batch delete multiple memories (up to 1000) in a single api call.

Get project details
Retrieve details of a specific project within an organization.

Delete an organization
Delete an organization by its id.

Get project members
Retrieve a list of members for a specific project.
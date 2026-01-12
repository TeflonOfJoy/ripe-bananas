= NodeJS Satellite Server <sec:express>

== Solution

The Satellite Server (`banana_bread`) is built with *Node.js* and *Express* interfaces directly with the MongoDB database. It is responsible for handling all dynamic data operations: storing movie reviews and managing real-time chat functionality.

=== Design and Motivations

The separation of this logic into its own server is a way of enforcing the *Microservices Architecture* principle. Which allows for:
- *Independent Scaling:* For example if there ever was a need to expand due to an increase in user-base, this server can be scaled independently.

==== Dependencies
- *Mongoose:* The ODM library used to model the MongoDB data, providing validation and schema definition.
- *Socket.IO:* Used to host the chat server, managing rooms and broadcasting messages.
- *Express Validator:* Middleware for sanitizing and validating incoming HTTP requests before they reach the database logic.

=== Implementation

==== Data Modeling
- *Review Model:* Handles CRUD operations for reviews. It includes a compound index to efficiently retrieve reviews by movie ID.
- *Chat Model:* Manages the chat history. It implements a static method `getRecentMessages(room, limit)` to quickly fetch the last 50 messages when a user joins a room.
- *ReviewAggregate Model:* Stores pre-calculated statistics to offload expensive aggregation queries.

==== Real-Time Chat Service
- *Room Management:* Users join rooms corresponding to specific preassigned topics.
- *Persistence:* Every message sent is validated, first at the client level and then by the server, and written to MongoDB before being broadcasted to other users in the room.

== Issues

==== Socket complexity
When design the chat the initial thought was to have everything pass through Socket.IO, this instantly proved to be a problem because of how sockets work.
One example from early development was that: whenever a new user entered a chat and subsequently requested the previous messages from the server, all user would get the messages, this quickly led to an explosion of duplicated messages.
To address this it was decided to restrict Socket.IO to the handling of only the data necessary for real-time communication between users.
And everything else is passed via API endpoints to each client.

==== Data Validation
To ensure data integrity in a NoSQL environment we strictly defined Mongoose schemas and added express-validator middleware to catch invalid input (e.g., empty reviews, extremely long messages) before they could pollute the database.

== Requirements
- *Dynamic Data Storage:* Efficiently stores and retrieves reviews and chat logs.
- *Real-Time Communication:* Provides low-latency chat functionality.
- *Data Integrity:* Enforces checks on user-generated content.

== Limitations
- *Aggregation Freshness:* As noted in the MongoDB section, complex statistics are essentially "eventually consistent" relying on background aggregation rather than real-time computation for performance reasons.

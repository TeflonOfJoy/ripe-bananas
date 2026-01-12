= NodeJS Main Server <sec:nodejs>

== Solution

The Main Server (`banana_split`) acts as Gateway for the entire application. As requested it is built using *Node.js* and *Express* and is responsible for routing requests to the appropriate satellites: `banana_bread` and `banana_bean`.

=== Design and Motivations

The primary goal was to hide the complexity of the backend from the client. The frontend should interact with a single API endpoint without knowing that the data resides in different databases which are themselves used by different technologies (Express and SpringBoot). This allows then for further modularity of the whole backend infrastructure, for example adding multiple doubles of both satellites to adapt to a future increase in users if needed.

==== Dependencies
- *Express:* The core web framework used for routing and middleware management.
- *Axios:* Used as an HTTP client to proxy requests to the underlying services.
- *Socket.IO & Socket.IO-Client:* To enable real-time bidirectional communication for the chat feature, acting as a proxy between the client and the Satellite Server.
- *Swagger:* Used in the routes for API documentation.
- *Helmet & CORS:* Security middleware to handle headers and Cross-Origin Resource Sharing.
- *Express Rate Limit:* To prevent abuse by limiting the number of requests from a single IP.

==== Architecture
As with the other servers this too follows the *MVC Pattern*.
- *Routing Layer:* Routes are segregated by domain (`/api/movies`, `/api/reviews`, `/api/chat`).
- *Proxy Logic:* Instead of processing data directly, the handlers forward requests to the appropriate backend service.
- *Documentation Script:* It aggregates the API definitions, providing a single source of truth for the API.

=== Implementation

==== Packages & Structure
- *`routes/`:* Contains the route definitions. `movie.routes.js`, `actor.routes.js`, and `genre.routes.js` forward traffic to the Spring Boot server, while `review.routes.js` and `chat.routes.js` direct traffic to the NodeJS Satellite server.
- *`app.js`:* The entry point that initializes the Express app, middleware, and the Socket.IO.

==== Socket.IO Proxy
One of the more complex implementation details was proxying the Socket.IO events. Since the chat logic has to reside in the Satellite Server, the Main Server establishes a socket connection to the Satellite Server as a *client*, while simultaneously acting as a *server* for the frontend. Events like `send-message` or `join-room` are caught from the frontend and re-emitted to the backend, and vice-versa.

== Issues

The main issue in the implementation of this server was the need to make it as thin as possible, it must not have any business logic or complex operations, that meant that everything had to be proxied.

Another issue was the documentation, the main server was the last one to be implemented at which point the other servers already had swagger documentation written.

It was decided that as the Gateway the main server is the one where API documentation is most needed.

The relevant documentation for the endpoint of the express satellite was copied directly while the documentation for the SpringBoot satellite had to be rewritten in the main server.

This achieves a single point of docs for anyone that needs to use the APIs, moreover to ease the development of the frontend it was decided to publish the documentation online with the help of `Bump.sh` a service that takes in a json file which follows the OpenAPI standard and publishes it in a nice web page.

To this extend a simple script was developed to automatically generate such a file.

== Requirements
- *Unified Entry Point:* All client requests go through this server.
- *Security:* Implements rate limiting and secure headers.
- *Real-time support:* Successfully proxies websocket events.

== Limitations
- *Single Point of Failure:* If this server goes down, the entire application becomes inaccessible, even if the backend services are healthy.
  - One way to address this would have been to modify the architecture for the use of Redis, allowing multiple servers to act as one, this would have been good for redundancy but unfortunately it fell outside the realistic scope of this project.
- *Latency:* Adding a hop in the request lifecycle introduces a small amount of latency, though negligible for this use case.

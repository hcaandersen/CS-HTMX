# CS-HTMX: Client-Side HTMX

CS-HTMX is an experimental Single Page Application (SPA) that implements HTMX purely on the client-side using a service worker. Once the web app is loaded, only data-related RPC requests are made to the server-side. No client-side code is required as the UI is generated purely from the data returned by the server and Handlebars templates. The web-app, as it is, runs on as a CompleteFTP web-app, but is easily adapted to run on any other server.

# Client-Side HTMX (CS-HTMX): Implementing MVC in Single-Page Apps with HTMX, Service Workers, RPC, and Templates

## Introduction

CS-HTMX (Client-Side HTMX) is a web development concept that enhances Single Page Applications (SPAs) by combining the simplicity of HTMX with the robust capabilities of service workers. This approach allows developers to write SPAs with only declarative code on the client-side, maintaining a clean MVC architecture. By using HTMX to dynamically update web pages without full reloads and service workers to intercept these requests and manage caching, CS-HTMX ensures that the server only returns JSON data via RPC calls. This data is then applied to client-side templates. Routes are defined to map requests to the appropriate server-side logic, eliminating the need to generate HTML on the server. This method provides the benefits of traditional SPAs while offering a more elegant and maintainable codebase.

## Key Components of CS-HTMX

### HTMX

HTMX is a client-side library that enables dynamic updates to web pages without requiring full reloads. It listens for specific events, such as form submissions or button clicks, and makes HTTP requests to fetch new content or perform actions. HTMX enhances user experience by allowing specific parts of a page to update in response to user actions.

### Service Worker

The service worker acts as an intermediary between the client and the server. It intercepts network requests, provides offline capabilities, and manages caching to improve performance. By intercepting HTMX requests, the service worker ensures efficient handling and can serve cached content when necessary, enhancing the application's responsiveness.

### Routes

Routes define the mapping between client-side requests and server-side actions. Specified in a JSON file, these routes map specific paths or actions to server-side logic and templates. The service worker uses these routes to determine how to handle incoming requests efficiently.

### Remote Procedure Calls (RPC)

RPC functions handle the server-side logic for various actions, such as adding or deleting a todo item. When HTMX triggers an event, the service worker invokes the corresponding RPC function. These functions interact with the database and return JSON data, which is then processed by the client.

### Templates

Templates define the HTML structure for different parts of the application. Handlebars templates are used for rendering dynamic content on the client side. The service worker fetches these templates and uses them to update the DOM with data returned from the server, ensuring that the user interface remains consistent and up-to-date.

## How It Works

1. **Client-Side Event**: A user action, such as submitting a form, triggers an HTMX request.
2. **HTMX Request**: HTMX sends the request to a specified endpoint, which is intercepted by the service worker.
3. **Service Worker Handling**: The service worker checks the route mappings to determine the appropriate action, such as fetching a template, calling an RPC function, or returning cached data.
4. **RPC Function Call**: If server-side logic is required, the service worker invokes the corresponding RPC function.
5. **Data Returned**: The server returns JSON data, which the service worker processes and applies to the appropriate client-side template.
6. **Template Applied**: The service-worker applies the JSON data to the template defined for the route to produce the HTML for the HTMX response.
7. **DOM Update**: HTMX updates the DOM dynamically based on the new data, providing a seamless user experience without a full page reload.

## Design Patterns and Principles

### Single Page Application (SPA) Pattern

CS-HTMX enables dynamic interactions and real-time updates without full page reloads, providing a user experience similar to Single Page Applications (SPA).

### Service Worker Pattern

The service worker manages network requests, caching, and offline capabilities, ensuring efficient data handling and improved performance.

### Model-View-Controller (MVC) Pattern

- **Model**: Server-side data and logic, managed by RPC functions.
- **View**: Client-side templates, rendered by Handlebars.
- **Controller**: Service worker and HTMX, managing requests and updates.

### Remote Procedure Call (RPC) Pattern

RPC functions allow server-side logic to be executed remotely, simplifying the interaction between client and server.

### Template Rendering Pattern

Handlebars templates enable dynamic rendering of HTML content on the client side, ensuring a responsive and consistent user interface.

### Observer Pattern

HTMX listens for user events and triggers appropriate actions, ensuring that the application responds dynamically to user interactions.

### Cache-Aside Pattern

The service worker caches templates and other resources, providing efficient data retrieval and offline capabilities.

### Separation of Concerns

Different components handle specific tasks, making the application modular and easier to maintain and scale.

## Benefits of CS-HTMX

- **Enhanced User Experience**: Dynamic updates and real-time interactions provide a smooth and engaging user experience.
- **Improved Performance**: Service worker caching and efficient data handling reduce load times and enhance performance.
- **Seamless Offline Capabilities**: The application can function even without an internet connection, thanks to the service worker.
- **Modular Architecture**: Clear separation of concerns makes the application easier to develop, maintain, and scale.
- **Flexibility and Extensibility**: The use of templates and configurable routes allows for easy customization and extension.

## Sample Project Description

This repository showcases the CS-HTMX concept through a simple todo list application. It serves as a proof-of-concept and example to illustrate the potential and functionality of the CS-HTMX framework.

### Directory Structure

```
+-- CS-HTMX
    +-- api
    |   +-- db.php            # Handles database connections and queries
    |   +-- todo.php          # Contains RPC functions for todo operations (add, delete, list)
    +-- templates
    |   +-- todoAdd.html      # Template for adding a new todo item
    |   +-- todoForm.html     # Template for the todo form
    |   +-- todoItem.html     # Template for an individual todo item
    |   +-- todoList.html     # Template for the todo list
    +-- cs-html.php           # Main PHP script that processes RPC calls and routes
    +-- cs-htmx.js            # Service worker script that handles request interception and caching
    +-- index.html            # Main HTML file that loads the application
    +-- manifest.json         # Web app manifest for PWA features
    +-- routes.json           # JSON file defining the routes for client-side requests
    +-- styles.css            # CSS file for styling the application

```

### How It Works

1. **Client-Side Event**: The user interacts with the application (e.g., adding a new todo item).
2. **HTMX Request**: HTMX captures the event and sends an HTTP request to the server.
3. **Service Worker Interception**: The service worker intercepts the request and checks the defined routes.
4. **RPC Function Call**: The appropriate RPC function is called to handle the request (e.g., adding the new item to the database).
5. **JSON Data Returned**: The server returns JSON data containing the result of the operation.
6. **Template Rendering**: The service worker fetches the relevant template and applies the returned data to it.
7. **DOM Update**: HTMX updates the DOM with the new content, ensuring a dynamic and responsive user experience.

## Getting Started

Follow these instructions to set up and run the CS-HTMX sample project.

### Prerequisites

- A web server with PHP support (e.g., Apache, Nginx)
- MySQL or MariaDB database
- Composer (for PHP dependency management, if necessary)

### Step 1: Clone the Repository

```bash
git clone https://github.com/hcaandersen/CS-HTMX.git
cd CS-HTMX
```

### Step 2: Set Up the Database

1. Create a new database in MySQL or MariaDB.

```sql
CREATE DATABASE todo_db;
```

2. Create the `tasks` table in the `todo_db` database.

```sql
USE todo_db;

CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    task VARCHAR(255) NOT NULL
);
```

### Step 3: Configure the Database Connection

Update the database connection settings in `api/db.php` if necessary.

```php
// api/db.php

function getDBConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "todo_db";
    ...
}
```

## Conclusion

CS-HTMX combines client-side interactivity, server-side data handling, and service workers to create dynamic, responsive, and efficient web applications. By leveraging modern web technologies and design patterns, CS-HTMX offers a robust framework for developing next-generation web applications. This white paper provides an overview of the CS-HTMX concept, its components, and their interactions, highlighting the benefits and potential of this innovative approach to web development.

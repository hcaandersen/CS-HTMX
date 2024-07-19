# CS-HTMX: Client-Side HTMX

CS-HTMX is an experimental Single Page Application (SPA) that implements HTMX purely on the client-side using a service worker. Once the web app is loaded, only data-related RPC requests are made to the server-side. No client-side code is required as the UI is generated purely from the data returned by the server and Handlebars templates.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Directory Structure

```
+-- CS-HTMX
    +-- templates
    |   +-- todoAdd.html
    |   +-- todoForm.html
    |   +-- todoItem.html
    |   +-- todoList.html
    +-- cs-htmx.js
    +-- index.html
    +-- manifest.json
    +-- routes.json
    +-- rpc.jss
    +-- styles.css
```

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

You will need a web server to serve the files. This project is set up to run on CompleteFTP with a web app on the path `/CS-HTMX`.

### Installing

1. **Clone the repository:**

```sh
git clone https://github.com/your-username/CS-HTMX.git
cd CS-HTMX
```

2. **Install `http-server` (if not already installed):**

```sh
npm install -g http-server
```

3. **Start the server:**

```sh
http-server
```

4. **Open your browser and navigate to:**

```
http://localhost:8080/CS-HTMX/index.html
```

5. **If using CompleteFTP, deploy the project to the `/CS-HTMX` path.**

## Usage

The application provides a simple Todo list implementation. Once the application is loaded, it registers a service worker which handles all further requests.

### Adding a Todo Item

1. Fill in the task in the input field.
2. Click on the `Add` button.
3. The new task will appear in the list below.

### Deleting a Todo Item

1. Click the `Delete` button next to the task you wish to remove.
2. The task will be removed from the list.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

### Adding Routes

To add new routes, update the `routes.json` file with the new route configuration.

### Handlebars Templates

All templates are stored in the `templates` directory. To add a new template, simply create a new `.html` file and update the `routes.json` file to use the new template.

### RPC Functions

RPC functions are defined in the `rpc.jss` file. You can add new functions and update the route configuration to use these functions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note:** This project is experimental and not ready for production use. It serves as a proof of concept to demonstrate client-side HTMX implementation using a service worker.
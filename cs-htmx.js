if (typeof window !== 'undefined') {
    // window is only defined when this file is loaded from a <script> tag (as opposed to being loaded as a service-worker),
    // so we assume that it's being loaded from index.html and that we therefore want to register the service-worker.
    // This saves the user having to explicitly include service-worker loading code.
    navigator.serviceWorker.register(document.currentScript.src)
        .then(r => console.log('Service worker registered'))
        .catch(error => console.error('Service worker registration failed:', error));
} else {

    // Below is the actual service worker code
    
    importScripts('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js');

    class Router {
        constructor(templateDirectory, cacheFiles) {
            const currentScriptUrl = self.location.href;
            this.templateDirectory = templateDirectory;
            this.routes = {};
            this.cacheName = 'cs-htmx';
            this.basePath = this.getBasePath();
            this.cacheFiles = cacheFiles ?? [];
            this.templates = {};
            this.loadedPartials = new Set();

            this.addEventListeners();
        }

        getBasePath() {
            const url = new URL(self.location);
            const pathname = url.pathname;
            return pathname.substring(0, pathname.lastIndexOf('/') + 1);
        }

        addRoute(htmxPath, rpcPath, rpcFunction, templateFileName) {
            let templatePath = templateFileName ? this.templateDirectory.replace(/\/$/, '') + '/' + templateFileName : null;
            if (templatePath && !this.cacheFiles.includes(templatePath))
                this.cacheFiles.push(templatePath);
            this.routes[`${this.basePath}${htmxPath}`] = { templatePath, rpcPath, rpcFunction };

            if (templatePath)
                caches.open(this.cacheName).then(cache => {
                    cache.add(templatePath).catch(err => {
                        console.log(`Failed to cache ${templatePath}:`, err);
                    });
                });
        }

        async loadRoutes(routesFile) {
            try {
                const response = await fetch(routesFile);
                if (!response.ok) {
                    throw new Error('Failed to fetch routes file');
                }
                const routes = await response.json();
                Object.keys(routes).forEach(r => {
                    let routeInfo = routes[r];
                    if (typeof routeInfo === 'string')
                        routeInfo = this.parseRouteString(routeInfo);
                    this.addRoute(r, routeInfo.rpcPath, routeInfo.rpcFunction, routeInfo.template);
                });
            } catch (error) {
                console.error('Error loading routes from file:', error);
            }
        }

        parseRouteString(routeString) {
            let rpcFunction = null;
            let rpcPath = null;
            let template = null;

            if (routeString.includes('@'))
                [rpcFunction, routeString] = routeString.split(/\s*@\s*/);

            if (routeString.includes('=>'))
                [rpcPath, template] = routeString.split(/\s*=>\s*/);
            else
                rpcPath = routeString;

            if (rpcFunction == "()")
                rpcFunction = null;

            return { rpcFunction, rpcPath, template };
        }

        cssToCamelCase(cssString) {
            return cssString.replace(/-([a-z])/g, function (match, letter) {
                return letter.toUpperCase();
            });
        }

        async handleHtmxRequest(event, url) {
            const route = this.routes[url.pathname];
            if (!route)
                return new Response('Not Found', { status: 404 });

            const { templatePath, rpcPath, rpcFunction } = route;

            try {
                let data = null;
                if (rpcPath && rpcFunction) {
                    let params = await this.getHtmxParameters(event, url);
                    data = await this.invokeJsonRPC(rpcPath, rpcFunction, params);
                    if (data === null)
                        return new Response(null, { status: 200 });
                }
                if (!this.templates[templatePath])
                    this.templates[templatePath] = await this.getTemplate(templatePath);
                const html = this.templates[templatePath](data);
                return new Response(html, { headers: { 'Content-Type': 'text/html' } });
            } catch (error) {
                console.error('Error handling request:', error);
                return new Response('Error handling request', { status: 500 });
            }
        }

        async getHtmxParameters(event, url) {
            let params = {
                _htmx: {
                    form: {},
                    query: {},
                    method: event.request.method,
                    headers: {}
                }
            };
            if (event.request.method === 'POST' || event.request.method === 'PUT') {
                const formData = await event.request.clone().formData();
                for (let pair of formData.entries())
                    params[pair[0]] = params._htmx.form[pair[0]] = pair[1];
            }
            for (let [key, value] of event.request.headers.entries())
                if (key.startsWith("hx-"))
                    params._htmx.headers[key] = value;

            for (let [key, value] of url.searchParams.entries())
                params[key] = params._htmx.query[key] = value;
            return params;
        }

        async getTemplate(templatePath) {
            const cacheEntry = await caches.match(templatePath);
            const templateText = cacheEntry
                ? await cacheEntry.text()
                : await fetch(templatePath).then(networkResponse => networkResponse.text());
            await this.scanAndLoadPartials(templateText);
            return Handlebars.compile(templateText);
        }

        async loadPartial(name, path) {
            if (this.loadedPartials.has(name)) {
                return;
            }

            const response = await fetch(this.basePath + path);
            const text = await response.text();
            await this.scanAndLoadPartials(text);
            Handlebars.registerPartial(name, text);
            this.loadedPartials.add(name);
        }

        async scanAndLoadPartials(templateText) {
            const partialRegex = /{{>\s*([\w-]+)\s*}}/g;
            let match;
            const partialsToLoad = new Set();

            while ((match = partialRegex.exec(templateText)) !== null)
                partialsToLoad.add(match[1]);

            for (const partial of partialsToLoad)
                await this.loadPartial(partial, `templates/${partial}.html`);
        }

        async invokeJsonRPC(rpcPath, method, ...params) {

            try {
                const response = await fetch(rpcPath, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        method: method,
                        params: params,
                        id: 1,
                        jsonrpc: "1.1"
                    })
                });

                if (!response.ok)
                    throw new Error('Network response was not ok');

                const responseData = await response.json();

                if (responseData.error)
                    throw new Error(responseData.error.message);

                return responseData.result;
            } catch (error) {
                console.error('Error calling JSON-RPC:', error);
                throw error;
            }
        }

        addEventListeners() {
            self.addEventListener('install', (event) => this.handleServiceWorkerInstall(event));
            self.addEventListener('fetch', (event) => event.respondWith(this.handleServiceWorkerFetch(event)));
            self.addEventListener('activate', (event) => this.handleServiceWorkerActivate(event));
        }

        handleServiceWorkerInstall(event) {
            event.waitUntil(
                caches.open(this.cacheName)
                    .then((cache) => cache.addAll(this.cacheFiles))
            );
        }

        handleServiceWorkerActivate(event) {
            var cacheWhitelist = [this.cacheName];
            event.waitUntil(
                caches.keys().then(cacheNames =>
                    Promise.all(
                        cacheNames
                            .filter(cacheName => cacheWhitelist.indexOf(cacheName) === -1)
                            .map(cacheName => caches.delete(cacheName))
                    )
                )
            );
        }

        async handleServiceWorkerFetch(event) {
            const url = new URL(event.request.url);

            if (event.request.headers.get('HX-Request') === 'true')
                return (async () => await this.handleHtmxRequest(event, url))();
            else
                return caches.match(event.request)
                    .then(response => response ?? fetch(event.request));
        }
    }

    let router = new Router('templates', ['index.html', 'styles.css']);
    router.loadRoutes('routes.json');
    console.log("Routes loaded");
}
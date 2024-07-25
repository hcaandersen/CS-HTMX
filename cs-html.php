<?php

$globals = [];
$routes = json_decode(file_get_contents('routes.json'), true);

function handleRequest($routes) {
    $request = json_decode(file_get_contents('php://input'), true);

    if (!isset($request['method']) || !isset($request['params'])) {
        error_log('Invalid request: ' . json_encode($request));
        return ['error' => 'Invalid request'];
    }

    $method = $request['method'];
    $params = $request['params'];

    error_log('Request received: method=' . $method . ', params=' . json_encode($params));

    foreach ($routes as $route) {
        $routeInfo = is_string($route) ? parseRouteString($route) : $route;
        error_log('Checking route: ' . json_encode($routeInfo));
        
        if ($routeInfo['rpcFunction'] === $method) {
            include_once $routeInfo['rpcPath'];
            error_log('Included file: ' . $routeInfo['rpcPath']);
            
            if (function_exists($method)) {
                try {
                    $result = call_user_func($method, $params);
                    error_log('Function executed successfully: result=' . json_encode($result));
                    return ['result' => $result];
                } catch (Exception $e) {
                    error_log('Exception caught: ' . $e->getMessage());
                    return ['error' => $e->getMessage()];
                }
            } else {
                error_log('Method not found: ' . $method);
                return ['error' => 'Method not found'];
            }
        }
    }

    error_log('Route not found for method: ' . $method);
    return ['error' => 'Route not found'];
}

function parseRouteString($routeString) {
    $rpcFunction = null;
    $rpcPath = null;
    $template = null;

    if (strpos($routeString, '@') !== false) {
        list($rpcFunction, $routeString) = explode('@', $routeString);
    }

    if (strpos($routeString, '=>') !== false) {
        list($rpcPath, $template) = explode('=>', $routeString);
    } else {
        $rpcPath = $routeString;
    }

    return [
        'rpcFunction' => trim($rpcFunction),
        'rpcPath' => trim($rpcPath),
        'template' => $template ? trim($template) : null
    ];
}

$response = handleRequest($routes);

header('Content-Type: application/json');
echo json_encode($response);
?>

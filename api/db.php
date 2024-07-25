<?php

function getDBConnection() {

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "todo_db";
    
    global $globals;

    if (!isset($globals['conn'])) {
        try {
            $globals['conn'] = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $globals['conn']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            exit;
        }
    }
    return $globals['conn'];
}


function query($sql, $params = []) {
    $stmt = getDBConnection()->prepare($sql);
    foreach ($params as $key => &$value) {
        $stmt->bindParam($key, $value);
    }
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

?>
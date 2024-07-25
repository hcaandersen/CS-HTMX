<?php

include 'db.php';

function todoList($params) {
    $tasks = query("SELECT * FROM tasks");
    return ['tasks' => $tasks];
}

function todoAdd($params) {
    $id = 'id-' . bin2hex(random_bytes(16));
    query("INSERT INTO tasks (id, task) VALUES (:id, :task)", [
        ':id' => $id,
        ':task' => $params['task']
    ]);
    return ['id' => $id, 'task' => $params['task']];
}

function todoDelete($params) {
    query("DELETE FROM tasks WHERE id = :id", [
        ':id' => $params['id']
    ]);
}
?>

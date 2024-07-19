// Load DatabaseSync library
var db = new DatabaseSync("/CS-HTMX/todo.sqlite3");

// Initialize database if not already done
db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, task TEXT)");
});

function todoList() {
    var tasks = [];
    db.readTransaction(function(tx) {
        var result = tx.executeSql("SELECT id, task FROM tasks");
        tasks = result.rows;
    });
    return { tasks: tasks };
}

function todoAdd(params) {
    var id = generateId();
    var newTask = { id: id, task: params.task };
    db.transaction(tx => tx.executeSql("INSERT INTO tasks (id, task) VALUES (?, ?)", [id, params.task]));
    return newTask;
}

function todoDelete(params) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM tasks WHERE id = ?", [params.id]);
    });
}

// Helper function to generate unique IDs
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

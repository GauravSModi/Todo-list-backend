const db = require('./database');


// Get all the notes associated with a user
function getNotes(user_id) {
    return new Promise(resolve => {
        const sql_query = "SELECT * FROM Note WHERE user_id = ?";

        // Probably don't need to escape user_id here because 
        // the value is coming from token authorization
        db.conn.query(sql_query, [user_id], async (err, result) => {
            if (err) {
                resolve([500, 'Database Error']);
            } else {
                if (result.length === 0) {
                    console.log("No Notes found")
                    resolve([200, 'No Notes Found']);
                } else {
                    const notes = result.map(note => ({
                        note_id: note.note_id,
                        title: note.title,
                        is_fav: note.is_favorite,
                        is_note: note.is_note
                    }));
                    resolve([200, notes]);
                }
            }
        });
    });
};

function getMessage(user_id, note_id) {
    return new Promise(resolve => {
        const sql_query = "SELECT * FROM Message WHERE note_id = ? AND user_id = ?";
        
        db.conn.query(sql_query, [note_id, user_id], async (err, result) => {
            if (err) {
                resolve([500, 'Database Error']);
            } else {
                if (result.length === 0) {
                    resolve([200, 'No Tasks Found']);
                } else {
                    let note = {
                        message_id: result[0].message_id,
                        message: result[0].message_content
                    }
                    console.log(result[0].message_content);
                    resolve([200, note]);
                }
            }
        });
    });
};


// Get all the tasks and their details associated with a list
function getTasks(user_id, note_id) {
    return new Promise(resolve => {
        const sql_query = "SELECT * FROM Task WHERE note_id = ? AND user_id = ?";
        
        db.conn.query(sql_query, [note_id, user_id], async (err, result) => {
            if (err) {
                resolve([500, 'Database Error']);
            } else {
                if (result.length === 0) {
                    resolve([200, 'No Tasks Found']);
                } else {
                    const tasks = result.map(task => ({
                        task_id: task.task_id,
                        description: task.description,
                        is_completed: task.is_completed
                    }));
                    resolve([200, tasks]);
                }
            }
        });
    });
};

function createNote(user_id, title, message) {
    return new Promise(resolve => {
        const sql_query = "INSERT INTO Note (user_id, title, is_note) VALUES (?, ?, 0)";
        let note_id = null;

        db.conn.query(sql_query, [user_id, title], async (err, result) => {
            if (err) {
                console.log('Error: ', err);
                resolve([500, 'Database error']);
            } else {
                // console.log('result: ', result);
                note_id = result.insertId;
                if (message == null) {
                    message = '';
                }

                if (note_id != null) {
                    const sql_query = "INSERT INTO Message (note_id, user_id, message_content) VALUES (?, ?, ?)";
        
                    db.conn.query(sql_query, [note_id, user_id, message], async (err, result) => {
                        if (err) {
                            console.log('Error: ', err);
                            resolve([500, 'Database error']);
                        } else {
                            console.log('result: ', result);
                            resolve([200, note_id])
                        }
                    });
                }
            }
        });

    });
};

function createList(user_id, title, tasks) {
    return new Promise(resolve => {
        const sql_query = "INSERT INTO Note (user_id, title, is_note) VALUES (?, ?, 1)";
        let note_id = null;

        db.conn.query(sql_query, [user_id, title], async (err, result) => {
            if (err) {
                console.log('Error: ', err);
                resolve([500, 'Database error']);
            } else {
                // console.log('result: ', result);
                note_id = result.insertId;

                for (const task in tasks) {
                    // console.log('task: ', tasks[task]);
                    if (note_id !== null && task !== null) {
                        const sql_query = "INSERT INTO Task (note_id, description, user_id) VALUES (?, ?, ?)";
        
                        db.conn.query(sql_query, [note_id, tasks[task], user_id], async (err, result) => {
                            if (err) {
                                console.log('Error: ', err);
                                resolve([500, 'Database error']);
                            } else {
                                console.log('result: ', result);
                            }
                        });
                    }
                }

                resolve([200, note_id]);
            }
        });

        console.log("note_id: ", note_id);

    });
};

function updateTitle(user_id, note_id, title) {
    return new Promise(resolve => {
        const sql_query = "UPDATE Note SET title = ? WHERE user_id = ? and note_id = ?";


        db.conn.query(sql_query, [title, user_id, note_id], async (err, result) => {
            if(err) {
                console.log('Error: ', err);
                resolve([500, 'Database error']);
            } else {
                if (result.affectedRows === 1){
                    resolve([200]);
                }
            }
        });
    });
};

function updateList(user_id, ) {

};

function deleteTask(user_id, task_id) {

};

module.exports = {
    getNotes,
    getMessage,
    getTasks,
    createNote,
    createList,
    updateTitle,
    updateList,
    deleteTask,
};
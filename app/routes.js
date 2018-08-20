const Todo = require('./models/todo');

function getTodos(res) {
    Todo.find((err, todos) => {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', (req, res) => {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    app.get('/api/todos/:text', (req, res) => {
        console.log(req.params.text)
        Todo.find({
            'text': req.params.text
        }, (err, todo) => {
            if (err)
                res.send(err);
            res.json(todo);
        });
    })

    // create todo and send back all todos after creation
    app.post('/api/todos', (req, res) => {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, (err, todo) => {
            if (err)
                res.send(err);            
            
            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', (req, res) => {
        Todo.remove({
            _id: req.params.todo_id
        }, (err, todo) => {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};

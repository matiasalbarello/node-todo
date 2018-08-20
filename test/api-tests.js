var request = require('supertest');
var app = require('../server');
var Todo = require('../app/models/todo');

describe("Todo App", function () {    

    this.beforeAll(function(){
        Todo.remove({},function(){
            console.log("Cleaning DB before test");
        });
        Todo.create({
            text: "ONE",
            done: false
        });
        Todo.create({
            text: "TWO",
            done: false
        });
    });

    it("Loads the home page", function(done) {
        request(app).get("/").expect(200).end(done);
    });

    describe("Todos API", function () {
        it("GETS Todos-api", function(done) {
            let rNum = Math.floor(Math.random()*1000)
            request(app)
              .post("/api/todos")
              .send({"text": `Test todo api ${rNum}`})
              .end(function(){
                request(app)
                .get("/api/todos")              
                .expect(function(res) {                            
                    let insertedItem = res.body[res.body.length - 1];
                    res.body = { text: insertedItem.text };
                })
                .expect(200, {
                    text:  `Test todo api ${rNum}`
                })
                .end(done);
              });
        });

        it("GETS a Todo from the API", function(done) {
            request(app)
            .get(`/api/todos/ONE`)
                .expect(function(res) {
                    let insertedItem = res.body[res.body.length - 1];
                    res.body = { text: insertedItem.text };
                })
                .expect(200, {
                    text: "ONE"
                })
                .end(done);
        });

        it("POSTS Todos-api", function(done) {
            request(app)
              .post("/api/todos")
              .send({"text":"Test todo api"})
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)        
              .expect(function(res) {                            
                  let insertedItem = res.body[res.body.length - 1];
                  res.body = { text: insertedItem.text };
              })
              .expect(200, {
                  text: 'Test todo api'
              })
              .end(done);
        });

        it("DELETES Todos-api", function(done) {
            Todo.find({text: "TWO"}, (err,todos) => {
                if (err)
                    done(err);
                let todo_id = todos[0]._id;
                request(app)
                    .del('/api/todos/' + todo_id)
                    .expect(200)
                    .end(function(err, res){
                        done();
                    });
            });
        });

    });
});
var request = require('supertest');
var app = require('../server');
var Todo = require('../app/models/todo');

describe("Todo App", function () {    

    this.beforeAll(function(){
        Todo.remove({},function(){
            console.log("Cleaning DB before test");
        })
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
            let rNum = Math.floor(Math.random()*1000)
            request(app)
              .post("/api/todos")
              .send({"text": `todo${rNum}`})
              .end(function(){
                request(app)
                .get(`/api/todos/todo${rNum}`)
                .expect(function(res) {
                    let insertedItem = res.body[res.body.length - 1];
                    res.body = { text: insertedItem.text };
                })
                .expect(200, {
                    text:  `todo${rNum}`
                })
                .end(done);
              });
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
            request(app)
            .post('/api/todos')
            .send({text:'test-add-todo'})
            .end(function(err, res) {                                
                request(app)
                    .del('/api/todos/' + res.body[res.body.length - 1]._id)
                    .expect(200)
                    .end(function(err, res){                        
                        done();
                    });
            });
        });

    });
});
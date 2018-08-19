var request = require('supertest');
var expect = require('chai').expect;
var app = require('../server');
var todo = require('../app/routes').todo;

describe("Todo App", function () {    

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

        it("POSTS Todos-api", function(done) {
            request(app)
              .post("/api/todos")
              .send({"text":"Test todo api"})
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              /*.expect(200, {
                //id: 'some fixed id',
                text: 'Test todo api'
              }, done);*/
              .expect(function(res) {                            
                  let insertedItem = res.body[res.body.length - 1];
                  res.body = { text: insertedItem.text };
              })
              .expect(200, {
                  text: 'Test todo api'
              })
              .end(done);
              
        });
        var idInserted;
        before(function(done){
            let rNum = Math.floor(Math.random()*1000)
            
            // First I insert an item and retrieve it
            request(app)
              .post("/api/todos")
              .send({"text": `Test todo api ${rNum}`})
              .end(function(){
                request(app)
                  .get("/api/todos")              
                  .expect(function(res) {                            
                    let insertedItem = res.body[res.body.length - 1];
                    idInserted = { id: insertedItem.id };
                  })
                  .expect(200)
                  .end(done);
                });
        })

        it("DELETES Todos-api", function(done) {
            request(app)
            .post('/api/todos')
            .send({text:'test-add-todo'})
            .end(function(err, res) {                                
                request(app)
                    .del('/api/todos/' + res.body[res.body.length - 1]._id)
                    .expect(200)
                    .end(function(err, res){
                        console.log(res.body[res.body.length - 1]);
                        done();
                    });
            });
        });

    });
});
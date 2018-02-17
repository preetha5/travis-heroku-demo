//import chai and chai http
const chai = require('chai');
const chaiHttp =  require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
//Import run, close and app from server.js
const {runServer, app, closeServer} = require('../server');

describe('Recipes', function(){
    before(function(){
        return runServer;
    });

    after(function(){
        return closeServer;
    });

    //Test for GET method
    it("should list recipes on GET", function(){
        return chai.request(app).get('/recipes')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);

                const expectedKeys = ['id', 'name', 'ingredients'];
                res.body.forEach(item => {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            })
    });
    //Test for POST method
    it("should add recipe on POST", function(){
        const newRecipe = {
            name: "PBJ",
            ingredients :["bread", "peanut butter", "jam"]
        };
        return chai.request(app).post('/recipes')
            .send(newRecipe)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(["id", "name", "ingredients"]);
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newRecipe,{id:res.body.id}));
            });
    });

    //Test for PUT method
    it("should update recipe item on PUT", function(){
        const updateItem = {
            name: "PBJ",
            ingredients :["bread", "peanut butter", "jam"]
            };
        return chai.request(app)
            .get('/recipes')
            .then(function(res){
                updateItem.id = res.body[0].id;
                return chai.request(app)
                .put(`/recipes/${updateItem.id}`)
                .send(updateItem);
            })
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.deep.equal(updateItem);
            })
        });
    
    //Test for DELETE method
    it("should delete recipe on DELETE", function(){
        return chai.request(app)
        .get('/recipes')
        .then(function(res){
            return chai.request(app)
            .delete(`/recipes/${res.body[0].id}`)
        })
        .then(function(res){
            expect(res).to.have.status(204);
        })
    })

})


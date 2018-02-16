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
    })
})


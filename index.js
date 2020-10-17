const Joi = require('joi');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const customers = require('./DB/customers');

mongoose.connect('mongodb://localhost/menu')
    .then(() => console.log('CONNECTED TO MONGODB'))
    .catch(err => console.error('could not connect...', err));

app.use(express.json());

// to display list of customers
app.get('/api/customers', (req, res) => {
    res.send(customers);
});

// to create a customer
app.post('/api/customers', (req, res) => {
    const { error } = validateCustomers(req.body)
    if (error) return res.status(400).send(result.error.details[0].message);

    //Get the customer data
    let customer = {
        id: customers.length + 1,
        name: req.body.name,
        age: req.body.age
    };
    //insert the new customer to the customers array
    customers.push(customer)
    //return the newly added customer
    res.send(customer);
});



function validateCustomers(customer) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(customer, schema);
  }
  

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`listening on port ${port}...`))
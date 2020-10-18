const Joi = require('joi');
const express = require('express');
//const app = express();
const router = express.Router();
//const mongoose = require('mongoose');
const customersList = require('./DB/customersList');

router.use(express.json());

// to display the customersList
router.get('/api/customersList', (req, res) => {
    res.send(customersList);
});

// to display a particular customersList 
router.get('/api/customersList/:id', (req, res) => {
    const customer = customersList.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
  });
  

// to create a customer 
router.post('/api/customer', (req, res) => {
    const { error } = validateCustomersList(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //Get the customer data
    let customer = {
        id: customersList.length + 1,
        name: req.body.name
    };
    //insert the new customer to the customers array
    customersList.push(customer)
    //return the newly added customer
    res.send(customer);
});

//updating the customersList
router.put('/api/customersList/:id', (req, res) => {
    const customer = customersList.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    const { error } = validateCustomersList(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    customer.name = req.body.name; 
    res.send(customer);
  });

// deleting an 
router.delete('/api/customersList/:id', (req, res) => {
    const customer = customersList.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    const index = customersList.indexOf(customer);
    customersList.splice(index, 1);
  
    res.send(`customer deleted successfully`);
  });
  

  // validating input for customersList items
function validateCustomersList(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
  
    return Joi.validate(customer, schema);
  }

module.exports = router;
const Joi = require('joi');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const customersRoute = require('./customersRoute')
const menu = require('./DB/menu');


mongoose.connect('mongodb://localhost/menu')
    .then(() => console.log('CONNECTED TO MONGODB'))
    .catch(err => console.error('could not connect...', err));

app.use(express.json());
app.use('/customersRoute', customersRoute);

// to display the menu
app.get('/api/menu', (req, res) => {
    res.send(menu);
});

// to display a particular menu item
app.get('/api/menu/:id', (req, res) => {
    const menuItem = menu.find(c => c.id === parseInt(req.params.id));
    if (!menuItem) return res.status(404).send('The menuItem with the given ID was not found.');
    res.send(menuItem);
  });
  

// to create a food item
app.post('/api/menuItem', (req, res) => {
    const { error } = validateMenu(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //Get the food item data
    let menuItem = {
        id: menu.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    //insert the new item to the menu array
    menu.push(menuItem)
    //return the newly added item
    res.send(menuItem);
});

//updating the menu
app.put('/api/menu/:id', (req, res) => {
    const menuItem = menu.find(c => c.id === parseInt(req.params.id));
    if (!menuItem) return res.status(404).send('The item with the given ID was not found.');
  
    const { error } = validateMenu(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    menuItem.name = req.body.name; 
    res.send(menuItem);
  });

// deleting an item
app.delete('/api/menu/:id', (req, res) => {
    const menuItem = menu.find(c => c.id === parseInt(req.params.id));
    if (!menuItem) return res.status(404).send('The item with the given ID was not found.');
  
    const index = menu.indexOf(menuItem);
    menu.splice(index, 1);
  
    res.send(`item deleted successfully`);
  });
  

  // validating input for menu items
function validateMenu(menuItem) {
    const schema = {
        name: Joi.string().min(3).required(),
        price: Joi.number().min(2).required()
    };
  
    return Joi.validate(menuItem, schema);
  }
  

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`listening on port ${port}...`))
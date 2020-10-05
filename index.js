const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const foods = [
    {type: 'fruit', name: 'Apple'},
    {type: 'vegetable', name: 'Broccoli'},
    {type: 'grain', name: 'Wheat'}
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/food', (req, res) => {
    res.send(foods);
});

app.get('/api/food/:type', (req, res) => {
    const foodType = foods.find( f => f.type === req.params.type);
    if(!foodType) return res.status(404).send('The food with given type could NOT be found!');
    res.send(foodType);
});

app.post('/api/food', (req, res) => {
    const { error } = validateFood(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    const food = {
        type: req.body.type,
        name: req.body.name
    };

    foods.push(food);
    res.send(food);
});

app.put('/api/food/:name', (req, res) =>{
    const food = foods.find( f => f.name === req.params.name);
    if(!food) return res.status(404).send('The food with given name could NOT be found!');
    
    const { error } = validateFood(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    food.name = req.body.name
    res.send(food);
});


app.delete('/api/food/:name', (req, res) => {
    const food = foods.find( f => f.name === req.params.name);
    if(!food) return res.status(404).send('The food with given name could NOT be found!');

    const index = foods.indexOf(food);
    foods.splice(index, 1);

    res.send(food);
})


function validateFood(food) {
    const schema = {
        name: Joi.string().min(4).required(),
        type: Joi.string().min(4).required()
    };

    return Joi.validate(food, schema);
}



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listen on port ${port}...`));

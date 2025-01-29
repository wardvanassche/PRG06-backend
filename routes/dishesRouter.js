import Dish from "../models/Dish.js";
import {Router} from "express";
import {faker} from "@faker-js/faker";

const dishesRouter = new Router();

dishesRouter.get('/', async (req, res) => {

    const dishes = await Dish.find({});

    res.status(200).send;
    res.json({
        "items": dishes,
        "_links": {
            "self": {
                "href": process.env.BASE_URL
            },
            "collection": {
                "href": process.env.BASE_URL
            },
        }
    });
});

dishesRouter.get('/:id', async (req, res) => {

    const id = req.params.id;
    const dish = await Dish.findById(id);

    if(!dish) {
        res.status(404).json( { message: 'dish not found' } );
    } else {
        res.status(200).send(dish);
    }
});

dishesRouter.post('/seed/:amount', async(req, res) => {

    await Dish.deleteMany();

    const amount = req.params.amount;

    for (let i = 0; i < `${amount}`; i++) {
        console.log(i);
        let dish = new Dish({
            dish: faker.food.dish(),
            kitchen: faker.food.ethnicCategory(),
            author: faker.person.fullName(),
            description: faker.food.description(),
        });

        await dish.save();
    }
    res.status(201).json( { message: 'dish(es) seeded' });
});

dishesRouter.post('/', async (req, res) => {

    const dish = req.body.dish;
    const kitchen = req.body.kitchen;
    const author = req.body.author;
    const description = req.body.description;

    let newDish = new Dish({
        dish: dish,
        kitchen: kitchen,
        author: author,
        description: description,
    });

    if(req.body.dish && req.body.kitchen && req.body.author && req.body.description) {
        await newDish.save();
        res.status(201).json({ message: 'dish created' });
    } else {
        res.status(400).json({ error: 'bad request' });
    }
});

dishesRouter.put('/:id', async (req, res) => {

    const id = req.params.id;

    const dish = req.body.dish;
    const kitchen = req.body.kitchen;
    const author = req.body.author;
    const description = req.body.description;

    if(req.body.dish && req.body.kitchen && req.body.author && req.body.description) {
        await Dish.findByIdAndUpdate(
            id,
            { dish, kitchen, author, description, }
        )
        res.status(200).json({ message: 'dish updated' });
    } else {
        res.status(400).json({ error: 'bad request' });
    }
});

dishesRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const dish = await Dish.findById(id);

    if(!dish) {
        res.status(404).json( { error: 'dish not found' });
    } else {
        await dish.deleteOne({_id : id});
        res.status(204).json({ message: 'dish deleted' });
    }
});

dishesRouter.options('/', async (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
    res.status(204).send();
});

dishesRouter.options('/:id', async (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS, DELETE")
    res.status(204).send();
});

export default dishesRouter;
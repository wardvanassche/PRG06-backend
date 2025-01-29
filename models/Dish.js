import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    dish: {type: String},
    kitchen: {type: String},
    author: {type: String},
    description: {type: String},
},  {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.BASE_URL}/${ret._id}`
                },
                collection: {
                    href: process.env.BASE_URL
                }
            }

            delete ret._id
        }
    }
});

const Dish = mongoose.model('Dish', dishSchema);

export default Dish
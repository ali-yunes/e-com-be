import mongoose from "mongoose";

export const ReviewSchema = new mongoose.Schema({
    productId: {type:String, required: true},
    userId: {type:String, required: true},
    title: {type:String, required: true},
    comment: {type:String, required: true},
    rating: {type:Number, required: true},
    dateCreated: {type: Date, default: Date.now},
    dateModified: {type: Date, default: Date.now},
});

ReviewSchema.pre("save", function(next) {
    this.dateModified = new Date();
    next();
});

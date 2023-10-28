import mongoose from "mongoose";

export const ItemSchema = new mongoose.Schema({
    sellerId: {type:String, required: true},
    name: {type:String, required: true},
    description: {type:String, required: true},
    category: {type:String, required: true},
    price: {type:Number, required: true},
    image: {type:String, required: true},
    quantity: {type:Number, required: true},
    sold: {type:Number, required: true},
    dateCreated: {type: Date, default: Date.now},
    dateModified: {type: Date, default: Date.now},
});

ItemSchema.pre("save", function(next) {
    this.dateModified = new Date();
    next();
});

export const ItemModel = mongoose.model("Item", ItemSchema);

export const getItems = () => ItemModel.find();

export const getItemsByCategory = (category:string) => ItemModel.find({"category": category});
export const getItemById = (id:string) => ItemModel.findById(id);
export const createItem = (values: Record<string, any>) => new ItemModel(values).save().then((item)=> item.toObject());
export const deleteItemById = (id:string) => ItemModel.findByIdAndDelete(id);


type SearchQuery = {
    name: {
        $regex: string,
        $options: string
    },
    category?: string
}
export const searchPaginatedItems = (searchTerm:string, category:string, page:number, limit:number) => {
    let query: SearchQuery = {
        "name": {$regex: searchTerm, $options: "i"}
    };

    if(category){
        query.category = category;
    }

    return ItemModel.find(query).skip(page*limit).limit(limit);
}
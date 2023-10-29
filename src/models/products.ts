import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
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

ProductSchema.pre("save", function(next) {
    this.dateModified = new Date();
    next();
});

export const ProductModel = mongoose.model("Product", ProductSchema);

export const getProducts = () => ProductModel.find();

export const getProductsByCategory = (category:string) => ProductModel.find({"category": category});
export const getProductById = (id:string) => ProductModel.findById(id);
export const createProduct = (values: Record<string, any>) => new ProductModel(values).save().then((product)=> product.toObject());
export const deleteProductById = (id:string) => ProductModel.findByIdAndDelete(id);


type SearchQuery = {
    name: {
        $regex: string,
        $options: string
    },
    category?: string
}
export const searchPaginatedProducts = (searchTerm:string, category:string, page:number, limit:number) => {
    let query: SearchQuery = {
        "name": {$regex: searchTerm, $options: "i"}
    };

    if(category){
        query.category = category;
    }

    return ProductModel.find(query).skip(page*limit).limit(limit);
}

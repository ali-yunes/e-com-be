import mongoose from "mongoose";
import {Review} from "./review";
const { ObjectId } = mongoose.Types;

export const ProductSchema = new mongoose.Schema({
    sellerId: {type:String, required: true},
    name: {type:String, required: true},
    description: {type:String, required: true},
    category: {type:String, required: true},
    price: {type:Number, required: true},
    discount: {type: Number, default: 0},
    reviews: {type: [Review.schema], default: []},
    image: {type:String, required: true},
    quantity: {type:Number, required: true},
    sold: {type:Number, default: 0},
    dateCreated: {type: Date, default: Date.now},
    dateModified: {type: Date, default: Date.now},
});

ProductSchema.pre("save", function(next) {
    this.dateModified = new Date();
    next();
});

export const Product = mongoose.model("Product", ProductSchema);


export const getProductById = (id:string) => {
    let pipeline: AggregationPipeline = [
        { $match: {_id: new ObjectId(id)} },
        {
            $addFields: {
                reviewCount: { $size: "$reviews" },
                ratingAverage: { $avg: "$reviews.rating" }
            }
        },
        {
            $project: {
                sellerId: 0,
                dateCreated: 0,
                dateModified: 0,
                __v: 0,
            }
        }
    ];

    return Product.aggregate(pipeline).exec();
};

export const createProduct = (values: Record<string, any>) => new Product(values).save().then((product)=> product.toObject());
export const deleteProductById = (id:string) => Product.findByIdAndDelete(id);

interface UpdateProductReq{
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    image?: string;
    quantity?: number;
    sold?: number;
}

export const updateProductById = (id:string, update: UpdateProductReq) => Product.findByIdAndUpdate(id,update, {returnOriginal:false});

type Filter = {
    name: {
        $regex: string,
        $options: string
    },
    category?: string
}

type MatchStage = {
    $match: {
        [key: string]: any;
    };
};

type AddFieldsStage = {
    $addFields: {
        [key: string]: any;
    };
};

type ProjectStage = {
    $project: {
        [key: string]: 0 | 1;
    };
};

type SkipStage = {
    $skip: number;
};

type LimitStage = {
    $limit: number;
};

type AggregationPipeline = (MatchStage | AddFieldsStage | ProjectStage | SkipStage | LimitStage)[];

//Returns the products based on the filter and the page and limit.
//Also returns the total number of products for a given filter, so client can handle pagination.
export const getProductsPaginated = async (searchTerm: string, category: string, page: number, limit: number) => {
    let filter: Filter = {
        "name": {$regex: searchTerm, $options: "i"}
    };

    if (category) {
        filter.category = category;
    }

    const total = await Product.count(filter);

    let pipeline: AggregationPipeline = [
        {$match: filter},
        {
            $addFields: {
                reviewCount: {$size: "$reviews"},
                ratingAverage: {$avg: "$reviews.rating"}
            }
        },
        {
            $project: {
                sellerId: 0,
                description: 0,
                reviews: 0,
                quantity: 0,
                sold: 0,
                dateCreated: 0,
                dateModified: 0,
                __v: 0,
            }
        }
    ];

    if (limit && page) {
        pipeline.push({$skip: page * limit});
        pipeline.push({$limit: limit});
    }

    const products = await Product.aggregate(pipeline).exec();

    return {products, total};
}

interface ReviewI{
    userId: string;
    title: string;
    comment: string;
    rating: number;
}

export const addReviewToProduct = (id: string, review: ReviewI) => {
    const newReview = new Review(review);
    return Product.findByIdAndUpdate(id, {$push:{reviews: newReview}}, {returnOriginal:false}).select({dateCreated:0, dateModified:0, __v:0});
}

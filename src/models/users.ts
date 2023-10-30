import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type:String, required: true},
    authentication: {
        password: {type:String, required: true, select: false},
        salt:{type:String, select: false},
        sessionToken:{type:String, select: false}
    }
});


export const UserModel = mongoose.model("User", UserSchema);

export const getUserByUsername = (username:string) => UserModel.findOne({username});
export const getUserBySessionToken = (sessionToken:string) => UserModel.findOne({"authentication.sessionToken":sessionToken});
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then(({_id, username})=> ({_id, username}));

import express from "express";
import { getUserByUsername, createUser } from "../models/users";
import {random, authentication} from "../utils";

export const register = async(req: express.Request, res: express.Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({message:"Missing username or password"});
        }
        const existingUser = await getUserByUsername(username);

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = random();
        await createUser({
            username,
            authentication:{
                salt,
                password: authentication(salt, password)
            }
        });

        return res.status(200).json({message:"Registration Successful"});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Server error"});
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({message:"Missing username or password"});
        }

        const user = await getUserByUsername(username).select("+authentication.salt +authentication.password");

        if(!user){
            return res.status(400).json({message:"No such user exists"});
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash){
            return res.status(403).json({message:"Incorrect username or password"});
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("ACCESS_TOKEN", user.authentication.sessionToken, {domain:"localhost",path:"/"});

        return res.status(200).json({message:"Login Successful"});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Server error"});
    }
}

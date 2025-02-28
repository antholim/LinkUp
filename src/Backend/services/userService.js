import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export default class UserService {
    /**
     * Method to register a user and store in database
     * 
     * @param email 
     * @param password 
     * @returns {
     *   status: number,
     *   message: string,
     *   accessToken?: string
     * }
     */
    async registerUser(email, password, username) {
        const hashedPassword = await bcrypt.hash(password, 10);
        try {      
            let user = await User.findOne({ $or: [{ email: email }, { username: email }] });
            if (user) {
                return {
                    status: 409,
                    message: "User already exists"
                }
            }
            user = await User.create({
                email: email,
                password: hashedPassword,
                username: username,
            });
            return {
                status: 200,
                message: "User created"
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Internal server error"
            }
        }
    }
     /**
     * Method to login a user
     * 
     * @param email 
     * @param password 
     * @returns {
        *   status: number,
        *   message: string,
        *   accessToken?: string
        * }
    */
    async authenticateUser(email, password) {
        try {
            const user = await User.findOne({ $or: [{ email: email }, { username: email }] });
            if (!user) {
                return {
                    status: 404,
                    message: "User not found"
                }
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return {
                    status: 400,
                    message: "Invalid Password"
                }
            } else {
                console.log(user.username, "USERNAME")
                const accessToken = await this.createToken({
                    _id: user._id,
                    email: email,
                    username:user.username,
                    iat: Math.floor(Date.now() / 1000) - 30,
                    permissions: user.subscriptionType
                }, process.env.JWT_SECRET, '4h');
                return {
                    status: 200,
                    accessToken: accessToken,
                    message: "User authenticated"
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Internal server error"
            }
        }
    }
    async joinChannel(_id,channelID) {
        const user = await User.findByIdAndUpdate(
            _id,
            { $push: { channels: channelID } },
            { new: true } // Returns the updated document
          );
    }
    async createToken(payload, secret, expiresIn) {
        return jwt.sign(payload, secret, { expiresIn: expiresIn });
    }
    async verifyToken(token, secret) {
        return jwt.verify(token, secret, (err, decoded) => {
            console.log(decoded)
            return decoded;
        });
    }
}
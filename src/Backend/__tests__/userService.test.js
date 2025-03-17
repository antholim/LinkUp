import UserService from "../services/userService.js";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

// Mock dependencies
jest.mock('../models/user.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe("UserService", () => {
  let userService;
  let consoleSpy;
  const validUserId = "507f1f77bcf86cd799439011";
  const validChannelId = "507f1f77bcf86cd799439022";
  const validFriendId = "507f1f77bcf86cd799439033";

  beforeEach(() => {
    userService = new UserService();
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, "log").mockImplementation(),
      error: jest.spyOn(console, "error").mockImplementation()
    };
  });

  afterEach(() => {
    // Restore console mocks
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "password123";
      const username = "testuser";
      const hashedPassword = "hashedpassword123";
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: validUserId,
        email,
        username,
        password: hashedPassword
      });

      // Act
      const result = await userService.registerUser(email, password, username);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email }, { username: email }] });
      expect(User.create).toHaveBeenCalledWith({
        email,
        password: hashedPassword,
        username
      });
      expect(result).toEqual({
        status: 200,
        message: "User created"
      });
    });

    it("should return 409 if user already exists", async () => {
      // Arrange
      const email = "existing@example.com";
      const password = "password123";
      const username = "existinguser";
      
      User.findOne.mockResolvedValue({
        _id: validUserId,
        email,
        username
      });

      // Act
      const result = await userService.registerUser(email, password, username);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email }, { username: email }] });
      expect(User.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: 409,
        message: "User already exists"
      });
    });

    it("should handle internal server errors", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "password123";
      const username = "testuser";
      const error = new Error("Database error");
      
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.findOne.mockRejectedValue(error);

      // Act
      const result = await userService.registerUser(email, password, username);

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
      expect(result).toEqual({
        status: 500,
        message: "Internal server error"
      });
    });
  });

  describe("authenticateUser", () => {
    it("should authenticate a user with valid credentials", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "password123";
      const user = {
        _id: validUserId,
        email,
        username: "testuser",
        password: "hashedpassword",
        subscriptionType: "free"
      };
      const token = "jwt-token-123";
      
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      // Mock createToken method
      jest.spyOn(userService, 'createToken').mockResolvedValue(token);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email }, { username: email }] });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(userService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: user._id,
          email,
          username: user.username,
          permissions: user.subscriptionType
        }),
        process.env.JWT_SECRET,
        '4h'
      );
      expect(result).toEqual({
        status: 200,
        accessToken: token,
        message: "User authenticated"
      });
    });

    it("should return 404 if user is not found", async () => {
      // Arrange
      const email = "nonexistent@example.com";
      const password = "password123";
      
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email }, { username: email }] });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: 404,
        message: "User not found"
      });
    });

    it("should return 400 if password is invalid", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "wrongpassword";
      const user = {
        _id: validUserId,
        email,
        username: "testuser",
        password: "hashedpassword"
      };
      
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email }, { username: email }] });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toEqual({
        status: 400,
        message: "Invalid Password"
      });
    });

  });

  describe("joinChannel", () => {
    it("should add a channel to user's channels array", async () => {
      // Arrange
      const userId = validUserId;
      const channelId = validChannelId;
      const updatedUser = {
        _id: userId,
        username: "testuser",
        channels: [channelId]
      };
      
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      await userService.joinChannel(userId, channelId);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $push: { channels: channelId } },
        { new: true }
      );
    });
  });

  describe("createToken", () => {
    it("should create a JWT token with the provided payload", async () => {
      // Arrange
      const payload = { userId: validUserId };
      const secret = "test-secret";
      const expiresIn = "1h";
      const token = "jwt-token-123";
      
      jwt.sign.mockReturnValue(token);

      // Act
      const result = await userService.createToken(payload, secret, expiresIn);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, { expiresIn });
      expect(result).toBe(token);
    });
  });

  describe("verifyToken", () => {
    it("should verify a JWT token and return decoded payload", async () => {
      // Arrange
      const token = "jwt-token-123";
      const secret = "test-secret";
      const decodedPayload = { userId: validUserId };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decodedPayload);
        return decodedPayload;
      });

      // Act
      const result = await userService.verifyToken(token, secret);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, secret, expect.any(Function));
      expect(consoleSpy.log).toHaveBeenCalledWith(decodedPayload);
      expect(result).toEqual(decodedPayload);
    });
  });

  describe("addFriend", () => {
    it("should add a friend to user's friends array", async () => {
      // Arrange
      const userId = validUserId;
      const friendId = validFriendId;
      const updatedUser = {
        _id: userId,
        username: "testuser",
        friends: [friendId]
      };
      
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.addFriend(userId, friendId);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $push: { friends: friendId } },
        { new: true }
      );
      expect(result).toEqual({
        status: 200,
        message: "Friend added"
      });
    });
  });

  describe("getAllFriends", () => {
    it("should return all friends with their usernames and ids", async () => {
      // Arrange
      const userId = validUserId;
      const friendIds = [
        "507f1f77bcf86cd799439044",
        "507f1f77bcf86cd799439055"
      ];
      const user = {
        _id: userId,
        username: "testuser",
        friends: friendIds
      };
      const friendsData = [
        {
          _id: friendIds[0],
          username: "friend1"
        },
        {
          _id: friendIds[1],
          username: "friend2"
        }
      ];
      
      User.findOne.mockImplementation((query) => {
        if (query._id === userId) {
          return Promise.resolve(user);
        } else if (query._id === friendIds[0]) {
          return Promise.resolve(friendsData[0]);
        } else if (query._id === friendIds[1]) {
          return Promise.resolve(friendsData[1]);
        }
        return Promise.resolve(null);
      });

      // Act
      const result = await userService.getAllFriends(userId);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ _id: userId });
      expect(result).toEqual([
        { username: "friend1", _id: friendIds[0] },
        { username: "friend2", _id: friendIds[1] }
      ]);
    });
  });
});
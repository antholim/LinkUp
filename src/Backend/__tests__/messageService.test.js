import MessageService from "../services/messageService.js";
import { Message } from "../models/message.js";
import mongoose from "mongoose";

// Mock the Message model
jest.mock("../models/message.js");

describe("MessageService", () => {
  let messageService;
  let consoleSpy;
  // Valid MongoDB ObjectId format (24 hex characters)
  const validChannelId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    messageService = new MessageService();
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, "log").mockImplementation(),
      error: jest.spyOn(console, "error").mockImplementation()
    };
    
    // Mock mongoose.Types.ObjectId
    jest.spyOn(mongoose.Types, 'ObjectId').mockImplementation((id) => {
      return { toString: () => id };
    });
  });

  afterEach(() => {
    // Restore console mocks
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
    jest.restoreAllMocks();
  });

  describe("sendMessage", () => {
    it("should create a new message with the provided parameters", async () => {
      // Arrange
      const channelId = validChannelId;
      const senderId = "507f191e810c19729de860ea";
      const content = "Hello, world!";
      const mockMessage = {
        _id: "507f1f77bcf86cd799439012",
        channelId,
        senderId,
        content,
        createdAt: new Date()
      };
      
      Message.create.mockResolvedValue(mockMessage);

      // Act
      await messageService.sendMessage(channelId, senderId, content);

      // Assert
      expect(Message.create).toHaveBeenCalledTimes(1);
      expect(Message.create).toHaveBeenCalledWith({
        channelId,
        senderId,
        content
      });
    });

    it("should handle errors from database operations", async () => {
      // Arrange
      const channelId = validChannelId;
      const senderId = "507f191e810c19729de860ea";
      const content = "Hello, world!";
      const error = new Error("Database error");
      Message.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        messageService.sendMessage(channelId, senderId, content)
      ).rejects.toThrow(error);
    });
  });

  describe("getMessagesByChannelId", () => {
    it("should retrieve messages for a given channel ID with default options", async () => {
      // Arrange
      const channelId = validChannelId;
      const mockMessages = [
        {
          _id: "message1",
          channelId,
          senderId: "user1",
          content: "First message",
          createdAt: new Date("2023-01-01")
        },
        {
          _id: "message2",
          channelId,
          senderId: "user2",
          content: "Second message",
          createdAt: new Date("2023-01-02")
        }
      ];
      
      // Mock the query builder pattern
      const mockExec = jest.fn().mockResolvedValue(mockMessages);
      const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
      const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit, sort: mockSort });
      const mockFind = jest.fn().mockReturnValue({ 
        skip: mockSkip, 
        limit: mockLimit, 
        sort: mockSort 
      });
      
      Message.find = mockFind;

      // Act
      const result = await messageService.getMessagesByChannelId(channelId);

      // Assert
      expect(mockFind).toHaveBeenCalledWith({ 
        channelId: expect.anything() 
      });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMessages);
    });

  });
});
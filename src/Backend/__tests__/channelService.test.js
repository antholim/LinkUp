import ChannelService from "../services/channelService.js";
import { Channel } from "../models/channel.js";
import mongoose from "mongoose";

// Mock the Channel model
jest.mock("../models/channel.js");

describe("ChannelService", () => {
  let channelService;
  let consoleSpy;

  beforeEach(() => {
    channelService = new ChannelService();
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

  describe("createChannel", () => {
    it("should create a new channel with the provided parameters", async () => {
      // Arrange
      const channelName = "test-channel";
      const creatorID = "user123";
      const type = "public";
      const mockChannel = {
        _id: "channel123",
        channelName,
        type,
        members: [creatorID],
        messages: []
      };
      
      Channel.create.mockResolvedValue(mockChannel);

      // Act
      await channelService.createChannel(channelName, creatorID, type);

      // Assert
      expect(Channel.create).toHaveBeenCalledTimes(1);
      expect(Channel.create).toHaveBeenCalledWith({
        channelName,
        type,
        members: [creatorID],
        messages: []
      });
    });

    it("should handle errors from database operations", async () => {
      // Arrange
      const channelName = "test-channel";
      const creatorID = "user123";
      const error = new Error("Database error");
      Channel.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        channelService.createChannel(channelName, creatorID)
      ).rejects.toThrow(error);
    });
  });

  describe("getAllChannel", () => {
    it("should return all non-deleted channels with selected fields", async () => {
      // Arrange
      const mockChannels = [
        {
          _id: "channel1",
          channelName: "General",
          type: "public",
          members: ["user1", "user2"],
          messages: ["msg1", "msg2"],
          isDeleted: false
        },
        {
          _id: "channel2",
          channelName: "Random",
          type: "private",
          members: ["user3"],
          messages: ["msg3"],
          isDeleted: false
        }
      ];
      
      Channel.find.mockResolvedValue(mockChannels);

      // Act
      const result = await channelService.getAllChannel();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        _id: "channel1",
        channelName: "General",
        type: "public",
        members: ["user1", "user2"]
      });
      expect(result[1]).toEqual({
        _id: "channel2",
        channelName: "Random",
        type: "private",
        members: ["user3"]
      });
      // Ensure messages are not included
      expect(result[0].messages).toBeUndefined();
      expect(result[1].messages).toBeUndefined();
    });

    it("should filter out deleted channels", async () => {
      // Arrange
      Channel.find.mockImplementation((query) => {
        expect(query).toEqual({ isDeleted: { $ne: true } });
        return Promise.resolve([]);
      });

      // Act
      await channelService.getAllChannel();

      // Assert
      expect(Channel.find).toHaveBeenCalledWith({ isDeleted: { $ne: true } });
    });
  });

  describe("deleteChannel", () => {
    it("should soft delete a channel by setting isDeleted to true", async () => {
      // Arrange
      const channelID = "channel123";
      const updateResult = { acknowledged: true, modifiedCount: 1 };
      Channel.updateOne.mockResolvedValue(updateResult);

      // Act
      await channelService.deleteChannel(channelID);

      // Assert
      expect(Channel.updateOne).toHaveBeenCalledTimes(1);
      expect(Channel.updateOne).toHaveBeenCalledWith(
        { _id: channelID },
        { $set: { isDeleted: true } }
      );
      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
      expect(consoleSpy.log).toHaveBeenNthCalledWith(1, channelID);
      expect(consoleSpy.log).toHaveBeenNthCalledWith(2, updateResult);
    });

    it("should handle invalid channelID format", async () => {
      // Arrange
      const channelID = "invalid-id";
      const error = new mongoose.Error.CastError("ObjectId", channelID, "_id");
      Channel.updateOne.mockRejectedValue(error);

      // Act
      await channelService.deleteChannel(channelID);

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });
});
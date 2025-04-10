import ChannelService from "../services/channelService.js";
import { Channel } from "../models/channel.js";
import mongoose from "mongoose";

jest.mock("../models/channel.js");

describe("ChannelService", () => {
  let channelService;
  let consoleSpy;

  beforeEach(() => {
    channelService = new ChannelService();
    jest.clearAllMocks();
    consoleSpy = {
      log: jest.spyOn(console, "log").mockImplementation(),
      error: jest.spyOn(console, "error").mockImplementation()
    };
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe("createChannel", () => {
    it("should create a new channel with the provided parameters", async () => {
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

      await channelService.createChannel(channelName, creatorID, type);

      expect(Channel.create).toHaveBeenCalledTimes(1);
      expect(Channel.create).toHaveBeenCalledWith({
        channelName,
        type,
        members: [creatorID],
        messages: []
      });
    });

    it("should handle errors from database operations", async () => {
      const channelName = "test-channel";
      const creatorID = "user123";
      const error = new Error("Database error");
      Channel.create.mockRejectedValue(error);

      await expect(
        channelService.createChannel(channelName, creatorID)
      ).rejects.toThrow(error);
    });
  });

  describe("getAllChannel", () => {
    it("should return all non-deleted channels with selected fields", async () => {
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

      const result = await channelService.getAllChannel();

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
      expect(result[0].messages).toBeUndefined();
      expect(result[1].messages).toBeUndefined();
    });

    it("should filter out deleted channels", async () => {
      Channel.find.mockImplementation((query) => {
        expect(query).toEqual({ isDeleted: { $ne: true } });
        return Promise.resolve([]);
      });

      await channelService.getAllChannel();

      expect(Channel.find).toHaveBeenCalledWith({ isDeleted: { $ne: true } });
    });
  });

  describe("deleteChannel", () => {
    it("should soft delete a channel by setting isDeleted to true", async () => {
      const channelID = "channel123";
      const updateResult = { acknowledged: true, modifiedCount: 1 };
      Channel.updateOne.mockResolvedValue(updateResult);

      await channelService.deleteChannel(channelID);

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
      const channelID = "invalid-id";
      const error = new mongoose.Error.CastError("ObjectId", channelID, "_id");
      Channel.updateOne.mockRejectedValue(error);

      await channelService.deleteChannel(channelID);

      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });
});
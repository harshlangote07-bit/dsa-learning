import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

import * as topicService from "../services/topic.service";
import { createTopicSchema } from "../validators/topic.validator";

type TopicParams = {
  id: string;
};

export const createTopic = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createTopicSchema.parse(req.body);

    const topic = await topicService.createTopic(data);

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topic,
    });
  }
);

export const getAllTopics = asyncHandler(
  async (_req: Request, res: Response) => {
    const topics = await topicService.getAllTopics();

    res.status(200).json({
      success: true,
      message: "Topics fetched successfully",
      data: topics,
    });
  }
);

export const getTopicById = asyncHandler(
  async (req: Request<TopicParams>, res: Response) => {
    const topic = await topicService.getTopicById(req.params.id);

    res.status(200).json({
      success: true,
      data: topic,
    });
  }
);

export const updateTopic = asyncHandler(
  async (req: Request<TopicParams>, res: Response) => {
    const data = createTopicSchema.parse(req.body);

    const topic = await topicService.updateTopic(req.params.id, data);

    res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      data: topic,
    });
  }
);

export const deleteTopic = asyncHandler(
  async (req: Request<TopicParams>, res: Response) => {
    const result = await topicService.deleteTopic(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);
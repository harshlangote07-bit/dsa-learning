import { Request, Response } from "express";
import { getAllTopics } from "../services/topic.service";

export async function getTopics(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const topics = await getAllTopics();

    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch topics",
    });
  }
}
import { Request, Response } from "express";
import { getUserMastery } from "../services/mastery.service";

export async function getMastery(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const mastery = await getUserMastery(id);

    res.status(200).json({
      success: true,
      data: mastery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
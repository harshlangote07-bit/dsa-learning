import { Request, Response } from "express";
import { getAllProblems, getProblemById, } from "../services/problem.service";


export async function getProblems(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const problems = await getAllProblems();

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
}

export async function getProblem(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const problem = await getProblemById(id);

    if (!problem) {
      res.status(404).json({
        success: false,
        message: "Problem not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
}
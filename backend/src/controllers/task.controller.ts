import { Response } from "express";
import * as taskService from "../services/task.service";

export const create = async (req: any, res: Response) => {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAll = async (req: any, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.user.userId, req.query);
    res.json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req: any, res: Response) => {
  try {
    const task = await taskService.updateTask(
      req.user.userId,
      Number(req.params.id),
      req.body,
    );
    res.json(task);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const remove = async (req: any, res: Response) => {
  try {
    await taskService.deleteTask(req.user.userId, Number(req.params.id));
    res.json({ message: "Deleted" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const toggle = async (req: any, res: Response) => {
  try {
    const task = await taskService.toggleTask(
      req.user.userId,
      Number(req.params.id),
    );
    res.json(task);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

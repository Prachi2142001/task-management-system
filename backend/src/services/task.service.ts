import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (userId: number, body: any) => {
  if (!body.title) throw new Error("Title is required");

  return prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      userId,
    },
  });
};

export const getTasks = async (userId: number, query: any) => {
  const { search = "", status, page = "1", limit = "5" } = query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const where: any = {
    userId,
    title: {
      contains: search,
    },
  };
  if (status === "true") {
    where.completed = true;
  } else if (status === "false") {
    where.completed = false;
  }

  const total = await prisma.task.count({ where });

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  return {
    tasks,
    total,
    page: pageNumber,
    totalPages: Math.ceil(total / limitNumber),
  };
};

export const updateTask = async (userId: number, id: number, body: any) => {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found");

  return prisma.task.update({
    where: { id },
    data: body,
  });
};

export const deleteTask = async (userId: number, id: number) => {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found");

  return prisma.task.delete({ where: { id } });
};

export const toggleTask = async (userId: number, id: number) => {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error("Task not found");

  return prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });
};

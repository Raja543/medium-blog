import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogContext } from "../context";
import {
  blogAuth,
  blogCreateValidation,
  blogUpdateValidation,
} from "../middlewares/blog";

const blogRouter = new Hono<blogContext>();

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return c.json({ error: "Blog doesn't exist." });
  }
  return c.json(post);
});

blogRouter.post("/", blogAuth, blogCreateValidation, async (c) => {
  const userId = c.get("jwtPayload").id;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = c.get("body");

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", blogAuth, blogUpdateValidation, async (c) => {
  const userId = c.get("jwtPayload").id;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = c.get("body");

  const post = await prisma.post.update({
    where: {
      id: body.id,
      authorId: userId,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("blog updated");
});

blogRouter.delete("/:id", blogAuth, async (c) => {
  const userId = c.get("jwtPayload").id;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  const post = await prisma.post.delete({
    where: {
      id,
      authorId: userId,
    },
  });
  return c.text("blog deleted");
});

export default blogRouter;
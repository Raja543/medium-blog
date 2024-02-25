import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify, decode } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/api/v1/blog/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  const token = jwt.split(" ")[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  c.set("jwtPayload", { userId: payload.id });
  await next();
});

app.post("/api/v1/blog", (c) => {
  console.log(c.get("jwtPayload"));
  return c.text("signin route");
});

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const jwt = await sign({ userId: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {
  return c.text("get blog route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("signin route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("signin route");
});

export default app;

// postgresql://rajakumarmahto952:tAWUG7XsLV1u@ep-ancient-cherry-a1bcyoi4.ap-southeast-1.aws.neon.tech/prisma?sslmode=require

// db connection pool
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMTdkM2QzODUtMmI2Ny00NWFkLWFlZGItYTRkNGJmODc2MzNhIiwidGVuYW50X2lkIjoiZDUxY2VjMDE1ZTRkMGU1YTM2ZThiZWI1ZDQ4ODM1NGM4NDgwODU4ZWE1ZmY0NTVlODZiMTg1ZmQ4YjdmM2M3YSIsImludGVybmFsX3NlY3JldCI6IjNhNzhhNWVmLTAzMjEtNDQwOS04ZDYyLTM0ZjYxYjcxZTEzYiJ9.wx_xIOtxPfUxooHPpVQwcQ7BWiF3SmbOhCSHqKTPlAw"

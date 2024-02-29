import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

// postgresql://rajakumarmahto952:tAWUG7XsLV1u@ep-ancient-cherry-a1bcyoi4.ap-southeast-1.aws.neon.tech/prisma?sslmode=require

// db connection pool
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMTdkM2QzODUtMmI2Ny00NWFkLWFlZGItYTRkNGJmODc2MzNhIiwidGVuYW50X2lkIjoiZDUxY2VjMDE1ZTRkMGU1YTM2ZThiZWI1ZDQ4ODM1NGM4NDgwODU4ZWE1ZmY0NTVlODZiMTg1ZmQ4YjdmM2M3YSIsImludGVybmFsX3NlY3JldCI6IjNhNzhhNWVmLTAzMjEtNDQwOS04ZDYyLTM0ZjYxYjcxZTEzYiJ9.wx_xIOtxPfUxooHPpVQwcQ7BWiF3SmbOhCSHqKTPlAw"

// React (FE)
// Cloudflare workers (FE)
// zod as the validation library, type inference for the frontend types
// Typescript as a language
// Prisma as the ORM, with connection pooling
// Postgres as the database
// jwt for authentication (cookies)
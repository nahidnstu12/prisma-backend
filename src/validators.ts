
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const BookSchema = z.object({
    title: z.string().min(1),
    pages: z.number().min(1),
    summary: z.string()
  });

  export type Book = Prisma.BookGetPayload<{}>
  export type UpdateBook = Prisma.BookUpdateInput
  export type NewBook = Prisma.BookCreateInput
  export type CreateBookInput = z.infer<typeof BookSchema>;
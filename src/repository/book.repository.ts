import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class BookRepository extends BaseRepository<'book'> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'book');
      }
}
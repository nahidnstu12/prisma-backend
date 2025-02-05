import { Book, BookGenre, Prisma, PrismaUser, Publisher } from "@prisma/client";
import { PrismaModels } from "./base.types";

export type PrismaModelTypes = {
  'book': Book;
  'publisher': Publisher;
  'prismaUser': PrismaUser;
  'bookGenre': BookGenre;
};

export type ModelOperations<T extends PrismaModels> = {
  'book': {
    where: Prisma.BookWhereInput;
    select: Prisma.BookSelect;
    include: Prisma.BookInclude;
    create: Prisma.BookCreateInput;
    update: Prisma.BookUpdateInput;
    orderBy: Prisma.BookOrderByWithRelationInput;
    payload: Book;
    // findMany: Prisma.BookFindManyArgs;
  };
  'publisher': {
    where: Prisma.PublisherWhereInput;
    select: Prisma.PublisherSelect;
    include: Prisma.PublisherInclude;
    create: Prisma.PublisherCreateInput;
    update: Prisma.PublisherUpdateInput;
    orderBy: Prisma.PublisherOrderByWithRelationInput;
    payload: Publisher;
  };
  'prismaUser': {
    where: Prisma.PrismaUserWhereInput;
    select: Prisma.PrismaUserSelect;
    include: Prisma.PrismaUserInclude;
    create: Prisma.PrismaUserCreateInput;
    update: Prisma.PrismaUserUpdateInput;
    orderBy: Prisma.PrismaUserOrderByWithRelationInput;
    payload: PrismaUser;
  };
  'bookGenre': {
    where: Prisma.BookGenreWhereInput;
    select: Prisma.BookGenreSelect;
    include: Prisma.BookGenreInclude;
    create: Prisma.BookGenreCreateInput;
    update: Prisma.BookGenreUpdateInput;
    orderBy: Prisma.BookGenreOrderByWithRelationInput;
    payload: BookGenre;
  };
}[T];
import prisma from '@/lib/prisma';
import { NewBook, UpdateBook } from '@/validators';
import { Prisma, Book, BookStatus } from '@prisma/client';



export type BookFilters = {
  title?: string;
  authorId?: string;
  publisherId?: string;
  genreId?: string;
  status?: BookStatus;
  sortBy?: keyof Book;
  sortOrder?: 'asc' | 'desc';
};

export const createBook = async (bookData: NewBook) => {
  return prisma.book.create({
    data: bookData,
  });
};

export const findBookById = async (id: string) => {
  return prisma.book.findUnique({
    where: { id },
  });
};

export const updateBook = async (id: string, updates: UpdateBook) => {
  return prisma.book.update({
    where: { id },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  });
};

export const deleteBook = async (id: string) => {
  return prisma.book.delete({
    where: { id },
  });
};

export const getBooks = async (
    filters: BookFilters = {},
    page: number = 1,
    limit: number = 10
  ) => {
    const offset = (page - 1) * limit;
  
    // Build where conditions - Fixed version
    const where: Prisma.BookWhereInput = {};
    
    if (filters.title) {
      where.title = { contains: filters.title, mode: 'insensitive' as Prisma.QueryMode };
    }
    
    if (filters.authorId) {
      where.authorId = filters.authorId;
    }
    
    if (filters.publisherId) {
      where.publisherId = filters.publisherId;
    }
    
    if (filters.genreId) {
      where.genreId = filters.genreId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
  
    // Build order by
    const orderBy: Prisma.BookOrderByWithRelationInput = filters.sortBy
      ? { [filters.sortBy]: filters.sortOrder ?? 'asc' }
      : { createdAt: 'desc' };
  
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.book.count({ where }),
    ]);
  
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  };

export const searchBooksByTitle = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  return getBooks({ title: query }, page, limit);
};

export const getBooksByAuthor = async (
  authorId: string,
  page: number = 1,
  limit: number = 10
) => {
  return getBooks({ authorId }, page, limit);
};

export const getBooksByPublisher = async (
  publisherId: string,
  page: number = 1,
  limit: number = 10
) => {
  return getBooks({ publisherId }, page, limit);
};

export const getBooksByGenre = async (
  genreId: string,
  page: number = 1,
  limit: number = 10
) => {
  return getBooks({ genreId }, page, limit);
};

export const updateBookStatus = async (id: string, status: BookStatus) => {
  return prisma.book.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date(),
    },
  });
};

export const getPublishedBooks = async (
  page: number = 1,
  limit: number = 10
) => {
  return getBooks({ status: 'published' }, page, limit);
};
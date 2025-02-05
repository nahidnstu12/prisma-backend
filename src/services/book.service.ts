import { BookRepository } from "@/repository/book.repository";
import { BaseService } from "./base.service";

export class BookService extends BaseService<'book'> {
  constructor(repository: BookRepository) {
    super(repository);
  }
}
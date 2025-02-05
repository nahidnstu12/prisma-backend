import { BookController } from '@/controllers/book.controller';
import prisma from '@/lib/prisma';
import { BookRepository } from '@/repository/book.repository';
import { BookService } from '@/services/book.service';
import { Router } from 'express';


const router = Router();

// Create new book
// router.post('/', (req, res, next) => {
// 	createBook(req, res, next);
// });

// // Get book by ID
// router.get('/:id', (req, res, next) => {
// 	getBook(req, res, next);
// });

// // Update book
// router.patch('/:id', (req, res, next) => {
// 	updateBook(req, res, next);
// });

// // Delete book
// router.delete('/:id', (req, res, next) => {
// 	deleteBook(req, res, next);
// });

// // Get books with filters
// router.get('/', (req, res, next) => {
// 	getBooks(req, res, next);
// });

// // Search books by title
// router.get('/search', (req, res, next) => {
// 	searchBooks(req, res, next);
// });

// // Update book status
// router.patch('/:id/status', (req, res, next) => {
// 	updateBookStatus(req, res, next);
// });

export class BookRoutes {
	public router: Router;
	private bookController: BookController;
  
	constructor() {
	  this.router = Router();
	  
	  // Initialize dependencies
	  const bookRepository = new BookRepository(prisma);
	  const bookService = new BookService(bookRepository);
	  this.bookController = new BookController(bookService);
  
	  this.initializeRoutes();
	}
  
	private initializeRoutes() {
	  this.router.post('/', (req, res) => this.bookController.create(req, res));
	  this.router.get('/', (req, res) => this.bookController.findAll(req, res));
	  this.router.get('/:id', (req, res) => this.bookController.findById(req, res));
	  this.router.put('/:id', (req, res) => this.bookController.update(req, res));
	  this.router.delete('/:id', (req, res) => this.bookController.delete(req, res));
	}
  }

export default router;

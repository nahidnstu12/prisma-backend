import { BookService } from "@/services/book.service";
import { ApiQueryOptions, FindAllApiOptions, OrderDirection } from "@/types/base.types";
import { Request, Response } from "express";

export class BookController {
	constructor(private readonly service: BookService) {}

	async findAll(req: Request, res: Response) {
		try {
		  const { page, limit, orderBy, orderDirection } = req.query;
	
		  const options: FindAllApiOptions = {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			orderBy: orderBy ? String(orderBy) : undefined,
			orderDirection: orderDirection as OrderDirection | undefined,
		  };
	
		  const books = await this.service.findAll(options); //TODO: need to fix type
		  console.log("books>", books);
		  
		  res.json(books);
		} catch (error) {
		  res.status(500).json({ message: 'Internal server error' });
		}
	  }

	async findById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const book = await this.service.findById(id);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	// async search(req: Request, res: Response) {
	// 	try {
	// 		const { query } = req.query;
	// 		const books = await this.service.search({ query: String(query) });
	// 		res.json(books);
	// 	} catch (error) {
	// 		res.status(500).json({ message: 'Internal server error' });
	// 	}
	// }

	async create(req: Request, res: Response) {
		try {
			const book = await this.service.create(req.body);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const book = await this.service.update(id, req.body);
			res.json(book);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.service.delete(id);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}
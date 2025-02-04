import express from 'express';
// import authRouter from '@/routers/auth.routes';
// import genreRouter from '@/routers/genre.routes';
// import publisherRouter from '@/routers/publishers';
// import userRouter from '@/routers/user.routes';
import bookRouter from '@/routers/book.route';


const app = express();

// Middleware
app.use(express.json());

// Register routes
// app.use('/api/auth', authRouter);
// app.use('/api/genres', genreRouter);
// app.use('/api/publishers', publisherRouter);
// app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);



// Error handling middleware
app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error(err.stack);
		res.status(500).json({ message: 'Something went wrong!' });
	}
);

export default app;

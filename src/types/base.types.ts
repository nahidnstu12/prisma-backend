export type ID = string | number;
export type OrderDirection = 'asc' | 'desc';

// Define valid model names based on your schema
export type PrismaModels = 'book' | 'publisher' | 'prismaUser' | 'bookGenre';

export type PaginationOptions = {
    page?: number;
    limit?: number;
  };
  
  export type OrderOptions = {
    orderBy?: string;
    orderDirection?: OrderDirection;
  };
  
  export type ApiQueryOptions = PaginationOptions & OrderOptions & {
    include?: string;
  };

  export type FindAllApiOptions = {
    page?: number | string;
    limit?: number | string;
    orderBy?: string;
    orderDirection?: OrderDirection;
  };
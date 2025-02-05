import { FindAllOptions, FindOptionsSQL } from "@/interfaces/IBaseRepository";
import { BaseRepository } from "@/repository/base.repository";
import { FindAllApiOptions, ID, PrismaModels } from "@/types/base.types";
import { ModelOperations, PrismaModelTypes } from "@/types/modelType";


export abstract class BaseService<T extends PrismaModels> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findAll(apiOptions?: FindAllApiOptions): Promise<PrismaModelTypes[T][]> {
    try {
      const prismaOptions = this.convertToPrismaOptions(apiOptions);
      console.log("prismaOptions", prismaOptions);
      
      return await this.repository.findAll(prismaOptions);
    } catch (error) {
      this.handleError(error);
    }
  }

  private convertToPrismaOptions(apiOptions?: FindAllApiOptions): FindOptionsSQL<T> {
    if (!apiOptions) return {};

    const { page, limit, orderBy, orderDirection } = apiOptions;

    const pageNum = page ? Number(page) : undefined;
    const limitNum = limit ? Number(limit) : undefined;

    return {
      skip: pageNum && limitNum ? (pageNum - 1) * limitNum : undefined,
      take: limitNum,
      orderBy: orderBy ? { [orderBy]: orderDirection || 'asc' } : undefined,
    };
  }

  async findById(
    id: ID,
    options?: {
      include?: ModelOperations<T>['include'];
      select?: ModelOperations<T>['select'];
    }
  ): Promise<PrismaModelTypes[T]> {
    try {
      const item = await this.repository.findById(id, options);
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(
    data: ModelOperations<T>['create']
  ): Promise<PrismaModelTypes[T]> {
    try {
      const item = await this.repository.create(data);
      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: ID,
    data: ModelOperations<T>['update']
  ): Promise<PrismaModelTypes[T]> {
    try {
      const item = await this.repository.update(id, data);
      if (!item) {
        throw new Error('Item not found');
      }

      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkExists(id: ID): Promise<boolean> {
    try {
      const item = await this.repository.findById(id);
      return !!item;
    } catch (error) {
      return false;
    }
  }

  protected handleError(error: unknown): never {
    console.log('Error in operation', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      typeof error === 'string' ? error : 'An unexpected error occurred'
    );
  }

  protected async catchError<TResult>(
    callback: () => Promise<TResult>
  ): Promise<TResult> {
    try {
      return await callback();
    } catch (error) {
      this.handleError(error);
    }
  }
}
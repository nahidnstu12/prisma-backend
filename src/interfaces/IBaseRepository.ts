import { ID, OrderDirection, PrismaModels } from "@/types/base.types";
import { ModelOperations } from "@/types/modelType";

export type FindOptionsSQL<T extends PrismaModels> = {
  where?: ModelOperations<T>['where'];
  select?: ModelOperations<T>['select'];
  include?: ModelOperations<T>['include'];
  orderBy?: ModelOperations<T>['orderBy'] | ModelOperations<T>['orderBy'][];
  skip?: number;
  take?: number;
  cursor?: { id: string };
  distinct?: string[];
};

export type FindAllOptions = {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  include?: any;
  select?: any;
};

export interface IBaseRepository<T extends PrismaModels> {
  findAll(options?: FindOptionsSQL<T>): Promise<ModelOperations<T>['payload'][]>;
  
  findById(
    id: ID, 
    options?: Omit<FindOptionsSQL<T>, 'where' | 'skip' | 'take'>
  ): Promise<ModelOperations<T>['payload'] | null>;
  
  findOne(
    where: ModelOperations<T>['where'],
    options?: Omit<FindOptionsSQL<T>, 'where' | 'skip' | 'take'>
  ): Promise<ModelOperations<T>['payload'] | null>;
  
  findAndCount(
    options?: FindOptionsSQL<T>
  ): Promise<[ModelOperations<T>['payload'][], number]>;

  count(where?: ModelOperations<T>['where']): Promise<number>;
  
  checkExists(where: ModelOperations<T>['where']): Promise<boolean>;

  create(
    data: ModelOperations<T>['create']
  ): Promise<ModelOperations<T>['payload']>;
  
  createMany(
    data: ModelOperations<T>['create'][]
  ): Promise<ModelOperations<T>['payload'][]>;

  update(
    id: ID,
    data: ModelOperations<T>['update']
  ): Promise<ModelOperations<T>['payload'] | null>;
  
  updateMany(
    data: (ModelOperations<T>['update'] & { id: ID })[]
  ): Promise<ModelOperations<T>['payload'][]>;

  delete(id: ID): Promise<void>;
  deleteMany(ids: ID[]): Promise<void>;
}
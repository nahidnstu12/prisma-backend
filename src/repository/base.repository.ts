import { FindOptionsSQL, IBaseRepository } from "@/interfaces/IBaseRepository";
import { ID, PrismaModels } from "@/types/base.types";
import { ModelOperations, PrismaModelTypes } from "@/types/modelType";
import { PrismaClient } from "@prisma/client";


export abstract class BaseRepository<T extends PrismaModels> implements IBaseRepository<T> {
  /**protected*/ constructor(
    protected readonly prisma: PrismaClient,
    protected readonly model: T
  ) {}

  protected get repository() {
    return this.prisma[this.model] as unknown as {
      findMany: (options?: FindOptionsSQL<T>) => Promise<PrismaModelTypes[T][]>;
      findUnique: (options: { where: { id: ID }; include?: ModelOperations<T>['include']; select?: ModelOperations<T>['select'] }) => Promise<PrismaModelTypes[T] | null>;
      findFirst: (options: { where: ModelOperations<T>['where']; include?: ModelOperations<T>['include']; select?: ModelOperations<T>['select'] }) => Promise<PrismaModelTypes[T] | null>;
      count: (options?: { where?: ModelOperations<T>['where'] }) => Promise<number>;
      create: (options: { data: ModelOperations<T>['create'] }) => Promise<PrismaModelTypes[T]>;
      update: (options: { where: { id: ID }; data: ModelOperations<T>['update'] }) => Promise<PrismaModelTypes[T]>;
      delete: (options: { where: { id: ID } }) => Promise<PrismaModelTypes[T]>;
      deleteMany: (options: { where: { id: { in: ID[] } } }) => Promise<{ count: number }>;
    };
  }

  async findAll(options?: FindOptionsSQL<T>): Promise<PrismaModelTypes[T][]> {
    return this.repository.findMany(options);
  }

  async findById(
    id: ID,
    options?: Omit<FindOptionsSQL<T>, 'where' | 'skip' | 'take'>
  ): Promise<PrismaModelTypes[T] | null> {
    return this.repository.findUnique({
      ...options,
      where: { id },
    });
  }

  async findOne(
    where: ModelOperations<T>['where'],
    options?: Omit<FindOptionsSQL<T>, 'where' | 'skip' | 'take'>
  ): Promise<PrismaModelTypes[T] | null> {
    return this.repository.findFirst({
      ...options,
      where,
    });
  }

  async findAndCount(
    options?: FindOptionsSQL<T>
  ): Promise<[PrismaModelTypes[T][], number]> {
    const [data, count] = await Promise.all([
      this.repository.findMany(options),
      this.repository.count({ where: options?.where }),
    ]);
    return [data, count];
  }

  async count(where?: ModelOperations<T>['where']): Promise<number> {
    return this.repository.count({ where });
  }

  async checkExists(where: ModelOperations<T>['where']): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }

  async create(data: ModelOperations<T>['create']): Promise<PrismaModelTypes[T]> {
    return this.repository.create({ data });
  }

  async createMany(data: ModelOperations<T>['create'][]): Promise<PrismaModelTypes[T][]> {
    return Promise.all(
      data.map((item) => this.repository.create({ data: item }))
    );
  }

  async update(
    id: ID,
    data: ModelOperations<T>['update']
  ): Promise<PrismaModelTypes[T] | null> {
    return this.repository.update({
      where: { id },
      data,
    });
  }

  async updateMany(
    data: (ModelOperations<T>['update'] & { id: ID })[]
  ): Promise<PrismaModelTypes[T][]> {
    return Promise.all(
      data.map((item) => {
        const { id, ...updateData } = item;
        return this.repository.update({
          where: { id },
          data: updateData,
        });
      })
    );
  }

  async delete(id: ID): Promise<void> {
    await this.repository.delete({ where: { id } });
  }

  async deleteMany(ids: ID[]): Promise<void> {
    await this.repository.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
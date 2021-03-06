import { EntityRepository, getManager, SelectQueryBuilder } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { TypeOrmQueryRepository } from '../../../../../../common/database/type-orm/type-orm.query.repository';
import { ProjectCategory } from '../../domain/project-category';
import { ProjectCategoryNotFoundException } from '../../domain/project-category-not-found.exception';

@EntityRepository()
export class TypeOrmProjectCategoryQueryRepository extends TypeOrmQueryRepository implements TypeOrmProjectCategoryQueryRepository {

    constructor() {
        super(getManager('query'));
    }

    /**
     * @returns {Promise<ProjectCategory>}
     */
    public getAll(): Promise<ProjectCategory[]> {
        return this.createQueryBuilder().getMany();
    }

    /**
     * @param {number} id
     * @returns {Promise<ProjectCategory>}
     */
    public getById(id: number): Promise<ProjectCategory> {
        return this.createQueryBuilder()
            .andWhere('pc.id = :id')
            .setParameter('id', id)
            .getOne()
            .then((projectCategory: ProjectCategory) => {
            if (!projectCategory) throw ProjectCategoryNotFoundException.fromId(id);
            return projectCategory;
        });
    }

    /**
     * @param {ProjectCategory} projectCategory
     * @returns {Promise<ProjectCategory>}
     */
    public async store(projectCategory: ProjectCategory): Promise<ProjectCategory> {
        return this.entityManager.save(projectCategory);
    }

    /**
     * @param {ObjectType<any>} entityClass
     * @param {string} alias
     *
     * @returns {SelectQueryBuilder<any>}
     */
    protected createQueryBuilder(entityClass: ObjectType<any> = ProjectCategory, alias: string = 'pc'): SelectQueryBuilder<any> {

        return this.entityManager.createQueryBuilder(entityClass, alias)
            .select(alias)
            .where(alias + '.deletedAt IS NULL');
    }
}
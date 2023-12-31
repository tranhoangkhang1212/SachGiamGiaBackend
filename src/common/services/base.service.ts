import { HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

import { OptionsModel } from '@common/models/options.model';

export abstract class BaseService {
  protected _entity;
  protected _model;
  protected readonly logger = new Logger(BaseService.name);

  async save(input: any) {
    const newInstance = await this._model.create({ ...input });
    await this._model.save(newInstance);
    return newInstance;
  }

  async createAndSave(input: any) {
    try {
      const newInstance = await this._model.create({ ...input });
      await this._model.save(newInstance);
      return newInstance;
    } catch (error) {
      this.logger.error('error');
      throw new HttpException((error as HttpException).stack, HttpStatus.BAD_REQUEST);
    }
  }

  async create(input: any) {
    return await this._model.create({ ...input });
  }

  async findById(id: string) {
    const found = await this._model.findOne(id);
    return found;
  }

  async findOne(id: string) {
    const found = await this._model.findOne(id);
    if (!found || !found.id) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return found;
  }

  async update(id, input) {
    const newUpdate = this._model.create({ ...input });
    await this._model.update(id, newUpdate);
    const updatedPost = await this._model.findOne(id);
    return updatedPost;
  }

  async remove(id: number) {
    return await this._model.delete(id);
  }

  async findAll(options: OptionsModel = { where: {}, relations: [], order: {} }, pageSize = 10, page = 0) {
    const [rows, count] = await this._model.findAndCount({
      where: options.where,
      relations: options.relations,
      order: options.order,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      rows,
      count,
      page,
    };
  }

  async findPaginated(options = {}, limit = 100, offset = 0) {
    const rows = await this._model.find({
      where: options,
      take: limit,
      skip: offset,
    });
    return rows;
  }

  isExist(entity) {
    return entity && entity.hasId();
  }

  existsThrowException(entity: BaseEntity, message = '') {
    if (!entity || !entity.hasId()) throw new NotFoundException(`Not found ${message}`);
  }

  async findByIds(ids: number[]) {
    return await this._model.findByIds(ids);
  }
}

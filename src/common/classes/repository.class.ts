import { Repository as RepositoryBase } from 'typeorm';

export abstract class Repository<T> {
  abstract DataAcces(): RepositoryBase<T>;
  get find() {
    return this.DataAcces().find;
  }
  // get findOne() {
  //   return this.DataAcces.findOne;
  // }
  // get findOneBy() {
  //   return this.DataAcces.findOneBy;
  // }
  // get create() {
  //   return this.DataAcces.create;
  // }
  // get save() {
  //   return this.DataAcces.save;
  // }
  // get delete() {
  //   return this.DataAcces.delete;
  // }
  // get remove() {
  //   return this.DataAcces.remove;
  // }
  // get preload() {
  //   return this.DataAcces.preload;
  // }
}

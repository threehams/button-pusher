import { ValuesType } from "utility-types";
import { v4 as uuid } from "uuid";
import { Component } from "../../components";
import { Entity } from "../../types/Entity";

export const ecs = <TEntities extends Entity<Component["type"]>[]>(
  entities: TEntities,
) => {
  const find = (id: string) => {
    return entities.find((entity) => entity.id === id);
  };

  const withFunction = <TNames extends Component["type"][]>(
    ...names: TNames
  ): Array<Entity<ValuesType<TNames>>> => {
    // TODO incredibly inefficient, switch to an iterator, or cache, or both?
    return (entities.filter((entity) => {
      return !!names.every((name) => entity.components[name]);
    }) as unknown) as Array<Entity<ValuesType<TNames>>>;
  };

  const createEntity = (
    id: string | undefined,
    components: Partial<
      {
        [Key in Component["type"]]: Extract<Component, { type: Key }>;
      }
    >,
  ) => {
    const entity = {
      id: id ?? uuid(),
      components,
    } as Entity<any>;
    entities.push(entity);
    return entity;
  };

  const removeEntity = (id: string) => {
    const index = entities.findIndex((entity) => entity.id === id);
    if (index !== -1) {
      entities.splice(index, 1);
    }
  };

  const findOrCreate = (id: string) => {
    const existing = find(id);
    if (existing) {
      return existing;
    }
    return createEntity(id, {});
  };

  return {
    find,
    with: withFunction,
    findOrCreate,
    createEntity,
    removeEntity,
  };
};

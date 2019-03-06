import { loaders, Texture } from 'pixi.js';

export class Loader {
  private static readonly loader = new loaders.Loader();
  private static resources: loaders.Resource | null = null;

  private constructor() { }

  static get onComplete() {
    return Loader.loader.onComplete;
  }

  static load() {
    const textures = ['heart', 'diamond', 'club', 'spade', 'undo', 'redo', 'restart'];

    textures.forEach(v => Loader.loader.add(v, 'assets/images/' + v + '.png'));

    Loader.loader.load((_: loaders.Loader, resources: loaders.Resource) => {
      Loader.resources = resources;
    });
  }

  static getTexture(id: string) {
    if (this.resources === null || !this.resources.textures) {
      return Texture.from('assets/images/' + id + '.png');
    }

    return this.resources.textures[id];
  }
}
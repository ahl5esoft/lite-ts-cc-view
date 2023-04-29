import { instantiate, Node, Prefab } from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';

import { ViewCreate } from './create';
import { ViewCreateOption } from './create-option';
import { View } from './view';

export function ViewCreateCanvas(assetLoader: AssetLoaderBase, canvas: Node): ViewCreate {
    return async (opt: ViewCreateOption) => {
        const path = opt.viewID + '/';
        const prefab = await assetLoader.load(Prefab, `${path.replace('/', ':')}canvas.prefab`);
        const node = instantiate(prefab);
        node.parent = opt.nodeParent ?? canvas;
        return node.getComponent(View);
    };
}
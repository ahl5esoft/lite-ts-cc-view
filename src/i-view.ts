import { Node } from 'cc';

import { ViewCreateOption } from './create-option';

export interface IView {
    readonly id: string;
    readonly node: Node;
    init(opt: ViewCreateOption): Promise<void>;
}
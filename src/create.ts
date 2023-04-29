import { ViewCreateOption } from './create-option';
import { IView } from './i-view';

export type ViewCreate = (opt: ViewCreateOption) => Promise<IView>;
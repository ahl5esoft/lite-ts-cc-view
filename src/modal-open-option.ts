import { ViewCreateOption } from './create-option';

export type ModalOpenOption = ViewCreateOption & Partial<{
    zIndex: number;
    lazyArg: any;
}>;
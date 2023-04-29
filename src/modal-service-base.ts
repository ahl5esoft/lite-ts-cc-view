import { ModalOpenOption } from './modal-open-option';
import { ViewServiceBase } from './service-base';

export abstract class ModalServiceBase extends ViewServiceBase {
    public static ctor = 'ModalServiceBase';

    public abstract close(viewID: string): void;
    public abstract hide(viewID: string): void;
    public abstract open(opt: ModalOpenOption): Promise<void>;
}
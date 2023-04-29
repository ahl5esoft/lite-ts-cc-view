import { IView } from './i-view';
import { ViewServiceBase } from './service-base';

export abstract class PageServiceBase extends ViewServiceBase {
    public static ctor = 'PageServiceBase';

    public readonly current: IView;
    public abstract back(): Promise<void>;
    public abstract redirect(viewID: string): Promise<void>;
    public abstract replace(viewID: string): Promise<void>;
}
import { ViewCreate } from './create';
import { ViewCreateOption } from './create-option';
import { IView } from './i-view';

export abstract class ViewServiceBase {
    private m_Close: {
        [viewID: string]: {
            view: IView;
            timerNo: any;
        };
    } = {};

    public constructor(
        private m_CreateFunc: ViewCreate,
    ) { }

    protected onClose(view: IView) {
        if (this.m_Close[view.id])
            return;

        view.node.active = false;
        this.m_Close[view.id] = {
            timerNo: setTimeout(() => {
                view.node.destroy();
                delete this.m_Close[view.id];
            }, 1000),
            view: view,
        };
    }

    protected async onOpen(opt: ViewCreateOption) {
        const close = this.m_Close[opt.viewID];
        let view: IView;
        if (close) {
            clearTimeout(close.timerNo);
            delete this.m_Close[opt.viewID];
            close.view.node.active = true;
            view = close.view;
        } else {
            view = await this.m_CreateFunc(opt);
        }

        await view.init(opt.input);
        return view;
    }
}
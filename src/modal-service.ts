import { IView } from './i-view';
import { ModalOpenOption } from './modal-open-option';
import { ModalServiceBase } from './modal-service-base';

export class ViewModalService extends ModalServiceBase {
    private m_Open: { [viewID: string]: IView; } = {};

    public close(viewID: string) {
        if (!this.m_Open[viewID])
            return;

        this.onClose(this.m_Open[viewID]);
        delete this.m_Open[viewID];
    }

    public hide(viewID: string) {
        if (this.m_Open[viewID])
            this.m_Open[viewID].node.active = false;
    }

    public async open(opt: ModalOpenOption) {
        const view = await this.onOpen(opt);
        if (opt.zIndex)
            view.node.setSiblingIndex(opt.zIndex);
        this.m_Open[opt.viewID] = view;
    }
}

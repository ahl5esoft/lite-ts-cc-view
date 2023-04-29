import { IView } from './i-view';
import { PageServiceBase } from './page-service-base';

export class ViewPageService extends PageServiceBase {
    private m_Breadcrumbs: string[] = [];

    public current: IView;

    public async redirect(viewID: string) {
        if (this.current?.id == viewID)
            return;

        const index = this.m_Breadcrumbs.indexOf(viewID);
        if (index == -1) {
            if (this.current)
                this.m_Breadcrumbs.push(this.current.id);

            await this.setCurrent(viewID);
        } else {
            this.m_Breadcrumbs.splice(index);
            await this.back();
        }
    }

    public async replace(viewID: string) {
        await this.setCurrent(viewID);
        this.m_Breadcrumbs = [];
    }

    public async back() {
        if (!this.m_Breadcrumbs.length)
            return;

        await this.setCurrent(
            this.m_Breadcrumbs.pop()
        );
    }

    private async setCurrent(viewID: string) {
        if (this.current)
            this.onClose(this.current);

        this.current = await this.onOpen({ viewID });
    }
}
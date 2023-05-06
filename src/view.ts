import * as cc from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';
import { IMvvmMember, MvvmMemerFactoryBase } from 'lite-ts-cc-mvvm';
import { ioc } from 'lite-ts-ioc';

import { ViewCreateOption } from './create-option';
import { IView } from './i-view';

export class View<T> extends cc.Component implements IView {
    private m_Vm: { [key: string]: any };
    public get vm() {
        this.m_Vm ??= new Proxy({}, {
            set: (_, prop: string, value) => {
                this.mvvmMembers.then(res => {
                    for (const r of res) {
                        r.setValue(prop, value);
                    }
                });
                return true;
            },
        })
        return this.m_Vm;
    }

    private m_ID: string;
    public get id() {
        return this.m_ID;
    }

    private m_Input: T;
    protected get input() {
        return this.m_Input;
    }

    private m_Init: Boolean;
    protected get isInit() {
        return this.m_Init;
    }

    private m_MvvmMembers: Promise<IMvvmMember[]>;
    protected get mvvmMembers() {
        this.m_MvvmMembers ??= new Promise<IMvvmMember[]>(async (s, f) => {
            try {
                const asset = await ioc.get<AssetLoaderBase>(AssetLoaderBase).load(
                    cc.JsonAsset,
                    `${this.id.replace(':', '_').replace('/', '_')}.json`,
                );
                s(
                    (asset.json as any[]).map(r => {
                        return ioc.get<MvvmMemerFactoryBase>(MvvmMemerFactoryBase).build(r, this.node);
                    })
                );
            } catch (ex) {
                f(ex);
            }
        });
        return this.m_MvvmMembers;
    }

    public async init(opt: ViewCreateOption) {
        if (this.m_Init)
            return;

        this.m_Init = true;
        this.m_ID ??= opt.viewID;
        this.m_Input = opt.input;
        ioc.inject(this);

        const members = await this.mvvmMembers;
        for (const r of members) {
            r.bindEvent();
        }

        await this.onActive();
    }

    public async onSafeClick(evt: cc.EventTouch, s: string) {
        const eventData = JSON.parse(s);
        const nodeButton = evt.currentTarget as cc.Node;
        await this[eventData.handler](nodeButton, eventData.customEventData);
        nodeButton.emit(eventData.event);
    }

    protected async getVm<T>() {
        const res = {};
        const members = await this.mvvmMembers;
        for (const r of members) {
            for (const cr of r.getters) {
                res[cr.key] = cr.getValueFunc();
            }
        }
        return res as T;
    }

    protected async onActive() { }
}
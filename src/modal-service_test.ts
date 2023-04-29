import { deepStrictEqual, strictEqual } from 'assert';

import { ViewModalService as Self } from './modal-service';

describe('src/modal-service', () => {
    it('.close(viewID: string)', () => {
        const self = new Self(null);

        Reflect.set(self, 'm_Open', {
            'test': {}
        });

        let onClseCallCount = 0;
        Reflect.set(self, 'onClose', (arg: any) => {
            deepStrictEqual(arg, {});
            onClseCallCount++;
        });

        self.close('test');
        strictEqual(onClseCallCount, 1);
    });

    it('.hide(viewID: string)', () => {
        const self = new Self(null);

        const node = {
            active: true
        };
        Reflect.set(self, 'm_Open', {
            test: {
                node: node
            }
        });

        self.hide('test');
        strictEqual(node.active, false);
    });

    it('.open(opt: ModalOpenOption)', async () => {
        const self = new Self(null);

        let onOpenCallCount = 0;
        let setSiblingIndexCallCount = 0;
        let node = {
            setSiblingIndex: (arg: number) => {
                setSiblingIndexCallCount++;
                strictEqual(arg, 11);
            }
        };
        Reflect.set(self, 'onOpen', (arg: any) => {
            onOpenCallCount++;
            deepStrictEqual(arg, {
                viewID: 'test',
                zIndex: 11,
            });
            return { node };
        });

        await self.open({
            viewID: 'test',
            zIndex: 11,
        });

        strictEqual(onOpenCallCount, 1);
        strictEqual(setSiblingIndexCallCount, 1);

        const res = Reflect.get(self, 'm_Open');
        deepStrictEqual(res, {
            test: { node }
        });
    });
});
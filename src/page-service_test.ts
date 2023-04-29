import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { IView } from './i-view';
import { ViewPageService as Self } from './page-service';

describe('src/page-service.ts', () => {
    describe('.redirect(viewID: string)', () => {
        it('current = null', async () => {
            const self = new Self(null);

            let setCurrentCallCount = 0;
            Reflect.set(self, 'setCurrent', (arg: any) => {
                setCurrentCallCount++;
                strictEqual(arg, 'test');
            });

            await self.redirect('test');
            strictEqual(setCurrentCallCount, 1);

            const res = Reflect.get(self, 'm_Breadcrumbs');
            deepStrictEqual(res, []);
        });

        it('current != null', async () => {
            const self = new Self(null);

            const mockView = new Mock<IView>({
                id: 'back'
            });
            self.current = mockView.actual;

            let setCurrentCallCount = 0;
            Reflect.set(self, 'setCurrent', (arg: any) => {
                setCurrentCallCount++;
                strictEqual(arg, 'test');
            });

            await self.redirect('test');
            strictEqual(setCurrentCallCount, 1);

            const res = Reflect.get(self, 'm_Breadcrumbs');
            deepStrictEqual(res, ['back']);
        });

        it('已存在', async () => {
            const self = new Self(null);

            Reflect.set(self, 'm_Breadcrumbs', ['test']);

            let backCallCount = 0;
            Reflect.set(self, 'back', () => {
                backCallCount++;
            });

            await self.redirect('test');
            strictEqual(backCallCount, 1);

            const res = Reflect.get(self, 'm_Breadcrumbs');
            deepStrictEqual(res, []);
        });
    });

    it('.replace(viewID: string)', async () => {
        const self = new Self(null);

        Reflect.set(self, 'm_Breadcrumbs', ['aa']);

        let setCurrentCallCount = 0;
        Reflect.set(self, 'setCurrent', (arg: any) => {
            setCurrentCallCount++;
            strictEqual(arg, 'test');
        });

        await self.replace('test');
        strictEqual(setCurrentCallCount, 1);

        const res = Reflect.get(self, 'm_Breadcrumbs');
        deepStrictEqual(res, []);
    });

    it('.back()', async () => {
        const self = new Self(null);

        Reflect.set(self, 'm_Breadcrumbs', ['aa']);

        let setCurrentCallCount = 0;
        Reflect.set(self, 'setCurrent', (arg: any) => {
            setCurrentCallCount++;
            strictEqual(arg, 'aa');
        });

        await self.back();
        strictEqual(setCurrentCallCount, 1);
    });

    describe('.setCurrent(viewID: string)[private]', () => {
        it('ok', async () => {
            const self = new Self(null);

            let onOpenCallCount = 0;
            Reflect.set(self, 'onOpen', (arg: any) => {
                onOpenCallCount++;
                deepStrictEqual(arg, {
                    viewID: 'test'
                })
            });

            const fn = Reflect.get(self, 'setCurrent').bind(self) as (_: string) => Promise<void>;
            await fn('test');

            strictEqual(onOpenCallCount, 1);
        });

        it('current', async () => {
            const self = new Self(null);

            const mockView = new Mock<IView>({
                id: 'old'
            });
            self.current = mockView.actual;

            let onCloseCallCount = 0;
            Reflect.set(self, 'onClose', (arg: any) => {
                strictEqual(arg, mockView.actual);
                onCloseCallCount++;
            });

            let onOpenCallCount = 0;
            Reflect.set(self, 'onOpen', (arg: any) => {
                onOpenCallCount++;
                deepStrictEqual(arg, {
                    viewID: 'test'
                })
            });

            const fn = Reflect.get(self, 'setCurrent').bind(self) as (_: string) => Promise<void>;
            await fn('test');

            strictEqual(onCloseCallCount, 1);
            strictEqual(onOpenCallCount, 1);
        });
    });
});
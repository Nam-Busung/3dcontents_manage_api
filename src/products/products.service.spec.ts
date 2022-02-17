import {HttpException} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {ProductsService} from './products.service';

var httpMocks = require('node-mocks-http');
describe('ProductsService', () => {
    let service: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductsService],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should return upload product object', async () => {
            const req = httpMocks.createRequest()

            const productToCreate = {
                title: ["테스트", "test", "测试"],
                description: ["테스트", "test", "测试"],
                price: 1000
            };

            req.forwardingUser = {
                id: 1,
                authority: 'artist'
            };

            const result = await service.create(req, productToCreate);
            expect(typeof result.title).toBe('object');
            expect(typeof result.description).toBe('object');
            expect(typeof result.price).toBe('number');
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                const productToCreate = {
                    title: ["테스트", "test", "测试"],
                    description: ["테스트", "test", "测试"],
                    price: 1000
                };

                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };

                await service.create(req, productToCreate);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });
    describe('getExchangeRate', () => {
        it('should return succeed', async () => {
            const result = await service.getExchangeRate();
            expect(result).toEqual('succeed');
        });
    });
    describe('getNotPermitted', () => {
        it('should return array', async () => {
            const req = httpMocks.createRequest()

            req.forwardingUser = {
                id: 2,
                authority: 'editor'
            };
            const result = await service.getNotPermitted(req);
            expect(result).toBeInstanceOf(Array);
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };
                await service.getNotPermitted(req);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });

    describe('update', () => {
        it('should return updated', async () => {
            const req = httpMocks.createRequest()

            const productToUpdate = {
                id: 1,
                permission: true,
                title: ["테스트", "test", "测试"],
                description: ["테스트", "test", "测试"],
                price: 1000,
                fee: 1000
            };

            req.forwardingUser = {
                id: 2,
                authority: 'editor'
            };
            const result = await service.update(req, productToUpdate);
            expect(result).toEqual('updated');
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                const productToUpdate = {
                    id: 1,
                    permission: true,
                    title: ["테스트", "test", "测试"],
                    description: ["테스트", "test", "测试"],
                    price: 1000,
                    fee: 1000
                };
                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };
                await service.update(req, productToUpdate);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });

    describe('getPermitted', () => {
        it('should return array', async () => {
            const req = httpMocks.createRequest()

            req.forwardingUser = {
                id: 2,
                authority: 'editor'
            };
            const result = await service.getPermitted(req);
            expect(result).toBeInstanceOf(Array);
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };
                await service.getPermitted(req);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });
    describe('getPermitted', () => {
        it('should return array', async () => {
            const req = httpMocks.createRequest()

            req.forwardingUser = {
                id: 2,
                authority: 'editor'
            };
            const result = await service.getPermitted(req);
            expect(result).toBeInstanceOf(Array);
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };
                await service.getPermitted(req);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });
    describe('getMarketList', () => {
        it('should return array', async () => {
            const result = await service.getMarketList();
            expect(result).toBeInstanceOf(Array);
        });
    });
    describe('delete', () => {
        it('should return deleted', async () => {
            const req = httpMocks.createRequest()

            const productToDelete = {
                id: 1
            };

            req.forwardingUser = {
                id: 2,
                authority: 'editor'
            };
            const result = await service.delete(req, productToDelete);
            expect(result).toEqual('deleted');
        });
        it('should throw HttpException', async () => {
            try {
                const req = httpMocks.createRequest()
                const productToDelete = {
                    id: 1
                };
                req.forwardingUser = {
                    id: 3,
                    authority: 'client'
                };
                await service.delete(req, productToDelete);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });
});

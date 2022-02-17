import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {db} from '../config'
import { NotFoundException } from '@nestjs/common';
var httpMocks = require('node-mocks-http');


describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();


        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('signup', () => {
        it('should generate test user', async () => {
            const result = await service.signup();
            expect(result).toEqual('signup succeed');
        });
    });
    describe('login', () => {
        it('should return login user id', async () => {
            const req = httpMocks.createRequest()
            const id_ = 2;
            const loginBody = {
                id: id_
            }
            req.res = httpMocks.createResponse()

            const result = await service.login(req.res, loginBody);
            expect(result.locals.user.id).toEqual(id_);
        });
        it('should throw NotFoundException', async () => {
            try {
                const req = httpMocks.createRequest()
                const id_ = 999;
                const loginBody = {
                    id: id_
                }
                req.res = httpMocks.createResponse()
                await service.login(req.res, loginBody);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });
    describe('findUser', () => {
        it('should return user authority', async () => {
            const id_ = 2;
            const result = await service.findUser(id_);
            expect(result.authority).toEqual('editor');
        });
        it('should return NotFoundException', async () => {
            try {
                const id_ = 999;
                await service.findUser(id_);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });
});

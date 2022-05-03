import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import JWTService from "../../../../src/core/services/jwt.service";

import { DataResult, ErrorDataResult, SuccessDataResult } from "../../../../src/core/results/DataResult";
import { TokenPayload } from "../../../../src/core/types/TokenPayload";
import { MockValues } from "../../../utils/mocks/const-mock-values";
import { Token } from "../../../../src/core/types/Token";


describe('JWTService service', () => {

    describe('generateToken - verify', () => {

        test('Generate and verify token', async () => {
            const token: Token = JWTService.generateToken(MockValues.mTokenPayloadUser1);
            
            expect(token).toBeDefined();

            const tokenPayloadDataResult: DataResult<TokenPayload | null> = await JWTService.verify(token);

            expect(tokenPayloadDataResult).toBeDefined();
            expect(tokenPayloadDataResult).toBeInstanceOf(SuccessDataResult);
            expect(tokenPayloadDataResult.data).toEqual(MockValues.mTokenPayloadUser1);
        });

    });

    describe('verify', () => {

        test('Verify expired token', async () => {
            const err: TokenExpiredError = new TokenExpiredError("", new Date());
            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw err;
            });

            const tokenPayloadDataResult: DataResult<TokenPayload | null> = await JWTService.verify(MockValues.mToken1);

            expect(tokenPayloadDataResult).toBeDefined();
            expect(tokenPayloadDataResult).toBeInstanceOf(ErrorDataResult);
        });

        test('JWT error', async () => {
            const err: JsonWebTokenError = new JsonWebTokenError("");
            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw err;
            });

            const tokenPayloadDataResult: DataResult<TokenPayload | null> = await JWTService.verify(MockValues.mToken1);

            expect(tokenPayloadDataResult).toBeDefined();
            expect(tokenPayloadDataResult).toBeInstanceOf(ErrorDataResult);
        });

    });

});
import EncryptionService from "../../../../src/core/services/encryption.service";
import { MockValues } from "../../../utils/mocks/const-mock-values";


describe('encryption service', () => {

    describe('hash - compare', () => {

        test('hash and compare incorrect password', async () => {

            const hashedPassword = await EncryptionService.hash(MockValues.mPassword1);
            
            expect(hashedPassword).toBeDefined();

            const compareResult = await EncryptionService.compare(MockValues.mPassword2, hashedPassword);

            expect(compareResult).toBeDefined();
            expect(compareResult).toEqual(false);
        });

        test('hash and compare correct password', async () => {

            const hashedPassword = await EncryptionService.hash(MockValues.mPassword1);
            
            expect(hashedPassword).toBeDefined();

            const compareResult = await EncryptionService.compare(MockValues.mPassword1, hashedPassword);

            expect(compareResult).toBeDefined();
            expect(compareResult).toEqual(true);
        });

    });

});
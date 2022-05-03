import mongoose from "mongoose";

import { MongoMemoryServer } from 'mongodb-memory-server';

import MongoDBService from "../../../../src/core/services/mongodb.service";


describe('MongoDB service', () => {

    describe('connect - disconnect', () => {

        test('Successfully connect and disconnect', async () => {
            expect(mongoose.connection.readyState).toEqual(0);
            const connectionResult = await MongoDBService.connect();
            expect(connectionResult).toEqual(true);
            expect(mongoose.connection.readyState).toEqual(1);
            const disconnectionResult = await MongoDBService.disconnect();
            expect(disconnectionResult).toEqual(true);
            expect(mongoose.connection.readyState).toEqual(0);
        });

        test('Connect error', async () => {
            jest.spyOn(MongoMemoryServer, "create").mockImplementationOnce((): any => {
                throw new Error();
            });

            expect(mongoose.connection.readyState).toEqual(0);
            const connectionResult = await MongoDBService.connect();
            expect(mongoose.connection.readyState).toEqual(0);
            expect(connectionResult).toEqual(false);
        });

        test('Disconnect error', async () => {
            jest.spyOn(mongoose.connection, "close").mockImplementationOnce((): any => {
                throw new Error();
            });

            expect(mongoose.connection.readyState).toEqual(0);
            const connectionResult = await MongoDBService.connect();
            expect(connectionResult).toEqual(true);
            expect(mongoose.connection.readyState).toEqual(1);
            const disconnectionResult = await MongoDBService.disconnect();
            expect(disconnectionResult).toEqual(false);
            expect(mongoose.connection.readyState).toEqual(1);

            // Disconnect for real to prevent open handlers
            await MongoDBService.disconnect();
        });

    });

});

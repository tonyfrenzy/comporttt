import supertest from 'supertest';

import app from '../server.js';
import * as dbMock from './__utils/testDb.js';
import adminMock from './__utils/adminMock.js';
import userMock from './__utils/userMock.js';

const request = supertest(app);

beforeAll(async () => {
  await dbMock.connect();
  jest.setTimeout(30000);
});
afterEach(async () => {
  await dbMock.clearDatabase();
  jest.setTimeout(30000);
});
afterAll(async () => await dbMock.disconnectDB());

// NEW ADMIN
describe("POST /admins/new", () => {
  describe("add new admin", () => {
    it("when success", async () => {
      // First register user to simulate existing account
      const user = await request.post('/users/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.completeData);
      
        adminMock.completeData.user = user.body.data.id;
      const response = await request
                              .post('/admins/new')
                              .set('Content-Type', 'application/json')
                              .send(adminMock.completeData)
                              ;

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("new admin added");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data).toHaveProperty("acl");
    })
  })
})

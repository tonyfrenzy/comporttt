import supertest from 'supertest';

import app from '../server.js';
import * as dbMock from './__utils/testDb.js';
import userMock from './__utils/userMock.js';

const request = supertest(app);

beforeAll(async () => await dbMock.connect());
afterEach(async () => await dbMock.clearDatabase());
afterAll(async () => await dbMock.disconnectDB());

// USER REGISTRATION
describe("POST /register", () => {
  describe("user registration is successful", () => {
    it("when registration succeeds", async () => {
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.completeData)
                              ;

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("user registration successful");
      expect(response.body.data).toHaveProperty("firstname");
      expect(response.body.data).toHaveProperty("username");
    })
  })

  describe("user registration fails", () => {

    it("when a required field is not filled", async () => {
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incompleteRequiredData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("username field is required");
    })

    it("when given passwords don't match", async () => {
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.diffPasswords);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Passwords do not match");
    })

    it("when user already exists in the db", async () => {
      // First register user to simulate existing account
      await request.post('/register')
                   .set('Content-Type', 'application/json')
                   .send(userMock.completeData);

      // Trying to register again with same email
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.completeData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("a user with email 'johndoe@test.com' already exists");
    })
  })
})

// LOGIN
describe("POST /login", () => {
  describe("user login is successful", () => {
    it("when user login succeeds", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const response = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("login successful");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.token).toMatch("Bearer");
    })
  })

  describe("user LOGIN fails", () => {
    it("when required fields aren't filled", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const response = await request
                              .post('/login')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incompleteLoginData)
      
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("enter your email/username and password!");
    })

    it("when given email doesn't exist in db", async () => {
      const response = await request
                              .post('/login')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incorrectLoginEmail);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("record not found");
    //   expect(response.body.message).toBe("Email or password incorrect");
    });

    it("when given password doesn't match user's in the db", async () => {
      // First register user to simulate existing account
      await request.post('/register')
                   .set('Content-Type', 'application/json')
                   .send(userMock.completeData);

      // Login attempt with different password
      const loginResponse = await request
                              .post('/login')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incorrectLoginPassword);

      expect(loginResponse.statusCode).toBe(404);
      expect(loginResponse.body.status).toBe("failed");
      expect(loginResponse.body.message).toBe("email/username or password incorrect");
    })
  })
})

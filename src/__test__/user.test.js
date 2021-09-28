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
    it("when required fields aren't filled", async () => {
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incompleteData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Please fill all fields");
    })

    it("when required fields, username is not filled", async () => {
      const response = await request
                              .post('/register')
                              .set('Content-Type', 'application/json')
                              .send(userMock.missingUsername);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Username field is required");
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

/*
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
      expect(response.body.status).toBe("Success");
      expect(response.body.message).toBe("Logged in successfully");
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
      expect(response.body.status).toBe("Failed");
      expect(response.body.message).toBe("Enter your email and password!");
    })

    it("when given email doesn't exist in db", async () => {
      const response = await request
                              .post('/login')
                              .set('Content-Type', 'application/json')
                              .send(userMock.incorrectLoginEmail);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("Failed");
      expect(response.body.message).toBe("Record not found");
    //   expect(response.body.message).toBe("Email or password incorrect");
    })

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
      expect(loginResponse.body.status).toBe("Failed");
      expect(loginResponse.body.message).toBe("Email or password incorrect");
    })
  })
})

// USER PROFILE
describe("GET /user/profile/:id", () => {
  describe("can access user profile", () => {
    it("when email login succeeds", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.loginData);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body).toHaveProperty("data");
    })

    it("when username login succeeds", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.usernameLoginData);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body).toHaveProperty("data");
    })
  })

  describe("can not access user profile", () => {
    it("when there is incomplete login data", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.incompleteLoginData);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("fail");
      expect(response.body).toNotHaveProperty("data");
    })
    
    it("when there is incorrect password", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.incorrectLoginPassword);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("fail");
      expect(response.body).toNotHaveProperty("data");
    })
    
    it("when there is incorrect email", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.incorrectLoginEmail);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("fail");
      expect(response.body).toNotHaveProperty("data");
    })
    
    it("when there is incomplete username login data", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.incompleteUsernameLoginData);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)
          
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("fail");
      expect(response.body).toNotHaveProperty("data");
    })
      
    it("when there is incorrect username password", async () => {
        // Simulating user signup
        await request
            .post('/register')
            .set('Content-Type', 'application/json')
            .send(userMock.completeData);

        // Login attempt on creating account
        const user = await request
                            .post('/login')
                            .set('Content-Type', 'application/json')
                            .send(userMock.incorrectUsernameLoginPassword);

        const { _id: user_id, token } = user.body.data;

        const response = await request
                                    .get('/user/profile/' + user_id)
                                    .set('Authorization', token)
            
        expect(response.statusCode).toBe(403);
        expect(response.body.status).toBe("fail");
        expect(response.body).toNotHaveProperty("data");
    })

    it("when there is incorrect username", async () => {
      // Simulating user signup
      await request
              .post('/register')
              .set('Content-Type', 'application/json')
              .send(userMock.completeData);

      // Login attempt on creating account
      const user = await request
                          .post('/login')
                          .set('Content-Type', 'application/json')
                          .send(userMock.incorrectLoginUsername);

      const { _id: user_id, token } = user.body.data;

      const response = await request
                                .get('/user/profile/' + user_id)
                                .set('Authorization', token)

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("fail");
      expect(response.body).toNotHaveProperty("data");
    })
  })
})
  */
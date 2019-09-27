import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {

  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async (done) => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Eduardo Sutil',
        email: 'sutil.edu@gmail.com',
        password: '123456'
      })

      expect(response.body).toHaveProperty('id');
      done();
  });

  it('fail when the object is invalid', async (done) => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Eduardo Sutil',
        email: 'sutil.edu@gmail.com'
        // password: '123456' < - it is required
      })

      expect(response.status).toBe(400);
      done();
  });

  it('fail when try register with existing email', async (done) => {
    const user = await factory.attrs('User', {
      email: 'sutil.edu@gmail.com'
    });
    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user)

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists.');
      done();
  });

  it('should update user', async () => {
    const user = {
      name: 'Eduardo',
      email: 'eduardo@email.com',
      password: '123456'
    };

    const postReponse = await request(app)
      .post('/users')
      .send(user);

    expect(postReponse.body.name).toBe('Eduardo');

    const tokenResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = tokenResponse.body.token;

    expect(tokenResponse.body).toHaveProperty('token');

    user.name = 'Eduardo Sutil'
    user.oldPassword = '123456';
    user.password = '12345678';
    user.confirmPassword = '12345678';



    const putResponse = await request(app)
      .put('/users')
      .set({'Authorization': `Bearer ${token}`})
      .send(user);

      expect(putResponse.status).toBe(200);
      expect(putResponse.body.name).toBe('Eduardo Sutil');
  });

  it('Fails when update password without pass oldPassword', async () => {
    const user = {
      name: 'Eduardo',
      email: 'eduardo@email.com',
      password: '123456'
    };

    const postReponse = await request(app)
      .post('/users')
      .send(user);

    expect(postReponse.body.name).toBe('Eduardo');

    const tokenResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = tokenResponse.body.token;

    expect(tokenResponse.body).toHaveProperty('token');

    user.name = 'Eduardo Sutil'
    user.password = '12345678';
    user.confirmPassword = '12345678';

    const putResponse = await request(app)
      .put('/users')
      .set({'Authorization': `Bearer ${token}`})
      .send(user);

      expect(putResponse.status).toBe(400);
      expect(putResponse.body.error).toBe('Validation fails');
  });

  it('Fails when update profile passing email that alredy exists', async () => {

    await factory.create('User', {
      email: 'sutil.edu@gmail.com'
    });

    const user = await factory.create('User',  {
      name: 'Eduardo',
      email: 'eduardo@email.com',
      password: '123456'
    });

    const tokenResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = tokenResponse.body.token;

    expect(tokenResponse.body).toHaveProperty('token');

    const putResponse = await request(app)
      .put('/users')
      .set({'Authorization': `Bearer ${token}`})
      .send({
        name: 'Eduardo',
        email: 'sutil.edu@gmail.com',
      });

      expect(putResponse.status).toBe(400);
      expect(putResponse.body.error).toBe('E-mail already in use.');
  });

  it('update profile fails when send the wrong password', async () => {
    const user = {
      name: 'Eduardo',
      email: 'eduardo@email.com',
      password: '123456'
    };

    const postReponse = await request(app)
      .post('/users')
      .send(user);

    expect(postReponse.body.name).toBe('Eduardo');

    const tokenResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = tokenResponse.body.token;

    expect(tokenResponse.body).toHaveProperty('token');

    user.name = 'Eduardo Sutil'
    user.oldPassword = '1234567'; // wrong password
    user.password = '12345678';
    user.confirmPassword = '12345678';



    const putResponse = await request(app)
      .put('/users')
      .set({'Authorization': `Bearer ${token}`})
      .send(user);

      expect(putResponse.status).toBe(401);
      expect(putResponse.body.error).toBe('Password does not match');
  });

});


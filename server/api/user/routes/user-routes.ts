"use strict";

import * as express from 'express';
import {UserController} from '../controller/user-controller';
import * as auth from '../../../auth/auth-service';

export class UserRoutes {
    static init(router: express.Router) {
      router
        .route('/users')
        .get(auth.isAuthenticated(), UserController.getAll)
        .post(auth.isAuthenticated(), UserController.createUser);

      router
        .route('/users/:id')
        .get(auth.isAuthenticated(), UserController.getById)
        .put(auth.isAuthenticated(), UserController.deleteUser);

      router
        .route('/users/update/:id')
        .post(auth.isAuthenticated(), UserController.updateUser);

      router
        .route('/users/verification_code')
        .post(auth.isAuthenticated(), UserController.verifiedUser);

      router
        .route('/users/verification_code/resend')
        .post(auth.isAuthenticated(), UserController.resendVerificationUser);

      router
        .route('/users/active/:id')
        .post(auth.isAuthenticated(), UserController.activationUser);

      router
        .route('/users/unactive/:id')
        .post(auth.isAuthenticated(), UserController.unActiveUser);

      router
        .route('/')
        .get(UserController.index);

      router
        .route('/user_all')
        .get(auth.isAuthenticated(), UserController.getAll);

      router
        .route('/me')
        .get(auth.isAuthenticated(), UserController.me);       

      router
        .route('/users/user_tenant_landlord')
        .post(auth.isAuthenticated(), UserController.InputUserInLandlordOrTenant);

      router
        .route('/users/super_admin')
        .post(auth.isAuthenticated(), UserController.createUserSuperAdmin);

      //for global user without certain rules
      router
        .route('/create_user')
        .post(auth.isAuthenticated(), UserController.createUsers);

      router
        .route('/update_user/:id')
        .post(auth.isAuthenticated(), UserController.updateUsers);

      router
        .route('/refresh_token')
        .get(UserController.refreshToken);

      router
        .route('/decode_token')
        .post(UserController.decodeToken);
    }
}

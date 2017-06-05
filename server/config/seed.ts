'use strict';
import * as Promise from 'bluebird';
import User from '../api/user/dao/user-dao';
import Development from './../api/development/dao/development-dao';

User
  .find({})
  .then(() => {
    User.create({
          provider: 'local',
          username: 'master',
          password: 'master',
          email: 'master@master.com',
          role: 'master',
          active: true
        })
    .then((user) => {
      console.log('finished populating master');
      Development
        .find({})
        .then(() => {
        Development.create({
            name: 'Marina Bay Testing',
            name_url : 'marina-bay-testing',
            description: 'just for testing',
            address : {
              street_name : 'Lorong 24 Geylang',
              postal_code : '398614',
              country : 'Singapore',
              full_address : '1 Lorong 24 Geylang, Singapore 398614'
            },
            properties : [{
              address : {
                unit_no : '01',
                unit_no_2 : '01',
                block_no : 'A1',
                street_name : 'Lorong 24 Geylang',
                postal_code : '398614',
                country : 'Singapore',
                full_address : '1 Lorong 24 Geylang, Singapore 398614'
              },
              max_tenant : 10
            }]
          })
          .then((development) => {
            console.log('finished populating development');
            User.create({
              provider: 'local',
              username: 'superadmin',
              password: 'superadmin',
              email: 'superadmin@superadmin.com',
              role: 'superadmin',
              default_development: development._id,
              active: true
            })
            .then((userSuperadmin) => {
              console.log('finished populating superadmin');
            });
          });
        });
    });
  });
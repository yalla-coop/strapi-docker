"use strict";

const fs = require("fs-extra");
const path = require("path");
const mime = require("mime-types");
const set = require("lodash.set");

const bootstrap = async ({ strapi }) => {
  // create user admin if it doesn't exist
  await strapi.admin.services.role.createRolesIfNoneExist();
  const superAdminRole = await strapi.db
    .query("admin::role")
    .findOne({ where: { code: "strapi-super-admin" } });
  const superAdmin = await strapi.db
    .query("admin::user")
    .findOne({ where: { username: "admin" } });
  if (!superAdmin) {
    const params = {
      username: "admin",
      email: "admin@email.com",
      blocked: false,
      isActive: true,
      confirmed: true,
      password: null,
      roles: null,
    };
    params.password = await strapi.admin.services.auth.hashPassword(
      "Admin1234"
    );
    params.roles = [superAdminRole.id];
    await strapi.db.query("admin::user").create({
      data: { ...params },
      populate: ["roles"],
    });
  }
};

module.exports = bootstrap;

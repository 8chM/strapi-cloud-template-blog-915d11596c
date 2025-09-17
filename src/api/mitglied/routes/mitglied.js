'use strict';

/**
 * mitglied router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::mitglied.mitglied');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/mitglieder/aktiv',
    handler: 'api::mitglied.mitglied.findActive',
  },
  {
    method: 'GET',
    path: '/mitglieder/vorstand',
    handler: 'api::mitglied.mitglied.findVorstand',
  },
  {
    method: 'GET',
    path: '/mitglieder/gruppe/:gruppe',
    handler: 'api::mitglied.mitglied.findByInstrumentengruppe',
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);


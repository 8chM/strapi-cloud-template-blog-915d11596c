'use strict';

/**
 * mitglied service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mitglied.mitglied', ({ strapi }) => ({
  // Erweiterte Service-Methoden für Mitglieder
  
  async findActiveMitglieder() {
    return await strapi.entityService.findMany('api::mitglied.mitglied', {
      filters: {
        aktiv: true,
      },
      populate: {
        foto: true,
      },
      sort: ['reihenfolge:asc', 'nachname:asc'],
    });
  },

  async findVorstandMitglieder() {
    return await strapi.entityService.findMany('api::mitglied.mitglied', {
      filters: {
        ist_vorstand: true,
        aktiv: true,
      },
      populate: {
        foto: true,
      },
      sort: ['reihenfolge:asc'],
    });
  },

  async findByInstrumentengruppe(gruppe) {
    return await strapi.entityService.findMany('api::mitglied.mitglied', {
      filters: {
        instrumentengruppe: gruppe,
        aktiv: true,
      },
      populate: {
        foto: true,
      },
      sort: ['nachname:asc'],
    });
  },

  async getMitgliederStatistik() {
    const alleMitglieder = await strapi.entityService.findMany('api::mitglied.mitglied', {
      filters: {
        aktiv: true,
      },
    });

    const statistik = {
      gesamt: alleMitglieder.length,
      holzbläser: alleMitglieder.filter(m => m.instrumentengruppe === 'holzbläser').length,
      blechbläser: alleMitglieder.filter(m => m.instrumentengruppe === 'blechbläser').length,
      schlagwerk: alleMitglieder.filter(m => m.instrumentengruppe === 'schlagwerk').length,
      vorstand: alleMitglieder.filter(m => m.ist_vorstand === true).length,
      durchschnittsalter: this.calculateDurchschnittsalter(alleMitglieder),
      mitgliedSeit: this.calculateMitgliedschaftsstatistik(alleMitglieder),
    };

    return statistik;
  },

  calculateDurchschnittsalter(mitglieder) {
    const currentYear = new Date().getFullYear();
    const mitgliederMitGeburtsjahr = mitglieder.filter(m => m.geburtsjahr);
    
    if (mitgliederMitGeburtsjahr.length === 0) return null;
    
    const summeAlter = mitgliederMitGeburtsjahr.reduce((sum, m) => {
      return sum + (currentYear - m.geburtsjahr);
    }, 0);
    
    return Math.round(summeAlter / mitgliederMitGeburtsjahr.length);
  },

  calculateMitgliedschaftsstatistik(mitglieder) {
    const currentYear = new Date().getFullYear();
    const mitgliedschaftsdauer = mitglieder.map(m => currentYear - m.mitglied_seit);
    
    return {
      durchschnittlicheMitgliedschaft: Math.round(
        mitgliedschaftsdauer.reduce((sum, dauer) => sum + dauer, 0) / mitglieder.length
      ),
      laengsteMitgliedschaft: Math.max(...mitgliedschaftsdauer),
      neuesteMitglieder: mitglieder
        .filter(m => (currentYear - m.mitglied_seit) <= 2)
        .length,
    };
  },
}));


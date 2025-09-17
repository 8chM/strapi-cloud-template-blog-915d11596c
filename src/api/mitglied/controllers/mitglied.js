'use strict';

/**
 * mitglied controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mitglied.mitglied', ({ strapi }) => ({
  // Erweiterte Methode um aktive Mitglieder zu holen
  async findActive(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Filtere nur aktive Mitglieder
    const activeMitglieder = data.filter(mitglied => 
      mitglied.attributes.aktiv === true
    );
    
    return { data: activeMitglieder, meta };
  },

  // Hole Vorstandsmitglieder
  async findVorstand(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Filtere nur Vorstandsmitglieder
    const vorstandMitglieder = data.filter(mitglied => 
      mitglied.attributes.ist_vorstand === true
    ).sort((a, b) => {
      // Sortiere nach Vorstand-Position
      const positions = {
        '1_vorsitzender': 1,
        '2_vorsitzender': 2,
        'dirigent': 3,
        'kassenwart': 4,
        'schriftfuehrer': 5,
        'beisitzer': 6
      };
      
      const posA = positions[a.attributes.vorstand_position] || 99;
      const posB = positions[b.attributes.vorstand_position] || 99;
      
      return posA - posB;
    });
    
    return { data: vorstandMitglieder, meta };
  },

  // Hole Mitglieder nach Instrumentengruppe
  async findByInstrumentengruppe(ctx) {
    const { gruppe } = ctx.params;
    const { data, meta } = await super.find(ctx);
    
    // Filtere nach Instrumentengruppe
    const gruppeMitglieder = data.filter(mitglied => 
      mitglied.attributes.instrumentengruppe === gruppe &&
      mitglied.attributes.aktiv === true
    );
    
    return { data: gruppeMitglieder, meta };
  }
}));


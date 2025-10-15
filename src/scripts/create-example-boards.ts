/**
 * Script to create 10 curated example moodboards with stock images
 * Run this in the browser console after importing
 */

import { supabase } from '@/modules/database/supabase';
import { nanoid } from '@/modules/utils/id';
import { Board, BoardItem, Color } from '@/types';

// Curated themes with professional stock images from Unsplash
const EXAMPLE_BOARDS = [
  {
    title: 'Elegante Hochzeit',
    welcomeText: 'Eine zeitlose Hochzeit voller Eleganz und romantischer Details',
    theme: 'Klassisch elegant mit sanften Pastelltönen und floralen Akzenten',
    colorPalette: [
      { hex: '#F5E6D3', rgb: [245, 230, 211], score: 0.35 },
      { hex: '#E8C4B8', rgb: [232, 196, 184], score: 0.28 },
      { hex: '#D4AF37', rgb: [212, 175, 55], score: 0.22 },
      { hex: '#FFFFFF', rgb: [255, 255, 255], score: 0.15 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        label: 'Zeremonie-Setup',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        label: 'Blumenarrangement',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1525772764200-be829510b15b?w=800&q=80',
        label: 'Tischdekoration',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80',
        label: 'Brautpaar Detail',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        label: 'Einladungskarten',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Ivory, Blush Pink, Gold', section: 'mood' },
      { text: 'Stil: Romantisch-klassisch mit modernen Akzenten', section: 'mood' },
      { text: 'Beleuchtung: Warmes, weiches Licht mit Kerzen', section: 'details' }
    ],
    checklist: {
      title: 'Vorbereitungen',
      items: [
        'Location besichtigen',
        'Florist kontaktieren',
        'Beleuchtungskonzept finalisieren',
        'Farbmuster bestätigen'
      ]
    }
  },
  {
    title: 'Modern Corporate Event',
    welcomeText: 'Ein professionelles Corporate Event mit zeitgenössischem Design',
    theme: 'Minimalistisch modern mit kühlen Tönen und klaren Linien',
    colorPalette: [
      { hex: '#1E3A5F', rgb: [30, 58, 95], score: 0.40 },
      { hex: '#C0C0C0', rgb: [192, 192, 192], score: 0.30 },
      { hex: '#FFFFFF', rgb: [255, 255, 255], score: 0.25 },
      { hex: '#4A90E2', rgb: [74, 144, 226], score: 0.05 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        label: 'Event Space',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
        label: 'Moderne Architektur',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
        label: 'Networking Setup',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
        label: 'Präsentation',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1559223607-a43c990c5a09?w=800&q=80',
        label: 'Catering Modern',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Navy, Silber, Weiß', section: 'mood' },
      { text: 'Branding: Logo-Integration auf allen Touchpoints', section: 'details' },
      { text: 'Tech: LED-Screens, moderne AV-Ausstattung', section: 'details' }
    ],
    checklist: {
      title: 'Event-Planung',
      items: [
        'Venue Ausstattung prüfen',
        'Branding-Materialien vorbereiten',
        'Catering-Auswahl',
        'Tech-Check durchführen'
      ]
    }
  },
  {
    title: 'Festlicher Geburtstag',
    welcomeText: 'Eine unvergessliche Geburtstagsfeier voller Freude und Farben',
    theme: 'Lebhaft und festlich mit bunten Akzenten',
    colorPalette: [
      { hex: '#FF7F66', rgb: [255, 127, 102], score: 0.35 },
      { hex: '#FFD700', rgb: [255, 215, 0], score: 0.30 },
      { hex: '#40E0D0', rgb: [64, 224, 208], score: 0.25 },
      { hex: '#FFB6C1', rgb: [255, 182, 193], score: 0.10 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
        label: 'Party Setup',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
        label: 'Dekoration',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80',
        label: 'Geburtstagstorte',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80',
        label: 'Luftballons',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&q=80',
        label: 'Party Lights',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Coral, Gold, Türkis', section: 'mood' },
      { text: 'Atmosphäre: Fröhlich und energiegeladen', section: 'mood' },
      { text: 'Special: Photo Booth mit Props', section: 'details' }
    ],
    checklist: {
      title: 'Party-Vorbereitung',
      items: [
        'Gästeliste finalisieren',
        'Torte bestellen',
        'Musik-Playlist erstellen',
        'Deko einkaufen'
      ]
    }
  },
  {
    title: 'Fashion Editorial Shoot',
    welcomeText: 'Ein hochwertiges Fashion-Shooting mit zeitgenössischer Ästhetik',
    theme: 'Editorial chic mit starken Kontrasten und urbaner Eleganz',
    colorPalette: [
      { hex: '#000000', rgb: [0, 0, 0], score: 0.45 },
      { hex: '#FFFFFF', rgb: [255, 255, 255], score: 0.40 },
      { hex: '#C0C0C0', rgb: [192, 192, 192], score: 0.10 },
      { hex: '#8B7355', rgb: [139, 115, 85], score: 0.05 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        label: 'Fashion Model',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        label: 'Styling Details',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
        label: 'Urban Background',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
        label: 'Accessoires',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1558769132-cb1aea56c7b5?w=800&q=80',
        label: 'Textures',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Schwarz, Weiß, Metallische Akzente', section: 'mood' },
      { text: 'Styling: Minimalistisch mit Statement-Pieces', section: 'details' },
      { text: 'Licht: Hartes Licht für definierte Schatten', section: 'details' }
    ],
    checklist: {
      title: 'Shooting-Planung',
      items: [
        'Lookbook erstellen',
        'Model Casting',
        'Location Scouting',
        'Equipment-Liste checken'
      ]
    }
  },
  {
    title: 'Tech Product Launch',
    welcomeText: 'Ein innovativer Produktlaunch mit futuristischer Inszenierung',
    theme: 'Technologisch und zukunftsweisend mit dynamischen Elementen',
    colorPalette: [
      { hex: '#4169E1', rgb: [65, 105, 225], score: 0.38 },
      { hex: '#000000', rgb: [0, 0, 0], score: 0.35 },
      { hex: '#00FFFF', rgb: [0, 255, 255], score: 0.17 },
      { hex: '#1C1C1C', rgb: [28, 28, 28], score: 0.10 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&q=80',
        label: 'Tech Setup',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        label: 'Workspace Modern',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        label: 'Product Display',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
        label: 'LED Aesthetics',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80',
        label: 'Innovation',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Electric Blue, Schwarz, Neon-Akzente', section: 'mood' },
      { text: 'Präsentation: Interaktive Demos und AR-Elemente', section: 'details' },
      { text: 'Sound: Elektronische Ambient-Musik', section: 'mood' }
    ],
    checklist: {
      title: 'Launch-Vorbereitung',
      items: [
        'Produktpräsentation finalisieren',
        'Tech-Demo testen',
        'Press-Kit vorbereiten',
        'Social Media Strategie'
      ]
    }
  },
  {
    title: 'Restaurant Opening',
    welcomeText: 'Die Eröffnung eines gehobenen Restaurants mit kulinarischer Exzellenz',
    theme: 'Kulinarisch sophisticated mit warmen, einladenden Tönen',
    colorPalette: [
      { hex: '#2F4F2F', rgb: [47, 79, 47], score: 0.35 },
      { hex: '#FFD700', rgb: [255, 215, 0], score: 0.25 },
      { hex: '#CD853F', rgb: [205, 133, 63], score: 0.25 },
      { hex: '#8B4513', rgb: [139, 69, 19], score: 0.15 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        label: 'Restaurant Interior',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        label: 'Fine Dining',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        label: 'Tisch-Setting',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        label: 'Gourmet Food',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?w=800&q=80',
        label: 'Wine Selection',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Dunkelgrün, Gold, Terracotta', section: 'mood' },
      { text: 'Ambiente: Warm und intim mit Kerzenlicht', section: 'mood' },
      { text: 'Kulinarik: Farm-to-Table Konzept', section: 'details' }
    ],
    checklist: {
      title: 'Opening-Vorbereitung',
      items: [
        'Menü-Degustationen',
        'Service-Training',
        'Presse-Event planen',
        'Reservierungssystem testen'
      ]
    }
  },
  {
    title: 'Fitness Brand Campaign',
    welcomeText: 'Eine energiegeladene Kampagne für eine moderne Fitness-Marke',
    theme: 'Dynamisch und motivierend mit kraftvollen Bildern',
    colorPalette: [
      { hex: '#FF4500', rgb: [255, 69, 0], score: 0.40 },
      { hex: '#000000', rgb: [0, 0, 0], score: 0.35 },
      { hex: '#808080', rgb: [128, 128, 128], score: 0.20 },
      { hex: '#FF6347', rgb: [255, 99, 71], score: 0.05 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        label: 'Workout Energy',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        label: 'Gym Aesthetics',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        label: 'Training Motivation',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&q=80',
        label: 'Athletic Wear',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80',
        label: 'Healthy Lifestyle',
        section: 'mood'
      }
    ],
    notes: [
      { text: 'Farbpalette: Neon Orange, Schwarz, Grau', section: 'mood' },
      { text: 'Message: "Push Your Limits"', section: 'mood' },
      { text: 'Zielgruppe: 25-40 Jahre, urban, aktiv', section: 'details' }
    ],
    checklist: {
      title: 'Campaign-Planung',
      items: [
        'Influencer-Partnerschaften',
        'Content-Kalender',
        'Shooting-Locations',
        'Brand Guidelines'
      ]
    }
  },
  {
    title: 'Boutique Hotel Experience',
    welcomeText: 'Ein luxuriöses Boutique-Hotel mit einzigartigem Charakter',
    theme: 'Luxuriös und gemütlich mit handverlesenen Details',
    colorPalette: [
      { hex: '#F5F5DC', rgb: [245, 245, 220], score: 0.35 },
      { hex: '#8FBC8F', rgb: [143, 188, 143], score: 0.30 },
      { hex: '#DAA520', rgb: [218, 165, 32], score: 0.20 },
      { hex: '#FAEBD7', rgb: [250, 235, 215], score: 0.15 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
        label: 'Hotel Lobby',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        label: 'Suite Interior',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
        label: 'Bedroom Design',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        label: 'Amenities',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
        label: 'Breakfast Service',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Beige, Salbeigrün, Gold', section: 'mood' },
      { text: 'Stil: Scandinavian Luxury meets Local Charm', section: 'mood' },
      { text: 'USP: Personalisierter Service, lokale Kunstwerke', section: 'details' }
    ],
    checklist: {
      title: 'Hotel-Präsentation',
      items: [
        'Zimmer-Fotografie',
        'Guest Experience definieren',
        'Booking-Plattformen',
        'Welcome-Package gestalten'
      ]
    }
  },
  {
    title: 'Kunst-Ausstellung',
    welcomeText: 'Eine zeitgenössische Kunstausstellung mit immersiver Atmosphäre',
    theme: 'Kreativ und inspirierend mit künstlerischen Akzenten',
    colorPalette: [
      { hex: '#FFFFFF', rgb: [255, 255, 255], score: 0.50 },
      { hex: '#000000', rgb: [0, 0, 0], score: 0.30 },
      { hex: '#FF6B6B', rgb: [255, 107, 107], score: 0.10 },
      { hex: '#4ECDC4', rgb: [78, 205, 196], score: 0.10 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        label: 'Gallery Space',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
        label: 'Artwork Display',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80',
        label: 'Contemporary Art',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80',
        label: 'Exhibition Setup',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
        label: 'Art Installation',
        section: 'mood'
      }
    ],
    notes: [
      { text: 'Farbpalette: Weiß, Schwarz, Statement-Farben der Werke', section: 'mood' },
      { text: 'Konzept: Raum als Teil der Kunst', section: 'mood' },
      { text: 'Beleuchtung: Spotlights auf Kunstwerke', section: 'details' }
    ],
    checklist: {
      title: 'Ausstellungs-Planung',
      items: [
        'Kuratorisches Konzept',
        'Hängung planen',
        'Vernissage organisieren',
        'Katalog erstellen'
      ]
    }
  },
  {
    title: 'Music Festival',
    welcomeText: 'Ein energiegeladenes Musikfestival mit unvergesslicher Atmosphäre',
    theme: 'Lebendig und elektrisierend mit Festival-Vibes',
    colorPalette: [
      { hex: '#9B30FF', rgb: [155, 48, 255], score: 0.35 },
      { hex: '#FF1493', rgb: [255, 20, 147], score: 0.30 },
      { hex: '#FFFF00', rgb: [255, 255, 0], score: 0.20 },
      { hex: '#00CED1', rgb: [0, 206, 209], score: 0.15 }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        label: 'Festival Crowd',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        label: 'Stage Performance',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
        label: 'Light Show',
        section: 'details'
      },
      {
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
        label: 'Festival Atmosphere',
        section: 'mood'
      },
      {
        url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        label: 'Sound Equipment',
        section: 'details'
      }
    ],
    notes: [
      { text: 'Farbpalette: Purple, Pink, Electric Yellow', section: 'mood' },
      { text: 'Vibe: Euphoric, Community, Freedom', section: 'mood' },
      { text: 'Special: Multiple Stages, Art Installations', section: 'details' }
    ],
    checklist: {
      title: 'Festival-Organisation',
      items: [
        'Line-up bestätigen',
        'Stage Design',
        'Sicherheitskonzept',
        'Food & Beverage Vendors'
      ]
    }
  }
];

/**
 * Helper function to create a simple color palette image
 */
function createColorPaletteImage(colors: Color[]): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  const colorWidth = canvas.width / colors.length;
  
  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex;
    ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height);
  });
  
  return canvas.toDataURL('image/png');
}

/**
 * Main function to create all example boards
 */
export async function createExampleBoards() {
  console.log('🎨 Creating 10 example moodboards...');
  
  const createdBoards: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < EXAMPLE_BOARDS.length; i++) {
    const boardData = EXAMPLE_BOARDS[i];
    console.log(`\n📋 Creating board ${i + 1}/10: ${boardData.title}`);

    try {
      const boardId = nanoid();
      const now = Date.now();

      // Create the board
      const board: Board = {
        id: boardId,
        title: boardData.title,
        createdAt: now,
        updatedAt: now,
        welcomeText: boardData.welcomeText,
        brandingEnabled: true,
        customSections: [],
        layoutMode: 'masonry'
      };

      // Insert board into Supabase
      const { error: boardError } = await supabase.from('boards').insert({
        id: board.id,
        title: board.title,
        created_at: board.createdAt,
        updated_at: board.updatedAt,
        welcome_text: board.welcomeText,
        branding_enabled: board.brandingEnabled,
        custom_sections: board.customSections as any,
        layout_mode: board.layoutMode,
      });

      if (boardError) {
        throw new Error(`Board creation failed: ${boardError.message}`);
      }

      console.log(`  ✅ Board created: ${boardId}`);

      // Create image items
      let order = 0;
      
      // Add color palette as first item (if available)
      if ((boardData as any).colorPalette) {
        const colorPaletteId = nanoid();
        const colorPaletteItem: BoardItem = {
          id: colorPaletteId,
          boardId: boardId,
          type: 'image',
          section: 'mood',
          order: order++,
          createdAt: now,
          palette: (boardData as any).colorPalette as Color[],
          meta: {
            label: 'Farbpalette'
          }
        };

        // Create a simple color palette image data URL
        const paletteDataUrl = createColorPaletteImage((boardData as any).colorPalette);
        colorPaletteItem.src = paletteDataUrl;

        const { error: paletteError } = await supabase.from('board_items').insert({
          id: colorPaletteItem.id,
          board_id: colorPaletteItem.boardId,
          type: colorPaletteItem.type,
          section: colorPaletteItem.section,
          order: colorPaletteItem.order,
          created_at: colorPaletteItem.createdAt,
          src: colorPaletteItem.src,
          palette: colorPaletteItem.palette as any,
          meta: colorPaletteItem.meta as any
        });

        if (paletteError) {
          console.error(`    ⚠️ Color palette item failed: ${paletteError.message}`);
        } else {
          console.log(`  ✅ Added color palette`);
        }
      }
      
      for (const img of boardData.images) {
        const itemId = nanoid();
        const item: BoardItem = {
          id: itemId,
          boardId: boardId,
          type: 'image',
          section: img.section,
          order: order++,
          createdAt: now,
          src: img.url,
          meta: {
            label: img.label
          }
        };

        const { error: itemError } = await supabase.from('board_items').insert({
          id: item.id,
          board_id: item.boardId,
          type: item.type,
          section: item.section,
          order: item.order,
          created_at: item.createdAt,
          src: item.src,
          meta: item.meta as any
        });

        if (itemError) {
          console.error(`    ⚠️ Image item failed: ${itemError.message}`);
        }
      }
      console.log(`  ✅ Added ${boardData.images.length} images`);

      // Create note items
      for (const note of boardData.notes) {
        const itemId = nanoid();
        const item: BoardItem = {
          id: itemId,
          boardId: boardId,
          type: 'note',
          section: note.section,
          order: order++,
          createdAt: now,
          text: note.text
        };

        const { error: itemError } = await supabase.from('board_items').insert({
          id: item.id,
          board_id: item.boardId,
          type: item.type,
          section: item.section,
          order: item.order,
          created_at: item.createdAt,
          text: item.text
        });

        if (itemError) {
          console.error(`    ⚠️ Note item failed: ${itemError.message}`);
        }
      }
      console.log(`  ✅ Added ${boardData.notes.length} notes`);

      // Create checklist item
      const checklistId = nanoid();
      const checklistItem: BoardItem = {
        id: checklistId,
        boardId: boardId,
        type: 'checklist',
        section: 'general',
        order: order++,
        createdAt: now,
        checklistItems: boardData.checklist.items.map((text, idx) => ({
          id: nanoid(),
          text,
          checked: false,
          order: idx
        }))
      };

      const { error: checklistError } = await supabase.from('board_items').insert({
        id: checklistItem.id,
        board_id: checklistItem.boardId,
        type: checklistItem.type,
        section: checklistItem.section,
        order: checklistItem.order,
        created_at: checklistItem.createdAt,
        checklist_items: checklistItem.checklistItems as any
      });

      if (checklistError) {
        console.error(`    ⚠️ Checklist failed: ${checklistError.message}`);
      } else {
        console.log(`  ✅ Added checklist with ${boardData.checklist.items.length} items`);
      }

      createdBoards.push(boardId);
      successCount++;
      console.log(`  🎉 Board "${boardData.title}" completed!`);

    } catch (error: any) {
      console.error(`  ❌ Error creating board: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`  ✅ Successfully created: ${successCount} boards`);
  console.log(`  ❌ Failed: ${errorCount} boards`);
  console.log('\n🎨 Created Board IDs:');
  createdBoards.forEach((id, idx) => {
    console.log(`  ${idx + 1}. ${EXAMPLE_BOARDS[idx].title}`);
    console.log(`     ID: ${id}`);
    console.log(`     URL: ${window.location.origin}/#/board/${id}`);
  });
  console.log('='.repeat(60));

  return createdBoards;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).createExampleBoards = createExampleBoards;
}


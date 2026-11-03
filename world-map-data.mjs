// Presentación visual a partir del mapa aportado por el propietario.
// Las biografías regionales pendientes no se completan por inferencia.
export const mapArtwork = 'assets/archilium-mapa-reino.png';
export const regions = [
  {
    id: 'bocus', name: 'Laderas de Bocus', shortName: 'Bocus',
    motto: 'Forja · Tradición · Fortaleza', theme: 'embers', color: '#f4a36b',
    heading: 'Donde el fuego\ntoma forma.',
    summary: 'Montañas volcánicas, ríos de lava y fortalezas de piedra. Bocus lleva el estandarte de la forja.',
    shape: 'M0 185 L80 124 L225 130 L320 115 L480 125 L535 175 L570 235 L555 300 L590 360 L530 440 L480 505 L430 555 L475 600 L435 637 L320 678 L200 625 L130 628 L70 580 L0 565 Z',
    camera: { x: 331, y: 381, scale: 2.35 },
    landscape: { src: 'assets/bocus-paisaje-concepto.png', position: '43% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/bocus-habitantes-trio.png', width: 1448, height: 1086, alt: 'Ilustración aportada de los habitantes de Bocus: un minero con pico y farol, un herrero con martillo y un mago con báculo', roles: ['Minero', 'Herrero', 'Mago'], caption: 'Habitantes de Bocus · Conceptos visuales', peopleHeading: 'Los rostros de la forja' },
    music: { id: 'chiron', src: 'assets/forge-of-chiron.mp3', name: 'Forge of Chiron', context: 'Laderas de Bocus' },
    places: [
      { name: 'Bocus', kind: 'Ciudad', text: 'Arquitectura de piedra entre las laderas y los cauces de lava.' },
      { name: 'Minas de Chiron', kind: 'Minas', text: 'Un enclave minero dibujado entre las montañas occidentales.' },
      { name: 'Brukar', kind: 'Enclave', text: 'Torres oscuras y construcciones al pie de las montañas.' },
      { name: 'Túmulos de Kazar', kind: 'Paraje', text: 'El nombre que señala las alturas volcánicas del mapa.' },
      { name: 'Templo de Vex', kind: 'Templo', text: 'Una silueta iluminada por el fuego en el extremo de las laderas.' }
    ],
    life: 'Forja, tradición y fortaleza son las tres palabras de su estandarte. Las minas, la piedra y el fuego construyen la identidad visual de esta región. Los talleres, sus oficios y las historias de sus habitantes están en desarrollo.',
    residents: [], residentsNote: 'Un minero, un herrero y un mago dan rostro a esta presentación de Bocus. Sus nombres, vínculos e historias están en desarrollo.'
  },
  {
    id: 'velan', name: 'Ladera Velan', shortName: 'Velan',
    motto: 'Honor · Corona · Unidad', theme: 'snow', color: '#c0d8ee',
    heading: 'Bajo el estandarte\nde la corona.',
    summary: 'Una ciudad amurallada, un castillo y las cumbres nevadas. El estandarte de Velan reúne honor, corona y unidad.',
    shape: 'M480 125 L525 70 L605 0 L1190 0 L1230 90 L1210 175 L1180 240 L1120 300 L1040 326 L1000 340 L920 315 L745 325 L640 285 L580 290 L570 235 L535 175 Z',
    camera: { x: 877, y: 220, scale: 2.25 }, music: null,
    landscape: { src: 'assets/velan-castillo-paisaje.png', position: '36% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/velan-faccion-trio.png', width: 1536, height: 1024, alt: 'Facción de Velan aportada: una figura de pelo claro con capa, una figura coronada con espada y una figura acorazada con lanza y escudo; tonos blancos, azules y dorados', roles: ['Capa', 'Corona', 'Escudo'], caption: 'Facción de Velan · Conceptos visuales', peopleHeading: 'La facción de Velan' },
    places: [
      { name: 'Ciudad de Velan', kind: 'Ciudad', text: 'Murallas, tejados y caminos al pie del castillo.' },
      { name: 'Castillo de Velan', kind: 'Castillo', text: 'Las torres que dominan el paisaje de la ladera.' },
      { name: 'Templo de Fey', kind: 'Templo', text: 'Un santuario entre las montañas y la vegetación del mapa.' }
    ],
    life: 'Honor, corona y unidad identifican a Velan en el mapa. Su ciudad, sus murallas y su castillo componen esta primera mirada a la región. La vida cotidiana y sus oficios están en desarrollo.',
    residents: [], residentsNote: 'La facción de Velan reúne estas tres figuras en su presentación. Sus nombres, vínculos e historias están en desarrollo.'
  },
  {
    id: 'umen', name: 'Llanura Umen', shortName: 'Umen',
    motto: 'Comercio · Encuentro · Prosperidad', theme: 'pollen', color: '#e6c56f',
    heading: 'Caminos que\nse encuentran.',
    summary: 'Argentia, la ciudad mercantil, entre campos dorados, ríos y puentes. Un punto de encuentro en el corazón de Llanura Umen.',
    shape: 'M590 360 L580 290 L640 285 L745 325 L920 315 L1000 340 L1040 326 L1120 300 L1210 345 L1270 480 L1275 540 L1170 640 L1060 665 L890 625 L760 645 L640 605 L535 645 L435 637 L475 600 L430 555 L480 505 L530 440 Z',
    camera: { x: 846, y: 481, scale: 2.0 }, music: null,
    landscape: { src: 'assets/argentia-ciudad-mercantil.png', position: '18% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/argentia-mercantiles-trio.png', width: 1536, height: 1024, alt: 'Trío de mercantiles de Argentia aportado: una figura con balanza y libro, otra con monedas y otra con cuernos, farol y mercancías; vestimenta verde y dorada', roles: ['Balanza', 'Monedas', 'Mercancías'], caption: 'Mercantiles de Argentia · Conceptos visuales', peopleHeading: 'Los rostros del comercio' },
    places: [
      { name: 'Argentia', kind: 'Ciudad mercantil', text: 'La gran ciudad que ocupa el centro de los campos y caminos.' },
      { name: 'Ruvis', kind: 'Localidad', text: 'Tejados y caminos junto a las laderas occidentales.' },
      { name: 'Mardom', kind: 'Localidad', text: 'Un enclave al este de los campos de Argentia.' },
      { name: 'Polenia', kind: 'Localidad', text: 'Construcciones junto a los campos y al río.' },
      { name: 'Remo', kind: 'Localidad', text: 'Un punto del mapa entre caminos y tierras de cultivo.' }
    ],
    life: 'Comercio, encuentro y prosperidad aparecen en el estandarte de Umen. Los campos y las rutas que muestra el mapa invitan a explorar ese carácter de lugar de paso. Sus mercados, oficios y comunidades están en desarrollo.',
    residents: [], residentsNote: 'Los mercantiles de Argentia dan rostro al comercio de esta presentación. Sus nombres, vínculos e historias están en desarrollo.'
  },
  {
    id: 'argor', name: 'Península de Argor', shortName: 'Argor',
    motto: 'Tierra · Vida · Hogar', theme: 'leaves', color: '#b8c782',
    heading: 'Toda historia\nempieza en casa.',
    summary: 'Pueblos, molinos, campos y costa. Entre los nombres de Argor está Kelus, el lugar del que procede Kalys.',
    shape: 'M435 665 L535 645 L640 605 L760 645 L890 625 L1060 665 L1170 640 L1320 710 L1410 815 L1380 900 L1180 920 L970 941 L770 941 L560 910 L380 880 L320 845 L360 740 Z M25 730 L70 665 L185 665 L280 745 L300 830 L230 880 L70 865 Z',
    camera: { x: 848, y: 737, scale: 1.8 }, music: null,
    places: [
      { name: 'Kelus', kind: 'Pueblo de Kalys', text: 'El lugar de procedencia del protagonista de Archilium.' },
      { name: 'Villa Brisa', kind: 'Localidad', text: 'Un conjunto de casas entre campos y caminos.' },
      { name: 'Brumia', kind: 'Localidad', text: 'Tejados rojizos en la costa de la península.' },
      { name: 'Alstem', kind: 'Localidad', text: 'Un enclave entre molinos y tierras de cultivo.' },
      { name: 'Prunia', kind: 'Localidad', text: 'Casas y caminos próximos al puerto del mapa.' },
      { name: 'Templo de Kyr', kind: 'Templo del mapa', text: 'El santuario representado frente a la costa occidental.' }
    ],
    life: 'Tierra, vida y hogar son las palabras que acompañan a Argor. Los cultivos, los molinos, los pueblos y la costa forman su paisaje. Kalys es un joven campesino de Kelus; las demás comunidades y oficios de la península están en desarrollo.',
    residents: [
      { id: 'kalys', name: 'Kalys', role: 'Joven campesino de Kelus · Protagonista' },
      { id: 'cortus', name: 'Cortus', role: 'Padre de Kalys · El hogar en Kelus' },
      { id: 'maris', name: 'Maris', role: 'Madre de Kalys · El hogar en Kelus' }
    ],
    residentsNote: 'Conoce a Kalys y a su familia en las fichas del compendio. Las historias del resto de la península están en desarrollo.'
  },
  {
    id: 'lunia', name: 'Valle Lunia', shortName: 'Lunia',
    motto: 'Magia · Sabiduría · Armonía', theme: 'arcane', color: '#c6a2f3',
    heading: 'Sigue el curso\nde lo extraordinario.',
    summary: 'La Academia domina un valle de jardines, puentes y cascadas. Al fondo, un pueblo entre las laderas de Lunia.',
    shape: 'M1230 0 L1672 0 L1672 738 L1550 754 L1410 710 L1320 660 L1275 540 L1270 480 L1210 345 L1120 300 L1180 240 L1210 175 L1230 90 Z',
    camera: { x: 1398, y: 358, scale: 2.5 }, music: null,
    landscape: { src: 'assets/lunia-academia-paisaje.png', position: '40% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/lunia-habitantes-trio.png', width: 1312, height: 1199, alt: 'Trío de habitantes de Lunia aportado: una figura con varita luminosa, una figura de pelo blanco con cristales azules y una figura leyendo un libro; vestiduras violetas, blancas y doradas', roles: ['Varita', 'Cristales', 'Libro'], caption: 'Habitantes de Lunia · Conceptos visuales', peopleHeading: 'Los rostros de Lunia' },
    places: [
      { name: 'Ciudad de Lunia', kind: 'Ciudad', text: 'Torres claras rodeadas por agua y vegetación.' },
      { name: 'Academia de Lunia', kind: 'Academia', text: 'Una de las grandes siluetas que señala el mapa del valle.' },
      { name: 'Abadía de Lunia', kind: 'Abadía', text: 'Construcciones luminosas sobre el paisaje oriental.' },
      { name: 'Villa Aethis', kind: 'Localidad', text: 'Un enclave entre jardines, agua y caminos.' },
      { name: 'Templo de Uma', kind: 'Templo', text: 'El santuario situado en el extremo de las cascadas del mapa.' }
    ],
    life: 'Magia, sabiduría y armonía dan identidad a Lunia en el mapa. La academia, la abadía y los jardines dibujan su presentación visual. Sus estudios, oficios y formas de vida están en desarrollo; las afinidades mágicas de sus habitantes aún no se han anunciado.',
    residents: [], residentsNote: 'Las figuras de Lunia dan rostro a esta presentación de la Academia. Sus nombres, vínculos e historias están en desarrollo.'
  }
];

export const getRegion = id => regions.find(region => region.id === id);

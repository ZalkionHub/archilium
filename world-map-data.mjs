// Presentación visual a partir del mapa aportado por el propietario.
// Las biografías regionales pendientes no se completan por inferencia.
export const mapArtwork = 'assets/archilium-mapa-reino-furgan.png';
export const regions = [
  {
    id: 'bocus', name: 'Laderas de Bocus', shortName: 'Bocus',
    motto: 'Forja · Tradición · Fortaleza', theme: 'embers', color: '#f4a36b',
    heading: 'Donde el fuego\ntoma forma.',
    summary: 'Montañas volcánicas, ríos de lava y fortalezas de piedra. Bocus lleva el estandarte de la forja.',
    shape: 'M0 170 L70 126 L215 126 L320 109 L470 128 L530 178 L555 260 L540 330 L577 385 L535 443 L475 485 L418 530 L437 585 L407 631 L300 660 L190 626 L112 618 L60 572 L0 558 Z',
    camera: { x: 320, y: 376, scale: 2.35 },
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
    shape: 'M470 128 L520 76 L575 0 L1290 0 L1330 68 L1300 148 L1246 180 L1200 235 L1128 269 L1046 296 L951 285 L812 292 L689 267 L600 291 L555 260 L530 178 Z',
    camera: { x: 900, y: 207, scale: 2.25 },
    music: { id: 'velan', src: 'assets/ladera-velan.mp3', name: 'Ladera Velan', context: 'Ladera Velan' },
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
    shape: 'M577 385 L540 330 L555 260 L600 291 L689 267 L812 292 L951 285 L1046 296 L1128 269 L1179 359 L1214 411 L1298 410 L1286 480 L1246 540 L1275 609 L1180 632 L1108 663 L987 628 L874 611 L760 625 L641 592 L544 617 L407 631 L437 585 L418 530 L475 485 L535 443 Z',
    camera: { x: 815, y: 467, scale: 2.0 },
    music: { id: 'umen', src: 'assets/llanura-umen.mp3', name: 'Llanura Umen', context: 'Llanura Umen' },
    landscape: { src: 'assets/argentia-ciudad-mercantil.png', position: '18% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/argentia-mercantiles-trio.png', width: 1536, height: 1024, alt: 'Trío de mercantiles de Argentia aportado: una figura con balanza y libro, otra con monedas y otra con cuernos, farol y mercancías; vestimenta verde y dorada', roles: ['Balanza', 'Monedas', 'Mercancías'], caption: 'Mercantiles de Argentia · Conceptos visuales', peopleHeading: 'Los rostros del comercio' },
    places: [
      { name: 'Argentia', kind: 'Ciudad mercantil', text: 'La gran ciudad que ocupa el centro de los campos y caminos.' },
      { name: 'Ruvis', kind: 'Localidad', text: 'Tejados y caminos junto a las laderas occidentales.' },
      { name: 'Mardom', kind: 'Localidad', text: 'Un enclave al este de los campos de Argentia.' },
      { name: 'Polenia', kind: 'Localidad', text: 'Construcciones junto a los campos y al río.' },
      { name: 'Remo', kind: 'Localidad', text: 'Un punto del mapa entre caminos y tierras de cultivo.' },
      { name: 'Puente Thorin', kind: 'Puente', text: 'El gran puente de piedra que señala el camino hacia el pantano.' }
    ],
    life: 'Comercio, encuentro y prosperidad aparecen en el estandarte de Umen. Los campos y las rutas que muestra el mapa invitan a explorar ese carácter de lugar de paso. Sus mercados, oficios y comunidades están en desarrollo.',
    residents: [], residentsNote: 'Los mercantiles de Argentia dan rostro al comercio de esta presentación. Sus nombres, vínculos e historias están en desarrollo.'
  },
  {
    id: 'argor', name: 'Península de Argor', shortName: 'Argor',
    motto: 'Tierra · Vida · Hogar', theme: 'leaves', color: '#b8c782',
    heading: 'Toda historia\nempieza en casa.',
    summary: 'Pueblos, molinos, campos y costa. Entre los nombres de Argor está Kelus, el lugar del que procede Kalys.',
    shape: 'M407 631 L544 617 L641 592 L760 625 L874 611 L987 628 L1108 663 L1180 632 L1220 713 L1180 804 L1152 874 L1040 903 L906 912 L760 899 L608 914 L480 870 L364 848 L323 797 L358 727 Z M16 715 L60 662 L185 654 L278 733 L305 817 L249 872 L90 865 L35 810 Z',
    camera: { x: 790, y: 746, scale: 1.8 }, music: null,
    landscape: { src: 'assets/argor-campos-paisaje.png', position: '35% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/argor-campesinos-trio.png', width: 1536, height: 1024, alt: 'Trío campesino de Argor aportado: una figura con cesta de hortalizas, otra con pala y otra con cuernos sosteniendo espigas; ropa de trabajo en tonos tierra', roles: ['Huerto', 'Tierra', 'Cosecha'], caption: 'Vida campesina de Argor · Conceptos visuales', peopleHeading: 'Gentes del campo' },
    places: [
      { name: 'Kelus', kind: 'Pueblo de Kalys', text: 'El lugar de procedencia del protagonista de Archilium.' },
      { name: 'Villa Brisa', kind: 'Localidad', text: 'Un conjunto de casas entre campos y caminos.' },
      { name: 'Brumia', kind: 'Localidad', text: 'Tejados rojizos en la costa de la península.' },
      { name: 'Alstem', kind: 'Localidad', text: 'Un enclave entre molinos y tierras de cultivo.' },
      { name: 'Prunia', kind: 'Localidad', text: 'Casas y caminos próximos al puerto del atlas anterior.', onMap: false },
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
    summary: 'La Academia y la Ciudad de Lunia se alzan entre jardines y laderas verdes, al noreste del reino.',
    shape: 'M1290 0 L1672 0 L1672 425 L1580 444 L1484 419 L1380 441 L1298 410 L1214 411 L1179 359 L1128 269 L1200 235 L1246 180 L1300 148 L1330 68 Z',
    camera: { x: 1403, y: 283, scale: 2.5 },
    music: { id: 'lunia', src: 'assets/cancion-lunia.mp3', name: 'Canción de Lunia', context: 'Valle Lunia' },
    landscape: { id: 'academia', label: 'Academia de Lunia', src: 'assets/lunia-academia-paisaje.png', position: '40% center', width: 1672, height: 941 },
    landscapeSlides: [
      { id: 'estudio', label: 'Sala de estudio', src: 'assets/lunia-sala-estudio.png', position: '48% center', width: 1672, height: 941 },
      { id: 'abadia', label: 'Abadía de Lunia', src: 'assets/lunia-abadia-paisaje.png', position: '56% center', width: 1672, height: 941 }
    ],
    inhabitantsArt: { src: 'assets/lunia-habitantes-trio.png', width: 1312, height: 1199, alt: 'Trío de habitantes de Lunia aportado: una figura con varita luminosa, una figura de pelo blanco con cristales azules y una figura leyendo un libro; vestiduras violetas, blancas y doradas', roles: ['Varita', 'Cristales', 'Libro'], caption: 'Habitantes de Lunia · Conceptos visuales', peopleHeading: 'Los rostros de Lunia' },
    places: [
      { name: 'Ciudad de Lunia', kind: 'Ciudad', text: 'Torres claras rodeadas por agua y vegetación.' },
      { name: 'Academia de Lunia', kind: 'Academia', text: 'Una de las grandes siluetas que señala el mapa del valle.' },
      { name: 'Abadía de Lunia', kind: 'Abadía', text: 'La Abadía también forma parte de los paisajes de Lunia.', onMap: false },
      { name: 'Villa Aethis', kind: 'Localidad', text: 'Un enclave del atlas anterior entre jardines, agua y caminos.', onMap: false },
      { name: 'Templo de Uma', kind: 'Templo', text: 'El santuario representado junto a las cascadas en el atlas anterior.', onMap: false }
    ],
    life: 'Magia, sabiduría y armonía dan identidad a Lunia en el mapa. La academia, la abadía y los jardines dibujan su presentación visual. Sus estudios, oficios y formas de vida están en desarrollo; las afinidades mágicas de sus habitantes aún no se han anunciado.',
    residents: [], residentsNote: 'Las figuras de Lunia dan rostro a esta presentación de la Academia. Sus nombres, vínculos e historias están en desarrollo.'
  },
  {
    id: 'furgan', name: 'Pantano Furgan', shortName: 'Furgan',
    motto: 'Territorio Uku', theme: 'fireflies', color: '#b1cf87',
    heading: 'Al ritmo\ndel pantano.',
    summary: 'El territorio Uku, entre aldeas sobre pilotes y pasarelas. Aquí viven las tribus reptilianas, cuyo rey es Khylura.',
    shape: 'M1298 410 L1380 441 L1484 419 L1580 444 L1672 425 L1672 729 L1598 757 L1568 795 L1485 838 L1392 879 L1281 839 L1204 810 L1220 713 L1180 632 L1275 609 L1246 540 L1286 480 Z',
    camera: { x: 1460, y: 651, scale: 2.4 }, music: null,
    landscape: { src: 'assets/furgan-pantano-paisaje.png', position: '51% center', width: 1672, height: 941 },
    inhabitantsArt: { src: 'assets/furgan-habitantes-trio.png', width: 1536, height: 1024, alt: 'Tres reptilianos de Furgan: una artesana con vasija a la izquierda, una representante de la tribu con manto verde y bastón en el centro, y un recolector con cesta de plantas a la derecha', roles: ['Artesana', 'Representante', 'Recolector'], caption: 'Habitantes de Furgan · Conceptos visuales', peopleHeading: 'Las tribus del pantano' },
    leader: { id: 'khylura', name: 'Khylura', role: 'Rey de las tribus' },
    places: [
      { name: 'Aldea Claveral', kind: 'Aldea', text: 'Casas y plataformas entre la vegetación de la parte norte del pantano.' },
      { name: 'Aldea Luso', kind: 'Aldea', text: 'Un poblado de madera junto al agua y las pasarelas.' },
      { name: 'Aldea Vess', kind: 'Aldea', text: 'Construcciones sobre pilotes en el sector meridional del pantano.' }
    ],
    life: 'Las tribus reptilianas habitan Furgan. Una artesana, un recolector y una representante de la tribu dan rostro a su vida cotidiana. Barro, fibras vegetales, cestas y pasarelas de madera forman su presentación visual. Sus historias están en desarrollo.',
    residents: [], residentsNote: 'Khylura es el rey de las tribus. Los nombres y las historias de la artesana, el recolector y la representante están en desarrollo.'
  }
];

export const getRegion = id => regions.find(region => region.id === id);

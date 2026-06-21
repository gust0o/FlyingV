const people = [
  { name: "Giulius", aliases: ["Giulius", "Bibubibi", "Andrea"], infinite: true },
  {
    name: "Gusto",
    aliases: ["Gusto", "Gustavo", "Gepo", "Glep", "El Pequeño"],
    infinite: true,
    monacoTrip: {
      departureTime: "2026-06-27T11:00",
      revealTime: "2026-06-27T20:00",
      returnDate: "2026-06-30",
    },
  },
  {
    name: "Esse",
    aliases: [
      "Esse",
      "Cyphercode",
      "C1pherc0de",
      "Cyph3rc0de",
      "C1pherCode",
      "CypherC0d3",
      "C\u00a5phercode",
      "Giacoooooo",
      "Il Messia",
    ],
    infinite: true,
  },
  { name: "Ciccio", aliases: ["Ciccio", "Alcuni Gufi", "De Rose", "Millepose"], arrivalDate: "2026-08-08" },
  {
    name: "Nardo",
    aliases: ["Nardo", "Nardellone", "Nardolino", "Doremirko", "Paolo", "Pablo Antonio", "Paolo A."],
    julyVisit: {
      arrivalRange: ["2026-07-10", "2026-07-11"],
      departureDate: "2026-07-13",
      intervalMs: 7800,
    },
    arrivalDate: "2026-08-02",
    departureDate: "2026-08-20",
    departureVarianceDays: 3,
  },
  {
    name: "Rocco",
    aliases: [
      "Rocco",
      "Rocco Maria",
      "Stefano Nazzi",
      "Enrica Riera",
      "Pellicano",
      "Pellimagico",
      "Dejavio",
      "Dario Amodei",
      "Agent AI",
      "Botte Donato",
      "Alien raudo",
      "Rudy Giuliani",
      "Patriota",
      "Latte Materno",
      "Grosseto",
      "Puttanaaaaaaaaaaaaaaaaaa",
      "John Thernus",
      "DDL ZEN",
    ],
    arrivalRange: ["2026-07-03", "2026-07-04"],
    stayDays: 10,
    minIntervalMs: 500,
    maxIntervalMs: 3000,
    shockMs: 260,
  },
  { name: "Jarbo", aliases: ["Jarbo", "Jarbolone", "Gobu", "Giambadabro"], randomSymbol: true },
  {
    name: "Rattolino",
    aliases: ["Federico", "Piaz", "Topo", "Topastro", "Muride", "Rattolino"],
    julyVisit: {
      arrivalRange: ["2026-07-10", "2026-07-11"],
      departureDate: "2026-07-13",
      intervalMs: 7800,
    },
    hauntedDate: "2026-08-15",
    hauntedVarianceDays: 6,
    hauntedIntervalMs: 7800,
  },
  // Add real arrivals like this:
  // { name: "nome", arrivalDate: "2026-08-10" },
  // If a non-random person leaves with no return date yet, add returnUnknown: true.
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const STRANGE_SYMBOLS = [
  "𐦝",
  "𐃡",
  "𐎧",
  "𐐝",
  "𐑀𐒻",
  "𐒾𐒿",
  "𐙼",
  "𐙅",
  "𐡌",
  "𐡊",
  "𐤊",
  "𐦂",
  "𐦉𐧵",
  "𐮉",
  "𐲖",
  "𐴍𑅄",
  "ਔ",
  "Ꮘ",
  "Ꮔ",
  "𐊃",
  "𐊄𐦞𐦆",
];
const MAGIC_DOG_NAMES = [
  "El Pequeño",
  "Dejavio",
  "Bibubibi",
  "Doremirko",
  "Gobu",
  "Alcuni Gufi",
  "Rattolino",
  "Giacoooooo",
];
const MAGIC_DOG_NAME_BY_PERSON = {
  Ciccio: "Alcuni Gufi",
  Esse: "Giacoooooo",
  Giulius: "Bibubibi",
  Gusto: "El Pequeño",
  Jarbo: "Gobu",
  Nardo: "Doremirko",
  Rattolino: "Rattolino",
  Rocco: "Dejavio",
};
const MAGIC_DOG_CHANCE = 40;
const PC_HOME_CHANCE = 30;
const ASSET_VERSION = "20260621-2031";
const OVERFLOW_ALIAS = "Puttanaaaaaaaaaaaaaaaaaa";
const OVERFLOW_ALIAS_CORE = "Puttana";
const OVERFLOW_ALIAS_INTRO = "alza il finestrino";
const OVERFLOW_ALIAS_WARNING = "Alza il finestrino! Alza il Finestrino!";
const COVERAGE_WATCH_ALIASES = new Set([OVERFLOW_ALIAS, "Giacoooooo"]);
const HOME_NUMBER = "\u221e";
const UNKNOWN_RETURN_NUMBER = "\u2026";
const TRAVEL_ERROR_NUMBER = "\uFFFD";

const list = document.querySelector("#countdown-list");
const root = document.documentElement;
let resizeFrame = 0;
let coverageFrame = 0;
const HAUNTED_CANVAS_WIDTH = 420;
const HAUNTED_CANVAS_HEIGHT = 260;
const HAUNTED_PARTICLE_COUNT = 2200;
const HAUNTED_FADE_MS = 5000;
const HAUNTED_CENTER_X = HAUNTED_CANVAS_WIDTH * 0.56;
const HAUNTED_TARGET_RIGHT = HAUNTED_CANVAS_WIDTH - 98;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInt(0, index);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getDisplayName(person) {
  return person.aliases[getRandomInt(0, person.aliases.length - 1)];
}

function shouldForceMagicDog() {
  return getRandomInt(1, MAGIC_DOG_CHANCE) === MAGIC_DOG_CHANCE;
}

function getMagicDogDisplayName(person, forceMagicDog) {
  if (forceMagicDog) {
    return MAGIC_DOG_NAME_BY_PERSON[person.name];
  }

  return getDisplayName(person);
}

function hasOverflowAlias(person, displayName) {
  return person.name === "Rocco" && displayName === OVERFLOW_ALIAS;
}

function getFitName(person, displayName) {
  return hasOverflowAlias(person, displayName) ? OVERFLOW_ALIAS_CORE : displayName;
}

function shouldWatchNameCoverage(displayName) {
  return COVERAGE_WATCH_ALIASES.has(displayName);
}

function renderOverflowAlias(nameElement, displayName) {
  nameElement.replaceChildren();
  nameElement.classList.add("name--overflow");
  nameElement.dataset.sequenceStage = "shout";

  displayName.split("").forEach((letter, index) => {
    const character = document.createElement("span");
    const intensity = index / Math.max(1, displayName.length - 1);
    const jitter = ((index * 37) % 17) / 16;
    const speed = 0.088 + jitter * 0.07 + (1 - intensity) * 0.026;
    const lift = 0.18 + intensity * 2.35 + jitter * 0.42;

    character.className = "name-overflow-char";
    character.textContent = letter;
    character.style.setProperty("--char-shake", intensity.toFixed(3));
    character.style.setProperty("--char-delay", `${(-index * 0.019 - jitter * 0.11).toFixed(3)}s`);
    character.style.setProperty("--char-angle", `${(intensity * 4.6 + jitter * 0.8).toFixed(3)}deg`);
    character.style.setProperty("--char-speed", `${speed.toFixed(3)}s`);
    character.style.setProperty("--char-lift", lift.toFixed(3));
    nameElement.append(character);
  });

  scheduleNameCoverageUpdate();
}

function renderOverflowSequence(nameElement, displayName) {
  nameElement.dataset.sequenceStage = "intro";
  nameElement.textContent = OVERFLOW_ALIAS_INTRO;

  window.setTimeout(() => {
    nameElement.dataset.sequenceStage = "warning";
    nameElement.textContent = OVERFLOW_ALIAS_WARNING;
    scheduleNameCoverageUpdate();
  }, 1000);

  window.setTimeout(() => {
    renderOverflowAlias(nameElement, displayName);
  }, 3000);
}

function renderDisplayName(nameElement, person, displayName) {
  nameElement.dataset.fullName = displayName;

  if (person.name === "Nardo" && displayName === "Paolo") {
    nameElement.classList.add("name--small-paolo");
  }

  if (shouldWatchNameCoverage(displayName)) {
    nameElement.classList.add("name--coverage-watch");
  }

  if (hasOverflowAlias(person, displayName)) {
    renderOverflowSequence(nameElement, displayName);
    return;
  }

  nameElement.textContent = displayName;
}

function formatMissingDays(days) {
  return `-${Math.abs(days)}`;
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseLocalDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function getDaysUntil(dateString, now = new Date()) {
  const today = startOfLocalDay(now);
  const target = startOfLocalDay(parseLocalDate(dateString));
  return Math.max(0, Math.ceil((target - today) / MS_PER_DAY));
}

function hasArrived(person) {
  return Boolean(person.arrivalDate) && getDaysUntil(person.arrivalDate) === 0;
}

function hasHauntedArrival(person) {
  return Boolean(person.hauntedDate || person.hauntedRange);
}

function hasHauntedSchedule(person) {
  return Boolean(person.julyVisit || hasHauntedArrival(person));
}

function hasActiveJulyVisit(person, now = new Date()) {
  if (!person.julyVisit) {
    return false;
  }

  const today = startOfLocalDay(now);
  const departure = startOfLocalDay(parseLocalDate(person.julyVisit.departureDate));
  return today < departure;
}

function getJulyVisitArrivalDate(person) {
  if (!person.runtimeJulyVisitArrivalDate) {
    const { arrivalRange } = person.julyVisit;
    person.runtimeJulyVisitArrivalDate = arrivalRange[getRandomInt(0, arrivalRange.length - 1)];
  }

  return person.runtimeJulyVisitArrivalDate;
}

function toggleJulyVisitArrivalDate(person) {
  const { arrivalRange } = person.julyVisit;
  const currentIndex = arrivalRange.indexOf(person.runtimeJulyVisitArrivalDate);
  const nextIndex = currentIndex < 0
    ? getRandomInt(0, arrivalRange.length - 1)
    : (currentIndex + 1) % arrivalRange.length;
  person.runtimeJulyVisitArrivalDate = arrivalRange[nextIndex];
  return person.runtimeJulyVisitArrivalDate;
}

function getJulyVisitNumber(person, now = new Date()) {
  const arrivalDate = getJulyVisitArrivalDate(person);

  if (getDaysUntil(arrivalDate, now) > 0) {
    return formatMissingDays(getDaysUntil(arrivalDate, now));
  }

  return HOME_NUMBER;
}

function getHauntedArrivalDate(person) {
  if (!person.runtimeArrivalDate) {
    let date;

    if (person.hauntedRange) {
      const start = parseLocalDate(person.hauntedRange[0]);
      const end = parseLocalDate(person.hauntedRange[1]);
      const rangeDays = Math.round((end - start) / MS_PER_DAY);
      date = new Date(start);
      date.setDate(date.getDate() + getRandomInt(0, rangeDays));
    } else {
      date = parseLocalDate(person.hauntedDate);
      const offset = getRandomInt(-person.hauntedVarianceDays, person.hauntedVarianceDays);
      date.setDate(date.getDate() + offset);
    }

    person.runtimeArrivalDate = formatLocalDate(date);
  }

  return person.runtimeArrivalDate;
}

function resetHauntedArrivalDate(person) {
  person.runtimeArrivalDate = "";
  return getHauntedArrivalDate(person);
}

function getMonacoTripNumber(person, now = new Date()) {
  const { departureTime, revealTime, returnDate } = person.monacoTrip;
  const departure = parseLocalDateTime(departureTime);
  const reveal = parseLocalDateTime(revealTime);
  const returnStart = startOfLocalDay(parseLocalDate(returnDate));

  if (now < departure) {
    return HOME_NUMBER;
  }

  if (now < reveal) {
    return TRAVEL_ERROR_NUMBER;
  }

  if (now < returnStart) {
    return formatMissingDays(getDaysUntil(returnDate, now));
  }

  return HOME_NUMBER;
}

function isMonacoTripMystery(person, visibleNumber) {
  return Boolean(person.monacoTrip) && visibleNumber === TRAVEL_ERROR_NUMBER;
}

function getDepartureDate(person) {
  if (!person.runtimeDepartureDate) {
    const date = parseLocalDate(person.departureDate);
    const variance = person.departureVarianceDays || 0;
    date.setDate(date.getDate() + getRandomInt(-variance, variance));
    person.runtimeDepartureDate = formatLocalDate(date);
  }

  return person.runtimeDepartureDate;
}

function getTemporaryStayNumber(person, now = new Date()) {
  if (getDaysUntil(person.arrivalDate, now) > 0) {
    return formatMissingDays(getDaysUntil(person.arrivalDate, now));
  }

  const today = startOfLocalDay(now);
  const departure = startOfLocalDay(parseLocalDate(getDepartureDate(person)));
  return today < departure ? HOME_NUMBER : UNKNOWN_RETURN_NUMBER;
}

function getRangedArrivalDate(person) {
  if (!person.runtimeArrivalDate) {
    person.runtimeArrivalDate = person.arrivalRange[getRandomInt(0, person.arrivalRange.length - 1)];
  }

  return person.runtimeArrivalDate;
}

function toggleRangedArrivalDate(person) {
  const currentIndex = person.arrivalRange.indexOf(person.runtimeArrivalDate);
  const nextIndex = currentIndex < 0
    ? getRandomInt(0, person.arrivalRange.length - 1)
    : (currentIndex + 1) % person.arrivalRange.length;
  person.runtimeArrivalDate = person.arrivalRange[nextIndex];
  return person.runtimeArrivalDate;
}

function getRangedArrivalNumber(person, now = new Date()) {
  const arrivalDate = getRangedArrivalDate(person);
  const arrival = startOfLocalDay(parseLocalDate(arrivalDate));
  const today = startOfLocalDay(now);

  if (today < arrival) {
    return formatMissingDays(getDaysUntil(arrivalDate, now));
  }

  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + person.stayDays);
  return today < departure ? HOME_NUMBER : UNKNOWN_RETURN_NUMBER;
}

function getHauntedNumber(person, now = new Date()) {
  const arrivalDate = getHauntedArrivalDate(person);
  const arrival = startOfLocalDay(parseLocalDate(arrivalDate));
  const today = startOfLocalDay(now);

  if (!person.stayDays || today < arrival) {
    return formatMissingDays(getDaysUntil(arrivalDate, now));
  }

  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + person.stayDays);
  return today < departure ? HOME_NUMBER : UNKNOWN_RETURN_NUMBER;
}

function getNumber(person, now = new Date()) {
  if (person.returnUnknown) {
    return UNKNOWN_RETURN_NUMBER;
  }

  if (person.monacoTrip) {
    return getMonacoTripNumber(person, now);
  }

  if (hasActiveJulyVisit(person, now)) {
    return getJulyVisitNumber(person, now);
  }

  if (person.departureDate) {
    return getTemporaryStayNumber(person, now);
  }

  if (person.infinite) {
    return HOME_NUMBER;
  }

  if (person.arrivalRange) {
    return getRangedArrivalNumber(person, now);
  }

  if (person.randomRange) {
    return formatMissingDays(getRandomInt(person.randomRange[0], person.randomRange[1]));
  }

  if (person.randomSymbol) {
    return STRANGE_SYMBOLS[getRandomInt(0, STRANGE_SYMBOLS.length - 1)];
  }

  if (hasHauntedArrival(person)) {
    return getHauntedNumber(person, now);
  }

  return formatMissingDays(getDaysUntil(person.arrivalDate));
}

function shouldShowPcHome(person) {
  if (person.name !== "Esse") {
    return false;
  }

  if (typeof person.runtimeShowPcHome !== "boolean") {
    person.runtimeShowPcHome = getRandomInt(1, PC_HOME_CHANCE) === PC_HOME_CHANCE;
  }

  return person.runtimeShowPcHome;
}

function createPcHomeMark() {
  const image = document.createElement("img");
  image.className = "home-mark home-mark--pc";
  image.src = `assets/pc.svg?v=${ASSET_VERSION}`;
  image.alt = "al computer";
  image.decoding = "async";
  return image;
}

function createHomeMark(person) {
  if (shouldShowPcHome(person)) {
    return createPcHomeMark();
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "home-mark");
  svg.setAttribute("viewBox", "0 0 371.704 324.316");
  svg.setAttribute("aria-label", "in Calabria");
  svg.setAttribute("role", "img");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M145.825 287.988L145.825 206.323C145.825 199.292 150.513 194.824 157.544 194.824L214.307 194.824C221.411 194.824 225.879 199.292 225.879 206.323L225.879 287.988ZM50.3174 287.915C50.3174 310.107 65.1855 324.023 88.6963 324.023L282.861 324.023C306.372 324.023 321.094 310.107 321.094 287.915L321.094 183.398L195.264 77.7832C189.331 72.7295 182.227 72.876 176.367 77.7832L50.3174 183.398ZM19.1895 171.313C24.5361 171.313 29.8096 168.75 34.2773 164.941L177.759 44.6045C180.396 42.4072 183.179 41.2354 185.815 41.2354C188.599 41.2354 191.309 42.4072 193.945 44.6045L337.5 164.941C341.895 168.75 347.168 171.313 352.515 171.313C364.233 171.313 371.704 163.55 371.704 153.223C371.704 147.876 369.067 142.163 364.087 138.062L211.45 9.96094C203.613 3.36914 194.678 0 185.815 0C177.026 0 168.091 3.36914 160.254 9.96094L7.61719 138.062C2.70996 142.163 0 147.876 0 153.223C0 163.55 7.4707 171.313 19.1895 171.313ZM274.585 73.6816L324.17 115.137L324.17 41.6016C324.17 34.7168 319.775 30.3223 312.964 30.3223L285.938 30.3223C279.199 30.3223 274.585 34.7168 274.585 41.6016Z");
  svg.append(path);

  return svg;
}

function getHauntedDigitGhosts(digits) {
  const baseNumber = Number(digits);
  const nearbyNumber = Number.isFinite(baseNumber)
    ? Math.max(1, Math.min(99, baseNumber + getRandomInt(-9, 9)))
    : getRandomInt(1, 99);

  return [
    { value: digits, x: 0, y: 0, angle: 0, alpha: 0.62, size: 222, keep: 0.5 },
    {
      value: String(nearbyNumber),
      x: getRandomInt(-28, 30),
      y: getRandomInt(-18, 20),
      angle: getRandomInt(-14, 14) / 100,
      alpha: 0.48,
      size: getRandomInt(196, 220),
      keep: 0.42,
    },
  ];
}

function getDigitTargets(digits) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const targets = [];
  canvas.width = HAUNTED_CANVAS_WIDTH;
  canvas.height = HAUNTED_CANVAS_HEIGHT;

  getHauntedDigitGhosts(digits).forEach((ghost) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.save();
    context.globalAlpha = ghost.alpha;
    context.font = `700 ${ghost.size}px Helvetica, Arial, sans-serif`;
    context.translate(HAUNTED_TARGET_RIGHT + ghost.x, canvas.height * 0.58 + ghost.y);
    context.rotate(ghost.angle);
    context.fillText(ghost.value, 0, 0);
    context.restore();

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let y = 2; y < canvas.height; y += 2) {
      for (let x = 2; x < canvas.width; x += 2) {
        const alpha = pixels[((y * canvas.width + x) * 4) + 3];
        if (alpha > 22 && Math.random() < ghost.keep) {
          targets.push({ x, y, alpha: alpha / 255 });
        }
      }
    }
  });

  for (let index = 0; index < 420; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 34 + Math.random() * 112;

    targets.push({
      x: HAUNTED_CENTER_X + Math.cos(angle) * radius,
      y: canvas.height * 0.56 + Math.sin(angle) * radius * 0.56,
      alpha: 0.18 + Math.random() * 0.22,
      loose: true,
    });
  }

  return shuffle(targets).slice(0, HAUNTED_PARTICLE_COUNT);
}

function createHauntedParticle(target) {
  const depth = Math.random();

  return {
    x: target.x,
    y: target.y,
    targetX: target.x,
    targetY: target.y,
    alpha: 0.22 + target.alpha * (target.loose ? 0.36 : 0.88),
    depth,
    loose: Boolean(target.loose),
    orbit: (target.loose ? 30 : 1) + Math.random() * (target.loose ? 90 : 9),
    grain: 1 + depth * 2.35,
    spin: (Math.random() > 0.5 ? 1 : -1) * (0.58 + Math.random() * 1.52),
    stream: 0.58 + Math.random() * 1.34,
    turbulence: (target.loose ? 18 : 4) + Math.random() * (target.loose ? 42 : 18),
    twist: (target.loose ? 0.18 : 0.08) + Math.random() * (target.loose ? 0.6 : 0.26),
    wind: (target.loose ? 22 : 10) + Math.random() * (target.loose ? 54 : 28),
    phase: Math.random() * Math.PI * 2,
    phase2: Math.random() * Math.PI * 2,
  };
}

function retargetHauntedParticles(state, digits) {
  const targets = getDigitTargets(digits);
  const now = performance.now();

  if (state.particles.length) {
    state.fadingLayers.push({
      particles: state.particles,
      startedAt: now,
    });
  }

  state.digits = digits;
  state.fadeStartedAt = now;
  state.particles = shuffle(targets).map(createHauntedParticle);
  state.fadingLayers = state.fadingLayers.filter((layer) => now - layer.startedAt < HAUNTED_FADE_MS);

  state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
}

function getHauntedParticlePosition(particle, now, trailOffset = 0) {
  const time = now - trailOffset;
  const centerX = HAUNTED_CENTER_X;
  const centerY = HAUNTED_CANVAS_HEIGHT * 0.56;
  const dx = particle.targetX - centerX;
  const dy = particle.targetY - centerY;
  const swirl = Math.sin(time * particle.stream + particle.phase) * particle.twist
    + Math.cos(time * particle.stream * 0.63 + particle.phase2) * particle.twist * 0.72;
  const cos = Math.cos(swirl);
  const sin = Math.sin(swirl);
  const rotatedX = dx * cos - dy * sin;
  const rotatedY = dx * sin + dy * cos;
  const vortex = time * particle.spin + particle.phase;
  const pulse = 0.52 + Math.sin(time * 2.1 + particle.phase2) * 0.22;
  const orbit = particle.orbit * pulse;
  const stream = ((time * particle.stream + particle.phase2) % 1 + 1) % 1;
  const lift = particle.loose ? 34 : 18;
  const wind = particle.wind * (stream - 0.2)
    + Math.sin(time * 2.9 + particle.phase) * particle.wind * 0.34
    + Math.cos(time * 1.3 + particle.phase2) * particle.wind * 0.22;

  return {
    x: centerX + rotatedX
      + Math.cos(vortex + stream * Math.PI * 2) * orbit
      + Math.sin(time * 6.1 + particle.phase2) * particle.turbulence
      + wind,
    y: centerY + rotatedY
      + Math.sin(vortex * 1.34 + stream * Math.PI * 2) * orbit * 0.58
      + Math.cos(time * 4.7 + particle.phase) * particle.turbulence * 0.68
      - (stream - 0.5) * lift,
    stream,
  };
}

function drawHauntedGrain(context, x, y, size, alpha) {
  context.globalAlpha = Math.max(0, Math.min(1, alpha));
  context.fillRect(x, y, size, size);
}

function drawHauntedLayer(context, particles, now, opacity) {
  particles.forEach((particle) => {
    if (!particle.loose) {
      drawHauntedGrain(
        context,
        particle.targetX,
        particle.targetY,
        particle.grain * 0.72,
        particle.alpha * 0.32 * opacity,
      );
    }

    const trailCount = particle.loose ? 3 : 2;
    for (let trailIndex = trailCount - 1; trailIndex >= 0; trailIndex -= 1) {
      const point = getHauntedParticlePosition(particle, now, trailIndex * 0.045);
      const trailAlpha = particle.alpha * opacity * (1 - trailIndex * 0.22) * (particle.loose ? 0.62 : 1);
      const grainSize = particle.grain * (1 + trailIndex * 0.08) * (particle.loose ? 0.86 : 1);

      drawHauntedGrain(context, point.x, point.y, grainSize, trailAlpha);
    }
  });
}

function drawHauntedParticles(state) {
  const { canvas, context, particles } = state;
  const now = Date.now() / 1000;
  const nowMs = performance.now();

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#000000";

  state.fadingLayers = state.fadingLayers.filter((layer) => {
    const fadeProgress = (nowMs - layer.startedAt) / HAUNTED_FADE_MS;
    const opacity = Math.max(0, 1 - fadeProgress);

    if (opacity <= 0) {
      return false;
    }

    drawHauntedLayer(context, layer.particles, now, opacity);
    return true;
  });

  const fadeInProgress = (nowMs - state.fadeStartedAt) / HAUNTED_FADE_MS;
  const currentOpacity = Math.max(0.08, Math.min(1, fadeInProgress));
  drawHauntedLayer(context, particles, now, currentOpacity);

  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.filter = "none";
  state.frame = window.requestAnimationFrame(() => drawHauntedParticles(state));
}

function setHauntedNumber(number, value) {
  const sign = value.startsWith("-") ? "-" : "";
  const digits = sign ? value.slice(1) : value;
  let signElement = number.querySelector(".haunted-sign");
  let canvas = number.querySelector(".haunted-canvas");

  if (!signElement || !canvas) {
    signElement = document.createElement("span");
    signElement.className = "haunted-sign";

    canvas = document.createElement("canvas");
    canvas.className = "haunted-canvas";
    canvas.width = HAUNTED_CANVAS_WIDTH;
    canvas.height = HAUNTED_CANVAS_HEIGHT;
    canvas.setAttribute("aria-hidden", "true");

    const state = {
      canvas,
      context: canvas.getContext("2d"),
      digits: "",
      fadeStartedAt: performance.now(),
      fadingLayers: [],
      frame: 0,
      particles: [],
    };

    number.hauntedState = state;
    number.replaceChildren(signElement, canvas);
    drawHauntedParticles(state);
  }

  signElement.textContent = sign;
  number.dataset.value = value;
  number.dataset.digits = digits;

  if (number.hauntedState?.digits !== digits) {
    retargetHauntedParticles(number.hauntedState, digits);
  }
}

function stopHauntedNumber(number) {
  if (number.hauntedState?.frame) {
    window.cancelAnimationFrame(number.hauntedState.frame);
  }

  number.hauntedState = null;
  number.classList.remove("number--haunted");
}

function setHauntedDisplay(person, number, visibleNumber) {
  const shouldHaunt = /^-[0-9]+$/.test(visibleNumber);

  if (!shouldHaunt) {
    stopHauntedNumber(number);
    setNumberDisplay(person, number, visibleNumber);
    return;
  }

  number.classList.remove("number--home", "number--unknown-return", "number--mystery");
  number.classList.add("number--haunted");
  number.dataset.value = visibleNumber;
  number.dataset.fitValue = "HAUNTED";
  setHauntedNumber(number, visibleNumber);
}

function shouldUseHauntedDisplay(person, visibleNumber, now = new Date()) {
  return /^-[0-9]+$/.test(visibleNumber)
    && (hasActiveJulyVisit(person, now) || hasHauntedArrival(person));
}

function setDynamicNumberDisplay(person, number, visibleNumber, now = new Date()) {
  if (shouldUseHauntedDisplay(person, visibleNumber, now)) {
    setHauntedDisplay(person, number, visibleNumber);
    return;
  }

  stopHauntedNumber(number);
  setNumberDisplay(person, number, visibleNumber);
}

function triggerRandomNumberChange(person, number) {
  number.classList.add("number--shocking");

  window.setTimeout(() => {
    if (person.arrivalRange) {
      toggleRangedArrivalDate(person);
    }

    setNumberDisplay(person, number, getNumber(person));
    number.classList.remove("number--shocking");
    number.classList.add("number--changed");

    window.setTimeout(() => {
      number.classList.remove("number--changed");
    }, 180);

    scheduleNameCoverageUpdate();
    scheduleRandomNumberChange(person, number);
  }, person.shockMs);
}

function scheduleRandomNumberChange(person, number) {
  const delay = getRandomInt(person.minIntervalMs, person.maxIntervalMs);
  window.setTimeout(() => {
    triggerRandomNumberChange(person, number);
  }, delay);
}

function updateMonacoTripNumber(person, number) {
  setNumberDisplay(person, number, getNumber(person));
  scheduleFitTypeSize();
}

function scheduleMonacoTripRefresh(person, number) {
  window.setInterval(() => {
    updateMonacoTripNumber(person, number);
  }, 60 * 1000);
}

function hasMagicDogNames(displayNames) {
  if (displayNames.length !== MAGIC_DOG_NAMES.length) {
    return false;
  }

  const selected = new Set(displayNames);
  return MAGIC_DOG_NAMES.every((name) => selected.has(name));
}

function showMagicDog(displayNames) {
  const existingDog = document.querySelector(".magic-dog");
  if (!hasMagicDogNames(displayNames)) {
    existingDog?.remove();
    return;
  }

  const dog = existingDog || document.createElement("img");
  dog.className = "magic-dog";
  dog.src = `assets/canemagico.png?v=${ASSET_VERSION}`;
  dog.alt = "Cane magico";
  dog.decoding = "async";

  if (!existingDog) {
    document.querySelector(".page").append(dog);
    dog.getBoundingClientRect();
    dog.classList.add("magic-dog--visible");
  }
}

function getFitNumber(person, visibleNumber) {
  if (isHomeNumber(person, visibleNumber)) {
    return "HOME";
  }

  if (person.monacoTrip) {
    return "-3";
  }

  if (person.randomRange) {
    const maxMagnitude = Math.max(Math.abs(person.randomRange[0]), Math.abs(person.randomRange[1]));
    return formatMissingDays(maxMagnitude);
  }

  if (shouldUseHauntedDisplay(person, visibleNumber)) {
    return "HAUNTED";
  }

  return visibleNumber;
}

function getMissingDaysRank(visibleNumber) {
  const match = visibleNumber.match(/^-([0-9]+)$/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function isInCalabria(person, visibleNumber) {
  return isHomeNumber(person, visibleNumber);
}

function isHomeNumber(person, visibleNumber) {
  return visibleNumber === HOME_NUMBER || (visibleNumber === "-0" && hasArrived(person));
}

function isUnknownReturnNumber(person, visibleNumber) {
  return visibleNumber === UNKNOWN_RETURN_NUMBER;
}

function setNumberDisplay(person, number, visibleNumber) {
  number.classList.remove("number--home", "number--unknown-return");
  number.textContent = visibleNumber;
  number.dataset.value = visibleNumber;
  number.dataset.fitValue = getFitNumber(person, visibleNumber);
  number.classList.toggle("number--mystery", isMonacoTripMystery(person, visibleNumber));
  number.classList.toggle("number--unknown-return", isUnknownReturnNumber(person, visibleNumber));

  if (isHomeNumber(person, visibleNumber)) {
    number.classList.add("number--home");
    number.textContent = "";
    number.dataset.value = HOME_NUMBER;
    number.append(createHomeMark(person));
  }
}

function getSortedEntries(entries) {
  const away = [];
  const home = [];

  entries.forEach((entry) => {
    if (isInCalabria(entry.person, entry.initialNumber)) {
      home.push(entry);
      return;
    }

    away.push(entry);
  });

  const sortedAway = away
    .map((entry) => ({
      ...entry,
      sortRank: getMissingDaysRank(entry.initialNumber),
    }))
    .sort((left, right) => {
      if (left.sortRank !== right.sortRank) {
        return left.sortRank - right.sortRank;
      }

      return left.tieBreak - right.tieBreak;
    });

  return [...sortedAway, ...shuffle(home)];
}

function measureText(text, includeNumberPadding = false) {
  const measure = document.createElement("span");
  measure.textContent = text;
  measure.style.position = "fixed";
  measure.style.left = "-9999px";
  measure.style.top = "0";
  measure.style.visibility = "hidden";
  measure.style.pointerEvents = "none";
  measure.style.whiteSpace = "nowrap";
  measure.style.fontFamily = "Helvetica, Arial, sans-serif";
  measure.style.fontSize = getComputedStyle(root).getPropertyValue("--type-size");
  measure.style.fontWeight = "700";
  measure.style.letterSpacing = "0";
  document.body.appendChild(measure);
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  const padding = includeNumberPadding ? typeSize * 0.06 : 0;
  const width = measure.getBoundingClientRect().width + padding;
  measure.remove();
  return width;
}

function measureHomeMark() {
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  return typeSize * 1.18;
}

function measureHauntedNumber() {
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  return typeSize * 1.82;
}

function rowsFit() {
  return Array.from(list.querySelectorAll(".countdown-row")).every((row) => {
    const name = row.querySelector(".name");
    const number = row.querySelector(".number");
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    let numberWidth = measureText(number.dataset.fitValue, true);
    if (number.dataset.fitValue === "HOME") {
      numberWidth = measureHomeMark();
    }
    if (number.dataset.fitValue === "HAUNTED") {
      numberWidth = measureHauntedNumber();
    }
    const width = measureText(name.dataset.fitName || name.textContent)
      + numberWidth
      + gap;

    return width <= row.getBoundingClientRect().width;
  });
}

function listFitsViewport() {
  if (isMobileLandscape()) {
    return true;
  }

  const page = document.querySelector(".page");
  const pageStyle = getComputedStyle(page);
  const availableHeight = window.innerHeight
    - parseFloat(pageStyle.paddingTop)
    - parseFloat(pageStyle.paddingBottom);

  return list.getBoundingClientRect().height <= availableHeight;
}

function layoutFits() {
  return rowsFit() && listFitsViewport();
}

function isMobileLandscape() {
  return window.matchMedia("(orientation: landscape) and (max-height: 520px) and (max-width: 980px)").matches;
}

function fitTypeSize() {
  if (!list.children.length) {
    return;
  }

  const mobileLandscape = isMobileLandscape();
  const maxSize = mobileLandscape
    ? Math.min(window.innerWidth * 0.098, window.innerHeight * 0.24, 86)
    : Math.min(window.innerWidth * 0.16, window.innerHeight * 0.14, 180);
  let low = mobileLandscape ? Math.min(34, maxSize) : 14;
  let high = maxSize;

  for (let step = 0; step < 12; step += 1) {
    const middle = (low + high) / 2;
    root.style.setProperty("--type-size", `${middle}px`);

    if (layoutFits()) {
      low = middle;
    } else {
      high = middle;
    }
  }

  root.style.setProperty("--type-size", `${Math.floor(low)}px`);
  updateNameCoverage();
}

function scheduleFitTypeSize() {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(fitTypeSize);
}

function updateNameCoverage() {
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  const fadeLead = typeSize * 0.45;
  const fadeTail = typeSize * 0.22;

  list.querySelectorAll(".name--coverage-watch").forEach((name) => {
    const row = name.closest(".countdown-row");
    const number = row?.querySelector(".number");

    if (!number) {
      return;
    }

    const nameRect = name.getBoundingClientRect();
    const numberRect = number.getBoundingClientRect();
    const overlapsNumber = nameRect.right > numberRect.left;
    name.classList.toggle("name--covered", overlapsNumber);

    if (!overlapsNumber) {
      name.style.removeProperty("--name-fade-start");
      name.style.removeProperty("--name-fade-end");
      return;
    }

    const fadeStart = Math.max(0, numberRect.left - nameRect.left - fadeLead);
    const fadeEnd = Math.max(fadeStart + fadeTail, numberRect.left - nameRect.left + fadeTail);
    name.style.setProperty("--name-fade-start", `${fadeStart}px`);
    name.style.setProperty("--name-fade-end", `${fadeEnd}px`);
  });
}

function scheduleNameCoverageUpdate() {
  window.cancelAnimationFrame(coverageFrame);
  coverageFrame = window.requestAnimationFrame(updateNameCoverage);
}

function preventStaleCache() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`./sw.js?v=${ASSET_VERSION}`, { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}

function nudgeMobileBrowserChrome() {
  if (!window.matchMedia("(max-width: 760px)").matches) {
    return;
  }

  window.addEventListener("load", () => {
    [80, 350, 900].forEach((delay) => {
      window.setTimeout(() => {
        const offset = Number.parseFloat(
          getComputedStyle(root).getPropertyValue("--safari-scroll-offset"),
        ) || 0;

        if (offset > 0 && document.documentElement.scrollHeight > window.innerHeight) {
          window.scrollTo({ top: offset, left: 0, behavior: "auto" });
        }
      }, delay);
    });
  });
}

function render() {
  const forceMagicDog = shouldForceMagicDog();
  const entries = people.map((person) => {
    const displayName = getMagicDogDisplayName(person, forceMagicDog);

    return {
      person,
      displayName,
      initialNumber: getNumber(person),
      tieBreak: Math.random(),
    };
  });
  const displayNames = entries.map((entry) => entry.displayName);

  list.replaceChildren(
    ...getSortedEntries(entries).map(({ person, displayName, initialNumber }) => {
      const row = document.createElement("article");
      row.className = "countdown-row";
      if (hasHauntedSchedule(person)) {
        row.classList.add("countdown-row--haunted");
      }

      const name = document.createElement("h1");
      name.className = "name";
      name.dataset.fitName = getFitName(person, displayName);
      renderDisplayName(name, person, displayName);

      const number = document.createElement("p");
      number.className = "number";
      number.dataset.name = person.name;
      if (hasHauntedSchedule(person)) {
        setDynamicNumberDisplay(person, number, initialNumber);
      } else {
        setNumberDisplay(person, number, initialNumber);
      }

      if ((person.randomRange || person.arrivalRange) && person.minIntervalMs && person.maxIntervalMs) {
        number.classList.add("number--electric");
        scheduleRandomNumberChange(person, number);
      }

      if (person.monacoTrip) {
        scheduleMonacoTripRefresh(person, number);
      }

      if (hasHauntedSchedule(person)) {
        const hauntedIntervalMs = person.julyVisit?.intervalMs || person.hauntedIntervalMs;

        if (hauntedIntervalMs) {
          window.setInterval(() => {
            const now = new Date();

            if (hasActiveJulyVisit(person, now)) {
              toggleJulyVisitArrivalDate(person);
            } else if (hasHauntedArrival(person)) {
              resetHauntedArrivalDate(person);
            }

            setDynamicNumberDisplay(person, number, getNumber(person, now), now);
          }, hauntedIntervalMs);
        }
      }

      row.append(name, number);
      return row;
    }),
  );

  showMagicDog(displayNames);
  scheduleFitTypeSize();
}

render();
preventStaleCache();
nudgeMobileBrowserChrome();
window.addEventListener("resize", scheduleFitTypeSize);

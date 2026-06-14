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
    arrivalDate: "2026-06-18",
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
    randomRange: [1, 99],
    minIntervalMs: 500,
    maxIntervalMs: 3000,
    shockMs: 260,
  },
  { name: "Jarbo", aliases: ["Jarbo", "Jarbolone", "Gobu", "Giambadabro"], randomSymbol: true },
  {
    name: "Rattolino",
    aliases: ["Federico", "Piaz", "Topo", "Topastro", "Muride", "Rattolino"],
    hauntedDate: "2026-08-15",
    hauntedVarianceDays: 6,
    hauntedIntervalMs: 5200,
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
const ASSET_VERSION = "20260615-1015";
const OVERFLOW_ALIAS = "Puttanaaaaaaaaaaaaaaaaaa";
const OVERFLOW_ALIAS_CORE = "Puttana";
const COVERAGE_WATCH_ALIASES = new Set([OVERFLOW_ALIAS, "Giacoooooo"]);
const HOME_NUMBER = "\u221e";
const UNKNOWN_RETURN_NUMBER = "\u2026";

const list = document.querySelector("#countdown-list");
const root = document.documentElement;
let resizeFrame = 0;
let coverageFrame = 0;
const HAUNTED_CANVAS_WIDTH = 360;
const HAUNTED_CANVAS_HEIGHT = 320;
const HAUNTED_PARTICLE_COUNT = 1500;

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

function renderDisplayName(nameElement, person, displayName) {
  nameElement.dataset.fullName = displayName;

  if (person.name === "Nardo" && displayName === "Paolo") {
    nameElement.classList.add("name--small-paolo");
  }

  if (shouldWatchNameCoverage(displayName)) {
    nameElement.classList.add("name--coverage-watch");
  }

  if (hasOverflowAlias(person, displayName)) {
    nameElement.classList.add("name--overflow");
    displayName.split("").forEach((letter, index) => {
      const character = document.createElement("span");
      const intensity = index / Math.max(1, displayName.length - 1);

      character.className = "name-overflow-char";
      character.textContent = letter;
      character.style.setProperty("--char-shake", intensity.toFixed(3));
      character.style.setProperty("--char-delay", `${(-index * 0.027).toFixed(3)}s`);
      character.style.setProperty("--char-angle", `${(intensity * 2.8).toFixed(3)}deg`);
      nameElement.append(character);
    });
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

function getHauntedArrivalDate(person) {
  if (!person.runtimeArrivalDate) {
    const date = parseLocalDate(person.hauntedDate);
    const offset = getRandomInt(-person.hauntedVarianceDays, person.hauntedVarianceDays);
    date.setDate(date.getDate() + offset);
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
    return "?";
  }

  if (now < returnStart) {
    return formatMissingDays(getDaysUntil(returnDate, now));
  }

  return HOME_NUMBER;
}

function isMonacoTripMystery(person, visibleNumber) {
  return Boolean(person.monacoTrip) && visibleNumber === "?";
}

function getNumber(person, now = new Date()) {
  if (person.returnUnknown) {
    return UNKNOWN_RETURN_NUMBER;
  }

  if (person.monacoTrip) {
    return getMonacoTripNumber(person, now);
  }

  if (person.infinite) {
    return HOME_NUMBER;
  }

  if (person.randomRange) {
    return formatMissingDays(getRandomInt(person.randomRange[0], person.randomRange[1]));
  }

  if (person.randomSymbol) {
    return STRANGE_SYMBOLS[getRandomInt(0, STRANGE_SYMBOLS.length - 1)];
  }

  if (person.hauntedDate) {
    return formatMissingDays(getDaysUntil(getHauntedArrivalDate(person)));
  }

  return formatMissingDays(getDaysUntil(person.arrivalDate));
}

function createHomeMark() {
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

function getDigitTargets(digits) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = HAUNTED_CANVAS_WIDTH;
  canvas.height = HAUNTED_CANVAS_HEIGHT;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
  context.font = "700 258px Helvetica, Arial, sans-serif";
  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillText(digits, canvas.width - 20, canvas.height * 0.62);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const targets = [];

  for (let y = 4; y < canvas.height; y += 3) {
    for (let x = 4; x < canvas.width; x += 3) {
      const alpha = pixels[((y * canvas.width + x) * 4) + 3];
      if (alpha > 42 && Math.random() > 0.1) {
        targets.push({ x, y, alpha: alpha / 255 });
      }
    }
  }

  return shuffle(targets).slice(0, HAUNTED_PARTICLE_COUNT);
}

function createHauntedParticle(target) {
  return {
    x: target.x + getRandomInt(-34, 34),
    y: target.y + getRandomInt(-4, 60),
    targetX: target.x,
    targetY: target.y,
    size: getRandomInt(38, 100) / 10,
    alpha: 0.045 + target.alpha * 0.26,
    light: Math.random() > 0.985,
    pull: 0.012 + Math.random() * 0.026,
    rise: 76 + Math.random() * 150,
    smokeSpeed: 0.08 + Math.random() * 0.18,
    wander: 1.4 + Math.random() * 3.2,
    phase: Math.random() * Math.PI * 2,
  };
}

function retargetHauntedParticles(state, digits) {
  const targets = getDigitTargets(digits);
  state.digits = digits;

  while (state.particles.length < targets.length) {
    state.particles.push(createHauntedParticle(targets[state.particles.length]));
  }

  state.particles = state.particles.slice(0, targets.length);
  shuffle(targets).forEach((target, index) => {
    const particle = state.particles[index];
    particle.targetX = target.x + getRandomInt(-4, 4);
    particle.targetY = target.y + getRandomInt(-4, 4);
    particle.alpha = 0.045 + target.alpha * 0.26;
    particle.light = Math.random() > 0.985;
    particle.rise = 76 + Math.random() * 150;
    particle.smokeSpeed = 0.08 + Math.random() * 0.18;
  });
}

function drawHauntedParticles(state) {
  const { canvas, context, particles } = state;
  const now = Date.now() / 1000;

  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.filter((particle) => !particle.light).forEach((particle) => {
    const wobbleX = Math.sin(now * 0.8 + particle.phase) * particle.wander;
    const wobbleY = Math.cos(now * 0.62 + particle.phase) * particle.wander * 0.22;
    particle.x += (particle.targetX + wobbleX - particle.x) * particle.pull;
    particle.y += (particle.targetY + wobbleY - particle.y) * particle.pull;

    const smoke = (now * particle.smokeSpeed + particle.phase) % 1;
    const drawX = particle.x + Math.sin(smoke * Math.PI * 2 + particle.phase) * (5 + 28 * smoke);
    const drawY = particle.y - particle.rise * smoke;
    const drawAlpha = particle.alpha * (1 - smoke * 0.64);
    const radius = particle.size * (3.8 + smoke * 2.2);
    const gradient = context.createRadialGradient(
      drawX,
      drawY,
      0,
      drawX,
      drawY,
      radius,
    );

    gradient.addColorStop(0, `rgba(0, 0, 0, ${drawAlpha})`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${drawAlpha * 0.28})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(drawX, drawY, radius, 0, Math.PI * 2);
    context.fill();
  });

  particles.filter((particle) => particle.light).forEach((particle) => {
    const wobbleX = Math.sin(now * 0.72 + particle.phase) * particle.wander;
    const wobbleY = Math.cos(now * 0.58 + particle.phase) * particle.wander * 0.2;
    particle.x += (particle.targetX + wobbleX - particle.x) * particle.pull;
    particle.y += (particle.targetY + wobbleY - particle.y) * particle.pull;

    const smoke = (now * particle.smokeSpeed + particle.phase) % 1;
    const drawX = particle.x + Math.cos(smoke * Math.PI * 2 + particle.phase) * (4 + 18 * smoke);
    const drawY = particle.y - particle.rise * smoke;
    const drawAlpha = particle.alpha * (1 - smoke * 0.72);
    const radius = particle.size * (2.2 + smoke * 1.2);
    const gradient = context.createRadialGradient(
      drawX,
      drawY,
      0,
      drawX,
      drawY,
      radius,
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${drawAlpha * 0.22})`);
    gradient.addColorStop(0.48, `rgba(255, 255, 255, ${drawAlpha * 0.06})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(drawX, drawY, radius, 0, Math.PI * 2);
    context.fill();
  });

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

function triggerRandomNumberChange(person, number) {
  number.classList.add("number--shocking");

  window.setTimeout(() => {
    number.textContent = getNumber(person);
    number.dataset.value = number.textContent;
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

  if (person.hauntedDate) {
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
  return visibleNumber === HOME_NUMBER || hasArrived(person);
}

function isUnknownReturnNumber(person, visibleNumber) {
  return Boolean(person.returnUnknown) && visibleNumber === UNKNOWN_RETURN_NUMBER;
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
    number.append(createHomeMark());
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
  return typeSize * 2.05;
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

function fitTypeSize() {
  if (!list.children.length) {
    return;
  }

  const maxSize = Math.min(window.innerWidth * 0.16, window.innerHeight * 0.14, 180);
  let low = 14;
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
      if (person.hauntedDate) {
        row.classList.add("countdown-row--haunted");
      }

      const name = document.createElement("h1");
      name.className = "name";
      name.dataset.fitName = getFitName(person, displayName);
      renderDisplayName(name, person, displayName);

      const number = document.createElement("p");
      number.className = "number";
      if (person.hauntedDate) {
        number.classList.add("number--haunted");
      }
      number.dataset.name = person.name;
      setNumberDisplay(person, number, initialNumber);

      if (person.randomRange && person.minIntervalMs && person.maxIntervalMs) {
        number.classList.add("number--electric");
        scheduleRandomNumberChange(person, number);
      }

      if (person.monacoTrip) {
        scheduleMonacoTripRefresh(person, number);
      }

      if (person.hauntedDate) {
        setHauntedNumber(number, number.dataset.value);

        if (person.hauntedIntervalMs) {
          window.setInterval(() => {
            resetHauntedArrivalDate(person);
            setHauntedNumber(number, getNumber(person));
          }, person.hauntedIntervalMs);
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

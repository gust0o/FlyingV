const people = [
  { name: "Giulius", aliases: ["Giulius", "Bibubibi", "Andrea"], infinite: true },
  { name: "Gusto", aliases: ["Gusto", "Gustavo", "Gepo", "Glep", "El Pequeño"], infinite: true },
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
  { name: "Nardo", aliases: ["Nardo", "Nardellone", "Nardolino", "Doremirko"], arrivalDate: "2026-06-18" },
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
      "Di vannacciana memoria",
      "Agent AI",
      "Botte Donato",
      "Alien raudo",
      "Rudy Giuliani",
      "Patriota",
      "Latte materno",
      "Grosseto",
      "Puttanaaaaaaaaaaaaaaaaaa",
      "John Thernus",
      "DDL ZEN",
      "Dario fottuto Amodei",
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

const list = document.querySelector("#countdown-list");
const root = document.documentElement;
let resizeFrame = 0;
const HAUNTED_CANVAS_WIDTH = 620;
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

function getNumber(person) {
  if (person.infinite) {
    return "\u221e";
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

function createCheckMark() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "check-mark");
  svg.setAttribute("viewBox", "0 0 100 74");
  svg.setAttribute("aria-label", "arrivato");
  svg.setAttribute("role", "img");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M10 35 L38 63 L90 9");
  path.setAttribute("pathLength", "1");
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
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(digits, canvas.width / 2, canvas.height * 0.62);

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

    scheduleRandomNumberChange(person, number);
  }, person.shockMs);
}

function scheduleRandomNumberChange(person, number) {
  const delay = getRandomInt(person.minIntervalMs, person.maxIntervalMs);
  window.setTimeout(() => {
    triggerRandomNumberChange(person, number);
  }, delay);
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
  dog.src = "assets/canemagico.png";
  dog.alt = "Cane magico";
  dog.decoding = "async";

  if (!existingDog) {
    document.body.append(dog);
    window.requestAnimationFrame(() => {
      dog.classList.add("magic-dog--visible");
    });
  }
}

function getFitNumber(person, visibleNumber) {
  if (person.randomRange) {
    const maxMagnitude = Math.max(Math.abs(person.randomRange[0]), Math.abs(person.randomRange[1]));
    return formatMissingDays(maxMagnitude);
  }

  if (person.hauntedDate) {
    return "HAUNTED";
  }

  if (hasArrived(person)) {
    return "V";
  }

  return visibleNumber;
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

function measureCheckMark() {
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  return typeSize * 1.15;
}

function measureHauntedNumber() {
  const typeSize = parseFloat(getComputedStyle(root).getPropertyValue("--type-size")) || 0;
  return typeSize * 3.18;
}

function rowsFit() {
  return Array.from(list.querySelectorAll(".countdown-row")).every((row) => {
    const name = row.querySelector(".name");
    const number = row.querySelector(".number");
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    let numberWidth = measureText(number.dataset.fitValue, true);
    if (number.dataset.fitValue === "V") {
      numberWidth = measureCheckMark();
    }
    if (number.dataset.fitValue === "HAUNTED") {
      numberWidth = measureHauntedNumber();
    }
    const width = measureText(name.textContent)
      + numberWidth
      + gap;

    return width <= row.getBoundingClientRect().width;
  });
}

function fitTypeSize() {
  if (!list.children.length) {
    return;
  }

  const maxSize = Math.min(window.innerWidth * 0.16, 180);
  let low = 14;
  let high = maxSize;

  for (let step = 0; step < 12; step += 1) {
    const middle = (low + high) / 2;
    root.style.setProperty("--type-size", `${middle}px`);

    if (rowsFit()) {
      low = middle;
    } else {
      high = middle;
    }
  }

  root.style.setProperty("--type-size", `${Math.floor(low)}px`);
}

function scheduleFitTypeSize() {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(fitTypeSize);
}

function render() {
  const displayNames = [];

  list.replaceChildren(
    ...shuffle(people).map((person) => {
      const displayName = getDisplayName(person);
      displayNames.push(displayName);
      const row = document.createElement("article");
      row.className = "countdown-row";
      if (person.hauntedDate) {
        row.classList.add("countdown-row--haunted");
      }

      const name = document.createElement("h1");
      name.className = "name";
      name.textContent = displayName;

      const number = document.createElement("p");
      number.className = "number";
      if (person.hauntedDate) {
        number.classList.add("number--haunted");
      }
      number.dataset.name = person.name;
      number.textContent = getNumber(person);
      number.dataset.value = number.textContent;
      number.dataset.fitValue = getFitNumber(person, number.textContent);
      if (hasArrived(person)) {
        number.classList.add("number--arrived");
        number.textContent = "";
        number.dataset.value = "";
        number.append(createCheckMark());
      }

      if (person.randomRange && person.minIntervalMs && person.maxIntervalMs) {
        number.classList.add("number--electric");
        scheduleRandomNumberChange(person, number);
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
window.addEventListener("resize", scheduleFitTypeSize);

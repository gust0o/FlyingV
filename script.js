const people = [
  { name: "Giulius", aliases: ["Giulius", "Bibubibi", "Andrea"], infinite: true },
  { name: "Gusto", aliases: ["Gusto", "Gustavo", "Gepo", "Glep", "El Pequeno"], infinite: true },
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
    ],
    randomRange: [-1, 365],
    intervalMs: 500,
  },
  { name: "Jarbo", aliases: ["Jarbo", "Jarbolone", "Gobu", "Giambadabro"], randomSymbol: true },
  {
    name: "Rattolino",
    aliases: ["Federico", "Piaz", "Topo", "Topastro", "Muride", "Rattolino"],
    hauntedDate: "2026-08-15",
    hauntedVarianceDays: 6,
  },
  // Add real arrivals like this:
  // { name: "nome", arrivalDate: "2026-08-10" },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const STRANGE_SYMBOLS = [
  "\u{13000}",
  "\u0416",
  "\uA9A7",
  "\u1B13",
  "\u0F12",
  "\u16A0",
  "\uA66E",
  "\u1703",
  "\u03DE",
  "\u{102A0}",
];

const list = document.querySelector("#countdown-list");
const root = document.documentElement;
let resizeFrame = 0;

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

function getFitNumber(person, visibleNumber) {
  if (person.randomRange) {
    const maxMagnitude = Math.max(Math.abs(person.randomRange[0]), Math.abs(person.randomRange[1]));
    return formatMissingDays(maxMagnitude);
  }

  if (person.hauntedDate) {
    return "-70";
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

function rowsFit() {
  return Array.from(list.querySelectorAll(".countdown-row")).every((row) => {
    const name = row.querySelector(".name");
    const number = row.querySelector(".number");
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    const numberWidth = number.dataset.fitValue === "V"
      ? measureCheckMark()
      : measureText(number.dataset.fitValue, true);
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
  list.replaceChildren(
    ...shuffle(people).map((person) => {
      const displayName = getDisplayName(person);
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

      if (person.randomRange && person.intervalMs) {
        window.setInterval(() => {
          number.textContent = getNumber(person);
          number.dataset.value = number.textContent;
        }, person.intervalMs);
      }

      row.append(name, number);
      return row;
    }),
  );

  scheduleFitTypeSize();
}

render();
window.addEventListener("resize", scheduleFitTypeSize);

const people = [
  { name: "Giulius", infinite: true },
  { name: "gusto", infinite: true },
  { name: "esse", infinite: true },
  { name: "Ciccio", arrivalDate: "2026-08-08" },
  { name: "Nardo", arrivalDate: "2026-06-18" },
  { name: "Rocco", randomRange: [-1, 365], intervalMs: 500 },
  { name: "jarbo", randomSymbol: true },
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function getNumber(person) {
  if (person.infinite) {
    return "\u221e";
  }

  if (person.randomRange) {
    return String(getRandomInt(person.randomRange[0], person.randomRange[1]));
  }

  if (person.randomSymbol) {
    return STRANGE_SYMBOLS[getRandomInt(0, STRANGE_SYMBOLS.length - 1)];
  }

  return String(getDaysUntil(person.arrivalDate));
}

function render() {
  list.replaceChildren(
    ...people.map((person) => {
      const row = document.createElement("article");
      row.className = "countdown-row";

      const name = document.createElement("h1");
      name.className = "name";
      name.textContent = person.name;

      const number = document.createElement("p");
      number.className = "number";
      number.dataset.name = person.name;
      number.textContent = getNumber(person);

      if (person.randomRange && person.intervalMs) {
        window.setInterval(() => {
          number.textContent = getNumber(person);
        }, person.intervalMs);
      }

      row.append(name, number);
      return row;
    }),
  );
}

render();

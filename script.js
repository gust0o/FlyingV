const people = [
  { name: "Giulius", infinite: true },
  { name: "gusto", infinite: true },
  { name: "esse", infinite: true },
  // Add real arrivals like this:
  // { name: "nome", arrivalDate: "2026-08-10" },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const list = document.querySelector("#countdown-list");

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
  return person.infinite ? "\u221e" : String(getDaysUntil(person.arrivalDate));
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
      number.textContent = getNumber(person);

      row.append(name, number);
      return row;
    }),
  );
}

render();

// Mise en forme des dates et URL partagées par les écrans de l'app.

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://app.addfrance.fr"
    : "http://localhost:3000";

const LOCALE = "fr-FR";

function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// « 28 sept. 2026 » ; l'année est omise si c'est l'année en cours.
export function shortDate(value) {
  const d = toDate(value);
  if (!d) return "";
  const opts = { day: "numeric", month: "short" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString(LOCALE, opts);
}

// « 9 h 30 », « 16 h »
export function frenchTime(value) {
  const d = toDate(value);
  if (!d) return "";
  const m = d.getMinutes();
  return `${d.getHours()}\u00a0h${m ? "\u00a0" + String(m).padStart(2, "0") : ""}`;
}

// Tuile de date d'agenda : { day: "14", month: "oct.", weekday: "mer." }
export function dateTile(value) {
  const d = toDate(value);
  if (!d) return { day: "", month: "", weekday: "" };
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString(LOCALE, { month: "short" }),
    weekday: d.toLocaleDateString(LOCALE, { weekday: "short" }),
  };
}

// « mercredi 14 octobre, de 9 h 30 à 16 h »
// « du 12 mai 2027 à 18 h au 15 mai 2027 à 12 h »
export function eventRange(start, end) {
  const s = toDate(start);
  const e = toDate(end);
  if (!s) return "";
  const longOpts = { weekday: "long", day: "numeric", month: "long" };
  if (s.getFullYear() !== new Date().getFullYear()) longOpts.year = "numeric";
  if (!e) return `${s.toLocaleDateString(LOCALE, longOpts)}, ${frenchTime(s)}`;
  if (sameDay(s, e)) {
    return `${s.toLocaleDateString(LOCALE, longOpts)}, de ${frenchTime(s)} à ${frenchTime(e)}`;
  }
  const opts = { day: "numeric", month: "long" };
  if (s.getFullYear() !== e.getFullYear() || s.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return `du ${s.toLocaleDateString(LOCALE, opts)} à ${frenchTime(s)} au ${e.toLocaleDateString(LOCALE, opts)} à ${frenchTime(e)}`;
}

// Durée écoulée courte : « à l'instant », « 5 min », « 3 h », « 2 j », puis la date.
export function timeAgo(value) {
  const d = toDate(value);
  if (!d) return "";
  const s = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (s < 60) return "à l’instant";
  if (s < 3600) return `${Math.floor(s / 60)}\u00a0min`;
  if (s < 86400) return `${Math.floor(s / 3600)}\u00a0h`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}\u00a0j`;
  return shortDate(d);
}

// Texte brut d'un contenu HTML (pour mesurer ou résumer)
export function plainText(html) {
  if (!html) return "";
  const div = document.createElement("div");
  // les fins de paragraphe et les retours à la ligne deviennent des espaces
  div.innerHTML = html.replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, " $&");
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

// Initiales pour l'avatar de secours : « Paul Gruson » → « PG »
export function initials(name) {
  return (name || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

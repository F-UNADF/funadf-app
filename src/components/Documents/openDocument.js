import { Browser } from "@capacitor/browser";
import { BASE_URL } from "@/utils/format";

// Ouvre un document (fichier du serveur ou lien externe) dans le navigateur intégré.
export function openDocument(doc) {
  const url = doc.type === "url" ? doc.url : BASE_URL + doc.href;
  if (!url) return;
  return Browser.open({ url }).catch(() => window.open(url, "_blank"));
}

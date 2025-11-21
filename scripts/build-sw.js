/**
 * Script pour compiler le Service Worker TypeScript en JavaScript
 */

const fs = require("fs");
const path = require("path");

// Lecture du fichier TypeScript
const swSource = fs.readFileSync(
  path.join(__dirname, "../public/sw.ts"),
  "utf-8"
);

// Conversion basique TypeScript -> JavaScript
// (enlever les types et références)
let swCompiled = swSource
  // Enlever la référence lib
  .replace(/\/\/\/ <reference lib="webworker" \/>/g, "")
  // Enlever les déclarations de type
  .replace(/declare const self: ServiceWorkerGlobalScope;/g, "")
  // Enlever les types enum
  .replace(/enum CacheStrategy \{[\s\S]*?\}/g, "")
  // Enlever les annotations de type dans les fonctions
  .replace(/: ExtendableEvent/g, "")
  .replace(/: FetchEvent/g, "")
  .replace(/: Request/g, "")
  .replace(/: string/g, "")
  .replace(/: Response/g, "")
  .replace(/: Promise<Response>/g, "")
  .replace(/: Promise<void>/g, "")
  .replace(/: Promise<number>/g, "")
  .replace(/: ExtendableMessageEvent/g, "")
  .replace(/: PushEvent/g, "")
  .replace(/: NotificationEvent/g, "")
  .replace(/: SyncEvent/g, "")
  // Enlever export {}
  .replace(/export \{\};/g, "")
  // Remplacer les références à l'enum
  .replace(/CacheStrategy\.\w+/g, (match) => {
    return `'${match.split(".")[1].toLowerCase().replace(/_/g, "-")}'`;
  });

// Écrire le fichier JavaScript compilé
fs.writeFileSync(path.join(__dirname, "../public/sw.js"), swCompiled, "utf-8");

console.log("✓ Service Worker compilé avec succès: public/sw.js");

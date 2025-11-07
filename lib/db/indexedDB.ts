const DB_NAME = "nutrition_app";
const DB_VERSION = 3; // v3: Ajout plannings_hebdomadaires

export interface DBStore {
  name: string;
  keyPath: string;
  indexes?: Array<{ name: string; keyPath: string; unique: boolean }>;
}

// Définition des stores
export const STORES: DBStore[] = [
  {
    name: "aliments",
    keyPath: "id",
    indexes: [
      { name: "nom", keyPath: "nom", unique: true },
      { name: "categorie", keyPath: "categorie", unique: false },
    ],
  },
  {
    name: "menus",
    keyPath: "id",
    indexes: [
      { name: "nom", keyPath: "nom", unique: false },
      { name: "date_creation", keyPath: "date_creation", unique: false },
    ],
  },
  {
    name: "journal_quotidien",
    keyPath: "id",
    indexes: [
      { name: "date", keyPath: "date", unique: true },
    ],
  },
  {
    name: "analyses",
    keyPath: "id",
    indexes: [
      { name: "date", keyPath: "date", unique: false },
    ],
  },
  {
    name: "seances_sport",
    keyPath: "id",
    indexes: [
      { name: "date", keyPath: "date", unique: false },
    ],
  },
  {
    name: "profil",
    keyPath: "id",
  },
  {
    name: "programme_sportif",
    keyPath: "id",
    indexes: [
      { name: "semaine", keyPath: "semaine", unique: true },
    ],
  },
  {
    name: "archives_courses",
    keyPath: "id",
    indexes: [
      { name: "date_archive", keyPath: "date_archive", unique: false },
      { name: "date_creation", keyPath: "date_creation", unique: false },
    ],
  },
  {
    name: "plannings_hebdomadaires",
    keyPath: "id",
    indexes: [
      { name: "date_debut_semaine", keyPath: "date_debut_semaine", unique: false },
      { name: "date_creation", keyPath: "date_creation", unique: false },
      { name: "est_archive", keyPath: "est_archive", unique: false },
    ],
  },
];

let dbInstance: IDBDatabase | null = null;

/**
 * Initialise et retourne la connexion IndexedDB
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Si déjà initialisé, retourner l'instance
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    // Vérifier si IndexedDB est disponible
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB n'est pas disponible dans cet environnement"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Erreur lors de l'ouverture de la base de données"));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Créer les object stores s'ils n'existent pas
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name)) {
          const objectStore = db.createObjectStore(store.name, {
            keyPath: store.keyPath,
          });

          // Créer les index
          if (store.indexes) {
            store.indexes.forEach((index) => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique,
              });
            });
          }
        }
      });
    };
  });
};

/**
 * Ferme la connexion à la base de données
 */
export const closeDB = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

/**
 * Supprime complètement la base de données (utile pour reset)
 */
export const deleteDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB n'est pas disponible"));
      return;
    }

    closeDB();

    const request = window.indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Erreur lors de la suppression de la base de données"));
    };
  });
};

/**
 * Exporte toutes les données de la base
 */
export const exportDB = async (): Promise<Record<string, any[]>> => {
  const db = await initDB();
  const data: Record<string, any[]> = {};

  for (const store of STORES) {
    const transaction = db.transaction(store.name, "readonly");
    const objectStore = transaction.objectStore(store.name);
    const request = objectStore.getAll();

    await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        data[store.name] = request.result;
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  return data;
};

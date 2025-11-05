import { initDB } from "./indexedDB";

/**
 * Génère un ID unique
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * CREATE - Ajoute un élément dans un store
 */
export const create = async <T extends { id: string }>(
  storeName: string,
  data: Omit<T, "id"> & { id?: string }
): Promise<T> => {
  const db = await initDB();

  const item = {
    ...data,
    id: data.id || generateId(),
  } as T;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => {
      resolve(item);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la création dans ${storeName}`));
    };
  });
};

/**
 * READ - Récupère un élément par son ID
 */
export const getById = async <T>(
  storeName: string,
  id: string
): Promise<T | undefined> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la lecture dans ${storeName}`));
    };
  });
};

/**
 * READ ALL - Récupère tous les éléments d'un store
 */
export const getAll = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la lecture dans ${storeName}`));
    };
  });
};

/**
 * UPDATE - Met à jour un élément
 */
export const update = async <T extends { id: string }>(
  storeName: string,
  data: T
): Promise<T> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => {
      resolve(data);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la mise à jour dans ${storeName}`));
    };
  });
};

/**
 * DELETE - Supprime un élément par son ID
 */
export const deleteById = async (
  storeName: string,
  id: string
): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la suppression dans ${storeName}`));
    };
  });
};

/**
 * QUERY - Recherche par index
 */
export const queryByIndex = async <T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors de la recherche dans ${storeName}`));
    };
  });
};

/**
 * COUNT - Compte le nombre d'éléments dans un store
 */
export const count = async (storeName: string): Promise<number> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.count();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors du comptage dans ${storeName}`));
    };
  });
};

/**
 * CLEAR - Vide complètement un store
 */
export const clear = async (storeName: string): Promise<void> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Erreur lors du vidage de ${storeName}`));
    };
  });
};

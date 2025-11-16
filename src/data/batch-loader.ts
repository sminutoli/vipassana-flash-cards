import { Flashcard } from '../types';

const BATCH_SIZE = 20;
const loadedBatches: Record<number, Flashcard[]> = {};

const dynamicImportBatch = (batchNumber: number): Promise<{ default: Flashcard[] }> => {
    // This uses a switch statement to help bundlers like Vite detect the dynamic imports.
    switch (batchNumber) {
        case 0: return import('./batches/batch-0');
        case 1: return import('./batches/batch-1');
        case 2: return import('./batches/batch-2');
        case 3: return import('./batches/batch-3');
        case 4: return import('./batches/batch-4');
        case 5: return import('./batches/batch-5');
        case 6: return import('./batches/batch-6');
        case 7: return import('./batches/batch-7');
        default: return Promise.reject(new Error(`Batch ${batchNumber} not found`));
    }
};


export async function getCardById(id: number): Promise<Flashcard | undefined> {
  const batchNumber = Math.floor(id / BATCH_SIZE);

  if (!loadedBatches[batchNumber]) {
    try {
      const batchModule = await dynamicImportBatch(batchNumber);
      loadedBatches[batchNumber] = batchModule.default;
    } catch (e) {
      console.error(`Failed to load batch ${batchNumber} for card ID ${id}`, e);
      return undefined;
    }
  }

  const batch = loadedBatches[batchNumber];
  return batch.find(card => card.id === id);
}

export async function preloadBatchForCardId(id: number): Promise<void> {
    const batchNumber = Math.floor(id / BATCH_SIZE);
    if (!loadedBatches[batchNumber]) {
        try {
            const batchModule = await dynamicImportBatch(batchNumber);
            loadedBatches[batchNumber] = batchModule.default;
        } catch (e) {
            console.error(`Failed to preload batch ${batchNumber} for card ID ${id}`, e);
        }
    }
}

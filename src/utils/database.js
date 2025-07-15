const DB_NAME = 'DB';
const DB_VERSION = 1;
const USER_STORE = 'user';
const VOUCHER_STORE = 'voucher';

// Open or create IndexedDB
export function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			// Create store for single trip
			if (!db.objectStoreNames.contains(USER_STORE)) {
				db.createObjectStore(USER_STORE);
			}

			// Create store for image data
			if (!db.objectStoreNames.contains(VOUCHER_STORE)) {
				db.createObjectStore(VOUCHER_STORE, { keyPath: 'id', autoIncrement: true });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

// Save or update the user id (singleton)
export async function saveUserID(id) {
	const db = await openDB();
	const tx = db.transaction(USER_STORE, 'readwrite');
	tx.objectStore(USER_STORE).put({ userID: id }, 'singleton');
	await tx.done;
	db.close();
}

// Get the current user id
export async function getUserID() {
	const db = await openDB();
	const tx = db.transaction(USER_STORE, 'readonly');
	const result = await tx.objectStore(USER_STORE).get('singleton');
	db.close();
	return result?.userID || null;
}

// Save an image with metadata
export async function saveVoucher({ imageBlob, description, date }) {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readwrite');
	tx.objectStore(VOUCHER_STORE).add({ image: imageBlob, description, date });
	await tx.done;
	db.close();
}

// Get all stored images
export async function getAllImages() {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readonly');
	const images = await tx.objectStore(VOUCHER_STORE).getAll();
	db.close();
	return images;
}

// Delete all images
export async function clearImages() {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readwrite');
	await tx.objectStore(VOUCHER_STORE).clear();
	db.close();
}

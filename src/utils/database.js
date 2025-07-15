const DB_NAME = 'DB';
const DB_VERSION = 1;

const TRIP_STORE = 'trip';
const VOUCHER_STORE = 'voucher';

// Open or create IndexedDB
function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			// Create store for the active trip identifier
			if (!db.objectStoreNames.contains(TRIP_STORE)) {
				db.createObjectStore(TRIP_STORE);
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

async function activateTrip(id) {
	const db = await openDB();
	const tx = db.transaction(TRIP_STORE, 'readwrite');
	
	tx.objectStore(TRIP_STORE).put({ tripID: id }, 'singleton');
	await tx.done;
	
	db.close();
}

async function getActiveTrip() {
	const db = await openDB();
	const tx = db.transaction(TRIP_STORE, 'readonly');
	const store = tx.objectStore(TRIP_STORE);
	
	return new Promise((resolve, reject) => {
		const request = store.get('singleton');
		request.onsuccess = () => {
			db.close();
			resolve(request.result?.tripID || null);
		};
		request.onerror = () => {
			db.close();
			reject(request.error);
		};
	});
}

async function validateTrip(id) {
	const activeTrip = await getActiveTrip();

	if (!activeTrip) {
		// If no trip is active, activate a new trip.
		await activateTrip(id);
	} else if (activeTrip === id) {
		// The current trip is still active
		return;
	} else {
		// If a new trip has activated, clear the previous vouchers and activate the new trip.
		await clearVouchers();
		await activateTrip(id);
	}
}

// Save a voucher
async function saveVoucher({ imageData, description, date }) {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readwrite');

	tx.objectStore(VOUCHER_STORE).add({ image: imageData, description, date });
	await tx.done;

	db.close();
}

// Delete a specific voucher by ID
async function deleteVoucher(id) {
    const db = await openDB();
    const tx = db.transaction(VOUCHER_STORE, 'readwrite');
    
    await tx.objectStore(VOUCHER_STORE).delete(id);
    await tx.done;
    
    db.close();
}

// Get all stored vouchers
async function getAllVouchers() {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readonly');
	const store = tx.objectStore(VOUCHER_STORE);
	
	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => {
			db.close();
			resolve(request.result);
		};
		request.onerror = () => {
			db.close();
			reject(request.error);
		};
	});
}

// Delete all vouchers
async function clearVouchers() {
	const db = await openDB();
	const tx = db.transaction(VOUCHER_STORE, 'readwrite');

	await tx.objectStore(VOUCHER_STORE).clear();

	db.close();
}

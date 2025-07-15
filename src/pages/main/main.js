const camInput = document.getElementById('cameraInput');
const goButton = document.getElementById('goButton');
const exitButton = document.getElementById("exitButton");
const voucherContainer = document.getElementById('voucherContainer');

// Function to display vouchers
async function displayVouchers() {
    const vouchers = await getAllVouchers();
    voucherContainer.innerHTML = ''; // Clear previous content

    if (vouchers.length === 0) {
        voucherContainer.innerHTML = '<p></p>';
        return;
    }

    vouchers.sort((a, b) => b.id - a.id); // Sort vouchers by ID from highest to lowest

    vouchers.forEach(voucher => {
        const voucherDiv = document.createElement('div');
        voucherDiv.classList.add('voucher-item');
        voucherDiv.dataset.id = voucher.id; // Store voucher ID in data attribute

        const image = document.createElement('img');
        image.src = voucher.image;
        image.alt = 'Fiş Resmi';

        const description = document.createElement('h1');
        description.textContent = `${voucher.description}`;

        const date = document.createElement('p');
        date.textContent = `${voucher.date}`;

        const voucherDetailsDiv = document.createElement('div');
        voucherDetailsDiv.classList.add('voucher-details');

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('voucher-actions');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'SİL';
        deleteButton.classList.add('voucher-button', 'delete-button');

        // Add event listener to delete button
        deleteButton.addEventListener('click', async () => {
            if (confirm('Bu fişi silmek istediğinizden emin misiniz?')) {
                await deleteVoucher(voucher.id); // Use voucher.id directly
                displayVouchers(); // Refresh the list after deletion
            }
        });

        actionsDiv.appendChild(deleteButton);

        voucherDetailsDiv.appendChild(description);
        voucherDetailsDiv.appendChild(date);
        voucherDetailsDiv.appendChild(actionsDiv); // Append actions div to voucher details

        voucherDiv.appendChild(image);
        voucherDiv.appendChild(voucherDetailsDiv);
        voucherContainer.appendChild(voucherDiv);
    });
}

// Call displayVouchers on page load
document.addEventListener('DOMContentLoaded', displayVouchers);

goButton.addEventListener('click', () => {
    camInput.click();
});

exitButton.addEventListener("click", function () {
    if (confirm('Çıkmak istediğinizden emin misiniz?')) {
        window.location.href = '../../../index.html';
    }
});

camInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            sessionStorage.setItem('latestImage', e.target.result);
            window.location.href = '../send/send.html';
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const seferNumberEl = document.querySelector(".sefer-number");
    const statusIndicator = document.querySelector(".status-indicator");

    const activeTripID = await getActiveTrip();
    if (activeTripID) {
        seferNumberEl.textContent = activeTripID;
        statusIndicator.classList.remove("inactive");
    } else {
        seferNumberEl.textContent = "Aktif sefer yok";
        statusIndicator.classList.add("inactive");
    }
});
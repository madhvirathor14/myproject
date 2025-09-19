document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const subscriptionForm = document.getElementById('subscription-form');
    const subscriptionList = document.getElementById('subscription-list');
    const upcomingPaymentsList = document.getElementById('upcoming-payments-list');
    const formButton = document.getElementById('form-button');
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationStatus = document.getElementById('notification-status');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initial static data for popular subscriptions.
    // This will now be part of the dynamic subscriptions list.
    let initialSubscriptions = [
        { id: 1, name: 'Myntra Insider', price: 599, renewalDate: '2025-11-25', renewalCycle: 'Yearly' },
        { id: 2, name: 'Spotify Premium', price: 129, renewalDate: '2025-09-20', renewalCycle: 'Monthly' },
        { id: 3, name: 'Meesho Exclusive', price: 249, renewalDate: '2025-10-15', renewalCycle: 'Monthly' },
        { id: 4, name: 'Flipkart Plus', price: 499, renewalDate: '2025-12-01', renewalCycle: 'Yearly' },
        { id: 5, name: 'Amazon Prime', price: 1499, renewalDate: '2026-01-10', renewalCycle: 'Yearly' },
        { id: 6, name: 'Netflix Premium', price: 649, renewalDate: '2025-09-30', renewalCycle: 'Monthly' }
    ];

    let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || initialSubscriptions;
    let editingId = null;

    // --- Task 1: Responsive Navbar with Active Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            contentSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(link.dataset.section);
            targetSection.classList.add('active');

            if (link.dataset.section === 'upcoming-payments') {
                displayUpcomingPayments();
            }
        });
    });

    // --- Task 2: Add Subscription Form & Validation ---
    subscriptionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const renewalDate = document.getElementById('renewal-date').value;
        const renewalCycle = document.getElementById('renewal-cycle').value;

        // Basic Validation
        if (!name || !price || !renewalDate || !renewalCycle) {
            alert('Please fill out all fields.');
            return;
        }
        if (isNaN(price)) {
            alert('Price must be a number.');
            return;
        }

        const newSubscription = {
            id: editingId || Date.now(),
            name,
            price,
            renewalDate,
            renewalCycle
        };

        if (editingId) {
            // Edit existing subscription (Task 4)
            const index = subscriptions.findIndex(sub => sub.id === editingId);
            subscriptions[index] = newSubscription;
            editingId = null;
            formButton.textContent = 'Add Subscription';
        } else {
            // Add new subscription
            subscriptions.push(newSubscription);
        }

        saveAndDisplaySubscriptions();
        subscriptionForm.reset();
    });

    // Function to save and re-render subscriptions
    function saveAndDisplaySubscriptions() {
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        displaySubscriptions();
    }

    // --- Task 3: Display Subscriptions (Cards UI) ---
    function displaySubscriptions() {
        subscriptionList.innerHTML = '';
        subscriptions.forEach(sub => {
            const card = document.createElement('div');
            card.classList.add('subscription-card');
            card.dataset.id = sub.id;

            card.innerHTML = `
                <h4>${sub.name}</h4>
                <p><strong>Price:</strong> ₹${sub.price.toFixed(2)}</p>
                <p><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</p>
                <p><strong>Cycle:</strong> ${sub.renewalCycle}</p>
                <div class="card-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            subscriptionList.appendChild(card);
        });
    }

    // --- Task 4 & 5: Edit and Delete Buttons ---
    subscriptionList.addEventListener('click', (e) => {
        const card = e.target.closest('.subscription-card');
        if (!card) return;
        const subId = parseInt(card.dataset.id);
        const subscription = subscriptions.find(sub => sub.id === subId);

        if (e.target.classList.contains('edit-btn')) {
            // Task 4: Edit Subscription
            document.getElementById('name').value = subscription.name;
            document.getElementById('price').value = subscription.price;
            document.getElementById('renewal-date').value = subscription.renewalDate;
            document.getElementById('renewal-cycle').value = subscription.renewalCycle;
            
            editingId = subId;
            formButton.textContent = 'Update Subscription';
            document.getElementById('subscriptions').scrollIntoView({ behavior: 'smooth' });

        } else if (e.target.classList.contains('delete-btn')) {
            // Task 5: Delete Subscription
            if (confirm(`Are you sure you want to delete ${subscription.name}?`)) {
                subscriptions = subscriptions.filter(sub => sub.id !== subId);
                saveAndDisplaySubscriptions();
            }
        }
    });

    // --- Task 6: Upcoming Payments Section ---
    function displayUpcomingPayments() {
        upcomingPaymentsList.innerHTML = '';
        const today = new Date();
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);

        const upcoming = subscriptions.filter(sub => {
            const renewalDate = new Date(sub.renewalDate);
            return renewalDate >= today && renewalDate <= next7Days;
        });

        if (upcoming.length === 0) {
            upcomingPaymentsList.innerHTML = '<p>No upcoming payments in the next 7 days. 🎉</p>';
        } else {
            upcoming.forEach(sub => {
                const card = document.createElement('div');
                card.classList.add('subscription-card');
                card.innerHTML = `
                    <h4>${sub.name}</h4>
                    <p><strong>Price:</strong> ₹${sub.price.toFixed(2)}</p>
                    <p><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</p>
                    <p><strong>Cycle:</strong> ${sub.renewalCycle}</p>
                `;
                upcomingPaymentsList.appendChild(card);
            });
        }
    }

    // --- Task 8: User Profile & Settings ---
    // Notification Toggle
    notificationToggle.addEventListener('change', (e) => {
        notificationStatus.textContent = e.target.checked ? 'ON' : 'OFF';
    });

    // Change Password Form (Frontend Simulation)
    document.getElementById('change-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;
        if (newPass !== confirmPass) {
            alert('Passwords do not match.');
            return;
        }
        alert('Password change simulated successfully!');
        e.target.reset();
    });

    // Theme Toggle (Dark/Bright Mode)
    themeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        document.getElementById('theme-status').textContent = e.target.checked ? 'ON' : 'OFF';
    });

    // Initial display of subscriptions on page load
    displaySubscriptions();
});
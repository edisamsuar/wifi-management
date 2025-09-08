
        // Data pengguna dengan display name terpisah
        const validUsers = [
            { 
                username: "admin", 
                password: "password123", 
                displayName: "Administrator" 
            },
            { 
                username: "user", 
                password: "user123", 
                displayName: "Operator" 
            },
            { 
                username: "edi", 
                password: "edi", 
                displayName: "Tgk Edi Samsuar" 
            }
        ];

        // Fungsi untuk menangani login
        function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Cek kredensial
            const isValidUser = validUsers.find(user => 
                user.username === username && user.password === password
            );
            
            if (isValidUser) {
                // Simpan status login di sessionStorage
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('displayName', isValidUser.displayName);
                
                // Redirect ke dashboard
                window.location.href = '#dashboard';
                showDashboard();
            } else {
                // Tampilkan pesan error
                const errorMessage = document.getElementById('error-message');
                errorMessage.style.display = 'block';
            }
        }

        // Fungsi untuk logout
        function handleLogout() {
            // Hapus status login
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('displayName');
            
            // Kembali ke halaman login
            window.location.href = '#login';
            showLogin();
        }

        // Fungsi untuk menampilkan dashboard
        function showDashboard() {
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'block';
            
            // Tampilkan nama pengguna di header
            const displayName = sessionStorage.getItem('displayName');
            if (displayName) {
                document.getElementById('user-display-header').textContent = displayName;
            }
            
            // Inisialisasi dashboard
            initDashboard();
        }

        // Fungsi untuk menampilkan login
        function showLogin() {
            document.getElementById('login-page').style.display = 'flex';
            document.getElementById('dashboard-page').style.display = 'none';
            
            // Reset form login
            document.getElementById('login-form').reset();
            document.getElementById('error-message').style.display = 'none';
        }

        // Cek status login saat halaman dimuat
        function checkLoginStatus() {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');
            
            if (isLoggedIn === 'true') {
                showDashboard();
            } else {
                showLogin();
            }
        }

        // Inisialisasi dashboard
        function initDashboard() {
            const table = document.getElementById('invoiceTable');
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            
            // Hamburger menu functionality
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            hamburgerBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('show');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.nav-container') && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                }
            });
            
            // Fungsi untuk menghitung total terkumpul dan sisa dibutuhkan
            function updateFinancialSummary() {
                let totalTerkumpul = 0;
                
                // Hitung total dari pelanggan yang lunas
                rows.forEach(row => {
                    const statusCell = row.cells[2];
                    if (statusCell.classList.contains('status-lunas')) {
                        const amountText = row.cells[1].textContent;
                        const amount = parseInt(amountText.replace(/[^\d]/g, '')) || 0;
                        totalTerkumpul += amount;
                    }
                });
                
                // Format totalTerkumpul
                const formattedTerkumpul = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(totalTerkumpul);
                
                // Set nilai totalTerkumpul
                document.getElementById('totalTerkumpul').textContent = formattedTerkumpul;
                
                // Ambil nilai tagihan bulan ini
                const tagihanBulanIniText = document.getElementById('tagihanBulanIni').textContent;
                const tagihanBulanIni = parseInt(tagihanBulanIniText.replace(/[^\d]/g, '')) || 0;
                
                // Hitung sisa dibutuhkan
                const sisaDibutuhkan = tagihanBulanIni - totalTerkumpul;
                const formattedSisa = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(sisaDibutuhkan);
                
                // Set nilai sisa dibutuhkan
                document.getElementById('sisaDibutuhkan').textContent = formattedSisa;
            }
            
            // Fungsi untuk mengupdate ringkasan
            function updateSummary() {
                let totalAmount = 0;
                let lunasCount = 0;
                let tunggakCount = 0;
                let prosesCount = 0;
                
                rows.forEach(row => {
                    if (row.style.display !== 'none') {
                        const amountCell = row.cells[1];
                        const statusCell = row.cells[2];
                        
                        // Mengambil nilai tagihan dan mengkonversi ke angka
                        const amountText = amountCell.textContent;
                        const amount = parseInt(amountText.replace(/[^\d]/g, '')) || 0;
                        
                        totalAmount += amount;
                        
                        // Menghitung status
                        if (statusCell.classList.contains('status-lunas')) {
                            lunasCount++;
                        } else if (statusCell.classList.contains('status-tunggak')) {
                            tunggakCount++;
                        } else if (statusCell.classList.contains('status-proses')) {
                            prosesCount++;
                        }
                    }
                });
                
                // Memformat total tagihan
                const formattedTotal = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(totalAmount);
                
                // Update elemen HTML
                document.getElementById('totalAmount').textContent = formattedTotal;
                document.getElementById('lunasCount').textContent = lunasCount;
                document.getElementById('tunggakCount').textContent = tunggakCount;
                document.getElementById('prosesCount').textContent = prosesCount;
                
                // Update financial summary
                updateFinancialSummary();
            }
            
            // Fungsi untuk filter data
            function filterTable(filter) {
                rows.forEach(row => {
                    const statusCell = row.cells[2];
                    
                    if (filter === 'all') {
                        row.style.display = '';
                    } else if (filter === 'lunas' && statusCell.classList.contains('status-lunas')) {
                        row.style.display = '';
                    } else if (filter === 'tunggak' && statusCell.classList.contains('status-tunggak')) {
                        row.style.display = '';
                    } else if (filter === 'proses' && statusCell.classList.contains('status-proses')) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                updateSummary();
            }
            
            // Fungsi untuk mencari data
            function searchTable() {
                const searchText = document.getElementById('searchInput').value.toLowerCase();
                
                rows.forEach(row => {
                    const nameCell = row.cells[0];
                    const name = nameCell.textContent.toLowerCase();
                    
                    if (name.includes(searchText)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                updateSummary();
            }
            
            // Fungsi untuk mengurutkan data
            function sortTable(column, order) {
                const tbody = table.querySelector('tbody');
                const sortedRows = Array.from(rows);
                
                sortedRows.sort((a, b) => {
                    let aValue = a.cells[column].textContent;
                    let bValue = b.cells[column].textContent;
                    
                    if (column === 1) { // Jika kolom tagihan
                        aValue = parseInt(aValue.replace(/[^\d]/g, '')) || 0;
                        bValue = parseInt(bValue.replace(/[^\d]/g, '')) || 0;
                    }
                    
                    if (order === 'asc') {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                });
                
                // Hapus baris yang ada
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }
                
                // Tambahkan baris yang sudah diurutkan
                sortedRows.forEach(row => {
                    tbody.appendChild(row);
                });
            }
            
            // Event listener untuk filter
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    filterTable(filter);
                });
            });
            
            // Event listener untuk pencarian
            document.getElementById('searchInput').addEventListener('input', searchTable);
            
            // Event listener untuk pengurutan
            document.querySelectorAll('th').forEach((header, columnIndex) => {
                let order = 'asc';
                
                header.addEventListener('click', function() {
                    sortTable(columnIndex, order);
                    order = order === 'asc' ? 'desc' : 'asc';
                });
            });
            
            // Logout button functionality
            document.querySelectorAll('.logout-btn').forEach(button => {
                button.addEventListener('click', function() {
                    if (confirm('Apakah Anda yakin ingin logout?')) {
                        handleLogout();
                    }
                });
            });
            
            // Inisialisasi ringkasan
            updateSummary();
        }

        // Event listener untuk form login
        document.getElementById('login-form').addEventListener('submit', handleLogin);

        // Jalankan fungsi saat halaman dimuat
        window.addEventListener('DOMContentLoaded', checkLoginStatus);
        
        // Handle hash changes
        window.addEventListener('hashchange', function() {
            if (window.location.hash === '#dashboard') {
                showDashboard();
            } else if (window.location.hash === '#login') {
                showLogin();
            }
        });
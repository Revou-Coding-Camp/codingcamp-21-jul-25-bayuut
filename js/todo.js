// Seleksi semua elemen HTML yang dibutuhkan
const todoForm = document.querySelector('#todo-form');
const taskInput = document.querySelector('#task');
const dateInput = document.querySelector('#date');
const taskList = document.querySelector('#task-list');
const deleteAllBtn = document.querySelector('#delete-all-btn');
const filterBtn = document.querySelector('#filter-btn');
const filterDropdown = document.querySelector('#filter-dropdown');

// "Database" sementara menggunakan array dan variabel filter
// Mengambil data dari localStorage jika ada, jika tidak, mulai dengan array kosong
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Fungsi untuk menyimpan data ke LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//  Fungsi untuk menampilkan (render) semua task ke layar
function renderTasks() {
    // Simpan header, lalu bersihkan isi list
    const listHeader = taskList.querySelector('.flex');
    taskList.innerHTML = '';
    taskList.appendChild(listHeader); // Kembalikan header

    // Filter tasks berdasarkan filter yang aktif
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.isDone;
        if (currentFilter === 'done') return task.isDone;
        return true; // 'all'
    });

    if (filteredTasks.length === 0) {
        const noTaskMessage = `<div class="text-center text-gray-500 py-6">No tasks found</div>`;
        taskList.insertAdjacentHTML('beforeend', noTaskMessage);
    } else {
        filteredTasks.forEach(task => {
            const taskStatusClass = task.isDone ? 'bg-green-500' : 'bg-yellow-500';
            const taskStatusText = task.isDone ? 'Done' : 'Pending';
            const taskTextClass = task.isDone ? 'line-through text-gray-500' : 'text-white';
            
            const taskElement = `
                <div class="flex items-center justify-between bg-[#1e223a] p-3 rounded-lg animate-fade-in">
                    <div class="w-2/5 ${taskTextClass}">${task.text}</div>
                    <div class="w-1/4 text-center text-gray-300 text-sm">${task.date}</div>
                    <div class="w-1/6 text-center">
                        <span class="${taskStatusClass} text-white text-xs font-semibold px-2 py-1 rounded-full cursor-pointer" data-id="${task.id}" data-action="toggle">${taskStatusText}</span>
                    </div>
                    <div class="w-1/6 flex justify-end gap-2 text-gray-400">
                        <button class="hover:text-red-500" data-id="${task.id}" data-action="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

                        </button>
                    </div>
                </div>`;
            taskList.insertAdjacentHTML('beforeend', taskElement);
        });
    }
}

// Event listener untuk form submission (menambah task)
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah halaman refresh

    const newTask = {
        id: Date.now(), // ID unik berdasarkan waktu
        text: taskInput.value,
        date: dateInput.value,
        isDone: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    todoForm.reset();
    taskInput.focus();
});

// Event listener untuk aksi di dalam list (delete atau toggle status)
taskList.addEventListener('click', (e) => {
    const actionElement = e.target.closest('[data-action]');
    if (!actionElement) return;
    
    const id = actionElement.dataset.id;
    const action = actionElement.dataset.action;

    if (action === 'delete') {
        tasks = tasks.filter(task => task.id != id);
    }

    if (action === 'toggle') {
        const task = tasks.find(task => task.id == id);
        if (task) {
            task.isDone = !task.isDone;
        }
    }
    
    saveTasks();
    renderTasks();
});

// Event listener untuk tombol "Delete All"
deleteAllBtn.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

// Event listener untuk filter dropdown
// Tampilkan/sembunyikan dropdown saat tombol filter utama diklik
filterBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event 'click' menyebar ke window
    filterDropdown.classList.toggle('hidden');
});

// Pilih filter saat salah satu opsi di dropdown diklik
filterDropdown.addEventListener('click', (e) => {
    // Pastikan yang diklik adalah tombol di dalam dropdown
    if (e.target.tagName === 'BUTTON') {
        currentFilter = e.target.dataset.filter;
        renderTasks();
        filterDropdown.classList.add('hidden'); // Sembunyikan dropdown setelah memilih
    }
});

// Sembunyikan dropdown jika klik di luar area filter
window.addEventListener('click', () => {
    if (!filterDropdown.classList.contains('hidden')) {
        filterDropdown.classList.add('hidden');
    }
});

// Panggil renderTasks() saat halaman pertama kali dimuat
renderTasks();
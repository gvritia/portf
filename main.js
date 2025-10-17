// Функция для отправки формы (используется на contacts.html)
function submitForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        category: formData.get('category'),
        message: formData.get('message')
    };

    console.log('Данные формы:', data);
    alert('Спасибо! Ваше обращение отправлено. Мы свяжемся с вами в ближайшее время.');
    form.reset();
}

// Функции для работы с учебным дневником
function initDiary() {
    const addEntryBtn = document.getElementById('addEntryBtn');
    if (!addEntryBtn) return;

    createAddEntryModal();
    addEntryBtn.addEventListener('click', openAddEntryModal);
}

function createAddEntryModal() {
    if (document.getElementById('diaryModal')) return;

    const modalHTML = `
        <dialog class="modal" id="diaryModal">
            <div class="modal-header">
                <h2 class="modal-header__title">Добавить учебную запись</h2>
            </div>
            <div class="modal-content">
                <form id="diaryForm" class="diary-form">
                    <div class="form-group">
                        <label class="form-group__label">Дата <span class="required">*</span></label>
                        <input type="date" id="entryDate" class="form-group__input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-group__label">Курс/Предмет <span class="required">*</span></label>
                        <select id="entryCourse" class="form-group__select" required>
                            <option value="">Выберите курс</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="HTML/CSS">HTML/CSS</option>
                            <option value="React">React</option>
                            <option value="Базы данных">Базы данных</option>
                            <option value="Другой">Другой</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="customCourseGroup" style="display: none;">
                        <label class="form-group__label">Название курса</label>
                        <input type="text" id="customCourse" class="form-group__input" placeholder="Введите название курса">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-group__label">Задача/Тема <span class="required">*</span></label>
                        <input type="text" id="entryTask" class="form-group__input" required placeholder="Например: Верстка макета сайта">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-group__label">Статус <span class="required">*</span></label>
                        <select id="entryStatus" class="form-group__select" required>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="planned">Planned</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-group__label">Прогресс курса (%)</label>
                        <input type="range" id="entryProgress" class="form-group__input" min="0" max="100" value="0">
                        <span id="progressValue">0%</span>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn--secondary" id="cancelEntryBtn">Отмена</button>
                        <button type="submit" class="btn btn--primary">Добавить запись</button>
                    </div>
                </form>
            </div>
        </dialog>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupDiaryModalEvents();
}

function setupDiaryModalEvents() {
    const diaryModal = document.getElementById('diaryModal');
    const diaryForm = document.getElementById('diaryForm');
    const cancelBtn = document.getElementById('cancelEntryBtn');
    const courseSelect = document.getElementById('entryCourse');
    const progressInput = document.getElementById('entryProgress');

    if (diaryModal) {
        diaryModal.addEventListener('click', (e) => e.target === diaryModal && diaryModal.close());
    }

    cancelBtn?.addEventListener('click', () => diaryModal?.close());

    courseSelect?.addEventListener('change', () => {
        document.getElementById('customCourseGroup').style.display =
            courseSelect.value === 'Другой' ? 'block' : 'none';
    });

    progressInput?.addEventListener('input', () => {
        document.getElementById('progressValue').textContent = progressInput.value + '%';
    });

    diaryForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        addDiaryEntry();
    });
}

function openAddEntryModal() {
    const diaryModal = document.getElementById('diaryModal');
    if (!diaryModal) return;

    const dateInput = document.getElementById('entryDate');
    const diaryForm = document.getElementById('diaryForm');
    const progressInput = document.getElementById('entryProgress');

    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (diaryForm) diaryForm.reset();
    if (progressInput) {
        progressInput.value = 0;
        document.getElementById('progressValue').textContent = '0%';
    }

    document.getElementById('customCourseGroup').style.display = 'none';
    diaryModal.showModal();
}

function addDiaryEntry() {
    const elements = {
        date: document.getElementById('entryDate'),
        course: document.getElementById('entryCourse'),
        customCourse: document.getElementById('customCourse'),
        task: document.getElementById('entryTask'),
        status: document.getElementById('entryStatus'),
        progress: document.getElementById('entryProgress')
    };

    // Валидация
    if (!elements.date.value || !elements.course.value || !elements.task.value) {
        alert('Пожалуйста, заполните обязательные поля (отмечены *)');
        return;
    }

    const courseName = elements.course.value === 'Другой'
        ? (elements.customCourse?.value || 'Новый курс')
        : elements.course.value;

    const entryData = {
        date: formatDate(elements.date.value),
        course: courseName,
        task: elements.task.value,
        status: elements.status.value,
        progress: parseInt(elements.progress?.value || 0)
    };

    addEntryToUI(entryData);
    updateCourseProgress(entryData.course, entryData.progress);

    document.getElementById('diaryModal').close();
    alert('Запись успешно добавлена!');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('ru-RU', { month: 'short' })}`;
}

function addEntryToUI(entryData) {
    const progressTimeline = document.querySelector('.progress-timeline');
    if (!progressTimeline) return;

    const statusConfig = {
        'in-progress': { text: 'in progress', class: 'progress-item--in-progress' },
        'completed': { text: '✓', class: 'progress-item--completed' },
        'planned': { text: 'planned', class: 'progress-item--planned' }
    };

    const status = statusConfig[entryData.status] || statusConfig['in-progress'];

    const entryHTML = `
        <div class="progress-item ${status.class}">
            <span class="progress-item__date">${entryData.date}</span>
            <span class="progress-item__task">${entryData.task}</span>
            <span class="progress-item__status">${status.text}</span>
        </div>
    `;

    progressTimeline.insertAdjacentHTML('afterbegin', entryHTML);
}

function updateCourseProgress(courseName, progress) {
    const coursesList = document.querySelector('.courses-list');
    if (!coursesList) return;

    // Ищем существующий курс
    const existingCard = [...coursesList.querySelectorAll('.course-card')]
        .find(card => card.querySelector('.course-card__title')?.textContent === courseName);

    if (existingCard) {
        const progressElement = existingCard.querySelector('.course-card__progress');
        const progressBar = existingCard.querySelector('.progress-bar__fill');

        if (progressElement) progressElement.textContent = progress + '%';
        if (progressBar) progressBar.style.width = progress + '%';
    } else {
        // Создаем новую карточку
        const newCourseHTML = `
            <div class="course-card">
                <div class="course-card__header">
                    <h3 class="course-card__title">${courseName}</h3>
                    <span class="course-card__progress">${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar__fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
        coursesList.insertAdjacentHTML('beforeend', newCourseHTML);
    }
}

// Инициализация всех функций при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики для контактной формы
    const contactModal = document.getElementById('contactModal');
    const feedbackForm = document.getElementById('feedbackForm');

    if (contactModal) {
        contactModal.addEventListener('click', (e) => e.target === contactModal && contactModal.close());
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm();
        });

        feedbackForm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
            }
        });
    }

    // Инициализация дневника
    initDiary();
});
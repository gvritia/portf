// Функция для отправки формы (используется на contacts.html)
function submitForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return; // Если формы нет, выходим тихо

    const formData = new FormData(form);

    // Простая валидация
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Собираем данные формы
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        category: formData.get('category'),
        message: formData.get('message')
    };

    // В реальном приложении здесь был бы AJAX-запрос
    console.log('Данные формы:', data);

    // Показываем уведомление об успешной отправке
    alert('Спасибо! Ваше обращение отправлено. Мы свяжемся с вами в ближайшее время.');

    // Очищаем форму
    form.reset();
}

// Код для модального окна (только если элементы существуют)
document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', function (event) {
            if (event.target === this) {
                this.close();
            }
        });
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        // Обработчик отправки формы
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Предотвращаем стандартную отправку
            submitForm();
        });

        feedbackForm.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && event.target.type !== 'textarea') {
                event.preventDefault();
            }
        });
    }
});
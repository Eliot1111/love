// Целевая дата - 16 февраля
const targetDate = new Date();
targetDate.setMonth(1); // Февраль (месяцы начинаются с 0)
targetDate.setDate(16);

// Если 16 февраля уже прошло в этом году, берем следующий год
const today = new Date();
if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
}

// Начальная дата - 18 декабря предыдущего года
const startDate = new Date(targetDate.getFullYear(), 11, 18); // 18 декабря (месяцы начинаются с 0, декабрь = 11)
// Если 18 декабря еще не наступило в этом году, берем предыдущий год
if (startDate > targetDate) {
    startDate.setFullYear(targetDate.getFullYear() - 1);
}

// Получаем элементы
const circle1 = document.getElementById('circle1');
const circle2 = document.getElementById('circle2');
const daysLeftEl = document.getElementById('daysLeft');
const progressEl = document.getElementById('progress');
const connectionLine = document.getElementById('connectionLine');
const line = document.getElementById('line');

function updatePositions() {
    const now = new Date();
    
    // Вычисляем прогресс от начальной даты до целевой
    const totalDays = (targetDate - startDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - startDate) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    
    // Прогресс от 0 до 1
    let progress = Math.min(Math.max(daysPassed / totalDays, 0), 1);
    
    // Если дата уже прошла, прогресс = 1
    if (now >= targetDate) {
        progress = 1;
    }
    
    // Вычисляем позиции кружочков
    // Начальные позиции: один слева (20%), другой справа (80%)
    // Конечные позиции: оба в центре (50%)
    const startLeft = 20; // процент от левого края
    const startRight = 80; // процент от левого края
    const endCenter = 50; // процент от левого края
    
    // Позиция первого кружочка (двигается справа налево к центру)
    const circle1Left = startLeft + (endCenter - startLeft) * progress;
    
    // Позиция второго кружочка (двигается слева направо к центру)
    const circle2Right = (100 - startRight) + (100 - endCenter - (100 - startRight)) * progress;
    const circle2Left = 100 - circle2Right;
    
    // Применяем позиции (с учетом transform: translate(-50%, -50%))
    circle1.style.left = circle1Left + '%';
    circle2.style.left = circle2Left + '%';
    
    // Обновляем линию между кружочками
    updateConnectionLine();
    
    // Обновляем информацию
    if (daysRemaining > 0) {
        daysLeftEl.textContent = `Осталось дней: ${daysRemaining}`;
    } else {
        daysLeftEl.textContent = 'День встречи! 💕';
    }
    
    progressEl.textContent = `Прогресс: ${Math.round(progress * 100)}%`;
    
    // Если кружочки встретились, делаем их больше и ближе
    if (progress >= 1) {
        // Адаптивные размеры в зависимости от ширины экрана
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;
        
        let size = '180px';
        if (isMobile) {
            size = '120px';
        } else if (isTablet) {
            size = '150px';
        }
        
        circle1.style.width = size;
        circle1.style.height = size;
        circle2.style.width = size;
        circle2.style.height = size;
        circle1.style.left = '45%';
        circle2.style.left = '55%';
        updateConnectionLine();
    }
}

// Функция для обновления линии между кружочками
function updateConnectionLine() {
    if (!line || !circle1 || !circle2) return;
    
    // Получаем позиции центров кружочков
    const rect1 = circle1.getBoundingClientRect();
    const rect2 = circle2.getBoundingClientRect();
    const containerRect = connectionLine.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
    
    // Устанавливаем координаты линии
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
}

// Обработка ошибок загрузки изображений
function handleImageError(img, gradient) {
    console.log('Ошибка загрузки изображения:', img.src);
    img.style.display = 'none';
    const circle = img.parentElement;
    circle.style.background = gradient;
    if (!circle.querySelector('span')) {
        const emoji = document.createElement('span');
        emoji.style.cssText = 'color: white; font-size: 24px;';
        emoji.textContent = '💕';
        circle.appendChild(emoji);
    }
}

// Ждем загрузки DOM перед добавлением обработчиков
document.addEventListener('DOMContentLoaded', function() {
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    
    // Проверяем, загрузилось ли изображение
    if (photo1.complete && photo1.naturalHeight === 0) {
        handleImageError(photo1, 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)');
    } else {
        photo1.addEventListener('error', function() {
            handleImageError(this, 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)');
        });
        photo1.addEventListener('load', function() {
            console.log('photo1.jpg успешно загружено');
            setTimeout(updateConnectionLine, 100);
        });
    }
    
    if (photo2.complete && photo2.naturalHeight === 0) {
        handleImageError(photo2, 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)');
    } else {
        photo2.addEventListener('error', function() {
            handleImageError(this, 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)');
        });
        photo2.addEventListener('load', function() {
            console.log('photo2.jpg успешно загружено');
            setTimeout(updateConnectionLine, 100);
        });
    }
});

// Обновляем позиции при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updatePositions();
    });
} else {
    updatePositions();
}

// Обновляем позиции каждую минуту
setInterval(updatePositions, 60000);

// Обновляем при изменении размера окна
window.addEventListener('resize', function() {
    updatePositions();
    // Небольшая задержка для корректного расчета после изменения размера
    setTimeout(updateConnectionLine, 100);
});

// Обновляем линию при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateConnectionLine, 100);
    });
} else {
    setTimeout(updateConnectionLine, 100);
}


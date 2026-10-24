(function () {
    const base = '/images/cursor/';
    const size = 64;

    const cursor = document.createElement('img');
    cursor.id = 'custom-cursor';
    cursor.alt = '';
    cursor.draggable = false;

    Object.assign(cursor.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: size + 'px',
        height: size + 'px',
        pointerEvents: 'none',
        zIndex: '2147483647',
        display: 'none'
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(cursor);
        cursor.style.display = 'block';
    });

    let middleDown = false;
    let currentType = '';

    function updateCursor(type) {
        if (currentType === type) {
            return;
        }

        currentType = type;
        cursor.src = base + type + '.png';

        if (type === 'text') {
            cursor.style.transform = 'translate(-25px, -10px)';
        } else {
            cursor.style.transform = 'translate(0, 0)';
        }
    }

    function getCursorType(el) {
        if (middleDown) {
            return 'move';
        }

        if (!(el instanceof Element)) {
            return 'normal';
        }

        if (el.closest(
            'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), ' +
            'textarea, [contenteditable="true"], [contenteditable=""]'
        )) {
            return 'text';
        }

        if (el.closest(
            'a, button, [role="button"], .btn, ' +
            'input[type="button"], input[type="submit"], ' +
            'input[type="checkbox"], input[type="radio"], select, summary'
        )) {
            return 'pointer';
        }

        if (el.closest(
            'p, h1, h2, h3, h4, h5, h6, li, blockquote, ' +
            'td, th, label'
        )) {
            return 'text';
        }

        return 'normal';
    }

    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        updateCursor(getCursorType(e.target));
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            middleDown = true;
            updateCursor('move');
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (e.button === 1) {
            middleDown = false;
            updateCursor(getCursorType(e.target));
        }
    });

    window.addEventListener('blur', function () {
        middleDown = false;
    });

    document.addEventListener('mouseover', function (e) {
        updateCursor(getCursorType(e.target));
    });

    document.addEventListener('mouseleave', function () {
        cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', function () {
        cursor.style.display = 'block';
    });
})();
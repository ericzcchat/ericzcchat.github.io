
(function () {
    const base = '/images/cursor/';
    const size = 64;

    // 各图标的热点坐标，单位为像素
    // hotX：热点距离图片左边的距离
    // hotY：热点距离图片顶部的距离
    const hotspots = {
        normal: { x: 10, y: 10 },
        text: { x: 35, y: 30 },
        pointer: { x: 10, y: 10 },
        move: { x: 32, y: 32 }
    };

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

    function initCursor() {
        if (!cursor.isConnected) {
            document.body.appendChild(cursor);
        }
        cursor.style.display = 'block';
    }

    if (document.body) {
        initCursor();
    } else {
        document.addEventListener('DOMContentLoaded', initCursor, {
            once: true
        });
    }

    let middleDown = false;
    let middleScroll = false;
    let currentType = '';

    function updateCursor(type) {
        if (currentType === type) {
            return;
        }

        currentType = type;
        cursor.src = base + type + '.png';

        const hot = hotspots[type] || { x: 0, y: 0 };
        cursor.style.transform =
            'translate(' + (-hot.x) + 'px, ' + (-hot.y) + 'px)';
    }

    function getCursorType(el) {
        if (middleDown || middleScroll) {
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
        lastX = e.clientX;
        lastY = e.clientY;

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        if (middleDown || middleScroll) {
            updateCursor('move');
            return;
        }

        updateCursor(getCursorType(e.target));
    });

    document.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            if (middleScroll) {
                // 再次按下中键，退出自动滚动状态
                middleScroll = false;
                middleDown = false;

                updateCursor(getCursorType(e.target));
            } else {
                middleDown = true;
                middleScroll = true;

                updateCursor('move');
            }

            return;
        }

        // 其他鼠标按键结束自动滚动状态
        if (middleScroll) {
            middleScroll = false;
            middleDown = false;

            updateCursor(getCursorType(e.target));
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (e.button === 1) {
            if (middleDown) {
                middleDown = false;

                if (middleScroll) {
                    updateCursor('move');
                    return;
                }
            } else if (middleScroll) {
                // Edge 未派发第二次 mousedown，但派发了 mouseup
                middleScroll = false;
            }

            const el = document.elementFromPoint(e.clientX, e.clientY);
            updateCursor(getCursorType(el));
            return;
        }

        if (middleScroll || middleDown) {
            middleDown = false;
            middleScroll = false;

            const el = document.elementFromPoint(e.clientX, e.clientY);
            updateCursor(getCursorType(el));
        }
    });

    let lastX = 0;
    let lastY = 0;

    window.addEventListener('blur', function () {
        middleDown = false;
        middleScroll = false;
    });

    document.addEventListener('mouseover', function (e) {
        if (middleDown || middleScroll) {
            updateCursor('move');
            return;
        }

        updateCursor(getCursorType(e.target));
    });

    document.addEventListener('mouseleave', function () {
        cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', function () {
        cursor.style.display = 'block';
    });
})();

const glitchOverlay = document.getElementById('glitch-overlay');
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');
const LOCK_KEY = 'art_r_perm_lock';

// ロック状態チェック
if (localStorage.getItem(LOCK_KEY) === 'true') {
    activateLock();
}

// フェードイン
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));

// 激しいノイズ描画
function drawNoise() {
    if (localStorage.getItem(LOCK_KEY) !== 'true') return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const idata = ctx.createImageData(canvas.width, canvas.height);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
        if (Math.random() > 0.95) {
            buffer32[i] = Math.random() > 0.5 ? 0xFF0000FF : 0xFFFFFF00; // カラーノイズ
        } else {
            const gray = (Math.random() * 255) | 0;
            buffer32[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
        }
    }

    ctx.putImageData(idata, 0, 0);

    // スキャンライン的な乱れ
    if (Math.random() > 0.9) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 100);
    }

    requestAnimationFrame(drawNoise);
}

function activateLock() {
    localStorage.setItem(LOCK_KEY, 'true');
    glitchOverlay.style.display = 'block';
    drawNoise();
}

// スクロール監視
window.addEventListener('scroll', () => {
    if (localStorage.getItem(LOCK_KEY) === 'true') return;

    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollTotal - 5) {
        activateLock();
    }
});

// システム復旧（データ消去）
function clearLock() {
    if (confirm("全てのローカルデータを消去し、システムを復旧しますか？")) {
        localStorage.removeItem(LOCK_KEY);
        location.reload();
    }
}

window.onresize = () => {
    if (localStorage.getItem(LOCK_KEY) === 'true') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
};

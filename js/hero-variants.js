(() => {
    const cycler = document.querySelector('[data-hero-cycler]');
    if (!cycler) return;

    const imgs = Array.from(cycler.querySelectorAll('img[data-variants]'));
    if (imgs.length === 0) return;

    const variants = imgs.map((img) =>
        img.dataset.variants.split(',').map((s) => s.trim()).filter(Boolean)
    );
    const length = Math.min(...variants.map((list) => list.length));
    if (length < 2) return;

    let index = 0;
    const advance = () => {
        index = (index + 1) % length;
        imgs.forEach((img, i) => {
            img.src = `assets/${variants[i][index]}.png`;
        });
    };

    cycler.addEventListener('click', advance);
    cycler.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            advance();
        }
    });
})();

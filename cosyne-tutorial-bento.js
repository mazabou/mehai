// COSYNE Tutorial Bento Animation
// Adapted from cosyne-tutorial.html

document.addEventListener('DOMContentLoaded', function () {
    const svg = document.getElementById('cosyne-tutorial-anim-svg');
    if (!svg) return;

    function render() {
        svg.innerHTML = '';

        // Measure the actual bento height and fill it
        const container = svg.closest('.cosyne-tutorial-bento-box') || svg.parentElement;
        const measuredHeight = Math.max(220, (container && container.clientHeight) ? container.clientHeight : 308);
        svg.setAttribute('viewBox', `0 0 1200 ${measuredHeight}`);

        // Configuration derived from measured height
        const svgWidth = 1200;
        const centerX = svgWidth / 2;
        const spread = 400;
        const rowHeight = Math.max(12, Math.floor(measuredHeight / 18));
        const numRows = Math.floor((measuredHeight - 10) / rowHeight);
        const spikesPerRow = 12;
        const bitsPerRow = 12;
        const spikeX0 = 20, spikeX1 = 580;
        const bitX0 = 620, bitX1 = 1180;
        const spikeColor = '#6d28d9';
        const bitColor = '#1d4ed8';
        const spikeLen = Math.max(24, Math.floor(rowHeight * 0.9));
        const bitFontSize = Math.max(16, Math.floor(rowHeight * 0.8));
        const animDur = 2.8;

        for (let row = 0; row < numRows; row++) {
            const y = 5 + row * rowHeight;

            // Spikes (left)
            for (let i = 0; i < spikesPerRow; i++) {
                const x = spikeX0 + Math.random() * (spikeX1 - spikeX0);
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                path.setAttribute('x1', x);
                path.setAttribute('y1', y - spikeLen / 2);
                path.setAttribute('x2', x);
                path.setAttribute('y2', y + spikeLen / 2);
                path.setAttribute('stroke', spikeColor);
                path.setAttribute('stroke-width', '4');
                path.setAttribute('opacity', '0.9');
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'opacity');
                animate.setAttribute('values', '0;1;0');
                animate.setAttribute('dur', animDur + 's');
                animate.setAttribute('begin', (i * 0.15 + row * 0.25) + 's');
                animate.setAttribute('repeatCount', 'indefinite');
                path.appendChild(animate);
                svg.appendChild(path);
            }

            // Bits (right to center)
            for (let i = 0; i < bitsPerRow; i++) {
                const x = bitX0 + i * ((bitX1 - bitX0) / (bitsPerRow - 1));
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', y + bitFontSize / 2 - 2);
                text.setAttribute('fill', bitColor);
                text.setAttribute('font-size', bitFontSize);
                text.setAttribute('font-family', 'monospace');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('opacity', '0.9');
                text.textContent = Math.random() < 0.5 ? '0' : '1';
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'opacity');
                animate.setAttribute('values', '0;1;0');
                const bitDur = (1.5 + Math.random() * 1.5).toFixed(2);
                const bitDelay = (Math.random() * 2.5).toFixed(2);
                animate.setAttribute('dur', bitDur + 's');
                animate.setAttribute('begin', bitDelay + 's');
                animate.setAttribute('repeatCount', 'indefinite');
                text.appendChild(animate);
                svg.appendChild(text);
            }
        }
    }

    render();
    window.addEventListener('resize', render);
});

const input = document.getElementById('colorInput');
const orb = document.getElementById('orb');
const hexText = document.getElementById('hexText');
const meshGrid = document.getElementById('meshGrid');
const mainSystem = document.getElementById('mainSystem');
const toast = document.getElementById('toast');

const cats = ["Primary", "Analogous", "Split", "Neutral", "Safe", "Alert", "Error", "Muted", "Neon", "Deep"];

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) h = s = 0;
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function update() {
    const hex = input.value.toUpperCase();
    orb.style.backgroundColor = hex;
    hexText.textContent = hex;
    const hsl = hexToHSL(hex);

    // Render Mesh Gradients
    meshGrid.innerHTML = '';
    const variations = [
        { name: "Liquid Sunlight", h: (hsl.h + 45) % 360 },
        { name: "Midnight Glass", h: (hsl.h + 210) % 360 }
    ];
    variations.forEach(v => {
        const card = document.createElement('div');
        card.className = 'mesh-card';
        const g = `linear-gradient(225deg, ${hex} 0%, hsl(${v.h}, ${hsl.s}%, 50%) 100%)`;
        card.style.background = g;
        card.innerHTML = v.name;
        card.onclick = () => copy(g);
        meshGrid.appendChild(card);
    });

    // Render 10 Tonal Categories
    mainSystem.innerHTML = '';
    cats.forEach((cat, i) => {
        let h = hsl.h, s = hsl.s;
        if(i === 1) h = (h + 30) % 360;
        if(i === 2) h = (h + 150) % 360;
        if(i === 3) s = 6;
        if(i === 4) { h = 145; s = 60; }
        if(i === 5) { h = 48; s = 90; }
        if(i === 6) { h = 0; s = 80; }
        if(i === 8) s = 100;

        const group = document.createElement('div');
        group.className = 'category-group';
        group.innerHTML = `<div class="group-title">${cat}</div><div id="st-${i}"></div>`;
        mainSystem.appendChild(group);

        const stack = document.getElementById(`st-${i}`);
        for(let j=0; j<9; j++){
            const l = 96 - (j * 10);
            const color = `hsl(${h}, ${s}%, ${l}%)`;
            const item = document.createElement('div');
            item.className = 'swatch-item';
            item.style.backgroundColor = color;
            item.style.color = l < 50 ? 'white' : 'black';
            item.innerHTML = `<span>Step ${j+1}</span><span>${l}%</span>`;
            item.onclick = () => copy(color);
            stack.appendChild(item);
        }
    });
}

function copy(val) {
    navigator.clipboard.writeText(val);
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => toast.style.transform = 'translateX(-50%) translateY(-100px)', 1500);
}

document.getElementById('eyeBtn').onclick = async () => {
    const ed = new EyeDropper();
    const res = await ed.open();
    input.value = res.sRGBHex;
    update();
}

input.oninput = update;
update();

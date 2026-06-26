const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const scale = 30; // 1단위를 30픽셀로 설정

// 상태 변수
let currentScenario = 'linear';
let a = 1, b = 0, c = 0;

// DOM 요소
const valA = document.getElementById('val-a');
const valB = document.getElementById('val-b');
const valC = document.getElementById('val-c');
const labelA = document.getElementById('label-a');
const labelB = document.getElementById('label-b');
const labelC = document.getElementById('label-c');
const groupC = document.getElementById('group-c');
const equationDisplay = document.getElementById('equation-display');
const inquiryQuestion = document.getElementById('inquiry-question');
const scenarioBtns = document.querySelectorAll('.scenario-btn');

// 시나리오 데이터 (목표 함수 및 탐구 질문)
const scenarios = {
    linear: {
        type: 'linear',
        target: (x) => 0.5 * x + 2,
        question: "a(기울기)의 값이 커지면 비행기의 이륙 경로는 어떻게 변하나요?",
        targetColor: 'rgba(52, 152, 219, 0.3)'
    },
    basketball: {
        type: 'quadratic',
        target: (x) => -0.2 * x * x + x + 4,
        question: "이차항의 계수 a가 음수일 때와 양수일 때, 농구공의 궤적은 어떻게 다를까요?",
        targetColor: 'rgba(230, 126, 34, 0.3)'
    },
    bridge: {
        type: 'quadratic',
        target: (x) => 0.1 * x * x + 1,
        question: "c의 값을 조절하여 케이블의 최하단 높이를 다리 상판에 맞춰보세요.",
        targetColor: 'rgba(231, 76, 60, 0.3)'
    },
    fountain: {
        type: 'quadratic',
        target: (x) => -0.5 * x * x + 5,
        question: "물이 더 멀리, 더 높이 퍼져나가게 하려면 어떤 값들을 어떻게 조절해야 할까요?",
        targetColor: 'rgba(46, 204, 113, 0.3)'
    }
};

// 이벤트 리스너 설정
valA.addEventListener('input', updateValues);
valB.addEventListener('input', updateValues);
valC.addEventListener('input', updateValues);

scenarioBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        scenarioBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        setScenario(e.target.dataset.scenario);
    });
});

function updateValues() {
    a = parseFloat(valA.value);
    b = parseFloat(valB.value);
    c = parseFloat(valC.value);
    
    labelA.textContent = a;
    labelB.textContent = b;
    labelC.textContent = c;

    if (scenarios[currentScenario].type === 'linear') {
        equationDisplay.textContent = `y = ${a}x + ${b}`;
    } else {
        equationDisplay.textContent = `y = ${a}x² + ${b}x + ${c}`;
    }
    draw();
}

function setScenario(scenarioKey) {
    currentScenario = scenarioKey;
    const scenario = scenarios[scenarioKey];
    
    inquiryQuestion.textContent = scenario.question;

    if (scenario.type === 'linear') {
        groupC.style.display = 'none';
        valA.value = 1; valB.value = 0;
    } else {
        groupC.style.display = 'block';
        valA.value = 1; valB.value = 0; valC.value = 0;
    }
    updateValues();
}

function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        ctx.stroke();
    }

    // X, Y 축
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
}

function drawGraph(func, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    for (let px = 0; px <= width; px++) {
        let mathX = (px - width / 2) / scale;
        let mathY = func(mathX);
        let py = height / 2 - mathY * scale;

        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function draw() {
    drawGrid();
    
    // 목표 궤적 (배경에 희미하게)
    const targetFunc = scenarios[currentScenario].target;
    drawGraph(targetFunc, scenarios[currentScenario].targetColor, 8);

    // 학생이 조작하는 그래프
    const userFunc = (x) => {
        if (scenarios[currentScenario].type === 'linear') {
            return a * x + b;
        } else {
            return a * x * x + b * x + c;
        }
    };
    drawGraph(userFunc, '#2c3e50', 3);
}

// 초기화
setScenario('linear');

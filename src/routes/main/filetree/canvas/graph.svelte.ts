export type Dot = {
	x: number;
	y: number;
	result: boolean;
};

type CanvasConfig = {
	basisR: number;
	r: number;
	shift: number;
	dpr: number;
};

type Label = {
	mult: number;
	x: number;
	y: number;
};

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let canvasCfg: CanvasConfig;
let labels: Label[];

export function initGraph(): void {
	canvas = document.getElementById('graph') as HTMLCanvasElement;
	ctx = canvas.getContext('2d')!;
	canvasCfg = {
		basisR: canvas.width * 0.4,
		r: 1,
		shift: 10,
		dpr: window.devicePixelRatio || 1
	};

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';

	ctx.lineWidth = 2 * canvasCfg.dpr;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	labels = [
		{ mult: 1, x: canvasCfg.basisR, y: 0 },
		{ mult: 1, x: 0, y: canvasCfg.basisR },

		{ mult: 0.5, x: canvasCfg.basisR / 2, y: 0 },
		{ mult: 0.5, x: 0, y: canvasCfg.basisR / 2 },

		{ mult: -1, x: -canvasCfg.basisR, y: 0 },
		{ mult: -1, x: 0, y: -canvasCfg.basisR },

		{ mult: -0.5, x: -canvasCfg.basisR / 2, y: 0 },
		{ mult: -0.5, x: 0, y: -canvasCfg.basisR / 2 }
	];
}

function initStyles(): void {
	ctx.fillStyle = 'rgba(51,153,255,0.5)';
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.font = `${18*canvasCfg.dpr}px 'Roboto', Arial, sans-serif`;
}

export function refresh(r: number = canvasCfg.r): void {
	canvasCfg.r = r;
	draw();
	drawDots();
}

// function clearCanvas(): void {
// 	dots = [];
// 	refresh();
// }

export function draw(): void {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	initStyles();

	drawAxis();
	drawArrows();

	drawShape();

	drawText();
}

function drawShape(): void {
	drawCircle(canvas.width / 2, canvas.height / 2, 0, Math.PI / 2);
	ctx.beginPath();
	ctx.fillRect(canvas.width / 2, canvas.height / 2, canvasCfg.basisR, -canvasCfg.basisR / 2);
	drawTriangle(
		{ x: canvas.width / 2, y: canvas.height / 2 },
		{
			x: canvas.width / 2 - canvasCfg.basisR,
			y: canvas.height / 2
		},
		{ x: canvas.width / 2, y: canvas.height / 2 + canvasCfg.basisR / 2 }
	);
}

function drawCircle(x: number, y: number, startAngle: number, endAngle: number): void {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, canvasCfg.basisR, startAngle, endAngle);
	ctx.fill();
}

const dots: Dot[] = [];

export function addDots(providedDots: Dot[]): void {
	providedDots.forEach((dot) => addDot({ x: dot.x, y: dot.y, result: dot.result }));
}

export function addDot(dot: Dot): void {
	dots.push(dot);
	drawDot(dot);
}

function drawDot(dot: Dot, color: string | null = null, r: number = canvasCfg.r): void {
	ctx.save();

	if (color == null) {
		ctx.fillStyle = dot.result ? '#a6ff00b1' : 'black';
	} else {
		ctx.fillStyle = color;
	}

	ctx.beginPath();
	ctx.moveTo(dot.x, dot.y);
	ctx.arc(
		canvas.width / 2 + (canvasCfg.basisR / r) * dot.x,
		canvas.height / 2 - (canvasCfg.basisR / r) * dot.y,
		canvasCfg.basisR / 50,
		0,
		Math.PI * 2
	);
	ctx.fill();

	ctx.restore();
}

function drawDots(): void {
	dots.forEach((dot) => drawDot(dot));
}

function drawTriangle(
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	p3: { x: number; y: number }
): void {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.lineTo(p3.x, p3.y);
	ctx.closePath();
	ctx.fill();
}

function drawAxis(): void {
	ctx.beginPath();
	// Y-axis
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	// X-axis
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
}

function drawArrows(): void {
	ctx.beginPath();
	// Y-axis arrow
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2 - canvas.width / 100, canvas.height / 50);
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2 + canvas.width / 100, canvas.height / 50);
	// X-axis arrow
	ctx.moveTo(canvas.width, canvas.height / 2);
	ctx.lineTo(canvas.width - canvas.width / 50, canvas.height / 2 - canvas.height / 100);
	ctx.moveTo(canvas.width, canvas.height / 2);
	ctx.lineTo(canvas.width - canvas.width / 50, canvas.height / 2 + canvas.height / 100);
	ctx.stroke();
}

function drawText(): void {
	drawLabels();
	drawAxisSymbols();
}

function drawLabels(): void {
	ctx.save();
	ctx.fillStyle = 'black';
	labels.forEach((label) => {
		drawLabel(label);
		drawTick(label);
	});
	ctx.restore();
}

function drawLabel(label: Label): void {
	const shiftX = label.x === 0 ? canvasCfg.shift : 0;
	const shiftY = label.y === 0 ? canvasCfg.shift : 0;

	const radius = Math.round(label.mult * canvasCfg.r * 100) / 100;

	ctx.fillText(
		radius.toString(),
		canvas.width / 2 + label.x + shiftX,
		canvas.height / 2 - label.y - shiftY
	);
}

function drawTick(label: Label): void {
	const tickLength = 5;
	if (label.x === 0) {
		drawLine(
			{ x: canvas.width / 2 + tickLength, y: canvas.height / 2 + label.y },
			{
				x: canvas.width / 2 - tickLength,
				y: canvas.height / 2 + label.y
			}
		);
	} else {
		drawLine(
			{ x: canvas.width / 2 + label.x, y: canvas.height / 2 + tickLength },
			{
				x: canvas.width / 2 + label.x,
				y: canvas.height / 2 - tickLength
			}
		);
	}
}

function drawLine(from: { x: number; y: number }, to: { x: number; y: number }): void {
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}

function drawAxisSymbols(): void {
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.fillText('X', canvas.width - 15 * canvasCfg.dpr, canvas.height / 2 - canvasCfg.shift*canvasCfg.dpr);
	ctx.fillText('Y', canvas.width / 2 + canvasCfg.shift*canvasCfg.dpr, 15*canvasCfg.dpr);
	ctx.restore();
}

/* vim:set foldmethod=marker: */

/**
 * @fileOverview 円を連続して並べていって図形を描画するプログラム 
 * javascript言語ベースのp5js言語で開発. <br/>
 * ～備忘録～<br/>
 * @author MURAYAMA, Yoshiyuki
 * @version 1.0.0
 */

/** GlobalConst ちゃちゃっと作ったらびっくりするくらい汚くなり、
 * 今見返したらびっくりした。とりあえず、リファクタリングのために、
 * 定数とかを静的なGlobalConstクラスに彫りこんでおくことにする.
 */
class gc {
  static BTN_RUN_B_Y = 100;//B途中スタート・ストップボタンのY座標

}

// ===== 図形描画用 =====
let circles = [];
let step = 0;;
let animating = false;
let lineLayer;
const CIRCLE_RADIUS = 200;   // ← 後で数字をいじるだけ
const CIRCLE_GAP = CIRCLE_RADIUS ;
const DRAW_DURATION = 1000; // 1秒
const CIRCLE_STROKE = 2;


let btnDraw;
let btnReset;

let arcs = [];
const UNIT = 200; //グリッドサイズ
const R = UNIT;

const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

let offsetX = 0;
let offsetY = 0; //キャンバスの平行移動
let wholeScale = 1;
let dragging = false;
let lastMouseX, lastMouseY;

// ドラッグ用
let lastTouchX = null;
let lastTouchY = null;
let lastTouchDist = null; //ピンチズーム用

let fillLayer;//塗専用
let layerUnion;     // 薄紫用（和集合）
let layerOverlap;  // 薄黄色用（積集合）

// 塗り用（必ず「円」）
let discs = [];





/** ブラウザの画面の横幅いっぱい.
 * @type {Number}
 */
var iWidth = window.innerWidth;
/** ブラウザの画面の縦幅いっぱい. 
 * @type {Number} 
 */
var iHeight = window.innerHeight;

class DrawCircle {
  constructor(cx, cy, r, fillCol, overlapTargets = []) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.fillCol = fillCol;
    this.overlapTargets = overlapTargets;
    this.startTime = millis();
    this.done = false;
  }
draw() {
  let t = (millis() - this.startTime) / DRAW_DURATION;
  let ang = constrain(t, 0, 1) * TWO_PI;

  lineLayer.noFill();
  lineLayer.stroke(0);
  lineLayer.strokeWeight(2);
  lineLayer.arc(
    this.cx,
    this.cy,
    this.r * 2,
    this.r * 2,
    0,
    ang
  );

  if (t >= 1 && !this.done) {
    this.done = true;
    this.fillDisc();
  }
}
/*


draw() {
  let t = (millis() - this.startTime) / DRAW_DURATION;
  let ang = constrain(t, 0, 1) * TWO_PI;

  noFill();
  stroke(0);
  strokeWeight(2);

  if (t < 1) {
    // アニメーション中
    arc(this.cx, this.cy, this.r * 2, this.r * 2, 0, ang);
  } else {
    // 完成後：円周をフルで描く
    arc(this.cx, this.cy, this.r * 2, this.r * 2, 0, TWO_PI);

    if (!this.done) {
      this.done = true;
      this.fillDisc();
    }
  }
}*/
/*  
  draw() {
    let t = (millis() - this.startTime) / DRAW_DURATION;
    let ang = constrain(t, 0, 1) * TWO_PI;

    noFill();
    stroke(0);
    strokeWeight(2);
    arc(this.cx, this.cy, this.r * 2, this.r * 2, 0, ang);

    if (t >= 1 && !this.done) {
      this.done = true;
      this.fillDisc();
    }
  }
*/
fillDisc() {
  const shrink = CIRCLE_STROKE / 2;

  // 通常塗り
  fillLayer.noStroke();
  fillLayer.fill(this.fillCol);
  fillLayer.ellipse(
    this.cx,
    this.cy,
    (this.r - shrink) * 2
  );

  // 重なり（オレンジ）
  for (let c of this.overlapTargets) {
    layerOverlap.noStroke();
    layerOverlap.fill(255, 165, 0, 180);

    layerOverlap.push();
    layerOverlap.erase();
    layerOverlap.ellipse(
      c.cx,
      c.cy,
      (c.r - shrink) * 2
    );
    layerOverlap.noErase();
    layerOverlap.ellipse(
      this.cx,
      this.cy,
      (this.r - shrink) * 2
    );
    layerOverlap.pop();
  }
}
/*

fillDisc() {
  // 通常塗り
  fillLayer.noStroke();
  fillLayer.fill(this.fillCol);
  fillLayer.ellipse(this.cx, this.cy, this.r * 2);

  // 重なり（単純上書き）
  for (let c of this.overlapTargets) {
    layerOverlap.noStroke();
    layerOverlap.fill(255, 165, 0, 180);

    layerOverlap.push();
    layerOverlap.erase();
    layerOverlap.ellipse(c.cx, c.cy, c.r * 2);
    layerOverlap.noErase();
    layerOverlap.ellipse(this.cx, this.cy, this.r * 2);
    layerOverlap.pop();
  }
}
  */
  /*fillDisc() {
    fillLayer.noStroke();
    fillLayer.fill(this.fillCol);
    fillLayer.ellipse(this.cx, this.cy, this.r * 2);

    // 重なり（オレンジ）
    for (let c of this.overlapTargets) {
      layerOverlap.noStroke();
      layerOverlap.fill(255, 165, 0, 180);
      layerOverlap.erase();
      layerOverlap.ellipse(c.cx, c.cy, c.r * 2);
      layerOverlap.noErase();
      layerOverlap.ellipse(this.cx, this.cy, this.r * 2);
    }
  }*/
}


function gridToWorld(gx, gy) {
  return {
    x: gx * UNIT,
    y: gy * UNIT
  };
}




/** リセットボタンが押下された.
 */
function onMousePressedReset() { /**{{{*/
}
/**}}}*/

/** setup()関数の先頭に記述してあるため、setup()よりも先に呼び出される.
 * スマホ・タブレット（iOS・Android）か、PCかをuserAgentを調べることで、判別する.
 * これにより、isPCにtrueかfalseが入るため、これ以降のプログラムでは、isPCを見れば、
 * PCかどうかがわかる.
 */
function preload() { /** {{{*/
 
	if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)){
		// スマホ・タブレット（iOS・Android）の場合の処理を記述
		isPC = false;
	}else{
		// PCの場合の処理を記述
		isPC = true;
	}
	// setupより先に実行
	//font = loadFont("Meiryo.ttf");
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  angleMode(RADIANS);
}
/**}}}*/

//---------------------------------------
// ★ iPad（ピンチでズーム）
//---------------------------------------
function touchMoved(event) { /**{{{*/
   // 2本指（ピンチズーム）
  if (touches.length == 2) {
    let t1 = touches[0];
    let t2 = touches[1];

    let dx = t1.x - t2.x;
    let dy = t1.y - t2.y;
    let dist = sqrt(dx*dx + dy*dy);

    if (lastTouchDist !== null) {
      let change = dist / lastTouchDist;

      // ピンチ中心
      let cx = (t1.x + t2.x) / 2;
      let cy = (t1.y + t2.y) / 2;

      // ズーム前の世界座標
      const wx = (cx - offsetX) / wholeScale;
      const wy = (cy - offsetY) / wholeScale;

      // ズーム
      wholeScale *= change;

      // ズーム後のオフセット補正
      offsetX = cx - wx * wholeScale;
      offsetY = cy - wy * wholeScale;
    }
    lastTouchDist = dist;
    return false;
  }

  // 1本指（パン）
  if (touches.length == 1) {
    if (isDragging) {
    let x = touches[0].x;
    let y = touches[0].y;

    offsetX += x - lastTouchX;
    offsetY += y - lastTouchY;

    lastTouchX = x;
    lastTouchY = y;
  }

  // スクロール禁止（重要）
    return false;
  }
  return false;
}
/**}}}*/


function touchEnded() { /**{{{*/
   if (touches.length < 2) {
    lastTouchDist = null;
     isDragging = false;
  }
}

/**}}}*/

/** 文字を強制的に数値に変換する.しかもエラーは一切出さないようにする.
 * @param str 読み込んだ文字列
 * @return 数値 文字列として読み込めなかったら0
 */
function atoiLike(str) { /** {{{*/
  if (!str) return 0;
  
  //全角→半角変換
  const hankaku = str.replace(/[０-９.ー]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0 );
  });

  const match = hankaku.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat( match[0] ) : 0;
    
}
/**}}}*/

/** 最初に1回だけ実行. 初期値の図形情報を詰め込むのはここ.
 * 
 */
function setup(){ /** {{{*/
	preload();

	window.addEventListener("touchstart", function(ev) {
	  const t = ev.target;
	  if ( t ) {
	    const tag = t.tagName;
	    if ( tag === 'BUTTON' || tag === 'INPUT' || t.closest && t.closest('button, input, textarea, .p5ui') ) {
	      //ui要素なら何もしない
	      return;
	    }
	  }
	  //それ以外では、スクロールを無効化
	  ev.preventDefault();
	} , { passive: false });

	window.addEventListener("touchmove", function (ev) {
	  const t = ev.target;
	  if (t) {
	    const tag = t.tagName;
	    if (tag === 'BUTTON' || tag === 'INPUT' || t.closest && t.closest('button, input, textarea, .p5ui')) {
	      return;
	    }
	  }
	  ev.preventDefault();
	}, { passive: false });

	cursor('pointer');
	//キャンバスを作成
	textSize( 20 );
	createCanvas(iWidth, iHeight);
	drawBackground();
	fillLayer = createGraphics(iWidth, iHeight);

layerUnion   = createGraphics(iWidth, iHeight);
layerOverlap = createGraphics(iWidth, iHeight);
  lineLayer = createGraphics( iWidth, iHeight);
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  btnDraw = createButton("作図");
  btnDraw.position(20, 20);
  //btnDraw.mousePressed(addCircle);
  btnDraw.mousePressed(addNextCircle);
  btnDraw.addClass("p5ui");

  btnReset = createButton("リセット");
  btnReset.position(80, 20);
  btnReset.mousePressed(resetCircles);
  btnReset.addClass("p5ui");
}
/**}}}*/


function resetCircles() {
  circles = [];
  step = 0;
  fillLayer.clear();
  layerOverlap.clear();
  lineLayer.clear();
}



function drawGrid(spacing = 20) {
  stroke(180, 220, 240); // 薄水色
  strokeWeight(1);

  // 縦線
  for (let x = 0; x <= width; x += spacing) {
    line(x, 0, x, height);
  }

  // 横線
  for (let y = 0; y <= height; y += spacing) {
    line(0, y, width, y);
  }
}




function chkboxevent() { /**{{{*/
	isGridChecked = chkbox.checked();
}
/**}}}*/



/** マウスがドラッグされたら.
 * 図形外の時は、何もしない.
 * 図形内の時は、ドラッグすれば対象図形のみが移動し、レイヤーを最前列にする.
 * 図形内外で、各頂点から、許容量以内の場合は回転モードにする.
 * mousePressed()メソッドで、どの図形を選択しているかの情報は得ているので、
 * 回転か移動かの判断はここのメソッドだけで判断してもよい.
 */
function mouseDragged() { /** {{{*/
  if ( dragging ) {
    offsetX += (mouseX - lastMouseX);
    offsetY += (mouseY - lastMouseY);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}
/** }}}*/

/** マウスのドラッグが終わったら*/
function mouseReleased() { /** {{{*/
  dragging = false;
}
/**}}}*/

//---------------------------------------
// ★ マウスホイールで、"マウス位置を中心に" ズーム
//---------------------------------------
function mouseWheel(event) { /** {{{*/
  let zoom = 1.0;

  if (event.delta > 0) zoom = 0.9;   // ズームアウト
  else zoom = 1.1;                   // ズームイン

  // マウス座標をキャンバスの座標系に変換
  const wx = (mouseX - offsetX) / wholeScale;
  const wy = (mouseY - offsetY) / wholeScale;

  // ズーム適用
  wholeScale *= zoom;

  // ズーム位置の中心がマウスになるようにオフセット調整
  offsetX = mouseX - wx * wholeScale;
  offsetY = mouseY - wy * wholeScale;

  return false; // ブラウザのスクロールを防ぐ
}
/**}}}*/


/** mousePressedイベント. もしかしたらtouchとかも考えないといけないかもしれないから、一応分割した.
 * @param pinputX pmouseXか、ptouchXのどっちか.		@type {Number}
 * @param pinputY pmouseYか、ptouchYのどっちか.		@type {Number}
 * @param inputX mouseXか、touches[0].xのどっちか.	@type {Number}
 * @param inputY mouseYか、touches[0].yのどっちか.	@type {Number}
 */
function pressProcess( pinputX, pinputY, inputX, inputY  ) { /** {{{*/
  dragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}
/**}}}*/


/** マウスが押下されたイベント.touchStartedにも対応するために、そのまんまpressProcessに流す. */
function mousePressed() { /** {{{*/
	pressProcess( pmouseX, pmouseY, mouseX, mouseY );
}
/** }}}*/

/** タッチクリックされたイベント. 
 * mousePressedにも対応するために、そのまんまpressProcessに流しているが、
 * タッチモードでは、createButtonに対応していない.
 * そのため、タッチされた時の座標からボタンイベント判別している.*/
function touchStarted() { /** {{{*/
    isDragging = true;

     // finger 0 の位置を使う
      lastTouchX = touches[0].x;
      lastTouchY = touches[0].y;
}
/**}}}*/



function windowResized() { /** {{{*/
  resizeCanvas(BASE_WIDTH, BASE_HEIGHT);
  
  const scaleX = windowWidth / BASE_WIDTH;
  const scaleY = windowHeight / BASE_HEIGHT;
  const scaleFactor = min(scaleX, scaleY);

  //draw();
}
/**}}}*/

function addNextCircle() {
  if (animating) return;

  let c;
  switch (step) {
    case 0: { // ①
      let p = gridToWorld(2, 2);
      c = new DrawCircle(p.x, p.y, 2 * UNIT, color(255, 200, 220));
      break;
    }
    case 1: { // ②
      let p = gridToWorld(2, 1);
      c = new DrawCircle(p.x, p.y, UNIT, color(120, 200, 120));
      break;
    }
    case 2: { // ③
      let p = gridToWorld(3, 2);
      c = new DrawCircle(p.x, p.y, UNIT, color(120, 200, 120),
        [circles[1]]
      );
      break;
    }
    case 3: { // ④
      let p = gridToWorld(2, 3);
      c = new DrawCircle(p.x, p.y, UNIT, color(120, 200, 120),
        [circles[2]]
      );
      break;
    }
    case 4: { // ⑤
      let p = gridToWorld(1, 2);
      c = new DrawCircle(p.x, p.y, UNIT, color(120, 200, 120),
        [circles[0], circles[3]]
      );
      break;
    }
    default:
      return;
  }

  circles.push(c);
  animating = true;
  step++;
}





/**1フレームごとに実行.processing,p5jsでは、ここがループしている.
 */
function draw(){ /** {{{*/
  //現在のパン・ズーム状態を適用
  translate( offsetX, offsetY);
  scale(wholeScale);
strokeWeight(CIRCLE_STROKE);
  

	/* マウスでもタッチでもどちらでも対応できるように、PCではマウス、タブレット、スマホではタッチ対応にさせる.*/
	let pinputX;	//前のX座標
	let pinputY;	//前のY座標
	let inputX;		//現在のX座標
	let inputY;		//現在のY座標

  //画面の実サイズを取得
  const scaleX = windowWidth / BASE_WIDTH;
  const scaleY = windowHeight / BASE_HEIGHT;
  const scaleFactor = min (scaleX, scaleY);   //縦横の縮尺のうち、小さい方を使う(縦横比を保つ)



  //キャンバス全体を拡大縮小
  push();
  scale(scaleFactor); 

  drawBackground();
  drawGrid(100);
  pop();

  image(fillLayer, 0, 0);
  image(layerOverlap, 0, 0);
  image(lineLayer, 0, 0);

  animating = false;
  for (let c of circles) {
    if (!c.done) {
      c.draw();
      animating = true;
    }
  }

}
/** }}}*/


/**背景を描画する*/
function drawBackground() { /** {{{*/
    stroke(0);
  strokeWeight(1);
		background( 255, 255, 204 );
	for ( var iCounter = 0; iCounter < iHeight; iCounter+=20 ) {
		for ( var jCounter = 0; jCounter < iWidth; jCounter += 20 ) {
			point( jCounter, iCounter );
		}
	}
}
/**}}}*/



/**
 * 윤지의돈창고 자산관리 앱 - 구글시트 동기화 + 웹앱 호스팅용 Apps Script
 *
 * 사용법 (새 계정 / 새 스프레드시트 배포 시):
 * 1. 새 구글 계정에서 구글 드라이브 접속 -> 스프레드시트를 새로 만듭니다.
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 를 클릭합니다.
 * 3. 기본 Code.gs 내용을 모두 지우고, 이 파일(code.gs) 내용 전체를 붙여넣습니다.
 * 4. 왼쪽 파일 목록 [+] 버튼 > [HTML] 클릭 후 파일 이름을 'Index' 로 입력합니다.
 * 5. index.html 파일 내용 전체를 복사해서 Index.html 에 붙여넣고 저장(Ctrl+S)합니다.
 * 6. 상단 [배포] > [새 배포] 클릭:
 *    - 유형: 웹 앱
 *    - 설명: 윤지의돈창고 첫 배포
 *    - 실행할 사용자: 나
 *    - 액세스 권한: 모든 사용자
 * 7. 구글 계정 권한 승인 창이 뜨면 허용해 줍니다.
 * 8. 배포 완료 후 나타나는 '웹 앱 URL'을 복사하여 폰(아이폰/안드로이드) 브라우저에서 엽니다.
 * 9. 사파리(아이폰) 또는 크롬(갤럭시)에서 '홈 화면에 추가'를 누르면 전용 앱 아이콘으로 설치됩니다!
 */

var SHEET_NAME = "Data";

// 기존에 사용하던 최신 자산/보유종목/로그 백업 데이터 (새 스프레드시트 배포 시 자동 초기화용)
var INITIAL_DATA_JSON = "{\"v\":1,\"goal\":{\"totalPrice\":692000000,\"contractPaid\":69200000,\"midLoan\":415200000,\"balance\":207600000,\"acqTaxRate\":1.5,\"optionCost\":31860000,\"moveCost\":30000000,\"extraCost\":0,\"targetMonth\":\"2028-05\",\"monthlySaving\":4000000,\"useExtraTaxes\":true,\"bondDiscount\":1500000,\"legalFee\":300000,\"stampDuty\":150000,\"moveInDeposit\":400000},\"buckets\":[{\"id\":\"b_stock\",\"name\":\"국내 주식/ETF 계좌\",\"kind\":\"stock\",\"amount\":0},{\"id\":\"n4jvk0j\",\"name\":\"미국 단기국채\",\"kind\":\"cash\",\"amount\":9830000},{\"id\":\"jbd38kh\",\"name\":\"국내채권\",\"kind\":\"cash\",\"amount\":30000000},{\"id\":\"ua5i675\",\"name\":\"금 현물 계좌\",\"kind\":\"cash\",\"amount\":3200000},{\"id\":\"7nqqnys\",\"name\":\"예금\",\"kind\":\"cash\",\"amount\":39000000},{\"id\":\"jsnhcyj\",\"name\":\"적금\",\"kind\":\"cash\",\"amount\":12000000},{\"id\":\"bwwbaj8\",\"name\":\"현금\",\"kind\":\"cash\",\"amount\":3000001},{\"id\":\"b_stock_overseas\",\"name\":\"해외주식\",\"kind\":\"stock\",\"amount\":0}],\"holdings\":[{\"id\":\"iu1r0px\",\"bucketId\":\"b_stock\",\"name\":\"TIGER 미국배당다우존스\",\"code\":\"458730\",\"account\":\"일반계좌\",\"qty\":1169,\"avgPrice\":15320,\"price\":14965,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":3.5,\"order\":6},{\"id\":\"v6zjfbn\",\"bucketId\":\"b_stock\",\"name\":\"TIGER 미국배당다우존스\",\"code\":\"458730\",\"account\":\"ISA\",\"qty\":3183,\"avgPrice\":15669,\"price\":14965,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":3.5,\"order\":7},{\"id\":\"lrg3hfq\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 미국S&P500\",\"code\":\"379800\",\"account\":\"일반계좌\",\"qty\":519,\"avgPrice\":24532,\"price\":23620,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":1,\"order\":1},{\"id\":\"5kus7q2\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 미국S&P500\",\"code\":\"379800\",\"account\":\"ISA\",\"qty\":165,\"avgPrice\":22941,\"price\":23620,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":1,\"order\":2},{\"id\":\"qoio6jh\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 미국나스닥100\",\"code\":\"379810\",\"account\":\"일반계좌\",\"qty\":210,\"avgPrice\":28374,\"price\":26470,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":1,\"order\":4},{\"id\":\"hxo1bom\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 미국나스닥100\",\"code\":\"379810\",\"account\":\"ISA\",\"qty\":124,\"avgPrice\":25356,\"price\":26470,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":1,\"order\":5},{\"id\":\"xbg0ndu\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 한국부동산리츠인프라\",\"code\":\"476800\",\"account\":\"ISA\",\"qty\":350,\"avgPrice\":4553,\"price\":4225,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":5,\"order\":10},{\"id\":\"u3iziav\",\"bucketId\":\"b_stock\",\"name\":\"ACE 미국하이일드액티브(H)\",\"code\":\"455660\",\"account\":\"ISA\",\"qty\":100,\"avgPrice\":9551,\"price\":9425,\"priceDate\":\"2026-09-05\",\"owner\":\"아내\",\"isUsd\":false,\"divYield\":7,\"order\":9},{\"id\":\"qa2cvkm\",\"bucketId\":\"b_stock\",\"name\":\"TIGER 미국배당다우존스\",\"code\":\"458730\",\"account\":\"ISA\",\"qty\":710,\"avgPrice\":14863,\"price\":14965,\"priceDate\":\"2026-09-05\",\"owner\":\"남편\",\"isUsd\":false,\"divYield\":3.5,\"order\":8},{\"id\":\"4cm69ju\",\"bucketId\":\"b_stock\",\"name\":\"KODEX 미국S&P500\",\"code\":\"379800\",\"account\":\"ISA\",\"qty\":383,\"avgPrice\":24780,\"price\":23620,\"priceDate\":\"2026-09-05\",\"owner\":\"남편\",\"isUsd\":false,\"divYield\":1,\"order\":3},{\"id\":\"d1yox3h\",\"bucketId\":\"b_stock_overseas\",\"name\":\"SOXL 미국반도체 3배 디렉시온 ETF\",\"code\":\"SOXL\",\"account\":\"일반계좌\",\"owner\":\"남편\",\"qty\":20,\"avgPrice\":186.3,\"price\":117.28,\"priceDate\":\"2026-09-05\",\"isUsd\":true,\"divYield\":0,\"order\":11}],\"entries\":[{\"id\":\"e0llhi5\",\"type\":\"saving\",\"date\":\"2026-08-19\",\"amount\":1000000,\"bucketId\":\"jsnhcyj\",\"memo\":\"\"},{\"id\":\"bbiscf8\",\"type\":\"saving\",\"date\":\"2026-08-23\",\"amount\":1,\"bucketId\":\"bwwbaj8\",\"memo\":\"\"},{\"id\":\"oywfd4l\",\"type\":\"saving\",\"date\":\"2026-09-03\",\"amount\":1507000,\"bucketId\":\"b_stock\",\"memo\":\"\",\"holdingId\":\"iu1r0px\",\"stockQty\":100,\"execPrice\":15070},{\"id\":\"mb66gcw\",\"type\":\"saving\",\"date\":\"2026-09-03\",\"amount\":2259000,\"bucketId\":\"b_stock\",\"memo\":\"\",\"holdingId\":\"iu1r0px\",\"stockQty\":150,\"execPrice\":15060},{\"id\":\"r3vngoo\",\"type\":\"saving\",\"date\":\"2026-09-03\",\"amount\":4262550,\"bucketId\":\"b_stock\",\"memo\":\"\",\"holdingId\":\"lrg3hfq\",\"stockQty\":181,\"execPrice\":23550},{\"id\":\"gj53ut0\",\"type\":\"saving\",\"date\":\"2026-09-03\",\"amount\":492870,\"bucketId\":\"b_stock\",\"memo\":\"\",\"holdingId\":\"lrg3hfq\",\"stockQty\":21,\"execPrice\":23470},{\"id\":\"v7oha9u\",\"type\":\"saving\",\"date\":\"2026-09-03\",\"amount\":3004000,\"bucketId\":\"b_stock\",\"memo\":\"\",\"holdingId\":\"iu1r0px\",\"stockQty\":200,\"execPrice\":15020}],\"syncLog\":[{\"date\":\"2026-08-18\",\"mode\":\"서버 자동\",\"detail\":\"5종목 중 5종목 반영\"},{\"date\":\"2026-08-19\",\"mode\":\"서버 자동\",\"detail\":\"5종목 중 5종목 반영\"},{\"date\":\"2026-08-19\",\"mode\":\"서버 자동\",\"detail\":\"5종목 중 5종목 반영\"},{\"date\":\"2026-08-20\",\"mode\":\"서버 자동\",\"detail\":\"5종목 중 5종목 반영\"},{\"date\":\"2026-08-20\",\"mode\":\"서버 자동\",\"detail\":\"5종목 중 5종목 반영\"},{\"date\":\"2026-08-20\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 5종목 반영\"},{\"date\":\"2026-08-20\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 5종목 반영\"},{\"date\":\"2026-08-20\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-08-23\",\"mode\":\"자동(앱 실행 시)\",\"detail\":\"6종목 중 2종목 반영\"},{\"date\":\"2026-08-26\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-08-30\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-02\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-03\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-03\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-03\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-03\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-04\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-04\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-04\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-05\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"},{\"date\":\"2026-09-05\",\"mode\":\"서버 자동\",\"detail\":\"6종목 중 6종목 반영\"}],\"lastSync\":\"2026-09-05\",\"fx\":{\"usdKrw\":1348.99,\"usdKrwDate\":\"2026-09-05\",\"dxy\":99.157,\"dxyDate\":\"2026-09-05\",\"dxyIsExact\":true},\"theme\":\"light\",\"updatedAt\":\"2026-09-05T10:18:58.876Z\",\"history\":[{\"date\":\"2026-08-20\",\"total\":204179052.6},{\"date\":\"2026-08-23\",\"total\":204150449.12},{\"date\":\"2026-08-26\",\"total\":203380805.808},{\"date\":\"2026-08-30\",\"total\":203380805.808},{\"date\":\"2026-09-02\",\"total\":201981978.72},{\"date\":\"2026-09-03\",\"total\":212292340.78},{\"date\":\"2026-09-04\",\"total\":212528213.204},{\"date\":\"2026-09-05\",\"total\":212411791.944}],\"loan\":{\"customAmount\":false,\"manualAmount\":0,\"includeMidLoan\":true,\"useStressDsr\":true,\"rate\":4,\"term\":30,\"grace\":0,\"type\":\"체증식\",\"salaryH\":100000000,\"salaryW\":40000000,\"otherDebt\":0,\"ltv\":80,\"estValue\":692000000,\"deduction\":28000000,\"useDeduction\":true},\"tax\":{\"rate\":4,\"term\":30,\"type\":\"원리금균등\"}}";
var INITIAL_UPDATED_AT = "2026-09-05T10:18:58.876Z";

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "";
    if (action === "data") {
      var sheet = getSheet_();
      var json = sheet.getRange("A1").getValue();
      var updatedAt = sheet.getRange("B1").getValue();
      return jsonOut_({ ok: true, data: json ? String(json) : null, updatedAt: updatedAt ? String(updatedAt) : null });
    }
    if (action === "refreshMarket") {
      return jsonOut_(refreshMarket_());
    }
    if (action === "restoreBackup") {
      기존데이터_강제복원();
      return jsonOut_({ ok: true, message: "기존 데이터 복원 완료" });
    }
    // action 파라미터가 없으면 앱 화면(Index.html) 자체를 보여줍니다.
    var template = HtmlService.createTemplateFromFile("Index");
    var serviceUrl = "";
    try {
      serviceUrl = ScriptApp.getService().getUrl();
    } catch (urlErr) {}
    template.currentDeploymentUrl = serviceUrl;
    return template.evaluate()
      .setTitle("윤지의돈창고 · 자산관리")
      .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonOut_({ ok: false, error: "bad_json" });
    }
    var sheet = getSheet_();
    var now = new Date().toISOString();
    sheet.getRange("A1").setValue(JSON.stringify(payload.data));
    sheet.getRange("B1").setValue(now);
    return jsonOut_({ ok: true, updatedAt: now });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// 권한 승인 화면이 배포 중 자동으로 뜨지 않을 때, 이 함수를 한 번 수동 실행해서 권한을 승인하세요.
function 권한테스트() {
  var sheet = getSheet_();
  Logger.log("OK: " + sheet.getName());
}

/**
 * 시트에 저장된 데이터를 읽어서, 보유 종목 종가와 환율/달러인덱스를 서버(Apps Script)에서
 * 직접 조회해 갱신하고 다시 저장합니다. 브라우저가 아니라 서버에서 요청하기 때문에
 * CORS(브라우저 보안 정책)에 막히지 않습니다.
 */
function refreshMarket_() {
  var sheet = getSheet_();
  var raw = sheet.getRange("A1").getValue();
  if (!raw) return { ok: false, error: "저장된 데이터가 없습니다" };
  var data;
  try {
    data = JSON.parse(String(raw));
  } catch (e) {
    return { ok: false, error: "데이터 파싱 오류" };
  }

  var codes = [];
  (data.holdings || []).forEach(function (h) {
    if (h.code && codes.indexOf(h.code) === -1) codes.push(h.code);
  });

  var today = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");

  var fxOk = false;
  var fxRate = 0;
  try {
    var fx = fetchFx_();
    if (fx) {
      data.fx = data.fx || {};
      data.fx.usdKrw = fx.usdKrw;
      data.fx.usdKrwDate = today;
      data.fx.dxy = fx.dxy;
      data.fx.dxyDate = today;
      data.fx.dxyIsExact = !!fx.dxyIsExact;
      fxOk = true;
      fxRate = fx.usdKrw;
    }
  } catch (e) { /* 환율 조회 실패는 무시하고 계속 진행 */ }

  var priceOk = 0, priceTotal = codes.length;
  var prices = {};
  codes.forEach(function (code) {
    var p = fetchStockPrice_(code, fxRate);
    if (p > 0) { prices[code] = p; priceOk++; }
  });
  if (priceOk > 0) {
    (data.holdings || []).forEach(function (h) {
      if (prices[h.code]) { h.price = prices[h.code]; h.priceDate = today; }
    });
    data.lastSync = today;
    data.syncLog = data.syncLog || [];
    data.syncLog.push({ date: today, mode: "서버 자동", detail: priceTotal + "종목 중 " + priceOk + "종목 반영" });
  }

  data.updatedAt = new Date().toISOString();
  sheet.getRange("A1").setValue(JSON.stringify(data));
  sheet.getRange("B1").setValue(data.updatedAt);

  return {
    ok: true, data: JSON.stringify(data), updatedAt: data.updatedAt,
    priceOk: priceOk, priceTotal: priceTotal, fxOk: fxOk
  };
}

function fetchStockPrice_(code, fxRate) {
  var isNumeric = /^\d+$/.test(code);
  if (isNumeric) {
    // 국내(KRX) 종목: 네이버가 야후보다 국내 종목 시세를 훨씬 정확하고 최신으로 제공하므로 먼저 시도.
    var vNaverPoll = fetchFromNaverPolling_(code);
    if (vNaverPoll > 0) return vNaverPoll;
    var vNaverBasic = fetchFromNaverBasic_(code);
    if (vNaverBasic > 0) return vNaverBasic;
    var vYahooKr = fetchFromYahoo_(code + ".KS");
    if (vYahooKr > 0) return vYahooKr;
    return 0;
  } else {
    // 해외(미국 등) 종목: 야후 파이낸스가 정확하고 빠르게 반영됨
    var vYahoo = fetchFromYahoo_(code);
    if (vYahoo > 0) return vYahoo;
    return 0;
  }
}

function fetchFromYahoo_(symbol) {
  try {
    var url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?range=5d&interval=1d";
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.getResponseCode() === 200) {
      var j = JSON.parse(res.getContentText());
      var m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
      var v = m && (m.regularMarketPrice || m.chartPreviousClose);
      if (v > 0) return v;
    }
  } catch (e) { /* 실패 시 0 반환 */ }
  return 0;
}

function fetchFromNaverPolling_(code) {
  try {
    var url2 = "https://polling.finance.naver.com/api/realtime/domestic/stock/" + code;
    var res2 = UrlFetchApp.fetch(url2, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
    if (res2.getResponseCode() === 200) {
      var j2 = JSON.parse(res2.getContentText());
      var d = j2 && j2.datas && j2.datas[0];
      var v2 = d && (d.closePrice || d.nv);
      var num2 = v2 ? Number(String(v2).replace(/[^0-9.-]/g, "")) : 0;
      if (num2 > 0) return Math.round(num2);
    }
  } catch (e) { /* 실패 시 0 반환 */ }
  return 0;
}

function fetchFromNaverBasic_(code) {
  try {
    var url3 = "https://api.stock.naver.com/stock/" + code + "/basic";
    var res3 = UrlFetchApp.fetch(url3, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
    if (res3.getResponseCode() === 200) {
      var j3 = JSON.parse(res3.getContentText());
      var v3 = j3 && (j3.closePrice || j3.nowPrice);
      var num3 = v3 ? Number(String(v3).replace(/[^0-9.-]/g, "")) : 0;
      if (num3 > 0) return Math.round(num3);
    }
  } catch (e) { /* 실패 시 0 반환 */ }
  return 0;
}

function fetchFx_() {
  var res = UrlFetchApp.fetch("https://open.er-api.com/v6/latest/USD", { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return null;
  var j = JSON.parse(res.getContentText());
  if (!j || j.result !== "success" || !j.rates || !j.rates.KRW) return null;
  var rt = j.rates;

  var dxy = fetchDxyIndex_();
  var dxyIsExact = dxy > 0;
  if (!dxyIsExact) {
    var eurusd = 1 / rt.EUR, usdjpy = rt.JPY, gbpusd = 1 / rt.GBP, usdcad = rt.CAD, usdsek = rt.SEK, usdchf = rt.CHF;
    dxy = 50.14348112
      * Math.pow(eurusd, -0.576) * Math.pow(usdjpy, 0.136) * Math.pow(gbpusd, -0.119)
      * Math.pow(usdcad, 0.091) * Math.pow(usdsek, 0.042) * Math.pow(usdchf, 0.036);
  }
  return {
    usdKrw: Math.round(rt.KRW * 100) / 100,
    dxy: Math.round(dxy * 1000) / 1000,
    dxyIsExact: dxyIsExact
  };
}

function fetchDxyIndex_() {
  try {
    var url = "https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?range=5d&interval=1d";
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.getResponseCode() === 200) {
      var j = JSON.parse(res.getContentText());
      var m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
      var v = m && (m.regularMarketPrice || m.chartPreviousClose);
      if (v > 0) return v;
    }
  } catch (e) { /* 근사 계산으로 폴백 */ }
  return 0;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  var flag = sheet.getRange("C1").getValue();
  var a1 = sheet.getRange("A1").getValue();
  if (flag !== "janggeum-sync" || !a1) {
    sheet.getRange("A1").setValue(INITIAL_DATA_JSON);
    sheet.getRange("B1").setValue(INITIAL_UPDATED_AT);
    sheet.getRange("C1").setValue("janggeum-sync");
  }
  return sheet;
}

// 혹시 새 시트에서 수동으로 기존 데이터를 다시 덮어씌워야 할 때 Apps Script에서 이 함수를 실행하세요.
function 기존데이터_강제복원() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange("A1").setValue(INITIAL_DATA_JSON);
  sheet.getRange("B1").setValue(new Date().toISOString());
  sheet.getRange("C1").setValue("janggeum-sync");
  Logger.log("OK: 기존 자산 데이터 및 로그가 복원되었습니다.");
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

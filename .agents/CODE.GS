/**
 * 잔금 프로젝트 자산관리 앱 - 구글시트 동기화 + 앱 자체 호스팅용 Apps Script (토큰 없는 버전)
 *
 * 이 버전은 데이터 저장뿐 아니라, 앱 화면 자체도 이 주소에서 바로 열리게 해줍니다.
 * 그래서 폰에서는 파일을 다운로드/열기 할 필요 없이, 배포된 웹 앱 URL을 그냥 링크처럼 열면 됩니다.
 *
 * 사용법 (한 번만 설정):
 * 1. 구글 스프레드시트를 새로 만듭니다 (내용은 비워둬도 됩니다).
 * 2. 상단 메뉴 확장 프로그램 > Apps Script 를 누릅니다.
 * 3. 왼쪽 파일 목록에서 기본 "Code.gs" 파일의 내용을 모두 지우고, 이 파일 내용 전체를 붙여넣습니다.
 * 4. 왼쪽 파일 목록 옆의 "+" 버튼을 누르고 "HTML"을 선택합니다. 파일 이름을 정확히 "Index"로
 *    입력합니다 (자동으로 .html이 붙습니다). 그 안에 "잔금프로젝트_자산관리.html" 파일 내용
 *    전체를 그대로 복사해서 붙여넣습니다.
 * 5. 저장한 뒤 상단의 "배포" > "새 배포" 를 누릅니다.
 * 6. 유형은 "웹 앱"을 선택합니다.
 *    - 실행할 사용자: 나
 *    - 액세스 권한이 있는 사용자: 모든 사용자
 * 7. "배포"를 누르면 구글 계정 권한 승인 화면이 나옵니다. 본인 계정으로 허용해 주세요.
 *    (승인 화면이 배포 중에 뜨지 않으면, 함수 목록에서 "권한테스트"를 선택해 한 번 실행해서
 *     권한 승인을 먼저 마쳐도 됩니다.)
 * 8. 배포가 끝나면 "웹 앱 URL"이 나옵니다. 이 URL을 폰/PC 브라우저에서 그대로 열면
 *    앱 화면이 바로 뜹니다. (기존처럼 앱의 동기화 카드에 URL을 붙여넣지 않아도, 앱이
 *    자기 자신의 주소를 자동으로 인식해서 연결합니다.)
 *
 * 코드나 Index.html을 수정한 뒤에는 "배포 > 배포 관리 > 수정(연필 아이콘) > 새 버전"으로
 * 다시 배포해야 변경사항이 적용됩니다. (URL은 그대로 유지됩니다)
 *
 * ⚠️ 보안 안내: 이 버전은 비밀번호(토큰) 확인을 하지 않습니다.
 * 즉, 이 웹 앱 URL을 아는 사람은 누구나 화면을 보고 데이터를 읽고 쓸 수 있습니다.
 * URL이 검색엔진에 노출되거나 캡처화면·채팅 등으로 유출되지 않도록 본인만 보관해 주세요.
 * 계좌 비밀번호나 공인인증서 같은 금융 인증정보는 이 앱에 입력하지 않습니다 (자산 "금액"만 다룹니다).
 */

var SHEET_NAME = "Data";

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
    // action 파라미터가 없으면 앱 화면(Index.html) 자체를 보여줍니다.
    return HtmlService.createHtmlOutputFromFile("Index")
      .setTitle("잔금 프로젝트 · 자산관리")
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
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
    // 야후의 ".KS" 데이터는 국내 소형 ETF의 경우 며칠씩 지연되거나 부정확한 경우가 있어 보조 수단으로만 사용.
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

  // 달러인덱스는 우선 야후 파이낸스에 실제로 고시되는 지수(티커: DX-Y.NYB)를 그대로 가져옵니다.
  // 이러면 통화쌍으로 재계산할 때 생기는 오차 없이, 실제 발표되는 값과 (거의) 동일한 수치를 씁니다.
  var dxy = fetchDxyIndex_();
  var dxyIsExact = dxy > 0;
  if (!dxyIsExact) {
    // 실패했을 때만, 통화쌍으로 근사 계산 (약간의 오차가 있을 수 있음)
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

// 야후 파이낸스에 실제 고시되는 ICE 달러인덱스(DX-Y.NYB) 값을 그대로 가져옵니다. 실패 시 0을 반환합니다.
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
  if (sheet.getRange("C1").getValue() !== "janggeum-sync") {
    sheet.getRange("A1").setValue("");
    sheet.getRange("B1").setValue("");
    sheet.getRange("C1").setValue("janggeum-sync");
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
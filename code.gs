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
var INITIAL_DATA_JSON = "\"{\\\"v\\\":1,\\\"goal\\\":{\\\"totalPrice\\\":692000000,\\\"contractPaid\\\":69200000,\\\"midLoan\\\":415200000,\\\"balance\\\":207600000,\\\"acqTaxRate\\\":1.77,\\\"calcAutoAcqTax\\\":true,\\\"isFirstHome\\\":true,\\\"optionCost\\\":21600000,\\\"optionPaid\\\":2400000,\\\"moveCost\\\":30000000,\\\"extraCost\\\":0,\\\"targetMonth\\\":\\\"2028-05\\\",\\\"monthlySaving\\\":4000000,\\\"useExtraTaxes\\\":true,\\\"bondDiscount\\\":1500000,\\\"legalFee\\\":300000,\\\"stampDuty\\\":240000,\\\"moveInDeposit\\\":400000},\\\"buckets\\\":[{\\\"id\\\":\\\"b_stock\\\",\\\"name\\\":\\\"국내 주식/ETF 계좌\\\",\\\"kind\\\":\\\"stock\\\",\\\"amount\\\":0},{\\\"id\\\":\\\"n4jvk0j\\\",\\\"name\\\":\\\"미국 단기국채\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":18000000},{\\\"id\\\":\\\"jbd38kh\\\",\\\"name\\\":\\\"국내채권\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":6600000},{\\\"id\\\":\\\"ua5i675\\\",\\\"name\\\":\\\"금 현물 계좌\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":3200000},{\\\"id\\\":\\\"7nqqnys\\\",\\\"name\\\":\\\"예금\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":39000000},{\\\"id\\\":\\\"jsnhcyj\\\",\\\"name\\\":\\\"적금\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":3797920},{\\\"id\\\":\\\"bwwbaj8\\\",\\\"name\\\":\\\"현금\\\",\\\"kind\\\":\\\"cash\\\",\\\"amount\\\":3000000},{\\\"id\\\":\\\"b_stock_overseas\\\",\\\"name\\\":\\\"해외주식\\\",\\\"kind\\\":\\\"stock\\\",\\\"amount\\\":0}],\\\"holdings\\\":[{\\\"id\\\":\\\"iu1r0px\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"TIGER 미국배당다우존스\\\",\\\"code\\\":\\\"458730\\\",\\\"account\\\":\\\"일반계좌\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":2939,\\\"price\\\":15250,\\\"prevPrice\\\":15420,\\\"isUsd\\\":false,\\\"order\\\":6,\\\"avgPrice\\\":15024,\\\"divYield\\\":3.5},{\\\"id\\\":\\\"v6zjfbn\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"TIGER 미국배당다우존스\\\",\\\"code\\\":\\\"458730\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":3212,\\\"price\\\":15250,\\\"prevPrice\\\":15420,\\\"isUsd\\\":false,\\\"order\\\":7,\\\"avgPrice\\\":15669,\\\"divYield\\\":3.5},{\\\"id\\\":\\\"lrg3hfq\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 미국S&P500\\\",\\\"code\\\":\\\"379800\\\",\\\"account\\\":\\\"일반계좌\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":519,\\\"price\\\":22415,\\\"prevPrice\\\":22600,\\\"isUsd\\\":false,\\\"order\\\":1,\\\"avgPrice\\\":24532,\\\"divYield\\\":1},{\\\"id\\\":\\\"5kus7q2\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 미국S&P500\\\",\\\"code\\\":\\\"379800\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":165,\\\"price\\\":22415,\\\"prevPrice\\\":22600,\\\"isUsd\\\":false,\\\"order\\\":2,\\\"avgPrice\\\":22941,\\\"divYield\\\":1},{\\\"id\\\":\\\"qoio6jh\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 미국나스닥100\\\",\\\"code\\\":\\\"379810\\\",\\\"account\\\":\\\"일반계좌\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":403,\\\"price\\\":24050,\\\"prevPrice\\\":24200,\\\"isUsd\\\":false,\\\"order\\\":4,\\\"avgPrice\\\":27950,\\\"divYield\\\":1},{\\\"id\\\":\\\"hxo1bom\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 미국나스닥100\\\",\\\"code\\\":\\\"379810\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":124,\\\"price\\\":24050,\\\"prevPrice\\\":24200,\\\"isUsd\\\":false,\\\"order\\\":5,\\\"avgPrice\\\":25356,\\\"divYield\\\":1},{\\\"id\\\":\\\"xbg0ndu\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 한국부동산리츠인프라\\\",\\\"code\\\":\\\"476800\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":350,\\\"price\\\":3880,\\\"prevPrice\\\":3900,\\\"isUsd\\\":false,\\\"order\\\":10,\\\"avgPrice\\\":4553,\\\"divYield\\\":5},{\\\"id\\\":\\\"u3iziav\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"ACE 미국하이일드액티브(H)\\\",\\\"code\\\":\\\"455660\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"아내\\\",\\\"qty\\\":100,\\\"price\\\":9155,\\\"prevPrice\\\":9180,\\\"isUsd\\\":false,\\\"order\\\":9,\\\"avgPrice\\\":9551,\\\"divYield\\\":7},{\\\"id\\\":\\\"qa2cvkm\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"TIGER 미국배당다우존스\\\",\\\"code\\\":\\\"458730\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"남편\\\",\\\"qty\\\":710,\\\"price\\\":15250,\\\"prevPrice\\\":15420,\\\"isUsd\\\":false,\\\"order\\\":8,\\\"avgPrice\\\":14863,\\\"divYield\\\":3.5},{\\\"id\\\":\\\"4cm69ju\\\",\\\"bucketId\\\":\\\"b_stock\\\",\\\"name\\\":\\\"KODEX 미국S&P500\\\",\\\"code\\\":\\\"379800\\\",\\\"account\\\":\\\"ISA\\\",\\\"owner\\\":\\\"남편\\\",\\\"qty\\\":383,\\\"price\\\":22415,\\\"prevPrice\\\":22600,\\\"isUsd\\\":false,\\\"order\\\":3,\\\"avgPrice\\\":24780,\\\"divYield\\\":1},{\\\"id\\\":\\\"d1yox3h\\\",\\\"bucketId\\\":\\\"b_stock_overseas\\\",\\\"name\\\":\\\"SOXL 미국반도체 3배 디렉시온 ETF\\\",\\\"code\\\":\\\"SOXL\\\",\\\"account\\\":\\\"일반계좌\\\",\\\"owner\\\":\\\"남편\\\",\\\"qty\\\":20,\\\"price\\\":45.97,\\\"prevPrice\\\":40.87,\\\"isUsd\\\":true,\\\"order\\\":11,\\\"avgPrice\\\":186.3,\\\"divYield\\\":0}],\\\"entries\\\":[{\\\"id\\\":\\\"uusgra9\\\",\\\"type\\\":\\\"transfer\\\",\\\"date\\\":\\\"2026-11-07\\\",\\\"amount\\\":9202080,\\\"fromId\\\":\\\"jsnhcyj\\\",\\\"toId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":608,\\\"execPrice\\\":15135,\\\"stockMode\\\":\\\"buy\\\"},{\\\"id\\\":\\\"ljbj0wb\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-11-06\\\",\\\"amount\\\":9202080,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":608,\\\"execPrice\\\":15135},{\\\"id\\\":\\\"aua05vm\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-11-05\\\",\\\"amount\\\":301400,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"v6zjfbn\\\",\\\"stockQty\\\":20,\\\"execPrice\\\":15070},{\\\"id\\\":\\\"ocpw79i\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-10-19\\\",\\\"amount\\\":2990090,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":206,\\\"execPrice\\\":14515},{\\\"id\\\":\\\"y7lcopr\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-10-08\\\",\\\"amount\\\":2761000,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"qoio6jh\\\",\\\"stockQty\\\":100,\\\"execPrice\\\":27610},{\\\"id\\\":\\\"is5mfqj\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-10-08\\\",\\\"amount\\\":4153500,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":300,\\\"execPrice\\\":13845},{\\\"id\\\":\\\"4x91yy8\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-10-08\\\",\\\"amount\\\":2568195,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"qoio6jh\\\",\\\"stockQty\\\":93,\\\"execPrice\\\":27615},{\\\"id\\\":\\\"3vgy0dp\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-10-08\\\",\\\"amount\\\":692500,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":50,\\\"execPrice\\\":13850},{\\\"id\\\":\\\"mfsj1vi\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-28\\\",\\\"amount\\\":129330,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"v6zjfbn\\\",\\\"stockQty\\\":9,\\\"execPrice\\\":14370},{\\\"id\\\":\\\"a2gg1nh\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-28\\\",\\\"amount\\\":991185,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":69,\\\"execPrice\\\":14365},{\\\"id\\\":\\\"yis8ded\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-18\\\",\\\"amount\\\":2002725,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":135,\\\"execPrice\\\":14835},{\\\"id\\\":\\\"kza7yo1\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-18\\\",\\\"amount\\\":3800000,\\\"bucketId\\\":\\\"n4jvk0j\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"fyktb2l\\\",\\\"type\\\":\\\"transfer\\\",\\\"date\\\":\\\"2026-09-18\\\",\\\"amount\\\":4370000,\\\"fromId\\\":\\\"jbd38kh\\\",\\\"toId\\\":\\\"n4jvk0j\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"8xt2ptn\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-18\\\",\\\"amount\\\":1000000,\\\"bucketId\\\":\\\"jsnhcyj\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"jqujx0f\\\",\\\"type\\\":\\\"transfer\\\",\\\"date\\\":\\\"2026-09-17\\\",\\\"amount\\\":4300000,\\\"fromId\\\":\\\"jbd38kh\\\",\\\"toId\\\":\\\"n4jvk0j\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"fiania3\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-17\\\",\\\"amount\\\":8000000,\\\"bucketId\\\":\\\"n4jvk0j\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"czbxxue\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-17\\\",\\\"amount\\\":3870000,\\\"bucketId\\\":\\\"n4jvk0j\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"700fpky\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-06\\\",\\\"amount\\\":10,\\\"bucketId\\\":\\\"bwwbaj8\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"5vj9kb3\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-06\\\",\\\"amount\\\":1,\\\"bucketId\\\":\\\"bwwbaj8\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"v7oha9u\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-03\\\",\\\"amount\\\":3004000,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":200,\\\"execPrice\\\":15020},{\\\"id\\\":\\\"r3vngoo\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-03\\\",\\\"amount\\\":4262550,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"lrg3hfq\\\",\\\"stockQty\\\":181,\\\"execPrice\\\":23550},{\\\"id\\\":\\\"oywfd4l\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-03\\\",\\\"amount\\\":1507000,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":100,\\\"execPrice\\\":15070},{\\\"id\\\":\\\"mb66gcw\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-03\\\",\\\"amount\\\":2259000,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"iu1r0px\\\",\\\"stockQty\\\":150,\\\"execPrice\\\":15060},{\\\"id\\\":\\\"gj53ut0\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-09-03\\\",\\\"amount\\\":492870,\\\"bucketId\\\":\\\"b_stock\\\",\\\"memo\\\":\\\"\\\",\\\"holdingId\\\":\\\"lrg3hfq\\\",\\\"stockQty\\\":21,\\\"execPrice\\\":23470},{\\\"id\\\":\\\"bbiscf8\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-08-23\\\",\\\"amount\\\":1,\\\"bucketId\\\":\\\"bwwbaj8\\\",\\\"memo\\\":\\\"\\\"},{\\\"id\\\":\\\"e0llhi5\\\",\\\"type\\\":\\\"saving\\\",\\\"date\\\":\\\"2026-08-19\\\",\\\"amount\\\":1000000,\\\"bucketId\\\":\\\"jsnhcyj\\\",\\\"memo\\\":\\\"\\\"}],\\\"syncLog\\\":[{\\\"date\\\":\\\"2026-08-18\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"5종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-19\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"5종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-19\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"5종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-20\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"5종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-20\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"5종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-20\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-20\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 5종목 반영\\\"},{\\\"date\\\":\\\"2026-08-20\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-08-23\\\",\\\"mode\\\":\\\"자동(앱 실행 시)\\\",\\\"detail\\\":\\\"6종목 중 2종목 반영\\\"},{\\\"date\\\":\\\"2026-08-26\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-08-30\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-02\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-03\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-03\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-03\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-03\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-04\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-04\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-04\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-05\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-09-05\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-11-08\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"},{\\\"date\\\":\\\"2026-11-08\\\",\\\"mode\\\":\\\"서버 자동\\\",\\\"detail\\\":\\\"6종목 중 6종목 반영\\\"}],\\\"lastSync\\\":\\\"2026-11-08\\\",\\\"fx\\\":{\\\"usdKrw\\\":1355.38,\\\"usdKrwDate\\\":\\\"2026-11-08\\\",\\\"dxy\\\":102.28,\\\"dxyDate\\\":\\\"2026-11-08\\\",\\\"dxyIsExact\\\":true,\\\"prevUsdKrw\\\":1355.38,\\\"lastUpdated\\\":\\\"2026-11-08T09:08:36.859Z\\\"},\\\"theme\\\":\\\"dark\\\",\\\"updatedAt\\\":\\\"2026-11-08T09:14:35.674Z\\\",\\\"history\\\":[{\\\"date\\\":\\\"2026-08-20\\\",\\\"total\\\":212179052.6},{\\\"date\\\":\\\"2026-08-23\\\",\\\"total\\\":212150449.12},{\\\"date\\\":\\\"2026-08-26\\\",\\\"total\\\":211380805.808},{\\\"date\\\":\\\"2026-08-30\\\",\\\"total\\\":211380805.808},{\\\"date\\\":\\\"2026-09-02\\\",\\\"total\\\":209981978.72},{\\\"date\\\":\\\"2026-09-03\\\",\\\"total\\\":220292340.78},{\\\"date\\\":\\\"2026-09-04\\\",\\\"total\\\":220528213.204},{\\\"date\\\":\\\"2026-09-05\\\",\\\"total\\\":220411791.944},{\\\"date\\\":\\\"2026-09-06\\\",\\\"total\\\":212413795.704},{\\\"date\\\":\\\"2026-09-08\\\",\\\"total\\\":210471414.328},{\\\"date\\\":\\\"2026-09-09\\\",\\\"total\\\":210621447.244},{\\\"date\\\":\\\"2026-09-10\\\",\\\"total\\\":210621447.244},{\\\"date\\\":\\\"2026-09-12\\\",\\\"total\\\":209492171.092},{\\\"date\\\":\\\"2026-09-14\\\",\\\"total\\\":217631799.732},{\\\"date\\\":\\\"2026-09-15\\\",\\\"total\\\":226148032.72},{\\\"date\\\":\\\"2026-09-16\\\",\\\"total\\\":227038876.704},{\\\"date\\\":\\\"2026-09-17\\\",\\\"total\\\":227552413.914},{\\\"date\\\":\\\"2026-09-18\\\",\\\"total\\\":234932351.2},{\\\"date\\\":\\\"2026-09-19\\\",\\\"total\\\":235192504.726},{\\\"date\\\":\\\"2026-09-20\\\",\\\"total\\\":235192133.716},{\\\"date\\\":\\\"2026-09-22\\\",\\\"total\\\":235484957.372},{\\\"date\\\":\\\"2026-09-24\\\",\\\"total\\\":234262578.25},{\\\"date\\\":\\\"2026-09-27\\\",\\\"total\\\":234381130.45},{\\\"date\\\":\\\"2026-09-29\\\",\\\"total\\\":233486398.558},{\\\"date\\\":\\\"2026-10-06\\\",\\\"total\\\":232780177.558},{\\\"date\\\":\\\"2026-10-12\\\",\\\"total\\\":242488348.592},{\\\"date\\\":\\\"2026-10-19\\\",\\\"total\\\":242812377.24},{\\\"date\\\":\\\"2026-10-20\\\",\\\"total\\\":242339499.67},{\\\"date\\\":\\\"2026-10-23\\\",\\\"total\\\":243534223.89},{\\\"date\\\":\\\"2026-10-27\\\",\\\"total\\\":243929519.041},{\\\"date\\\":\\\"2026-10-30\\\",\\\"total\\\":245535619.832},{\\\"date\\\":\\\"2026-10-31\\\",\\\"total\\\":229470224.91},{\\\"date\\\":\\\"2026-11-01\\\",\\\"total\\\":229470671.8},{\\\"date\\\":\\\"2026-11-02\\\",\\\"total\\\":229317568.16},{\\\"date\\\":\\\"2026-11-04\\\",\\\"total\\\":228931835.712},{\\\"date\\\":\\\"2026-11-05\\\",\\\"total\\\":230780192.416},{\\\"date\\\":\\\"2026-11-07\\\",\\\"total\\\":218826157},{\\\"date\\\":\\\"2026-11-08\\\",\\\"total\\\":218338961.37}],\\\"loan\\\":{\\\"amountMode\\\":\\\"midLoan\\\",\\\"manualAmount\\\":415200000,\\\"useStressDsr\\\":true,\\\"region\\\":\\\"non_metro\\\",\\\"rateType\\\":\\\"periodic\\\",\\\"rate\\\":4,\\\"term\\\":30,\\\"grace\\\":0,\\\"type\\\":\\\"체증식\\\",\\\"salaryH\\\":100000000,\\\"salaryW\\\":40000000,\\\"otherDebt\\\":0,\\\"ltv\\\":80,\\\"estValue\\\":692000000,\\\"deduction\\\":28000000,\\\"useDeduction\\\":false},\\\"tax\\\":{\\\"rate\\\":4,\\\"term\\\":30,\\\"type\\\":\\\"원리금균등\\\"},\\\"lastSyncSlot\\\":\\\"2026-11-08_1600\\\"}\"";
var INITIAL_UPDATED_AT = "2026-11-08T09:19:12.469Z";

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
    if (action === "setupTriggers") {
      return jsonOut_(setupDailyTriggers_());
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
      .setTitle("고석현의 돈통 · 자산관리")
      .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(10000);
  if (!hasLock) {
    return jsonOut_({ ok: false, error: "서버가 사용 중입니다. 잠시 후 다시 시도해주세요." });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut_({ ok: false, error: "no_post_data" });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonOut_({ ok: false, error: "bad_json" });
    }

    // 다중 직렬화 방어 및 객체 언랩
    var dataToSave = (payload && payload.data !== undefined) ? payload.data : payload;
    while (typeof dataToSave === "string") {
      try { dataToSave = JSON.parse(dataToSave); } catch (e) { break; }
    }

    // 필수 필드 검증으로 빈 값에 의한 A1 셀 소멸 방어
    if (!dataToSave || typeof dataToSave !== "object" || !dataToSave.buckets || !dataToSave.goal) {
      return jsonOut_({ ok: false, error: "invalid_data_structure: 필수 데이터 누락으로 저장이 거부되었습니다." });
    }

    var sheet = getSheet_();
    var now = new Date().toISOString();
    sheet.getRange("A1").setValue(JSON.stringify(dataToSave));
    sheet.getRange("B1").setValue(now);
    return jsonOut_({ ok: true, updatedAt: now });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 권한 승인 화면이 배포 중 자동으로 뜨지 않을 때, 이 함수를 한 번 수동 실행해서 권한을 승인하세요.
function 권한테스트() {
  var sheet = getSheet_();
  Logger.log("OK: " + sheet.getName());
}

/**
 * 시트에 저장된 데이터를 읽어서, 보유 종목 종가와 환율/달러인덱스를 서버(Apps Script)에서
 * 병렬(fetchAll)로 초고속 조회(1~2초)해 갱신하고 다시 저장합니다. 브라우저가 아니라 서버에서 요청하기 때문에
 * CORS(브라우저 보안 정책)에 막히지 않으며 10여 개 종목을 1번에 동시 조회합니다.
 */
function refreshMarket_() {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(10000);
  if (!hasLock) {
    return { ok: false, error: "다른 시세 동기화 또는 저장이 진행 중입니다." };
  }

  try {
    var sheet = getSheet_();
    var raw = sheet.getRange("A1").getValue();
    if (!raw) return { ok: false, error: "저장된 데이터가 없습니다" };
    var data;
    try {
      data = JSON.parse(String(raw));
      while (typeof data === "string") {
        data = JSON.parse(data);
      }
    } catch (e) {
      return { ok: false, error: "데이터 파싱 오류" };
    }

  var codes = [];
  (data.holdings || []).forEach(function (h) {
    if (h.isFixed) return;
    if (h.code && codes.indexOf(h.code) === -1) codes.push(h.code);
  });

  var today = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");

  // 1) 환율(USDKRW=X, DX-Y.NYB) 및 모든 보유종목 조회를 병렬(fetchAll) 요청 목록으로 구성
  var requests = [];

  // 환율 1순위: 야후 실시간 원달러 통화쌍 (1분 실시간)
  requests.push({
    url: "https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?range=1d&interval=1m",
    muteHttpExceptions: true,
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  // 달러 인덱스 (DXY)
  requests.push({
    url: "https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?range=5d&interval=1d",
    muteHttpExceptions: true,
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  // 각 종목별 실시간 조회 요청
  codes.forEach(function(code) {
    var isNumeric = /^\d+$/.test(code);
    if (isNumeric) {
      // 국내(KRX) 종목: 네이버 실시간 폴링 API
      requests.push({
        url: "https://polling.finance.naver.com/api/realtime/domestic/stock/" + code,
        muteHttpExceptions: true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
    } else {
      // 해외(미국 등) 종목: 야후 파이낸스 실시간
      requests.push({
        url: "https://query1.finance.yahoo.com/v8/finance/chart/" + code + "?range=1d&interval=1m",
        muteHttpExceptions: true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
    }
  });

  // 초고속 병렬 실행: 모든 HTTP 요청을 동시 전송 (1~2초 이내 완료)
  var responses = [];
  try {
    responses = UrlFetchApp.fetchAll(requests);
  } catch (fetchErr) {
    Logger.log("fetchAll error: " + fetchErr);
  }

  // 2) 환율 응답 파싱
  var fxOk = false;
  var fxRate = 0;
  var dxyVal = 0;
  try {
    if (responses && responses.length >= 2) {
      var fxRes = responses[0];
      if (fxRes && fxRes.getResponseCode() === 200) {
        var fxData = parseYahooQuoteMeta_(fxRes.getContentText());
        if (fxData && fxData.price > 0) {
          data.fx = data.fx || {};
          if (data.fx.usdKrw && data.fx.usdKrwDate && data.fx.usdKrwDate !== today) {
            data.fx.prevUsdKrw = data.fx.usdKrw;
          } else if (!data.fx.prevUsdKrw && data.fx.usdKrw) {
            data.fx.prevUsdKrw = data.fx.usdKrw;
          }
          data.fx.usdKrw = fxData.price;
          data.fx.usdKrwDate = today;
          data.fx.lastUpdated = new Date().toISOString();
          fxRate = fxData.price;
          fxOk = true;
        }
      }

      var dxyRes = responses[1];
      if (dxyRes && dxyRes.getResponseCode() === 200) {
        var dxyData = parseYahooQuoteMeta_(dxyRes.getContentText());
        if (dxyData && dxyData.price > 0) {
          dxyVal = Math.round(dxyData.price * 1000) / 1000;
          data.fx = data.fx || {};
          data.fx.dxy = dxyVal;
          data.fx.dxyDate = today;
          data.fx.dxyIsExact = true;
        }
      }
    }

    // 야후 환율 실패 시 기존 오픈 환율 API로 보조 폴백
    if (!fxOk) {
      var fbFx = fetchFxFallback_();
      if (fbFx) {
        data.fx = data.fx || {};
        if (data.fx.usdKrw && data.fx.usdKrwDate && data.fx.usdKrwDate !== today) {
          data.fx.prevUsdKrw = data.fx.usdKrw;
        }
        data.fx.usdKrw = fbFx.usdKrw;
        data.fx.usdKrwDate = today;
        data.fx.dxy = fbFx.dxy;
        data.fx.dxyDate = today;
        data.fx.dxyIsExact = !!fbFx.dxyIsExact;
        data.fx.lastUpdated = new Date().toISOString();
        fxOk = true;
        fxRate = fbFx.usdKrw;
      }
    }
  } catch (fxErr) {
    Logger.log("FX parse error: " + fxErr);
  }

  // 3) 각 종목 응답 파싱 및 실패 종목 단일 보조 폴백
  var priceOk = 0, priceTotal = codes.length;
  var prices = {};

  codes.forEach(function(code, idx) {
    var respIdx = idx + 2; // index 0: fx, 1: dxy
    var p = null;
    var isNumeric = /^\d+$/.test(code);

    if (responses && responses[respIdx] && responses[respIdx].getResponseCode() === 200) {
      var body = responses[respIdx].getContentText();
      if (isNumeric) {
        p = parseNaverPolling_(body);
      } else {
        p = parseYahooQuoteMeta_(body);
      }
    }

    // 1차 병렬 응답에서 실패한 경우에만 단일 폴백 재시도
    if (!p || p.price <= 0) {
      p = fetchStockPriceSingleFallback_(code, isNumeric);
    }

    if (p && p.price > 0) {
      prices[code] = p;
      priceOk++;
    }
  });

  if (priceOk > 0) {
    (data.holdings || []).forEach(function (h) {
      if (h.isFixed) return;
      if (prices[h.code]) {
        var pInfo = prices[h.code];
        var oldPrice = h.price;
        h.price = pInfo.price;
        if (pInfo.prevPrice && pInfo.prevPrice > 0) {
          h.prevPrice = pInfo.prevPrice;
        } else if (oldPrice && h.priceDate && h.priceDate !== today) {
          h.prevPrice = oldPrice;
        }
        h.priceDate = today;
      }
    });
    data.lastSync = today;
    data.lastSyncTimestamp = new Date().toISOString();
    data.syncLog = data.syncLog || [];
    data.syncLog.push({ date: today, mode: "실시간 초고속 병렬", detail: priceTotal + "종목 중 " + priceOk + "종목 반영" });
  }

  // 당일 총자산 계산 및 history 스냅샷 자동 저장
  try {
    var curFx = (data.fx && data.fx.usdKrw > 0) ? data.fx.usdKrw : 1350;
    var tot = 0;
    (data.buckets || []).forEach(function(b) {
      if (b.kind !== "stock") tot += Number(b.amount || 0);
    });
    (data.holdings || []).forEach(function(h) {
      var p = Number(h.price || 0);
      var q = Number(h.qty || 0);
      tot += p * q * (h.isUsd ? curFx : 1);
    });
    data.history = data.history || [];
    var existingHist = null;
    for (var i = 0; i < data.history.length; i++) {
      if (data.history[i].date === today) {
        existingHist = data.history[i];
        break;
      }
    }
    if (existingHist) {
      existingHist.total = Math.round(tot * 100) / 100;
    } else {
      data.history.push({ date: today, total: Math.round(tot * 100) / 100 });
      data.history.sort(function(a, b) { return a.date.localeCompare(b.date); });
    }
  } catch (histErr) {}

  data.updatedAt = new Date().toISOString();
  sheet.getRange("A1").setValue(JSON.stringify(data));
  sheet.getRange("B1").setValue(data.updatedAt);

  return {
    ok: true, data: JSON.stringify(data), updatedAt: data.updatedAt,
    priceOk: priceOk, priceTotal: priceTotal, fxOk: fxOk
  };
  } finally {
    lock.releaseLock();
  }
}

function parseYahooQuoteMeta_(jsonText) {
  try {
    var j = JSON.parse(jsonText);
    var m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
    var cur = m && (m.regularMarketPrice || m.chartPreviousClose);
    var prev = m && (m.previousClose || m.chartPreviousClose);
    if (cur > 0) {
      return { price: Math.round(cur * 100) / 100, prevPrice: Math.round((prev > 0 ? prev : cur) * 100) / 100 };
    }
  } catch (e) {}
  return null;
}

function parseNaverPolling_(jsonText) {
  try {
    var j2 = JSON.parse(jsonText);
    var d = j2 && j2.datas && j2.datas[0];
    var v2 = d && (d.closePriceRaw || d.closePrice || d.nv);
    var cur = v2 ? Number(String(v2).replace(/[^0-9.-]/g, "")) : 0;
    if (cur > 0) {
      var rawDiff = d.compareToPreviousClosePriceRaw || d.compareToPreviousClosePrice;
      var signedDiff = rawDiff ? Number(String(rawDiff).replace(/,/g, "")) : 0;
      var prev = cur - signedDiff;
      return { price: Math.round(cur), prevPrice: Math.round(prev > 0 ? prev : cur) };
    }
  } catch (e) {}
  return null;
}

function fetchStockPriceSingleFallback_(code, isNumeric) {
  if (isNumeric) {
    try {
      var url = "https://api.stock.naver.com/stock/" + code + "/basic";
      var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
      if (res.getResponseCode() === 200) {
        var j3 = JSON.parse(res.getContentText());
        var v3 = j3 && (j3.closePrice || j3.nowPrice);
        var cur = v3 ? Number(String(v3).replace(/[^0-9.-]/g, "")) : 0;
        if (cur > 0) {
          var diff = Math.abs(j3.compareToPreviousClosePrice ? Number(j3.compareToPreviousClosePrice) : 0);
          var isFalling = j3.compareToPreviousPrice && (j3.compareToPreviousPrice.name === "FALLING" || j3.compareToPreviousPrice.code === "5");
          var prev = isFalling ? (cur + diff) : (cur - diff);
          return { price: Math.round(cur), prevPrice: Math.round(prev > 0 ? prev : cur) };
        }
      }
    } catch (e) {}
    try {
      var urlY = "https://query1.finance.yahoo.com/v8/finance/chart/" + code + ".KS?range=5d&interval=1d";
      var resY = UrlFetchApp.fetch(urlY, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
      if (resY.getResponseCode() === 200) {
        return parseYahooQuoteMeta_(resY.getContentText());
      }
    } catch (e) {}
  } else {
    try {
      var urlY2 = "https://query1.finance.yahoo.com/v8/finance/chart/" + code + "?range=5d&interval=1d";
      var resY2 = UrlFetchApp.fetch(urlY2, { muteHttpExceptions: true, headers: { "User-Agent": "Mozilla/5.0" } });
      if (resY2.getResponseCode() === 200) {
        return parseYahooQuoteMeta_(resY2.getContentText());
      }
    } catch (e) {}
  }
  return null;
}

function fetchFxFallback_() {
  try {
    var res = UrlFetchApp.fetch("https://open.er-api.com/v6/latest/USD", { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return null;
    var j = JSON.parse(res.getContentText());
    if (!j || j.result !== "success" || !j.rates || !j.rates.KRW) return null;
    var rt = j.rates;
    var eurusd = 1 / rt.EUR, usdjpy = rt.JPY, gbpusd = 1 / rt.GBP, usdcad = rt.CAD, usdsek = rt.SEK, usdchf = rt.CHF;
    var dxy = 50.14348112
      * Math.pow(eurusd, -0.576) * Math.pow(usdjpy, 0.136) * Math.pow(gbpusd, -0.119)
      * Math.pow(usdcad, 0.091) * Math.pow(usdsek, 0.042) * Math.pow(usdchf, 0.036);
    return {
      usdKrw: Math.round(rt.KRW * 100) / 100,
      dxy: Math.round(dxy * 1000) / 1000,
      dxyIsExact: false
    };
  } catch (e) {
    return null;
  }
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

/**
 * 한국 장 종료 (16:00) 및 아침 06:00 자동 시세 갱신용 핸들러
 */
function scheduledMarketRefresh_() {
  var res = refreshMarket_();
  Logger.log("Scheduled market refresh completed: " + JSON.stringify(res));
  return res;
}

/**
 * 16시(한국 장 종료) 및 06시(아침 미국장/환율 마감) 시간 기반 트리거 설정
 */
function setupDailyTriggers_() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "scheduledMarketRefresh_") {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
    // 1) 한국 장 종료 시점 (오후 16:00 ~ 17:00 KST)
    ScriptApp.newTrigger("scheduledMarketRefresh_")
      .timeBased()
      .atHour(16)
      .everyDays(1)
      .inTimezone("Asia/Seoul")
      .create();

    // 2) 아침 미국 증시 및 환율 마감 정산 (오전 06:00 ~ 07:00 KST)
    ScriptApp.newTrigger("scheduledMarketRefresh_")
      .timeBased()
      .atHour(6)
      .everyDays(1)
      .inTimezone("Asia/Seoul")
      .create();

    return { ok: true, message: "한국 장 종료(16시) 및 아침(06시) 시세 자동 갱신 트리거가 설정되었습니다." };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

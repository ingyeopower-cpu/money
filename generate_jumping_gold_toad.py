import math
import random
from PIL import Image, ImageDraw, ImageFilter

def create_super_jumping_gold_toad():
    base_path = r"c:\Users\PA\Desktop\윤지의돈창고\toad_assets\toad_base.jpg"
    raw_img = Image.open(base_path).convert("RGBA")

    # 1:1 정사각형 크롭 (768x768)
    crop_size = 768
    crop_x1 = max(0, 670 - crop_size // 2)
    crop_y1 = 0
    cropped = raw_img.crop((crop_x1, crop_y1, crop_x1 + crop_size, crop_y1 + crop_size))

    # 타겟 크기: 480x480
    size = 480
    base_sq = cropped.resize((size, size), Image.Resampling.LANCZOS)
    w, h = size, size

    # 1. 두꺼비가 점프했을 때 바닥에 잔상이 남지 않도록 깨끗한 연잎 배경(clean_bg) 제작
    # 두꺼비 위치: cx=240, cy=255, rx=160, ry=145
    toad_cx, toad_cy = 240, 255
    toad_rx, toad_ry = 160, 145

    clean_bg = base_sq.copy()
    d_clean = ImageDraw.Draw(clean_bg)

    # 두꺼비가 앉아있는 연잎 바닥 부분을 연잎의 짙은 녹색과 잎맥 질감으로 부드럽게 복원
    # 연잎의 색상 톤: (75, 125, 45) ~ (55, 95, 35)
    leaf_y1 = 260
    leaf_y2 = 390
    for ly in range(leaf_y1, leaf_y2, 4):
        p = (ly - leaf_y1) / (leaf_y2 - leaf_y1)
        r = int(72 * (1 - p * 0.3))
        g = int(122 * (1 - p * 0.3))
        b = int(42 * (1 - p * 0.3))
        # 연잎 타원형 채우기
        ew = int(170 * math.sin(p * math.pi))
        d_clean.ellipse(
            (toad_cx - ew, ly - 8, toad_cx + ew, ly + 8),
            fill=(r, g, b, 240)
        )
    # 배경 연잎 블러로 부드러운 텍스처 결합
    clean_bg = clean_bg.filter(ImageFilter.GaussianBlur(radius=5))
    # 원본의 주변 배경(숲과 연꽃, 수면 테두리)은 그대로 살리기 위한 마스크 합성
    border_mask = Image.new("L", (w, h), 0)
    db_mask = ImageDraw.Draw(border_mask)
    db_mask.ellipse((toad_cx - 150, 260, toad_cx + 150, 380), fill=255)
    border_mask = border_mask.filter(ImageFilter.GaussianBlur(radius=12))
    
    final_bg = base_sq.copy()
    final_bg.paste(clean_bg, (0, 0), border_mask)

    # 2. 두꺼비 추출 (발과 몸체 전체 포함)
    toad_box = (
        max(0, toad_cx - toad_rx),
        max(0, toad_cy - toad_ry),
        min(w, toad_cx + toad_rx),
        min(h, toad_cy + toad_ry + 20)
    )
    toad_crop = base_sq.crop(toad_box)
    tcw, tch = toad_crop.size

    # 정밀한 두꺼비 알파 마스크
    t_mask = Image.new("L", (tcw, tch), 0)
    dt_mask = ImageDraw.Draw(t_mask)
    dt_mask.ellipse((10, 10, tcw - 10, tch - 10), fill=255)
    t_mask = t_mask.filter(ImageFilter.GaussianBlur(radius=6))

    # 3. 황금 코인 (3D 엽전 및 금화) 시뮬레이션
    num_frames = 28
    random.seed(888)
    coins = []
    for i in range(36):
        coins.append({
            'x': random.uniform(15, w - 15),
            'start_y': random.uniform(-160, h),
            'speed': random.uniform(16, 24),
            'size': random.uniform(10, 19),
            'rot_speed': random.uniform(0.22, 0.40),
            'rot_phase': random.uniform(0, math.pi * 2),
            'drift_x': random.uniform(-0.8, 0.8),
            'is_lucky_coin': (i % 3 == 0) # 복(福) 엽전 또는 십자 스파클
        })

    # 반짝이는 황금빛 파티클
    sparkles = []
    for _ in range(30):
        sparkles.append({
            'x': random.uniform(30, w - 30),
            'y': random.uniform(40, h - 60),
            'size': random.uniform(5, 12),
            'phase': random.uniform(0, math.pi * 2),
            'color': random.choice([(255, 245, 150), (255, 220, 80), (255, 255, 220)])
        })

    frames = []
    loop_h = h + 220

    print("Rendering high-octane jumping gold toad...")

    for f in range(num_frames):
        # 점프 물리 애니메이션 (신나는 도약 모션)
        # f: 0~4: 웅크리기(Squash)
        # f: 5~13: 솟구쳐오름(Leap Up!)
        # f: 14~18: 공중 부유 및 하강(Float & Fall)
        # f: 19~23: 착지 충격 흡수(Land Squash)
        # f: 24~27: 회복(Settle)
        if f <= 4:
            p = f / 4.0
            sq = math.sin(p * math.pi * 0.5)
            scale_x = 1.0 + 0.14 * sq
            scale_y = 1.0 - 0.14 * sq
            dy = 14 * sq
        elif f <= 13:
            p = (f - 5) / 8.0  # 0 ~ 1
            jump_h = math.sin(p * math.pi)
            dy = 14 - (82 * jump_h)  # 시원하게 82px 펄쩍 도약!
            scale_x = 1.0 - 0.10 * jump_h
            scale_y = 1.0 + 0.15 * jump_h
        elif f <= 18:
            p = (f - 13) / 5.0
            dy = -10 + 24 * (p ** 2)
            scale_x = 1.0 + 0.06 * p
            scale_y = 1.0 - 0.06 * p
        elif f <= 23:
            p = (f - 18) / 5.0
            land = math.sin(p * math.pi)
            dy = 14 * land
            scale_x = 1.0 + 0.12 * land
            scale_y = 1.0 - 0.12 * land
        else:
            p = (f - 23) / 4.0
            dy = 8 * (1.0 - p)
            scale_x = 1.0
            scale_y = 1.0

        # 베이스 배경 (잔상 없는 깨끗한 연잎 배경)
        frame = final_bg.copy()

        # 1. 연잎 바닥 그림자 (두꺼비 높이에 따라 크기/불투명도 동적 조절)
        shadow_overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d_shadow = ImageDraw.Draw(shadow_overlay)
        shadow_dist = max(0, -dy)
        s_scale = max(0.45, 1.0 - shadow_dist / 110.0)
        s_alpha = int(max(25, 130 - shadow_dist * 1.3))
        sw = int(toad_rx * 1.5 * s_scale)
        sh = int(32 * s_scale)
        sy = 365
        d_shadow.ellipse(
            (toad_cx - sw // 2, sy - sh // 2, toad_cx + sw // 2, sy + sh // 2),
            fill=(15, 35, 15, s_alpha)
        )
        shadow_overlay = shadow_overlay.filter(ImageFilter.GaussianBlur(radius=7))
        frame = Image.alpha_composite(frame, shadow_overlay)

        # 2. 도약하는 두꺼비 합성
        cur_w = max(10, int(tcw * scale_x))
        cur_h = max(10, int(tch * scale_y))
        t_res = toad_crop.resize((cur_w, cur_h), Image.Resampling.BICUBIC)
        m_res = t_mask.resize((cur_w, cur_h), Image.Resampling.BICUBIC)

        px = toad_cx - cur_w // 2
        py = toad_cy - cur_h // 2 + int(dy)
        frame.paste(t_res, (px, py), m_res)

        # 3. 반짝이는 황금 왕관 (머리 위에서 점프에 맞춰 통통 튐)
        crown_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d_cr = ImageDraw.Draw(crown_layer)
        # 왕관 좌표: 두꺼비 머리 꼭대기
        cr_x = toad_cx
        cr_y = py + int(cur_h * 0.09) + int(math.sin(f * 0.4) * 2)
        c_w = 34
        c_h = 24

        # 왕관 5개 뾰족 봉 폴리곤
        crown_poly = [
            (cr_x - c_w, cr_y),
            (cr_x - c_w * 0.85, cr_y - c_h * 0.8),
            (cr_x - c_w * 0.45, cr_y - c_h * 0.4),
            (cr_x, cr_y - c_h * 1.25),  # 센터 최고 높이
            (cr_x + c_w * 0.45, cr_y - c_h * 0.4),
            (cr_x + c_w * 0.85, cr_y - c_h * 0.8),
            (cr_x + c_w, cr_y),
            (cr_x, cr_y + 4)
        ]
        # 입체 황금 왕관 채우기
        d_cr.polygon(crown_poly, fill=(250, 185, 20, 245), outline=(255, 245, 160, 255))
        # 왕관 중앙 보석들 (에메랄드 & 루비)
        d_cr.ellipse((cr_x - 4, cr_y - c_h * 1.25 - 4, cr_x + 4, cr_y - c_h * 1.25 + 4), fill=(239, 68, 68, 255), outline=(255, 255, 255, 220))
        d_cr.ellipse((cr_x - c_w * 0.85 - 3, cr_y - c_h * 0.8 - 3, cr_x - c_w * 0.85 + 3, cr_y - c_h * 0.8 + 3), fill=(16, 185, 129, 255))
        d_cr.ellipse((cr_x + c_w * 0.85 - 3, cr_y - c_h * 0.8 - 3, cr_x + c_w * 0.85 + 3, cr_y - c_h * 0.8 + 3), fill=(16, 185, 129, 255))
        # 왕관 발광 아우라
        cr_glow = int(100 + 70 * math.sin(f * 0.5))
        d_cr.ellipse((cr_x - 45, cr_y - 30, cr_x + 45, cr_y + 15), fill=(255, 230, 80, cr_glow // 3))

        frame = Image.alpha_composite(frame, crown_layer)

        # 4. 하늘에서 쏟아지는 리얼 3D 황금 코인(엽전)
        coin_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d_coin = ImageDraw.Draw(coin_layer)

        for c in coins:
            tot_y = c['start_y'] + c['speed'] * f
            cy = (tot_y % loop_h) - 70
            cx = (c['x'] + c['drift_x'] * f) % w

            rot = c['rot_phase'] + c['rot_speed'] * f
            thick = abs(math.cos(rot))  # 3D 회전 두께 (0.05 ~ 1.0)
            r = c['size']
            hr = max(3.0, r * thick)

            # 앞면/뒷면에 따른 빛 반사 톤
            is_light = math.cos(rot) > 0
            main_gold = (252, 186, 3, 245) if is_light else (220, 140, 5, 245)
            rim_gold = (255, 248, 180, 255) if is_light else (245, 195, 60, 255)

            # 3D 코인 두께(측면 그림자) 렌더링
            if hr > 5:
                d_coin.ellipse((cx - r, cy - hr + 2, cx + r, cy + hr + 2), fill=(180, 105, 5, 200))

            # 코인 표면
            d_coin.ellipse((cx - r, cy - hr, cx + r, cy + hr), fill=main_gold, outline=rim_gold, width=2)

            # 엽전 중앙 사각 구멍 & 각인
            if hr > 6 and r > 10:
                hw = r * 0.36
                hh = hr * 0.36
                d_coin.rectangle(
                    (cx - hw, cy - hh, cx + hw, cy + hh),
                    fill=(130, 65, 10, 235), outline=(255, 240, 140, 220)
                )

            # 코인 하이라이트 글림(Sparkle gleam)
            if random.random() > 0.65:
                d_coin.ellipse((cx - 3, cy - hr * 0.5 - 2, cx + 3, cy - hr * 0.5 + 2), fill=(255, 255, 255, 240))

        # 5. 화려한 황금 스파클 (별빛 폭발)
        for s in sparkles:
            ts = f * 0.35 + s['phase']
            pulse = (math.sin(ts) + 1) / 2
            if pulse > 0.25:
                sr = s['size'] * (0.5 + 0.6 * pulse)
                sx, sy = s['x'], s['y']
                cr, cg, cb = s['color']
                alpha = int(230 * pulse)

                # 십자 별빛
                d_coin.line((sx - sr * 1.8, sy, sx + sr * 1.8, sy), fill=(cr, cg, cb, alpha), width=2)
                d_coin.line((sx, sy - sr * 1.8, sx, sy + sr * 1.8), fill=(cr, cg, cb, alpha), width=2)
                # 중심 코어
                d_coin.ellipse((sx - sr * 0.5, sy - sr * 0.5, sx + sr * 0.5, sy + sr * 0.5), fill=(255, 255, 255, alpha))

        frame = Image.alpha_composite(frame, coin_layer)

        # 256색 팔레트 최적화로 깔끔하게 변환
        frames.append(frame.convert("RGB"))

    print(f"Generated {len(frames)} premium frames. Saving GIF & WebP...")

    # GIF 저장
    out_gif = r"c:\Users\PA\Desktop\윤지의돈창고\assets\toad_gain.gif"
    out_gif_v3 = r"c:\Users\PA\Desktop\윤지의돈창고\assets\toad_gain_v3.gif"
    
    frames[0].save(
        out_gif,
        save_all=True,
        append_images=frames[1:],
        duration=65,  # ~15.4 FPS (아주 자연스러운 타이밍)
        loop=0,
        optimize=True
    )
    import shutil
    shutil.copyfile(out_gif, out_gif_v3)

    out_webp = r"c:\Users\PA\Desktop\윤지의돈창고\assets\toad_gain.webp"
    frames[0].save(
        out_webp,
        save_all=True,
        append_images=frames[1:],
        duration=65,
        loop=0,
        lossless=False,
        quality=92
    )
    print("Export Complete!")

if __name__ == "__main__":
    create_super_jumping_gold_toad()

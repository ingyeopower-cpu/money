import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

def generate_animation():
    base_path = r"c:\Users\PA\Desktop\윤지의돈창고\toad_assets\toad_base.jpg"
    base_img = Image.open(base_path).convert("RGBA")
    w, h = base_img.size

    # 축소 비율 (GIF/WebP 용량 및 최적화: 688 x 384 또는 800 x 446 등)
    target_w = 800
    target_h = int(h * (target_w / w))
    base_img = base_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    w, h = target_w, target_h

    # 두꺼비 중심 좌표 (800x446 기준)
    # 원본이 1376x768 -> 800x446 비율: scale = 800 / 1376 ≈ 0.5814
    scale = target_w / 1376.0
    toad_cx = int(670 * scale)
    toad_cy = int(410 * scale)
    toad_rx = int(240 * scale)
    toad_ry = int(220 * scale)

    # 눈 좌표 (좌안, 우안)
    left_eye_pos = (int(615 * scale), int(278 * scale), int(38 * scale))  # x, y, r
    right_eye_pos = (int(745 * scale), int(285 * scale), int(36 * scale))

    # 파티클 (빛가루 / 반딧불이) 35개 생성
    random.seed(42)
    particles = []
    for _ in range(35):
        particles.append({
            'x': random.uniform(50, w - 50),
            'y': random.uniform(30, h - 80),
            'speed_y': random.uniform(-0.8, -0.2),
            'speed_x': random.uniform(-0.3, 0.3),
            'base_size': random.uniform(2.5, 6.0) * scale,
            'phase': random.uniform(0, math.pi * 2),
            'color': random.choice([
                (255, 245, 180),
                (255, 230, 130),
                (200, 255, 210),
                (255, 255, 220)
            ])
        })

    num_frames = 36  # 약 1.8초 루프 (20 FPS)
    frames = []

    # 눈꺼풀 닫힘 타이밍: 프레임 18~21에서 깜빡임
    blink_frames = {18: 0.3, 19: 0.9, 20: 0.8, 21: 0.2}

    print("Generating animated frames...")

    for f in range(num_frames):
        # 1. 호흡 모션 계산 (호흡 주기 sin 곡선)
        t = (f / num_frames) * math.pi * 2
        breath_scale_y = 1.0 + 0.022 * math.sin(t)  # 상하 호흡 (약 2.2% 팽창)
        breath_scale_x = 1.0 + 0.012 * math.sin(t)  # 좌우 배 부풂 (약 1.2%)
        sway_y = 2.0 * math.sin(t)                  # 상하 들썩임

        # 두꺼비 영역 추출 및 부드러운 마스크 처리
        frame = base_img.copy()

        # 두꺼비 몸체 crop 및 호흡 변형
        crop_box = (
            max(0, toad_cx - toad_rx),
            max(0, toad_cy - toad_ry),
            min(w, toad_cx + toad_rx),
            min(h, toad_cy + toad_ry)
        )
        toad_crop = base_img.crop(crop_box)
        cw, ch = toad_crop.size

        # 호흡 스케일 적용
        new_cw = int(cw * breath_scale_x)
        new_ch = int(ch * breath_scale_y)
        toad_resized = toad_crop.resize((new_cw, new_ch), Image.Resampling.BICUBIC)

        # 타원형 페더 마스크 생성
        mask = Image.new("L", (new_cw, new_ch), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((10, 10, new_cw - 10, new_ch - 10), fill=240)
        mask = mask.filter(ImageFilter.GaussianBlur(radius=16 * scale))

        # 프레임에 부드럽게 합성 (두꺼비 발/바닥은 고정되고 배와 턱이 움직이도록)
        paste_x = toad_cx - new_cw // 2
        paste_y = toad_cy - new_ch // 2 + int(sway_y)
        frame.paste(toad_resized, (paste_x, paste_y), mask)

        # 2. 눈 깜빡임 (Blink)
        if f in blink_frames:
            blink_amount = blink_frames[f]
            draw = ImageDraw.Draw(frame, "RGBA")
            for ex, ey, er in [left_eye_pos, right_eye_pos]:
                ey_curr = ey + int(sway_y * 0.8)
                # 눈꺼풀 호를 위에서 아래로 덮음
                lid_h = int(er * 2 * blink_amount)
                if lid_h > 2:
                    # 두꺼비 눈꺼풀 색 (주변 피부 톤)
                    lid_color = (138, 160, 85, 235)
                    rim_color = (88, 110, 55, 220)
                    draw.chord((ex - er, ey_curr - er, ex + er, ey_curr - er + lid_h * 2),
                               start=0, end=180, fill=lid_color, outline=rim_color, width=2)

        # 3. 물결 하이라이트 글리머 (하단 연못 수면 미세 일렁임)
        # sin 파동 기반 쉬머 오버레이
        water_y = int(290 * scale)
        water_overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw_water = ImageDraw.Draw(water_overlay)
        for i in range(12):
            phase = t + i * 0.8
            alpha = int(45 + 35 * math.sin(phase))
            wx = int((120 + i * 55 + math.sin(phase) * 20) * scale)
            wy = int((330 + (i % 4) * 25 + math.cos(phase) * 8) * scale)
            wr = int((18 + 8 * math.sin(phase * 1.5)) * scale)
            draw_water.ellipse((wx - wr, wy - wr // 2, wx + wr, wy + wr // 2),
                               fill=(255, 255, 220, alpha))
        water_overlay = water_overlay.filter(ImageFilter.GaussianBlur(radius=8 * scale))
        frame = Image.alpha_composite(frame, water_overlay)

        # 4. 빛가루 및 반딧불이 파티클 렌더링
        particle_overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw_p = ImageDraw.Draw(particle_overlay)

        for p in particles:
            cur_x = p['x'] + p['speed_x'] * f + math.sin(t + p['phase']) * 6 * scale
            cur_y = p['y'] + p['speed_y'] * f + math.cos(t + p['phase']) * 4 * scale
            # 루프 래핑
            cur_x = cur_x % w
            cur_y = cur_y % h

            # 발광 펄스
            glow = (math.sin(t * 2 + p['phase']) + 1) / 2
            size = p['base_size'] * (0.8 + 0.4 * glow)
            alpha = int(90 + 150 * glow)

            r, g, b = p['color']
            # 바깥 은은한 광채
            draw_p.ellipse(
                (cur_x - size * 2.5, cur_y - size * 2.5, cur_x + size * 2.5, cur_y + size * 2.5),
                fill=(r, g, b, int(alpha * 0.25))
            )
            # 중심 밝은 코어
            draw_p.ellipse(
                (cur_x - size, cur_y - size, cur_x + size, cur_y + size),
                fill=(255, 255, 255, alpha)
            )

        frame = Image.alpha_composite(frame, particle_overlay)

        # RGB 변환 후 프레임 저장
        frames.append(frame.convert("RGB"))

    print(f"Generated {len(frames)} frames. Saving GIF and WebP...")

    # 1. GIF 저장 (20 FPS = 50ms duration)
    gif_path = r"c:\Users\PA\Desktop\윤지의돈창고\toad_assets\animated_toad.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=50,
        loop=0,
        optimize=True
    )
    print(f"Saved GIF to: {gif_path}")

    # 2. WebP 애니메이션 저장 (고화질, 부드러운 30/20 FPS)
    webp_path = r"c:\Users\PA\Desktop\윤지의돈창고\toad_assets\animated_toad.webp"
    frames[0].save(
        webp_path,
        save_all=True,
        append_images=frames[1:],
        duration=50,
        loop=0,
        lossless=False,
        quality=92
    )
    print(f"Saved WebP to: {webp_path}")

if __name__ == "__main__":
    generate_animation()

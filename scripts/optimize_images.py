#!/usr/bin/env python3
"""Resize raster assets and emit WebP siblings for faster loads.

Usage: python3 scripts/optimize_images.py
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES_ROOT = ROOT / "app" / "static" / "assets" / "images"

WEBP_QUALITY = 88
PNG_OPTIMIZE = True
JPEG_QUALITY = 90


def max_width_for(path: Path) -> int:
    parts = path.as_posix().lower()
    name = path.name.lower()

    if "/customers/" in parts or "/icons/customers/" in parts:
        return 320
    if "mobile_cover" in name or name.startswith("mobile_"):
        return 520
    if "desktop_cover" in name:
        return 1920
    if "/home/" in parts:
        return 1600
    if "/about/" in parts:
        return 1400
    if "/404/" in parts:
        return 800
    if "/projects/" in parts:
        return 1920
    return 1200


def _resize(img: Image.Image, max_w: int) -> Image.Image:
    if img.width <= max_w:
        return img
    ratio = max_w / img.width
    new_size = (max_w, max(1, round(img.height * ratio)))
    return img.resize(new_size, Image.Resampling.LANCZOS)


def optimize_file(path: Path) -> tuple[int, int]:
    before = path.stat().st_size
    max_w = max_width_for(path)
    ext = path.suffix.lower()

    with Image.open(path) as src:
        has_alpha = src.mode in ("RGBA", "LA") or (
            src.mode == "P" and "transparency" in src.info
        )
        if has_alpha:
            img = src.convert("RGBA")
        elif ext in (".jpg", ".jpeg"):
            img = src.convert("RGB")
        else:
            img = src.convert("RGBA" if has_alpha else "RGB")

        img = _resize(img, max_w)

        webp_path = path.with_suffix(".webp")
        webp_kwargs = {"quality": WEBP_QUALITY, "method": 6}
        if has_alpha:
            webp_kwargs["lossless"] = False
        img.save(webp_path, "WEBP", **webp_kwargs)

        if ext == ".png":
            img.save(path, "PNG", optimize=PNG_OPTIMIZE)
        elif ext in (".jpg", ".jpeg"):
            rgb = img.convert("RGB")
            rgb.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)

    after = path.stat().st_size + webp_path.stat().st_size
    return before, after


def main() -> None:
    total_before = 0
    total_after = 0
    count = 0

    for path in sorted(IMAGES_ROOT.rglob("*")):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        before, after = optimize_file(path)
        total_before += before
        total_after += after
        count += 1
        print(f"{path.relative_to(ROOT)}  {before // 1024}KB -> {after // 1024}KB (incl. webp)")

    print(f"\n{count} files — {total_before // 1024 // 1024}MB -> {total_after // 1024 // 1024}MB total")


if __name__ == "__main__":
    main()

"""Extract the line-art face/brain from the vector business-card PDF.

The source PDF is not modified. Paths are selected by their page-space bounds,
not by brittle drawing indices; typography and card outlines are excluded.
"""

from pathlib import Path
import fitz

SOURCE = Path(r"D:\YandexDisk\_ODA2\Брендбук\Визитки\Визитка.pdf")
OUTPUT = Path(__file__).parent / "assets" / "oda-brain.svg"
LEFT, TOP, RIGHT, BOTTOM = 102, 74, 153, 141


def pt(point):
    return f"{point.x - LEFT:.3f} {point.y - TOP:.3f}"


def same(a, b):
    return b is not None and abs(a.x - b.x) < 0.01 and abs(a.y - b.y) < 0.01


page = fitz.open(SOURCE)[0]
paths = []
for drawing in page.get_drawings():
    box = drawing["rect"]
    if not (box.x0 >= LEFT and box.y0 >= TOP and box.x1 <= RIGHT and box.y1 <= BOTTOM):
        continue
    commands = []
    previous = None
    for item in drawing["items"]:
        kind, start = item[:2]
        if not same(start, previous):
            commands.append(f"M {pt(start)}")
        if kind == "l":
            previous = item[2]
            commands.append(f"L {pt(previous)}")
        elif kind == "c":
            previous = item[4]
            commands.append(f"C {pt(item[2])} {pt(item[3])} {pt(previous)}")
        else:
            raise ValueError(f"Unexpected path segment: {kind}")
    if drawing["closePath"]:
        commands.append("Z")
    paths.append(f'<path fill-rule="evenodd" d="{" ".join(commands)}"/>')

svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 67" '
    'fill="currentColor" aria-hidden="true">\n'
    + "\n".join(paths)
    + "\n</svg>\n"
)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(svg, encoding="utf-8")
print(f"Extracted {len(paths)} vector paths to {OUTPUT}")

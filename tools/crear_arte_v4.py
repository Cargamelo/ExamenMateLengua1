#!/usr/bin/env python3
"""Produce original project artwork from user-supplied fantasy reference sheets.

The two HTTPS source URLs are copies of artwork furnished by the project owner.
Only the optimized derived WEBP assets are required by GitHub Pages.
No user accounts, learning progress, tokens or personal data are downloaded.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps, ImageChops
from urllib.request import Request, urlopen
import io, math, random, os, hashlib

REFERENCE_CHARACTERS = "https://d2ol7oe51mr4n9.cloudfront.net/user_3Eqb9DprbRkWGw9rSTxOJ5QDfCf/5a32ac3c-e3dd-4c62-b229-81c7fe325a56.png"
REFERENCE_FOREST = "https://d2ol7oe51mr4n9.cloudfront.net/user_3Eqb9DprbRkWGw9rSTxOJ5QDfCf/3602d831-502c-4834-a69e-34560c396da9.png"
OUT = Path("assets/arte-v4")
OUT.mkdir(parents=True, exist_ok=True)

def download(source, size):
    req = Request(source, headers={"User-Agent":"LaLigaDelSaber-asset-builder/1.0"})
    with urlopen(req, timeout=90) as r:
        buf=r.read(12_000_001)
    if len(buf)>12_000_000:
        raise RuntimeError("El recurso supera el tamaño máximo permitido")
    with Image.open(io.BytesIO(buf)) as image:
        image.load()
        if image.size != size: raise RuntimeError(f"Resolución inesperada {image.size} (esperada {size})")
        return image.convert("RGB")

def save(im, name, quality=88):
    dest=OUT/name
    im.save(dest,"WEBP",quality=quality,method=6)
    with Image.open(dest) as test: test.verify()
    print(f"{dest}: {im.width} x {im.height}, {dest.stat().st_size} bytes")

def soft_portrait(image, crop):
    im=image.crop(crop).convert("RGBA")
    w,h=im.size
    alpha=Image.new("L",(w,h),0)
    pixels=alpha.load()
    for y in range(h):
        for x in range(w):
            left=min(1, x/14)
            right=min(1,(w-1-x)/14)
            top=min(1,y/7)
            bottom=min(1,(h-1-y)/52)
            px=min(left,right,top,bottom)
            pixels[x,y]=max(0,min(255,round(255*px**.6)))
    im.putalpha(alpha)
    return im

def crop_sprites(characters):
    # Character heads from the expression/sprite strips of the supplied art board.
    frames={
        "tiko-normal":(27,366,116,458),
        "tiko-sonriente":(143,366,231,458),
        "tiko-pensativo":(389,366,470,458),
        "tiko-celebra":(503,366,590,458),
        "tiko-pista":(626,366,710,458),
        "nara-normal":(793,366,884,458),
        "nara-sonriente":(907,366,997,458),
        "nara-pensativo":(1155,366,1242,458),
        "nara-celebra":(1273,366,1363,458),
        "nara-pista":(1399,366,1498,458)
    }
    for name, box in frames.items():
        cropped=characters.crop(box)
        # Source is smaller than a hero portrait; use it only as a small expression badge.
        resized=ImageOps.fit(cropped,(112,112),method=Image.Resampling.LANCZOS)
        save(resized,name+".webp",quality=90)
    tiny={"tiko":(30,498,91,583),"nara":(791,498,862,583)}
    for name, box in tiny.items():
        small=characters.crop(box).convert("RGBA")
        # Chibi sprites with soft edge transparency to blend with fantasy maps.
        a=Image.new("L",small.size,0); pix=a.load(); w,h=small.size
        for y in range(h):
            for x in range(w):
                xf=min(1,x/9,(w-1-x)/9)
                yf=min(1,y/9,(h-1-y)/9)
                pix[x,y]=round(255*max(0,min(xf,yf))**.7)
        small.putalpha(a)
        small=small.resize((small.width*2,small.height*2),Image.Resampling.NEAREST)
        save(small, name+"-sprite.webp", quality=92)

def make_forest(forest):
    # Full-frame magic forest, no artificial sharpen filters and no upscaling.
    save(forest,"bosque-magico.webp",quality=92)
    save(ImageOps.fit(forest,(1080,1380),method=Image.Resampling.LANCZOS,centering=(.57,.5)), "bosque-vertical.webp",quality=90)

def make_portals(forest):
    # Per-world differentiated crops rather than the same picture stretched twice.
    for name,center,tint in [
        ("portal-numeros",(0.70,0.5),(18,88,85)),
        ("portal-palabras",(0.30,0.48),(86,36,113))
    ]:
        im=ImageOps.fit(forest,(720,1040),method=Image.Resampling.LANCZOS,centering=center)
        lay=Image.new("RGB",im.size,tint)
        im=Image.blend(im,lay,.16)
        save(im,name+".webp",quality=91)

def map_art(forest,subject):
    width,height=1200,1900
    base=Image.new("RGB",(width,height),"#122f3d")
    # Three scenes from the same magical world, differently cropped/color-graded.
    # Art detail remains native-resolution; no enlargement of a tiny map thumbnail.
    for index in range(3):
        y=index*633
        section=ImageOps.fit(forest,(1200,696),method=Image.Resampling.LANCZOS,
              centering=(([.62,.29,.81][index]),([.36,.61,.47][index])))
        if index==1: section=ImageOps.mirror(section)
        tint=Image.new("RGB",section.size,(11,69,74) if subject=="math" else (55,28,88))
        section=Image.blend(section,tint,.10 if subject=="math" else .23)
        # Blend scene boundaries using alpha to avoid artificial horizontal seams.
        if index>0:
            alpha=Image.new("L",section.size,255); px=alpha.load()
            for i in range(76):
                k=round(255*i/75)
                for x in range(width): px[x,i]=k
            base.paste(section,(0,y),alpha)
        else: base.paste(section,(0,y))
    base=base.crop((0,0,width,height)).convert("RGBA")
    overlay=Image.new("RGBA",(width,height),(0,0,0,0))
    draw=ImageDraw.Draw(overlay,"RGBA")
    ys=[.08+.06*n for n in range(15)] if subject=="math" else [.06+.063*n for n in range(15)]
    nodes=[(round((.39 if n%2==0 else .60)*width),round(y*height)) for n,y in enumerate(ys)]
    path=[(nodes[0][0],0),*nodes,(nodes[-1][0],height)]
    # Markers are live HTML buttons; the background contains only scenery and routes.
    draw.line(path, fill=(5,18,28,194),width=83,joint="curve")
    draw.line(path, fill=(103,79,57,233),width=69,joint="curve")
    draw.line(path, fill=(147,116,75,205),width=51,joint="curve")
    draw.line(path, fill=(182,153,99,106),width=29,joint="curve")
    accent=(88,236,207,180) if subject=="math" else (200,132,242,185)
    for index,(x,y) in enumerate(nodes):
        rad=49
        draw.ellipse((x-rad,y-rad,x+rad,y+rad),outline=(245,202,125,105),width=5)
        draw.ellipse((x-60,y-60,x+60,y+60),outline=accent,width=2)
    # Decorative magical symbols placed away from the path for visual differentiation.
    rng=random.Random(214 if subject=="math" else 821)
    for k in range(90):
        x=rng.choice([rng.randrange(30,320),rng.randrange(850,1170)])
        y=rng.randrange(25,height-40)
        rr=rng.randrange(2,5)
        draw.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(*accent[:3],rng.randrange(65,175)))
    if subject=="math":
        for i,y in enumerate([170,510,890,1290,1670]):
            x=135 if i%2==0 else 1055
            # Number crystals, NOT functional phase markers.
            draw.polygon([(x,y-64),(x+39,y),(x,y+66),(x-39,y)],fill=(30,119,120,130),outline=(126,249,223,210),width=5)
            draw.line([(x,y-50),(x+20,y),(x,y+41)],fill=(195,255,241,130),width=3)
    else:
        for i,y in enumerate([135,400,660,940,1210,1480,1780]):
            x=140 if i%2==0 else 1035
            draw.rounded_rectangle((x-58,y-48,x+58,y+48),radius=9,fill=(71,32,88,165),outline=(230,181,248,185),width=4)
            draw.line([(x,y-31),(x,y+31)],fill=(230,192,242,150),width=4)
            draw.arc((x-45,y-25,x-2,y+28),-100,100,fill=(241,218,252,160),width=3)
            draw.arc((x+2,y-25,x+45,y+28),80,280,fill=(241,218,252,160),width=3)
    base=Image.alpha_composite(base,overlay).convert("RGB")
    save(base,"mapa-"+("numeros" if subject=="math" else "palabras")+".webp",quality=89)

def main():
    characters=download(REFERENCE_CHARACTERS,(1536,1024))
    forest=download(REFERENCE_FOREST,(1376,768))
    save(soft_portrait(characters,(470,0,781,341)),"tiko-retrato.webp",quality=93)
    save(soft_portrait(characters,(796,0,1077,341)),"nara-retrato.webp",quality=93)
    crop_sprites(characters)
    make_forest(forest)
    make_portals(forest)
    make_map=map_art
    make_map(forest,"math")
    make_map(forest,"lang")
    print("Arte generado a partir de referencias aportadas por el usuario.")

if __name__=="__main__": main()

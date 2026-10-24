import cv2, numpy as np, os
from PIL import Image,ImageDraw,ImageFilter,ImageEnhance
src="/tmp/portada-original.png";out="assets/portada";os.makedirs(out,exist_ok=True)
im=Image.open(src).convert("RGB");w,h=im.size
cv=cv2.cvtColor(np.array(im),cv2.COLOR_RGB2BGR)
# Remove all raster text and fictional counters, leaving the illustrated architecture.
mask=np.zeros((h,w),dtype=np.uint8)
def rect(x1,y1,x2,y2):
 cv2.rectangle(mask,(x1,y1),(x2,y2),255,-1)
rect(285,55,544,107) # large text inside wooden sign
rect(300,99,512,127) # tagline strip content
rect(84,28,184,66) # welcome text only
rect(650,19,821,58) # fictional star/coin data
 # The two hanging subject labels are approved illustrated signs; preserve their original painting.

rect(275,288,396,333) # math parchment type
rect(438,287,569,334) # language parchment type
rect(308,317,367,381) # math fake play button
rect(465,316,525,381) # lang fake play button
rect(214,399,614,451) # old ornamental menu contents
clean=cv2.inpaint(cv,mask,11,cv2.INPAINT_TELEA)
# restore original ornaments where controls are not present, leave individual HTML layers on top
scene=Image.fromarray(cv2.cvtColor(clean,cv2.COLOR_BGR2RGB))
# gently increase crispness at presentation scale
scene=scene.resize((1648,954),Image.Resampling.LANCZOS)
scene=ImageEnhance.Sharpness(scene).enhance(1.23)
scene.save(out+"/escenario.webp","WEBP",quality=86,method=6)
# Characters and companions are exported as their OWN transparent variants, never overwriting anime resources.
def cut(name,box,polygon):
 x0,y0,x1,y1=box
 crop=im.crop(box).convert("RGBA")
 mask=Image.new("L",crop.size)
 d=ImageDraw.Draw(mask)
 d.polygon([(x-x0,y-y0) for x,y in polygon],fill=255)
 mask=mask.filter(ImageFilter.GaussianBlur(1.1))
 crop.putalpha(mask)
 cr=crop.resize((crop.width*3,crop.height*3),Image.Resampling.LANCZOS)
 cr.save(out+"/"+name+".webp","WEBP",quality=93,method=6)
# polygons trace character outlines in the approved reference in source coordinate space
cut("tiko-portada",(63,117,275,418),[(89,379),(98,356),(106,334),(83,341),(74,355),(66,351),(72,331),(91,324),(89,298),(102,284),(100,254),(95,241),(91,228),(103,204),(114,195),(112,182),(124,151),(129,147),(128,136),(150,130),(157,119),(173,129),(189,123),(199,132),(208,151),(206,169),(193,180),(198,195),(213,209),(226,222),(242,229),(253,224),(266,235),(275,244),(263,250),(244,248),(224,240),(213,255),(223,276),(228,312),(217,343),(226,367),(225,389),(209,398),(200,408),(181,413),(163,401),(154,386),(136,400),(121,398),(110,387)])
cut("nara-portada",(573,140,816,420),[(586,367),(596,337),(611,310),(624,290),(612,272),(610,244),(620,223),(606,222),(586,236),(574,239),(576,222),(596,218),(615,207),(624,187),(634,165),(659,150),(682,145),(702,151),(727,169),(739,193),(739,205),(756,210),(765,221),(777,237),(792,247),(798,271),(789,283),(777,275),(759,258),(754,294),(744,327),(735,353),(737,377),(723,391),(711,403),(688,408),(667,409),(645,398),(633,383),(612,393),(595,397)])
cut("buho-portada",(15,322,93,404),[(15,346),(23,330),(43,322),(68,326),(87,347),(90,377),(80,398),(58,404),(31,399),(18,381)])
cut("conejo-portada",(728,331,809,418),[(729,386),(737,377),(738,354),(745,341),(757,334),(759,349),(771,341),(778,330),(791,338),(788,360),(801,368),(808,391),(800,406),(777,415),(745,410)])
# Render locally readable proof of the complete scenographic plate and transparent characters
with open(out+"/manifest.txt","w") as f:
 for fn in os.listdir(out):
  f.write(fn+" "+str(os.path.getsize(os.path.join(out,fn)))+"\n")
print(open(out+"/manifest.txt").read())

# Portal artwork: use cleaned source, remove raster labels/play icons, and retain painted masonry.
base=Image.fromarray(cv2.cvtColor(clean,cv2.COLOR_BGR2RGB))
def portal(name,box,poly):
 x0,y0,x1,y1=box
 cutout=base.crop(box).convert('RGBA')
 m=Image.new('L',cutout.size); d=ImageDraw.Draw(m)
 d.polygon([(x-x0,y-y0) for x,y in poly],fill=255)
 m=m.filter(ImageFilter.GaussianBlur(.8));cutout.putalpha(m)
 cutout.resize((cutout.width*3,cutout.height*3),Image.Resampling.LANCZOS).save(out+'/'+name+'.webp','WEBP',quality=86,method=6)
portal('portal-matematicas',(247,135,420,390),[(253,389),(250,280),(255,220),(265,175),(290,149),(326,139),(360,145),(390,166),(408,202),(415,248),(412,323),(409,389)])
portal('portal-lengua',(419,135,587,390),[(421,389),(420,265),(429,208),(450,163),(472,145),(505,136),(545,149),(571,177),(584,216),(585,270),(580,389)])
# An open spell book with star, extracted as ornament.
book=im.crop((380,8,470,66)).convert('RGBA');m=Image.new('L',book.size)
ImageDraw.Draw(m).ellipse((0,0,90,57),fill=255);m=m.filter(ImageFilter.GaussianBlur(1));book.putalpha(m)
book.resize((360,232),Image.Resampling.LANCZOS).save(out+'/libro-estrella.webp','WEBP',quality=92,method=6)
print('ASSETS READY',[(f,os.path.getsize(out+'/'+f)) for f in os.listdir(out) if f.endswith('webp')])

# Hand-painted wood-menu icons from the approved reference, not platform emojis.
for name,box in [
 ('icon-coleccion',(223,397,256,434)),
 ('icon-errores',(330,396,362,434)),
 ('icon-logros',(438,395,476,433)),
 ('icon-ajustes',(544,395,582,436))]:
 tile=im.crop(box).convert("RGBA")
 alpha=Image.new("L",tile.size,0)
 d=ImageDraw.Draw(alpha)
 d.rounded_rectangle((1,1,tile.width-2,tile.height-2),radius=8,fill=255)
 alpha=alpha.filter(ImageFilter.GaussianBlur(1.9));tile.putalpha(alpha)
 tile.resize((tile.width*4,tile.height*4),Image.Resampling.LANCZOS).save(out+"/"+name+".webp","WEBP",quality=88,method=6)

"""Render bilingual reference documents from the canonical site data."""
from pathlib import Path
import hashlib, json
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as ReportFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from fontTools.ttLib import TTFont
from fontTools.merge import Merger
import fitz

scratch = Path('.local-server/overview-render')
scratch.mkdir(parents=True, exist_ok=True)
output = Path('output/pdf')
output.mkdir(parents=True, exist_ok=True)
for name, package, weight in [('Heading', 'manrope', '600'), ('Reading', 'jetbrains-mono', '400')]:
    parts = []
    for subset in ['latin','cyrillic']:
        font = TTFont(f'node_modules/@fontsource/{package}/files/{package}-{subset}-{weight}-normal.woff')
        font.flavor = None
        path = scratch / f'{name}-{subset}.ttf'
        font.save(path)
        parts.append(str(path))
    merged = Merger().merge(parts)
    font_path = scratch / f'{name}.ttf'
    merged.save(font_path)
    pdfmetrics.registerFont(ReportFont(name, str(font_path)))
packet = json.loads(Path('.local-server/overview-input.json').read_text(encoding='utf8'))
data = packet['input']
W,H = A4
margin=42
ink=HexColor('#24221f')
muted=HexColor('#626058')
green=HexColor('#007654')
style = ParagraphStyle('body', fontName='Reading', fontSize=8.7, leading=13.5, textColor=ink, spaceAfter=7)
small = ParagraphStyle('small', parent=style, fontSize=7.7, leading=11.5, textColor=muted)
heading = ParagraphStyle('heading', fontName='Heading', fontSize=14, leading=18, textColor=ink)
metadata=[]
for lang in ['ru','en']:
    ru = lang=='ru'
    path=output/f'oda-dream-technical-overview-{lang}.pdf'
    pdf=canvas.Canvas(str(path), pagesize=A4, invariant=1)
    pdf.setTitle('ODA.dream | '+('Технический обзор' if ru else 'Technical overview'))
    pdf.setAuthor('ODA.dream')
    def para(text, x, y, width=W-2*margin, kind=style):
        text=text.translate({ord(char): '-' for char in '\u2010\u2011\u2012\u2013\u2014'})
        block=Paragraph(escape(text).replace('\n','<br/>'),kind)
        _,height=block.wrap(width,H)
        if y-height < 62: raise ValueError(f'Page overflow: {lang}: {text[:40]}')
        block.drawOn(pdf,x,y-height)
        return y-height-7
    def label(text,y):
        pdf.setFillColor(green)
        pdf.setFont('Reading',8)
        pdf.drawString(margin,y,text)
        return y-19
    def start(page,title):
        pdf.setFillColor(ink)
        pdf.setFont('Heading',19)
        pdf.drawString(margin,H-51,'ODA.dream')
        pdf.setStrokeColor(HexColor('#d6d3cb'))
        pdf.line(margin,H-67,W-margin,H-67)
        pdf.setFillColor(muted)
        pdf.setFont('Reading',7.5)
        pdf.drawRightString(W-margin,H-51,f'{lang.upper()} / {data["asOf"]}')
        y=para(title,margin,H-93,kind=ParagraphStyle('title',parent=heading,fontSize=22,leading=27))
        pdf.setFont('Reading',7)
        pdf.setFillColor(muted)
        pdf.drawString(margin,34,'odadream.art / '+('Обсуждение по брифу' if ru else 'Scoped per brief'))
        pdf.drawRightString(W-margin,34,f'{page} / 2')
        pdf.linkURL(f'https://odadream.art/{lang}/cooperation/',(margin,29,350,42),relative=0)
        return y-7
    y=start(1,'Три варианта участия' if ru else 'Three participation options')
    y=para('Обзор для подготовки показа или образовательной встречи. Длительность, оборудование и задачи команды согласуем для вашего события.' if ru else 'An overview for planning a presentation or educational meeting. We agree duration, equipment and team responsibilities for your event.',margin,y,kind=small)
    states={'historical':('Архив','Archive'),'conflict':('Уточнить','To confirm'),'per-brief':('По брифу','Per brief')}
    for index,row in enumerate(data['formats'],1):
        y=label(f'{index:02}',y-4)
        y=para(row['title'][lang],margin,y,kind=heading)
        y=para(row['participation'][lang],margin,y,kind=small)
        for condition in row['conditions']:
            state=states[condition['state']][0 if ru else 1]
            y=para(f'{condition["label"][lang]} [{state}]. {condition["value"][lang]}',margin,y,kind=small)
        y-=3
    pdf.showPage()
    y=start(2,'Команда и инфраструктура' if ru else 'Team and infrastructure')
    y=para('Измеряемые участники, зрительская аудитория и пропускная способность - разные параметры. Состав команды, смены и длительность работы согласуем в предложении.' if ru else 'Measured participants, audience size and throughput are different parameters. Staffing, shifts and operating duration are agreed in the proposal.',margin,y,kind=small)
    y=label('ODA.dream',y-7)
    for item in data['studioProvides'][lang]: y=para('• '+item,margin,y)
    y=label('ПЛОЩАДКА / ОРГАНИЗАТОР' if ru else 'VENUE / ORGANISER',y-7)
    for item in data['venueProvides'][lang]: y=para('• '+item,margin,y)
    y=label('ОСОБЕННОСТИ КОНФИГУРАЦИЙ' if ru else 'CONFIGURATION REQUIREMENTS',y-7)
    for row in data['formats']:
        y=para(row['title'][lang]+'. '+ '; '.join(row['venueProvides'][lang])+'.',margin,y,kind=small)
    y=label('ДЛЯ ПЕРВОГО ОБРАЩЕНИЯ' if ru else 'FOR AN INITIAL INQUIRY',y-7)
    for item in data['briefFields']: y=para('• '+item[lang],margin,y,kind=small)
    y=para('Полные параметры и актуальные условия:' if ru else 'Full parameters and current conditions:',margin,y-4,kind=small)
    for suffix in ['works','education','cooperation']:
        url=f'https://odadream.art/{lang}/{suffix}/'
        top=y
        y=para(url,margin,y,kind=small)
        pdf.linkURL(url,(margin,y+7,W-margin,top),relative=0)
    pdf.showPage()
    pdf.save()
    with fitz.open(path) as document:
        if len(document)!=2: raise ValueError('Two pages required')
        for page in document:
            page.get_pixmap(matrix=fitz.Matrix(1.4,1.4),alpha=False).save(scratch/f'{lang}-{page.number+1}.png')
    metadata.append({'language':lang,'href':'/documents/'+path.name,'path':str(path),'pages':2,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
Path('.local-server/overview-output.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(metadata,ensure_ascii=False))


"""One-off current CV preparation from curated V2 facts; sources stay read-only."""
from pathlib import Path
import json,hashlib
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
import fitz

scratch=Path('.local-server/cv-render'); scratch.mkdir(parents=True,exist_ok=True)
output=Path('output/pdf');output.mkdir(parents=True,exist_ok=True)
for name in ['Heading','Reading']:
    pdfmetrics.registerFont(TTFont(name,str(Path('.local-server/overview-render')/(name+'.ttf'))))
W,H=A4; margin=42; ink=HexColor('#24221f'); muted=HexColor('#626058'); green=HexColor('#007654')
body=ParagraphStyle('body',fontName='Reading',fontSize=8.1,leading=12.2,textColor=ink)
note=ParagraphStyle('note',parent=body,fontSize=7.5,leading=11,textColor=muted)
heading=ParagraphStyle('heading',fontName='Heading',fontSize=12.5,leading=17,textColor=ink)
metadata=[]
for packet in json.loads(Path('.local-server/cv-input.json').read_text(encoding='utf8')):
    document=packet['document'];data=packet['input'];person=data['person'];lang=document['language'];ru=lang=='ru'
    path=output/f'oda-dream-cv-{person["id"]}-{lang}.pdf'
    pdf=canvas.Canvas(str(path),pagesize=A4,invariant=1)
    pdf.setTitle('CV | '+person['name'][lang]);pdf.setAuthor('ODA.dream')
    def para(text,y,style=body):
        text=text.translate({ord(char):'-' for char in '\u2010\u2011\u2012\u2013\u2014'})
        block=Paragraph(escape(text),style);_,height=block.wrap(W-2*margin,H)
        if y-height<67: raise ValueError(f'CV overflow: {person["id"]}/{lang}: {text[:40]}')
        block.drawOn(pdf,margin,y-height); return y-height-7
    def title(text,y):return para(text,y-3,heading)
    pdf.setFillColor(ink);pdf.setFont('Heading',17);pdf.drawString(margin,H-48,'ODA.dream')
    pdf.setFillColor(green);pdf.setFont('Reading',8);pdf.drawRightString(W-margin,H-48,f'CV / {lang.upper()} / {data["asOf"]}')
    pdf.setStrokeColor(HexColor('#d6d3cb'));pdf.line(margin,H-64,W-margin,H-64)
    y=para(person['name'][lang],H-84,ParagraphStyle('name',parent=heading,fontSize=23,leading=28))
    y=para(person['role'][lang],y,note)
    y=para(person['biography'][lang],y-4)
    for section in person['cv']['sections']:
        y=title(section['title'][lang],y); y=para(section['body'][lang],y)
    y=title('Выбранные работы ODA.dream' if ru else 'Selected ODA.dream works',y)
    for work in data['works']:
        text=work['title'][lang]+(' · '+str(work['year']) if work['year'] else '')
        top=y;y=para(text,y)
        pdf.linkURL(f'https://odadream.art/{lang}/works/{work["slug"]}/',(margin,y+7,W-margin,top),relative=0)
    y=title('События практики студии' if ru else 'Selected studio engagements',y)
    for case in data['cases']:
        y=para(case['date']+' · '+case['title'][lang]+' · '+case['place'][lang],y)
        top=y;y=para(('Роль студии: ' if ru else 'Studio role: ')+case['role'][lang],y,note)
        suffix=f'cases/{case["slug"]}/' if case['detailPage'] else f'cases/#case-{case["slug"]}'
        pdf.linkURL(f'https://odadream.art/{lang}/{suffix}',(margin,y+7,W-margin,top),relative=0)
    y=para(person['cv']['base'][lang],y-3,note)
    pdf.setFont('Reading',7);pdf.setFillColor(muted)
    pdf.drawString(margin,34,f'odadream.art/{lang}/studio/');pdf.drawRightString(W-margin,34,'1 / 1')
    pdf.linkURL(f'https://odadream.art/{lang}/studio/#person-{person["id"]}',(margin,29,310,42),relative=0)
    pdf.showPage();pdf.save()
    with fitz.open(path) as doc:
        assert len(doc)==1
        text=doc[0].get_text()
        if '@' in text or '+7' in text or '\ufffd' in text: raise ValueError('Unexpected contact/glyph payload')
        doc[0].get_pixmap(matrix=fitz.Matrix(1.4,1.4),alpha=False).save(scratch/f'{person["id"]}-{lang}.png')
    metadata.append({'id':document['id'],'language':lang,'href':'/documents/'+path.name,'path':str(path),'pages':1,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
Path('.local-server/cv-output.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(metadata,ensure_ascii=False))

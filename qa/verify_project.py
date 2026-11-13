"""Dependency-free static release checklist. Run from any directory: python qa/verify_project.py"""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
checks=[]
for page in ('index.html','planner.html','focus.html','profile.html'):
    source=(root/page).read_text(encoding='utf-8')
    checks += [(f'{page}: theme toggle', 'id="themeToggle"' in source)]
    checks += [(f'{page}: profile navigation', 'href="profile.html"' in source)]
    checks += [(f'{page}: main landmark', 'id="mainContent"' in source)]
    checks += [(f'{page}: local scripts', 'js/ui.js' in source and 'js/app.js' in source)]
for src in ('app','data','effects','focus','planner','storage','ui','theme-init','profile'):
    checks += [(f'js/{src}.js exists', (root/'js'/f'{src}.js').is_file())]
contents='\n'.join((root/'js'/f'{f}.js').read_text(encoding='utf-8') for f in ('focus','planner','profile','ui'))
checks += [('No blocking native confirm()', not re.search(r'(?:window\.)?confirm\s*\(', contents))]
checks += [('No blocking native alert()', not re.search(r'(?:window\.)?alert\s*\(', contents))]
checks += [('CSS light mode selector', 'data-theme="light"' in (root/'css/final.css').read_text(encoding='utf-8'))]
checks += [('jQuery animation effects', all(x in (root/'js/effects.js').read_text() for x in ('slideToggle','fadeIn','fadeOut','animate')))]
checks += [('Profile backup support', all(x in (root/'js/profile.js').read_text() for x in ('exportBackup','importBackup','JSON.stringify','JSON.parse')))]
for name,passed in checks:
    print(('PASS' if passed else 'FAIL') + ': ' + name)
print(f'\n{sum(ok for _,ok in checks)} / {len(checks)} static checks passed')
raise SystemExit(0 if all(ok for _,ok in checks) else 1)

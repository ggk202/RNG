#!/usr/bin/env python3
"""Build play.html: the player edition of Cosmic Roll with every debug option removed.
Run after each change to index.html:  python3 tools/build_play.py"""
import os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(root, 'index.html'), encoding='utf-8').read()

def rep(a, b):
    global s
    assert s.count(a) == 1, 'build_play: expected exactly one match for: ' + a[:70]
    s = s.replace(a, b)

# 0. Title
rep('<title>Cosmic Roll Dev</title>', '<title>Cosmic Roll</title>')
# 1. UI: debug checkbox + debug tool buttons -> inert hidden stubs (JS still finds the ids)
rep('<label style="float:right;color:#ffe9a8"><input type="checkbox" id="dbg"> Debug: unlock all models</label>'
    '<div id="dbgtools" style="display:none;clear:both;padding-top:6px"><button id="dbrb">Debug: jump to rebirth</button> '
    '<button id="dbac">Debug: +100 aether</button> <button id="dbmg">Debug: pass Dyson gate</button></div>',
    '<input type="checkbox" id="dbg" hidden disabled><div id="dbgtools" hidden></div>')
# 2. Debug mode can never switch on
rep("$('dbg').onchange=e=>{DBG=e.target.checked;", "$('dbg').onchange=e=>{DBG=false;")
# 3. Drop the debug tool handlers (their buttons no longer exist)
for k in ('dbrb', 'dbac', 'dbmg'):
    n = len(re.findall(r"^\$\('%s'\)\.onclick=.*$" % k, s, flags=re.M))
    assert n == 1, 'build_play: handler for ' + k
    s = re.sub(r"^\$\('%s'\)\.onclick=.*\n" % k, '', s, flags=re.M)

# sanity: no visible debug text left in the markup
html = s.split('<script>')[0]
assert 'Debug:' not in html, 'build_play: debug label still in markup'
open(os.path.join(root, 'play.html'), 'w', encoding='utf-8').write(s)
print('play.html written', len(s), 'bytes')

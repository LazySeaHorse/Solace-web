import sqlite3, pathlib, re
root=pathlib.Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
db.executescript((root/'drizzle/0000_high_albert_cleary.sql').read_text())
source=(root/'app/api/sync/route.ts').read_text()
insert=re.search(r"prepare\('(INSERT INTO haff_vault[^']+)'\)",source).group(1)
update=re.search(r"prepare\('(UPDATE haff_vault[^']+)'\)",source).group(1)
assert db.execute(insert,('owner','cipher-one',1)).rowcount==1
assert db.execute(insert,('different-user','cannot-replace',2)).rowcount==0
assert db.execute(update,('cannot-replace',2,'different-user',1)).rowcount==0
assert db.execute(update,('cipher-two',2,'owner',1)).rowcount==1
assert db.execute(update,('stale-device',3,'owner',1)).rowcount==0
assert db.execute('SELECT revision,envelope FROM haff_vault').fetchone()==(2,'cipher-two')
print('Database checks passed: single vault, owner isolation, revision conflict protection.')

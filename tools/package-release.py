"""Create a deterministic deployment ZIP; never uploads or configures hosting."""
from pathlib import Path
import hashlib, json, zipfile
root = Path(__file__).resolve().parents[1]
expected = {"index.html", "app.js", "style.css", "language.js", "core.js", "measurement.js", "feedback.js", "measurement-config.js",
            "shared/measurement-contract.mjs", "shared/measurement-feedback-client.mjs"}
entries = list((root / "dist").rglob("*"))
if ({p.relative_to(root / "dist").as_posix() for p in entries if p.is_file()} != expected
        or any(p.is_symlink() or not (p.is_file() or p.is_dir()) for p in entries)
        or {p.relative_to(root / "dist").as_posix() for p in entries if p.is_dir()} != {"shared"}):
    raise SystemExit("dist must contain exactly the approved app files and shared directory")
files = {name: root / "dist" / name for name in sorted(expected)}
files.update({name: root / name for name in ["LICENSE", "THIRD_PARTY_NOTICES.md"]})
output = root / "artifacts" / "release"
output.mkdir(parents=True, exist_ok=True)
archive = output / "static-release.zip"
manifest = {}
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_STORED) as z:
    for name, path in sorted(files.items()):
        data = path.read_bytes()
        info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_STORED
        info.external_attr = 0o644 << 16
        z.writestr(info, data)
        manifest[name] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert set(z.namelist()) == set(files)
    for name, path in files.items():
        assert z.read(name) == path.read_bytes()
(output / "manifest.json").write_text(json.dumps({"archive_sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "files": manifest}, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"archive": str(archive), "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "files": len(files)}))

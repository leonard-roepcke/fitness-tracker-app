#!/usr/bin/env bash
# Auto-commit and push project changes after each completed agent turn.
set -uo pipefail

input=$(cat)

python3 - "$input" <<'PY'
import json
import os
import subprocess
import sys

payload = json.loads(sys.argv[1])
status = payload.get("status", "completed")
workspace = (payload.get("workspace_roots") or [None])[0]
transcript = payload.get("transcript_path")

print("{}", flush=True)

if status != "completed":
    sys.exit(0)

if not workspace or not os.path.isdir(os.path.join(workspace, ".git")):
    print("auto-git-push: no git repository", file=sys.stderr)
    sys.exit(0)

os.chdir(workspace)

def run(*args: str, check: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, capture_output=True, text=True, check=check)

status_proc = run("git", "status", "--porcelain")
if not status_proc.stdout.strip():
    print("auto-git-push: nothing to commit", file=sys.stderr)
    sys.exit(0)

commit_msg = "chore: auto-sync agent changes"
if transcript and os.path.isfile(transcript):
    last_user = ""
    try:
        with open(transcript, encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if entry.get("role") != "user":
                    continue
                content = entry.get("message", {}).get("content", "")
                text = ""
                if isinstance(content, str):
                    text = content.strip()
                elif isinstance(content, list):
                    for part in content:
                        if isinstance(part, dict) and part.get("type") == "text":
                            text = str(part.get("text", "")).strip()
                            break
                if text:
                    last_user = text.splitlines()[0][:72]
        if last_user:
            commit_msg = f"agent: {last_user}"
    except OSError:
        pass

run("git", "add", "-A")

for pattern in (".env", ".env.local", ".env.production", "credentials.json"):
    run("git", "reset", "HEAD", "--", pattern)

staged = run("git", "diff", "--cached", "--quiet")
if staged.returncode == 0:
    print("auto-git-push: no staged changes after filtering", file=sys.stderr)
    sys.exit(0)

commit = run("git", "commit", "-m", commit_msg)
if commit.returncode != 0:
    print(commit.stderr or commit.stdout, file=sys.stderr)
    sys.exit(0)

branch = run("git", "rev-parse", "--abbrev-ref", "HEAD")
branch_name = branch.stdout.strip() or "main"
push = run("git", "push", "origin", branch_name)

if push.returncode == 0:
    print(f"auto-git-push: pushed to origin/{branch_name}", file=sys.stderr)
else:
    print(push.stderr or push.stdout, file=sys.stderr)
PY

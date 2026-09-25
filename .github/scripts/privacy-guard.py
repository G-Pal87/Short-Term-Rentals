#!/usr/bin/env python3
"""Privacy guard: fail if a pushed commit adds data that must not be public.

This repository is public and holds only the website's source. Prices and
Airbnb calendars are fetched at deploy time and live only in the Pages
artifact. This check looks at every file added or changed by the pushed
commits and fails the run (which emails the pusher) when it finds:

  - calendar data, .ics files, rate feeds or the rates stamp committed;
  - Airbnb calendar links (their ?s= token grants calendar access), secrets,
    password hashes or copies of rate feeds inside any file.

It never prints file contents - only paths and reasons - because Actions logs
of a public repository are public too.

Usage: privacy-guard.py <before-sha> <after-sha>   (push)
       privacy-guard.py --all                      (audit the whole HEAD tree)
"""
import json
import re
import subprocess
import sys

# Never committed: these are generated at deploy time (deploy.yml) and served
# from the Pages artifact only, so their history never becomes public.
FORBIDDEN = {
    re.compile(r"(^|/)calendars/"): "Airbnb calendar data is built at deploy time, never committed",
    re.compile(r"\.ics$", re.I): "calendar (.ics) files must not be committed",
    re.compile(r"(^|/)rates-stamp\.txt$"): "rates-stamp.txt is generated at deploy time",
    re.compile(r"^exports/|(^|/)daily-rates/"): "rate feeds live on Business-Tracking's rates-feed branch, never here",
}

SECRET_PATTERNS = {
    "a GitHub token": re.compile(rb"\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}"),
    "an AWS access key": re.compile(rb"\bAKIA[0-9A-Z]{16}\b"),
    "a private key": re.compile(rb"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    "a password hash": re.compile(rb"\"passwordHash\"\s*:\s*\"[0-9a-f]{32,}\""),
    "an Airbnb calendar link with its access token": re.compile(rb"airbnb\.[a-z.]+/calendar/ical/\d+\.ics\?[^\s\"']*\bs=[0-9a-f]{16,}"),
    "a copy of a daily-rate feed": re.compile(rb"\"schema\"\s*:\s*\"str-daily-rates"),
}
ZERO_SHA = re.compile(r"^0+$")


def git(*args, binary=False):
    out = subprocess.run(["git", *args], capture_output=True, check=True).stdout
    return out if binary else out.decode()


def check_file(path, data):
    """Return a reason string if this file must not be public, else None."""
    for rx, reason in FORBIDDEN.items():
        if rx.search(path):
            return reason
    if b"\0" in data[:8000]:
        return None  # binary (images, fonts): nothing to scan
    for name, rx in SECRET_PATTERNS.items():
        if rx.search(data):
            return f"contains what looks like {name}"
    return None


def changed_files(commit):
    """Files added/modified/renamed by one commit (against its first parent)."""
    parents = git("rev-list", "--parents", "-n", "1", commit).split()[1:]
    if parents:
        out = git("diff-tree", "-r", "--no-commit-id", "--name-only", "--diff-filter=AMRC", parents[0], commit)
    else:
        out = git("ls-tree", "-r", "--name-only", commit)
    return [p for p in out.splitlines() if p]


def commits_to_check(before, after):
    if before and not ZERO_SHA.match(before):
        try:
            return git("rev-list", "--max-count=200", f"{before}..{after}").split()
        except subprocess.CalledProcessError:
            pass  # before is unknown here (e.g. after a force-push): fall through
    # New branch or force-push: commits not reachable from any other branch.
    others = [r for r in git("for-each-ref", "--format=%(refname)", "refs/remotes/origin").split()
              if git("rev-parse", r).strip() != git("rev-parse", after).strip()]
    return git("rev-list", "--max-count=200", after, "--not", *others).split() if others \
        else git("rev-list", "--max-count=200", after).split()


def main():
    if sys.argv[1:] == ["--all"]:
        targets = [("HEAD", p) for p in git("ls-tree", "-r", "--name-only", "HEAD").splitlines()]
    elif len(sys.argv) == 3:
        targets = []
        for c in commits_to_check(sys.argv[1], sys.argv[2]):
            targets += [(c, p) for p in changed_files(c)]
    else:
        sys.exit(__doc__)

    problems, seen = [], set()
    for commit, path in targets:
        blob = git("rev-parse", f"{commit}:{path}").strip()
        if blob in seen:
            continue
        seen.add(blob)
        if git("cat-file", "-t", blob).strip() != "blob":
            continue
        reason = check_file(path, git("cat-file", "blob", blob, binary=True))
        if reason:
            problems.append(f"{commit[:12]}  {path}: {reason}")

    print(f"Checked {len(seen)} file version(s).")
    if problems:
        print("\nPRIVACY GUARD FAILED - these files must not be public:")
        for p in problems:
            print("  " + p)
        print("\nRemove them from the history (git filter-repo) before anything else is pushed;"
              " see CLAUDE.md.")
        sys.exit(1)
    print("OK - nothing unencrypted or secret found.")


if __name__ == "__main__":
    main()

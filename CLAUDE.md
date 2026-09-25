# Claude Code Instructions

## Privacy: this repository is PUBLIC

This repo holds only the website's source code. Everything committed here — on any branch, and in any pull request — is public and stays in the git history (pull-request refs cannot be deleted without GitHub Support).

- **Prices and calendars are never committed.** `.github/workflows/deploy.yml` fetches the rates (from Business-Tracking's single-commit `rates-feed` branch) and the Airbnb calendars at deploy time and deploys them only inside the GitHub Pages artifact. Never commit `calendars/`, `public/calendars/`, `.ics` files, `public/rates-stamp.txt` or copies of rate feeds — not even as fallbacks, fixtures or test data.
- **Never deploy via a branch** (no `gh-pages`, no committed build output): a branch keeps every past build in public history.
- **Airbnb calendar links are secrets** (`…/calendar/ical/…?s=…` grants access to the live calendar). They live only in the repository's Actions secrets (`AIRBNB_ICAL_*`); never write one into code, config, docs or logs.
- **No other secrets in source**: no tokens, keys or password hashes.
- `.github/workflows/privacy-guard.yml` checks every push and pull request and fails on any of the above. If it fails, stop and remove the offending commits from history before anything else is pushed — don't "fix it in the next commit"; the earlier commit stays public.

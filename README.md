# Song Atlas

Song Atlas follows this URL-style flow:

- `/Main` (`Main.html`) instrument choice.
- `/Song-piano` (`Song-piano.html`) piano songs list.
- `/Song-guitar` (`Song-guitar.html`) guitar songs list.
- `/Preview-[I][SongName]` (set with `history.replaceState` on `preview.html`).

## Features

- 240+ expanded popular-song entries.
- Separate song pages for piano and guitar.
- Instrument selection redirects to dedicated song page.
- Song selection redirects to preview page.
- 5-second countdown with **Skip** button shown under Start.
- Animated note preview with current note name.
- **Fixed note sticks/stems** rendering in the preview.
- Added animated **CardNav-style navbar** with expandable cards.

## Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/Main.html`.

# JCC VC Bingo

A frontend-only Next.js bingo board for JCC VC events. A ready-made sample board loads automatically, and you can optionally upload a JSON file with at least 24 entries to shuffle onto a 5x5 board, lock the board, and mark tiles as events happen in voice chat.

## Features

- Upload a JSON file with an `entries` array (minimum 24 strings)
- Randomly picks 24 entries and places them on a 5x5 board
- Center tile is always **Free Tile**
- Reshuffle before locking to get a new random board
- Lock the board to start marking tiles locally (no cloud saving)
- Detects bingo when 5 tiles in a row are marked
- Non-blocking congrats banner for screenshots
- Export the board as PNG
- Themes: Mint, Dark, White, Pink, Ocean
- Session state persists in `sessionStorage` during play

## JSON Format

See [`sample.json`](./sample.json):

```json
{
  "entries": [
    "Meomeo random cursing",
    "Maika saying 'cuh' every minute"
  ]
}
```

You need at least 24 entries in the array.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Play

1. Upload your JSON file (or use `sample.json`).
2. Click **Reshuffle** until you like the board layout.
3. Click **Lock Board** to start marking tiles.
4. Click tiles when the corresponding VC event happens.
5. Get 5 in a row to trigger the bingo banner.
6. Use **Export PNG** to save a screenshot-ready image.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- html2canvas

## License

MIT

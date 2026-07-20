# Chicago Code & Coffee Slides

A one-screen rotating slide deck for Chicago Code & Coffee. It is designed for
display on a projector at the event and includes QR codes for:

- Joining the event's Sidequests community page
- Chicago Code & Coffee on LinkedIn
- Organizer and volunteer profiles
- Community events and partners
- Open engineering roles
- CIC Guest Wi-Fi

## Run locally

The deck uses a small Deno server to serve its assets and render QR codes.

```sh
deno run --allow-net --allow-read --allow-env server.ts
```

Then open [http://localhost:8111](http://localhost:8111).

Use `PORT` or `HOST` to change the default listener:

```sh
PORT=8000 HOST=0.0.0.0 deno run --allow-net --allow-read --allow-env server.ts
```

## Production

The live deck is available at
[codeandcoffee.evbogue.com](https://codeandcoffee.evbogue.com).

Production runs from `/root/codeandcoffee` using `codeandcoffee.service`. This
repository intentionally contains only the slide deck, its image assets, and
the minimal static/QR server. The Sidequests application and its data are
deployed separately.

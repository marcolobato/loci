# Shelf

Ideas for later. Not this week.

- Hint under the Shutter ('Hold to keep this moment'), possibly as a tooltip. Own reusable component. Undecided. Matches the original splash.
- Replace a moment's sound: a third section on the moment page (edit by section), to record the ten seconds again. Needs the recorder on that page, and a clear warning that the old sound will be gone.
- Time zones when travelling: show a capture's time as it was at the place, not on the phone now.
- Full AI extraction of the nine ingredients (speech-to-text + a language model, like the AI Studio prototype). Needs a small server for the API key, breaks offline, and sends recordings off the phone. Revisit only if word-matching suggestions fall short.
- Polish (Home Screen app): a plain dark band, about 62 points tall, sits under the page at the bottom. iOS makes the page shorter than the screen there, so nothing the page draws can reach it. Found with screenshots on an iPhone with a Dynamic Island. The band was teal until the body background became the dark ground (index.css). Hidden for now: the granite fades into the dark ground over its last 48px (Backdrop.css, `--size-edge-fade`). Not fixed at the cause. The page lock (index.css, `#root`) stops iOS from resizing the page back after a scroll, which used to make the band disappear. Next to try, if it still bothers me: a small `?debug` readout of the window and screen sizes, to see what iOS reports; or launch images (`apple-touch-startup-image`), which may need a fresh Home Screen install. Careful: removing the current Home Screen icon deletes its captures, so test with a second icon.

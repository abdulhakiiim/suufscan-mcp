# Demo video script — target 2:30 (hard limit 3:00), English

Setup: Chrome, `npm start` running, `http://localhost:3333/` full screen, mic on. Record screen + voice (OBS, Loom or the screen recorder of your phone/PC). No music.


## Montage (Canva) — total ≈ 2:30 (limit 3:00)

Timeline, 1920×1080, SuufScan brand (cream, amber, deep brown, logo):
1. `video/suufscan-1-intro.mp4` — 0:00–0:25
2. `video/suufscan-2-how-it-works.mp4` — 0:25–0:40
3. Screen recording of the simulator with real data and Sëgn Suuf live — 0:40–2:15 (≈ 1:35). Start the server with both `SUUFSCAN_PLACES_URL` and `SUUFSCAN_GUIDANCE_URL`. Add English subtitles in Canva on Sëgn Suuf's French answer.
4. `video/suufscan-4-outro.mp4` — 2:15–2:30

Voice-over, clip 1 (intro, 25 s):
- 0:00 "This is SuufScan for Alexa+: land buyer protection for Senegal and its diaspora."
- 0:04 "You live in New York. You want to buy land back home, in Mbour, for your mother. You're six thousand kilometres away."
- 0:09 "The seller sends you a document you've never seen. A titre foncier? A bail? A délibération?"
- 0:14 "And the Senegalese press is full of land fraud stories: the same plot sold twice, fake titles, inherited land sold without the other heirs. So, who do you ask?"
- 0:20 "SuufScan for Alexa+. Protect yourself before you buy."

Voice-over, clip 2 (how it works, 15 s):
- 0:00 "You ask by voice, in English, from home."
- 0:04 "Alexa+ calls the SuufScan MCP server, over Streamable HTTP, on the 2025-11-25 spec, and through it SuufScan's own land-law assistant."
- 0:09 "And SuufScan answers: what to ask, and who to ask. In this demo, the Alexa+ voice front-end is simulated; the MCP server is real."

Voice-over, clip 4 (outro, 15 s):
- 0:00 "One stateless MCP endpoint: steps, offices, warnings, and SuufScan's land-law assistant, live."
- 0:06 "What to ask. Who to ask."
- 0:10 "SuufScan. Protect yourself before you buy."

The screen recording (part 3) is the core: judges must see the project actually running.

---

**0:00–0:20 — Hook (voice-over on the simulator screen)**
"Imagine you live in New York, and you want to buy land in Senegal for your mother. You're 6,000 kilometres away. The seller sends you a document you've never seen. Who do you ask? In the Senegalese press, land fraud stories are frequent: the same plot sold twice, fake titles."

**0:20–0:35 — What it is**
"This is SuufScan for Alexa+. SuufScan is a Senegalese PropTech that helps buyers protect themselves before they buy. We built an MCP server, on the 2025-11-25 spec, so Alexa+ can answer these questions by voice. Here, the Alexa+ voice front-end is simulated in the browser — the MCP server it talks to is real."

**0:35–1:15 — Question 1 (tap the ring and speak)**
> "I live in New York and want to buy land in Mbour for my mother. The seller has a délibération. What should I do before I pay?"

Let the answer play fully. Then point at the right panel:
"On the right you see the real MCP traffic: initialize, tools/list, then tools/call on `buyer_protection_steps`, with the land status and the commune."

**1:15–1:40 — Question 2 (follow-up)**
> "Where should my cousin go to ask about it?"

"Alexa+ remembers we're talking about Mbour and calls `find_land_offices`, which ranks offices from SuufScan's directory by distance."

**1:40–2:05 — Question 3 (Sëgn Suuf, live)**
> "My uncle wants to sell me a plot he inherited with his brothers. Is that a problem?"

"For open questions, Alexa+ hands over to Sëgn Suuf, SuufScan's land-law assistant, grounded in Senegalese land law. It answers in French, the language of the land offices; Alexa+ can translate." Subtitle the answer in English in Canva.

**2:05–2:15 — Question 4 (optional if time allows)**
> "What are the warning signs of a land scam?"

**2:10–2:35 — Close**
"One stateless Streamable HTTP endpoint, answers written for the ear. It never says a plot is safe and never gives a price: it tells you what to ask, and who to ask. Next step: plug it into the Alexa+ Preview and put it in the hands of the Senegalese diaspora. SuufScan — protect yourself before you buy."

---

Before recording:
- Set `SUUFSCAN_PLACES_URL` to the real Explorer endpoint, otherwise the offices shown are the placeholder "Example…" entries. If you keep the placeholders, say so on screen.
- Do one dry run: the first speech recognition request asks for mic permission.
- Upload to YouTube as **Public** (not unlisted), English title: "SuufScan for Alexa+ — land buyer protection for the Senegalese diaspora".

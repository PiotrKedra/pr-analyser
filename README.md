# Piotr PR Analyser

Narzedzie do oceny jakosci pull requestow w repozytoriach GitHub — z pomoca AI.
Analizuje impact zmian, wykorzystanie AI w kodowaniu oraz quality.

**Live demo:** [https://pr-analyser.vercel.app/](https://pr-analyser.vercel.app/)

**Nagranie:** [https://www.tella.tv/video/budowanie-ai-do-analizy-pr-ow-em6r](https://www.tella.tv/video/budowanie-ai-do-analizy-pr-ow-em6r)

---

## Uruchomienie lokalne

```bash
git clone https://github.com/PiotrKedra/pr-analyser.git && cd pr-analyser
cp .env.example .env.local   # uzupelnij ANTHROPIC_API_KEY (opcjonalnie GITHUB_TOKEN)
yarn install && yarn dev
```

Aplikacja startuje na `http://localhost:3000`.

---

## Stack technologiczny

| Warstwa    | Technologia                                        |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript      |
| Styling    | Tailwind CSS v4 (natywna konfiguracja CSS), shadcn/ui |
| AI         | Claude Sonnet 4 via `@anthropic-ai/sdk`            |
| Walidacja  | Zod 4 — schematy na granicach API i UI             |
| Tabela     | TanStack Table v8 (filtrowanie, sortowanie)        |
| Testy      | Vitest + Testing Library                           |
| Deploy     | Vercel                                             |
| PM         | Yarn                                               |

**Uzasadnienie:** Next.js 16 z App Router to naturalny wybor -> SSR idalnie nadaje się do zadania, strona będzie odrazu zoptymalizowana pod seo/lighthause. Dodatkowo dzięki Next'owi prosto dodamy endpoint API do analizy - API klucze do Claude i GitHub będą bezpiecznie. Tailwind jako czytelne stylowanie (jest też moją preferencja). Zod zapewnia type-safe walidacje na kazdej granicy (URL input, GitHub API, odpowiedzi Claude'a), co daje pewnosc, ze dane sa poprawne na kazdym etapie pipeline'u.

---

## Jak korzystalem z AI

- Jako pierwszy krok wygnerowałm sobie plan (plan.md) działania z potencjalnymi problemami i krokami walidacji - użyłem do tego webowej wersji Claude'a
- Wykorzystywałem Claude CLI pracując jednocześnie na 1-3 konsolach.
- Cykl pracy wyglądał w większości: prompt w plan modzie -> review -> akceptacja lub jedna poprawka do planu -> implementacja
- Pod koniec pracy nad modułem uruchamiałem skilla /code-review aby zrobić finalnego checka przed mergem PR
- Większość kodu powstała za pomocą AI, drobne fixy czasami były poprawiane ręcznie
- Wygnerowałem sobie też design strony przy użyciu https://stitch.withgoogle.com jako inspiracja

---

## Model scoringowy — uzasadnienie wag

| Wymiar          | Waga | Uzasadnienie                                                                                                                                                                                                                             |
| --------------- | ---- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Impact**      | 20%  | Wartosc biznesowa zmian jest istotna, ale wiekszy prioryte w ocenie kodu miały dla mnie 2 pozostałe wagi.                                                                                                                                |
| **AI-Leverage** | 40%  | Kluczowy wymiar dla PhotoAID: szukacie ludzi, ktorzy 90% kodu generuja z AI. Najwyzsza waga odzwierciedla ten priorytet.                                                                                                                 |
| **Quality**     | 40%  | Jakość kodu jest dla mnie równie ważna co AI-Leverage - aktualnie kiedy generujemy tyle kodu i tak szybko, trzeba dbać o jakość aby AI mniej halucynowała w pożniejszych etapach projektu kiedy będzie coraz to więcej zmian biznesowych |

```
totalScore = impact x 0.20 + aiLeverage x 0.40 + quality x 0.40
```
---

## Decyzje projektowe

### Architektura analizy
- **Max 20 merged PRow** — balans miedzy kosztami API, limitem 60s Vercel timeout, i sensownoscia wynikow. Dla wiekszosci repozytoriow 20 najnowszych PRow daje dobry obraz jakosci. (testowałem na małych i większych repozytoriach i 20 PR'ów zawsze mieściło się w timeoucie)
- **Batch prompt** — wszystkie PRy w jednym zapytaniu do Claude'a zamiast osobnych. Szybciej (~10s vs ~40s) i taniej. Claude widzi kontekst miedzy PRami, co poprawia spojnosc ocen.
- **Max 30 plikow per PR** — sortowane po liczbie zmienionych linii (malejaco). Zapobiega przekroczeniu limitu tokenow przy duzych PR-ach.

### Streaming (SSE)
- `TransformStream` + `ReadableStream` pattern (nie `res.write()`), zgodny z edge runtime.
- Trzy typy eventow: `progress` (krokowiec), `result` (finalne dane), `error` (kody bledow).
- Overlay z animacja Lottie i scrollowalnym logiem postepu — uzytkownik widzi co sie dzieje w czasie rzeczywistym.

### Shareable URL
- Wyniki kompresowane (`CompressionStream` deflate-raw) i kodowane w URL hash fragment.
- Dane nie leca na serwer — zero dodatkowej infrastruktury. Odbiorca dekoduje hash po stronie klienta.
- Ograniczenie: bardzo duze wyniki moga generowac dlugi URL, ale dla 20 PRow miesci sie w limitach przegladarek.

### GitHub API
- Token opcjonalny: bez tokena 60 req/h (wystarczy na demo), z tokenem 5000 req/h.
- Obslugiwane bledy: 404 (`INVALID_REPO`), 403/429 (`RATE_LIMIT`), 0 merged PRow (`NO_PRS`), blad Claude'a (`ANALYSIS_FAILED`).

### UI/UX
- **Light theme only** — zgodnie ze stylem passport-photo.online.
- **Fonty:** PT Serif (naglowki) + Inter (body), self-hosted via `next/font`.
- **Lottie** dla overlay'u ladowania — lekki i wizualnie atrakcyjny.
- **Język** zdecydowałem, że narzędzie powinno być w języku angielskum, gdyż kod, PR'y, commit piszę się po angielsku - chiałem, żeby interfejs był spójny

### Filtrowanie i sortowanie
- TanStack Table v8 z pelnym filtrowaniem: po autorze, rozmiarze (small/medium/large), przedzialach score'ow (high/mid/low), oraz wyszukiwanie po tytule PR-a.
- Sortowanie po kazdej kolumnie.

---

## Co dalej (kolejny sprint)

Gdybym miał więcej czasu, dopracowałbym m.in.:
- Lepszy prompt engineering -> testowałem analizę na dużym publicznym repozytorium, gdzie chwalą się że 100% kodu jest generowane przez AI, a AI-Leverage był na poziomie ~70%
- Dopracowałbym UI oraz dodał parę drobnych interakcji, aby wizualnie projekt robił większe wrażenie
- Testy E2E (Playwright)
- Eksport wyników (JSON, PNG badge)

Co w kolejnym sprincie:
- Usunięcie limitu 20 PR lub 30 plików -> można doczytywać kolejne PR np. jako osobne żądanie od usera
- Integracja z GitHub zamiast ręcznego podawania PR -> dzięki temu można robić review prywatnych repozytoriów


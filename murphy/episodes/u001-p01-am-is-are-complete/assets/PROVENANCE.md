# Unit 1 visual sources — replacement draft v02

The original eight SVGs remain available for earlier versions. The replacement
uses original instructional layouts assembled from the selected Lucide icons,
plus two precise object layers. No textbook images, generated portraits, stock
photos, mascots or decorative media are used.

## Provider sources

Provider: [Lucide](https://lucide.dev/), frozen
[release 0.468.0](https://github.com/lucide-icons/lucide/tree/0.468.0).
Downloaded 2026-11-06. Exact downloaded SVG bytes are retained in `lucide/`:
`smile`, `book-open`, `house`, `door-open`, `backpack`, `cat` and `notebook`.
`lucide/SOURCES.json` records SHA-256 checksums and the frozen source release;
each original file's URL is also recorded in the episode asset manifest.

[License checked](https://lucide.dev/license): reuse, modification and commercial
distribution are permitted with the required notices. Preserve `lucide/LICENSE`
(ISC, including the Lucide/Feather copyright statement) and
`lucide/FEATHER-LICENSE` (MIT, from Feather v4.29.2). The selected smile icon has
Feather-derived geometry; both notices accompany the local source/render bundle.
Provider artwork is credited in the episode asset records and SVG comments.
The lesson does not imply provider endorsement.

## Teaching use and modifications

| Local source    | Teaching purpose                             | Treatment                                                                                            |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `smile.svg`     | Feeling, speaker/listener and group identity | Same face geometry in original person/context boards; project colors and explicit ME/YOU/name labels |
| `book-open.svg` | Action verb read; fictional student identity | Placed with a person, preserving the book shape                                                      |
| `house.svg`     | Location at home                             | House beside the named people                                                                        |
| `door-open.svg` | Condition open                               | Enlarged, recolored condition illustration                                                           |
| `backpack.svg`  | Identify a thing with that's                 | A pointing relation selects the backpack                                                             |
| `cat.svg`       | Introduce one cat with there's               | Placed in a simple original garden                                                                   |
| `notebook.svg`  | Offer an object with here's                  | One persistent notebook layer travels from speaker to listener                                       |

The `u001-v02-*.svg` files are the actual render inputs. The provider SVGs remain
unchanged in `lucide/`; project render inputs use explicit project colors and
teaching-specific arrangements. The fictional names and relationships belong to
the original examples.

The `door-frame` and `door-leaf` SVGs are custom because a fixed hinge, visible
opening and continuous door identity are needed to demonstrate the change from
open to not open. The handover board uses an original arm layout so the same
licensed notebook visibly reaches the listener. Group boundaries and arrows show
grammatical reference, not decoration. These diagrams do not add a new renderer.

unDraw's [license](https://undraw.co/license) was reviewed during selection; no
unDraw asset was selected. Broad stock scenes were less suited to the exact
speaker/group and object-state relationships needed here. No Unsplash asset was
selected. Required local assets and license notices are declared in `episode.json`
and copied by the existing factory; playback makes no provider requests.

#import "src/lib.typ": *

#import "@preview/hallon:0.1.2": subfigure
#import "@preview/cellpress-unofficial:0.1.0" as cellpress: toprule, midrule, bottomrule
#import "@preview/smartaref:0.1.0": cref, Cref

#show: template.with(
	logo:              image("src/img/logo_sigillo.svg"),
	title:             "Ripe Bananas",
	subtitle:          "Assignment TWEB+HCI 24/25",
	course-name:       "TWEB+HCI",
	course-code:       "MFN0608",
	authors:           ("Emanuel Nibizi", "Seriano Kukaj", "Stefano Golzio"),
	lab-date:          datetime.today().display(),
	lang:              "en",
)

#include "src/chapters/1-introduction.typ"
#pagebreak(weak: true)

#include "src/chapters/2-webapp.typ"
#pagebreak(weak: true)

#include "src/chapters/3-nodejs.typ"
#pagebreak(weak: true)

#include "src/chapters/3.5-express.typ"
#pagebreak(weak: true)

#include "src/chapters/4-mongodb.typ"
#pagebreak(weak: true)

#include "src/chapters/4.5-postgresql.typ"
#pagebreak(weak: true)

#include "src/chapters/5-springboot.typ"
#pagebreak(weak: true)

#include "src/chapters/7-conclusions.typ"
#pagebreak(weak: true)

#include "src/chapters/8-division.typ"
#pagebreak(weak: true)

#include "src/chapters/9-extra.typ"
#pagebreak(weak: true)

#bibliography("src/references.yaml")

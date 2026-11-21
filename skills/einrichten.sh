#!/bin/sh
#
# Verknuepft die Design-Skills nach ~/.claude/skills/.
#
# Verknuepfung statt Kopie: So wirkt jede Aenderung im Repository sofort, und
# es entsteht keine zweite Fassung, die still auseinanderlaeuft -- genau der
# Fehler, den MAR-253 fuer die Design-Tokens beschreibt.

set -e

quelle="$(cd "$(dirname "$0")" && pwd)"
ziel="$HOME/.claude/skills"

mkdir -p "$ziel"

for skill in design-taste ui-design-intelligence browser-qa design-system-extractor; do
  if [ -e "$ziel/$skill" ] && [ ! -L "$ziel/$skill" ]; then
    echo "  uebersprungen: $skill liegt dort als echtes Verzeichnis"
    continue
  fi

  ln -sfn "$quelle/$skill" "$ziel/$skill"
  echo "  verknuepft: $skill"
done

echo
echo "Fertig. Fuer die beiden Skripte einmalig:"
echo "  npm install playwright && npx playwright install chromium"

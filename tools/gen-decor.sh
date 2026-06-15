#!/usr/bin/env bash
#
# gen-decor.sh — generate the painterly decorative art for Ruth's Garden via
# Gemini (Nano Banana). Run this when your Gemini image quota has reset:
#
#     bash tools/gen-decor.sh
#
# Outputs land in assets/img/decor/. The botanical ornaments and the Legacy
# branch are hand-built SVG and do NOT need this script.
#
set -uo pipefail

ROOT="/Users/nashdavis/Documents/ruths-garden"
ENVFILE="/Users/nashdavis/Documents/frontier/.env"
[ -f "$ENVFILE" ] || ENVFILE="/Users/nashdavis/Documents/daily-reports/.env"

KEY=$(sed -nE 's/^(export )?GEMINI_API_KEY=["'\'']?([^"'\'' ]+)["'\'']?.*/\2/p' "$ENVFILE" 2>/dev/null | head -1)
if [ -z "${KEY:-}" ]; then
  echo "No GEMINI_API_KEY found (looked in $ENVFILE). Set it and retry."
  exit 1
fi
export GEMINI_API_KEY="$KEY"
# The extension defaults to a free-preview image model with a tiny daily quota.
# Pin the billed stable model (your credits cover this once billing is enabled).
export NANOBANANA_MODEL="${NANOBANANA_MODEL:-gemini-2.5-flash-image}"

cd "$ROOT" || exit 1
mkdir -p assets/img/decor
OUT="nanobanana-output"

gen() {
  local target="$1"; local cmd="$2"
  echo "--- generating $target ---"
  rm -f "$OUT"/* 2>/dev/null || true
  gemini --yolo "$cmd" 2>&1 | tail -4
  local newest
  newest=$(ls -t "$OUT"/*.png "$OUT"/*.jpg "$OUT"/*.jpeg 2>/dev/null | head -1)
  if [ -n "${newest:-}" ]; then
    cp "$newest" "assets/img/decor/$target"
    echo "  saved -> assets/img/decor/$target"
  else
    echo "  !! no output for $target (quota exhausted? rerun after reset)"
  fi
}

STYLE="elegant botanical watercolor illustration, soft refined linework, antique-gold sage-green blush and cream palette, generous negative space, centered, no text, no words, no border"

gen "card-weddings.png"     "/generate 'a delicate garden wedding arch woven with white roses and trailing greenery, ${STYLE}, warm cream background' --styles=watercolor"
gen "card-photoshoots.png"  "/generate 'a vintage film camera framed by ferns, blossoms and trailing vines, ${STYLE}, warm cream background' --styles=watercolor"
gen "card-celebrations.png" "/generate 'a timber garden pavilion draped with warm string lights and floral garlands, ${STYLE}, warm cream background' --styles=watercolor"
gen "page-wash.jpg"         "/pattern 'extremely subtle pale watercolor botanical wash, faint sage leaf silhouettes and soft gold flecks on warm ivory, airy and barely visible, refined paper texture, no text' --type=seamless --style=floral --colors=colorful --density=sparse --size=1024x1024 --repeat=tile"
gen "legacy-texture.jpg"    "/pattern 'very deep forest green with delicate antique-gold and muted sage botanical line art, ferns ivy and laurel sprigs in an elegant ornamental lattice, low contrast, subtle, no text' --type=seamless --style=floral --colors=duotone --density=medium --size=1024x1024 --repeat=tile"

echo ""
echo "Done. Generated files (if any) are in assets/img/decor/."
echo "Tell Claude they're ready and it will wire them into the page with fallbacks."

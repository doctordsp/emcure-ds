#!/usr/bin/env bash
# Upload a pause-proof published card so the share URL survives a Free-tier pause.
# Usage: ./scripts/upload-published-card.sh path/to/card.html my-slug
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 path/to/card.html slug" >&2
  exit 1
fi

html="$1"
slug="$2"
dest="gs://ai-app-directory/emcure-design-studio/c/${slug}/index.html"

gsutil -h "Cache-Control: no-cache, max-age=0" cp "$html" "$dest"
echo "Uploaded $dest"
echo "Public URL: https://storage.googleapis.com/ai-app-directory/emcure-design-studio/c/${slug}/index.html"

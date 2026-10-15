#!/bin/sh
# ArtSCII installer for Linux and macOS.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/4ster-light/artscii/main/install.sh | sh
#
# Environment variables:
#   ARtscii_VERSION      Release tag to install, e.g. v2.0.0 (default: latest)
#   ARtscii_INSTALL_DIR  Directory to install the binary into
#                        (default: $HOME/.local/bin)
set -eu

REPO="4ster-light/artscii"
BIN="artscii"
VERSION="${ARtscii_VERSION:-latest}"
INSTALL_DIR="${ARtscii_INSTALL_DIR:-$HOME/.local/bin}"

os="$(uname -s)"
arch="$(uname -m)"

case "$os" in
  Linux)
    case "$arch" in
      x86_64 | amd64) asset="artscii-linux-x86_64.tar.gz" ;;
      aarch64 | arm64) asset="artscii-linux-aarch64.tar.gz" ;;
      *)
        echo "artscii: unsupported Linux architecture: $arch" >&2
        exit 1
        ;;
    esac
    ;;
  Darwin)
    case "$arch" in
      x86_64) asset="artscii-macos-x86_64" ;;
      arm64 | aarch64) asset="artscii-macos-aarch64" ;;
      *)
        echo "artscii: unsupported macOS architecture: $arch" >&2
        exit 1
        ;;
    esac
    ;;
  *)
    echo "artscii: unsupported operating system: $os" >&2
    exit 1
    ;;
esac

if [ "$VERSION" = "latest" ]; then
  base="https://github.com/$REPO/releases/latest/download"
else
  base="https://github.com/$REPO/releases/download/$VERSION"
fi
url="$base/$asset"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading $url"
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$url" -o "$tmp/$asset"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$tmp/$asset" "$url"
else
  echo "artscii: curl or wget is required" >&2
  exit 1
fi

# Verify the checksum when the release publishes one.
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$base/$asset.sha256" -o "$tmp/checksum" 2>/dev/null || true
else
  wget -qO "$tmp/checksum" "$base/$asset.sha256" 2>/dev/null || true
fi

if [ -s "$tmp/checksum" ]; then
  expected="$(awk '{print $1}' "$tmp/checksum")"
  if command -v sha256sum >/dev/null 2>&1; then
    actual="$(sha256sum "$tmp/$asset" | awk '{print $1}')"
  elif command -v shasum >/dev/null 2>&1; then
    actual="$(shasum -a 256 "$tmp/$asset" | awk '{print $1}')"
  else
    actual=""
  fi
  if [ -n "$actual" ] && [ "$actual" != "$expected" ]; then
    echo "artscii: checksum verification failed" >&2
    exit 1
  fi
fi

mkdir -p "$INSTALL_DIR"

case "$asset" in
  *.tar.gz)
    # The Linux tarball bundles its runtime libraries next to the binary and
    # relies on an $ORIGIN rpath, so install the whole bundle together.
    tar -xzf "$tmp/$asset" -C "$INSTALL_DIR"
    ;;
  *)
    cp "$tmp/$asset" "$INSTALL_DIR/$BIN"
    ;;
esac

chmod 755 "$INSTALL_DIR/$BIN"

echo "Installed $BIN to $INSTALL_DIR/$BIN"
case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *) echo "Add $INSTALL_DIR to your PATH to use $BIN." ;;
esac

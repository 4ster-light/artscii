#!/bin/sh
# ArtSCII installer for Linux and macOS. On Linux this installs the static musl
# binary, which runs on any distribution with no runtime dependencies.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/4ster-light/artscii/main/install.sh | sh
#
# Environment variables:
#   ARTSCII_VERSION      Release tag to install, e.g. v2.0.0 (default: latest)
#   ARTSCII_INSTALL_DIR  Directory to install the binary into
#                        (default: $HOME/.local/bin)
set -eu

REPO="4ster-light/artscii"
BIN="artscii"
VERSION="${ARTSCII_VERSION:-latest}"
INSTALL_DIR="${ARTSCII_INSTALL_DIR:-$HOME/.local/bin}"

os="$(uname -s)"
arch="$(uname -m)"

case "$os" in
  Linux)
    case "$arch" in
      x86_64 | amd64) asset="artscii-linux-x86_64" ;;
      aarch64 | arm64) asset="artscii-linux-aarch64" ;;
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

download() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1" -o "$2"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$2" "$1"
  else
    echo "artscii: curl or wget is required" >&2
    exit 1
  fi
}

echo "Downloading $url"
# v2.1.0 and later ship a single static binary on Linux; older releases ship a
# tarball with the shared libraries next to the binary. Fall back so pinned
# versions (ARTSCII_VERSION=v2.0.1) keep working.
archive=0
if ! download "$url" "$tmp/$asset"; then
  case "$asset" in
    *.tar.gz) ;;
    *)
      asset="$asset.tar.gz"
      url="$base/$asset"
      echo "Downloading $url"
      download "$url" "$tmp/$asset" || exit 1
      archive=1
      ;;
  esac
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

if [ "$archive" = 1 ]; then
  # Older Linux bundles carry their libraries and an $ORIGIN rpath, so they
  # have to be extracted together.
  tar -xzf "$tmp/$asset" -C "$INSTALL_DIR"
else
  cp "$tmp/$asset" "$INSTALL_DIR/$BIN"
fi

chmod 755 "$INSTALL_DIR/$BIN"

echo "Installed $BIN to $INSTALL_DIR/$BIN"
case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *) echo "Add $INSTALL_DIR to your PATH to use $BIN." ;;
esac

# Pinned wasm-bindgen CLI used by Trunk.
#
# Trunk refuses to run when the `wasm-bindgen` CLI version does not match the
# `wasm-bindgen` crate resolved for the web crate, so derive the version from
# Cargo.lock and fetch the matching prebuilt release for the current system.
# A version bump fails loudly with a missing-attribute error until the hashes
# below are refreshed.
{
  pkgs,
  lib,
  system,
}:
let
  root = ../.;

  cargoLock = fromTOML (builtins.readFile (root + "/Cargo.lock"));
  version = (builtins.head (builtins.filter (p: p.name == "wasm-bindgen") cargoLock.package)).version;

  hashes = {
    "0.2.126" = {
      x86_64-linux = "064948d58e2d6c0a745216477a639ba696216d6309aaa902939d1b865b1d869d";
      aarch64-linux = "2245120254a9f6c9a9adf3601f3d52bb31309219e9ceab7696e74e24885c440a";
      x86_64-darwin = "6014dca993c8bf8a6ec10b6fccfbeabf599842d011f58a4abb7669afef784422";
      aarch64-darwin = "7df536babe345deb68828148dbdc71179118afdab42d83547c7cebfbf1426bd5";
    };
  };

  # Prebuilt, statically linked on Linux; no patching required.
  target =
    {
      x86_64-linux = "x86_64-unknown-linux-musl";
      aarch64-linux = "aarch64-unknown-linux-musl";
      x86_64-darwin = "x86_64-apple-darwin";
      aarch64-darwin = "aarch64-apple-darwin";
    }
    .${system};
in
pkgs.stdenvNoCC.mkDerivation {
  pname = "wasm-bindgen-cli";
  inherit version;
  src = pkgs.fetchurl {
    url = "https://github.com/rustwasm/wasm-bindgen/releases/download/${version}/wasm-bindgen-${version}-${target}.tar.gz";
    sha256 = hashes.${version}.${system};
  };
  dontConfigure = true;
  dontBuild = true;
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    install -m755 wasm-bindgen $out/bin/wasm-bindgen
    for tool in wasm-bindgen-test-runner wasm2es6js; do
      if [ -f "$tool" ]; then
        install -m755 "$tool" $out/bin/
      fi
    done
    runHook postInstall
  '';
  meta = {
    description = "CLI tool for wasm-bindgen, pinned to the workspace's wasm-bindgen crate version";
    mainProgram = "wasm-bindgen";
    platforms = lib.platforms.unix;
  };
}

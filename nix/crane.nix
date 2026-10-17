# Shared Crane build context for every per-system output.
#
# This is a plain function rather than a flake-parts module so that the
# package, check, and dev-shell modules can each pull exactly the artifacts
# they need without going through `perSystem` module arguments.
{
  inputs,
  pkgs,
  lib,
  system,
}:
let
  root = ../.;

  rustToolchain = pkgs.rust-bin.fromRustupToolchainFile (root + "/rust-toolchain.toml");
  craneLib = (inputs.crane.mkLib pkgs).overrideToolchain rustToolchain;

  # Package metadata is sourced from the Cargo manifests so the flake does not
  # have to be touched on a version bump.
  cargoToml = builtins.fromTOML (builtins.readFile (root + "/crates/artscii-cli/Cargo.toml"));
  webCargoToml = builtins.fromTOML (builtins.readFile (root + "/crates/artscii-web/Cargo.toml"));
  cliPackage = cargoToml.package;
  webPackage = webCargoToml.package;

  # The CLI crate builds a binary named `${binName}`, not the package name.
  binName = (builtins.head cargoToml.bin).name;
  # All shipped crates are versioned in lockstep; the CLI is the source.
  version = cliPackage.version;
  repository = cliPackage.repository;

  # Map the SPDX license identifier from the manifests to a nixpkgs license.
  licenseFromSpdx =
    spdx:
    {
      "MIT" = lib.licenses.mit;
    }
    .${spdx} or spdx;

  cliMeta = {
    description = cliPackage.description;
    homepage = repository;
    license = licenseFromSpdx cliPackage.license;
    mainProgram = binName;
    platforms = lib.platforms.unix;
  };

  webMeta = {
    description = webPackage.description;
    homepage = webPackage.repository;
    license = licenseFromSpdx webPackage.license;
    platforms = lib.platforms.unix;
  };

  pinnedWasmBindgenCli = import ./wasm-bindgen.nix { inherit pkgs lib system; };

  # Only the files cargo cares about, plus the assets the web build needs.
  # Avoids rebuilding the world when a README changes.
  webAssets = [
    "crates/artscii-web/index.html"
    "crates/artscii-web/style.css"
  ];

  # Flake-only files must not affect the cargo build hash. craneLib's filter
  # keeps directories even when all of their contents are filtered out, which
  # would otherwise add an empty `nix/` tree to the cleaned sources.
  nixDir = toString (root + "/nix");
  ignoreNix = path: toString path != nixDir && !(lib.hasPrefix "${nixDir}/" (toString path));

  cargoSource = lib.cleanSourceWith {
    src = root;
    filter = path: type: craneLib.filterCargoSources path type && ignoreNix path;
  };

  webSource = lib.cleanSourceWith {
    src = root;
    filter =
      path: type:
      ignoreNix path
      && (
        (craneLib.filterCargoSources path type)
        || lib.any (asset: lib.hasSuffix asset (toString path)) webAssets
      );
  };

  commonArgs = {
    src = cargoSource;
    strictDeps = true;
    nativeBuildInputs = with pkgs; [
      pkg-config
      libclang
    ];
    # ALSA is Linux-only; on macOS cpal uses the system CoreAudio.
    buildInputs = [ pkgs.ffmpeg ] ++ lib.optionals pkgs.stdenv.isLinux [ pkgs.alsa-lib ];
    LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
  }
  // lib.optionalAttrs pkgs.stdenv.isLinux {
    BINDGEN_EXTRA_CLANG_ARGS = "-isystem ${pkgs.stdenv.cc.libc_dev}/include";
  };

  # Dependencies of every non-web workspace member, compiled once.
  cargoArtifacts = craneLib.buildDepsOnly (
    commonArgs
    // {
      pname = "${binName}-workspace-deps";
      inherit version;
      cargoExtraArgs = "--locked --workspace --exclude artscii-web";
    }
  );

  artscii = craneLib.buildPackage (
    commonArgs
    // {
      pname = binName;
      inherit version;
      inherit cargoArtifacts;
      cargoExtraArgs = "--locked -p ${cliPackage.name} --features video";
      doCheck = false;
      meta = cliMeta;
    }
  );

  # Dependencies for the web crate, compiled for the wasm target.
  webCargoArtifacts = craneLib.buildDepsOnly (
    commonArgs
    // {
      pname = "${webPackage.name}-deps";
      version = webPackage.version;
      src = webSource;
      CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
      cargoExtraArgs = "--locked -p artscii-web";
      doCheck = false;
    }
  );

  artscii-web = craneLib.buildTrunkPackage (
    commonArgs
    // {
      pname = webPackage.name;
      version = webPackage.version;
      src = webSource;
      cargoArtifacts = webCargoArtifacts;
      CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
      wasm-bindgen-cli = pinnedWasmBindgenCli;

      # The workspace root is a virtual manifest with no root package, so
      # Trunk has to be invoked from inside the web crate.
      buildPhaseCargoCommand = ''
        local profileArgs=""
        if [[ "$CARGO_PROFILE" == "release" ]]; then
          profileArgs="--release=true"
        fi
        ( cd crates/artscii-web && trunk build $profileArgs )
      '';
      installPhaseCommand = ''
        cp -r crates/artscii-web/dist $out
      '';

      meta = webMeta;
    }
  );
in
{
  inherit
    artscii
    artscii-web
    binName
    cargoArtifacts
    cliPackage
    commonArgs
    craneLib
    pinnedWasmBindgenCli
    version
    webPackage
    ;
}

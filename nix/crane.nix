# Shared Crane build context for every per-system output.
#
# This is a plain function rather than a flake-parts module so that the
# package, check, and dev-shell modules can each pull exactly the artifacts
# they need without going through `perSystem` module arguments.
{
  inputs,
  pkgs,
  lib,
  ...
}:
let
  root = ../.;

  rustToolchain = pkgs.rust-bin.fromRustupToolchainFile (root + "/rust-toolchain.toml");
  craneLib = (inputs.crane.mkLib pkgs).overrideToolchain rustToolchain;

  # Package metadata comes from the manifests so the flake never needs touching
  # on a version bump. Shared fields live in `[workspace.package]` (crates
  # inherit them with `version.workspace = true`, which TOML loads as
  # `{ workspace = true; }`), so they are read from the workspace table instead
  # of the per-crate ones; only per-crate fields such as `description` and the
  # `[[bin]]` name come from the individual manifests.
  workspacePackage = (lib.importTOML (root + "/Cargo.toml")).workspace.package;
  cargoToml = lib.importTOML (root + "/crates/artscii-cli/Cargo.toml");
  webCargoToml = lib.importTOML (root + "/crates/artscii-web/Cargo.toml");
  cliPackage = cargoToml.package;
  webPackage = webCargoToml.package;

  # The CLI crate builds a binary named `${binName}`, not the package name.
  binName = (builtins.head cargoToml.bin).name;
  # Every crate inherits these from `[workspace.package]`.
  version = workspacePackage.version;
  repository = workspacePackage.repository;

  cliMeta = {
    description = cliPackage.description;
    homepage = repository;
    license = lib.licenses.mit;
    mainProgram = binName;
    platforms = lib.platforms.unix;
  };

  webMeta = {
    description = webPackage.description;
    homepage = repository;
    license = lib.licenses.mit;
    platforms = lib.platforms.unix;
  };

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
    buildInputs = [ pkgs.ffmpeg ] ++ lib.optionals pkgs.stdenv.hostPlatform.isLinux [ pkgs.alsa-lib ];
    LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
  }
  // lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux {
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
      inherit version;
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
      inherit version;
      src = webSource;
      cargoArtifacts = webCargoArtifacts;
      CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
      wasm-bindgen-cli = pkgs.wasm-bindgen-cli_0_2_126;

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
    version
    webCargoArtifacts
    webPackage
    webSource
    ;
}

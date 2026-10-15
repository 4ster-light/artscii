{
  description = "✰ArtSCII✰ - ASCII art generator workspace";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    crane.url = "github:ipetkov/crane";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      crane,
      rust-overlay,
      ...
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);

      # Package metadata is sourced from the Cargo manifests so the flake does
      # not have to be touched on a version bump.
      cargoToml = builtins.fromTOML (builtins.readFile ./crates/artscii-cli/Cargo.toml);
      webCargoToml = builtins.fromTOML (builtins.readFile ./crates/artscii-web/Cargo.toml);
      cliPackage = cargoToml.package;
      webPackage = webCargoToml.package;

      # The CLI crate builds a binary named `${binName}`, not the package name.
      binName = (builtins.head cargoToml.bin).name;
      # All shipped crates are versioned in lockstep; the CLI is the source.
      version = cliPackage.version;
      repository = cliPackage.repository;

      # The `wasm-bindgen` CLI has to match the `wasm-bindgen` crate in
      # Cargo.lock exactly (js-sys pins it). Derive the version from the lock
      # file and keep the per-release hashes here; a version bump fails loudly
      # with a missing-attribute error until the hashes are refreshed.
      cargoLock = builtins.fromTOML (builtins.readFile ./Cargo.lock);
      wasm-bindgen-version =
        (builtins.head (builtins.filter (p: p.name == "wasm-bindgen") cargoLock.package)).version;

      wasm-bindgen-hashes = {
        "0.2.126" = {
          x86_64-linux = "064948d58e2d6c0a745216477a639ba696216d6309aaa902939d1b865b1d869d";
          aarch64-linux = "2245120254a9f6c9a9adf3601f3d52bb31309219e9ceab7696e74e24885c440a";
          x86_64-darwin = "6014dca993c8bf8a6ec10b6fccfbeabf599842d011f58a4abb7669afef784422";
          aarch64-darwin = "7df536babe345deb68828148dbdc71179118afdab42d83547c7cebfbf1426bd5";
        };
      };

      mkOutputs =
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ rust-overlay.overlays.default ];
          };
          inherit (pkgs) lib;

          rustToolchain = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;
          craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;

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

          # Upstream Trunk refuses to run with a mismatched wasm-bindgen CLI
          # (js-sys pins `wasm-bindgen = "=0.2.126"`). nixpkgs tracks its own
          # wasm-bindgen release, so fetch the exact one used by Cargo.lock.
          # Prebuilt, statically linked on Linux; no patching required.
          wasmBindgenTarget =
            {
              x86_64-linux = "x86_64-unknown-linux-musl";
              aarch64-linux = "aarch64-unknown-linux-musl";
              x86_64-darwin = "x86_64-apple-darwin";
              aarch64-darwin = "aarch64-apple-darwin";
            }
            .${system};

          wasmBindgenHash = wasm-bindgen-hashes.${wasm-bindgen-version}.${system};

          pinnedWasmBindgenCli = pkgs.stdenvNoCC.mkDerivation {
            pname = "wasm-bindgen-cli";
            version = wasm-bindgen-version;
            src = pkgs.fetchurl {
              url = "https://github.com/rustwasm/wasm-bindgen/releases/download/${wasm-bindgen-version}/wasm-bindgen-${wasm-bindgen-version}-${wasmBindgenTarget}.tar.gz";
              sha256 = wasmBindgenHash;
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
          };

          # Only the files cargo cares about, plus the assets the web build
          # needs. Avoids rebuilding the world when a README changes.
          webAssets = [
            "crates/artscii-web/index.html"
            "crates/artscii-web/style.css"
          ];

          cargoSource = craneLib.cleanCargoSource ./.;

          webSource = lib.cleanSourceWith {
            src = ./.;
            filter =
              path: type:
              (craneLib.filterCargoSources path type)
              || lib.any (asset: lib.hasSuffix asset (toString path)) webAssets;
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

              # The workspace root is a virtual manifest with no root package,
              # so Trunk has to be invoked from inside the web crate.
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

          checks = {
            inherit artscii;

            fmt = craneLib.cargoFmt {
              pname = "${binName}-fmt";
              inherit version;
              inherit (commonArgs) src;
            };

            clippy = craneLib.cargoClippy (
              commonArgs
              // {
                pname = "${binName}-clippy";
                inherit version;
                inherit cargoArtifacts;
                cargoExtraArgs = "--locked --workspace --exclude artscii-web";
                cargoClippyExtraArgs = "--all-targets -- --deny warnings";
              }
            );

            test = craneLib.cargoTest (
              commonArgs
              // {
                pname = "${binName}-test";
                inherit version;
                inherit cargoArtifacts;
                cargoExtraArgs = "--locked --workspace --exclude artscii-web";
              }
            );

            doc = craneLib.cargoDoc (
              commonArgs
              // {
                pname = "${binName}-doc";
                inherit version;
                inherit cargoArtifacts;
                cargoExtraArgs = "--locked --workspace --exclude artscii-web";
                RUSTDOCFLAGS = "--deny warnings";
              }
            );
          };

          devShell = craneLib.devShell {
            inherit checks;
            inputsFrom = [ artscii ];
            packages = with pkgs; [
              trunk
              pinnedWasmBindgenCli
              lld
              cargo-binstall
              wrangler
            ];
            LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
          };
        in
        {
          packages = {
            default = artscii;
            artscii = artscii;
            artscii-cli = artscii;
            artscii-web = artscii-web;
          };

          apps = {
            default = {
              type = "app";
              program = "${artscii}/bin/${binName}";
              meta.description = cliPackage.description;
            };
            artscii = {
              type = "app";
              program = "${artscii}/bin/${binName}";
              meta.description = cliPackage.description;
            };
            artscii-web = {
              type = "app";
              program = "${pkgs.writeShellScriptBin "artscii-web" ''
                exec ${pkgs.python3}/bin/python3 -m http.server --directory ${artscii-web} "''${1:-8080}"
              ''}/bin/artscii-web";
              meta.description = "Serve the ${webPackage.name} web app locally";
            };
          };

          inherit checks devShell;

          formatter = pkgs.nixfmt-tree;
        };
    in
    {
      packages = forAllSystems (system: (mkOutputs system).packages);
      apps = forAllSystems (system: (mkOutputs system).apps);
      checks = forAllSystems (system: (mkOutputs system).checks);
      devShells = forAllSystems (system: {
        default = (mkOutputs system).devShell;
      });
      formatter = forAllSystems (system: (mkOutputs system).formatter);

      # Consume the CLI as an overlay on any Nixpkgs instance.
      overlays.default = _final: prev: {
        artscii = self.packages.${prev.stdenv.hostPlatform.system}.artscii;
      };

      nixosModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        let
          cfg = config.programs.artscii;
        in
        {
          options.programs.artscii = {
            enable = lib.mkEnableOption "ArtSCII, an image and video to ASCII art converter";
            package = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.stdenv.hostPlatform.system}.artscii;
              defaultText = lib.literalExpression "artscii.packages.\${system}.artscii";
              description = "The ArtSCII package to install.";
            };
          };

          config = lib.mkIf cfg.enable {
            environment.systemPackages = [ cfg.package ];
          };
        };

      homeManagerModules.default =
        {
          config,
          lib,
          pkgs,
          ...
        }:
        let
          cfg = config.programs.artscii;
        in
        {
          options.programs.artscii = {
            enable = lib.mkEnableOption "ArtSCII, an image and video to ASCII art converter";
            package = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.stdenv.hostPlatform.system}.artscii;
              defaultText = lib.literalExpression "artscii.packages.\${system}.artscii";
              description = "The ArtSCII package to install.";
            };
          };

          config = lib.mkIf cfg.enable {
            home.packages = [ cfg.package ];
          };
        };
    };
}

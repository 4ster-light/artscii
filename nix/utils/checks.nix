{ inputs, ... }:
{
  perSystem =
    {
      pkgs,
      lib,
      system,
      ...
    }:
    let
      crane = import ../crane.nix {
        inherit
          inputs
          pkgs
          lib
          system
          ;
      };
      inherit (crane)
        artscii
        artscii-web
        binName
        cargoArtifacts
        commonArgs
        version
        webCargoArtifacts
        webPackage
        webSource
        ;
    in
    {
      # Every check here is built by `nix flake check`, so CI and the local
      # workflow can never drift apart.
      checks = {
        # Building the CLI is itself a check: it also exercises the release
        # build (video feature included).
        inherit artscii;

        fmt = crane.craneLib.cargoFmt {
          pname = "${binName}-fmt";
          inherit version;
          inherit (commonArgs) src;
        };

        clippy = crane.craneLib.cargoClippy (
          commonArgs
          // {
            pname = "${binName}-clippy";
            inherit version;
            inherit cargoArtifacts;
            cargoExtraArgs = "--locked --workspace --exclude artscii-web";
            cargoClippyExtraArgs = "--all-targets -- --deny warnings";
          }
        );

        test = crane.craneLib.cargoTest (
          commonArgs
          // {
            pname = "${binName}-test";
            inherit version;
            inherit cargoArtifacts;
            cargoExtraArgs = "--locked --workspace --exclude artscii-web";
          }
        );

        doc = crane.craneLib.cargoDoc (
          commonArgs
          // {
            pname = "${binName}-doc";
            inherit version;
            inherit cargoArtifacts;
            cargoExtraArgs = "--locked --workspace --exclude artscii-web";
            RUSTDOCFLAGS = "--deny warnings";
          }
        );

        # artscii-web is excluded above because it only builds for wasm, so it
        # gets its own clippy run on the wasm target plus a full Trunk build.
        web-clippy = crane.craneLib.cargoClippy (
          commonArgs
          // {
            pname = "${webPackage.name}-clippy";
            version = webPackage.version;
            src = webSource;
            cargoArtifacts = webCargoArtifacts;
            CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
            cargoExtraArgs = "--locked -p ${webPackage.name}";
            cargoClippyExtraArgs = "--all-targets -- --deny warnings";
          }
        );

        web-build = artscii-web;
      };
    };
}

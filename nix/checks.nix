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
      crane = import ./crane.nix {
        inherit
          inputs
          pkgs
          lib
          system
          ;
      };
      inherit (crane)
        artscii
        binName
        cargoArtifacts
        commonArgs
        version
        ;
    in
    {
      checks = {
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
      };
    };
}

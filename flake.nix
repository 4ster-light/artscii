{
  description = "✰ArtSCII✰ - ASCII art generator";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        artscii = pkgs.rustPlatform.buildRustPackage {
          pname = "artscii";
          version = "1.0.0";
          src = ./.;
          cargoLock = {
            lockFile = ./Cargo.lock;
          };
          doCheck = false;
          meta = with pkgs.lib; {
            description = "Convert any image to ASCII art";
            homepage = "https://github.com/4ster-light/artscii";
            license = licenses.mit;
            mainProgram = "artscii";
          };
        };
      in
      {
        packages.default = artscii;
        packages.artscii = artscii;

        apps.default = flake-utils.lib.mkApp {
          drv = artscii;
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ cargo rustc rustfmt clippy ];
        };
      }
    );
}

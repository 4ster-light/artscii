{
  description = "✰ArtSCII✰ - ASCII art generator workspace";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    crane.url = "github:ipetkov/crane";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    let
      findModules =
        dir:
        let
          entries = builtins.readDir dir;
        in
        builtins.concatLists (
          map (
            name:
            let
              path = dir + "/${name}";
            in
            if entries.${name} == "directory" then
              findModules path
            else if entries.${name} == "regular" && builtins.match ".*\\.nix$" name != null then
              [ path ]
            else
              [ ]
          ) (builtins.attrNames entries)
        );
    in
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      imports = findModules ./nix/utils ++ findModules ./nix/modules;

      perSystem = { system, ... }: {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.rust-overlay.overlays.default ];
        };
      };
    };
}

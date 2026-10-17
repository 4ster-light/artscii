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
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      imports = [
        ./nix/packages.nix
        ./nix/checks.nix
        ./nix/devshell.nix
        ./nix/formatter.nix
        ./nix/modules/nixos.nix
        ./nix/modules/home-manager.nix
        ./nix/modules/overlay.nix
      ];

      # Every per-system output needs pkgs built with the pinned Rust toolchain
      # overlay, so override flake-parts' default `pkgs`.
      perSystem = { system, ... }: {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.rust-overlay.overlays.default ];
        };
      };
    };
}

# NixOS module: `programs.artscii.enable` installs the CLI system-wide.
{ self, ... }:
{
  flake.nixosModules.default =
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
}

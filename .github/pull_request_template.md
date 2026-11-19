# Pull Request

## Description

Please include a summary of the changes and the related issue. Explain the
motivation behind this PR and how it addresses the problem.

Fixes #(issue number)

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
        change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Packaging change (spec, Containerfile, workflows, `install.sh`)

## Scope

Which parts of the workspace does this touch?

- [ ] `artscii-core`
- [ ] `artscii-img`
- [ ] `artscii-video`
- [ ] `artscii-cli`
- [ ] `artscii-web`
- [ ] Nix flake
- [ ] Packaging
- [ ] Documentation

## How Has This Been Tested?

Describe the tests that you ran to verify your changes. If you touched the web
crate, note that `nix flake check` also builds it for the wasm target.

- [ ] Unit tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] The PR title is a conventional commit (`feat(video):`, `fix(cli):`, `docs:`, ...)
- [ ] The branch follows `<label>/<title>` naming
- [ ] `nix flake check` passes locally
- [ ] `nix fmt -- --ci` passes locally
- [ ] Documentation has been updated where behaviour or structure changed
- [ ] No new clippy warnings (`-D warnings` gate)

## Screenshots (if applicable)

For visual changes, add terminal screenshots or rendered HTML/GIF output here.

## Additional Context

Add any other context about the PR here.

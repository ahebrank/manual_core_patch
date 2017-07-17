# Manual Core Patch

This addresses a very specific problem when maintaining D8 sites in a particular
way for deployment on Pantheon. It grabs composer patches applied to core and manually applies them against the Pantheon repo (which is downstream from e.g., the Pantheon drop8 repo).

## Usage:

`manual_core_patch --root=/tmp/build`

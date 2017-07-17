#!/usr/bin/env node

const exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var wget = require('wget');
var fs = require('fs');
var tmp = require('tmp');

if ('src_root' in argv) {
  var src_root = argv.src_root;
} else {
  throw new Error('Need project source root --src_root specified (directory with project composer.json).');
}
if ('apply_root' in argv) {
  var apply_root = argv.apply_root;
} else {
  throw new Error('Need project apply webroot --apply_root specified (directory with project composer.json).');
}

function findCorePatches(json) {
  if ('extra' in json && 'patches' in json.extra && 'drupal/core' in json.extra.patches) {
    return (json.extra.patches['drupal/core']);
  }
  return false;
}

function applyPatch(patch_fn) {
  var cmd = 'patch -p1 < ' + patch_fn;
  exec(cmd, { cwd: apply_root }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

var composer_fn = src_root + '/composer.json';
var json = JSON.parse(fs.readFileSync(composer_fn, 'utf8'));
var core_patches = findCorePatches(json);
var patch, output;
if (core_patches) {
  for (var key in core_patches) {
    console.log('applying core patch: ' + key);
    patch = core_patches[key];
    if (patch.startsWith('http')) {
      output = tmp.tmpNameSync();
      wget.download(patch, output)
        .on('end', function(patch) {
          applyPatch(patch);
        });
    }
    else {
      applyPatch(patch)
    }
  }
}

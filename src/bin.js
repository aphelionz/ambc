#!/usr/bin/env node

const fs = require('fs')
const js2amb = require('js2amb')
const mime = require('mime-types')
const argv = require('yargs')
  .usage('$0 file [-o output]')
  .argv

const { parse, irParser } = require('./index')

// Register new MIME type for .ambient files
mime.extensions['text/ambients'] = ['ambient']
mime.types.ambient = 'text/ambients'

const filename = argv._[0]
let results, ambient

const output = (ambient, argv) => {
  if (argv.intermediate) return irParser.parse(ambient)
  return parse(ambient)
}

switch (mime.lookup(filename)) {
  case 'application/javascript':
    var js = fs.readFileSync(filename).toString().trim()
    ambient = js2amb(js)
    results = output(ambient, argv)
    break
  case 'text/ambients':
    ambient = fs.readFileSync(filename).toString().trim()
    results = output(ambient, argv)
    break
  default:
    throw new Error('File type not recognized')
}

process.stdout.write(JSON.stringify(results, null, 2))

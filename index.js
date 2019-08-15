const tiles2mbtiles = require('./lib/tiles-to-mbtiles');

const program = require('commander');

program
  .arguments('<file>')
  .option('--url-pattern <pattern>', 'format of the tile URL eq. https://example.com/tile/{z}/{x}/{y}.pbf')
  .option('--minzoom <number>', 'minimal zoom', parseInt, 0)
  .option('--maxzoom <number>', 'maximal zoom', parseInt, 14);

program.parse(process.argv);

const opts = {
  minzoom: program.minzoom,
  maxzoom: program.maxzoom,
  urlPattern: program.urlPattern,
  file: program.args[0]
};

if (!opts.urlPattern || !opts.file) {
  program.help();
  process.exit(1);
}

tiles2mbtiles(opts, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.error('Done!');
  }
});

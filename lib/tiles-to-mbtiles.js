const { waterfall } = require('async');
const MBTiles = require('@mapbox/mbtiles');
const getlet = require('getlet');
const concatStream = require('concat-stream');
const { RateLimiter } = require('limiter');
const debug = require('debug')('tiles-to-mbtiles');

const exhaustGenerator = require('./exhaust-generator');

const RATE_PER_SECOND = 20;

const limiter = new RateLimiter(RATE_PER_SECOND, 'second');

module.exports = tiles2mbtiles;

function fetchTile(url, fn) {
  limiter.removeTokens(1, err => {
    if (err) {
      fn(err);
    }
    const destination = concatStream({
      encoding: 'buffer'
    }, data => fn(null, data));

    getlet(url).inflate(false).pipe(destination);
  });
}

function* tiles(minzoom, maxzoom) {
  let maxTile = 2 ** minzoom;

  for(let z = minzoom; z <= maxzoom; z++) {

    for(let x = 0; x < maxTile; x++) {
      for(let y = 0; y < maxTile; y++) {
        yield [z, x, y];
      }
    }

    maxTile = 2 * maxTile;
  }

}

function tiles2mbtiles({
  name = 'mbtiles',
  file,
  minzoom,
  maxzoom,
  urlPattern
}, fn) {

  debug('Run', minzoom, maxzoom);
  waterfall([create, start, generate, metadata, close], fn);

  function create(fn) {
    debug('Create...');
    new MBTiles(`${file}?mode=rwc`, fn);
  }

  function start(mbtiles, fn) {
    debug('Start...');
    mbtiles.startWriting(err => fn(err, mbtiles));
  }

  function generate(mbtiles, fn) {
    debug('Generate...');
    exhaustGenerator(
      tiles(minzoom, maxzoom),
      (tile, fn) => processTile(tile, mbtiles, fn),
      3,
      err => fn(err, mbtiles)
    );
  }

  function metadata(mbtiles, fn) {
    debug('Metadata...');
    const info = {
      name,
      format:"pbf",
      version: 2,
      minzoom,
      maxzoom,
      center: '0,0,1',
      bounds: '-180.000000,-85.051129,180.000000,85.051129',
      type: 'overlay'
    };

    mbtiles.putInfo(info, err => fn(err, mbtiles));
  }

  function close(mbtiles, fn) {
    debug('Close...');
    mbtiles.stopWriting(fn);
  }

  function processTile([z, x, y], mbtiles, fn) {
    const url = createUrl(z, x, y);
    fetchTile(url, (err, buffer) => {
      if (err) {
        return fn(err);
      }
      mbtiles.putTile(z, x, y, buffer, fn);
    });
  }

  function createUrl(z, x, y) {
    return urlPattern
      .replace('{z}', z)
      .replace('{y}', y)
      .replace('{x}', x);
  }
}

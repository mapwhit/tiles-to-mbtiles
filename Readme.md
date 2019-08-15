[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

# tiles-to-mbtiles

Create MBTiles file from tiles retrieved from tiles server. 

## Install

```sh
$ npm -g install tiles-to-mbtiles
```

## Usage

```
Usage: tiles-to-mbtiles [options] <file>

Options:
  --url-pattern <pattern>  format of the tile URL eq. https://example.com/tile/{z}/{x}/{y}.pbf
  --minzoom <number>       minimal zoom (default: 0)
  --maxzoom <number>       maximal zoom (default: 14)
  -h, --help               output usage information
```

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/tiles-to-mbtiles.svg
[npm-url]: https://npmjs.org/package/tiles-to-mbtiles

[travis-url]: https://travis-ci.org/mapwhit/tiles-to-mbtiles
[travis-image]: https://img.shields.io/travis/mapwhit/tiles-to-mbtiles.svg

[deps-image]: https://img.shields.io/david/mapwhit/tiles-to-mbtiles.svg
[deps-url]: https://david-dm.org/mapwhit/tiles-to-mbtiles

[deps-dev-image]: https://img.shields.io/david/dev/mapwhit/tiles-to-mbtiles.svg
[deps-dev-url]: https://david-dm.org/mapwhit/tiles-to-mbtiles?type=dev

# Envelope [![build status](https://secure.travis-ci.org/jhermsmeier/node-envelope.png)](http://travis-ci.org/jhermsmeier/node-envelope) [![NPM version](https://badge.fury.io/js/envelope.png)](https://npmjs.org/envelope)

## Install with [npm](https://npmjs.org)

```sh
$ npm install envelope
```


## Benchmarks

```
                      Envelope (current)
       8,271,292 op/s » Ctor
           6,653 op/s » Ctor.parse( string ) [3KB]
           7,032 op/s » Ctor.parse( buffer ) [3KB]
           1,446 op/s » Ctor.parse( buffer ) [11KB]
             426 op/s » Ctor.parse( buffer ) [266KB]
          10,360 op/s » Ctor.parse( buffer ) [chinese, 5KB]
          23,321 op/s » Header.parse( buffer ) [3KB]
           6,954 op/s » Part.parse( buffer ) [3KB]
           9,620 op/s » Part.parse( buffer ) [chinese, 5KB]

                      Envelope
          84,109 op/s » toString

                      Header
          86,523 op/s » toString

                      Body
          86,120 op/s » toString

                      set header
       2,331,577 op/s » setHeader(), cardinality 1
       2,384,882 op/s » header.set, cardinality 1
       2,561,868 op/s » setHeader(), cardinality *
       2,384,662 op/s » header.set, cardinality *

                      get header
         168,478 op/s » getHeader(), cardinality 1
         169,161 op/s » header.get, cardinality 1
          59,157 op/s » getHeader(), cardinality *
          59,995 op/s » header.get, cardinality *
         167,563 op/s » getHeader(), cardinality 1
         167,293 op/s » header.get, cardinality 1


  Suites:  6
  Benches: 22
  Elapsed: 18,807.04 ms
```

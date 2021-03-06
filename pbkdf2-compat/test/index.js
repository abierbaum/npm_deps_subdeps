var assert = require('assert')
var compat = require('../')

var fixtures = require('./fixtures')

// SHA-1 vectors generated by Node.js
// SHA-256/SHA-512 test vectors from:
// https://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors
// https://stackoverflow.com/questions/15593184/pbkdf2-hmac-sha-512-test-vectors

describe('pbkdf2-compat', function() {
  describe('pbkdf2', function() {
    ;['sha1', 'sha256', 'sha512'].forEach(function(algorithm) {
      describe(algorithm, function() {
        fixtures.valid.forEach(function(f, i) {
          var expected = f.results[algorithm]

          it('Async test case ' + i + ' for ' + algorithm + ' matches ' + expected, function(done) {
            compat.pbkdf2(f.key, f.salt, f.iterations, f.dkLen, algorithm, function(err, result) {
              assert.equal(result.toString('hex'), expected)

              done()
            })
          })
        })

        fixtures.invalid.forEach(function(f) {
          it('should throw ' + f.exception, function(done) {
            compat.pbkdf2(f.key, f.salt, f.iterations, f.dkLen, f.algo, function(err) {
              assert(new RegExp(f.exception).test(err))

              done()
            })
          })
        })
      })
    })

    it('should throw if no callback is provided', function() {
      assert.throws(function() {
        compat.pbkdf2('password', 'salt', 1, 32, 'sha1')
      }, /No callback provided to pbkdf2/)
    })
  })

  describe('pbkdf2Sync', function() {
    it('defaults to sha1', function() {
      var result = compat.pbkdf2Sync('password', 'salt', 1, 32)

      assert.equal(result.toString('hex'), "0c60c80f961f0e71f3a9b524af6012062fe037a6e0f0eb94fe8fc46bdc637164")
    })

    ;['sha1', 'sha256', 'sha512'].forEach(function(algorithm) {
      describe(algorithm, function() {
        fixtures.valid.forEach(function(f, i) {
          var expected = f.results[algorithm]

          it('Test case ' + i + ' for ' + algorithm + ' matches ' + expected, function() {
            var result = compat.pbkdf2Sync(f.key, f.salt, f.iterations, f.dkLen, algorithm)

            assert.equal(result.toString('hex'), expected)
          })
        })

        fixtures.invalid.forEach(function(f) {
          it('should throw ' + f.exception, function() {
            assert.throws(function() {
              compat.pbkdf2Sync(f.key, f.salt, f.iterations, f.dkLen, f.algo)
            }, new RegExp(f.exception))
          })
        })
      })
    })
  })
})

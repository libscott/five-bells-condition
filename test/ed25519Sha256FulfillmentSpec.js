const assert = require('chai').assert
const crypto = require('crypto')
const condition = require('..')

describe('Ed25519Sha256Fulfillment', function () {
  testFromParams(
    {
      key: new Buffer(32).fill(0),
      message: new Buffer(0)
    },
    'cf:1:8:IDtqJ7zOtqQtYqOo0CpvDXNlMhV3HeJDpjrASKGLWdopAAAAQI-JWzyv4slQYDnQ4qZjglaABGdP6NI3eFCS5A1qr0g-T8YBaHBfMfEBWWE4ziGqNXwNMqBk9CPcPuSqOr9T-AM',
    'cc:1:8:u2jW_RTeObJa4TXJ496r6VB6wIXQE9tRNVW9Sf6GlUk:69'
  )

  testFromParams(
    {
      key: new Buffer(32).fill(0xff),
      message: new Buffer('616263', 'hex')
    },
    'cf:1:8:IHahWSBEpuT1ESZbynOmBNkLBSnR32Ar4woZqSV2YNH1AAADYWJjQK7Gq2qRIq_w99y5Zn_2ExNolHMrbnjCb1tnMQHiZ_4uK2X6TVPa1HihraZNUP0d_bfZSSDcPhpWSmR7HLo1YAE',
    'cc:1:8:QHKOUXldb8imZzT75Fgdfk9mQ0GgioFypACmPZO-ecM:69'
  )

  testFromParams(
    {
      key: crypto.createHash('sha256').update('example').digest(),
      message: new Buffer(512).fill(0x21)
    },
    'cf:1:8:IEQpkwZQBKoeTEj03QFYGUwCNJvMZkzZbkAOommRio1RAACABCEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhQJ9NvOCWyjlSjeLY7ZZU_ppsfV3PmTQfkMvKWLNN4vlQLRVKm1Q3hUKSG1vDHcHTSkJ5Y3LUfvyuro5NfOiT4Qc',
    'cc:1:8:qUVj8cllqHF1P2nGac1RHbYQwB9ml6SsVa0F-V5WZA4:69'
  )

  function testFromParams (params, fulfillmentUri, conditionUri) {
    describe('key ' + params.key.toString('hex'), function () {
      it('generates correct fulfillment uri', function () {
        const f = new condition.Ed25519Sha256Fulfillment()
        f.setMessage(params.message)
        f.sign(params.key)
        const uri = f.serializeUri()

        assert.equal(uri, fulfillmentUri)
      })

      it('generates correct condition uri', function () {
        const f = new condition.Ed25519Sha256Fulfillment()
        f.setMessage(params.message)
        f.sign(params.key)
        const uri = f.getCondition().serializeUri()

        assert.equal(uri, conditionUri)
      })

      it('parsing fulfillment generates condition', function () {
        const f = condition.fromFulfillmentUri(fulfillmentUri)
        const uri = f.getCondition().serializeUri()

        assert.equal(uri, conditionUri)
      })

      it('parsed condition matches generated condition', function () {
        const f = new condition.Ed25519Sha256Fulfillment()
        f.setMessage(params.message)
        f.sign(params.key)
        const generatedCondition = f.getCondition()
        const parsedCondition = condition.fromConditionUri(conditionUri)

        assert.deepEqual(generatedCondition, parsedCondition)
      })
    })
  }
})
const
    expect = require('chai').expect,
    mighty = require('../mighty')

describe('Mighty JS', () => {

    describe('morph', () => {

        it('should morph keys', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .morph('_id', 'id')
                .result

            expect(obj).to.not.have.property('_id')

            expect(obj).to.have.property('id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should morph nested keys', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test',
                some: { nested: { property: [1, 2, 3, 4, 5 ] } }
            }

            mighty(obj)
                .morph('_id', 'id')
                .morph('some.nested.property', 'nested.array')
                .result

            expect(obj).to.not.have.property('_id')
            expect(obj).to.not.have.property('some')

            expect(obj).to.have.property('id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            expect(obj).to.have.property('nested')
            expect(obj.nested).to.have.property('array').and.to.deep.equal([ 1, 2, 3, 4, 5 ])

            done()
        })

        it('should clone & morph keys', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test',
                some: { nested: { property: [1, 2, 3, 4, 5 ] } }
            }

            const cloned = mighty(obj, { clone: true })
                .morph('_id', 'id')
                .morph('some.nested.property', 'nested.array')
                .result

            expect(obj).to.deep.equal(obj)

            expect(cloned).to.have.property('id').and.to.equal(obj._id)
            expect(cloned).to.have.property('name').and.to.equal(obj.name)

            expect(cloned).to.have.property('nested')
            expect(cloned.nested).to.have.property('array').and.to.deep.equal(obj.some.nested.property)

            done()
        })
    })

    describe('coerce', () => {
        it('should coerce to string', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .coerce('_id', 'string')
                .result

            expect(obj).to.have.property('_id').and.to.equal('12345')
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should coerce to number', (done) => {
            const obj = { _id: '12345', name: 'Test' }

            mighty(obj)
                .coerce('_id', 'number')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should morph and coerce to string', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .morph('_id', 'id').coerce('string')
                .result

            expect(obj).to.have.property('id').and.to.equal('12345')
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should morph and coerce to number', (done) => {
            const obj = { _id: '12345', name: 'Test' }

            mighty(obj)
                .morph('_id', 'id').coerce('number')
                .result

            expect(obj).to.have.property('id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })
    })

    describe('add', () => {
        it('should add a new key/value pair', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .add('key', 'value')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')
            expect(obj).to.have.property('key').and.to.equal('value')

            done()
        })

        it('should add a new key with default value', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .add('key')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')
            expect(obj).to.have.property('key')

            done()
        })
    })

    describe('remove', function () {
        it('should remove key', (done) => {
            const obj = { _id: 12345, name: 'Test' }

            mighty(obj)
                .remove('name')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.not.have.property('name')

            done()
        })

        it('should remove a nested key', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test',
                some: { nested: { property: [ 1, 2, 3, 4, 5 ] } }
            }

            mighty(obj)
                .remove('some.nested.property')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')
            expect(obj).to.have.property('some')
            expect(obj.some).to.have.property('nested')
            expect(obj.some.nested).to.not.have.property('property')

            done()
        })
    })
})

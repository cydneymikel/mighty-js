const
    expect = require('chai').expect,
    mighty = require('../mighty')

describe('Mighty JS', () => {

    describe('morph', () => {
        it('should morph keys', (done) => {
            const obj = {
                _id: '4',
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                city: 'Angel Grove',
                state: 'California'
            }

            mighty(obj)
                .morph('transforms', 'zord')
                .morph('city', 'location.city')
                .morph('state', 'location.state')
                .result

            expect(obj).to.not.have.property('transforms')
            expect(obj).to.not.have.property('city')
            expect(obj).to.not.have.property('state')

            expect(obj).to.have.property('zord').and.to.equal('pterodactyl dinozord')
            expect(obj).to.have.property('location')
            expect(obj.location).to.have.property('city').and.to.equal('Angel Grove')
            expect(obj.location).to.have.property('state').and.to.equal('California')

            done()
        })

        it('should morph nested keys', (done) => {
            const obj = {
                _id: '4',
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
            .morph('location.state', 'state')
            .morph('location.city', 'city')
            .result

            expect(obj).to.not.have.property('location')
            expect(obj).to.have.property('state').and.to.equal('California')
            expect(obj).to.have.property('city').and.to.equal('Angel Grove')

            done()
        })

        it('should clone & morph keys', (done) => {
            const obj = {
                _id: '4',
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: { name: 'Angel Grove', coordinates: ['34.0522 N', '118.2437 W'] },
                    state: 'California'
                }
            }

            const cloned = mighty(obj, { clone: true })
                .morph('location.city.coordinates', 'location.coordinates')
                .morph('location.city.name', 'location.city')
                .result

            expect(obj).to.deep.equal(obj)

            expect(cloned).to.have.property('location')
            expect(cloned.location).to.have.property('coordinates').and.to.deep.equal(['34.0522 N', '118.2437 W'])
            expect(cloned.location).to.have.property('city').and.to.equal('Angel Grove')

            done()
        })
    })

    describe.skip('coerce', () => {
        it('should coerce to string', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test'
            }

            mighty(obj)
                .coerce('_id', 'string')
                .result

            expect(obj).to.have.property('_id').and.to.equal('12345')
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should coerce to number', (done) => {
            const obj = {
                _id: '12345',
                name: 'Test'
            }

            mighty(obj)
                .coerce('_id', 'number')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should morph and coerce to string', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test'
            }

            mighty(obj)
                .morph('_id', 'id').coerce('string')
                .result

            expect(obj).to.have.property('id').and.to.equal('12345')
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })

        it('should morph and coerce to number', (done) => {
            const obj = {
                _id: '12345',
                name: 'Test'
            }

            mighty(obj)
                .morph('_id', 'id').coerce('number')
                .result

            expect(obj).to.have.property('id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')

            done()
        })
    })

    describe.skip('add', () => {
        it('should add a new key/value pair', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test'
            }

            mighty(obj)
                .add('key', 'value')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')
            expect(obj).to.have.property('key').and.to.equal('value')

            done()
        })

        it('should add a new key with default value', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test'
            }

            mighty(obj)
                .add('key')
                .result

            expect(obj).to.have.property('_id').and.to.equal(12345)
            expect(obj).to.have.property('name').and.to.equal('Test')
            expect(obj).to.have.property('key')

            done()
        })
    })

    describe.skip('remove', function () {
        it('should remove key', (done) => {
            const obj = {
                _id: 12345,
                name: 'Test'
            }

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
                some: {
                    nested: {
                        property: [1, 2, 3, 4, 5]
                    }
                }
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
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

    describe('combine', () => {
        it('should combine keys into destination key', (done) => {
            const obj = {
                _id: '4',
                first: 'Kim',
                last: 'Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                },
                coordinates: ['34.0522 N', '118.2437 W'],
                zip: 94115
            }

            mighty(obj)
                .combine(['zip', 'location', 'coordinates'], 'hometown')
                .result

            expect(obj).to.not.have.property('location')
            expect(obj).to.not.have.property('coordinates')

            expect(obj).to.have.property('hometown')
            expect(obj.hometown).to.have.property('city')
            expect(obj.hometown).to.have.property('state')
            expect(obj.hometown).to.have.property('coordinates')

            done()
        })

        it('should combine keys and nested keys into destination', (done) => {
            const obj = {
                _id: '4',
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove'
                },
                state: 'California'
            }

            mighty(obj)
                .combine(['location.city', 'state'], 'hometown')
                .result

            expect(obj).to.not.have.property('location')
            expect(obj).to.not.have.property('state')

            expect(obj).to.have.property('hometown')
            expect(obj.hometown).to.have.property('city')
            expect(obj.hometown).to.have.property('state')

            done()
        })
    })

    describe('coerce', () => {
        it('should coerce to string', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .coerce('_id', 'string')
                .result

            expect(obj).to.have.property('_id').and.to.equal('4')

            done()
        })

        it('should coerce to number', (done) => {
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
                .coerce('_id', 'number')
                .result

            expect(obj).to.have.property('_id').and.to.equal(4)

            done()
        })

        it('should morph and coerce to string', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .morph('_id', 'id').coerce('string')
                .result

            expect(obj).to.have.property('id').and.to.equal('4')

            done()
        })

        it('should morph and coerce to number', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .morph('_id', 'id').coerce('number')
                .result

            expect(obj).to.have.property('id').and.to.equal(4)

            done()
        })
    })

    describe('add', () => {
        it('should add a new key/value pair', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .add('location.coordinates', ['34.0522 N', '118.2437 W'])
                .result

            expect(obj.location).to.have.property('coordinates').and.to.deep.equal(['34.0522 N', '118.2437 W'])
            expect(obj.location).to.have.property('city').and.to.deep.equal('Angel Grove')
            expect(obj.location).to.have.property('state').and.to.deep.equal('California')

            done()
        })

        it('should add a new key with default value', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .add('location.coordinates')
                .result

            expect(obj.location).to.have.property('coordinates')
            expect(obj.location).to.have.property('city').and.to.deep.equal('Angel Grove')
            expect(obj.location).to.have.property('state').and.to.deep.equal('California')

            done()
        })
    })

    describe('remove', function () {
        it('should remove key', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California'
                }
            }

            mighty(obj)
                .remove('ranger')
                .result

            expect(obj).to.not.have.property('ranger')

            done()
        })

        it('should remove a nested key', (done) => {
            const obj = {
                _id: 4,
                name: 'Kim Hart',
                ranger: 'Pink',
                transforms: 'pterodactyl dinozord',
                location: {
                    city: 'Angel Grove',
                    state: 'California',
                    coordinates: ['34.0522 N', '118.2437 W']
                }
            }

            mighty(obj)
                .remove('location.coordinates')
                .result


            expect(obj.location).to.not.have.property('coordinates')
            expect(obj.location).to.have.property('city').and.to.deep.equal('Angel Grove')
            expect(obj.location).to.have.property('state').and.to.deep.equal('California')

            done()
        })
    })
})
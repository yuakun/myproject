// 1
const EVMRevert = require('openzeppelin-solidity/test/helpers/EVMRevert')
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent')

// 2
const BigNumber = web3.BigNumber

// 3
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

const RoomFactory = artifacts.require('./RoomFactory.sol')

// 4
contract('RoomFactory',
            ([factoryOwner, roomOwner1, roomOwner2, roomOwner3, ...accounts]) => {
    describe('as an instance', () => {
        // 5
        beforeEach(async function () {
            this.roomFactory = await RoomFactory.new({ from: factoryOwner})
        })

        // 6
        it('should exist', function() {
            this.roomFactory.should.exist
        })

        describe('createRoom', () => {
            const amount = web3.toWei('1','ether')

            // 7
            it('should create a room', async function(){
                const { logs } = 
                    await this.roomFactory.createRoom({ from: roomOwner1, value: amount })
                const event = await expectEvent.inLogs(logs, 'RoomCreated')

                const factoryBalance = await web3.eth.getBalance(this.roomFactory.address)
                const roomBalance= await web3.eth.getBalance(event.args._room)

                factoryBalance.should.be.bignumber.equal(0)
                roomBalance.should.be.bignumber.equal(amount)
            })

            // 8
            it('only the factory owner can pause createRoom', async function(){
                await this.roomFactory.pause({ from: roomOwner1 })
                    .should.be.rejectedWith(EVMRevert)
                await this.roomFactory.pause({ from: factoryOwner })
                    .should.be.fulfilled
            })
        })
    })
})
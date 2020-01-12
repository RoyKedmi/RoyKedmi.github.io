
export default class PsuedoRandomGenerator {
    constructor(seed) {
        this.m_w = 123456789;
        this.m_z = 987654321;
        this.mask = 0xffffffff;

        this.setRandomSeed(seed);
    }

    setRandomSeed(seed) {
        this.m_w = seed;
        this.m_z = 987654321;
    }

    getRandomNumFromSeed() {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
        var result = ((this.m_z << 16) + this.m_w) & this.mask;
        result /= 4294967296;

        return result + 0.5;
    }

    getRandomIntInRange(min, max) {
        return Math.floor(min + (this.getRandomNumFromSeed() * (max - min + 1)))
    }

    getRandomFloatInRange(min, max) {
        return min + (this.getRandomNumFromSeed() * (max - min))
    }
}

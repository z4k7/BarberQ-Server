import bcrypt from 'bcrypt'
import IHashPassword from '../../usecase/interface/hashPasswordInterface'

class Encrypt implements IHashPassword{
    async  createHash(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    }
    
     async compare(password: string, hashedPassword: string): Promise<boolean> {
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        return passwordMatch
    }
}

export default Encrypt
import { ID } from "../../infrastructure/database/common"

interface Ijwt{
    generateAccessToken(id: ID): string
    generateRefreshToken(id: ID): string
}

export default Ijwt
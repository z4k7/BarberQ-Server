interface InodeMailer{
    sendVerificationMail(email: string, verif_code: string): Promise<void>
}
export default InodeMailer